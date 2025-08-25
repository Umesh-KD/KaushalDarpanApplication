import { Component } from '@angular/core';

import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { CollegeMasterDataModels, CollegeMasterSearchModel } from '../../../Models/CollegeMasterDataModels';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../../../Services/Report/report.service';
import { StudentItiSearchmodel, TheoryMarksSearchModel } from '../../../Models/TheoryMarksDataModels';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

 

@Component({
  selector: 'app-studentjanaadhar-report',
  standalone: false,
  templateUrl: './studentjanaadhar-report.component.html',
  styleUrl: './studentjanaadhar-report.component.css'
})
export class StudentjanaadharReportComponent {
  public searchRequest = new StudentItiSearchmodel();
  public Table_SearchText: string = "";
  StudentData: any = [];
  pageInTableSize: string = '50';
  startInTableIndex: number = 0;
  displayedColumns: string[] = [];
  public SSOLoginDataModel = new SSOLoginDataModel();
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public SemesterMasterList: any = [];
  public Branchlist: any = [];
  public InstituteMasterDDLList: any = [];
  constructor(

    private formBuilder: FormBuilder,
 
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private http: HttpClient,
    private reportService: ReportService,
    private toastrService: ToastrService,
    private commonMasterService: CommonFunctionService,


  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMasterData()
    await this.GetItiTrade()
    this.GetStudentJanaadharDetail();
  }


  async GetMasterData() {
    try {
      this.loaderService.requestStarted();



      await this.commonMasterService.Iticollege(this.SSOLoginDataModel.DepartmentID, this.SSOLoginDataModel.Eng_NonEng, this.SSOLoginDataModel.EndTermID).then((data: any) => {
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

  async GetItiTrade() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ItiTrade(this.SSOLoginDataModel.DepartmentID, this.SSOLoginDataModel.Eng_NonEng, this.SSOLoginDataModel.EndTermID, this.searchRequest.CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Branchlist = data['Data'];
        },(error:any) => console.error(error));


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




  exportToExcel(): void {
    const unwantedColumns = ['RTS'];
    const filteredData = this.StudentData.map((item: { [x: string]: any; }) => {
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
    XLSX.writeFile(wb, 'StudentJanaadharReport.xlsx');
  }

  async GetStudentJanaadharDetail()
  {
    //this.searchRequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng
    //this.searchRequest.EndTermID = this.searchRequest.EndTermID
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetStudentjanaadharDetailReport(this.searchRequest)
        .then((data: any) => {
          //data = JSON.parse(JSON.stringify(data));
          //console.log(data);
          if (data.State == EnumStatus.Success) {
            if (data.Data.length > 0) {
              this.displayedColumns = Object.keys(data.Data[0]);
              this.StudentData = data.Data;
              this.loadInTable();
            }
           
          }
          else {
            this.toastrService.error(data.ErrorMessage)
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


  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StudentData.length;
  }
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.StudentData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.StudentData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }

  async ResetControl() {
    this.searchRequest = new StudentItiSearchmodel()
    this.GetMasterData()
    this.GetItiTrade()
    this.GetStudentJanaadharDetail()
  }

}
