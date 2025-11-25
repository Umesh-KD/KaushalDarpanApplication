import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { BudgetDistributedService } from '../../../../Services/BudgetDistributed/budget-distributed.service';
import { ITIBudgetCreateService } from '../../../../Services/ITI/ITIBudgetCreate/itibudget-create.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-budget-master',
  standalone: false,
  templateUrl: './budget-master.component.html',
  styleUrl: './budget-master.component.css'
})
export class BudgetMasterComponent {
  public sSOLoginDataModel = new SSOLoginDataModel()

  public BudgetDataList: any = []

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
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetBudgetData();
  }

  async GetBudgetData() {
    try {
      const searchReq: any = {}
      searchReq.FinYearID = this.sSOLoginDataModel.FinancialYearID
      await this.budgetCreateService.GetBudgetData(searchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.BudgetDataList = data.Data
        } else if(data.State == EnumStatus.Warning) {
          this.toastr.warning(data.Message)
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
}
