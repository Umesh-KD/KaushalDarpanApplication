import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { PlacementStudentService } from '../../../Services/PlacementStudent/placement-student.service';
import { PlacementStudentSearchModel } from '../../../Models/PlacementStudentSearchModel';
import { PlacementStudentResponseModel } from '../../../Models/PlacementStudentResponseModel';
import { EnumStatus } from '../../../Common/GlobalConstants';

declare function tableToExcel(table: any, name: any, fileName: any): any;

@Component({
    selector: 'app-placement-student',
    templateUrl: './placement-student.component.html',
    styleUrls: ['./placement-student.component.css'],
    standalone: false
})
export class PlacementStudentComponent implements OnInit {
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public UserID: number = 0;
  public AllSelect: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();

  public InstituteMasterList: any[] = [];
  public StreamMasterList: any[] = [];
  public CampusMasterList: any[] = [];
  public CampusWiseHiringRoleList: any[] = [];
  public FinancialYearList: any[] = [];
  public NoRangeList: any[] = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
  public searchRequest = new PlacementStudentSearchModel();
  public StudentList: PlacementStudentResponseModel[] = [];

  constructor(private commonMasterService: CommonFunctionService, private Router: Router, private placementStudentService: PlacementStudentService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetCampusPostMasterDDL();
    await this.GetInstituteMasterDDL();
    await this.GetBranchMasterDDL();
    await this.GetFinancialYearDDL();

    //await this.GetAllData();
  }

  //
  async GetCampusPostMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCampusPostMasterDDL(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusMasterList = data['Data'];
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
  //
  async GetCampusWiseHiringRoleDDL() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCampusWiseHiringRoleDDL(this.searchRequest.CampusPostID, this.searchRequest.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusWiseHiringRoleList = data['Data'];
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
  //
  async GetInstituteMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
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
  //
  async GetBranchMasterDDL() {
    try {
      await this.commonMasterService.StreamMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
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
  //
  async GetFinancialYearDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FinancialYearList = data['Data'];
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

  //get all
  async GetAllData() {
    this.StudentList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AgeFrom = this.searchRequest.AgeFrom ?? 0;
      this.searchRequest.AgeTo = this.searchRequest.AgeTo ?? 0;
      await this.placementStudentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
          }
          else {
            this.toastr.error(data.ErrorMessage);
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
  //clear search
  async ClearSearchData() {
    this.StudentList = [];
    this.searchRequest = new PlacementStudentSearchModel();
    await this.GetAllData()
  }

  //excel export
  public async ExcelExport() {
    if (this.StudentList.length > 0) {
      tableToExcel("tbl_placementStudent", "Students", "PlacementStudent");
    }
  }
}
