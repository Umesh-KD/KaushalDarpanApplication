import { Component, OnInit } from '@angular/core';
import { ITIIIPManageService } from '../../../Services/ITI/ITI-IIPModule/iti-iipmodule.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';
import { IDfFundSearchDetailsModel } from '../../../Models/ITI/IDfFundDetailsModel';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = 'MyStrongSecretKey123'; 

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(textToDecrypt: string): string {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
  }
}

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
  constructor(private _ITIIIPManageService: ITIIIPManageService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private encryptionService: EncryptionService,
    private router: Router
  ) {

  }

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
  }

  async GetAllData()
  {
    try
    {
      this.loaderService.requestStarted();
      this.searchRequest.Action = "GETLIST";
      this.searchRequest.InstituteId = this.sSOLoginDataModel.InstituteID;
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
  editFund(fundId: number) {
    const encryptedId = this.encryptionService.encrypt(fundId.toString());
    this.router.navigate(['/addidffund'], { queryParams: { FundID: encryptedId } });
  }



}
