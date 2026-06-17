import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DownloadMarksheetSearchModel } from '../../../Models/DownloadMarksheetDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { MarksheetDownloadService } from '../../../Services/MarksheetDownload/marksheet-download.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumCourseType, EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { MenuService } from '../../../Services/Menu/menu.service';
import { notDefaultValueValidator } from '../../../Services/CustomValidators/custom-validators.service';
@Component({
  selector: 'app-marksheet-download',
  templateUrl: './marksheet-download.component.html',
  styleUrls: ['./marksheet-download.component.css'],
  standalone: false
})
export class MarksheetDownloadComponent {
  public InstituteMasterList: any = [];
  public SemesterMasterList: any = [];
  public ResultTypeList: any = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public isSubmitted = false;
  public searchRequest = new DownloadMarksheetSearchModel();
  public downloadReq = new DownloadMarksheetSearchModel();
  public StudentList: any = []
  public StudentData: any[] = []
  public State: any;
  public Message: any;
  public ErrorMessage: any;
  public CenterMasterList: any;

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
  public FinYearList: any = [];
  buttonGroups: any[] = [];
  downLoadFG!: FormGroup;

  constructor(private commonFunctionService: CommonFunctionService,
    private marksheetDownloadService: MarksheetDownloadService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    private reportService: ReportService,
    private http: HttpClient,
    private menuService: MenuService,
  ) {
  }

