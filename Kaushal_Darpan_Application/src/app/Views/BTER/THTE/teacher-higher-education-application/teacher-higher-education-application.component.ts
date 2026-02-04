import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { GlobalConstants, EnumRole, enumExamStudentStatus, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';
import { TeacherHigherEducationApplicationRequestModel, TeacherHigherEducationApplicationSaveModel, THTE_ApplicationSearchModel, THTE_DDL } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTER_EM_AddStaffDetailsDataModel, BTER_EM_GetPersonalDetailByUserID } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';


@Component({
  selector: 'app-teacher-higher-education-application',
  standalone: false,
  templateUrl: './teacher-higher-education-application.component.html',
  styleUrl: './teacher-higher-education-application.component.css'
})

export class TeacherHigherEducationApplicationComponent {

  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public ButtonText: string = "";

  public _EnumRole = EnumRole;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public IsShowViewStudent: boolean = false;
  public requestDDl = new THTE_DDL();
  public requestSearch = new THTE_ApplicationSearchModel();
  public _GlobalConstants: any = GlobalConstants;
  public requestUser = new BTER_EM_GetPersonalDetailByUserID();
  public _enumExamStudentStatus = enumExamStudentStatus;
  public request = new BTER_EM_AddStaffDetailsDataModel();
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public PostList: any = [];
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
  public showJoiningStatusColumn: boolean = false;


  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public teacherHigherEducationApplicationSaveRequest = new TeacherHigherEducationApplicationSaveModel();

  public ApplyTeacherHigerTechnicalEducationFromGroup!: FormGroup;
  public StaffTypeList: any[] = [];//ddl
  public CategoryOfApplyCourseInstituteList: any[] = [];//ddl
  public GetAllAppliedCoursesDDLList: any[] = [];//ddl
  public GetAllInstitutionalsDDLList: any[] = [];//ddl
  public THTE_ApplicationList: any[] = [];//ddl
  public UserRequestHistoryList: any[] = [];
  public InstituteMasterDDL: any[] = [];
  public teacherHigherEducationApplicationRequest = new TeacherHigherEducationApplicationRequestModel();
  public IsYear: boolean = false;
  public YearMessage: string = '';

  constructor(private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    public teacherHigherEducationApplicationService: TeacherHigherEducationApplicationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.ApplyTeacherHigerTechnicalEducationFromGroup = this.formBuilder.group({
      teacherName: [{ value: '', disabled: true }, [Validators.required]],
      dOB: [{ value: '', disabled: true }, [Validators.required]],
      joiningDate: [{ value: '', disabled: true }, [Validators.required]],
      appliedCourse: ['', [DropdownValidators]],
      // appliedInstitute: ['', [DropdownValidators]],
      appliedInstitute: ['',[Validators.required]],
      pHDStatus: ['',],
      appliedInstituteDistance: ['', [Validators.required]],
      appliedInstituteCategory: ['', [DropdownValidators]],
      appliedInstituteSubCategory: [''],
      QualificationAtJoining: [{ value: '', disabled: true }],
      QualificationAfterJoining: [{ value: '', disabled: true }]
    });
    this.ButtonText = "Save";
    //session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.teacherHigherEducationApplicationSaveRequest.AppliedInstitute = "";
    //load data
    await this.GetPersonalDetailByUserID();
    await this.GetAllAppliedCoursesDDL();
    await this.GetInstituteMaster();
    await this.GetTHTE_ApplicationData();
  }

  get _ApplyTeacherHigerTechnicalEducationFromGroup() { return this.ApplyTeacherHigerTechnicalEducationFromGroup.controls; }

