import { Component, OnInit } from '@angular/core';
import { IDfFundDetailsModel, DepositList, IDfFundSearchDetailsModel } from '../../../Models/ITI/IDfFundDetailsModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ITIIIPManageService } from '../../../Services/ITI/ITI-IIPModule/iti-iipmodule.service';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-idffund-details',
  standalone: false,
  templateUrl: './idffund-details.component.html',
  styleUrl: './idffund-details.component.css'
})
export class IDFFundDetailsComponent implements OnInit
{
  public formData = new IDfFundDetailsModel()
  public FinYearList: any = [];
  public FinancialYear_QTR: any = [];
  fundId: number | null = null;
  searchRequest = new IDfFundSearchDetailsModel();
  FundDetailsList: any = [];

  constructor(private commonMasterService: CommonFunctionService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private _ITIIIPManageService: ITIIIPManageService,
    private toastr: ToastrService)
  {
    
  }
  ngOnInit()
  {
    this.loadDropdownData('FinancialYear_IIP')
    this.loadDropdownData('FinancialYear_QTR')
    this.route.queryParams.subscribe(params => {
      this.fundId = +params['FundID'] || 0;
      if (this.fundId) {
        this.loadFundDetails();
      }
    });

  }

  
  async loadFundDetails() {
    try {
      this.loaderService.requestStarted();
      //this.searchRequest.Action = this.fundId;  

      await this._ITIIIPManageService.GetById_IMCFund(this.fundId!).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.FundDetailsList = data.Data;

          this.formData = data.Data;
          console.log('Get All Form Data==>', this.formData);
          console.log('Get All Data==>', this.FundDetailsList);
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

  onSubmit(form: any)
  {
    if (form.invalid) {
      return; // validation messages will show because form.submitted = true
    }

    alert('data')
    if (form.valid) {
      console.log('Form Submitted', this.formData);
      // TODO: call API here
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

