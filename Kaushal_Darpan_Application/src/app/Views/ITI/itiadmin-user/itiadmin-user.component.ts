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

@Component({
  selector: 'app-itiadmin-user',
  templateUrl: './itiadmin-user.component.html',
  styleUrl: './itiadmin-user.component.css',
  standalone: false
})
export class ITIAdminUserComponent {
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
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

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
        txtUserName: ['', Validators.required],
        txtUserEmail: ['', Validators.required],
        txtSSOID: ['', [Validators.required, Validators.pattern(GlobalConstants.SSOIDPattern)]],
        txtMobileNo: ['', Validators.required],
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    await this.GetAllData();


  }
  get _AdminUserFormGroup() { return this.AdminUserFormGroup.controls; }

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
      ;
      this.isSubmitted = true;
      if (this.AdminUserFormGroup.invalid) {
        console.log("errro")
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        this.request.InstituteID = this.sSOLoginDataModel.InstituteID
      }

      //save
      await this.adminUserService.SaveData(this.request)
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
    this.request = new ITIAdminUserDetailModel();
    this.isSubmitted = false;

  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.sSOLoginDataModel.EndTermID = this.sSOLoginDataModel.EndTermID
      this.sSOLoginDataModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      }

      this.loaderService.requestStarted();
      await this.adminUserService.GetAllData(this.searchRequest).then((data: any) => {
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


  // get all data
  async ClearSearchData() {
    this.searchRequest = new ITIAdminUserSearchModel();
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
      await this.adminUserService.GetById(this.UserID, this.UserAdditionID, this.ProfileID)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "rrrrrrrr");
          ;
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
}
