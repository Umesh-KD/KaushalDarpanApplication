import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TheoryMarksDataModels, TheoryMarksSearchModel } from '../../../Models/TheoryMarksDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InternalPracticalStudentService } from '../../../Services/InternalPracticalStudent/internal-practical-assessment-student.service';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { AppsettingService } from '../../../Common/appsetting.service';
import { LoaderService } from '../../../Services/Loader/loader.service';

@Component({
  selector: 'app-admin-internal-practical',
  standalone: false,
  templateUrl: './admin-internal-practical.component.html',
  styleUrl: './admin-internal-practical.component.css'
})
export class AdminInternalPracticalComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public SemesterMasterList: any = [];
  public Branchlist: any = [];
  public InternalPracticalID: number | null = null;
  /*public TheoryMarksList: any = [];*/
  @ViewChildren('markInput') markInputs!: QueryList<ElementRef>;
  public UserID: number = 0;
  searchText: string = '';
  allSelected = false;
  public Table_SearchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public IsView: boolean = false;
  public isfinalsubmit: boolean = false;
  public Allstudentcheck: boolean = false
  public tbl_txtSearch: string = '';
  /*request = new TheoryMarksDataModels()*/
  public searchRequest = new TheoryMarksSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public TheoryMarksList: TheoryMarksDataModels[] = []
  public fullPracticalStudents: any = []
  public fullAssessmentStudents: any = []
  public fullMarksStudents: any = []
  public InstituteMasterDDLList: any = []
  public _EnumRole = EnumRole;

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

  public isAnyUFMSelected: boolean = false;

  constructor(
    private commonMasterService: CommonFunctionService,
    private activatedRoute: ActivatedRoute,
    private Router: Router,
    private InternalPracticalStudentService: InternalPracticalStudentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private streamMasterService: StreamMasterService,
    private appsettingConfig: AppsettingService
  ) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*this.UserID = this.sSOLoginDataModel.UserID;*/

    this.InternalPracticalID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    console.log(this.InternalPracticalID)
    this.searchRequest.InternalPracticalID = this.InternalPracticalID;
    if (this.InternalPracticalID == 2) {
      this.IsView = true;
    }
    else {
      this.IsView = false;
    }
    //load
    await this.GetMasterData();

    // to refresh
    await this.activatedRoute.queryParams.subscribe(async params => {
      //debugger
      this.InternalPracticalID = params['id'];
      this.searchRequest.InternalPracticalID = params['id'];

      if (this.InternalPracticalID == 2) {
        this.IsView = true;
      }
      else {
        this.IsView = false;
      }

      await this.GetTheoryMarksList(); // or whatever function loads your data
    });
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Branchlist = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
      })
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

  toggleAllCheckboxes(event: Event) {

    this.allSelected = (event.target as HTMLInputElement).checked;
    this.TheoryMarksList.forEach(role => {
      role.Marked = this.allSelected;
    });
  }

  toggleCheckbox(role: TheoryMarksDataModels) {
    // Toggle the Marked state of the role
    role.Marked = !role.Marked;

    //// If unchecked, reset IsMainRole for that row
    //if (!role.Marked) {
    //  role.IsMainRole = 0;
    //}

    // Check if all roles are selected
    this.allSelected = this.TheoryMarksList.every(r => r.Marked);
  }

  async GetTheoryMarksList() {
    try {
      this.AllInTableSelect = false;
      this.isSubmitted = true;
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID

      if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      }
      this.loaderService.requestStarted();
      await this.InternalPracticalStudentService.GetAllDataInternal_Admin(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TheoryMarksList = data['Data'];
          console.log(this.TheoryMarksList, "TheoryMarks")

          if (this.InternalPracticalID == 2) {
            this.TheoryMarksList.forEach((x: any) => {
              this.onStatusPracticalAssesmentChange(x, true)
              if (x.IsInternalAssesmentCheckecd == false) {
                x.IsPresentInternalAssisment = 1
              }
            })
          } else if (this.InternalPracticalID == 1) {
            this.TheoryMarksList.forEach((x: any) => {
              this.onStatusPracticalChange(x, true)
              if (x.IsPracticalChecked == false) {
                x.IsPresentPractical = 1
              }
            })
          }


          var isfinalsubmit = this.TheoryMarksList.filter(x => x.isFinalSubmit == true)
          if (isfinalsubmit.length > 0) {
            this.isfinalsubmit = true
          }

          //table feature load
          this.loadInTable();
          //end table feature load
        }, error => console.error(error));
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

  // isAllChecked(): boolean {

  //   if (this.InternalPracticalID == 2) {
  //          var isallcheck = this.TheoryMarksList?.every(item => item.IsPracticalChecked == true && item.IsDetain == false);
  //     this.Allstudentcheck = isallcheck
  //     return this.TheoryMarksList?.every(item => item.IsInternalAssesmentCheckecd == true && item.IsDetain == false);

  //   } else if (this.InternalPracticalID == 1) {
  //     var isallcheck = this.TheoryMarksList?.every(item => item.IsPracticalChecked == true && item.IsDetain == false);
  //     this.Allstudentcheck = isallcheck
  //     // console.log(this.Allstudentcheck)
  //     return this.TheoryMarksList?.every(item => item.IsPracticalChecked == true && item.IsDetain == false);

  //   } else {
  //     return false
  //   }
  // }

  // async LockAndSubmit(StudentExamPaperMarksID: number = 0, isFinalSubmit: boolean = false) {
  //   this.Swal2.Confirmation("Are you sure? <br> Once Submitted, It can't be edited anymore.",
  //     async (result: any) => {
  //       if (result.isConfirmed) {
  //         this.OnSubmit(StudentExamPaperMarksID, isFinalSubmit);
  //       }
  //     });
  // }

  // Submit method to validate and save data
  async OnSubmit(StudentExamPaperMarksID: number = 0) {

    // Filter the TheoryMarksList to get only the items where Marked is true
    if (StudentExamPaperMarksID == 0) {
      var filtered = this.TheoryMarksList.filter(x => x.Marked == true);
    } else {
      var filtered = this.TheoryMarksList.filter(x => x.Marked == true && x.StudentExamPaperMarksID == StudentExamPaperMarksID);
    }



    if (filtered.length === 0) {
      this.toastr.warning('Please Select Student data');
      return;
    }


    // if (isFinalSubmit == true) {
    //   var filtered = this.TheoryMarksList
    // }



    // Iterate over each filtered item for validation
    for (let x of filtered) {
      if (this.searchRequest.InternalPracticalID === 2) {
        // Validate for UFM and document upload
        if (x.IsPresentInternalAssisment === 4 && !x.UFMDocument) {
          this.toastr.error('Please upload a document for UFM students.');
          return;
        }

        // Other validations (absent, present, etc.)
        if (x.IsPresentInternalAssisment === 0 && x.IsDetain == false && (x.MaxInternalAssisment !== 0 || x.ObtainedInternalAssisment !== 0)) {
          this.toastr.error('For absent students, marks must be 0.');
          return;
        }

        if (x.IsPresentInternalAssisment === 1) {
          if (x.ObtainedInternalAssisment === null || x.ObtainedInternalAssisment === undefined || x.ObtainedInternalAssisment === 0) {
            this.toastr.error('Please enter marks for the student (Obtained Marks cannot be blank when Present)');
            return;
          }

          if (x.ObtainedInternalAssisment > x.MaxInternalAssisment) {
            this.toastr.error('Max Marks cannot be less than Marks Obtained');
            return;
          }
        }

        if (x.MaxInternalAssisment < x.ObtainedInternalAssisment) {
          this.toastr.error('Max Marks cannot be less than Marks Obtained');
          return;
        }

        if (x.IsPresentInternalAssisment === 0) {
          this.toastr.error('Please update Status to Present/Absent');
          return;
        }
      }

      if (this.searchRequest.InternalPracticalID === 1) {
        // Validate for practical and document upload
        if (x.IsPresentPractical === 4 && !x.UFMDocument) {
          this.toastr.error('Please upload a document for UFM students.');
          return;
        }

        // Other validations (absent, present, etc.)
        if (x.IsPresentPractical === 0 && x.IsDetain == false && (x.MaxPractical !== 0 || x.ObtainedPractical !== 0)) {
          this.toastr.error('For absent students, marks must be 0.');
          return;
        }

        if (x.IsPresentPractical === 1) {
          if (x.ObtainedPractical === null || x.ObtainedPractical === undefined || x.ObtainedPractical === 0) {
            this.toastr.error('Please enter marks for the student (Obtained Marks cannot be blank when Present)');
            return;
          }

          if (x.ObtainedPractical > x.MaxPractical) {
            this.toastr.error('Max Marks cannot be less than Marks Obtained');
            return;
          }
        }

        if (x.MaxPractical < x.ObtainedPractical) {
          this.toastr.error('Max Marks cannot be less than Marks Obtained');
          return;
        }

        if (x.IsPresentPractical === 0) {
          this.toastr.error('Please update Status to Present/Absent');
          return;
        }
      }

      // Set the Modifier information (for tracking who made the modification)
      x.ModifyBy = this.sSOLoginDataModel.UserID;
    }

    // Handle full marks students for confirmation before saving
    filtered.forEach((x: any) => {
      if (this.IsView) {
        x.IsInternalAssesmentCheckecd = true;
        // x.isFinalSubmit = isFinalSubmit
      } else {
        x.IsPracticalChecked = true;
        // x.isFinalSubmit = isFinalSubmit
      }
    });

    if (this.searchRequest.InternalPracticalID === 2) {
      this.fullMarksStudents = filtered.filter(x => x.MaxInternalAssisment == x.ObtainedInternalAssisment);
    } else if (this.searchRequest.InternalPracticalID === 1) {
      this.fullMarksStudents = filtered.filter(x => x.MaxPractical == x.ObtainedPractical);
    }

    // If full marks are found, confirm the save with a warning
    if (this.fullMarksStudents.length > 0) {
      this.Swal2.Confirmation(`Are you sure you want to enter Full Marks for Roll Number:<br> ${this.fullMarksStudents.map((x: any) => x.RollNo + ' (' + x.SubjectName + ')').join(', <br>')}`, async (result: any) => {
        if (result.isConfirmed) {
          this.SaveData(filtered);
        }
      });
    } else {
      this.SaveData(filtered);
    }
  }

  // Save data after validation
  async SaveData(array: any) {
    try {
      this.loaderService.requestStarted();
      await this.InternalPracticalStudentService.UpdateSaveDataInternal_Admin(array, this.searchRequest.InternalPracticalID)
        .then(async (data: any) => {

          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            if (array.length > 1) {
              await this.GetTheoryMarksList();
            } else {
              array.forEach((x: any) => {
                x.Marked = this.AllInTableSelect;
              }
              )
            }
            this.fullMarksStudents = [];
            // await this.GetTheoryMarksList();
            //window.location.reload();
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to update data');
        });
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  // Method to handle deletion of the uploaded document (for UFM)
  DeleteDocument(row: any) {
    row.UFMDocument = ''; // Clear the document for the row
    console.log('Document deleted for:', row.RollNo);
  }


  ResetControl() {
    /* this.searchRequest = new TheoryMarksSearchModel();*/
    this.searchRequest.MarkEnter = 0;
    this.searchRequest.SemesterID = 0;
    this.searchRequest.StreamID = 0;
    this.searchRequest.StudentID = 0;
    this.searchRequest.SubjectID = 0;
    this.searchRequest.RollNo = '',
      this.TheoryMarksList = [];
    this.searchRequest.InstituteID = 0;
    this.paginatedInTableData = []

  }

  exportToExcel(): void {
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'StudentID', 'StudentExamID', 'StudentExamPaperMarksID', 'GroupCode', 'InstituteID'
    ];
    const filteredData = this.TheoryMarksList.map((item: any) => {
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
    this.paginatedInTableData = [...this.TheoryMarksList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.TheoryMarksList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.TheoryMarksList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.TheoryMarksList.filter(x => x.Marked)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.TheoryMarksList.forEach(x => {
      if (!x.IsDetain) {
        x.Marked = this.AllInTableSelect;
      }
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const rowIndex = this.TheoryMarksList.findIndex(x => x === item);
    if (rowIndex !== -1) {
      this.TheoryMarksList[rowIndex].Marked = isSelected;
    }

    // Update "Select All" checkbox state
    this.AllInTableSelect = this.TheoryMarksList.every(r => r.Marked);
  }

  //end table feature


  async onStatusPracticalAssesmentChange(dOC: any, isGetAll: boolean = false) {


    if (this.paginatedInTableData.some((x: any) => x.IsPresentInternalAssisment == 4)) {
      this.isAnyUFMSelected = true
    } else if (this.paginatedInTableData.every((x: any) => x.IsPresentInternalAssisment == 4)) {
      this.isAnyUFMSelected = true
    }
    else {
      this.isAnyUFMSelected = false
    }
    if (dOC.IsPresentInternalAssisment == 4) {
      dOC.ShowRemark = true;
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
    }

    if (isGetAll == false && dOC.IsPresentInternalAssisment != 1) {
      dOC.ObtainedInternalAssisment = 0;
    }
    /*  this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);*/
  }

  async onStatusPracticalChange(dOC: any, isGetAll: boolean = false) {


    if (this.paginatedInTableData.some((x: any) => x.IsPresentPractical == 4)) {
      this.isAnyUFMSelected = true
    } else if (this.paginatedInTableData.every((x: any) => x.IsPresentPractical == 4)) {
      this.isAnyUFMSelected = true
    }
    else {
      this.isAnyUFMSelected = false
    }
    if (dOC.IsPresentPractical == 4) {
      dOC.ShowRemark = true;
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
    }

    if (isGetAll == false && dOC.IsPresentPractical != 1) {
      // dOC.ObtainedPractical = 0;
    }
    /*  this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);*/
  }


  public file!: File;
  async onFilechange(event: any, Type: string, row: any) {

    try {

      if (!row) {
        console.error("Row data is undefined or null");
        return;
      }


      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(data, 'UploadDoc')
            if (this.State == EnumStatus.Success) {
              if (Type == "Document") {
                //this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
                row.UFMDocument = data['Data'][0]["FileName"];
                row.Dis_UFMDocument = data['Data'][0]["Dis_FileName"];
                //this.request.StudentExamPaperMarksID = this.GradeList[0].StudentExamPaperMarksID;
                console.log(row, 'ListRequest')
              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }



  onTabPress(event: KeyboardEvent, idx: number): void {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevents the default tab action

      const nextIndex = idx + 1;
      const nextInput = document.querySelector(`[tabindex="${nextIndex}"]`) as HTMLElement;

      if (nextInput) {
        nextInput.focus();
      }
    }
  }
}
