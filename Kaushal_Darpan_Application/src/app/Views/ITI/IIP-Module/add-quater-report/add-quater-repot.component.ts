import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ITI_IIPManageDataModel, IIPManageMemberDetailsDataModel, IIPManageFundSearchModel, IMCFundRevenue } from '../../../../Models/ITI/ITI_IIPManageDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ITI_InspectionDropdownModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { ITIIIPManageService } from '../../../../Services/ITI/ITI-IIPModule/iti-iipmodule.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';


@Component({
  selector: 'add-imc-fund',
  standalone: false,
  templateUrl: './add-quater-repot.component.html',
  styleUrl: './add-quater-repot.component.css'
})


export class AddITIQuarterReportComponent {
  public formData: IMCFundRevenue  = new IMCFundRevenue()
  isFormSubmitted: boolean = false
  sSOLoginDataModel = new SSOLoginDataModel();
  FundID: number = 0
  InstalmentPaidAmt: number = 0
  FinancialYearID: number = 0
  IMCRegID: number = 0
  QuaterlyProgressID: number = 0
  isFormReadOnly = false;
  FinancialYearMasterDDL: any;
  TradeMasterDDL: any[] = [];
  IIPFundData: any = [];
  public settingsMultiselector: object = {};
  public SelectedTradeMasterList: any = []
  modalReference: NgbModalRef | undefined;


  constructor(private toastr: ToastrService, private loaderService: LoaderService, private IIPManageService: ITIIIPManageService, private router: Router, private activatedRoute: ActivatedRoute, private commonMasterService: CommonFunctionService, private modalService: NgbModal, private Swal2: SweetAlert2) { }

  async ngOnInit() {

   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    this.activatedRoute.queryParams.subscribe((params) => {
      this.InstalmentPaidAmt = params['InstalmentPaidAmt'];
      console.log("this.InstalmentPaidAmt:", this.InstalmentPaidAmt);

      this.FundID = params['IMCFundID'];
      console.log("this.IMCFundID:", this.FundID);

      this.QuaterlyProgressID = params['QuaterlyProgressID'];
      debugger;
      if (this.QuaterlyProgressID > 0) {

        this.CloseModalPopup();
        this.GetQuaterlyProgressData(this.QuaterlyProgressID);
      }
    });



 
  }

  ClcAmt() {
    this.formData.TotalRevenueAmt =
      (this.formData.InterestReceivedAmt ?? 0) +
      (this.formData.AdmissionFeesAmt ?? 0) +
      (this.formData.OtherRevenueAmt ?? 0);


    this.formData.FundAvailableAmt = 25000000 + (this.formData.TotalRevenueAmt ?? 0) - (this.formData.TotalExpenditureAmt ?? 0) - this.InstalmentPaidAmt;
  }

  ClcExpenditure() {
    this.formData.TotalExpenditureAmt =
      (this.formData.CivilAmt ?? 0) +
      (this.formData.ToolsAmt ?? 0) +
      (this.formData.FurnitureAmt ?? 0) +
      (this.formData.BooksAmt ?? 0) +
      (this.formData.AdditionalAmt ?? 0) +
      (this.formData.MaintenanceAmt ?? 0) +
      (this.formData.MiscellaneousAmt ?? 0);

    this.formData.FundAvailableAmt = 25000000 + (this.formData.TotalRevenueAmt ?? 0) - (this.formData.TotalExpenditureAmt ?? 0) - this.InstalmentPaidAmt;
  }


  ClcSanctioned() {
    this.formData.TotalSanctionedAmt =
      (this.formData.CivilSanctionedAmt ?? 0) +
      (this.formData.ToolsSanctionedAmt ?? 0) +
      (this.formData.FurnitureSanctionedAmt ?? 0) +
      (this.formData.BooksSanctionedAmt ?? 0) +
      (this.formData.AdditionalSanctionedAmt ?? 0) +
      (this.formData.MaintenanceSanctionedAmt ?? 0) +
      (this.formData.MiscellaneousSanctionedAmt ?? 0);
  }



  async onSubmit(form: any)
  {
    if (!form.valid)
    {
      return
    }

    if (form.valid) {
      console.log('Form Submitted', this.formData);
    }
    debugger;
    this.isFormSubmitted = true
    //this.formData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.formData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.formData.UserID = this.sSOLoginDataModel.UserID;
    this.formData.InstituteId = this.sSOLoginDataModel.InstituteID;
    this.formData.IMCRegID = this.IMCRegID;
    this.formData.IMCFundID = this.FundID;

    try {
      this.loaderService.requestStarted();
      debugger;
      await this.IIPManageService.SaveQuaterlyProgressData(this.formData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        if (data.State === EnumStatus.Success) {
          this.toastr.success("Fund Added Successfully");
          this.router.navigate(['/iti-iip-manage']);
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
      
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestStarted();
      }, 200)
    }
  }

  async GetQuaterlyProgressData(id: number) {

    try {
      this.loaderService.requestStarted();
      await this.IIPManageService.GetQuaterlyProgressData(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        debugger;
        if (data.State === EnumStatus.Success)
        {
          this.formData = data.Data[0];
          console.log("formData", this.formData)
          console.log("formData", this.formData.InterestReceivedAmt)
          console.log("formData", typeof this.formData.InterestReceivedAmt)
          // In ngOnInit or wherever request is populated
          //this.formData.RegDate =  this.formatDateToInput(this.formData.RegDate);
          this.isFormReadOnly = true;
          //this.InspectionFormGroup.get('TeamTypeID')?.disable();
          //this.InspectionFormGroup.get('DeploymentDateFrom')?.disable();
          //this.InspectionFormGroup.get('DeploymentDateTo')?.disable();


        } else if (data.State === EnumStatus.Warning) {
          // this.toastr.warning(data.Message);
        } else {
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

  CloseModalPopup() {
    this.modalService.dismissAll();
  }


}
