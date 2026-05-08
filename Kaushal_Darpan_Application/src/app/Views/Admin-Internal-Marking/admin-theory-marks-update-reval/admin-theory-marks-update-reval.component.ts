import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Common/common';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CopyCheckerRequestModel } from '../../../Models/CopyCheckerRequestModel';
import { ExaminerCodeLoginModel, DDL_GroupCode_ExaminerWise } from '../../../Models/ExaminerCodeLoginModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { TheoryMarksSearchModel, TheoryMarksDataModels, ExaminerFeedbackDataModel } from '../../../Models/TheoryMarksDataModels';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { TheoryMarksRevalService } from '../../../Services/TheoryMarksReval/theory-marks-reval.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-admin-theory-marks-update-reval',
  standalone: false,
  templateUrl: './admin-theory-marks-update-reval.component.html',
  styleUrl: './admin-theory-marks-update-reval.component.css'
})

export class AdminTheoryMarksUpdateRevalComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public SemesterMasterList: any = [];
  public isfinalsubmit: boolean = false
  public Branchlist: any = [];
  /*public TheoryMarksList: any = [];*/
  public UserID: number = 0;
  searchText: string = '';
  public Table_SearchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public IsConfirmed: boolean = false;
  public tbl_txtSearch: string = '';
  public isModalOpen = false;
  isListVisible: boolean = false;
  modalReference: NgbModalRef | undefined;
  /*request = new TheoryMarksDataModels()*/
  public searchRequest = new TheoryMarksSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public TheoryMarksDetailList: TheoryMarksDataModels[] = []
  public TheoryMarksDashBoardCount: any[] = []
  public IsCountShow: boolean = true
  public copyCheckerRequest = new CopyCheckerRequestModel();
  public perfactStudents: any = [];
  public ExaminerCodeLoginForm!: FormGroup;
  public examinerCodeLoginModel = new ExaminerCodeLoginModel();
  public requestGroupCode = new DDL_GroupCode_ExaminerWise();
  public feedbackRequest = new ExaminerFeedbackDataModel();
  public GroupCodeList: any = []
  public isAnyUFMSelected: boolean = false
  public file!: File;
  public ExaminerCode: string = ''
  public Feedback: string = ''
  @ViewChild('MyModel_ExaminerCodeLogin') MyModel_ExaminerCodeLogin: ElementRef | any;
  @ViewChild('MyModel_FeedbackForm') MyModel_FeedbackForm: ElementRef | any;
  @ViewChildren('markInput') markInputs!: QueryList<ElementRef>;

  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public closeResult: string | undefined;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private theoryMarksRevalService: TheoryMarksRevalService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: ActivatedRoute,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    //debugger
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetTheoryMarksDetailList();
  }

  async openOTP(StudentExamPaperMarksID: number = 0) {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    await this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(async () => {
      console.log("otp verified on the page")

      await this.OnSubmit(StudentExamPaperMarksID);
    })
  }

  async SubmitAllOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    await this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(async () => {
      await this.OnSubmit();
    })
  }

  //
  async GetTheoryMarksDetailList() {
    try {
      this.AllInTableSelect = false;
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.IsConfirmed = this.IsConfirmed = true;
      //debugger
      //call
      await this.theoryMarksRevalService.GetTheoryMarks_Admin(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TheoryMarksDetailList = data['Data'];

          //console.log("TheoryMarksDetailList", this.TheoryMarksDetailList);

          this.TheoryMarksDetailList.forEach(x => {
            if (x.IsChecked == false) {
              x.IsPresentTheory = 1
            }
          })

          var isfinalsubmit = this.TheoryMarksDetailList.filter(x => x.isFinalSubmit == true)
          if (isfinalsubmit.length > 0) {
            this.isfinalsubmit = true
          }
          //table feature load
          this.loadInTable();
          //end table feature load
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  //

  isAllChecked(): boolean {

    let nonDetained = this.TheoryMarksDetailList?.filter(item => item.IsDetain == false);
    return nonDetained?.every(item => item.IsChecked == true);
  }

  async LockAndSubmit(StudentExamPaperMarksID: number = 0, isFinalSubmit: boolean = false) {

    var IsCheckecd = this.TheoryMarksDetailList.some(x => x.Marked == true);

    if (IsCheckecd == false) {
      this.toastr.error("Please Marked At least One Student")
      return
    }

    this.Swal2.Confirmation("Are you sure? <br> Once Submitted, It can't be edited anymore.",
      async (result: any) => {
        if (result.isConfirmed) {
          await this.OnSubmit(StudentExamPaperMarksID, isFinalSubmit);

        }
      });
  }

  async OnSubmit(StudentExamPaperMarksID: number = 0, isFinalSubmit: boolean = false) {

    // try {

    this.TheoryMarksDetailList.forEach((item: any) => {
      if (item.isSufm == true || item.isDetain == true) {
        item.selected = true;
      }
    });

    if (StudentExamPaperMarksID == 0 && isFinalSubmit == false) {
      var filtered = this.TheoryMarksDetailList.filter(x => x.Marked == true && x.IsUFM != true && x.IsDetain != true);
    } else {
      var filtered = this.TheoryMarksDetailList.filter(x => x.Marked == true && x.StudentExamPaperMarksID == StudentExamPaperMarksID);
    }
    // Filter the TheoryMarksList to get only the items where Marked is true

    /*  var filtered = this.TheoryMarksDetailList.filter(x => x.Marked == true);*/
    if (isFinalSubmit == false) {
      var IsCheckecd = this.TheoryMarksDetailList.filter(x => x.Marked == true);

      if (IsCheckecd.length == 0) {
        this.toastr.error("Please Marked At least One Student")
        return
      }
    }

    if (isFinalSubmit == true) {
      var filtered = this.TheoryMarksDetailList
    }

    // Iterate over each filtered item for validation
    for (let x of filtered) {

      // If the student is marked as "Absent" (IsPresentTheory = 0), validate marks
      if (x.IsPresentTheory === 0) {
        // Ensure marks are 0 when absent (MaxTheory and ObtainedTheory should be 0 for absent students)
        if (x.ObtainedTheory !== 0) {
          this.toastr.error('Please Enter 0 for absent student!');
          return;
        }
      }

      // If the student is marked as "Present" (IsPresentTheory = 1), ensure that marks are entered
      if (x.IsPresentTheory === 1) {
        // If no marks are entered, show the "Please enter marks" message
        if (x.ObtainedTheory === null || x.ObtainedTheory === undefined) {
          this.toastr.error('Please enter marks for present student!');
          return;
        }

        // Ensure the mark is either 0 or greater than 0 but not more than MaxTheory
        if (x.ObtainedTheory === 0) {
          this.toastr.warning('Marks are 0 for this student, proceed if this is intentional.');
        } else if (x.ObtainedTheory <= 0 || x.ObtainedTheory > x.MaxTheory) {
          this.toastr.error('Marks must be between 0 and Max Theory marks!');
          return;
        }
      }

      // Ensure that MaxTheory is not less than ObtainedTheory
      if ((x.ObtainedTheory!) > x.MaxTheory) {
        this.toastr.error("'Obtained Marks' cannot be greater then 'Max Marks'!");
        return;
      }

      // Set the Modifier information
      x.ModifyBy = this.sSOLoginDataModel.UserID;
    }

    filtered.forEach(x => {
      x.IsChecked = true,
        x.isFinalSubmit = isFinalSubmit
    })

    this.perfactStudents = filtered.filter(x => x.ObtainedTheory == x.MaxTheory);
    console.log("this.perfactStudents", this.perfactStudents);
    if (this.perfactStudents.length > 0) {
      this.Swal2.Confirmation(`Are you sure you want to enter Full Marks for Roll Number:<br> ${this.perfactStudents.map((x: any) => x.RollNo).join(', <br>')}`, async (result: any) => {
        if (result.isConfirmed) {
          await this.SaveData(filtered)
        }
      })
    } else {
      await this.SaveData(filtered)
    }
  }

  async SaveData(array: any) {
    try {
      //console.log("filtered while save", array);
      await this.theoryMarksRevalService.UpdateTheoryMarks_Admin(array)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //console.log("data on save", data);

          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message);
            if (array.length > 1) {
              await this.GetTheoryMarksDetailList();

            } else {
              array.forEach((x: any) => {

                x.Marked = this.AllInTableSelect;
              }
              )
            }

          } else {
            this.toastr.error(this.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to update SSOIDs');
        });

    } catch (ex) {
      console.log(ex);
    }
  }



  ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new TheoryMarksSearchModel();
    this.TheoryMarksDetailList = [];
    this.isListVisible = false;
    this.IsConfirmed = false;
    this.AllInTableSelect = false;
  }

  public async reset() {
    this.searchRequest.RollNo = ''
    await this.GetTheoryMarksDetailList()
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'StudentID', 'StudentExamID', 'StudentExamPaperMarksID', 'GroupCode', 'InstituteID'
    ];
    const filteredData = this.TheoryMarksDetailList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StudentsData.xlsx');
  }

  //table feature

  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.TheoryMarksDetailList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.TheoryMarksDetailList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.TheoryMarksDetailList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.TheoryMarksDetailList.filter(x => x.Marked)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.TheoryMarksDetailList.forEach(x => {
      if (!x.IsUFM && !x.IsDetain) {
        x.Marked = this.AllInTableSelect;
      }
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {

    const rowIndex = this.TheoryMarksDetailList.findIndex(x => x === item);
    if (rowIndex !== -1) {
      this.TheoryMarksDetailList[rowIndex].Marked = isSelected;
    }

    // Update "Select All" checkbox state
    let nonDetained = this.TheoryMarksDetailList.filter(r => r.IsDetain == false);
    this.AllInTableSelect = nonDetained.every(r => r.Marked == true);
  }

  //end table feature

  // onTabPress(event: KeyboardEvent, idx: number): void {
  //   if (event.key === 'Tab') {
  //     event.preventDefault(); // Prevents the default tab action

  //     const nextIndex = idx + 1;
  //     const nextInput = document.querySelector(`[tabindex="${nextIndex}"]`) as HTMLElement;

  //     if (nextInput) {
  //       nextInput.focus();
  //     }
  //   }
  // }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onTabPress(event: KeyboardEvent, idx: number): void {
    if (event.key === 'Tab') {
      event.preventDefault();

      let nextIndex = idx + 1;
      let nextTextbox: HTMLInputElement | null = null;

      while (!nextTextbox) {
        const element = document.querySelector(
          `input[type="text"][tabindex="${nextIndex}"]`
        ) as HTMLInputElement | null;

        if (!element) break;

        if (!element.disabled) {
          nextTextbox = element;
        } else {
          nextIndex++;
        }
      }

      nextTextbox?.focus();
    }
  }

  allowOnlyPositiveNumbers(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete'
    ];

    if (
      allowedKeys.includes(event.key) ||
      (event.key >= '0' && event.key <= '9')
    ) {
      return;
    }

    event.preventDefault();
  }
}
