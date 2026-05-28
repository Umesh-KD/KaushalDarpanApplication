import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { EventConsentActionDataModel } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { IndustryInstitutePartnershipMasterService } from '../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-iip-event-consent-list-public',
  standalone: false,
  templateUrl: './iip-event-consent-list-public.component.html',
  styleUrl: './iip-event-consent-list-public.component.css'
})
export class IipEventConsentListPublicComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new EventConsentActionDataModel();

  groupForm!: FormGroup;

  public CompanyEventsList: any = []
  public EventConsentDataList: any = []

  modalReference: NgbModalRef | undefined;
  public _EnumRole = EnumRole;

  public EventID: number = 0
  public isSubmitted: boolean = false

  displayedColumns: string[] = [
    'SrNo', 'EventName', 'EventType', 'Event', 'EventFor', 'EventSchedule', 
    'VenueName', 'LevelName', 'ConsenterName', 'InterestedStatus_str','Remarks',
    'StatusName','StatusRemark'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;

  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private loaderService: LoaderService, 
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.EventID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    if(this.EventID > 0) {
      await this.GetEventConsentData();
    }
    // await this.GetCompanyEvents();
    
  }

  async GetEventConsentData() {
    try {
      let request: any = {};
      request.EventID = this.EventID ;
      request.Action = "GetAllConsentData";
      await this.industryInstitutePartnershipMasterService.GetEventConsentData(request)
        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.EventConsentDataList = data.Data
            this.dataSource = new MatTableDataSource(this.EventConsentDataList);
            this.dataSource.sort = this.sort;
            this.totalRecords = this.EventConsentDataList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
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

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.EventConsentDataList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    if (filterValue === "all") {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.EventConsentDataList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }
}
