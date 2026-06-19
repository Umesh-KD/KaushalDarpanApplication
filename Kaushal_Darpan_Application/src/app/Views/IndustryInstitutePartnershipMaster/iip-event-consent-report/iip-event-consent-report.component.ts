import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { IndustryInstitutePartnershipMasterService } from '../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EventConsentActionDataModel, EventConsentSearchModel } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-iip-event-consent-report',
  standalone: false,
  templateUrl: './iip-event-consent-report.component.html',
  styleUrl: './iip-event-consent-report.component.css'
})
export class IIPEventConsentReportComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new EventConsentActionDataModel();
  public searchRequest = new EventConsentSearchModel();

  public CompanyEventsList: any = []
  public EventConsentDataList: any = []
  public EventTypeList: any = [];
  public EventDataList_DDL: any = [];
  public EventList: any = [];

  modalReference: NgbModalRef | undefined;
  public _EnumRole = EnumRole;

  public EventID: number = 0
  public Event: number = 0
  public EventTypeID: number = 0
  public EventStatusID: number = 0
  public isSubmitted: boolean = false

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
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private loaderService: LoaderService, 
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    debugger
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Event = Number(this.activatedRoute.snapshot.queryParamMap.get('eid')?.toString()) || 0;
    this.EventTypeID = Number(this.activatedRoute.snapshot.queryParamMap.get('etid')?.toString()) || 0;
    this.EventStatusID = Number(this.activatedRoute.snapshot.queryParamMap.get('esid')?.toString()) || 0;

    await this.GetEventMasterData();
    await this.GetEventDataList_DDL();
    await this.GetEventConsentData();
  }

  async GetEventMasterData() {
    try {
      this.loaderService.requestStarted();
      const eventTypeRes: any = await this.commonMasterService.GetEventCommonMaster('EventType');
      this.EventTypeList = eventTypeRes.Data;

      const eventRes: any = await this.commonMasterService.GetEventCommonMaster('Event');
      this.EventList = eventRes.Data;
    } catch (error) {
      console.error(error);
    }
  }

  async GetEventDataList_DDL() {
    try {
      const request: any = {};
      request.Action = "GetAllEventData_DDL";
      if(this.sSOLoginDataModel.RoleID == EnumRole.IIPIncharge) {
        request.InstituteID = this.sSOLoginDataModel.InstituteID;
      } else {
        request.InstituteID = 0
      }
      request.Event = this.searchRequest.Event;
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.EventTypeID = this.searchRequest.EventTypeID;
      debugger
      await this.industryInstitutePartnershipMasterService.GetIIPEventConsentReportData(request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.EventDataList_DDL = data.Data
          } 
        })
    } catch (error) {
      console.error(error);
    }
  }

  async GetEventConsentData() {
    try {
      // if(this.Event != undefined || this.Event != null || this.Event != 0) {
      //   this.searchRequest.Event = this.Event ;
      // }

      // if(this.EventTypeID != undefined || this.EventTypeID != null || this.EventTypeID != 0){
      //   this.searchRequest.EventTypeID = this.EventTypeID;
      // }
      
      // if(this.EventStatusID != undefined || this.EventStatusID != null || this.EventStatusID != 0 ){
      //   this.searchRequest.EventStatusID = this.EventStatusID;
      // }

      // if(this.sSOLoginDataModel.RoleID == EnumRole.IIPIncharge) {
      //   this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      // }

      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID; 
      this.searchRequest.Action = "GetAllConsentData";
      debugger
      await this.industryInstitutePartnershipMasterService.GetIIPEventConsentReportData(this.searchRequest)
        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.EventConsentDataList = data.Data
          //table feature load
          this.loadInTable();
          //end table feature load
        })
    } catch (error) {
      console.error(error)
    }
  }

  async ClearSearchData() {
    this.searchRequest = new EventConsentSearchModel();
    this.searchRequest.EventID = this.EventID ;
    this.searchRequest.EventTypeID = this.EventTypeID;
    this.searchRequest.EventStatusID = this.EventStatusID;
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID; 
    this.searchRequest.Action = "GetAllConsentData";
    await this.GetEventConsentData();
  }

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData()
  {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.EventConsentDataList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.EventConsentDataList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.EventConsentDataList.length;
  }
  // (replace org. list here)
  get totalInTableSelected(): number {
    return this.EventConsentDataList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.EventConsentDataList.forEach((x: any) => {
      if(x.Status == 0) {
        x.Selected = this.AllInTableSelect;
      }
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.EventConsentDataList.filter((x: any) => x.ConsentID == item.ConsentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.EventConsentDataList.every((r: any) => r.Selected);
  }
  // end table feature

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'InspectionTeamID', 'ZoneID', 'DistrictID', 'InstituteID', 'EndTermID', 'FinancialYearID', 'CompanyID', 'EventID', 'InterestedStatus', 'ConsentID', 'ConsentID1', 'IsHost', 'Status','CompanyStatus'];
    const filteredData = this.EventConsentDataList.map((item: any) => {
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

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB').split('/').join('-');

    const fileName = `EventConsentReport_${dateStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }


}
