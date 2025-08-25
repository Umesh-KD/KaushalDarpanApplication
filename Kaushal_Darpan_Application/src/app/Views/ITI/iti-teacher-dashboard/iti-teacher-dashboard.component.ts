import { Component, OnInit, inject } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumProfileStatus, EnumRole, GlobalConstants } from '../../../Common/GlobalConstants';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { async } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DashboardCardModel, StudentExamDetails } from '../../../Models/DashboardCardModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITITeacherDashboardService } from '../../../Services/ITI/ITITeacherDashboard/iti-teacher-dashboard.service';
import { ITITeacherDashboardSearchModel } from '../../../Models/ITI/ITITeacherDashboardDataModel';
import { StaffDashboardSearchModel } from '../../../Models/StaffDashboardDataModel';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
@Component({
  selector: 'app-iti-teacher-dashboard',
  standalone: false,
  
  templateUrl: './iti-teacher-dashboard.component.html',
  styleUrl: './iti-teacher-dashboard.component.css'
})

export class ITITeacherDashboardComponent {
  readonly dialog = inject(MatDialog);
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public Table_SearchText: string = "";
  public searchRequest = new ITITeacherDashboardSearchModel();
  // public searchRequest = new StaffMasterSearchModel();
  public viewITITeacherDashboardList: any[] = [];

  public viewPlacementDashboardList: any = [];
  public StaffMasterList: any = [];
  public staffDashSearchReq = new StaffDashboardSearchModel()

  constructor(
    private ITITeacherDashboardService: ITITeacherDashboardService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal,
    private staffMasterService: StaffMasterService,
    private sweetAlert2: SweetAlert2
  ) {}

  async ngOnInit() {
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // console.log("sSOLoginDataModel",this.sSOLoginDataModel);
    await this.GetAllData();

    if ((this.sSOLoginDataModel.RoleID == EnumRole.Teacher) || (this.sSOLoginDataModel.RoleID == EnumRole.Invigilator)
       || (this.sSOLoginDataModel.RoleID == EnumRole.ITIInvisilator) || (this.sSOLoginDataModel.RoleID == EnumRole.ITITeacherNonEngNonEng))
    {
      await this.CheckProfileStatus();
      if (this.StaffMasterList.length > 0)
      {
        let status = this.StaffMasterList[0].ProfileStatus;
        if (status == EnumProfileStatus.Pending)
        {
          this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
            window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
          }, 'OK', false);
        }
      }
      else {

      }
    }
  }
  navigateToUrl(url: string) {
    this.routers.navigate([url]);  // Programmatically navigate
  }
  async GetAllData() {
    
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.CommonID = 0;
    this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID;
    try {

      this.loaderService.requestStarted();
      await this.ITITeacherDashboardService.GetITI_TeacherDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.viewITITeacherDashboardList = data['Data'];
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

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = '_checkProfileStatus'
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      await this.staffMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          console.log("CheckProfileStatus", this.StaffMasterList)
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
