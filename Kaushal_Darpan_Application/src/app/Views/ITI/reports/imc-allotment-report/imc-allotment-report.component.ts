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
import { IMCAllotmentReportRequestModel } from '../../../../Models/TheoryMarksDataModels';
import * as XLSX from 'xlsx';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';

@Component({
  selector: 'app-imc-allotment-report',
  standalone: false,
  templateUrl: './imc-allotment-report.component.html',
  styleUrl: './imc-allotment-report.component.css'
})
export class IMCAllotmentReportComponent {
  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public searchRequest = new IMCAllotmentReportRequestModel();
  public AllListConfiguration: ListAllotmentConfigurationModel[] = [];
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  public IMCAllotmentList: any[] = [];
  public backupFinalList: any[] = [];
  ReportService = inject(ReportService);
  public ItiCollegesListAll: any[] = [];
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
  public selectedITIGcode: string = "";
  public selectedCollegeId: number = 0;
  public collegeSearchRequest: any = {};
  public ItiTradeList: any = [];
  public StatusID:number=0
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
    this.StatusID = Number(this.activatedRoute.snapshot.paramMap.get('id')??0)
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   
    await this.GetCollegeNames();
    await this.GetIMCAllotmentReportList();
    await this.GetTradeListDDL();

  }

  async GetIMCAllotmentReportList() {

    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.StatusID = this.StatusID
    if (this.sSOLoginDataModel.RoleID == 20 || this.sSOLoginDataModel.RoleID == 43) {
      this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID
    }
    try {
      this.loaderService.requestStarted();
      await this.ReportService.IMCAllotmentReport(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.IMCAllotmentList = data?.Data?.Table || [];
          this.totalInTableRecord = this.IMCAllotmentList.length;
          this.loadInTable();
          console.log(this.IMCAllotmentList);
        }, error => console.error(error));
    } catch (ex) {
      console.error(ex);
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

  IMCAllotmentReportExportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.IMCAllotmentList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const fileName = `IMCAllotmentReportList_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  Reset() {
    this.searchRequest.TradeLevelID = 0;
    this.searchRequest.TradeTypeID = 0;
    this.searchRequest.TradeId = 0;
    this.searchRequest.CollegeId = 0;
    this.searchRequest.CollegeName = '';
    this.GetIMCAllotmentReportList();
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
    this.paginatedInTableData = [...this.IMCAllotmentList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.IMCAllotmentList.length;
  }

}
