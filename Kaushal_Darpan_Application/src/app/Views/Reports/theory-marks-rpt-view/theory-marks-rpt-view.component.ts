import { Component } from '@angular/core';
import { TheoryMarksSearchModel } from '../../../Models/TheoryMarksDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { TheoryMarksService } from '../../../Services/TheoryMarks/theory-marks.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumRole } from '../../../Common/GlobalConstants';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-theory-marks-rpt-view',
  templateUrl: './theory-marks-rpt-view.component.html',
  styleUrl: './theory-marks-rpt-view.component.css',
  standalone: false
})
export class TheoryMarksRptViewComponent {
  public searchRequest = new TheoryMarksSearchModel();
  _EnumRole = EnumRole
  
  sSOLoginDataModel = new SSOLoginDataModel();
  public TheoryMarksRptDataList: any = [];
  public SemesterMasterList: any = [];
  public Branchlist: any = [];
  public InstituteMasterDDLList: any = [];

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
    private TheoryMarksService: TheoryMarksService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    // if(this.sSOLoginDataModel.RoleID == EnumRole.Examiner) {
    //   this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
    // }
    this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
    await this.GetMasterData();
    //await this.GetTheoryMarksDetailList();
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Branchlist = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
      })
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

  async GetTheoryMarksDetailList() {
    try {
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;

      // this.searchRequest.IsConfirmed = this.IsConfirmed = true;

      // //group code id
      // if (this.IsCountShow == false) {
      //   this.searchRequest.ExaminerCode = this.examinerCodeLoginModel.ExaminerCode
      // } else {
      //   this.searchRequest.ExaminerCode = this.ExaminerCode
      // }
      // this.searchRequest.GroupCodeID = this.TheoryMarksDashBoardCount[0].GroupCodeID;
      // //call
      this.loaderService.requestStarted();
      await this.TheoryMarksService.GetTheoryMarksRptData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          this.TheoryMarksRptDataList = data['Data'];
          
          //table feature load
          this.loadInTable();
          //end table feature load
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async PDFDownload() {
    try {
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      // this.searchRequest.IsConfirmed = this.IsConfirmed = true;

      // //group code id
      // if (this.IsCountShow == false) {
      //   this.searchRequest.ExaminerCode = this.examinerCodeLoginModel.ExaminerCode
      // } else {
      //   this.searchRequest.ExaminerCode = this.ExaminerCode
      // }
      // this.searchRequest.GroupCodeID = this.TheoryMarksDashBoardCount[0].GroupCodeID;
      // //call

      
      this.loaderService.requestStarted();
      await this.reportService.TheorymarksReportPdf_BTER(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          //this.TheoryMarksRptDataList = data['Data'];
          this.DownloadFile(data.Data, '')

          

        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  ResetControl() {
    this.searchRequest = new TheoryMarksSearchModel();
    this.GetTheoryMarksDetailList();
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
    this.paginatedInTableData = [...this.TheoryMarksRptDataList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.TheoryMarksRptDataList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.TheoryMarksRptDataList.length;
  }

  //end table feature

  exportToExcel(): void {
    const unwantedColumns = [
     'StudentID','StudentExamID','StudentExamPaperMarksID','StudentExamPaperID','rowclass'
    ];
    const filteredData = this.TheoryMarksRptDataList.map((item: any) => {
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
    XLSX.writeFile(wb, 'Theory-Marks-Report-Data.xlsx');
  }

  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }

}
