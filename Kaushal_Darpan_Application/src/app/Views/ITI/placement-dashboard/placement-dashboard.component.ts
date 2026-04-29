import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { PlacementDashService } from '../../../Services/PlacementDashboard/PlacementDash.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlacementDashboardModel } from '../../../Models/PlacementDashReportModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { Subscription } from 'rxjs';
import { EnumRole } from '../../../Common/GlobalConstants';

@Component({
    selector: 'app-iti-placement-dashboard',
    templateUrl: './placement-dashboard.component.html',
    styleUrls: ['./placement-dashboard.component.css'],
    standalone: false
})
export class PlacementDashboardComponent implements OnInit {

  public viewPlacementDashboardList: any = [];
  public Table_SearchText: string = "";
  /*  public searchRequest = new CommonSubjectMasterSearchModel();*/
  public request = new PlacementDashboardModel()
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  _enumRole = EnumRole;
  private userDataSubscription!: Subscription;
  constructor(private PlacementDashService: PlacementDashService, private commonFunctionService: CommonFunctionService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {
    this.userDataSubscription = this.commonFunctionService.sSOLoginDataModel$.subscribe(
      (data) => {
        
        this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
        this.request.CollegeID = this.sSOLoginDataModel.InstituteID
        this.request.UserId = this.sSOLoginDataModel.UserID
        this.request.RoleId = this.sSOLoginDataModel.RoleID
        this.GetAllData();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
  async GetAllData() {
    try {
      this.loaderService.requestStarted();
debugger
      if (this.sSOLoginDataModel.RoleID!=this._enumRole.ITI_Placement_TPO)
      {
        this.request.CollegeID = 0;
      }
      await this.PlacementDashService.GetITIAllData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.viewPlacementDashboardList = data['Data'];
        }, (error: any) => console.error(error)
        );
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
