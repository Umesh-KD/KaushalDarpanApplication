import { Component } from '@angular/core';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-content-visiblity-configuration',
  standalone:false,
  templateUrl: './content-visiblity-configuration.component.html',
  styleUrl: './content-visiblity-configuration.component.css'
})
export class ContentVisiblityConfigurationComponent {

    public sSOLoginDataModel = new SSOLoginDataModel();
    visibilitySettings: any[] = [];
    endTermID: number = 1;
  
  constructor(
      private loaderService: LoaderService,
      private commonFunctionService: CommonFunctionService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder,
       private activatedRoute: ActivatedRoute,
       private routers: Router,
       private modalService: NgbModal,
      // private DateConfigService: DateConfigService,
      private Swal2: SweetAlert2,
      //private sMSMailService: SMSMailService,
      //private userMasterService: UserMasterService
  
    ) { }
  
    async ngOnInit() {
      debugger
      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      this.endTermID = this.sSOLoginDataModel.EndTermID
      this.loadVisibilitySettings();
    }
  async loadVisibilitySettings() {

  try {

    const response: any =
      await this.commonFunctionService.GetEndTermVisibilitySettings(this.endTermID);
debugger
    if (response?.State === 1 || response?.State === 'Success') {

      this.visibilitySettings = response.Data;
    }

  } catch (error) {
    console.log(error);
  }

}

// onToggleChange(event: any, row: any) {

//   row.settingValue = event.target.checked ? 1 : 0;

//   this.updateSetting(row);

// }
// async onToggleChange(event: any, row: any) {

//   const request = {
//     endTermID: this.endTermID,
//     settingID: row.settingID,
//     settingValue: event.target.checked ? 1 : 0
//   };

//   const response: any =
//     await this.commonFunctionService
//       .UpdateContentVisibilitySettings(request);

//   if (response.state === 0 || response.state === 'Success') {
//     row.settingValue = request.settingValue;
//   }
// }

async onToggleChange(event: any, row: any) {
debugger
  const previousValue = row.SettingValue;

  row.SettingValue = event.target.checked ? 1 : 0;

  const request = {
    EndTermID: this.endTermID,
    SettingID: row.SettingID,
    SettingValue: row.SettingValue,
    SSOID:this.sSOLoginDataModel.SSOID
  };

  try {
debugger
    const response: any =
      await this.commonFunctionService.UpdateContentVisibilitySettings(request);
debugger
    if (response?.State !== 1) {

      row.SettingValue = previousValue;
      event.target.checked = previousValue == 1;

      this.Swal2.Error(response.Message);
    }
    else {
      this.Swal2.Success(response.Message);
    }
  }
  catch (error) {

    row.SettingValue = previousValue;
    event.target.checked = previousValue == 1;

    this.Swal2.Error('Something went wrong');
  }
}

// async updateSetting(row: any) {

//   const request = {
//     endTermID: this.endTermID,
//     settingID: row.settingID,
//     settingValue: row.settingValue
//   };

//   try {

//     const response: any =
//       await this.commonFunctionService.UpdateContentVisibilitySettings(request);

//     if (response.State !== 1 && response.State !== 'Success') {

//       this.Swal2.Error(response.Message);

//       // rollback
//       row.SettingValue = row.SettingValue == 1 ? 0 : 1;
//     }

//   } catch (error) {

//     // rollback
//     row.SettingValue = row.SettingValue == 1 ? 0 : 1;
//   }
// }
}
