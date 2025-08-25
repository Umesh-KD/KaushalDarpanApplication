import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { EnumRole } from '../../../../../Common/GlobalConstants';
import { ITI_ExaminerDashboardModel } from '../../../../../Models/ITI/ITI_ExaminerDashboard';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ItiExaminerService } from '../../../../../Services/ItiExaminer/iti-examiner.service';

@Component({
  selector: 'app-iti-examiner-dashboard',
  templateUrl: './iti-examiner-dashboard.component.html',
  styleUrl: './iti-examiner-dashboard.component.css',
  standalone: false
})
export class ItiExaminerDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public Table_SearchText: string = "";
  // public searchRequest = new StaffMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public StaffMasterList: any = [];
  public staffDashSearchReq = new ITI_ExaminerDashboardModel()
  _EnumRole = EnumRole;

  constructor(
    private itiExaminerService: ItiExaminerService,
    // private StaffDashService: StaffDashService,
    // private toastr: ToastrService,
    private loaderService: LoaderService,
    // private formBuilder: FormBuilder,
    // private activatedRoute: ActivatedRoute,
    // private routers: Router,
    // private modalService: NgbModal,
    // private staffMasterService: StaffMasterService,
    // private sweetAlert2: SweetAlert2
  ) {}

  async ngOnInit() {
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.staffDashSearchReq.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.staffDashSearchReq.ExaminerID = this.sSOLoginDataModel.UserID;
    this.staffDashSearchReq.SSOID = this.sSOLoginDataModel.SSOID;
    await this.GetAllData();
    // if ((this.sSOLoginDataModel.RoleID == EnumRole.Examiner)) {
    //   await this.CheckProfileStatus();
    //   //if (this.StaffMasterList.length > 0) {
    //   //  let status = this.StaffMasterList[0].ProfileStatus;
    //   //  if (status == EnumProfileStatus.Pending) {
    //   //    this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
    //   //      window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
    //   //    }, 'OK', false);
    //   //  }
    //   //}
    //   //else {

    //   //}
    // }
  }
  async GetAllData() {
 
    // this.staffDashSearchReq.InvigilatorAppointmentID = Number(this.activatedRoute.snapshot.queryParamMap.get("InvigilatorAppointmentID") ?? 0);
    try {

      this.loaderService.requestStarted();
      await this.itiExaminerService.GetItiExaminerDashboardTiles(this.staffDashSearchReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewPlacementDashboardList = data['Data'];
          console.log(this.viewPlacementDashboardList, 'ListData');
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


  // async CheckProfileStatus() {
  //   try {
  //     this.loaderService.requestStarted();
  //     //this.searchRequest.Action = '_checkProfileStatus'
  //     this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID;
  //     this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

  //     await this.staffMasterService.GetAllData(this.searchRequest)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         console.log(data);
  //         this.StaffMasterList = data['Data'];
  //         console.log("CheckProfileStatus", this.StaffMasterList)
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
}
