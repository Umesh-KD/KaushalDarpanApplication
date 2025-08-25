import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { BTERJanaadharService } from '../../../Services/BTER/Janaadhar/janaadhar.service';
import { StudentsJanAadharSearchModel } from '../../../Models/StudentsJanAadharSearchModel';
import { StudentsJanaadharService } from '../../../Services/StudentsJanaadhar/students-janaadhar.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ToastrService } from 'ngx-toastr';
import { StudentJanAadharDetailService } from '../../../Services/StudentJanAadharDetail/student-jan-aadhar-detail.service';

@Component({
  selector: 'app-janaadhar-list',
  standalone: false,
  templateUrl: './janaadhar-list.component.html',
  styleUrl: './janaadhar-list.component.css'
})
export class JanaadharListComponent {
  filterData: any[] = [];
  filterInstituteData: any[] = [];
  displayedColumns: string[] = ['SrNo', 'InstituteCode', 'InstituteName', 'TotalStudents', 'FilledJanAadhar', 'DropoutStudents'];
  displayedInstituteColumns: string[] = ['SrNo', 'InstituteCode', 'InstituteNameEnglish', 'StudentName', 'EnrollmentNo','IsDropped', 'JanAadharMemberId'];

  dataSource = new MatTableDataSource<any>();
  dataInstituteSource = new MatTableDataSource<any>();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  EndTermList: any;
  ReportTypelist: any;
  filterForm!: FormGroup;

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;
  startInTableIndex = 1;
  endInTableIndex = 10;

  totalInstituteRecords = 0;
  pageInstituteSize = 10;
  currentInstitutePage = 1;
  totalInstitutePages = 0;
  startInInstituteTableIndex = 1;
  endInInstituteTableIndex = 10;

