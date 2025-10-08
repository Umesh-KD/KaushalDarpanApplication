import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { GlobalConstants, EnumRole, enumExamStudentStatus, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { OTPModalComponent } from '../otpmodal/otpmodal.component';
import { TeacherHigherEducationApplicationService } from '../../Services/teacher-higher-education-application/teacher-higher-education-application.service';
import { TeacherHigherEducationApplicationRequestModel, TeacherHigherEducationApplicationSaveModel } from '../../Models/TeacherHigherEducationApplicationDataModel';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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

  public _GlobalConstants: any = GlobalConstants;

  public _enumExamStudentStatus = enumExamStudentStatus;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public teacherHigherEducationApplicationSaveRequest = new TeacherHigherEducationApplicationSaveModel();

  public ApplyTeacherHigerTechnicalEducationFromGroup!: FormGroup;
  public StaffTypeList: any[] = [];//ddl
  public teacherHigherEducationApplicationRequest = new TeacherHigherEducationApplicationRequestModel();

  constructor(private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    public teacherHigherEducationApplicationService: TeacherHigherEducationApplicationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    this.ApplyTeacherHigerTechnicalEducationFromGroup = this.formBuilder.group({
      teacherName: ['', [Validators.required]],
      dOB: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      appliedCourse: ['', [DropdownValidators]],
      appliedInstitute: ['', [Validators.required]],
      pHDStatus: ['', [Validators.required]],
      appliedInstituteDistance: ['', [Validators.required]],
      appliedInstituteCategory: ['', [DropdownValidators]],
      appliedInstituteSubCategory: ['', [DropdownValidators]],
    });

    //session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //load data
    await this.GetCommonMasterDDLByType('ExamStudentStatus');
  }

  async GetCommonMasterDDLByType(type: string) {
    try {
      await this.commonMasterService.GetCommonMasterDDLByType(type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StaffTypeList = data['Data'];
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

  async openOTPModal() {

    this.Swal2.Confirmation("Are you sure you want to Verify ?",
      async (result: any) => {
        if (result.isConfirmed) {
          this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

          // await for open model
          await this.childComponent.OpenOTPPopup();

          // await OTP verification
          await this.childComponent.waitForVerification();

          await this.SaveTeacherHighEduApp();
        }
      });
  }

  async SaveTeacherHighEduApp() {
    try {

      this.isSubmitted = true;

      if (this.ApplyTeacherHigerTechnicalEducationFromGroup.invalid) {
        return
      }
      //set extra

      this.Swal2.ConfirmationWithRemark("Are you sure to continue?",
        async (result: any) => {
          //confirmed

          this.teacherHigherEducationApplicationSaveRequest.Remark = result;
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

        });
    } catch (ex) {
      console.log(ex);
      console.log(this.ErrorMessage);
    }
  }

}
