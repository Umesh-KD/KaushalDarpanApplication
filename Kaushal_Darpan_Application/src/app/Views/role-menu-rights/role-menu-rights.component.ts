import { Component, OnInit } from '@angular/core';
import { UserRoleRightsDataModel } from '../../Models/RoleMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { AddRoleMasterService } from '../../Services/RoleMaster/add-role-master.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { RoleMenuRightsService } from '../../Services/RoleMenuRight/rolemenurights.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { EnumStatus } from '../../Common/GlobalConstants';

@Component({
    selector: 'app-role-menu-rights',
    templateUrl: './role-menu-rights.component.html',
    styleUrls: ['./role-menu-rights.component.css'],
    standalone: false
})

export class RoleMenuRightsComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public MenuList: UserRoleRightsDataModel[] = [];
  public SelectedRoleID: number = 0;
  public All_U_View: boolean = false;
  public All_U_Add: boolean = false;
  public All_U_Update: boolean = false;
  public All_U_Delete: boolean = false;
  public All_U_Print: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public DepartmentID: number = 0;

  constructor(
    private commonMasterService: CommonFunctionService, 
    private roleMenuRightsService: RoleMenuRightsService,
    private addRoleMasterService: AddRoleMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder, 
    private router: ActivatedRoute, 
    private routers: Router, 
    private _fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.SelectedRoleID = Number(this.router.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllMenuList();
  }
  async GetAllMenuList() {
    try {
      //this.loaderService.requestStarted();
      this.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      let courseTypeId = this.sSOLoginDataModel.Eng_NonEng;
      await this.roleMenuRightsService.GetAllMenuUserRoleRightsRoleWise(this.SelectedRoleID, this.DepartmentID, courseTypeId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //console.log('Test Menu');
          //console.log(data['Data']);
          //console.log('Test Menu');
          this.MenuList = data['Data'];
          console.log("MenuList",this.MenuList);
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 100);
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

    ///Check Validators
    //Show Loading 
    this.loaderService.requestStarted();
    try {
      for (let item of this.MenuList) {
        item.RoleID = this.SelectedRoleID;
        item.ModifyBy = this.sSOLoginDataModel.UserID;
      }

      console.log("MenuList",this.MenuList);
      await this.roleMenuRightsService.SaveUserRightData(this.MenuList)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.routers.navigate(['/rolemaster']);
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
