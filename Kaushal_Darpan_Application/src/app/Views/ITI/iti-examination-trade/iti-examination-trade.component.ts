import { Component } from '@angular/core';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-iti-examination-trade',
  standalone: false,
  templateUrl: './iti-examination-trade.component.html',
  styleUrl: './iti-examination-trade.component.css'
})
export class ItiExaminationTradeComponent {

  TradeListData: any[] = [];
  isGenerated = false;
  requestModel: any = {
    ActionName: '',
    DepartmentID: 0,
    FinancialYearID: 0,
    EndTermID: 0
  };
  sSOLoginDataModel = new SSOLoginDataModel();
  constructor(
    private iTIAdminDashboardServiceService: ITIAdminDashboardServiceService,
  ) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadTradeList();
  }


  async loadTradeList() {
    try {
      this.requestModel.ActionName = 'ExaminationTradeList';
      this.requestModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestModel.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      debugger
      const res: any = await this.iTIAdminDashboardServiceService.GetExaminationCollegeTrade(this.requestModel);

      if (res.State === 1) { // Success
        this.TradeListData = res.Data;
        this.isGenerated = true;
      } else {
        this.TradeListData = [];
        this.isGenerated = false;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
