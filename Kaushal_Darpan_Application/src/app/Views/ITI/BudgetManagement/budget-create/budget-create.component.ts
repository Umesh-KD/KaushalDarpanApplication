import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumITIBudgetDDLAction, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { ITIBudgetCreateService } from '../../../../Services/ITI/ITIBudgetCreate/itibudget-create.service';
import { ITIBudgetDropdownDataModel } from '../../../../Models/ITI/ITIBudgetCreateDataModel';

@Component({
  selector: 'app-budget-create',
  standalone: false,
  templateUrl: './budget-create.component.html',
  styleUrl: './budget-create.component.css'
})
export class BudgetCreateComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ddlSearchRequest = new ITIBudgetDropdownDataModel();

  public ddlBudgetTypeList: any = [];

  _EnumRole = EnumRole;
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private budgetCreateService: ITIBudgetCreateService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetBudgetTypeDDL();
  }

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
}
