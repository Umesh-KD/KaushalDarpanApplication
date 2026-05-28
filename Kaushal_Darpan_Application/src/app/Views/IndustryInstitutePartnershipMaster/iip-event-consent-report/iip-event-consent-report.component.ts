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
import { EventConsentActionDataModel } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';

@Component({
  selector: 'app-iip-event-consent-report',
  standalone: false,
  templateUrl: './iip-event-consent-report.component.html',
  styleUrl: './iip-event-consent-report.component.css'
})
export class IIPEventConsentReportComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new EventConsentActionDataModel();

  public CompanyEventsList: any = []
  public EventConsentDataList: any = []

  modalReference: NgbModalRef | undefined;
  public _EnumRole = EnumRole;

  public EventID: number = 0
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

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.EventID = Number(this.activatedRoute.snapshot.queryParamMap.get('eid')?.toString());
    this.EventTypeID = Number(this.activatedRoute.snapshot.queryParamMap.get('etid')?.toString());
    this.EventStatusID = Number(this.activatedRoute.snapshot.queryParamMap.get('esid')?.toString());
    await this.GetEventConsentData();
    
  }

  async GetEventConsentData() {
    try {
      let request: any = {};
      request.EventID = this.EventID ;
      request.EventTypeID = this.EventTypeID;
      request.EventStatusID = this.EventStatusID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.RoleID = this.sSOLoginDataModel.RoleID; 
      request.Action = "GetAllConsentData";
      await this.industryInstitutePartnershipMasterService.GetIIPEventConsentReportData(request)
        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.EventConsentDataList = data.Data
            //table feature load
            this.loadInTable();
            //end table feature load
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning("Event not found")
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    } catch (error) {
      console.error(error)
    }
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
}
