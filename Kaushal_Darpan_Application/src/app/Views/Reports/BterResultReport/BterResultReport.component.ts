import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CustomizeReportDataModels, CustomizeReportCoulmnSearchModel, CustomizeReportSearchModel } from '../../../Models/CustomizeReport';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ReportService } from '../../../Services/Report/report.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { PageEvent } from '@angular/material/paginator';
import { MiscellaneousModel } from '../../../Models/MiscellaneousModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { empty } from 'rxjs';

@Component({
  selector: 'app-BterResultReport',
  standalone: false,
  templateUrl: './BterResultReport.component.html',
  styleUrl: './BterResultReport.component.css'
})
export class BterResultReportComponent implements OnInit {
  public State: number = -1;
  public groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  request = new CustomizeReportDataModels()
  public searchRequest = new CustomizeReportSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public CustomizeReportCoulmnDataRequest = new CustomizeReportCoulmnSearchModel();
  public CustomizeReportDataModels = new CustomizeReportDataModels();
  CustomizeReportCoulmnData = new CustomizeReportCoulmnSearchModel();
  public CustomizeReportCoulmnDataPush: CustomizeReportCoulmnSearchModel[] = [];
  public filter: any = {};
  public repType: number = 0;
  public sem: number = 0;
  public IsSNo: boolean = false;
 
  //public requestData = new CustomizeReportCoulmnSearchModel();
  public requestData = new MiscellaneousModel();
  public GetfilteredList: any[] = [];
  public GetfilteredColumnlist: any[] = [];
  public selectedNames: string[] = [];
  public SetfileName: string = '';
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
  ) {

    this.repType = parseInt(this.routers.snapshot.paramMap.get('repType') ?? "0");
    this.sem = parseInt(this.routers.snapshot.paramMap.get('sem') ?? "0");
  }
  dataSource: MatTableDataSource<CustomizeReportCoulmnSearchModel> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  filteredData: any[] = [];
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  displayedColumns: any[] = [];
  UniqueKeys: any[] = [];
  StreamMasterList: any[] = [];
  StudentTypeList: any[] = [];
  CourseTypeList: any[] = [];
  InstituteList: any[] = [];
  EndTermList: any[] = [];
  ReportFlaglist: any[] = [];
  ReportTypelist: any[] = [];
  public Branchlist: any = [];

  async ngOnInit() {

    const controls = this.UniqueKeys.map(column => {
      return this.fb.control(column.selected);
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.groupForm = this.fb.group({
      displayColumns: [''],
      StateId: [''],
      StudentType: [''],
      SemesterID: [this.sem],
      StreamID: [''],
      District: [''],
      gender: [''],
      Block: [''],
      CourseType: [''],
      Institute: [''],
      EndTerm: [''],
      CategaryCast: [''],
      UniqueCol: [''],
      ReportFlagID: [''],
      Type: [this.repType],
      SchemeID: ['0'],
      BranchID:['0']
    });

   

    await this.loadReportType();

    await this.commonMasterService.SemesterMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SemesterMasterList = data['Data'];
    }, (error: any) => console.error(error));

    await this.reportService.GetEndTerm().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.EndTermList = data['Data'];
    }, (error: any) => console.error(error));
    

  }
  async loadReportType() {
    this.ReportTypelist = [
      { ID: 0, DisplayOrder: 1, Name: 'ResultReport' }
    ];

    this.ReportTypelist.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
  }
  get form() { return this.groupForm.controls; }

  async SubmitData() {
    try {
        this.DownloadGetToppersReport();
    }
    catch (ex) {
      console.log(ex);
    }
  }

  applyFilter(filterValue: string): void {
    if (filterValue === "all") {

      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.CustomizeReportCoulmnDataPush.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }
  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }
  ResetReport() {
    this.filter = {};
    this.displayedColumns = [];
    this.UniqueKeys = [];
    this.CustomizeReportCoulmnDataPush = [];
    this.requestData = new MiscellaneousModel();
  }
  DownloadPdf() {
    this.SubmitData();
  }
  get isPdfReport(): boolean {
    const type = Number(this.groupForm.get('Type')?.value);
    return type === 1;
  }
  async DownloadGetToppersReport() {
    try {
      debugger
      const endTermId = this.groupForm.get('EndTerm')?.value;
      const BranchID = this.groupForm.get('BranchID')?.value;
      const ToppersModel = {
        EndTermId: endTermId,
        CourseType: this.sSOLoginDataModel.Eng_NonEng,
        BranchID: BranchID
      };
      this.SetfileName ='GetToppersReport_'
      const data: any = await this.reportService.GetToppersReport(ToppersModel);
      const response = JSON.parse(JSON.stringify(data));
      if (response.State === EnumStatus.Success) {
        if (response.Data && response.Data.length > 0) {
          this.downloadBase64PDF(response.Data, this.SetfileName + '.pdf');
        } else {
          this.toastr.warning('No data available to generate PDF.');
        }

      } else {
        this.toastr.error(response.Message);
      }

    } catch (error) {
      console.error(error);
      this.toastr.error('Something went wrong.');
    }
  }
  downloadBase64PDF(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  async GetStream() {
    try {
      debugger
      this.loaderService.requestStarted();
      const endTermId = this.groupForm.get('EndTerm')?.value;
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, endTermId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Branchlist = data['Data'];
        }, error => console.error(error));
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
}
