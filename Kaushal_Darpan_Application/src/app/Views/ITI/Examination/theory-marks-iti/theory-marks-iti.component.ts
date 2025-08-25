import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ITITheoryMarksDataModels, ITITheoryMarksSearchModel } from '../../../../Models/ITITheoryMarksDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CopyCheckerRequestModel } from '../../../../Models/CopyCheckerRequestModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExaminerCodeLoginModel } from '../../../../Models/ExaminerCodeLoginModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { CopyCheckerDashboardService } from '../../../../Services/CopyCheckerDashboard/copy-checker-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamMasterService } from '../../../../Services/BranchesMaster/branches-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { ExaminerService } from '../../../../Services/Examiner/examiner.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { TheoryMarksService } from '../../../../Services/TheoryMarks/theory-marks.service';
import { ItiTheoryMarksService } from '../../../../Services/ITI/ItiTheoryMarks/Iti-theory-marks.service';
import * as XLSX from 'xlsx';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
@Component({
  selector: 'app-theory-marks-iti',
  standalone: false,
  
  templateUrl: './theory-marks-iti.component.html',
  styleUrl: './theory-marks-iti.component.css'
})
export class TheoryMarksItiComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public SemesterMasterList: any = [];
  public Branchlist: any = [];
  /*public TheoryMarksList: any = [];*/
  public isFinalsubmit : boolean=false
  public UserID: number = 0;
  searchText: string = '';
  public Table_SearchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public IsConfirmed: boolean = false;
  public isShowFinal: boolean = false;
  public tbl_txtSearch: string = '';
  public isModalOpen = false;

  isListVisible: boolean = false;
  modalReference: NgbModalRef | undefined;
  /*request = new TheoryMarksDataModels()*/
  public searchRequest = new ITITheoryMarksSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public TheoryMarksDetailList: ITITheoryMarksDataModels[] = []
  public TheoryMarksDashBoardCount: any[] = []
  public IsCountShow: boolean = true
  public copyCheckerRequest = new CopyCheckerRequestModel();

  public ExaminerCodeLoginForm!: FormGroup;
  public examinerCodeLoginModel = new ExaminerCodeLoginModel();
  @ViewChildren('markInput') markInputs!: QueryList<ElementRef>;
    @ViewChild('otpModal') childComponent!: OTPModalComponent;
  @ViewChild('MyModel_ExaminerCodeLogin') MyModel_ExaminerCodeLogin: ElementRef | any;
  public closeResult: string | undefined;
  public id: number = 0;

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

  constructor(private commonMasterService: CommonFunctionService, private collegeDashDataService: CopyCheckerDashboardService,
    private Router: Router, private TheoryMarksService: ItiTheoryMarksService, private toastr: ToastrService,
    private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router,
    private modalService: NgbModal, private Swal2: SweetAlert2, private streamMasterService: StreamMasterService, private formBuilder: FormBuilder, private examinerService: ExaminerService) {
  }

  async ngOnInit() {
    //form
    this.ExaminerCodeLoginForm = this.formBuilder.group({
      ExaminerCode: ['', Validators.required],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*this.UserID = this.sSOLoginDataModel.UserID;*/

    this.router.queryParams.subscribe(params => {
      this.id = +params['id']; 
      console.log(this.id); 
    });

    this.GetTheoryMarksDetailList();
  }

  get form() { return this.ExaminerCodeLoginForm.controls; }
  //
  async GetCopyCheckerDashData() {
    try {
      //session
      this.copyCheckerRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.copyCheckerRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.copyCheckerRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.copyCheckerRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //call
      this.loaderService.requestStarted();

      await this.collegeDashDataService.GetCopyCheckerDashData(this.copyCheckerRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TheoryMarksDashBoardCount = data['Data'];
          const checkIsChecked = this.TheoryMarksDashBoardCount.find((e: any) => e.IsChecked > 0)
          if (checkIsChecked) {
            this.IsCountShow = false
            this.isListVisible = true
            this.GetTheoryMarksDetailList();
          } else {
            this.IsCountShow = true
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  //
  async GetTheoryMarksDetailList() {
    try {
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.IsConfirmed = this.IsConfirmed = true;
      this.searchRequest.AppointExaminerID = this.id

      this.loaderService.requestStarted();
      await this.TheoryMarksService.GetTheoryMarksDetailList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TheoryMarksDetailList = data['Data'];
          const isFinalshow = this.TheoryMarksDetailList.some((x: any) => x.IsChecked == 1)
          if (isFinalshow) {
            this.isShowFinal = true
          } else {
            this.isShowFinal = false
          }

          this.isFinalsubmit = this.TheoryMarksDetailList.some((x) => x.IsFinalSubmit == true)

          console.log("TheoryMarksDetailList", this.TheoryMarksDetailList);

          this.TheoryMarksDetailList.forEach(x => {
            if (x.IsChecked == false) {
              x.IsPresentTheory = 1
            }
          })
          //table feature load
          this.loadInTable();
          //end table feature load
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  //
  async OnSubmit(isfinalSubmit: boolean = false, StudentExamPaperMarksID: number = 0) {
    try {
      this.loaderService.requestStarted();

      // Filter the TheoryMarksList to get only the items where Marked is true
      if (isfinalSubmit == false && StudentExamPaperMarksID == 0) {
        var filtered = this.TheoryMarksDetailList.filter(x => x.Marked == true);
      } else {
        var filtered = this.TheoryMarksDetailList.filter(x => x.Marked == true && x.StudentExamPaperMarksID == StudentExamPaperMarksID);
      }



      if (isfinalSubmit == false) {
        var IsCheckecd = this.TheoryMarksDetailList.filter(x => x.Marked == true);

        if (IsCheckecd.length == 0) {
          this.toastr.error("Please Marked At least One Student")
          return
        }
      }

      if (isfinalSubmit == true) {
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
          x.IsFinalSubmit = isfinalSubmit
      })
      
      console.log("filtered while save", filtered);
      // Call the service to save the filtered data
      await this.TheoryMarksService.UpdateSaveData(filtered)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log("data on save", data);

          // Check if the save was successful
          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);

            if (filtered.length > 1) {
              await this.GetTheoryMarksDetailList();

            } else {
              filtered.forEach((x: any) => {

                x.Marked = this.AllInTableSelect;
              }
              )
            }

       /*     await this.GetTheoryMarksDetailList();  // Refresh the list after successful save*/
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
    } finally {
      this.loaderService.requestEnded();
    }
  }

  ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new ITITheoryMarksSearchModel();
    this.TheoryMarksDetailList = [];
    this.isListVisible = false;
  }

  async OnConfirm(content: any) {
    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;  // Open the modal
    this.IsConfirmed = true;

  }


  async Confirm() {
    this.GetTheoryMarksDetailList();
    this.isListVisible = true;
    this.modalReference?.close();
  }

  async Back() {
    await this.routers.navigate(['/copycheckdash']);
  }


  async openPageAfterExaminerLogin() {
    try {
      this.isSubmitted = true;
      if (this.ExaminerCodeLoginForm.invalid) {
        return;
      }
      this.examinerCodeLoginModel.SSOID = this.sSOLoginDataModel.SSOID;
      this.examinerCodeLoginModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.examinerCodeLoginModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.examinerCodeLoginModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.examinerService.GetExaminerByCode(this.examinerCodeLoginModel)
        .then(async (data: any) => {
          console.log(data);
          if (data.State == EnumStatus.Success) {
            await this.GetCopyCheckerDashData();
          }
          else {
            this.toastr.error("Invalid Examiner!");
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
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
  //checked all (replace org. list here)
  // selectInTableAllCheckbox() {
  //   this.TheoryMarksDetailList.forEach(x => {
  //     x.Marked = this.AllInTableSelect;
  //     // Set 'ObtainedTheory' to 0 when "Select All" is checked, otherwise null
  //     if (this.AllInTableSelect) {
  //       x.ObtainedTheory = 0; // Marks are set to 0 when all are selected
  //     } else {
  //       x.ObtainedTheory = null; // Optionally, reset marks when "Select All" is unchecked
  //     }
  //   });
  // }
  // //checked single (replace org. list here)
  // selectInTableSingleCheckbox(isSelected: boolean, item: any) {
  //   const data = this.TheoryMarksDetailList.filter(x => x.StudentID == item.StudentID);
  //   data.forEach(x => {
  //     x.Marked = isSelected;
  //   });
  //   //select all(toggle)
  //   this.AllInTableSelect = this.TheoryMarksDetailList.every(r => r.Marked);
  // }

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
      x.Marked = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.TheoryMarksDetailList.filter(x => x.StudentID == item.StudentID);
    data.forEach(x => {
      x.Marked = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.TheoryMarksDetailList.every(r => r.Marked);
  }
  //end table feature



  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }


  onTabPress(event: KeyboardEvent, index: number) {

    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();  // Prevent default tab behavior

      const nextIndex = index + 1;

      // Wait for the next view update before focusing
      setTimeout(() => {
        const inputs = this.markInputs.toArray();
        if (inputs[nextIndex]) {
          inputs[nextIndex].nativeElement.focus();
        }
      });
    }
  }

  async LockAndSubmit(StudentExamPaperMarksID: number = 0, isFinalSubmit: boolean = false) {

    var IsCheckecd = this.TheoryMarksDetailList.some(x => x.Marked == true);

    //if (IsCheckecd == false) {
    //  this.toastr.error("Please Marked At least One Student")
    //  return
    //}

    this.Swal2.Confirmation("Are you sure? <br> Once Submitted, It can't be edited anymore.",
      async (result: any) => {
          if (result.isConfirmed) {
              this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
              this.childComponent.OpenOTPPopup();

              this.childComponent.onVerified.subscribe(() => {
                  //this.PublishTimeTable();

                   this.OnSubmit(isFinalSubmit, StudentExamPaperMarksID);
              })
          
        }
      });
    }


  



      

}
