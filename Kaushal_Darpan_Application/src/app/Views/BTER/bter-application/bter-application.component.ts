import { Component, ViewChild } from '@angular/core';
import { ItiApplicationService } from '../../../Services/ItiApplication/iti-application.service';
import { FormBuilder } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ItiApplicationDataModel, ItiDashApplicationSearchModel } from '../../../Models/ItiApplicationDataModel';
import { EnumDepartment, EnumMessageType, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ReportService } from '../../../Services/Report/report.service';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { HttpClient } from '@angular/common/http';
import { ViewApplicationComponent } from '../application-view/application-view.component';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { DTEDashApplicationSearchModel } from '../../../Models/ApplicationFormDataModel';
import { DTEDashboardServiceService } from '../../../Services/DTE_Dashboard/dte-dashboard-service.service';
import { NotifyStudentModel } from '../../../Models/DashboardCardModel';
import { StudentVerificationListService } from '../../../Services/StudentVerificationList/student-verification-list.service';
import * as XLSX from 'xlsx';
import { DownloadZipDocumentModel, DTEApplicationDashboardDataModel } from '../../../Models/DTEApplicationDashboardDataModel';
import { MenuService } from '../../../Services/Menu/menu.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { ApplicationMessageDataModel } from '../../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { CommonFunctionHelper } from '../../../Common/commonFunctionHelper';

