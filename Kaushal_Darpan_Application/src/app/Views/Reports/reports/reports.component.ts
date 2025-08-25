
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  ssoLoginUser = new SSOLoginDataModel();
  id: any;
  GetReportsList!: any[];
  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.id = this.activatedRoute.snapshot.paramMap.get('id');    
  }

  ngOnInit(){
  }
  // Fetching the data from the service and updating the table
  async GetAllData() {
    let requestData: any = {};
    if (this.id) {
      requestData = {
        EndTermID: this.ssoLoginUser.EndTermID,
        DepartmentID: this.ssoLoginUser.DepartmentID,
        Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
        RoleID: this.ssoLoginUser.RoleID,
        Status: this.id,
        StaffID: this.ssoLoginUser.StaffID,
        UserID: this.ssoLoginUser.UserID
      }
    } else {
      requestData = {
        EndTermID: this.ssoLoginUser.EndTermID,
        DepartmentID: this.ssoLoginUser.DepartmentID,
        Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
        Status: this.id
      }
    }

    try {
      //await this.reportService.GetReports(requestData)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    if (data.State === EnumStatus.Success) {
      //      this.GetReportsList = data['Data'];
      //    } 
      //  }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } 
  }

}

