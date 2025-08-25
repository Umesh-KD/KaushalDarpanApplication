import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BudgetHeadSearchFilter, BudgetRequestModel } from '../../../../Models/ITI/BudgetDistributeDataModel';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { EnumBugetStatus, EnumStatus } from '../../../../Common/GlobalConstants';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { BudgetDistributedService } from '../../../../Services/BudgetDistributed/budget-distributed.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../../../Common/appsetting.service';

@Component({
  selector: 'app-budget-request-status',
  templateUrl: './budget-request-status.component.html',
  styleUrl: './budget-request-status.component.css',
  standalone: false,
})
export class BudgetRequestStatusComponent
  implements OnInit
{
  public BudgetRequestForm!: FormGroup;
  public BudgetModel = new BudgetHeadSearchFilter();
  public BudgetModelStatus = new BudgetRequestModel();
  public ssoLoginDataModel = new SSOLoginDataModel();
  modalService = inject(NgbModal);
  public isSubmitted: boolean = true;
  public isLoading: boolean = false;
  public file!: File;
  public Uploadfile: string = '';
  public DataList: any = [];
  public Table_SearchText: any = '';
  closeResult: string | undefined;
  public RequestAmountDetail: number = 0;
  public _EnumBugetStatus = EnumBugetStatus;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private loaderService: LoaderService,
    private budgetDistributedService: BudgetDistributedService,
    private commonFunctionService: CommonFunctionService,
    private appsettingConfig: AppsettingService,
  ) { }


  ngOnInit()
  {
    // ✅ Initialize the form BEFORE it's used
    
    const storedData = localStorage.getItem('SSOLoginUser');
    if (storedData) {
      this.ssoLoginDataModel = JSON.parse(storedData);
    }
    this.GetReportAllData();
  }

  async GetReportAllData() {
    debugger;
    try {
      this.BudgetModel.CreatedBy = this.ssoLoginDataModel.UserID;
      this.BudgetModel.FinYearID = this.ssoLoginDataModel.FinancialYearID;
      this.BudgetModel.CollegeID = this.ssoLoginDataModel.InstituteID;
      this.BudgetModel.RequestID = 0;
      if (this.ssoLoginDataModel.RoleID == 20 || this.ssoLoginDataModel.RoleID == 43)
      {
        this.BudgetModel.ActionName = "GETRecordByCompanyID";
      }
      else
      {
      
        this.BudgetModel.ActionName = "GETLIST";
      }
      
      await this.budgetDistributedService.GetRequeststatusAllData(this.BudgetModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.DataList = data.Data;
            //this.loadInTable();
          }
          else {
            this.DataList = [];
          }
        }, (error: any) => console.error(error)
        );

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async openModal(content: any, RequestId: number, RequestAmount: number)
  {
    this.BudgetModelStatus.RequestID = RequestId;
    this.BudgetModelStatus.ApprovedAmount = RequestAmount;
    this.RequestAmountDetail = RequestAmount;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //openModal() {
  //  this.isModalOpen = true;
  //}

  CloseModal() {
    this.BudgetModelStatus.RequestID = 0
    this.BudgetModelStatus.StatusId = 0
    this.BudgetModelStatus.Remarks = ''
    this.modalService.dismissAll();
  }

  async Sumbit()
  {
    if (this.BudgetModelStatus.StatusId == EnumBugetStatus.Rejected)
    {
      if (this.BudgetModelStatus.Remarks == '')
      {
        this.toastr.warning('Please Enter Remarks')
        return;
      }
    }
    else
    {

      if (this.BudgetModelStatus.StatusId == 0 || this.BudgetModelStatus.Remarks == '') {
        this.toastr.warning('Please fill all required field')
        return;
      }

      if (!this.BudgetModelStatus.ApprovedAmount || this.BudgetModelStatus.ApprovedAmount === 0) {
        this.toastr.warning('Please Enter  Approved Amount')
        return;
      }
      if (this.BudgetModelStatus.ApprovedAmount > this.RequestAmountDetail)
      {
        this.toastr.warning('Approved Amount is greater than Request Amount. Please check the values.');
        return;
      }
    }
    try
    { 
      this.BudgetModelStatus.UserID = this.ssoLoginDataModel.UserID;
      this.BudgetModelStatus.FinYearID = this.ssoLoginDataModel.FinancialYearID;
      this.BudgetModelStatus.RoleId = this.ssoLoginDataModel.EndTermID;
      this.BudgetModelStatus.DepartmentID = this.ssoLoginDataModel.DepartmentID;
      this.BudgetModelStatus.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
      this.BudgetModelStatus.CollegeId = this.ssoLoginDataModel.InstituteID;
      this.BudgetModelStatus.Action = "ApproveRejectRequest";
      console.log("request at saveData", this.BudgetModel)
      await this.budgetDistributedService.SaveBudgetRequest(this.BudgetModelStatus)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.CloseModal();
            this.GetReportAllData();
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  ResetAmount() {

    if (this.BudgetModelStatus.StatusId == EnumBugetStatus.Rejected)
    {
      this.BudgetModelStatus.ApprovedAmount = 0;
    }

  }
}
