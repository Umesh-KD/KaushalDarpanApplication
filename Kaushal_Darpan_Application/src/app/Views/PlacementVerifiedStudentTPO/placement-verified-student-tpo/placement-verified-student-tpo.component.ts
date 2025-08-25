import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { PlacementVerifiedStudentTPOSearchModel } from '../../../Models/PlacementVerifiedStudentTPOSearchModel';
import { PlacementVerifiedStudentTPOResponseModel } from '../../../Models/PlacementVerifiedStudentTPOResponseModel';
import { PlacementVerifiedStudentTPOService } from '../../../Services/PlacementVerifiedStudentTPO/placement-verified-student-tpo.service';

declare function tableToExcel(table: any, name: any, fileName: any): any;

@Component({
    selector: 'app-placement-verified-student-tpo',
    templateUrl: './placement-verified-student-tpo.component.html',
    styleUrls: ['./placement-verified-student-tpo.component.css'],
    standalone: false
})
export class PlacementVerifiedStudentTpoComponent implements OnInit {
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
  public searchRequest = new PlacementVerifiedStudentTPOSearchModel();
  public StudentList: PlacementVerifiedStudentTPOResponseModel[] = [];

  constructor(private commonMasterService: CommonFunctionService, private Router: Router, private placementVerifiedStudentTPOService: PlacementVerifiedStudentTPOService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
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
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AgeFrom = this.searchRequest.AgeFrom ?? 0;
      this.searchRequest.AgeTo = this.searchRequest.AgeTo ?? 0;
      await this.placementVerifiedStudentTPOService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == 0) {
            this.StudentList = data['Data'];
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
    this.searchRequest = new PlacementVerifiedStudentTPOSearchModel();
    // await this.GetAllData()
  }

  //excel export
  public async ExcelExport() {
    if (this.StudentList.length > 0) {
      tableToExcel("tbl_placementVerifiedstudenttpo", "Students", "PlacementVerifiedStudentTpo");
    }
  }
}
