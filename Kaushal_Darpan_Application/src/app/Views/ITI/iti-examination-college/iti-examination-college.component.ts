import { Component } from '@angular/core';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-iti-examination-college',
  standalone: false,
  templateUrl: './iti-examination-college.component.html',
  styleUrl: './iti-examination-college.component.css'
})
export class ItiExaminationCollegeComponent {

  CollegeListData: any[] = [];
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
    this.loadCollegeList();
  }

  async loadCollegeList() {
    try {
      this.requestModel.ActionName = 'ExaminatonCollegeList';
      this.requestModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestModel.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      
      const res: any = await this.iTIAdminDashboardServiceService.GetExaminationCollegeTrade(this.requestModel);

      if (res.State === 1) {
        this.CollegeListData = res.Data;
        this.isGenerated = true;
      } else {
        this.CollegeListData = [];
        this.isGenerated = false;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