  async GetPersonalDetailByUserID() {
    debugger
    try {

      this.loaderService.requestStarted();
      this.requestUser.SSOID = this.sSOLoginDataModel.SSOID;
      this.requestUser.StaffUserID = this.sSOLoginDataModel.UserID;
      await this.teacherHigherEducationApplicationService.THTE_GetStaffPersonalDetailByUserID(this.requestUser).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.request = data.Data[0];
          console.log("GetPersonalDetailByUserID", this.request);
          debugger
          this.teacherHigherEducationApplicationSaveRequest.TeacherName = this.request.Name;
          this.teacherHigherEducationApplicationSaveRequest.DOB = this.request.DateOfBirth;
          this.teacherHigherEducationApplicationSaveRequest.JoiningDate = this.request.DateOfJoining;
          this.teacherHigherEducationApplicationSaveRequest.QualificationAtJoining = this.request.QualificationAtJoining;
          this.teacherHigherEducationApplicationSaveRequest.QualificationAfterJoining = this.request.QualificationAfterJoining;

        }



      }, error => console.error(error))

      const joiningDateValue = this.teacherHigherEducationApplicationSaveRequest.JoiningDate;

      if (joiningDateValue) {
        const joiningDate = new Date(joiningDateValue);
        const today = new Date();

        // Calculate difference in years
        const diffInMs = today.getTime() - joiningDate.getTime();
        const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25); // Approx years

        if (diffInYears < 3) {
          this.toastr.warning("Joining date must be at least 3 years before or equal to today's date.");
          this.IsYear = false;
          this.YearMessage ="Joining date must be at least 3 years before or equal to today's date"
        }
        else {
          this.IsYear = true;
          this.YearMessage = "You can apply for higher education"
          this.toastr.success("You can apply for higher education .");
        }

      }

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  GetInstituteMaster() {
    //const officeList = [
    //  { InstituteID: 10001, InstituteName: 'DTE', OfficeTypeID :17},
    //  { InstituteID: 10002, InstituteName: 'BTER', OfficeTypeID: 18 },
    //  { InstituteID: 10003, InstituteName: 'TTC', OfficeTypeID: 19 }
    //];

    this.commonMasterService.InstituteMaster(
      this.sSOLoginDataModel.DepartmentID,
      this.sSOLoginDataModel.Eng_NonEng,
      this.sSOLoginDataModel.EndTermID
    ).then((response: any) => {
      const instituteList = Array.isArray(response?.Data) ? response.Data : [];
      this.InstituteMasterDDL = instituteList;
      //this.InstituteMasterDDL = officeList.concat(instituteList);
    });
  }
  async GetAllAppliedCoursesDDL() {
    try {
      await this.teacherHigherEducationApplicationService.GetAllAppliedCoursesDDL(this.requestDDl)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetAllAppliedCoursesDDLList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async getAppliedCoursesByIDDDLFill() {
    debugger

    this.GetCategoryOfApplyCourseInstitute();
  }

  async GetCategoryOfApplyCourseInstitute() {
    try {
      debugger
      await this.teacherHigherEducationApplicationService.GetCategoryOfApplyCourseInstitute(this.requestDDl)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryOfApplyCourseInstituteList = data['Data'];
          this.CategoryOfApplyCourseInstituteList=this.CategoryOfApplyCourseInstituteList.filter((item: any) => item.AppiedSubCatID == this.teacherHigherEducationApplicationSaveRequest.AppliedCourse);
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }




  async GetAllInstitutionalsDDL() {
    try {
      await this.teacherHigherEducationApplicationService.GetAllInstitutionalsDDL(this.requestDDl)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetAllInstitutionalsDDLList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }



  async AC_appliedInstituteCategoryDDl() {
   
        if (this.teacherHigherEducationApplicationSaveRequest.AppliedInstituteCourseCategory == 3) {
          await this.GetAllInstitutionalsDDL();

          this.ApplyTeacherHigerTechnicalEducationFromGroup.controls['appliedInstituteSubCategory'].updateValueAndValidity();

        } else {
          this.ApplyTeacherHigerTechnicalEducationFromGroup.controls['appliedInstituteSubCategory'].clearValidators();
          this.teacherHigherEducationApplicationSaveRequest.AppliedInstituteSubCategory = 0;
        }

        this.ApplyTeacherHigerTechnicalEducationFromGroup.controls['appliedInstituteSubCategory'].updateValueAndValidity();


        if (this.teacherHigherEducationApplicationSaveRequest.AppliedInstituteCourseCategory == 2 || this.teacherHigherEducationApplicationSaveRequest.AppliedInstituteCourseCategory == 4) {
          this.teacherHigherEducationApplicationSaveRequest.PHDStatusSt = 'Yes';
        } else {
          this.teacherHigherEducationApplicationSaveRequest.PHDStatusSt = 'No';
        }
    }


    


  

  async GetTHTE_ApplicationData() {
    try {
     
      this.requestSearch.StaffID = this.sSOLoginDataModel.StaffID;
      await this.teacherHigherEducationApplicationService.GetTHTE_ApplicationData(this.requestSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.THTE_ApplicationList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }



  async btn_Clear() {
    //clear
    this.teacherHigherEducationApplicationSaveRequest = new TeacherHigherEducationApplicationSaveModel();
  }

  openDatePicker(event: any) {
    event.target.showPicker();
  }

  async SaveTeacherHighEduApp() {
    try {
      debugger
      this.isSubmitted = true;

      if (this.ApplyTeacherHigerTechnicalEducationFromGroup.invalid) {
        return
      }


      if (this.teacherHigherEducationApplicationSaveRequest.PHDStatusSt == "Yes") {
        this.teacherHigherEducationApplicationSaveRequest.PHDStatus = 1;
      }
      else {
        this.teacherHigherEducationApplicationSaveRequest.PHDStatus = 0;
      }


     
      this.teacherHigherEducationApplicationSaveRequest.CreatedBy = this.sSOLoginDataModel.UserID;
      this.teacherHigherEducationApplicationSaveRequest.StaffID = this.sSOLoginDataModel.StaffID;
      this.teacherHigherEducationApplicationSaveRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.teacherHigherEducationApplicationSaveRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      debugger
      //save
      await this.teacherHigherEducationApplicationService.SaveTeacherHighEduApp(this.teacherHigherEducationApplicationSaveRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.Reset();
            this.GetTHTE_ApplicationData();
            window.location.reload(); 
            this.ButtonText = "Save";
          } else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message);
          } else {
            this.toastr.error(this.Message);
            console.log(this.ErrorMessage);
          }
        }, (error: any) => console.error(error)
        );
    } catch (ex) {
      console.log(ex);
      console.log(this.ErrorMessage);
    }
  }


  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.THTE_ApplicationList].slice(this.startInTableIndex, this.endInTableIndex);
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

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.THTE_ApplicationList.length;
  }

  async EditInfo(id: number) {
    try {
      debugger
      this.loaderService.requestStarted();
      this.ButtonText = "Update";
      this.requestSearch.THTEAppID = id;

      const data: any = await this.teacherHigherEducationApplicationService.GetTHTE_ApplicationByID(this.requestSearch);

      this.State = data.State;
      this.Message = data.Message;
      this.ErrorMessage = data.ErrorMessage;

      if (this.State === EnumStatus.Success) {
        if (data.Data) {
          let jsonResult;

          jsonResult = data.Data;

          this.teacherHigherEducationApplicationSaveRequest = {
            THTEAppID: jsonResult.THTEAppID,
            StaffID: jsonResult.StaffID,
            SSOID: jsonResult.SSOID,
            TeacherName: jsonResult.TeacherName,
            DOB: jsonResult.DOB ? jsonResult.DOB.split('T')[0] : '',
            JoiningDate: jsonResult.JoiningDate ? jsonResult.JoiningDate.split('T')[0] : '',
            AppliedCourse: jsonResult.AppliedCourse,
            AppliedInstitute: jsonResult.AppliedInstitute,
            PHDStatus: jsonResult.PHDStatus,
            PHDStatusSt: jsonResult.PHDStatus === 1 ? 'Yes' : 'No',
            AppliedInstituteDistance: jsonResult.AppliedInstituteDistance,
            AppliedInstituteCourseCategory: jsonResult.AppliedInstituteCourseCategory,
            AppliedInstituteSubCategory: jsonResult.AppliedInstituteSubCategory,
            Remark: jsonResult.Remark,
            CreatedBy: jsonResult.CreatedBy,
            InstituteID: jsonResult.InstituteID,
            QualificationAtJoining:'',
            QualificationAfterJoining:''
          };
          await this.getAppliedCoursesByIDDDLFill();

        } else {
          this.toastr.error('Data not found.');
        }
      } else {
        this.toastr.error(this.Message);
        console.error(this.ErrorMessage);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  CloseModalRequestHistorylist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }


  Reset() {
    this.teacherHigherEducationApplicationSaveRequest = new TeacherHigherEducationApplicationSaveModel();
    this.isSubmitted = false;
  }

  async THTEAppDelete(ID: number) {

    this.requestSearch.THTEAppID = ID;
    await this.teacherHigherEducationApplicationService.DeleteTHTE_ApplicationByID(this.requestSearch)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (data.State == EnumStatus.Success) {
          this.toastr.success(this.Message)
          this.GetTHTE_ApplicationData();
        }else {
          this.toastr.error(this.Message);
          console.log(this.ErrorMessage);
        }
      }, (error: any) => console.error(error)
      );
  }

  async onUserRequestHistorylist(model: any, THTEAppID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.requestSearch.THTEAppID = THTEAppID
      
      await this.teacherHigherEducationApplicationService.THTE_GrtApplicationStatusHistory(this.requestSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserRequestHistoryList = data.Data;
          this.UserRequestHistoryList = this.UserRequestHistoryList.filter((item: any) => item.StatusID == 1340 || item.StatusID == 1345)
          this.showJoiningStatusColumn = this.UserRequestHistoryList?.some(r => r.RequestTypeID === 1);
          this.totalRecord = this.UserRequestHistoryList[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        }, (error: any) => console.error(error))

      
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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
}

