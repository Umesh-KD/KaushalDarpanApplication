import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { TheoryMarksSearchModel, TheoryMarksDataModels } from '../../Models/TheoryMarksDataModels';
import { StreamMasterService } from '../../Services/BranchesMaster/branches-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { StudentCenteredActivitesService } from '../../Services/Student Centered Activites/student-centered-activites.service';
import { StudentCenteredActivitesModels, StudentCenteredActivitesSearchModel } from '../../Models/StudentCenteredActivitesModel';
import * as XLSX from 'xlsx';
import { UploadFileModel } from '../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel } from '../../Models/DeleteDocumentDetailsModel';
import { DocumentDetailsService } from '../../Common/document-details';
import { DocumentDetailsModel } from '../../Models/DocumentDetailsModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Component({
    selector: 'app-student-centered-activites-master',
    templateUrl: './student-centered-activites-master.component.html',
    styleUrls: ['./student-centered-activites-master.component.css'],
    standalone: false
})
export class StudentCenteredActivitesMasterComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public SemesterMasterList: any = [];
  public Branchlist: any[] = [];
  /*public TheoryMarksList: any = [];*/
  public UserID: number = 0;
  searchText: string = '';
  allSelected = false;
  public Table_SearchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isfinalsubmit: boolean = false
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public tbl_txtSearch: string = '';
  /*request = new TheoryMarksDataModels()*/
  public searchRequest = new StudentCenteredActivitesSearchModel();
  public request = new StudentCenteredActivitesModels();
  sSOLoginDataModel = new SSOLoginDataModel();
  public GradeList: StudentCenteredActivitesModels[] = []

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
  public isAnyUFMSelected: boolean = false;
  public totalInTableRecord: number = 0;
  public DocumentList: DocumentDetailsModel[] = []
  //end table feature default

  constructor(private commonMasterService: CommonFunctionService,
    private SCAService: StudentCenteredActivitesService, private toastr: ToastrService,
    private loaderService: LoaderService, private router: ActivatedRoute,
    private modalService: NgbModal, private Swal2: SweetAlert2, private streamMasterService: StreamMasterService, private appsettingConfig: AppsettingService,
    private documentDetailsService: DocumentDetailsService, private cdr: ChangeDetectorRef) {
  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*this.UserID = this.sSOLoginDataModel.UserID;*/
    await this.GetMasterData();
    await this.GetGradeList();

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
    this.GradeList.forEach(role => {
      role.Marked = this.allSelected;
    });
  }

  toggleCheckbox(role: StudentCenteredActivitesModels) {
    // Toggle the Marked state of the role
    role.Marked = !role.Marked;

    //// If unchecked, reset IsMainRole for that row
    //if (!role.Marked) {
    //  role.IsMainRole = 0;
    //}

    // Check if all roles are selected
    this.allSelected = this.GradeList.every(r => r.Marked);
  }

  async GetGradeList() {
    this.AllInTableSelect = false;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;//principle
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //
      this.loaderService.requestStarted();
      await this.SCAService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GradeList = data['Data'];
          console.log(this.GradeList, "TheoryMarks")
          this.GradeList.forEach((x: any) => {
            if (x.IsSCAChecked == false) {
              x.IsPresentStudentCenteredActivity = 1
            }
          })
          var isfinalsubmit = this.GradeList.filter(x => x.isFinalSubmit == true)
          if (isfinalsubmit.length > 0) {
            this.isfinalsubmit = true
            this.AllInTableSelect = false
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

  async LockAndSubmit(StudentExamPaperMarksID: number = 0, isFinalSubmit: boolean = false) {
    this.Swal2.Confirmation("Are you sure? <br> Once Submitted, It can't be edited anymore.",
      async (result: any) => {
        if (result.isConfirmed) {
          this.OnSubmit(StudentExamPaperMarksID, isFinalSubmit);
        }
      });
  }

  async OnSubmit(StudentExamPaperMarksID: number = 0, isFinalSubmit: boolean = false) {
    try {
      this.loaderService.requestStarted();
      

      // **Filter Present and UFM Students Separately**
      let presentStudents = this.GradeList.filter(x => x.Marked === true && x.IsPresentStudentCenteredActivity == 1);
      let ufmStudents = this.GradeList.filter(x => x.IsPresentStudentCenteredActivity == 4);

       if (StudentExamPaperMarksID == 0 && isFinalSubmit == false) {
         let presentStudents = this.GradeList.filter(x => x.Marked === true && x.IsPresentStudentCenteredActivity == 1);
         let ufmStudents = this.GradeList.filter(x => x.IsPresentStudentCenteredActivity == 4);
       } else {
         let presentStudents = this.GradeList.filter(x => x.Marked === true && x.IsPresentStudentCenteredActivity == 1 && x.StudentExamPaperMarksID == StudentExamPaperMarksID);
         let ufmStudents = this.GradeList.filter(x => x.IsPresentStudentCenteredActivity == 4 && x.StudentExamPaperMarksID == StudentExamPaperMarksID);
    }

      if (isFinalSubmit == true) {
        let presentStudents = this.GradeList.filter(x =>  x.IsPresentStudentCenteredActivity == 1);
        let ufmStudents = this.GradeList.filter(x => x.IsPresentStudentCenteredActivity == 4);
      }

      // **Validation for Present Students**
      if (presentStudents.length == 0 && ufmStudents.length == 0 && isFinalSubmit==false) {
        this.toastr.warning('Please mark students as Present or UFM before saving.');
        return;
      }

      let gradeFound = false;  // Flag to ensure at least one grade is entered

      for (let student of presentStudents) {
        // **Check for missing grades**
        if (!student.ObtainedStudentCenteredActivity || student.ObtainedStudentCenteredActivity === 0) {
          this.toastr.warning(`Please enter a grade for student ${student.StudentID}.`);
          return;
        } else {
          gradeFound = true; // At least one grade found
        }

        // **ModifyBy should be set for Present students**
        student.ModifyBy = this.sSOLoginDataModel.UserID;
      }

      // **Validation for UFM Students**
      for (let student of ufmStudents) {
        // Ensure that a document is uploaded for UFM cases
        if (!student.UFMDocument || student.UFMDocument.trim() === '') {
          this.toastr.warning(`Please upload a document for UFM student ${student.StudentID}.`);
          return;
        }

        // **ModifyBy should be set for UFM students**
        student.ModifyBy = this.sSOLoginDataModel.UserID;
      }

      // **Ensure at least one grade is entered before proceeding**
      if (presentStudents.length > 0 && !gradeFound) {
        this.toastr.warning('Please enter at least one grade for present students before saving.');
        return;
      }

      console.log("Filtered Present Students", presentStudents);
      console.log("Filtered UFM Students", ufmStudents);

      // **Combine both present and UFM students for submission**
      let finalSubmissionList = [...presentStudents, ...ufmStudents];

      finalSubmissionList.forEach(x => {
        x.IsSCAChecked = true; // Marking them for submission
        x.isFinalSubmit = isFinalSubmit
      });

      // **Save data**
      await this.SCAService.UpdateSaveData(finalSubmissionList)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            if (finalSubmissionList.length > 1) {
              await this.GetGradeList();
            } else {
              finalSubmissionList.forEach((x: any) => {
                x.Marked = this.AllInTableSelect;
              }
              )
            }
              this.request.Dis_UFMDocument = '';
              this.request.UFMDocument = '';
            
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to update student grades.');
        });

    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new StudentCenteredActivitesSearchModel();
    this.GradeList = [];
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'StudentID', 'StudentExamID', 'StudentExamPaperMarksID', 'GroupCode', 'InstituteID'
    ];
    const filteredData = this.GradeList.map((item: any) => {
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

  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.GradeList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.GradeList] as any[]).sort((a, b) => {
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
    this.cdr.detectChanges();
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
    this.totalInTableRecord = this.GradeList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.GradeList.filter(x => x.Marked)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.GradeList.forEach(x => {
      if (!x.IsDetain) {
        x.Marked = this.AllInTableSelect;
      }
    });
  }  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    // Find the row in the GradeList and update only that row
    const rowIndex = this.GradeList.findIndex(x => x === item);
    if (rowIndex !== -1) {
      this.GradeList[rowIndex].Marked = isSelected;
    }


    // Update "Select All" checkbox state
    this.AllInTableSelect = this.GradeList.every(r => r.Marked);
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
            console.log(data,'UploadDoc')
            if (this.State == EnumStatus.Success) {
              if (Type == "Document") {
                //this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
                row.UFMDocument = data['Data'][0]["FileName"];
                row.Dis_UFMDocument = data['Data'][0]["Dis_FileName"];
                //this.request.StudentExamPaperMarksID = this.GradeList[0].StudentExamPaperMarksID;
                console.log(this.request, 'ListRequest')
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

  async onStatusChange(dOC: any) {
    
    console.log(this.paginatedInTableData,'ListDataaaaa')
    if (this.paginatedInTableData.some((x: any) => x.IsPresentStudentCenteredActivity == 4)) {
      this.isAnyUFMSelected = true
    } else if (this.paginatedInTableData.every((x: any) => x.IsPresentStudentCenteredActivity == 4)) {
      this.isAnyUFMSelected = true
    }
    else {
      this.isAnyUFMSelected = false
    }
    if (dOC.IsPresentStudentCenteredActivity == 4) {
      dOC.ShowRemark = true;
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
    }

    if (dOC.IsPresentStudentCenteredActivity != 1) {
      dOC.ObtainedStudentCenteredActivity = 0;
    }
  /*  this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);*/
  }


  isAllChecked(): boolean {
    return this.GradeList?.every(item => item.IsSCAChecked == true);
  }

}
