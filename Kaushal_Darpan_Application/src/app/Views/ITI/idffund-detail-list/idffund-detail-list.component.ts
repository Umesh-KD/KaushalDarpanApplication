import { Component, OnInit } from '@angular/core';
import { ITIIIPManageService } from '../../../Services/ITI/ITI-IIPModule/iti-iipmodule.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';
import { IDfFundSearchDetailsModel } from '../../../Models/ITI/IDfFundDetailsModel';

@Component({
  selector: 'app-idffund-detail-list',
  standalone: false,
  templateUrl: './idffund-detail-list.component.html',
  styleUrl: './idffund-detail-list.component.css'
})
export class IDFFundDetailListComponent implements OnInit {

  public sSOLoginDataModel = new SSOLoginDataModel();
  searchRequest = new IDfFundSearchDetailsModel();
  FundDetailsList: any = [];
  constructor(private _ITIIIPManageService: ITIIIPManageService, private loaderService: LoaderService, private toastr: ToastrService) {

  }

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
  }

  async GetAllData() {
    try
    {
      this.loaderService.requestStarted();
      this.searchRequest.Action = "GETLIST";
      await this._ITIIIPManageService.GetFundDetailsData(this.searchRequest).then((data: any) =>
      {
          data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success)
        {
          this.FundDetailsList = data.Data;

          console.log(this.FundDetailsList);
        }
        else
        {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

}
