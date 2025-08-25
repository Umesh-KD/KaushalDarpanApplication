import { Component, ViewChild } from '@angular/core';
import { EnumDepartment, EnumStatus, GlobalConstants, EnumRole, EnumEMProfileStatus } from '../../../Common/GlobalConstants';
import { DTEApplicationDashboardDataModel, DTEDashboardModel } from '../../../Models/DTEApplicationDashboardDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ActivatedRoute } from '@angular/router';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';

@Component({
  selector: 'app-guestroom-dashboard',
  standalone: false,
  
  templateUrl: './guestroom-dashboard.component.html',
  styleUrl: './guestroom-dashboard.component.css'
})
export class GuestRoomDashboardComponent {
  //@ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  public _GlobalConstants: any = GlobalConstants;
  public Hostel_WardenFormGroup!: FormGroup;
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new DTEApplicationDashboardDataModel();
  public HostelDashboardList: DTEDashboardModel[] = [];
  public MultiHostelWardenRoleList: any = [];
  public searchRequest1 = new StaffMasterSearchModel();
  public _EnumDepartment = EnumDepartment;
  public IsShowDashboard: boolean = false;
  //Profile View Variables Pawan
  public ProfileLists: any = {};
  public StaffMasterList: any = [];
  public rquestfrom: any = [];
  //Profile View Variables Pawan
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  constructor(
    private commonMasterService: CommonFunctionService,
    private studentRequestService: StudentRequestService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private staffMasterService: StaffMasterService,
    private router: ActivatedRoute, private modalService: NgbModal, public appsettingConfig: AppsettingService, private Swal2: SweetAlert2,
    private sweetAlert2: SweetAlert2
  ) {
   
  }




  async ngOnInit() {
    
    
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetGuestRoomDashboard();
    await this.CheckProfileStatus();
    if ((this.sSOLoginDataModel.RoleID == EnumRole.GuestRoomWarden)) {

      let status = this.StaffMasterList[0].ProfileStatus;
      if (status == this._EnumEMProfileStatus.Pending || status == this._EnumEMProfileStatus.Completed || status == this._EnumEMProfileStatus.Revert) {
        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
          if (this.sSOLoginDataModel.DepartmentID == 1) {
            if (this.sSOLoginDataModel.EmTypeId == 2) {
              window.open("/additiprivatestaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
            }
            else if (this.sSOLoginDataModel.EmTypeId == 1) {
              debugger

              if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
                window.open("/bter-em-add-staff-details", "_Self")
              }

            }

            else {
              window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
            }
          }


        }, 'OK', false);
      }

      else if (status == this._EnumEMProfileStatus.Completed || this._EnumEMProfileStatus.Revert) {
        if (this.sSOLoginDataModel.EmTypeId == 1) {

          if (this.sSOLoginDataModel.ProfileID == 0 || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert) {
            window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self")
          }

        }
      }



    }


  }
  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest1.Action = '_checkProfileStatus'
      this.searchRequest1.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchRequest1.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest1.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;

      await this.staffMasterService.GetAllData(this.searchRequest1)
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



  async GetGuestRoomDashboard() {
    
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.HostelID = this.sSOLoginDataModel.HostelID;
    this.HostelDashboardList = [];
    try {
      this.loaderService.requestStarted();
      await this.studentRequestService.GetGuestRoomDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.HostelDashboardList = data['Data'];

          }
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
