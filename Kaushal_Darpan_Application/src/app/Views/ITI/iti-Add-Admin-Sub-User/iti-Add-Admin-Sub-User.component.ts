import { Component, ViewChild } from '@angular/core';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ItiSanctionOrderList } from '../../../Models/ITI/ItiReportDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ITIAdminUserDetailModel } from '../../../Models/ITI/ITIAdminUserDataModel';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';
import { ITIAdminUserService } from '../../../Services/ITI/ITI-Admin-User/itiadmin-user.service';
import { Router } from '@angular/router';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-iti-Add-Admin-Sub-User',
  standalone: false,
  templateUrl: './iti-Add-Admin-Sub-User.component.html',
  styleUrl: './iti-Add-Admin-Sub-User.component.css'
})
export class itiAddAdminSubUserComponent {

  public request = new ItiSanctionOrderList()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ScholarshipFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  
  //public CollegeList: any = [];
  public AdminUserList: any = [];
  public AdminUserFormGroup!: FormGroup;
  public adminRequest = new ITIAdminUserDetailModel()
  public Isverifed: boolean = false
  public requestSSoApi = new CommonVerifierApiDataModel();
  public IsView: boolean = false;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  constructor(private adminUserService: ITIAdminUserService,
    private commonMasterService: CommonFunctionService, 
    private toastr: ToastrService, private routers: Router,
    private loaderService: LoaderService, private formBuilder: FormBuilder, public appsettingConfig: AppsettingService,
   ) {  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.AdminUserFormGroup = this.formBuilder.group(
      {
        txtUserName: [{ value: '', disabled: true }, Validators.required],
        txtUserEmail: ['', Validators.required],
        RoleID: ['', [DropdownValidators]],
        //InstituteID: [{ value: '', disabled: false }, [DropdownValidators]],
        txtSSOID: ['', [Validators.required, Validators.pattern(GlobalConstants.SSOIDPattern)]],
        txtMobileNo: [{ value: '', disabled: true }, Validators.required],
      });

    //this.GetAllDataITI();
  }
  get _AdminUserFormGroup() { return this.AdminUserFormGroup.controls; }

 
  //async GetAllDataITI() {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.Iticollege(2, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, 0).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      debugger
  //      this.CollegeList = data.Data;
  //      console.log(this.AdminUserList, "Admin User List")
  //    }, (error: any) => console.error(error))
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async SaveData() {
    debugger
    try {
      if (this.Isverifed == false) {

        this.toastr.error("Please Verify SSOID")
        return
      }
      if (this.adminRequest.SSOID == '') {
        this.toastr.error("Please Enter Valid SSOID")
        return
      }

      this.isSubmitted = true;
      if (this.AdminUserFormGroup.invalid) {
        console.log("errro")
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.adminRequest.ModifyBy = this.sSOLoginDataModel.UserID;
      this.adminRequest.CreatedBy = this.sSOLoginDataModel.UserID;
      this.adminRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.adminRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.openOTP();
      await this.adminUserService.adminUserDataSave(this.adminRequest)
        .then((data: any) => {
          ;
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.routers.navigate(['/Admin-Sub-User'])  
          }
          else {
            this.toastr.error(this.ErrorMessage)
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

  ResetControls() {
    this.adminRequest = new ITIAdminUserDetailModel();
    this.isSubmitted = false;

  }

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {
    this.Isverifed = false
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      this.adminRequest.SSOID = ''
      this.adminRequest.MobileNo = ''
      this.adminRequest.Email = ''
      this.adminRequest.Name = ''
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';
    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username; 
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;

    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data);
          if (parsedData != null) {
            this.adminRequest.Name = parsedData.displayName;
            this.adminRequest.MobileNo = parsedData.mobile;
            this.adminRequest.SSOID = parsedData.SSOID;
            this.adminRequest.Email = parsedData.mailPersonal;
            this.Isverifed = true

          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }


  async openOTP() {
    debugger
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    // await for open model
    await this.childComponent.OpenOTPPopup();
    // await OTP verification
    await this.childComponent.waitForVerification();

  }

}
