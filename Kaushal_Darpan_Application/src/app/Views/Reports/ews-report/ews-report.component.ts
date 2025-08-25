import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { GetCollegeInformationReport, GetEWSReport } from '../../../Models/GenerateAdmitCardDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { OnlineMarkingReportModel, OnlineMarkingSearchModel } from '../../../Models/OnlineMarkingReportDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-ews-report',
  standalone: false,
  templateUrl: './ews-report.component.html',
  styleUrl: './ews-report.component.css'
})
export class EWSReportComponent {

  public EWSReportList: GetEWSReport[] = [];
  public searchRequest = new GetEWSReport();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public InstituteMasterList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public selectedDivision: number = 0;
  public selectedDistrict: number = 0;

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

  constructor(private loaderService: LoaderService, private reportService: ReportService, private commonMasterService: CommonFunctionService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
    this.loadMasterData();
    this.getStreamMasterList();
  }

  exportToExcel() {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.EWSReportList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const fileName = `EWSReport_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  async GetAllData() {
    try {
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
 
      this.loaderService.requestStarted();
      await this.reportService.GetEWSReportsData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.EWSReportList = data.Data;
        this.totalInTableRecord = this.EWSReportList.length;
        this.loadInTable();
      }, (error: any) => console.error(error))
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



  async loadMasterData() {
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
        //this.filterForm?.patchValue({
        //  selectedInstitute: parseInt(this.instituteId),
        //});
      }, (error: any) => console.error(error));
  }


  async getStreamMasterList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }


  Reset() {

    this.searchRequest.InstituteID = 0;
    this.searchRequest.StreamID = 0;

    this.GetAllData();
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
    this.paginatedInTableData = [...this.EWSReportList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.EWSReportList.length;
  }











}