  async ngOnInit() {
    this.downLoadFG = this.fb.group({
      InstituteID: ['', Validators.required],
      SemesterID: ['0', [Validators.required, notDefaultValueValidator('0')]],
      IsBridge: ['-1', [Validators.required, notDefaultValueValidator('-1')]],
      ResultTypeID: ['0', [Validators.required, notDefaultValueValidator('0')]],
      IsRevised: ['-1', [Validators.required, notDefaultValueValidator('-1')]],
      RollNo: ['', Validators.required],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.GetMasterDDL();
    await this.YearDropdownData();
  }

  async GetMasterDDL() {
    try {
      await this.commonFunctionService.GetCommonMasterData('ResultType_New')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ResultTypeList = data['Data'];
        }, (error: any) => console.error(error)
        );

      await this.commonFunctionService.GetCommonMasterData('Institute')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonFunctionService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (ex) {
      console.log(ex);
    }
  }


  async getAllData() {
    //debugger

    this.isSubmitted = true;
    if (this.downLoadFG.invalid) {
      return;
    }

    if (this.searchRequest.RollNo == undefined || this.searchRequest.RollNo == null || this.searchRequest.RollNo == 0) {
      if (this.searchRequest.SemesterID == undefined || this.searchRequest.SemesterID == null || this.searchRequest.SemesterID == 0) {
        this.toastr.error("Semester is required");
        return;
      }
      // else if (this.searchRequest.InstituteID == undefined || this.searchRequest.InstituteID == null || this.searchRequest.InstituteID == 0) {
      //   this.toastr.error("Institute is required");
      //   return;
      // } else if(this.searchRequest.ResultTypeID == undefined || this.searchRequest.ResultTypeID == null || this.searchRequest.ResultTypeID == 0){
      //   this.toastr.error("Result Type is required");
      //   return;
      // } else if(this.searchRequest.EndTermID == undefined || this.searchRequest.EndTermID == null || this.searchRequest.EndTermID == 0){
      //   this.toastr.error("Academic Year is required");
      //   return;
      // }
    }
    try {
      // this.searchRequest.EndTermID = this.searchRequest.EndTermID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID

      //this.searchRequest.FianancialYearID = this.searchRequest.FianancialYearID;
      this.searchRequest.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this.marksheetDownloadService.GetAllData(this.searchRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
            await this.createDynamicButtons(this.StudentList);
            //table feature load
            this.loadInTable();
            //end table feature load
          }

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async DownloadMarksheet(row: any) {

    //debugger
    try {
      this.downloadReq.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.downloadReq.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
      //this.downloadReq.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.downloadReq.EndTermID = this.searchRequest.EndTermID;

      this.downloadReq.StudentID = row.StudentID;
      this.downloadReq.SemesterID = row.SemesterID;
      this.downloadReq.ResultTypeID = row.ResultTypeID;
      this.downloadReq.IsRevised = row.IsRevised;
      this.downloadReq.IsReval = row.IsReval;
      console.log(JSON.stringify(this.downloadReq), 'SearchRequestData')
      const requestArray = [this.downloadReq];
      this.loaderService.requestStarted();

      await this.reportService.DownloadMarksheet(this.downloadReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, row.RollNo);
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
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

  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf', DownloadfileName);
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string, name: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `Marksheet_${name}_${timestamp}.${extension}`;
  }

  async DownloadMarksheetBulk() {
    //debugger
    try {

      this.StudentList.forEach((element: any) => {
        element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        element.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
        //element.EndTermID = this.sSOLoginDataModel.EndTermID;
        element.EndTermID = this.searchRequest.EndTermID;
      });

      this.loaderService.requestStarted();

      await this.reportService.DownloadMarksheetBulk(this.StudentList)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
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


  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.StudentList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.StudentList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.StudentList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.StudentList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.StudentList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.StudentList.filter((x: any) => x.StudentID == item.StudentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.StudentList.every((r: any) => r.Selected);
  }
  // end table feature


  async YearDropdownData() {
    try {
      this.loaderService.requestStarted();

      await this.menuService.GetAcedmicYearList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.SelectedValue)
        .then((AcedmicYear: any) => {
          AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
          this.FinYearList = AcedmicYear['Data'];
          //debugger
          //this.loaderService.requestEnded();
        }, error => console.error(error));
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

  trackByFinancialYear(index: number, item: any): number {
    return item.FinancialYearID;
  }

  async createDynamicButtons(studentList: any[]) {
    debugger
    if (!studentList || studentList.length === 0) return;
    const totalStudents = studentList.length;
    const chunkSize = studentList[0].ChunkSize || 50; // Fallback to 50

    const numberOfButtons = Math.ceil(totalStudents / chunkSize);

    this.buttonGroups = [];

    for (let i = 0; i < numberOfButtons; i++) {
      const startIndex = i * chunkSize;
      const endIndex = Math.min((i + 1) * chunkSize - 1, totalStudents - 1);

      const firstRoll = studentList[startIndex].RollNo;
      const lastRoll = studentList[endIndex].RollNo;

      this.buttonGroups.push({
        label: `${firstRoll} - ${lastRoll}`,
        startIndex: startIndex,
        endIndex: endIndex
      });
    }
  }

  async DownloadBulkMarksheet(start: number, end: number) {
    const StudentList: any[] = this.StudentList.slice(start, end + 1);
    try {
      const fullSession = this.FinYearList.find((x: any) => x.EndTermID == this.searchRequest.EndTermID)?.FinancialYearName;
      const Session = fullSession ? fullSession.split('-')[0] : '';

      StudentList.forEach((element: any) => {
        element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        element.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
        //element.EndTermID = this.sSOLoginDataModel.EndTermID;
        element.EndTermID = this.searchRequest.EndTermID;
        element.SessionName = Session;
      });

      this.loaderService.requestStarted();

      await this.reportService.StudentMarksheetDownloadChunk(StudentList)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
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

  downloadFile_existing(row: any) {
    const url = `${this.appsettingConfig.StaticFileRootPathURL}/Students/BTER/Marksheet/${row.MarksheetFilePath}`;

    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = row.MarksheetFile || 'Marksheet.pdf'; // Use stored filename
        link.click();
        // Clean up
        window.URL.revokeObjectURL(link.href);
      })
      .catch(() => console.error('Download failed. Check CORS settings on the server.'));
  }
}
