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
import { AttendanceServiceService } from '../../../Services/AttendanceServices/attendance-service.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StaffMasterDDLDataModel } from '../../../Models/CenterObserverDataModel';

@Component({
  selector: 'app-iti-attendance-time-table',
  standalone: false,
  templateUrl: './iti-attendance-time-table.component.html',
  styleUrls: ['./iti-attendance-time-table.component.css']
})
export class ITIAttendanceTimeTableComponent implements OnInit {
  displayedColumns: string[] = ['SrNo', 'StaffSSOID', 'StaffName', 'EndTermName', 'SemesterName', 'CourseTypeName', 'StreamName', 'SubjectName', 'Actions'];
  EditDataFormGroup!: FormGroup;
  TableForm!: FormGroup;
  isSubmitted: boolean = false;
  SubjectMasterDDL: any[] = [];
  SemesterMasterDDL: any[] = [];
  StreamMasterDDL: any[] = [];
  filteredCenterList: any[] = [];
  shiftddl: any[] = [];
  filterData: any[] = [];
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  sSOLoginDataModel = new SSOLoginDataModel();
  // Pagination related variables
  totalRecords: number = 0;
  pageSize: number = 500;
  currentPage: number = 1;
  SSOIDExists: boolean = false;
  isAllSelected: boolean = false;
  centerSearchText = '';
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;

  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public requestStaff = new StaffMasterDDLDataModel();
  StaffList: any[] = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedCenters: any[] = [];   // ngModel binding
  constructor(
    private attendanceServiceService: AttendanceServiceService,
    private fb: FormBuilder,
    private http: HttpClient,
    private commonMasterService: CommonFunctionService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    public appsettingConfig: AppsettingService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.getMasterData();
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
      AssignToSSOID: ['', Validators.required],
      StreamID: [0, Validators.required],
      SemesterID: [0, Validators.required],
      ShiftId: [0, Validators.required],
      SubjectIDs: [[]] // multiple select → always array

    });
    this.GetAttendanceTimeTable();
    this.GetStaff_InstituteWise();
    this.getMasterData();
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
      await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID ).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })

      //await this.commonMasterService.SemesterMaster().then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  //this.SemesterMasterDDL = data.Data;
      //  this.SemesterMasterDDL = data.Data.filter((s: { SemesterID: number; }) => [1, 2].includes(s.SemesterID));
      //})

      await this.commonMasterService.ITI_SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        //this.SemesterMasterDDL = data.Data;
        this.SemesterMasterDDL = data.Data
      })

      //await this.commonMasterService.GetSubjectMaster().then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.SubjectMasterDDL = data.Data;
      //})
    } catch (error) {
      console.error(error);
    } 
  }


  async ItiShiftUnitDDL(ID:number) {
    try {
      debugger
      await this.commonMasterService.ItiShiftUnitDDL(ID, this.sSOLoginDataModel.FinancialYearID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.shiftddl = data.Data;
      }) 

    } catch (error) {
      console.error(error);
    }
  }



  getSubjectMasterDDL(ID: any, SemesterID: any) {

    this.EditDataFormGroup.patchValue({
      SubjectID: 0,
      ShiftId: 0
    })

    this.ItiShiftUnitDDL(ID)
    debugger
    this.SubjectMasterDDL=[]
    if (ID && SemesterID != "" && SemesterID != null) {
      this.commonMasterService.SubjectMaster_StreamIDWise(ID, this.sSOLoginDataModel.DepartmentID, SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
        this.filteredCenterList = [...this.SubjectMasterDDL];
      })
    }  else {
      console.error('Event or value is undefined');
    }
   
  }

  Onyearchange(ID: number = 0,stream:number) {
    debugger
    this.SubjectMasterDDL=[]
    this.commonMasterService.SubjectMaster_StreamIDWise(stream, this.sSOLoginDataModel.DepartmentID, ID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
      this.filteredCenterList = [...this.SubjectMasterDDL];
    })
  }

  async GetAttendanceTimeTable() {
    try {
      this.isSubmitted = true;
     
      let obj = {
          DepartmentID: this.sSOLoginDataModel.DepartmentID ?? 0,
          EndTermID: this.sSOLoginDataModel.EndTermID??0,
          CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
          StreamID: this.TableForm.value.StreamID??0,
          SubjectID: this.TableForm.value.SubjectID??0,
          SemesterID: this.TableForm.value.SemesterID??0,
          SSOID: this.sSOLoginDataModel.SSOID,
          RoleID: this.sSOLoginDataModel.RoleID,
          InstituteID: this.sSOLoginDataModel.InstituteID
        };
        await this.attendanceServiceService.ITIGetAttendanceTimeTable(obj)
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
    if (this.TableForm.getRawValue().StreamID > 0 && this.TableForm.value.SemesterID > 0 && this.TableForm.value.SubjectID > 0) {
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
    //const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filterData);  // old line 07072025  comment
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.filterData.map(item => Object.fromEntries(Object.entries(item).filter(([key]) => key !== 'ID' && key !== 'AssignToRoleID' && key !== 'EndTermID' && key !== 'SemesterID' && key !== 'CourseTypeID' && key !== 'StreamID' && key !== 'SubjectID' && key !== 'AssignByRoleID')))
    );
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
            ActiveStatus: 1,
            ShiftId: staff.ShiftId
            
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
    this.isSubmitted = false;

    this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    // reset first
    this.EditDataFormGroup.reset({
      ID: 0,
      SubjectID: 0,
      SubjectIDs: [],
      AssignToSSOID: '',
      StreamID: 0,
      SemesterID: 0,
      ShiftId: 0
    });

    this.SubjectMasterDDL = [];
    this.filteredCenterList = [];
    this.centerSearchText = '';
    this.isAllSelected = false;

    // if no row data, open blank modal safely
    if (!rowData) {
      return;
    }
    debugger
    try {
      const streamID = Number(rowData?.StreamID ?? 0);
      const semesterID = Number(rowData?.SemesterID ?? 0);
      const shiftId = Number(rowData?.shiftId ?? 0);
      const id = Number(rowData?.ID ?? 0);
      const assignToSSOID = rowData?.StaffSSOID ?? rowData?.AssignToSSOID ?? '';

      // safely parse comma separated subject ids
      let subjectIDs: number[] = [];

      const rawSubjectIDs = rowData?.SubjectID ?? rowData?.SubjectIDs ?? '';

      if (rawSubjectIDs !== null && rawSubjectIDs !== undefined && rawSubjectIDs !== '') {
        subjectIDs = String(rawSubjectIDs)
          .split(',')
          .map((x: string) => Number(x.trim()))
          .filter((x: number) => !isNaN(x) && x > 0);
      }

      // load subject dropdown first
      if (streamID > 0 && semesterID > 0) {
        await this.getSubjectMasterDDL(streamID, semesterID);
      }
      debugger
      // patch form values
      this.EditDataFormGroup.patchValue({
        ID: id,
        SubjectID: 0, // old single field, keep 0 if no longer used
        SubjectIDs: subjectIDs,
        AssignToSSOID: assignToSSOID,
        StreamID: streamID,
        SemesterID: semesterID,
        ShiftId: shiftId
      });

      // optional: mark select all if all loaded subjects selected
      if (
        Array.isArray(this.filteredCenterList) &&
        this.filteredCenterList.length > 0 &&
        subjectIDs.length === this.filteredCenterList.length
      ) {
        this.isAllSelected = true;
      } else {
        this.isAllSelected = false;
      }

      this.EditDataFormGroup.get('StreamID')?.disable();
      this.EditDataFormGroup.get('ShiftId')?.disable();
   

      this.SSOIDExists = true;
    } catch (error) {
      console.error('Error in EditData:', error);
      this.toastr.error('Unable to load edit data');
    }
  }



  AttendanceData(rowData: any) {
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {
        this.router.navigate([
          'iti-attendance',
          rowData.StreamID,
          rowData.SemesterID,
          rowData.SubjectIDs,
          rowData.ShiftNo,
          rowData.UnitID,
          '',
          ''
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
    this.selectedCenters=[]
    this.isSubmitted = false;
  }
  SaveData_EditDetails() {
    this.isSubmitted = true;

    const formValue = this.EditDataFormGroup.getRawValue();

    if (
      formValue.StreamID > 0 &&
      formValue.SemesterID > 0 &&
      formValue.SubjectIDs &&
      formValue.SubjectIDs.length > 0
    ) {
      if (this.EditDataFormGroup.valid) {
        try {
          let obj = {
            ID: formValue.ID,
            AssignToSSOID: formValue.AssignToSSOID,
            StreamID: formValue.StreamID,
            SemesterID: formValue.SemesterID,
            ShiftId: formValue.ShiftId,
            DepartmentID: this.sSOLoginDataModel.DepartmentID,
            EndTermID: this.sSOLoginDataModel.EndTermID,
            CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
            AssignByRoleID: this.sSOLoginDataModel.RoleID,
            AssignBySSOID: this.sSOLoginDataModel.SSOID,
            DeleteStatus: 0,
            ActiveStatus: 1,
            InstituteID: this.sSOLoginDataModel.InstituteID,
            SubjectIDs: formValue.SubjectIDs.join(',')
          };

          this.attendanceServiceService.PostAttendanceTimeTable(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              this.toastr.success('Update Successfully');
              this.CloseModal();
              this.GetAttendanceTimeTable();
            }, error => console.error(error));

        } catch (Ex) {
          console.log(Ex);
        }
      }
    } else {
      this.toastr.warning("please select Stream, Subject, Semester");
    }
  }

  GetStaff_InstituteWise() {

 
    this.requestStaff.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.requestStaff.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.requestStaff.DepartmentID = this.sSOLoginDataModel.Eng_NonEng;
    this.commonMasterService.ITIInstructor_InstituteWise(this.requestStaff).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      debugger;
      if (data.Data.length > 0) {
        this.StaffList = data.Data;
      }
      else
      {
        this.StaffList =[];
      }
      
      //this.ExaminerDDL = [{ StaffID: 1, Name: 'Staff 1', SSOID: 'Staff1' },{ StaffID: 2, Name: 'Staff 2', SSOID: 'Staff2' },{ StaffID: 3, Name: 'Staff 3', SSOID: 'Staff3' }];
    })
  }

  async GetstaffDetails(SSOID: any) {

    // Enable first
    debugger
    this.EditDataFormGroup.get('StreamID')?.enable();
    this.EditDataFormGroup.get('ShiftId')?.enable();

    const item = this.StaffList.find(
      (e: any) => e.SSOID == SSOID
    );

    if (!item) return;



    this.EditDataFormGroup.patchValue({
    
      StreamID: item.TradeID, 
      ShiftId: item.SeatIntakeID
    });

    await this.getSubjectMasterDDL(item.TradeID, this.EditDataFormGroup.value.SemesterID);
    // Disable again

    this.EditDataFormGroup.patchValue({

      StreamID: item.TradeID,
      ShiftId: item.SeatIntakeID
    });
   
    this.EditDataFormGroup.get('StreamID')?.disable();

    if (item.SeatIntakeID > 0) {
      this.EditDataFormGroup.get('ShiftId')?.disable();
    }

   
    console.log(this.EditDataFormGroup.value)
  }

  onSelectionChange(event: any): void {
    const value = event.value || [];
    const control = this.EditDataFormGroup.get('SubjectIDs');

    if (!control) return;

    if (value.includes('ALL')) {
      if (this.isAllSelected) {
        this.isAllSelected = false;
        control.setValue([]);
      } else {
        this.isAllSelected = true;
        control.setValue(this.filteredCenterList.map((x: any) => x.ID));
      }
    } else {
      this.isAllSelected = false;
      control.setValue(value);
    }
  }
  filterCenters() {
    const search = this.centerSearchText.toLowerCase();
    this.filteredCenterList = this.SubjectMasterDDL.filter((x: any) =>
      x.Name.toLowerCase().includes(search)
    );
  }
}
