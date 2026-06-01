import { Component, OnInit } from '@angular/core';
import { PlacementDashboardModel } from '../../../Models/PlacementDashReportModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { Subscription } from 'rxjs';
import { CommonFunctionService } from '../../../Common/common';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { PlacementDashService } from '../../../Services/PlacementDashboard/PlacementDash.service';
import { EnumRole } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-iip-dashboard',
  standalone: false,
  templateUrl: './iip-dashboard.component.html',
  styleUrl: './iip-dashboard.component.css'
})
export class IipDashboardComponent implements OnInit {

  public viewPlacementDashboardList: any = [];
  public placementDashboardList: any[] = [];
    public Table_SearchText: string = "";
    _enumRole = EnumRole;
    /*  public searchRequest = new CommonSubjectMasterSearchModel();*/
    public request = new PlacementDashboardModel()
    public sSOLoginDataModel = new SSOLoginDataModel();
    public State: number = 0;
    public Message: string = '';
    public ErrorMessage: string = '';
    private userDataSubscription!: Subscription;
    constructor(private PlacementDashService: PlacementDashService, private commonFunctionService: CommonFunctionService, private toastr: ToastrService,
       private loaderService: LoaderService, private formBuilder: FormBuilder, 
       private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {
  
    }
    async ngOnInit() {
      debugger
       // First load directly from localStorage
  this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

  if (this.sSOLoginDataModel) {

    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.CollegeID = this.sSOLoginDataModel.InstituteID;
    this.request.UserId = this.sSOLoginDataModel.UserID;
    this.request.RoleId = this.sSOLoginDataModel.RoleID;
debugger

  this.request.EventStatus = 'UP-Comming';
    this.GetAllData();
    this.GetIIPDashboardListData()
  }
  
    // this.userDataSubscription = this.commonFunctionService.sSOLoginDataModel$.subscribe(
    //   (data:any) => {
        
    //     this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //     this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    //     this.request.CollegeID = this.sSOLoginDataModel.InstituteID
    //     this.request.UserId = this.sSOLoginDataModel.UserID
    //     this.request.RoleId = this.sSOLoginDataModel.RoleID
    //     this.GetAllData();
    //   }
    // );
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }
  async GetAllData() {
    try {
      this.loaderService.requestStarted();

     this.request.CollegeID=this.sSOLoginDataModel.InstituteID;
      debugger
      await this.PlacementDashService.GetIIPDashboardData(this.request)
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

  //  async GetIIPDashboardListData() {
  //   try {
  //     this.loaderService.requestStarted();
  //     debugger
  //     this.request.EventStatus = 'UP-Comming';
  //     await this.PlacementDashService.GetIIPDashboardListData(this.request)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.placementDashboardList = data['Data']||[];
  //         console.log('event list with consent',this.placementDashboardList);
  //       }, (error: any) => console.error(error)
  //       );
  //   }
  //   catch (ex) {
  //     console.log(ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  async GetIIPDashboardListData() {
  try {
    this.loaderService.requestStarted();

    // default value if empty
    // if (!this.request.EventStatus) {
    //   this.request.EventStatus = 'UP-Comming';
    // }
   this.request.CollegeID=this.sSOLoginDataModel.InstituteID;
    await this.PlacementDashService.GetIIPDashboardListData(this.request)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.placementDashboardList = data['Data'] || [];
        console.log('event list with consent', this.placementDashboardList);
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
