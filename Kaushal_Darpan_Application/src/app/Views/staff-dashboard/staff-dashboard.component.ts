import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { PlacementDashService } from '../../Services/PlacementDashboard/PlacementDash.service';
import { StaffDashService } from '../../Services/StaffDashboard/staff-dashboard.service';
import { StaffMasterSearchModel } from '../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';
import { EnumEMProfileStatus, EnumProfileStatus, EnumRole, } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { StaffDashboardSearchModel } from '../../Models/StaffDashboardDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';




@Component({
    selector: 'app-staff-dashboard',
    templateUrl: './staff-dashboard.component.html',
    styleUrls: ['./staff-dashboard.component.css'],
    standalone: false
})
export class StaffDashboardComponent implements OnInit {

  public viewPlacementDashboardList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new StaffMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public StaffMasterList: any = [];
  public InstituteMasterDDL: any = [];
  public InstituteName: any;
  public staffDashSearchReq = new StaffDashboardSearchModel();
  public _EnumRole = EnumRole;
  public _EnumEMProfileStatus = EnumEMProfileStatus;

  constructor(private StaffDashService: StaffDashService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonMasterService: CommonFunctionService,
    private staffMasterService: StaffMasterService,
    private sweetAlert2: SweetAlert2) {

  }

  async ngOnInit() {
    

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
    if ((this.sSOLoginDataModel.RoleID == EnumRole.Teacher) || (this.sSOLoginDataModel.RoleID == EnumRole.Invigilator) ||
      (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrivateTeacher) || (this.sSOLoginDataModel.RoleID == EnumRole.ITILabIncharge) ||
      (this.sSOLoginDataModel.RoleID == EnumRole.ITIClerk) || (this.sSOLoginDataModel.RoleID == EnumRole.ITIAccountant) ||
      (this.sSOLoginDataModel.RoleID == EnumRole.ITIAAO) || (this.sSOLoginDataModel.RoleID == EnumRole.TITTPO) || (this.sSOLoginDataModel.RoleID == EnumRole.ITILibrarian)
      || (this.sSOLoginDataModel.RoleID == EnumRole.HostelWardenITINCVT) || (this.sSOLoginDataModel.RoleID == EnumRole.ITIGuestRoomWarden)

      || (this.sSOLoginDataModel.RoleID == EnumRole.ITIGovtTeacher)
      || (this.sSOLoginDataModel.RoleID == EnumRole.ITIGovtLabIncharge)
      || (this.sSOLoginDataModel.RoleID == EnumRole.ITIGovtClerk)
      || (this.sSOLoginDataModel.RoleID == EnumRole.ITIGovtAccountant)
      || (this.sSOLoginDataModel.RoleID == EnumRole.ITIGovtAAO)
      || (this.sSOLoginDataModel.RoleID == EnumRole.ITIGovtLibrarian)
      || (this.sSOLoginDataModel.RoleID == EnumRole.ITIGovtGuestRoomWarden)
      || (this.sSOLoginDataModel.RoleID == EnumRole.TeacherNon)
      || (this.sSOLoginDataModel.RoleID == EnumRole.ITIStaff)
      || (this.sSOLoginDataModel.RoleID == EnumRole.HOD_Eng)

      || (this.sSOLoginDataModel.RoleID == EnumRole.BterClerk)
      || (this.sSOLoginDataModel.RoleID == EnumRole.BterAccountant)
      || (this.sSOLoginDataModel.RoleID == EnumRole.BterAAO)
      || (this.sSOLoginDataModel.RoleID == EnumRole.BterLibrarian)
      || (this.sSOLoginDataModel.RoleID == EnumRole.BterLabIncharge)
      || (this.sSOLoginDataModel.RoleID == EnumRole.BterLabAttendant)
      || (this.sSOLoginDataModel.RoleID == EnumRole.TPO)
      || (this.sSOLoginDataModel.RoleID == EnumRole.StoreKeeper)
      || (this.sSOLoginDataModel.RoleID == EnumRole.BterStaff)
      

    )
      
    {
      await this.CheckProfileStatus();
      if (this.StaffMasterList.length > 0)
      {
        debugger
        let status = this.StaffMasterList[0].ProfileStatus;
        if (status == this._EnumEMProfileStatus.Pending || status == this._EnumEMProfileStatus.Completed || status == this._EnumEMProfileStatus.Revert) {
          this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
            if(this.sSOLoginDataModel.DepartmentID == 2) {
              if (this.sSOLoginDataModel.EmTypeId == 2) {
                window.open("/additiprivatestaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
              }
              else if (this.sSOLoginDataModel.EmTypeId == 1) {
                if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
                  window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self")
                }

              }

              else {
                window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self")
              }
            } else if(this.sSOLoginDataModel.DepartmentID == 1) {
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
    let instute = this.sSOLoginDataModel.InstituteID;
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      if (this.InstituteMasterDDL?.length > 0) {
        let insti = this.InstituteMasterDDL.find(function (x: { InstituteID: number; }) {
          return x.InstituteID == instute;
        });
        this.InstituteName = insti?.InstituteName;
      }
      
    })
  }
  async GetAllData() {
    this.staffDashSearchReq.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.staffDashSearchReq.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.staffDashSearchReq.InvigilatorAppointmentID = this.sSOLoginDataModel.UserID;
    this.staffDashSearchReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.staffDashSearchReq.StaffID = this.sSOLoginDataModel.StaffID;
    this.staffDashSearchReq.SSOID = this.sSOLoginDataModel.SSOID;
    this.staffDashSearchReq.RoleID = this.sSOLoginDataModel.RoleID;
    this.staffDashSearchReq.UserID = this.sSOLoginDataModel.UserID;
    this.staffDashSearchReq.InstituteID = this.sSOLoginDataModel.InstituteID;
    try {

      this.loaderService.requestStarted();
      await this.StaffDashService.GetAllData(this.staffDashSearchReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewPlacementDashboardList = data['Data'];
          console.log(this.viewPlacementDashboardList,'ListData');
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
      this.searchRequest.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;

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
