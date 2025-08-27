import { Component } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants, enumExamStudentStatus } from '../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { ActivatedRoute } from '@angular/router';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import * as XLSX from 'xlsx';
import { StudentApplicationModel, StudentApplicationSaveModel } from '../../Models/StudentApplicationDataModel';
import { AllotedStudentVerifyService } from '../../Services/alloted-student-verify/alloted-student-verify.service';


@Component({
  selector: 'app-alloted-student-verify',
  templateUrl: './alloted-student-verify.component.html',
  styleUrls: ['./alloted-student-verify.component.css'],
  standalone: false
})
export class AllotedStudentVerifyComponent {
  public _GlobalConstants: any = GlobalConstants;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public SubjectID: any[] = [];
  public UserID: number = 0
  public RoleID: number = 0
  public InstituteMasterList: any = [];
  public InstitutionManagementMasterList: any = [];
  public StreamMasterList: any = [];
  public SemesterMasterList: any = [];
  public StudentTypeList: any = [];
  public StudentStatusList: any = [];
  public ExamCategoryList: any = [];

  public StudentProfileDetailsData: any = [];
  public Student_QualificationDetailsData: any = [];

  public settingsMultiselect: object = {};
  public statusID: number = 0
  public NesStudentID: number = 0;
  public InstitutesListForStudent: any = [];

  public _EnumRole = EnumRole;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public IsShowViewStudent: boolean = false;
  public StudentTypeMasterList: any = [];
  public BoardMasterList: any = [];
  public PassingYearList: any = [];
  public ExamStudentStatusDDLList: any = [];
  public CasteCategoryAMasterData: any = [];
  public CasteCategoryBMasterData: any = [];
  public SubjectMasterDDLList: any[] = [];
  public selectedSubjects: any = [];
  public ExamStudentStatusList: any[] = [];
  public status: number = 0
  public FinancialYear: any = []
  public isShowdrop: boolean = true

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public StudentFilterStatusId: number = 0;
  public GenderList: any = []

  public _enumExamStudentStatus = enumExamStudentStatus;

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
  public DateConfigSetting: any = [];
  //end table feature default

  public studentApplicationRequest = new StudentApplicationModel();
  public studentApplicationList: any[] = [];



  constructor(private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    public allotedStudentVerifyService: AllotedStudentVerifyService,
  ) {

  }

  async ngOnInit() {

    //session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //load data
    await this.GetMasterData();
  }

  async GetMasterData() {
    try {
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetCommonMasterDDLByType('ExamStudentStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          let _ExamStudentStatusList = data['Data'];
          this.ExamStudentStatusList = _ExamStudentStatusList.filter((x: any) => x.ID == this._enumExamStudentStatus.ApproveByAcp || x.ID == this._enumExamStudentStatus.ReturnByAcp);
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_SearchClick() {
    await this.GetAdmittedStudentToVerify();
  }

  //get student data
  async GetAdmittedStudentToVerify() {
    try {
      this.isSubmitted = true;
      //session
      this.studentApplicationRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.studentApplicationRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.studentApplicationRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.studentApplicationRequest.RoleID = this.sSOLoginDataModel.RoleID;

      //call
      await this.allotedStudentVerifyService.GetAdmittedStudentToVerify(this.studentApplicationRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.studentApplicationList = data['Data'];

            //table feature load
            this.loadInTable();
            //end table feature load
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_Clear() {
    //clear

    //get
    this.btn_SearchClick();
  }

  // ---------- save marked student with exam flow ------
  async SaveDataMarked() {

    // status marked
    if (this.status <= 0) {
      this.toastr.error("Please select status!");
      return;
    }
    // any student selected
    const anyStudentSelected = this.studentApplicationList.some(student => student.Selected);
    if (!anyStudentSelected) {
      this.toastr.error("Please select Student(s)!");
      return;
    }

    if (this.status == this._enumExamStudentStatus.ApproveByAcp) {
      await this.SaveAdmittedStudentForApproveByAcp();
    }
    else if (this.status == this._enumExamStudentStatus.ReturnByAcp) {
      await this.SaveAdmittedStudentForReturnByAcp();
    }
    else {
      this.toastr.error("Invalid action!");
    }
  }

  // save 
  async SaveAdmittedStudentForApproveByAcp() {
    // confirm

    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {
      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentApplicationSaveModel[] = [];
          const selectedStudents = this.studentApplicationList.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              ApplicationID: x.ApplicationID,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleID: this.sSOLoginDataModel.RoleID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              EndTermID: this.sSOLoginDataModel.EndTermID,
            })
          });
          // Call service to save student exam status
          await this.allotedStudentVerifyService.SaveAdmittedStudentForApproveByAcp(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                await this.GetAdmittedStudentToVerify();
              }
              this.toastr.success(this.Message)

            })
        } catch (ex) {
          console.log(ex);
          console.log(this.ErrorMessage);
        }
      }
    });
  }

  async SaveAdmittedStudentForReturnByAcp() {
    // confirm

    this.Swal2.ConfirmationWithRemark("Are you sure to continue?", async (result: any) => {
      //confirmed
      try {
        this.isSubmitted = true;
        this.loaderService.requestStarted();
        // Filter out only the selected students
        var request: StudentApplicationSaveModel[] = [];
        const selectedStudents = this.studentApplicationList.filter(x => x.Selected);
        selectedStudents.forEach(x => {
          request.push({
            ApplicationID: x.ApplicationID,
            ModifyBy: this.sSOLoginDataModel.UserID,
            RoleID: this.sSOLoginDataModel.RoleID,
            DepartmentID: this.sSOLoginDataModel.DepartmentID,
            Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
            EndTermID: this.sSOLoginDataModel.EndTermID,
            Remark: result
          })
        });
        // Call service to save student exam status
        await this.allotedStudentVerifyService.SaveAdmittedStudentForReturnByAcp(request)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            //
            if (this.State == EnumStatus.Success) {
              await this.GetAdmittedStudentToVerify();
            }
            this.toastr.success(this.Message)

          })
      } catch (ex) {
        console.log(ex);
        console.log(this.ErrorMessage);
      }
    });
  }
  // ---------- end save marked student with exam flow ------


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
    this.paginatedInTableData = [...this.studentApplicationList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.studentApplicationList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.studentApplicationList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.studentApplicationList.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.studentApplicationList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.studentApplicationList.filter(x => x.ApplicationID == item.ApplicationID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.studentApplicationList.every(r => r.Selected);
  }
  // end table feature

  //excel export
  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status',
      'EndTermID', 'StreamID', 'SemesterID', 'StudentType'
    ];
    const filteredData = this.studentApplicationList.map((item: any) => {
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

}

