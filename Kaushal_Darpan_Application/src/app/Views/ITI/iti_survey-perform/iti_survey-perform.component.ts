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
import { ITIApprWorkerDetailsOfExistingApprenticeshipModel, ITIApprWorkerDetalisOffacilitiesModel, ITIApprWorkerSurveyPerformModel, ITIWorkerDesignationTradeModel } from '../../../Models/ITI/surveyperformaModel';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-iti_survey-perform',
  standalone: false,
  templateUrl: './iti_survey-perform.component.html',
  styleUrl: './iti_survey-perform.component.css'
})
export class ITIsurveyperformComponent implements OnInit
{
  //private secretKey = 'MyStrongSecretKey123';
  public formData = new ITIApprWorkerSurveyPerformModel()
  public searchRequest = new ITIApprWorkerSurveyPerformModel();
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
    private router: Router
   
  )
  {
    
  }
  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
        
    
  }

  

  // Add Functions

  addWorkerDesignationTrade()
  {
    this.formData.OtherITIWorkerDesignationTrade.push(new ITIWorkerDesignationTradeModel());
  }
  addWorkerDetailsOfExistingApprenticeship()
  {
    this.formData.OtherITIApprWorkerDetailsOfExistingApprenticeship.push(new ITIApprWorkerDetailsOfExistingApprenticeshipModel());
  }
  addWorkerDetalisOffacilities()
  {
    this.formData.OtherITIApprWorkerDetalisOffacilities.push(new ITIApprWorkerDetalisOffacilitiesModel());
  }
  // end Add Functions


  // Remove Functions
  removeWorkerDesignationTrade(index: number)
  {
    debugger
    this.formData.OtherITIWorkerDesignationTrade.splice(index, 1);
    
  }
  removeWorkerDetailsOfExistingApprenticeship(index: number) {
    debugger
    this.formData.OtherITIApprWorkerDetailsOfExistingApprenticeship.splice(index, 1);
  }
  removeApprWorkerDetalisOffacilities(index: number)
  {
    debugger
    this.formData.OtherITIApprWorkerDetalisOffacilities.splice(index, 1);
  }
  // end Remove Functions


  async onSubmit(form: any)
  {
    debugger
    this.isSubmitted = true;
    
  
    if (form.valid) {
      console.log('Form Submitted', this.formData);
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this._ITIIIPManageService.SavesurveyperformaReport(this.formData)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            if (!this.formData.surveyPerformID || this.formData.surveyPerformID == 0)
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
            this.router.navigate(['/surveyperform-List']);

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


}

