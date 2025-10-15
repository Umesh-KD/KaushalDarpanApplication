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
import { EnumStatus, GlobalConstants, EnumRole } from '../../../Common/GlobalConstants';
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
  public _enumrole = EnumRole;
  public InstituteMasterDDLList: any = []

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
        InstituteID: ['', [DropdownValidators]],
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID

    // load
    await this.GetAllData();
    await this.commonMasterService.GetRoleMasterDDL(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data['Data'];
        console.log(this.RoleMasterList1)

        // set role ddl according to login
        if (this.sSOLoginDataModel.RoleID == this._enumrole.Principal) {
          this.RoleMasterList = this.RoleMasterList.filter((e: any) => e.ID == this._enumrole.HOD_Eng)
        } else if (this.sSOLoginDataModel.RoleID == this._enumrole.PrincipalNon) {
          this.RoleMasterList = this.RoleMasterList.filter((e: any) => e.ID == this._enumrole.HOD_NonEng)
        } else if (this.sSOLoginDataModel.RoleID == this._enumrole.Admin) {
          this.RoleMasterList = this.RoleMasterList.filter((e: any) => e.ID == this._enumrole.Principal)
        } else if (this.sSOLoginDataModel.RoleID == this._enumrole.AdminNon) {
          this.RoleMasterList = this.RoleMasterList.filter((e: any) => e.ID == this._enumrole.PrincipalNon)
        }
      }, error => console.error(error));

    // set institute ddl
    if (this.sSOLoginDataModel.RoleID == this._enumrole.Admin || this.sSOLoginDataModel.RoleID == this._enumrole.AdminNon) {
      await this.GetInstituteMasterDDL();
    }
  }
  get _AdminUserFormGroup() { return this.AdminUserFormGroup.controls; }

  refresRefValidation() {
    if (this.sSOLoginDataModel.RoleID == this._enumrole.Admin || this.sSOLoginDataModel.RoleID == this._enumrole.AdminNon) {
      this.AdminUserFormGroup.get('InstituteID')?.setValidators([DropdownValidators]);
    } else {
      this.AdminUserFormGroup.get('InstituteID')?.clearValidators();
    }
    this.AdminUserFormGroup.get('InstituteID')?.updateValueAndValidity();
  }


  maskMobileNumber(mobile: string): string {
    if (mobile && mobile.length > 4) {
      // Mask all but the last 4 digits
      const masked = mobile.slice(0, -4).replace(/\d/g, '*');
      return `${masked}${mobile.slice(-4)}`;
    }
    return mobile; // Return original if length is less than or equal to 4
  }

  async SaveData() {
    try {

      this.refresRefValidation();
      this.isSubmitted = true;


      if (this.AdminUserFormGroup.invalid) {
        return
      }

      this.isLoading = true;

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng

      // set access role
      this.request.RoleID = this.sSOLoginDataModel.RoleID

      // set institute 
      if (this.sSOLoginDataModel.RoleID == this._enumrole.Principal || this.sSOLoginDataModel.RoleID == this._enumrole.PrincipalNon) {
        this.request.InstituteID = this.sSOLoginDataModel.InstituteID
      }

      //save
      await this.adminUserService.SaveData(this.request)
        .then(async (data: any) => {
          ;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.CloseModalPopup();
            await this.GetAllData();
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
  }

  // reset
  ResetControls() {
    this.request = new AdminUserDetailModel();
    this.isSubmitted = false;

  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      // set access role 
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;

      // set institute
      if (this.sSOLoginDataModel.RoleID == this._enumrole.Principal || this.sSOLoginDataModel.RoleID == this._enumrole.PrincipalNon) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      }

      // set data role 
      if (this.sSOLoginDataModel.RoleID == this._enumrole.Principal) {
        this.searchRequest.UserRole = this._enumrole.HOD_Eng;
      } else if (this.sSOLoginDataModel.RoleID == this._enumrole.PrincipalNon) {
        this.searchRequest.UserRole = this._enumrole.HOD_NonEng;
      } else if (this.sSOLoginDataModel.RoleID == this._enumrole.Admin) {
        this.searchRequest.UserRole = this._enumrole.Principal;
      } else if (this.sSOLoginDataModel.RoleID == this._enumrole.AdminNon) {
        this.searchRequest.UserRole = this._enumrole.PrincipalNon;
      } else {
        this.searchRequest.UserRole = 0;// invalid
      }

      // get
      await this.adminUserService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AdminUserList = data.Data;

        console.log(data.Data)
      }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }

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
      this.IsEdit = true;
    }
    else {
      this.IsView = false;
      this.IsEdit = false;
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
          this.request.Name = data['Data']['Name'];
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

    this.searchRequest.UserID = UserID
    this.searchRequest.UserAdditionID = UserAdditionID
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

  async GetInstituteMasterDDL() {
    try {
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID,
        this.sSOLoginDataModel.Eng_NonEng,
        this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          this.InstituteMasterDDLList = data.Data;
        })
    }
    catch (ex) {
      console.log(ex);
    }
  }

  set IsEdit(value: boolean) {
    //debugger
    if (this.AdminUserFormGroup) {
      const control = this.AdminUserFormGroup.get('ddlRole');
      if (value) {
        control?.disable();
      } else {
        control?.enable();
      }
    }
  }
}
