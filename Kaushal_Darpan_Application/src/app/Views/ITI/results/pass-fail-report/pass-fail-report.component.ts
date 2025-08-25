import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Renderer2, signal, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../../Common/appsetting.service";
import { EnumDepartment, EnumStatus, GlobalConstants } from "../../../../Common/GlobalConstants";

import { DocumentDetailsModel } from "../../../../Models/DocumentDetailsModel";
import { PreviewApplicationModel } from "../../../../Models/PreviewApplicationformModel";
import { ItiApplicationFormService } from "../../../../Services/ItiApplicationForm/iti-application-form.service";
import { LoaderService } from "../../../../Services/Loader/loader.service";
import { ReportService } from "../../../../Services/Report/report.service";
import { CommonFunctionService } from "../../../../Services/CommonFunction/common-function.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ItiApplicationSearchmodel } from "../../../../Models/ItiApplicationPreviewDataModel";
import { StudentMarksheetSearchModel } from "../../../../Models/OnlineMarkingReportDataModel";
import { DropdownValidators } from "../../../../Services/CustomValidators/custom-validators.service";

@Component({
  selector: 'app-pass-fail-report',
  standalone: false,
  templateUrl: './pass-fail-report.component.html',
  styleUrl: './pass-fail-report.component.css'
})
export class passfailreportDownloadComponent implements AfterViewInit {
  public searchrequest = new ItiApplicationSearchmodel();
  sSOLoginDataModel: any;
  searchForm!: FormGroup;
  tooltipText = signal('');
  StudentExamsPapersList: any = [];
  STUFFPapersList: any = [];
  public StudentDetails: any[] = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  public MarksheetSearch = new StudentMarksheetSearchModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public GetStudentITI_MarksheetList: any[] = [];
  public GetStudentITI_MarksheetList1: any[] = [];
  public GetStudentITI_MarksheetList2: any[] = [];
  public isSubmitted: boolean = false;
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
  public SearchTypeText: string = '';
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;


  constructor(
    private loaderService: LoaderService,
    private ApplicationService: ItiApplicationFormService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private fb: FormBuilder,
    private reportService: ReportService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }
  ngAfterViewInit() {
    this.cdr.detectChanges(); // Make sure the DOM is ready
  }
  async ngOnInit() {
    this.searchForm = this.fb.group({
      /*ddlExamYearID: ['', [DropdownValidators]],*/
      ddlPassFailID: ['', [DropdownValidators]]
    });

    //this.MarksheetSearch.ExamYearID = 1;

    //await this.GetITIStudent_PassDataList();

  }

  async onSubmit() {
    debugger
    this.isSubmitted = true;

    if (this.MarksheetSearch.PassFailID == 1) {
      this.SearchTypeText = 'Pass Student';
    } else if (this.MarksheetSearch.PassFailID == 2) {
      this.SearchTypeText = 'Fail Student';
    } else {
      this.SearchTypeText = 'Student Record not found  ';
    }

    if (this.searchForm.invalid) {
      console.log(this.searchForm.value)
      return
    }
    this.GetITIStudent_PassDataList();
  }
   get _searchForm() { return this.searchForm.controls; }
  async GetITIStudent_PassDataList() {
    debugger
    try {

      this.loaderService.requestStarted();
      /* this.MarksheetSearch.RollNo = "10017";*/
      this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      await this.reportService.GetITIStudent_PassDataList(this.MarksheetSearch)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          debugger
          const tableData = data?.Data?.Table ?? [];
          this.GetStudentITI_MarksheetList = tableData;
          this.GetStudentITI_MarksheetList1 = tableData.filter((x: any) => x.SemesterID === "1");
          this.GetStudentITI_MarksheetList2 = tableData.filter((x: any) => x.SemesterID === "2");
          // console.log('checkdata',this.GetStudentITI_MarksheetList);

        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetITIStudent_PassList() {
    debugger
    try {

      this.loaderService.requestStarted();

      this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      await this.reportService.GetITIStudent_PassList(this.MarksheetSearch)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          debugger
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'StudentMarksheet.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



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
    //this.paginatedInTableData = [...this.GetStudentITI_MarksheetList].slice(this.startInTableIndex, this.endInTableIndex);
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
    //this.totalInTableRecord = this.GetStudentITI_MarksheetList.length;
  }
}

