import { Component, OnInit } from '@angular/core';

import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { UserMenuRightsDataModel } from '../../Models/UserMasterDataModel';
import { UserMenuRightsService } from '../../Services/UserMenuRights/user-menu-rights.service';
import { EnumStatus } from '../../Common/GlobalConstants';
import { UserAndRoleMenuModel } from '../../Models/UserAndRoleMenuModel';

@Component({
  selector: 'app-User-menu-rights',
  templateUrl: './user-menu-rights.component.html',
  styleUrls: ['./user-menu-rights.component.css'],
  standalone: false
})

export class UserMenuRightsComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public MenuList: UserMenuRightsDataModel[] = [];
  public SelectedUserID: number = 0;
  public UserType: number = 0;
  public All_U_View: boolean = false;
  public All_U_Add: boolean = false;
  public All_U_Update: boolean = false;
  public All_U_Delete: boolean = false;
  public All_U_Print: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(
    private commonMasterService: CommonFunctionService,
    private UserMenuRightsService: UserMenuRightsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private _fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.SelectedUserID = Number(this.router.snapshot.queryParamMap.get('id')?.toString());
    this.UserType = Number(this.router.snapshot.queryParamMap.get('type')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SelectedUserID) {
      await this.GetAllMenuList(this.SelectedUserID)
    }

  }
  async GetAllMenuList(id: number) {
    try {
      this.loaderService.requestStarted();
      let model: UserAndRoleMenuModel = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        UserID: id,
        RoleID: this.sSOLoginDataModel.RoleID,
        InstituteId: this.sSOLoginDataModel.InstituteID
      };
      await this.UserMenuRightsService.GetAllMenuUserRoleRightsRoleWise(model)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.MenuList = data['Data'];
          console.log("Menu List", this.MenuList);
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }


  checkboxthView_checkboxchange($event: any, checkValuethView: boolean) {
    this.All_U_View = checkValuethView;
    for (let item of this.MenuList) {
      item.U_View = checkValuethView;
    }
  }
  checkboxthAdd_checkboxchange($event: any, checkValuethAdd: boolean) {
    this.All_U_Add = checkValuethAdd;
    for (let item of this.MenuList) {
      item.U_Add = checkValuethAdd;
    }
  }
  checkboxthUpdate_checkboxchange($event: any, checkValuethUpdate: boolean) {
    this.All_U_Update = checkValuethUpdate;
    for (let item of this.MenuList) {
      item.U_Update = checkValuethUpdate;
    }
  }
  checkboxthDelete_checkboxchange($event: any, checkValuethDelete: boolean) {
    this.All_U_Delete = checkValuethDelete;
    for (let item of this.MenuList) {
      item.U_Delete = checkValuethDelete;
    }
  }
  checkboxthPrint_checkboxchange($event: any, checkValuethPrint: boolean) {
    this.All_U_Print = checkValuethPrint;
    for (let item of this.MenuList) {
      item.U_Print = checkValuethPrint;
    }
  }

  async SaveData() {
    if (this.MenuList.length == 0) {
      this.toastr.warning("Select Menu Data.!")
      return;
    }

    this.loaderService.requestStarted();
    try {
      for (let item of this.MenuList) {
        item.UserID = this.SelectedUserID;
        item.ModifyBy = this.sSOLoginDataModel.UserID;
        //item.RoleID = this.sSOLoginDataModel.RoleID;
      }
      await this.UserMenuRightsService.SaveUserRightData(this.MenuList)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.routers.navigate(['/usermaster']);
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetControl() {
    this.All_U_View = false;
    this.All_U_Add = false;
    this.All_U_Update = false;
    this.All_U_Delete = false;
    this.All_U_Print = false;
    this.checkboxthView_checkboxchange(null, false);
    this.checkboxthAdd_checkboxchange(null, false);
    this.checkboxthUpdate_checkboxchange(null, false);
    this.checkboxthDelete_checkboxchange(null, false);
    this.checkboxthPrint_checkboxchange(null, false);
  }
}
