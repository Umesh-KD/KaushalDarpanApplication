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
import { ITIExamination_UpdateEnrollmentNoModel } from '../../../Models/ITIExaminationDataModel';
import { StudentExaminationITIService } from '../../../Services/ITI/Examination/student-examination-iti.service';


@Component({
  selector: 'app-institutejanaadhar-report',
  standalone: false,
  templateUrl: './institutejanaadhar-report.component.html',
  styleUrl: './institutejanaadhar-report.component.css'
})
export class InstitutejanaadharReportComponent {
  public Table_SearchText: string = "";
  InstituteData: any = [];
  pageInTableSize: string = '50';
  startInTableIndex: number = 0;
  displayedColumns: string[] = [];
  public SSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];//table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public DropOutStudentList: any[] = [];
  modalReference: NgbModalRef | undefined;
  requestUpdateEnrollmentNo = new ITIExamination_UpdateEnrollmentNoModel();
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
    private studentExaminationITIService: StudentExaminationITIService,

  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetInstituteJanaadharDetail();
  }

  async GetInstituteJanaadharDetail()
  {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetInstitutejanaadharDetailReport()
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            if (data.Data.length > 0) {
              this.displayedColumns = Object.keys(data.Data[0]);
              this.InstituteData = data.Data;
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

  exportToExcel(): void {
    const unwantedColumns = ['RTS'];
    const filteredData = this.InstituteData.map((item: { [x: string]: any; }) => {
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
    XLSX.writeFile(wb, 'InstituteJanaadharReport.xlsx');
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
    this.totalInTableRecord = this.InstituteData.length;
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
    this.paginatedInTableData = [...this.InstituteData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.InstituteData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }


  async ViewDropoutStudentList(content: any, InstituteID: number) {
    await this.GetDropOutStudentListby_instituteID(InstituteID)
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });
  }

  async GetDropOutStudentListby_instituteID(InstituteID: number) {


    try {
      await this.reportService.GetDropOutStudentListby_instituteID(InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0) {
          this.DropOutStudentList = data.Data;
        }
        else {
          this.DropOutStudentList = [];
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async BacktoAdmitted(StudentID:number) {
    try {


      this.loaderService.requestStarted();
      this.requestUpdateEnrollmentNo.CreatedBy = this.SSOLoginDataModel.UserID;



      //save
      await this.studentExaminationITIService.ReturnToAdmitted(StudentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastrService.success(this.Message)
            this.CloseModalPopup()
            this.GetInstituteJanaadharDetail()

          }
          else {
            this.toastrService.error(this.ErrorMessage)
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


 



}
