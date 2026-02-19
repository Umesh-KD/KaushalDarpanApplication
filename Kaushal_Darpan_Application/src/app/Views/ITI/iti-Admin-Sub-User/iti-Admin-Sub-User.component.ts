import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants, EnumStatus, EnumRole } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { AdminUserSearchModel, AdminUserDetailModel } from '../../../Models/AdminUserDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AdminUserService } from '../../../Services/BTERAdminUser/admin-user.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIAdminUserService } from '../../../Services/ITI/ITI-Admin-User/itiadmin-user.service';
import { ITIAdminUserDetailModel, ITIAdminUserSearchModel } from '../../../Models/ITI/ITIAdminUserDataModel';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-iti-Admin-Sub-User',
  templateUrl: './iti-Admin-Sub-User.component.html',
  styleUrl: './iti-Admin-Sub-User.component.css',
  standalone: false
})
export class itiAdminSubUserComponent {
  public UserID: number = 0;
  public UserAdditionID: number = 0;
  public ProfileID: number = 0;
  public Table_SearchText: string = "";
  public searchRequest = new ITIAdminUserSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new ITIAdminUserDetailModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsView: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public AdminUserFormGroup!: FormGroup;
  public AdminUserList: any = [];
  public CollegeList: any = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public requestSSoApi = new CommonVerifierApiDataModel();
  public Isverifed: boolean = false
  public _enumrole = EnumRole
  constructor(private commonMasterService: CommonFunctionService,
    private adminUserService: ITIAdminUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router,
    private modalService: NgbModal, private toastr: ToastrService,
    private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {

    this.AdminUserFormGroup = this.formBuilder.group(
      {
        txtUserName: [{ value: '', disabled: true }, Validators.required],

        txtUserEmail: ['', Validators.required],
        RoleID: ['', [DropdownValidators]],
        InstituteID: [{ value: '', disabled: false }, [DropdownValidators]],
        txtSSOID: ['', [Validators.required, Validators.pattern(GlobalConstants.SSOIDPattern)]],
        //txtMobileNo: ['', Validators.required],
        txtMobileNo: [{ value: '', disabled: true }, Validators.required],
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    await this.GetAllData();
    await this.GetAllDataITI();


  }
  get _AdminUserFormGroup() { return this.AdminUserFormGroup.controls; }

  maskMobileNumber(mobile: string): string {
    if (mobile && mobile.length > 4) {
      const masked = mobile.slice(0, -4).replace(/\d/g, '*');
      return `${masked}${mobile.slice(-4)}`;
    }
    return mobile;
  }



  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.sSOLoginDataModel.EndTermID = this.sSOLoginDataModel.EndTermID
      this.sSOLoginDataModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      

      this.loaderService.requestStarted();
      await this.adminUserService.getAlladminUserData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AdminUserList = data.Data;
        console.log(this.AdminUserList, "marksheetlist")
      }, (error: any) => console.error(error))
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


  async GetAllDataITI() {
    try {



      this.loaderService.requestStarted();
      await this.commonMasterService.Iticollege(2, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID,0).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        debugger
        this.CollegeList = data.Data;
        console.log(this.AdminUserList, "marksheetlist")
      }, (error: any) => console.error(error))
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



  // get all data
  async ClearSearchData() {
    this.searchRequest = new ITIAdminUserSearchModel();
    this.AdminUserList = [];
    await this.GetAllData();

  }

  async ViewandUpdate(content: any, UserID: number, UserAdditionID: number, ProfileID: number,InstituteID:number,RoleID:number=0) {

    //const initialState = {
    //  MarksheetIssueDataId: MarksheetIssueDataId,
    //  Type: "Admin",
    //};
    debugger
    this.UserID = UserID;
    this.UserAdditionID = UserAdditionID;
    this.ProfileID = ProfileID;
    this.request.ProfileID = ProfileID;
    this.request.UserAdditionID = ProfileID;
    this.request.InstituteID = InstituteID
    this.request.RoleID = RoleID

    if (this.UserID > 0 || this.UserAdditionID > 0 || this.ProfileID > 0) {
      await this.GetById();
      this.IsView = true;
    }
    else {
      this.IsView = false;
    }

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

  }

  //CloseModalPopup() {
  //  this.modalService.dismissAll();
  //  this.ResetControls();
  //}

  async GetById() {
    try {
      ;
      this.loaderService.requestStarted();
      await this.adminUserService.GetById(this.UserID, this.UserAdditionID, this.ProfileID)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "rrrrrrrr");
          ;
          //this.request = data['Data'];
          this.request.Name = data['Data']['Name'];
          this.request.MobileNo = data['Data']['MobileNo'];
          this.request.SSOID = data['Data']["SSOID"];
          this.request.Email = data['Data']["Email"];

          console.log(this.request.InstituteID)

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

  async DeleteById(UserID: number, UserAdditionID: number, ProfileID: number) {

    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.adminUserService.DeleteById(UserID, UserAdditionID, ProfileID)

              .then(async (data: any) => {
                ;
                data = JSON.parse(JSON.stringify(data));
                console.log(data, "deleeeet");
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(data.ErrorMessage)
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
      });
  }



  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {
    this.Isverifed = false
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      this.request.SSOID = ''
      this.request.MobileNo = ''
      this.request.Email = ''
      this.request.Name = ''
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

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            this.request.Name = parsedData.displayName;
            this.request.MobileNo = parsedData.mobile;
            this.request.SSOID = parsedData.SSOID;
            this.request.Email = parsedData.mailPersonal;
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


}
