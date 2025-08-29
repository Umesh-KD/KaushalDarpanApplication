import { Component, OnInit } from '@angular/core';
import { IDfFundDetailsModel, DepositList, IDfFundSearchDetailsModel } from '../../../Models/ITI/IDfFundDetailsModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ITIIIPManageService } from '../../../Services/ITI/ITI-IIPModule/iti-iipmodule.service';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';
import { FormGroup } from '@angular/forms';
import { IIPManageFundSearchModel } from '../../../Models/ITI/ITI_IIPManageDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = 'MyStrongSecretKey123'; // 🔐 keep this same for encrypt/decrypt

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(textToDecrypt: string): string {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
  }
}


@Component({
  selector: 'app-idffund-details',
  standalone: false,
  templateUrl: './idffund-details.component.html',
  styleUrl: './idffund-details.component.css'
})
export class IDFFundDetailsComponent implements OnInit
{
  private secretKey = 'MyStrongSecretKey123';
  public formData = new IDfFundDetailsModel()
  public SaveformData = new IIPManageFundSearchModel()
  public FinYearList: any = [];
  public FinancialYear_QTR: any = [];
  public fundId: number | null = null;
  public searchRequest = new IDfFundSearchDetailsModel();
  public FundDetailsList: any = [];
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public isSubmitted: boolean = false;
  public IPFundFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();

 // public RequestBaseModel = new RequestBaseModel();

  constructor(private commonMasterService: CommonFunctionService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private _ITIIIPManageService: ITIIIPManageService,
    private toastr: ToastrService,
    private encryptionService: EncryptionService, private router: Router
  )
  {
    
  }
  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadDropdownData('FinancialYear_IIP')
    this.loadDropdownData('FinancialYear_QTR')
    
    this.route.queryParams.subscribe(params => {
      const encryptedFundId = params['FundID'];
      if (encryptedFundId) {
        const decryptedId = this.encryptionService.decrypt(encryptedFundId);
        this.fundId = +decryptedId || 0;

        if (this.fundId > 0) {
          this.loadFundDetails();
        }
      }
    });
  }

  
  async loadFundDetails() {

    try {
      this.loaderService.requestStarted();

      await this._ITIIIPManageService.GetById_FundDetails(this.fundId!).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.FundDetailsList = data.Data;

          this.formData = data.Data;
          //console.log('Get All Form Data==>', this.formData);
          //console.log('Get All Data==>', this.FundDetailsList);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });

    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  addDeposit()
  {
    this.formData.OtherDepositList.push(new DepositList());
  }

  removeDeposit(index: number)
  {

    this.formData.OtherDepositList.splice(index, 1);
    this.calculationdata();
  }

  async onSubmit(form: any)
  {
    debugger
    this.isSubmitted = true;
    this.formData.FundID = this.formData.FundID;
    this.formData.FinancialYearID = this.formData.FinancialYearID;
    this.formData.InsituteID = this.sSOLoginDataModel.InstituteID;
  
    if (form.valid) {
      console.log('Form Submitted', this.formData);
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this._ITIIIPManageService.SaveFundDetails(this.formData)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            // check FundID to decide Save or Update message
            if (!this.formData.FundID || this.formData.FundID == 0)
            {
              // Save
              this.toastr.success("Record saved successfully", "", {
                toastClass: "ngx-toastr my-save-toast"
              });
            } else
            {
              // Update
              this.toastr.success("Record updated successfully", "", {
                toastClass: "ngx-toastr my-update-toast"
              });
            }
            //redirect
            this.router.navigate(['/IDFFundDetailList']);
           

          } else if (this.State == EnumStatus.Error)
          {
            this.toastr.error("Something went wrong.");
          }

    });
       
    } catch (ex) {
      console.error(ex);
      this.toastr.error('Something went wrong. Please try again.');
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  


  getTotalReceivedAmount(): number
  {
    return this.formData.OtherDepositList
      .map(x => Number(x.ReceivedAmount) || 0)
      .reduce((a, b) => a + b, 0);
  }

  calculationdata()
  {
    // your logic
    this.formData.ClosingBalance =

      (this.formData.OpeningBalance || 0) + (this.formData.ReceivedAmount || 0)-
      this.formData.OtherDepositList
        .map(x => Number(x.ReceivedAmount) || 0)
      .reduce((a, b) => a + b, 0)  - (this.formData.Expense || 0) 
      
  }


  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode)
      {
        case 'FinancialYear_IIP':
          this.FinYearList = data['Data'];
          break;
        case 'FinancialYear_QTR':
          this.FinancialYear_QTR = data['Data'];
          break;


          

        default:
          break;
      }
    });
  }

}

