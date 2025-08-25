import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumRole, GlobalConstants, EnumStatus } from '../../../../Common/GlobalConstants';
import { StudentExamDetails } from '../../../../Models/DashboardCardModel';
import { DownloadMarksheetSearchModel } from '../../../../Models/DownloadMarksheetDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { ResultService } from '../../../../Services/Results/result.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { RequestUpdateStatus } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { ITIAddmissionReportSearchModel, ITIAddmissionWomenReportSearchModel } from '../../../../Models/TheoryMarksDataModels';
import { ItiCollegesSearchModel } from '../../../../Models/CommonMasterDataModel';






@Component({
  selector: 'app-iti-8th-admissions-in-women-wing',
  standalone: false,
  templateUrl: './iti-8th-admissions-in-women-wing.component.html',
  styleUrl: './iti-8th-admissions-in-women-wing.component.css'
})
export class Iti8ThAdmissionsInWomenWingComponent implements OnInit {
    
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public searchRequest = new ITIAddmissionWomenReportSearchModel();
  public collegeRequest = new ItiCollegesSearchModel();
  sSOLoginDataModel: any;
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public AddmissionList: any[] = [];
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public filteredStatusList: any[] = [];
  public Table_SearchText: string = "";
  public isSubmitted: boolean = false;
  public isVisibleList: boolean = false;
  public isVisibleDownload: boolean = false;
  public DivisionMasterList: any = [];
  public DistrictMasterList: any = [];
  public CollegeMasterList: any = [];
  public TradeMasterList: any = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private resultService: ResultService,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private menuService: MenuService,
    public ReportServices: ReportService,
    private formBuilder: FormBuilder
    
  ) {
    // Get user data from localStorage
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
    })

    await this.GetDivisionMasterList();
    await this.ddlDistrict();
    await this.GetList();
    await this.ddlITIColleges();
    await this.ddlITITrade();
  }



  async ddlDistrict() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
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

  async ddlITIColleges() {
    try {

      this.loaderService.requestStarted();
      this.collegeRequest.action = "_getDataITIcollege";
      this.collegeRequest.DistrictID = 0;
      this.collegeRequest.ManagementTypeID = 0;
      await this.commonMasterService.ItiCollegesGetAllData(this.collegeRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeMasterList = data['Data'];
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
  async ddlITITrade() {
    try {

      this.loaderService.requestStarted();
      this.collegeRequest.action = "_getDataITITrade";
      this.collegeRequest.DistrictID = 0;
      this.collegeRequest.ManagementTypeID = 0;
      await this.commonMasterService.ItiCollegesGetAllData(this.collegeRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TradeMasterList = data['Data'];
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

  async GetDivisionMasterList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];
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

  async BtnSearch() {

    if (this.searchRequest.DivisionID == 0 && this.searchRequest.DistrictID == 0 && this.searchRequest.CourseTypeID == 0 && this.searchRequest.ITICollegeID == 0 && this.searchRequest.ITITradeID == 0 && this.searchRequest.ITICode == '' && this.searchRequest.TradeCode == '') {
      this.toastr.error("Please select at least one filter.");
      return;
    }
    await this.GetList();
  }

  async GetList() {
    try {
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.TradeLevelID = 8;
      this.loaderService.requestStarted();
     // this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.ReportServices.GetITIAdmissionsInWomenWingDataList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AddmissionList = data['Data']['Table'];
          this.isVisibleList = true;
          this.isVisibleDownload = true;
          this.loadInTable();
          console.log(this.AddmissionList, "AddmissionList")
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

  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.AddmissionList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.AddmissionList.length;
  }


  onResetClick() {
    this.searchRequest.DistrictID = 0;
    this.searchRequest.DivisionID = 0;
    this.searchRequest.CourseTypeID = 0;
    this.searchRequest.ITICollegeID = 0;
    this.searchRequest.ITITradeID = 0;
    this.searchRequest.ITICode = '';
    this.searchRequest.TradeCode = '';
    this.AddmissionList = [];
    this.paginatedInTableData = [];
    this.GetList();
  }


  exportToExcel(): void {
    const unwantedColumns = [''];
    const filteredData = this.AddmissionList.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, '8th-admissions-in-women-wing.xlsx');
  }



}









