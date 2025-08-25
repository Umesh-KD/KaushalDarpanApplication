import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppsettingService } from '../../../Common/appsetting.service';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { BranchHODModel } from '../../../Models/StaffMasterDataModel';
import { AttendanceServiceService } from '../../../Services/AttendanceServices/attendance-service.service';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-attendance-time-table',
  standalone: false,
  templateUrl: './attendance-time-table.component.html',
  styleUrls: ['./attendance-time-table.component.css']
})
export class AttendanceTimeTableComponent implements OnInit {
  displayedColumns: string[] = ['SrNo', 'StaffSSOID', 'StaffName','SectionName', 'EndTermName', 'SemesterName', 'CourseTypeName', 'StreamName', 'SubjectName', 'Actions'];
  EditDataFormGroup!: FormGroup;
  TableForm!: FormGroup;
  isSubmitted: boolean = false;
  SubjectMasterDDL: any[] = [];
  SemesterMasterDDL: any[] = [];
  ApprovedTeacherList: any[] = [];
  StreamMasterDDL: any[] = [];
  GetSectionData: any[] = [];
  GetBranchSectionData: any[] = [];
  filterData: any[] = [];
  resBranchHOD: any[] = [];
  public requestBranchHOD = new BranchHODModel()
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  sSOLoginDataModel = new SSOLoginDataModel();
  // Pagination related variables
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  SSOIDExists: boolean = false;
  iSHOD: boolean = false;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private attendanceServiceService: AttendanceServiceService,
    private fb: FormBuilder,
    private http: HttpClient,
    private commonMasterService: CommonFunctionService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private staffMasterService: StaffMasterService,
    private router: Router,
    public appsettingConfig: AppsettingService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.getMasterData();
    this.GetBranchHODApplyList();
  }

  ngOnInit() {
    this.TableForm = this.fb.group({
      SubjectID: [0, Validators.required],
      StreamID: [0, Validators.required],
      SemesterID: [0, Validators.required],
    });
    this.EditDataFormGroup = this.fb.group({
      ID: [''],
      SubjectID: [0, Validators.required],
      //AssignToSSOID: ['', Validators.required],
      StreamName: ['', Validators.required],
      SectionID: [0, Validators.required],
      AssignbyStaffID: [0, Validators.required],
      SemesterID: [0, Validators.required]
    });
    this.GetAttendanceTimeTable();
    this.loadDropdownData();
  }


  get formTable() { return this.TableForm.controls; }
  get formEditData() { return this.EditDataFormGroup.controls; }

  reset() {
    this.TableForm.reset({
      SubjectID: 0,
      StreamID: 0,
      SemesterID: 0,
    });
    this.GetAttendanceTimeTable();
  }
  async getMasterData() {
    try {
      //await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.StreamMasterDDL = data.Data;
      //})
      await this.commonMasterService.StreamMasterwithcount(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })
      let obj = {
        Action: "GET_ALL",
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng
      }

      await this.staffMasterService.GetBranchSectionData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetBranchSectionData = data.Data;
          
        }, (error: any) => console.error(error)
        );
    } catch (error) {
      console.error(error);
    }
    
  }

  async GetBranchHODApplyList() {
    try {
      this.requestBranchHOD.Action = "GETALL";
      this.requestBranchHOD.DepartmentID = this.sSOLoginDataModel.DepartmentID,
      this.requestBranchHOD.EndTermID = this.sSOLoginDataModel.EndTermID,
      this.requestBranchHOD.SSOID = this.sSOLoginDataModel.SSOID
      await this.staffMasterService.AllBranchHOD(this.requestBranchHOD)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.resBranchHOD = data.Data

          this.iSHOD = this.resBranchHOD.some(x => x.SSOID === this.sSOLoginDataModel.SSOID);
          
          this.EditDataFormGroup.patchValue({
            StreamName: this.resBranchHOD[0]?.StreamName
          });

          this.getBranchHodData();          
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async getBranchHodData() {
    let obj = {
      Action: "GET_BY_ID",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      StreamID: this.resBranchHOD[0]?.StreamID,
    }
    await this.staffMasterService.GetBranchSectionData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data
      }, (error: any) => console.error(error)
      );
  }


  loadDropdownData(): void {
    let obj = {
      InstituteID: this.sSOLoginDataModel.InstituteID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      RoleID: this.sSOLoginDataModel.RoleID,
    }
    this.commonMasterService.GetStaff_InstituteWise(obj).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ApprovedTeacherList = data['Data'];
    });
  }


  getSubjectMasterDDL(ID: any, SemesterID: any) {
    this.getBranchHodData();
    if (ID && SemesterID != "" && SemesterID != null) {
      this.commonMasterService.SubjectMaster_StreamIDWise(ID, this.sSOLoginDataModel.DepartmentID, SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      })
    } else {
      console.error('Event or value is undefined');
    }

  }

  async GetAttendanceTimeTable() {
    try {
      this.isSubmitted = true;

      let obj = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID ?? 0,
        EndTermID: this.sSOLoginDataModel.EndTermID ?? 0,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        StreamID: this.TableForm.value.StreamID ?? 0,
        SubjectID: this.TableForm.value.SubjectID ?? 0,
        SemesterID: this.TableForm.value.SemesterID ?? 0,
        SSOID: this.sSOLoginDataModel.SSOID,
        RoleID: this.sSOLoginDataModel.RoleID
      };
      await this.attendanceServiceService.GetAttendanceTimeTable(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.filterData = data;  // Populate filtered data with the fetched data
          this.dataSource.data = this.filterData;
          this.dataSource.sort = this.sort;  // Set sort behavior
          this.totalRecords = this.filterData.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updateTable();  // Update table based on pagination
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  async CheckUserExists(SSOID: any) {
    if (SSOID) {

      await this.commonMasterService.CheckSSOIDExists(SSOID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data.body));

          if (data['State'] === 1) {
            this.toastr.success(data.Message);
            this.SSOIDExists = true;
          } else {
            this.toastr.warning(data.Message);
            this.SSOIDExists = false;
          }
        }, error => console.error(error));
    }
  }
  getData() {
    this.isSubmitted = true;
    if (this.TableForm.value.StreamID > 0 && this.TableForm.value.SemesterID > 0 && this.TableForm.value.SubjectID > 0) {
      this.GetAttendanceTimeTable();
    } else {
      this.toastr.warning("please select Stream, Subject, Semester")
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();  // Update table when pagination changes
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterData = this.filterData.filter(item =>
      Object.values(item).some(value =>
        value != null && value.toString().toLowerCase().includes(filterValue.trim().toLowerCase())
      )
    );
    this.totalRecords = this.filterData.length; // Update the total record count after filtering
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1; // Reset to the first page after filtering
    this.updateTable();  // Update table with filtered data
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filterData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Reports.xlsx');
  }

  public downloadPDF() {
    const margin = 10;
    const pageWidth = 210 - 2 * margin;
    const pageHeight = 200 - 2 * margin;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [210, 300],
    });

    const pdfTable = this.pdfTable.nativeElement;

    doc.html(pdfTable, {
      callback: function (doc) {
        doc.save('Report.pdf');
      },
      x: margin,
      y: margin,
      width: pageWidth,
      windowWidth: pdfTable.scrollWidth,
    });
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }



  onDelete(staff: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,  // This shows the "No" button
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true  // This makes the "No" button appear on the left
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicks "Yes"
        try {

          let obj = {
            ID: staff.ID,
            SubjectID: staff.SubjectID,
            AssignToSSOID: staff.StaffSSOID,
            StreamID: staff.StreamID,
            SemesterID: staff.SemesterID,
            DepartmentID: this.sSOLoginDataModel.DepartmentID ?? 0,
            EndTermID: this.sSOLoginDataModel.EndTermID,
            CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
            AssignByRoleID: this.sSOLoginDataModel.RoleID,
            AssignBySSOID: this.sSOLoginDataModel.SSOID,
            DeleteStatus: 1,
            ActiveStatus: 1
          };
          this.attendanceServiceService.PostAttendanceTimeTable(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              this.toastr.success('Update Successfully');
              this.CloseModal();
              this.getData();
              this.GetAttendanceTimeTable();
            }, error => console.error(error));

        } catch (Ex) {
          console.log(Ex);
        }
      }
    });
  }

  async EditData(content: any, rowData?: any) {
    this.isSubmitted = true;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {
        await this.getSubjectMasterDDL(rowData.StreamID, rowData.SemesterID);
      }
      this.SSOIDExists = true;
      this.EditDataFormGroup.patchValue({
        ID: rowData.ID,
        SubjectID: rowData.SubjectID,
        AssignToSSOID: rowData.StaffSSOID,
        StreamID: rowData.StreamID,
        SectionID: rowData.SectionID,
        SemesterID: rowData.SemesterID,
        AssignbyStaffID: rowData.AssignbyStaffID
      })
    } else {
      this.isSubmitted = false;
      this.EditDataFormGroup.patchValue({
        ID: 0,
        SubjectID: 0,
        AssignToSSOID: '',
        StreamID: 0,
        SemesterID: 0
      })
      //this.EditDataFormGroup.reset();
      //this.clearValidationErrors();
    }
  }
  AttendanceData(rowData: any) {
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {
        this.router.navigate([
          'student-attendance',
          rowData.StreamID,
          rowData.SemesterID,
          rowData.SubjectID,
          rowData.SectionID
        ]);
      }
    }
  }
  clearValidationErrors() {
    // Iterate through each form control
    Object.keys(this.EditDataFormGroup.controls).forEach(controlName => {
      const control = this.EditDataFormGroup.get(controlName);
      if (control) {
        control.setErrors(null); // Remove validation errors

        // Check if the control has an associated error message element
        const errorElement = document.getElementById(`${controlName}-error`);
        if (errorElement) {
          errorElement.style.display = 'none'; // Hide the error message element
        }
      }
    });
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

  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }

  SaveData_EditDetails() {
    this.isSubmitted = true;
    debugger;
    //if (this.SSOIDExists == false) {
    //  this.toastr.warning("SSOID Not Exists.!")
    //  return;
    //}
    if (this.resBranchHOD[0]?.StreamID > 0 && this.EditDataFormGroup.value.SemesterID > 0 && this.EditDataFormGroup.value.SubjectID > 0) {
      if (this.EditDataFormGroup.valid) {
        try {
          let obj = {
            ID: this.EditDataFormGroup.value.ID,
            SubjectID: this.EditDataFormGroup.value.SubjectID,
            AssignToSSOID: '',
            StreamID: this.resBranchHOD[0]?.StreamID,
            SectionID: this.EditDataFormGroup.value.SectionID,
            SemesterID: this.EditDataFormGroup.value.SemesterID,
            DepartmentID: this.sSOLoginDataModel.DepartmentID,
            EndTermID: this.sSOLoginDataModel.EndTermID,
            CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
            AssignByRoleID: this.sSOLoginDataModel.RoleID,
            AssignBySSOID: this.sSOLoginDataModel.SSOID,
            AssignbyStaffID: this.EditDataFormGroup.value.AssignbyStaffID,
            DeleteStatus: 0,
            ActiveStatus: 1
          };
          this.attendanceServiceService.PostAttendanceTimeTable(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              this.toastr.success('Update Successfully');
              this.CloseModal();
              this.GetAttendanceTimeTable()
            }, error => console.error(error));

        } catch (Ex) {
          console.log(Ex);
        }
      }
    } else {
      this.toastr.warning("please select Stream, Subject, Semester")
    }

  }
}