@Component({
  selector: 'app-bter-application',
  templateUrl: './bter-application.component.html',
  styleUrls: ['./bter-application.component.css'],
  standalone: false
})
export class BTERApplicationComponent {
  //public ItiApplication: ItiApplicationDataModel[] = [];
  public messageModel = new ApplicationMessageDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  Requestdata = new NotifyStudentModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new ItiApplicationDataModel()
  public searchRequest = new DTEDashApplicationSearchModel();
  public downloadZipDocumentModel = new DownloadZipDocumentModel();
  public ApplicationList: any[] = [];
  public ApplicationListSummary: any[] = [];
  public GenderList: any = [];
  public InstituteList: any = [];
  public DistrictList: any = [];
  public UrlStatus: string = '';
  public searchrequest = new ItiApplicationSearchmodel()
  public searchReqSummary = new DTEApplicationDashboardDataModel();
  public _GlobalConstants: any = GlobalConstants;
  public CategoryBlist: any = [];
  public category_CList: any = [];
  public CategoryAlist: any = [];
  public AllSelect: boolean = false;
  UniqueKeys: any[] = [];
  public selectedNames: string[] = [];
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
  public AppID: number = 0
  public lstAcedmicYear: any;
  //end table feature default

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  sortColumn: string = "";
  sortOrder: string = "";
  @ViewChild('ViewAppModal') childComponent!: ViewApplicationComponent;

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private smsMailService: SMSMailService,
    private ApplicationService: DTEDashboardServiceService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private routers: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private encryptionService: EncryptionService,
    private http: HttpClient,
    private studentVerificationListService: StudentVerificationListService,
    private menuService: MenuService,
    public commonFunctionHelper: CommonFunctionHelper
  ) { }


  async ngOnInit() {
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    await this.GetMasterData();
    await this.GetAcedmicYearList();
    this.UrlStatus = this.route.snapshot.paramMap.get('url')??"";

    if (this.UrlStatus) {
      await this.GetAllData(1)
    }
    await this.GetAllApplication();
    const controls = this.UniqueKeys.map(column => {
      return this.fb.control(column.selected); // initialize based on the 'selected' property
    });
  }



  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.ApplicationList) {
      item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }

  openViewApplicationPopup(ApplicationID: number, SSOID: string) {

    this.childComponent.ApplicationID = ApplicationID;
    this.childComponent.SSOID = SSOID;
    this.childComponent.OpenViewApplicationPopup();

  }

  async DownloadApplicationForm(ApplicationID: number = 0, SSoid: string = '', FolderName: string) {
    try {
      debugger
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.BTER;
      this.searchrequest.ApplicationId = ApplicationID
      console.log("searchrequest", this.searchrequest)
      await this.reportService.GetApplicationFormPreview1(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download', FolderName);
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => console.error(error)
        );
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



  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList);
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.InstituteMaster(this.searchRequest.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteList = data.Data;
          console.log(this.InstituteList)
        }, (error: any) => console.error(error))

      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data.Data;
          console.log(this.DistrictList)
        }, (error: any) => console.error(error))

      await this.commonMasterService.GetCommonMasterDDLByType('CategoryB')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryBlist = data['Data'];
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterDDLByType('Category_C')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.category_CList = data['Data'];
        }, (error: any) => console.error(error)
        );
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
  async GetAllData(i: any) {
    console.log("i", i);
    if (i == 1) {
      this.pageNo = 1;
    } else if (i == 2) {
      this.pageNo++;
    } else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    } else {
      this.pageNo = i;
    }
    debugger;
    try {

      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize

      this.searchRequest.SortColumn = this.sortColumn;
      this.searchRequest.SortOrder = this.sortOrder;

      this.loaderService.requestStarted();
      this.searchRequest.UrlStatus = this.UrlStatus;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng,
        this.searchRequest.DepartmentID = EnumDepartment.BTER;
      console.log("searchrequest", this.searchRequest)
      await this.ApplicationService.GetDashApplicationData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApplicationList = data.Data;

        this.totalRecord = this.ApplicationList[0]?.TotalRecords;

        this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        console.log("ApplicationList", this.ApplicationList)
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

  async ResetData() {
    this.searchRequest = new DTEDashApplicationSearchModel();
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.searchRequest.UrlStatus = this.UrlStatus;
    await this.GetAllData(0);
  }

  async DownloadApplicationForm111(ApplicationID: number, FolderName: string) {
    try {
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.ITI;
      this.searchrequest.ApplicationID = ApplicationID;
      console.log("searchrequest", this.searchrequest)
      await this.reportService.GetITIApplicationForm(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download', FolderName);
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => console.error(error)
        );
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


  DownloadFile(FileName: string, DownloadfileName: any, FolderName: string): void {
    debugger
    //const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + FolderName + "/" + FileName;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
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
    this.paginatedInTableData = [...this.ApplicationList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.ApplicationList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.ApplicationList.length;
  }
  // (replace org. list here)
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.ApplicationList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.ApplicationList.filter(x => x.ApplicationID == item.ApplicationID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.ApplicationList.every(r => r.Selected);
  }
  // end table feature

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetAllData(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.ApplicationList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetAllData(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetAllData(3)
    }
  }

  sortData(sortColumn: string) {
    this.sortColumn = sortColumn;
    this.sortOrder = this.sortOrder == "" ? "ASC" : (this.sortOrder == "ASC" ? "DESC" : "ASC");
    this.GetAllData(1);
  }





  //exportToExcel(): void {

  //  this.selectedNames = this.UniqueKeys.map(column => column.name);
  //  this.selectedNames.sort((a, b) => {

  //    const specialColumns = ["SCA", "Total"];

  //    const aIsSpecial = specialColumns.includes(a);
  //    const bIsSpecial = specialColumns.includes(b);


  //    if (aIsSpecial && bIsSpecial) return 0;


  //    if (aIsSpecial) return 1;
  //    if (bIsSpecial) return -1;


  //    const isANumber = !isNaN(Number(a));
  //    const isBNumber = !isNaN(Number(b));

  //    if (isANumber && !isBNumber) return 1;
  //    if (!isANumber && isBNumber) return -1;

  //    return a.localeCompare(b);
  //  });

  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ApplicationList, { header: ['S.No', ...this.selectedNames] });
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //  XLSX.writeFile(wb, 'Total-Application-Report.xlsx');
  //}

  //exportToExcel(): void {
  //  const unwantedColumns = [
  //    'TotalRecords', 'CategoryA_ID', 'CategoryE', 'SSOID', 'IsFinalSubmit', 'ModifyDate', 'IPAddress',
  //    'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
  //  ];
  //  const filteredData = this.ApplicationList.map((item: any, index: number) => {
  //    const newItem: any = { "S.No": index + 1 };
  //    const filteredItem: any = {};
  //    Object.keys(item).forEach(key => {
  //      if (!unwantedColumns.includes(key)) {
  //        filteredItem[key] = item[key];
  //      }
  //    });
  //    return filteredItem;
  //  });
  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //  XLSX.writeFile(wb, 'Total-Application-Report.xlsx');
  //}

  exportToExcel(): void {
    const unwantedColumns = [
      'TotalRecords', 'CategoryA_ID', 'CategoryE', 'SSOID', 'IsFinalSubmit', 'ModifyDate', 'IPAddress',
      'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];

    const filteredData = this.ApplicationList.map((item: any, index: number) => {
      const filteredItem: any = {};

      // Filter out unwanted columns
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });

      // Add S.No as the first column by merging objects (order matters here)
      return Object.assign({ "S.No": index + 1 }, filteredItem);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Total-Application-Report.xlsx');
  }

  //async exportDocumentsToExcel() {
  //  try {
  //    debugger;
  //    this.downloadZipDocumentModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.downloadZipDocumentModel.FinancialYear = this.lstAcedmicYear.YearName;
  //    this.downloadZipDocumentModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //    //select id
  //    const selectedApplicationIds = this.ApplicationList
  //      .filter(x => x.Selected === true)
  //      .map(x => x.ApplicationID);


  //    if (!selectedApplicationIds || selectedApplicationIds.length === 0) {
  //      this.toastr.warning('Please select any record.');
  //      return; // Stop further execution
  //    }

  //    this.downloadZipDocumentModel.ApplicationIDs = selectedApplicationIds;
  //    this.loaderService.requestStarted();
  //    await this.ApplicationService.DownloadFeePaidStudentDoc(this.downloadZipDocumentModel);
  //  } catch (ex) {
  //    console.error('Error exporting zip file:', ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async exportDocumentsToExcel() {
    try {
      //debugger

      this.isSubmitted = true;
      this.downloadZipDocumentModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.downloadZipDocumentModel.FinancialYear = this.lstAcedmicYear.YearName;
      this.downloadZipDocumentModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      //select id
      const selectedApplicationIds = this.ApplicationList
        .filter(x => x.Selected === true)
        .map(x => x.ApplicationID);


      if (!selectedApplicationIds || selectedApplicationIds.length === 0) {
        this.toastr.warning('Please select any record.');
        return; // Stop further execution
      }

      this.downloadZipDocumentModel.ApplicationIDs = selectedApplicationIds;
      //call
      await this.ApplicationService.DownloadFeePaidStudentDoc(this.downloadZipDocumentModel)
        .then((response: any) => {

          const contentType = response?.headers.get('Content-Type');
          //
          if (contentType === 'application/zip') {//1.
            // Extract filename from header
            const contentDisposition = response?.headers.get('Content-Disposition');
            let fileName = 'Students.zip';
            if (contentDisposition) {
              const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (match && match[1]) {
                fileName = match[1].replace(/['"]/g, '');
              }
            }
            // Download PDF
            const blob = response?.body as Blob;
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(objectUrl);

          } else if (contentType?.includes('text/plain')) {//2.
            // Handle plain text (like errors or "No data")
            const reader = new FileReader();
            reader.onload = () => {
              //load text
              const message = reader.result as string;
              this.toastr.error(message);
            };
            //read text
            reader.readAsText(response?.body as Blob);
          } else {
            //
            this.toastr.error('Unexpected content type received.');
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async GetAcedmicYearList() {
    try {
      this.loaderService.requestStarted();

      await this.menuService.GetAcedmicYearList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID)
        .then((AcedmicYear: any) => {
          AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
          this.lstAcedmicYear = AcedmicYear['Data'][0];
          //this.loaderService.requestEnded();
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 10);
    }
  }

  async GetAllApplication() {
    try {
      debugger;
      this.searchReqSummary.UrlStatus = this.UrlStatus;
      this.searchReqSummary.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchReqSummary.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchReqSummary.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.loaderService.requestStarted();
      await this.ApplicationService.GetAllApplication(this.searchReqSummary).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApplicationListSummary = data.Data;
        console.log(this.ApplicationListSummary, "ApplicationListSummary")
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

  exportToExcelFull(): void {
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.ApplicationListSummary.map((item: any) => {
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
    XLSX.writeFile(wb, 'DTEApplicationData.xlsx');
  }

  async Onrouting(ApplicationID: number) {

    this.AppID = ApplicationID
    await this.routers.navigate(['/documentationscrutiny'],
      { queryParams: { ApplicationID: this.encryptionService.encryptData(this.AppID) } }
    );
  }

  async NotifyCandidate() {

    this.Requestdata.List = this.ApplicationList.filter((e: any) => e.Selected == true)

    if (this.Requestdata.List.length > 0) {
      // this.Requestdata.AcademicYear = this.sSOLoginDataModel.DepartmentID;
      this.Requestdata.AcademicYear = this.sSOLoginDataModel.FinancialYearID;
      this.Requestdata.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Requestdata.UserID = this.sSOLoginDataModel.UserID;

      console.log("this.RequestData", this.Requestdata)
      this.Swal2.Confirmation("Are you sure to to change status ?",
        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            // Save Reaquest
            await this.studentVerificationListService.NotifyStudent(this.Requestdata)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.toastr.success('Applicant Notified Successfully');
                  this.GetAllData(1);
                  this.AllSelect = false
                  this.Requestdata.List = [];
                }
                else {
                  this.toastr.error('Something went wrong');
                  console.log(data.Message);
                }
              },
                (error: any) => {
                  console.error(error)
                });
          }
        });
    }
    else {
      this.toastr.error('Please Select Student For Notify');
    }
  }

  async NotifyOnlyCandidate() {
    this.Requestdata.List = this.ApplicationList.filter((e: any) => e.Selected == true)
    if (this.Requestdata.List.length > 0) {
      let ApplicationList = this.Requestdata.List.map(item => item.ApplicationID);
      ApplicationList.forEach(appId => {
        this.messageModel.ApplicationDetails?.push({ ApplicationID: appId });
      });
      this.messageModel.MessageType = EnumMessageType.Bter_NotifyCandidateDeficiency;
      // Get the mat-select element by ID or class
      const matSelect = document.querySelector('#mat-select-0');

      // Get the selected value text from within the span
      const selectedValue = matSelect?.querySelector('.mat-mdc-select-value-text span')?.textContent;
      this.messageModel.Scheme = selectedValue ?? "";
      this.smsMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success('Message sent successfully');
            this.AllSelect = false
          } else {
            this.toastr.warning('Something went wrong');
          }
        }, error => console.error(error));
    } else {
      this.toastr.warning('Please Select Checkbox');
    }
    
  }
}



