


import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumEMProfileStatus } from '../../../Common/GlobalConstants';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { ITIAdminDashboardSearchModel } from '../../../Models/ITIAdminDashboardDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { ItiAssignExaminerService } from '../../../Services/ITIAssignExaminer/iti-assign-examiner.service';

@Component({
  selector: 'app-practical-examiner-dashboard',
  standalone: false,
  templateUrl: './practical-examiner-dashboard.component.html',
  styleUrl: './practical-examiner-dashboard.component.css'
})
export class PracticalExaminerDashboardComponent {

  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public viewAdminDashboardList: StudentExamDetails[] = [];
  public ITIsWithNumberOfFormsList: any = [];
  public ITIsWithNumberOfFormsPriorityList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new ITIAdminDashboardSearchModel();


  public viewAdminDashboardListExaminationNCVT: any[] = [];


  constructor(private ITIAdminDashboardServiceService: ITIAdminDashboardServiceService,
   private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private itiAssignExaminerService: ItiAssignExaminerService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  //Data Load
  ngOnInit()
  {
    this.GetAllData();
  }


  async GetAllData() {
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    try {

      if (this.searchRequest && this.searchRequest.RoleID > 0) {
        await this.itiAssignExaminerService.GetParcticalExaminerDashboard(this.searchRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.viewAdminDashboardListExaminationNCVT = data['Data'];
          
          }, (error: any) => console.error(error)
          );
      }

    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


}
