import { Component, OnInit } from '@angular/core';
import { AdminUserDetailModel, AdminUserSearchModel } from '../../../Models/AdminUserDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { AdminUserService } from '../../../Services/BTERAdminUser/admin-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

@Component({
    selector: 'app-admin-user',
    templateUrl: './admin-user.component.html',
    styleUrls: ['./admin-user.component.css'],
    standalone: false
})

export class AdminUserComponent implements OnInit {
  public UserID: number = 0;
  public UserAdditionID: number = 0;
  public ProfileID: number = 0;
  public Table_SearchText: string = "";
  public searchRequest = new AdminUserSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new AdminUserDetailModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsView: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public AdminUserFormGroup!: FormGroup;
  public AdminUserList: any = [];
  public RoleMasterList1: any = [];
  public RoleMasterList: any = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public SubMasterList: any = []
  public _enumrole = EnumRole
  constructor(private commonMasterService: CommonFunctionService,
    private adminUserService: AdminUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router,
    private modalService: NgbModal, private toastr: ToastrService,
    private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {

    this.AdminUserFormGroup = this.formBuilder.group(
      {
        txtUserName: ['', Validators.required],
        txtUserEmail: ['', Validators.required],
        txtSSOID: ['', [Validators.required, Validators.pattern(GlobalConstants.SSOIDPattern)]],
        txtMobileNo: ['', Validators.required],
         ddlRole: ['', Validators.required],
        IsCitizenQueryUser: [false],
        QueryType: ['', [DropdownValidators]]
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    await this.GetAllData();
    await this.GetMasterSubDDL();
    await this.commonMasterService.GetRoleMasterDDL(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data['Data'];
        console.log(this.RoleMasterList1)
        if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {

          this.RoleMasterList = this.RoleMasterList.filter((e: any) => e.ID == EnumRole.HOD_Eng)
        } else if (this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
          this.RoleMasterList = this.RoleMasterList.filter((e: any) => e.ID == EnumRole.HOD_NonEng)
        }

     
      }, error => console.error(error));
    
  }
  get _AdminUserFormGroup() { return this.AdminUserFormGroup.controls; }

  refreshBranchRefValidation()
  {
    
    if (this.request.IsCitizenQueryUser)
    {
      this.AdminUserFormGroup.get('QueryType')?.setValidators([DropdownValidators]);
    }
    else
    {
      // clear
      this.AdminUserFormGroup.get('QueryType')?.clearValidators();
    }
    
    this.AdminUserFormGroup.get('QueryType')?.updateValueAndValidity();


    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.AdminUserFormGroup.get('ddlRole')?.setValidators([DropdownValidators]);
    } else {
      this.AdminUserFormGroup.get('ddlRole')?.clearValidators();
    }
    this.AdminUserFormGroup.get('ddlRole')?.updateValueAndValidity();

  }


  maskMobileNumber(mobile: string): string {
    if (mobile && mobile.length > 4) {
      // Mask all but the last 4 digits
      const masked = mobile.slice(0, -4).replace(/\d/g, '*');
      return `${masked}${mobile.slice(-4)}`;
    }
    return mobile; // Return original if length is less than or equal to 4
  }

  async GetMasterSubDDL() {
    var CommnID = 0

    if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {
      CommnID = 89;
    }
    else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE || this.sSOLoginDataModel.RoleID == EnumRole.DTENON) {
      CommnID = 88;
    }
    else if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      CommnID = 87;
      //this.searchRequest.PolytechnicID = this.sSOLoginDataModel.InstituteID;
    }
    else {
      CommnID = 0;
    }
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectForCitizenSugg(CommnID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubMasterList = data['Data'];
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

  async SaveData() {
    try {
      
      this.refreshBranchRefValidation();
      this.isSubmitted = true;

      
      if (this.AdminUserFormGroup.invalid) {
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng

      this.request.RoleID = this.sSOLoginDataModel.RoleID

      if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        this.request.InstituteID = this.sSOLoginDataModel.InstituteID
      }

      if (this.sSOLoginDataModel.RoleID != EnumRole.Principal && this.sSOLoginDataModel.RoleID != EnumRole.PrincipalNon) {
        this.request.UserRole = this.sSOLoginDataModel.RoleID
      }
      //save
      await this.adminUserService.SaveData(this.request)
        .then((data: any) => {
          ;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.CloseModalPopup();
            this.GetAllData();
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

  // reset
  ResetControls() {
    this.request = new AdminUserDetailModel();
    this.isSubmitted = false;

  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      }
      if (this.sSOLoginDataModel.RoleID != EnumRole.Principal && this.sSOLoginDataModel.RoleID != EnumRole.PrincipalNon) {
        this.searchRequest.UserRole = this.sSOLoginDataModel.RoleID
      } else {
        if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
          this.searchRequest.UserRole = EnumRole.HOD_Eng
        } else {
          this.searchRequest.UserRole = EnumRole.HOD_NonEng
        }
      }
     
     
      this.loaderService.requestStarted();
      await this.adminUserService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AdminUserList = data.Data;
        //if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {

        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID == 7)
        //} else if (this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID == 13)
        //}

        //if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {

        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID == 7)
        //} else if (this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID == 13)
        //}
        //if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {
        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID != 13 && e.RoleID!=7)
        //}

        console.log(data.Data)
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
    this.searchRequest = new AdminUserSearchModel();
    this.AdminUserList = [];

  }
  
  async ViewandUpdate(content: any, UserID: number, UserAdditionID: number, ProfileID: number) {

    //const initialState = {
    //  MarksheetIssueDataId: MarksheetIssueDataId,
    //  Type: "Admin",
    //};
    this.UserID = UserID;
    this.UserAdditionID = UserAdditionID;
    this.ProfileID = ProfileID;

    if (this.UserID > 0 || this.UserAdditionID > 0 || this.ProfileID > 0) {
      await this.GetById();
      this.IsView = true;
    }
    else {
      this.IsView = false;
    }

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.ResetControls();
  }

  async GetById() {
    try {
      ;
      this.loaderService.requestStarted();

      this.searchRequest.UserID = this.UserID
      this.searchRequest.UserAdditionID = this.UserAdditionID
      this.searchRequest.ProfileID = this.ProfileID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      await this.adminUserService.GetById(this.searchRequest)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];
          this.request.Name =  data['Data']['Name'];
          this.request.MobileNo = data['Data']['MobileNo'];
          this.request.SSOID = data['Data']["SSOID"];
          this.request.Email = data['Data']["Email"];


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

    this.searchRequest.UserID =UserID
    this.searchRequest.UserAdditionID =UserAdditionID
    this.searchRequest.ProfileID = ProfileID
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.adminUserService.DeleteById(this.searchRequest)
            
              .then(async (data: any) => {
                ;
                data = JSON.parse(JSON.stringify(data));
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
}
