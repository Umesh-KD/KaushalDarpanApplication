import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../../Services/Center_Allocation/center-allocation.service';
import { CenterExamAllocationSearchModel, CenterAllocationtDataModels, InstituteList, ITIAssignPracticaLExaminer } from '../../../../Models/CenterAllocationDataModels';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { AllotmentConfigurationModel, ListAllotmentConfigurationModel } from '../../../../Models/AllotmentConfigurationDataModel';
import { AllotmentConfigurationService } from '../../../../Services/Allotment-Configuration/allotment-configuration.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { UserMasterService } from '../../../../Services/UserMaster/user-master.service';
import { VacantSeatRequestModel, AllotmentReportCollegeRequestModel, AllotmentReportCollegeByAdminRequestModel } from '../../../../Models/TheoryMarksDataModels';
import * as XLSX from 'xlsx';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';

@Component({
  selector: 'app-allotment-report-college-admin',
  standalone: false,
  templateUrl: './allotment-report-college-admin.component.html',
  styleUrl: './allotment-report-college-admin.component.css'
})
export class AllotmentReportCollegeAdminComponent {
  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public searchRequest = new AllotmentReportCollegeByAdminRequestModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  public AllotedSeatAdminList: any[] = [];
  public backupFinalList: any[] = [];
  public ItiCollegesListAll: any[] = [];
  ReportService = inject(ReportService);
  public ItiTradeList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel();
  //table feature default
  public paginatedInTableData: any[] = [];
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
  public selectedcollegeId: number = 0;
  public collegeSearchRequest: any = {};

  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private allotmentConfigurationService: AllotmentConfigurationService,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private userMasterService: UserMasterService
  ) { }


  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllotedSeatByCollegeForAdminList();
    await this.GetTradeListDDL();
    await this.GetCollegeNames();

  }

  async GetAllotedSeatByCollegeForAdminList() {
    
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;

    try {
      this.loaderService.requestStarted();
      const response = await this.ReportService.AllotmentReportCollegeForAdmin(this.searchRequest);
      const result = JSON.parse(JSON.stringify(response));
      this.AllotedSeatAdminList = result?.Data?.Table || [];
      this.totalInTableRecord = this.AllotedSeatAdminList.length;
      this.loadInTable();
      this.isVisibleList = true;
    } catch (error) {
      console.error(error);
      this.toastr.error("Failed to load data.");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeListDDL() {
    try {
      this.loaderService.requestStarted();
      this.tradeSearchRequest.action = "_getAllData"

      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ItiTradeList = parsedData.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetCollegeNames() {
    try {
      this.collegeSearchRequest = {
        action: '_getDataITIcollege',
        ManagementType: 0
      };
      const response: any = await this.commonMasterService.ItiCollegesGetAllData(this.collegeSearchRequest);
      const result = JSON.parse(JSON.stringify(response));
      if (result && result.Data) {
        this.ItiCollegesListAll = result.Data;
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  AllotedSeatByCollegeAdminExportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.AllotedSeatAdminList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const fileName = `AllotedSeatByCollegeAdminList_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }


  Reset() {
    this.searchRequest.TradeId = 0;
    this.searchRequest.TradeLevelID = 0;
    this.searchRequest.TradeTypeID = 0;
    this.searchRequest.CollegeId = 0;
    this.GetAllotedSeatByCollegeForAdminList();
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }

  updateInTablePaginatedData() {

    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.AllotedSeatAdminList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = [];
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.AllotedSeatAdminList.length;
  }

}
