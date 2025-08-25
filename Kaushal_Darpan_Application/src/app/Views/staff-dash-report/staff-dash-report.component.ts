import { Component } from '@angular/core';
import { StaffMasterSearchModel } from '../../Models/StaffMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffDashService } from '../../Services/StaffDashboard/staff-dashboard.service';

@Component({
    selector: 'app-staff-dash-report',
    templateUrl: './staff-dash-report.component.html',
    styleUrls: ['./staff-dash-report.component.css'],
    standalone: false
})
export class StaffDashReportComponent {
  public searchRequest = new StaffMasterSearchModel();
  public StateMasterList: any = [];
  public RoleMasterList: any = [];
  public DesignationMasterList: any = [];
  public BranchesMasterList: any = [];
  public SubjectMasterDDL: any = [];
  public DistrictMasterList: any = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateID: number = 0;
  public StaffMasterList: any = [];
  public Table_SearchText: string = "";
  public Id: any | null = null;
  public InstituteList: any = []
  public StaffTypeList: any = []
  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private staffMasterService: StaffDashService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id');

    this.activatedRoute.paramMap.subscribe(params => {
      this.Id = params.get('id');
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // this.Id = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());//student list key
    this.GetStateMaterData();
    this.GetRoleMasterData();
    this.GetDesignationMasterData();
    this.GetBranchesMasterData();
    this.GetSubjectMasterDDL();
    await this.GetAllData();
  }

  async GetStateMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StateMasterList = data['Data'];
          console.log(this.StateMasterList);
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetInstituteMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteList = data.Data;
        console.log("InstituteList", this.InstituteList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.searchRequest.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetRoleMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterList = data.Data;
        console.log("DesignationMasterList", this.DesignationMasterList);
      }, error => console.error(error))
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetBranchesMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchesMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetSubjectMasterDDL() {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectMasterDDL(DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
        console.log("SubjectMasterList", this.SubjectMasterDDL);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      this.searchRequest.StaffID = this.Id
      await this.staffMasterService.GetDashReport(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          console.log(this.StaffMasterList)
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

  async ClearSearchData() {
    this.searchRequest = new StaffMasterSearchModel();
    this.searchRequest.StateID = 0;
    this.DistrictMasterList = [];
    await this.GetAllData();
  }

  //async DeleteById(PlacementCompanyID: number) {
  //  this.Swal2.Confirmation("Do you want to delete?",
  //    async (result: any) => {
  //      //confirmed
  //      if (result.isConfirmed) {
  //        try {
  //          //Show Loading
  //          this.loaderService.requestStarted();

  //          await this.staffMasterService.DeleteById(PlacementCompanyID, this.sSOLoginDataModel.UserID)
  //            .then(async (data: any) => {
  //              data = JSON.parse(JSON.stringify(data));
  //              console.log(data);

  //              if (!data.State) {
  //                this.toastr.success(data.SuccessMessage)
  //                //reload
  //                await this.GetAllData();
  //              }
  //              else {
  //                this.toastr.error(data.ErrorMessage)
  //              }

  //            }, (error: any) => console.error(error)
  //            );
  //        }
  //        catch (ex) {
  //          console.log(ex);
  //        }
  //        finally {
  //          setTimeout(() => {
  //            this.loaderService.requestEnded();
  //          }, 200);
  //        }
  //      }
  //    });


}