  closeResult: string | undefined;

  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  Table_SearchText = '';
  StudentsJanaadharList : any;
  public searchRequest = new StudentsJanAadharSearchModel();

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(
    private loaderService: LoaderService,
    private reportService: BTERJanaadharService,
    private commonMasterService: CommonFunctionService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private http: HttpClient,
    private toastr: ToastrService,
    private studentsJanaadharService: StudentsJanaadharService,
    private studentJanAadharDetailService: StudentJanAadharDetailService,
  ) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = this.ssoLoginUser;
    this.initForm();
    this.loadMasterData();
    this.GetAllData();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      Name: [0],
      Code: ['']
    });
  }

  loadMasterData(): void {
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      });
  }

  resetForm(): void {
    this.filterForm.reset({
      Code: '',
      Name: 0
    });
    this.GetAllData();
  }

  filterFormSubmit(): void {
    this.GetAllData();
  }

  async GetAllData(): Promise<void> {
    const requestData = {
      InstituteID: this.filterForm.value.Name,
      InstituteCode: this.filterForm.value.Code,
      EndTermID: this.filterForm.value.EndTerm,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID
    };

    this.filterData = [];
    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetJanaadharListData(requestData);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.filterData = data.Data;
        this.dataSource = new MatTableDataSource(this.filterData);
        this.dataSource.sort = this.sort;
        this.totalRecords = this.filterData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();
      } else {
        this.dataSource = new MatTableDataSource();
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updateTable();
  }

  onInstitutePaginationChange(event: PageEvent): void {
    this.pageInstituteSize = event.pageSize;
    this.currentInstitutePage = event.pageIndex + 1;
    this.updateInstituteTable();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyInstituteFilter(filterValue: string): void {
    this.dataInstituteSource.filter = filterValue.trim().toLowerCase();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    this.dataSource.data = this.filterData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  updateInstituteTable(): void {
    const startIndex = (this.currentInstitutePage - 1) * this.pageInstituteSize;
    const endIndex = Math.min(startIndex + this.pageInstituteSize, this.totalInstituteRecords);
    this.dataInstituteSource.data = this.filterInstituteData.slice(startIndex, endIndex);
    this.updateInstitutePaginationIndexes();
  }

  updateInstitutePaginationIndexes(): void {
    this.startInInstituteTableIndex = (this.currentInstitutePage - 1) * this.pageInstituteSize + 1;
    this.endInInstituteTableIndex = Math.min(this.currentInstitutePage * this.pageInstituteSize, this.totalInstituteRecords);
  }
  
  exportToExcel(): void {
    const unwantedColumns = [
      "InstituteID"
    ];
    const filteredData = this.filterData.map((item: { [x: string]: any; }) => {
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
    XLSX.writeFile(wb, 'DownloadInstituteJanAadhar.xlsx');
  }

  async GetAllStudentsJanaadharData() {
    let obj: StudentsJanAadharSearchModel = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      StudentID: 0,
      EnrollmentNo: '',
      StudentName: '',
      Gender: '',
      MobileNo: '',
      JanAadharNo: '',
      JanAadharStatus: '1'
    }
    try {
      this.loaderService.requestStarted();
      await this.studentsJanaadharService.GetStudentsJanAadharData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StudentsJanaadharList = data['Data'];
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

  async exportJanadharReportToExcel() {
    await this.GetAllStudentsJanaadharData();

    if (this.StudentsJanaadharList.length > 0) {
      const unwantedColumns = [
        "StudentID", "DistrictID", "GramPanchayatID", "BlockID", "JanAadharStatus", "DropoutStatus", "InstituteID"
      ];
      const StudentsJanaadharListData = this.StudentsJanaadharList.map((item: { [x: string]: any; }) => {
        const filteredItem: any = {};
        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(StudentsJanaadharListData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'DownloadJanadharReport.xlsx');
    }    
  }

  DownloadFile(fileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${fileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = this.generateFileName('pdf');
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  async Model_DropoutStudentsData(content: any, row: any) {
    this.Model_DropoutStudents(row.InstituteID);
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async Model_DropoutStudents(instituteId: any) {
    const requestData = {
      InstituteID: instituteId,
      EndTermID: this.ssoLoginUser.EndTermID,
      DepartmentID: this.ssoLoginUser.DepartmentID,
      Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
      RoleID: this.ssoLoginUser.RoleID
    };

    this.filterInstituteData = [];
    try {
      this.loaderService.requestStarted();
      const response = await this.reportService.GetInstituteJanaadharListData(requestData);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.filterInstituteData = data.Data;
        this.dataInstituteSource = new MatTableDataSource(this.filterInstituteData);
        this.dataInstituteSource.sort = this.sort;
        this.totalInstituteRecords = this.filterInstituteData.length;
        this.totalInstitutePages = Math.ceil(this.totalInstituteRecords / this.pageInstituteSize);
        this.updateInstituteTable();        
      } else {
        this.dataInstituteSource = new MatTableDataSource();
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  
  async IsDroppedChange(studentId: any, instituteId: any) {
    this.Swal2.Confirmation("Are you sure you want to Change this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          const requestData = {
            StudentID: studentId,
            EndTermID: this.ssoLoginUser.EndTermID,
            DepartmentID: this.ssoLoginUser.DepartmentID,
            Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
            RoleID: this.ssoLoginUser.RoleID
          };

          this.filterInstituteData = [];
          try {
            this.loaderService.requestStarted();
            const response = await this.reportService.IsDroppedChange(requestData);
            const data = JSON.parse(JSON.stringify(response));
            if (data.State === EnumStatus.Success) {
              this.toastr.success("Data Update successfully.")
              this.Model_DropoutStudents(instituteId);
              this.GetAllData();
            } else {
              this.dataInstituteSource = new MatTableDataSource();
            }
          } catch (ex) {
            console.error(ex);
          } finally {
            this.loaderService.requestEnded();
          }
        }
      });
    
  }

  async StudentAdmittedChange(studentId: any, instituteId: any) {
    this.Swal2.Confirmation("Are you sure you want to Change this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          const requestData = {
            StudentID: studentId,
            EndTermID: this.ssoLoginUser.EndTermID,
            DepartmentID: this.ssoLoginUser.DepartmentID,
            Eng_NonEng: this.ssoLoginUser.Eng_NonEng,
            RoleID: this.ssoLoginUser.RoleID
          };

          this.filterInstituteData = [];
          try {
            this.loaderService.requestStarted();
            //const response = await this.reportService.PostStudentAdmittedForm(requestData);
            //const data = JSON.parse(JSON.stringify(response));
            //if (data.State === EnumStatus.Success) {
            //  this.toastr.success("Data Update successfully.")
            //  this.Model_DropoutStudents(instituteId);
            //  this.GetAllData();
            //} else {
            //  this.dataInstituteSource = new MatTableDataSource();
            //}
          } catch (ex) {
            console.error(ex);
          } finally {
            this.loaderService.requestEnded();
          }
        }
      });
    
  }

  CloseModal() {
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
