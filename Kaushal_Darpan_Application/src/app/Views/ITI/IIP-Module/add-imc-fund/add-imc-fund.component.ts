import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ITI_IIPManageDataModel, IIPManageMemberDetailsDataModel, IIPManageFundSearchModel } from '../../../../Models/ITI/ITI_IIPManageDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ITI_InspectionDropdownModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { ITIIIPManageService } from '../../../../Services/ITI/ITI-IIPModule/iti-iipmodule.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'add-imc-fund',
  standalone: false,
  templateUrl: './add-imc-fund.component.html',
  styleUrl: './add-imc-fund.component.css'
})


export class AddItiIMCFundComponent {
  public formData = new IIPManageFundSearchModel()
  isFormSubmitted: boolean = false
  sSOLoginDataModel = new SSOLoginDataModel();
  FundID: number = 0
  FinancialYearID: number = 0
  IMCRegID: number = 0
  isFormReadOnly = false;
  FinancialYearMasterDDL: any;
  TradeMasterDDL: any[] = [];
  IIPFundData: any = [];
  public settingsMultiselector: object = {};
  public SelectedTradeMasterList: any = []



  constructor(private toastr: ToastrService, private loaderService: LoaderService, private IIPManageService: ITIIIPManageService, private router: Router, private activatedRoute: ActivatedRoute, private commonMasterService: CommonFunctionService,) { }

  async ngOnInit() {

    this.settingsMultiselector = {

      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.formData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

    await this.commonMasterService.GetFinancialYear().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));

      console.log("FinancialYearMasterDDL", data)
      this.FinancialYearMasterDDL = data.Data;
    })

    await this.commonMasterService.ItiTrade().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));

      
      this.TradeMasterDDL = data.Data;
      console.log("TradeMasterDDL", this.TradeMasterDDL)
    })

    debugger;

    this.activatedRoute.queryParams.subscribe((params) => {
      this.IMCRegID = params['RegistrationID'];
      console.log("this.RegistrationID:", this.IMCRegID);

      this.FundID = params['IMCFundID'];
      console.log("this.IMCRegID:", this.FundID);
    });

    if (this.FundID != undefined && this.FundID != null && this.FundID != 0) {
      debugger
      this.GetById_IMCFund(this.FundID);
    }
    else {
      await this.GetAllIMCFundData();
    }



    this.formData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.formData.InstituteId = this.sSOLoginDataModel.InstituteID;
 
  }

  ClcAmt(id : number) {
    const perInstalment = 1250000; // 12.5 Lakh
    if (id === 1) {
      this.formData.InstalmentPaidAmt = String((this.formData.InstalmentPaid || 0) * perInstalment);
    }
    else {
      this.formData.InstalmentPendingAmt = String((this.formData.InstalmentPending || 0) * perInstalment);
    }
    
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

    try {
      this.loaderService.requestStarted();
      debugger;
      await this.IIPManageService.SaveIMCFund(this.formData).then((data: any) => {
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

  async GetAllIMCFundData() {
    try {
      debugger;
      this.loaderService.requestStarted();
      //this.formData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.formData.UserID = this.sSOLoginDataModel.UserID;
      this.formData.InstituteId = this.sSOLoginDataModel.InstituteID;
      this.formData.IMCRegID = this.IMCRegID;

      await this.IIPManageService.GetAllIMCFundData(this.formData).then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.IIPFundData = data.Data.Table;


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
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  isQuarterDisabled(quarterId: number): boolean {
    return this.IIPFundData?.some((x: any) => x.QuarterID === quarterId);
  }

  async GetById_IMCFund(id: number) {

    try {
      this.loaderService.requestStarted();
      await this.IIPManageService.GetById_IMCFund(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        debugger;
        if (data.State === EnumStatus.Success) {
          this.formData = data.Data

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


  async GetFinancialData(event:any) {
    debugger;
    const selectedId = this.formData.FinancialYearID; // this will give the selected FinancialYearID
    this.loaderService.requestStarted();
    this.formData.FinancialYearID = selectedId;
    await this.GetAllIMCFundData();

  }


  async onItemSelect() {
    debugger;
    if (!this.SelectedTradeMasterList.includes('rr')) {
      this.SelectedTradeMasterList.push('rr');
    }

  }

  onDeSelect(item: any, centerID: number) {

    this.SelectedTradeMasterList = this.SelectedTradeMasterList.filter((i: any) => i.StreamID !== item.StreamID);

  }

  onSelectAll(items: any[], centerID: number) {

    // this.SelectedInstituteList = [...items];

  }

  onDeSelectAll(centerID: number) {

    //this.SelectedInstituteList = [];

  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  // multiselect events
  public onFilterChanges(item: any) {
    console.log(item);
  }
  public onDropDownCloses(item: any) {
    console.log(item);
  }

  public onItemSelects(item: any) {
    console.log(item);
  }
  public onDeSelects(item: any) {
    console.log(item);
  }

  public onSelectAlls(items: any) {
    console.log(items);
  }
  public onDeSelectAlls(items: any) {
    console.log(items);
  }


}
