import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumITIBudgetDDLAction, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { ITIBudgetCreateService } from '../../../../Services/ITI/ITIBudgetCreate/itibudget-create.service';
import { ITIBudgetDropdownDataModel } from '../../../../Models/ITI/ITIBudgetCreateDataModel';
import { BudgetDistributedService } from '../../../../Services/BudgetDistributed/budget-distributed.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-budget-create',
  standalone: false,
  templateUrl: './budget-create.component.html',
  styleUrl: './budget-create.component.css'
})
export class BudgetCreateComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ddlSearchRequest = new ITIBudgetDropdownDataModel();

  public BudgetCreateForm!: FormGroup;
  public request: any = {}

  public ddlBudgetTypeList: any = [];
  public SessionYearList: any = [];
  public BudgetHeadList: any = [];
  public BudgetHeadDDL: any = [];

  _EnumRole = EnumRole;

  public isSubmitted: boolean = false
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private budgetCreateService: ITIBudgetCreateService,
    private budgetDistributedService: BudgetDistributedService,
  ) { }

  async ngOnInit() {
    this.BudgetCreateForm = this.formBuilder.group({
      BudgetTypeName: ['', Validators.required],
      BudgetTypeID: ['', [DropdownValidators]],
      AcademicYearID: ['', [DropdownValidators]],
      BudgetType_Cumulative_HeadWise: ['', [DropdownValidators]],
      BudgetForID: ['', [DropdownValidators]],
      CumulativeAmount: ['', Validators.required],
    })
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetBudgetTypeDDL();
    await this.GetBudgetHeadDDL();
    await this.GetSessionYear();
  }

  get _BudgetCreateForm() { return this.BudgetCreateForm.controls; }

  async GetBudgetTypeDDL() {
    try {
      this.ddlSearchRequest.Action = EnumITIBudgetDDLAction.GetBudgetTypeDDL
      await this.budgetCreateService.GetITIBudgetDropdown(this.ddlSearchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.ddlBudgetTypeList = data.Data
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetBudgetHeadDDL() {
    try {
      this.ddlSearchRequest.Action = EnumITIBudgetDDLAction.GetBudgetHeadDDL
      await this.budgetCreateService.GetITIBudgetDropdown(this.ddlSearchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.BudgetHeadDDL = data.Data
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  onUnitWiseChange(index: number) {
    const item = this.BudgetHeadList[index];
    const headDetails = this.BudgetHeadDDL.find((head: any) => head.HeadID == item.HeadID);
    if (headDetails) {
      item.IsUnitWise = headDetails.IsUnitWise;
      item.UnitName = headDetails.IsUnitWise ? headDetails.UnitName : ''; // Reset UnitName if IsUnitWise is false
    }
  }


  async GetSessionYear() {
    try {
      await this.commonMasterService.GetFinancialYear().then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SessionYearList = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  addNewRow() {
    this.BudgetHeadList.push({
      HeadID: 0,
      HeadName: '',
      Amount: null,
      IsUnitWise: false,
      UnitName: '',
      isNew: true
    });
  }
  saveAll() {
    // Validation example
    const invalid = this.BudgetHeadList.some((x: any) => !x.HeadName || x.UtilizationAmount == null
    );

    if (invalid) {
      alert('Please fill all required fields before saving.');
      return;
    }

    console.log('Saving:', this.BudgetHeadList);
    alert('All rows saved successfully!');
    // TODO: call API or service to save data
  }

  async onChangeBudgetType() {
    if(this.request.BudgetType_Cumulative_HeadWise == 2){
      await this.GetBudgetHeadListAdmin();
    }
  }

  async GetBudgetHeadListAdmin() {
    try {
      let headRequest: any = {}
      headRequest.ActionName = "GetBudgetHeadListAdmin"
      headRequest.BudgetTypeID = this.request.BudgetTypeID

      this.loaderService.requestStarted();
      // this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.budgetDistributedService.GetBudgetUtilizationsData(headRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BudgetHeadList = data.Data;

          console.log(this.BudgetHeadList, "BudgetUtilizationsList")
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }

  async SaveBudget(){
    this.request.BudgetHeadList = this.BudgetHeadList;
    this.request.UserID = this.sSOLoginDataModel.UserID
    this.request.DistributedType = 1
    if(this.request.BudgetType_Cumulative_HeadWise == 1) {
      this.request.TotalAmount = this.request.CumulativeAmount
    } else {
      this.request.TotalAmount = this.request.BudgetHeadList.reduce(
        (sum: number, item: any) => sum + (Number(item.Amount) || 0), 0
      );
    }
    debugger
    try {
      await this.budgetCreateService.SaveDataBudgetCreate_Admin(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ResetControls() {}

  getFilteredBudgetHeadDDL(currentIndex: number) {
    if (!this.BudgetHeadDDL || this.BudgetHeadDDL.length === 0) return [];

    // Collect all selected HeadIDs except the current one
    const selectedHeadIDs = this.BudgetHeadList
      .map((x: any, i: number) => (i !== currentIndex ? x.HeadID : null))
      .filter((id: any) => id && id != 0);

    // Return only HeadIDs not already selected
    return this.BudgetHeadDDL.filter(
      (item: any) => !selectedHeadIDs.includes(item.HeadID)
    );
  }
}
