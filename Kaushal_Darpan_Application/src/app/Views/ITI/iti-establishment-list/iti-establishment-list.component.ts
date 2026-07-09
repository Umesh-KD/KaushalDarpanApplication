import { Component } from '@angular/core';
import { ItiPlanningSearchModel, SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumRole } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-iti-establishment-list',
  standalone: false,
  templateUrl: './iti-establishment-list.component.html',
  styleUrl: './iti-establishment-list.component.css'
})
export class ItiEstablishmentListComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ItiPlanningSearchModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole;
  public AnnouncementTypeList: any[] = [];
  years: number[] = [];
  currentYear = new Date().getFullYear();
  constructor(
    private commonMasterService: CommonFunctionService,
    private ITIsService: ITIsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;


    console.log(this.sSOLoginDataModel);
    if (this.sSOLoginDataModel.RoleID == 20 || this.sSOLoginDataModel.RoleID == 43) {
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    }

    //this.getSemesterMasterList();
    //this.getStreamMasterList();
    //this.getExamMasterList();
    //if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
    //  this.isInstituteDisabled = true;
    //  this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    //}
    //this.getExaminerData();
    //this.getExamMasterList();//grid data
    /*  this.getExaminerData()*/

    await this.GetGovtITI();
    await this.GetAllGovtITI();
    await this.GetAnnouncementTypeList();
    this.searchRequest.AnnoucementType = -1;
    for (let year = this.currentYear + 10; year >= 1900; year--) {
      this.years.push(year);
    }
  }



  async GetGovtITI() {
    try {


      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("GovtIti")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.InstituteMasterDDLList = data['Data'];

          // console.log(this.DivisionMasterList)
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




  async GetAllGovtITI() {
    try {
      


      this.searchRequest.DistrictID = this.sSOLoginDataModel.DistrictID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.loaderService.requestStarted();
      await this.ITIsService.GetAllEstablishmentIti(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ExaminersList = data['Data'];

          // console.log(this.DivisionMasterList)
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

  async ResetControl() {
    this.searchRequest.CollegeName = ''
    this.searchRequest.IsNewCollege = 2
    this.searchRequest.InstituteID = 0
  }
  exportToExcel(): void {
    const wantedColumns = [
      'AnnoucementType',
      'DivisionName',
      'DistrictName',
      'LoksabhaConstituency',
      'VidhanSabhaConstituency',
      'SubDivision',
      'TehsilName',
      'PanchayatSamiti1',
      'Urban/Rural',
      'GramPanchayatSamitiName',
      'VillageName',
      'CollegeName',
      'Principal/SuperintendentName',
      'PrincipalMobile',
      'PrincipleEmailID',
      'Category',
      'NameOfConstructionAgency',
      'PDName',
      'PDMobile',
      'ContractorName',
      'ContractorName',
      'ContractorMobile',
      'LandType',
      'LandAvailable',
      'LandAddress',
      'Pincode',
      'DistanceFromPanchayat',
      'LandDispute',
      'AdministrativeOrderNo',
      'AdministrativeOrderDate',
      'WorkStartDate',
      'WorkCompleteDate',
      'PercentageOfCivilWorkprogress',
      'MultipurposeHallStatus',
      'IsMainITIBuilding',
      'BuildingTakeOver',
      'ApproachRoadComplete',
      'InternalRoadComplete',
      'WaterSupplySource',
      'WaterHarvestingStructure',
      'IsRequired3Phase_KW',
      'ContractLoad',
      'Is3PhaseAvailable',
      'NoOfElectricalConnection',
      'IsSolarPanelAvailable',
      'PanelCapacity',
      'IsBoundaryWall',
      'BuildShortage',
      'IsOperatingOwn',
      'IsHostelAvailable',
      'HostelUtilized',
      'ShilanyasName',
      'ShilanyasDate',
      'NoOfTree',

    
    ];

    // ✅ Keep only wanted columns
    const filteredData = this.ExaminersList.map((item: any) => {
      const filteredItem: any = {};
      wantedColumns.forEach(key => {
        if (item.hasOwnProperty(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    // ✅ Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // ✅ Auto column width
    const colWidths = Object.keys(filteredData[0] || {}).map(key => {
      const maxLength = Math.max(
        key.length,
        ...filteredData.map((row: any) =>
          row[key] ? row[key].toString().length : 0
        )
      );
      return { wch: maxLength + 5 }; // Add 5 for spacing
    });

    ws['!cols'] = colWidths;

    // ✅ Create workbook and export
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PlanningList');
    XLSX.writeFile(wb, 'PlanningList.xlsx');
  }

  async GetAnnouncementTypeList() {
    try {
      debugger


      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("AnnouncementType", 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AnnouncementTypeList = data['Data'];
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
}
