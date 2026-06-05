import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { EnumRole, EnumEMProfileStatus } from "../../../app/Common/GlobalConstants";
import { SSOLoginDataModel } from "../../../app/Models/SSOLoginDataModel";
import { StaffDashboardSearchModel } from "../../../app/Models/StaffDashboardDataModel";
import { StaffMasterSearchModel } from "../../../app/Models/StaffMasterDataModel";
import { CommonFunctionService } from "../../../app/Services/CommonFunction/common-function.service";
import { LoaderService } from "../../../app/Services/Loader/loader.service";
import { StaffMasterService } from "../../../app/Services/StaffMaster/staff-master.service";
import { SweetAlert2 } from "../../../app/Common/SweetAlert2";


@Component({
    selector: 'app-instructor-dashboard',
    standalone: false,
    templateUrl: './instructor-dashboard.component.html',
    styleUrl: './instructor-dashboard.component.css'
})
export class InstructorDashboardComponent implements OnInit {

    constructor(
        private toastr: ToastrService,
        private loaderService: LoaderService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private routers: Router,
        private commonMasterService: CommonFunctionService,
        private staffMasterService: StaffMasterService,
        private sweetAlert2: SweetAlert2
    ) { }


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




    async ngOnInit() {


        this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

        await this.CheckProfileStatus();
        if (this.StaffMasterList.length > 0) {
            debugger;
            let status = this.StaffMasterList[0].ProfileStatus;
            if (status == this._EnumEMProfileStatus.Pending || status == this._EnumEMProfileStatus.Completed || status == this._EnumEMProfileStatus.Revert) {
                this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
                    if (this.sSOLoginDataModel.DepartmentID == 2) {
                        if (this.sSOLoginDataModel.EmTypeId == 2) {
                            window.open("/additiprivatestaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self");
                        }
                        else if (this.sSOLoginDataModel.EmTypeId == 1) {
                            if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
                                window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self");
                            }

                        }

                        else {
                            window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self");
                        }
                    } else if (this.sSOLoginDataModel.DepartmentID == 1) {
                        if (this.sSOLoginDataModel.EmTypeId == 2) {
                            window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self");
                        }
                        else if (this.sSOLoginDataModel.EmTypeId == 1) {
                            debugger;

                            if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
                                window.open("/bter-em-add-staff-details", "_Self");
                            }

                        }

                        else {
                            window.open("/addstaffmaster?id=" + this.StaffMasterList[0].StaffID, "_Self");
                        }
                    }


                }, 'OK', false);
            }

            else if ((status == this._EnumEMProfileStatus.Completed || this._EnumEMProfileStatus.Revert) && this.sSOLoginDataModel.DepartmentID == 2) {
                if (this.sSOLoginDataModel.EmTypeId == 1) {

                    if (this.sSOLoginDataModel.ProfileID == 0 || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert) {
                        window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self");
                    }

                }



            }

        }
        let instute = this.sSOLoginDataModel.InstituteID;
        this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.InstituteMasterDDL = data.Data;
            if (this.InstituteMasterDDL?.length > 0) {
                let insti = this.InstituteMasterDDL.find(function(x: { InstituteID: number; }) {
                    return x.InstituteID == instute;
                });
                this.InstituteName = insti?.InstituteName;
            }

        });
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
