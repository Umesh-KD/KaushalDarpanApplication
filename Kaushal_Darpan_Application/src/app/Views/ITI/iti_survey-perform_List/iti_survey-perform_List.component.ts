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
  selector: 'app-iti_survey-perform_List',
  standalone: false,
  templateUrl: './iti_survey-perform_List.component.html',
  styleUrl: './iti_survey-perform_List.component.css'
})
export class ITIsurveyperformListComponent implements OnInit
{
  public formData = new ITIApprWorkerSurveyPerformModel()
  public searchRequest = new ITIApprWorkerSurveyPerformModel();

  public surveyperformaList: any[] = [];
  public FundDetailsList: any = [];
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public isSubmitted: boolean = false;
  public IPFundFormGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = '';



  constructor(private commonMasterService: CommonFunctionService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private _ITIIIPManageService: ITIIIPManageService,
    private toastr: ToastrService
   
  )
  {
    
  }
  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllsurveyperformaList()
    
  }

  async GetAllsurveyperformaList() {
    debugger;
    try {
      const res: any = await this._ITIIIPManageService
        .GetAllsurveyperformaList(this.searchRequest);

      console.log('API FULL RESPONSE =>', res);

      if (Array.isArray(res.Data)) {
        this.surveyperformaList = res.Data;
      }
      else if (res.Data?.Table && Array.isArray(res.Data.Table)) {
        this.surveyperformaList = res.Data.Table;
      }
      else {
        this.surveyperformaList = [];
      }

    } catch (error) {
      console.error(error);
      this.surveyperformaList = [];
    }
  }




}

