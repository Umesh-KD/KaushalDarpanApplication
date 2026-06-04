import { Component } from '@angular/core';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';

@Component({
  selector: 'app-usermanual',
  standalone: false,
  templateUrl: './usermanual.component.html',
  styleUrl: './usermanual.component.css'
})
export class UsermanualComponent {

  UserManualList: any[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private appsettingConfig: AppsettingService
  ) { }
  async ngOnInit(){
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      await this.GetUserManualList();
  }

//   async GetUserManualList() {
//   try {
// debugger
//     this.loaderService.requestStarted();

//     await this.commonFunctionService
//       .GetUserManualByRoleId(this.sSOLoginDataModel.RoleID)
//       .then((data: any) => {

//         data = JSON.parse(JSON.stringify(data));

//         if (data.State === 0 || data.State === 'Success') {
//           this.UserManualList = data.Data;
//         } else {
//           this.UserManualList = [];
//         }
//       });

//   } catch (error) {
//     console.error(error);
//   } finally {
//     this.loaderService.requestEnded();
//   }
// }

async GetUserManualList() {
  try {

    this.loaderService.requestStarted();

    const data: any = await this.commonFunctionService
      .GetUserManualByRoleId(this.sSOLoginDataModel.RoleID);

    if (data.State === 1) { // Success

      this.UserManualList = data.Data || [];

      console.log('usermanual', this.UserManualList);
      if (this.UserManualList.length === 0) {
        this.toastr.warning(data.Message || 'No record found.');
      }
    }
    else if (data.State === 3) { // Warning

      this.UserManualList = [];
      this.toastr.warning(data.Message);
    }
    else if (data.State === 2) { // Error

      this.UserManualList = [];
      this.toastr.error(data.ErrorMessage || data.Message);
    }

  }
  catch (error) {

    this.UserManualList = [];
    this.toastr.error('Something went wrong.');

  }
  finally {

    this.loaderService.requestEnded();

  }
}
}
