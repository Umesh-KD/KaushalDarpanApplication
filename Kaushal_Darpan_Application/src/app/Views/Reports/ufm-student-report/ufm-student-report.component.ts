import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { GetUFMStudentReport } from '../../../Models/GenerateAdmitCardDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { OnlineMarkingReportModel, OnlineMarkingSearchModel } from '../../../Models/OnlineMarkingReportDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { UFMExtraInfoSaveModel, UFMStudentExtraInfoSaveModel } from '../../../Models/TheoryMarksDataModels';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TheoryMarksService } from '../../../Services/TheoryMarks/theory-marks.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { CommonFunctionHelper } from '../../../Common/commonFunctionHelper';

@Component({
  selector: 'app-ufm-student-report',
  standalone: false,
  templateUrl: './ufm-student-report.component.html',
  styleUrl: './ufm-student-report.component.css'
})
export class UFMStudentReportComponent {

  public UFMStudentReportList: any[] = [];
  public searchRequest = new GetUFMStudentReport();
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

  public ufmLetterForm!: FormGroup;
  modalReference: NgbModalRef | undefined;
  public saveufmExtraInfo = new UFMExtraInfoSaveModel();
  public UFMExtraInfoFilled: number = 1;

  constructor(private loaderService: LoaderService,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private TheoryMarksService: TheoryMarksService,
    public appsettingConfig: AppsettingService,
    public commonFunctionHelper: CommonFunctionHelper,
  ) { }

  async ngOnInit() {
    // ufm letter form
    this.ufmLetterForm = this.formBuilder.group({
      txtSerialNo: ['', [Validators.required]],
      txtSerialNo2: ['', [Validators.required]],
      txtIssueDate: ['', [Validators.required]],
      txtBundleSendDate: ['', [Validators.required]],
      txtDate2: ['', [Validators.required]]
    });
    // session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.GetAllData();
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.UFMStudentReportList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const fileName = `UFMStudentReport_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  async GetAllData() {
    try {
      //debugger
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      this.loaderService.requestStarted();
      await this.reportService.GetUFMStudentReport(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.UFMStudentReportList = data.Data;

        this.totalInTableRecord = this.UFMStudentReportList.length;
        // set ufm extra information filled or not for showing button
        if (this.UFMStudentReportList?.length > 0) {
          this.UFMExtraInfoFilled = Number(this.UFMStudentReportList[0]["UFMExtraInfoID"] || 0);
        }
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
    this.paginatedInTableData = [...this.UFMStudentReportList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.UFMStudentReportList.length;
  }

  async GetUFMLetter(row: any) {
    try {
      debugger
      const request: any = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        isUFM: 1,
        EnrollmentNo: row?.SPNNo,   // assuming row contains it
        UFMExtraInfoID: row?.UFMExtraInfoID,  // assuming row contains it
        StudentID: row?.StudentID,  // assuming row contains it
        StudentExamID: row?.StudentExamID
      };

      let data: any = await this.reportService.GetUFMLetter(request);

      if (data && data.Data) {
        this.DownloadFile1(data.Data, 'UFMLetter');
      } else {
        this.toastr.error(data?.Message || 'No file received');
      }

      console.log(data); // handle response here
    } catch (error) {
      console.error(error);
    }
  }

  DownloadFile1(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName1('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName1(extension: string): string {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const timestamp = `${day}-${month}-${year}_${hours}-${minutes}`;

    return `Ufm_Letter${timestamp}.${extension}`;
  }

  // for ufm letter extra information to be print in ufm letter    
  async OpenGetUFMExtraInfo(ngTempleteModel: any) {
    try {
      // model
      this.modalReference = this.modalService.open(ngTempleteModel, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.log(error);
    }
  }

  async SaveUFMExtraInfo() {
    try {
      //debugger
      this.isSubmitted = true;

      if (this.ufmLetterForm.invalid) {
        return;
      }

      // model
      this.saveufmExtraInfo.RoleID = this.sSOLoginDataModel.RoleID;
      this.saveufmExtraInfo.ModifyBy = this.sSOLoginDataModel.UserID;
      this.saveufmExtraInfo.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.saveufmExtraInfo.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;


      // save
      await this.TheoryMarksService.SaveUFMExtraInfo(this.saveufmExtraInfo)
        .then(async (res: any) => {
          if (res.State == EnumStatus.Success) {
            this.CloseUFMStudentExtraInfoModal();
            await this.GetAllData(); // grid list refresh after save
            this.toastr.success(res.Message);
          }
          else if (res.State == EnumStatus.Warning) {
            this.toastr.warning(res.Message);
          }
          else {
            this.toastr.error(res.Message);
            console.log(res.ErrorMessage);
          }
        }, (error: any) => console.log(error));

    } catch (error) {
      console.error(error);
    }
  }

  CloseUFMStudentExtraInfoModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.saveufmExtraInfo = new UFMExtraInfoSaveModel();
    this.isSubmitted = false;
    this.UFMExtraInfoFilled = 1;
  }

}
