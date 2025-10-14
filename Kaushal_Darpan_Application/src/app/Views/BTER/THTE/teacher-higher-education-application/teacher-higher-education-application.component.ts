import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
import { TeacherHigherEducationApplicationRequestModel, TeacherHigherEducationApplicationSaveModel, THTE_DDL } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
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

  public _EnumRole = EnumRole;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public IsShowViewStudent: boolean = false;
  public requestDDl = new THTE_DDL();
  public _GlobalConstants: any = GlobalConstants;
  public requestUser = new BTER_EM_GetPersonalDetailByUserID();
  public _enumExamStudentStatus = enumExamStudentStatus;
  public request = new BTER_EM_AddStaffDetailsDataModel();

  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public teacherHigherEducationApplicationSaveRequest = new TeacherHigherEducationApplicationSaveModel();

  public ApplyTeacherHigerTechnicalEducationFromGroup!: FormGroup;
  public StaffTypeList: any[] = [];//ddl
  public CategoryOfApplyCourseInstituteList: any[] = [];//ddl
  public teacherHigherEducationApplicationRequest = new TeacherHigherEducationApplicationRequestModel();

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
  ) { }

  async ngOnInit() {
    this.ApplyTeacherHigerTechnicalEducationFromGroup = this.formBuilder.group({
      teacherName: [{ value: '', disabled: true }, [Validators.required]],
      dOB: [{ value: '', disabled: true }, [Validators.required]],
      joiningDate: [{ value: '', disabled: true }, [Validators.required]],
      appliedCourse: ['', [DropdownValidators]],
      appliedInstitute: ['', [Validators.required]],
      pHDStatus: ['', [Validators.required]],
      appliedInstituteDistance: ['', [Validators.required]],
      appliedInstituteCategory: ['', [DropdownValidators]],
      appliedInstituteSubCategory: [''],
    });

    //session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //load data
    await this.GetPersonalDetailByUserID();
    await this.GetCategoryOfApplyCourseInstitute();
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

        }



      }, error => console.error(error))

      


    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetCategoryOfApplyCourseInstitute() {
    try {
      await this.teacherHigherEducationApplicationService.GetCategoryOfApplyCourseInstitute(this.requestDDl)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryOfApplyCourseInstituteList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetEnrolledStudent_Promoted() {
    try {
      this.isSubmitted = true;

      //session
      this.teacherHigherEducationApplicationRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.teacherHigherEducationApplicationRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.teacherHigherEducationApplicationRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.teacherHigherEducationApplicationRequest.RoleID = this.sSOLoginDataModel.RoleID;

      //call
      await this.teacherHigherEducationApplicationService.GetEnrolledStudent_Promoted(this.teacherHigherEducationApplicationRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.teacherHigherEducationApplicationSaveRequest = data['Data'];
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
      
      //save
      await this.teacherHigherEducationApplicationService.SaveTeacherHighEduApp(this.teacherHigherEducationApplicationSaveRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
          } else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
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

}
