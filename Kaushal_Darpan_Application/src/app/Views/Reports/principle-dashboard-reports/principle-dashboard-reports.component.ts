import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StudentEnrCancelReqModel } from '../../../Models/StaffMasterDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';


@Component({
  selector: 'app-principle-dashboard-reports',
  standalone: false,
  templateUrl: './principle-dashboard-reports.component.html',
  styleUrls: ['./principle-dashboard-reports.component.css'],
})
export class PrincipleDashboardReportsComponent {
  StudentEnrFrom!: FormGroup;
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewAdminPrincipleDashboardList: StudentExamDetails[] = [];
  viewAdminStudentPersentDashboardList: any[] = [];
  viewAdminStudentPersentDashboardList1: any[] = [];
  filterDataList: any[] = [];
  displayedColumns: string[] = ['SrNo', 'Name', 'DesignationName', 'Subject', 'Email', 'Address', 'ActiveStatus'];
  displayedColumnsStudent: string[] = [
    'SrNo', 'StudentName', 'AcademicYear', 'GenderName',
    'MobileNo', 'CasteCategoryName', 'EnrollmentNo', 'InstituteName',
    'FatherName', 'Dis_DOB', 'StudentExamStatus'
  ];
  displayedColumnsEnrStudent: string[] = [
    'SrNo', 'StudentName', 'AcademicYear', 'GenderName',
    'MobileNo', 'CasteCategoryName', 'EnrollmentNo', 'InstituteName',
    'FatherName', 'Dis_DOB', 'Action'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel: any;
  url: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  public request = new StudentEnrCancelReqModel();
  modalReference: NgbModalRef | undefined;
  isSubmitted: boolean = false;
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public OTP: string = '';
  public GeneratedOTP: string = '';
  studentDetailsModel = new StudentDetailsModel();

  constructor(
    private staffMasterService: StaffMasterService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private reportService: ReportService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private sMSMailService: SMSMailService
  ) { }

  async ngOnInit(): Promise<void> {
    this.StudentEnrFrom = this.formBuilder.group({
      OTP: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
    })


    this.url = this.activatedRoute.snapshot.paramMap.get('url');
    this.activatedRoute.paramMap.subscribe(params => {
      this.url = params.get('url');
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadCenterData();

    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      }, (error: any) => console.error(error));

    await this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));
  }

  get _StudentEnrFrom() { return this.StudentEnrFrom.controls; }

  loadCenterData(): void {
    this.GetAllData();
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'ActiveStatus', 'AdharCardNumber', 'AdharCardPhoto', 'AnnualSalary', 'Certificate', 'CourseID', 'CreatedBy', 'DateOfAppointment',
      'DeleteStatus', 'DesignationID', 'Dis_AdharCardNumber', 'Dis_Certificate', 'Dis_PanCardNumber', 'Dis_ProfileName', 'DistrictID',
      'ExaminerStatus', 'Experience', 'HigherQualificationID', 'IPAddress', 'InstituteID', 'IsDownloadCertificate', 'ModifyBy', 'ModifyDate',
      'PFDeduction', 'PanCardPhoto', 'ProfilePhoto', 'RTS', 'ResearchGuide', 'RoleID', 'SpecializationSubjectID', 'StaffID', 'StaffStatus', 'StaffTypeID', 'StateID','SubjectID'
    ];
    const filteredData = this.filterDataList.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...filteredData.map(item => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Extra padding
    }));

    ws['!cols'] = columnWidths; 
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  exportToExcelStudent(): void {
    const unwantedColumns = [
      'ActiveStatus', 'AdharCardNumber', 'AdharCardPhoto', 'AnnualSalary', 'Certificate', 'CourseID', 'CreatedBy', 'DateOfAppointment',
      'DeleteStatus', 'DesignationID', 'Dis_AdharCardNumber', 'Dis_Certificate', 'Dis_PanCardNumber', 'Dis_ProfileName', 'DistrictID',
      'ExaminerStatus', 'Experience', 'HigherQualificationID', 'IPAddress', 'InstituteID', 'IsDownloadCertificate', 'ModifyBy', 'ModifyDate',
      'PFDeduction', 'PanCardPhoto', 'ProfilePhoto', 'RTS', 'ResearchGuide', 'RoleID', 'SpecializationSubjectID', 'StaffID', 'StaffStatus', 'StaffTypeID', 'StateID', 'SubjectID'
    ];
    const filteredData = this.filterDataList.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filterDataList);
    const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...filteredData.map(item => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Extra padding
    }));

    ws['!cols'] = columnWidths; 
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StudentReport.xlsx');
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');

      let requestData: any = {
        DepartmentID: ssoLoginUser.DepartmentID,
        Eng_NonEng: ssoLoginUser.Eng_NonEng,
        RoleID: ssoLoginUser.RoleID,
        InstituteID: ssoLoginUser.InstituteID,
        Menu: this.url,
        EndTermID: ssoLoginUser.EndTermID

      };

      if (this.url === "totalstaff" || this.url === "pendingstaffprofile" || this.url === "staffpersent" || this.url === 'totalexaminer') {
        await this.reportService.GetPrincipleDashboardReport(requestData)
          .then((data: any) => {
            this.viewAdminPrincipleDashboardList = data['Data'];
            this.filterDataList = [...this.viewAdminPrincipleDashboardList];
            this.dataSource = new MatTableDataSource(this.filterDataList);
            this.dataSource.sort = this.sort;
            this.totalRecords = this.filterDataList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          }, (error: any) => console.error(error));
      } else if (this.url === "studentpersent" ) {
        await this.staffMasterService.GetAllStudentPersentData(requestData)
          .then((data: any) => {
            this.viewAdminStudentPersentDashboardList = data['Data'];
            this.filterDataList = [...this.viewAdminStudentPersentDashboardList];
            this.dataSource = new MatTableDataSource(this.filterDataList);
            this.dataSource.sort = this.sort;
            this.totalRecords = this.filterDataList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          }, (error: any) => console.error(error));
      }
      else if (this.url === "enrollmentcancelrequest") {
        await this.staffMasterService.GetStudentEnrCancelRequestData(requestData)
          .then((data: any) => {
            this.viewAdminStudentPersentDashboardList1 = data['Data'];

            console.log(this.viewAdminStudentPersentDashboardList1);
            this.filterDataList = [...this.viewAdminStudentPersentDashboardList1];
            this.dataSource = new MatTableDataSource(this.filterDataList);
            this.dataSource.sort = this.sort;
            this.totalRecords = this.filterDataList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          }, (error: any) => console.error(error));
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  applyFilter(filterValue: string): void {
    // Resetting pagination when a new filter is applied
    this.currentPage = 1;
    if (filterValue === "all") {
      this.filterDataList = [...this.viewAdminPrincipleDashboardList];
    } else {
      this.filterDataList = this.viewAdminPrincipleDashboardList.filter(item =>
        Object.values(item).some(value =>
          value != null && value.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }
    this.dataSource.data = this.filterDataList;
    this.totalRecords = this.filterDataList.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.updateTable();
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    this.dataSource.data = this.filterDataList.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }


  async btnApprove_OnClick(StudentId: number, EndTermId: number, InstituteID: number, CourseType: number, content: any) {

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });
    this.SendOTP(false);

    this.request.ActionBy = this.sSOLoginDataModel.UserID;
    this.request.StudentId = StudentId;
    this.request.RoleID = this.sSOLoginDataModel.RoleID;
    this.request.NextRoleId = 0;
    this.request.DepartmentID = 1;
    this.request.EndTermID = EndTermId;
    this.request.InstituteId = InstituteID;
    this.request.IsApproveOrReject = 1;  //1 approve or 2 reject
    this.request.Remarks = '';
    this.request.CourstType = CourseType;
    this.request.ActionType = "Approve"
  }

  async btnReject_OnClick(StudentId: number, EndTermId: number, InstituteID: number, CourseType: number, content: any) {

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });
    this.SendOTP(false);

    this.request.StudentId = StudentId;
    this.request.ActionBy = this.sSOLoginDataModel.UserID;
    this.request.RoleID = this.sSOLoginDataModel.RoleID;
    this.request.NextRoleId = 0;
    this.request.DepartmentID = 1;
    this.request.EndTermID = EndTermId;
    this.request.InstituteId = InstituteID;
    this.request.IsApproveOrReject = 2;  //1 approve or 2 reject   
    this.request.CourstType = CourseType;
    this.request.ActionType = "Reject"; //this.AddStaffBasicDetailFromGroup.controls['Technician'].updateValueAndValidity();
  }


  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
    
      await this.sMSMailService.SendMessage('8955186821', "OTP") //this.sSOLoginDataModel.mobileNo
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            //open modal popup
            this.GeneratedOTP = data['Data'];
            if (isResend) {
              this.toastr.success('OTP resent successfully');
            }
          }
          else {
            this.toastr.warning('Something went wrong');
          }
        }, error => console.error(error));
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

  async VerifyOTP() {
    this.OTP = this.StudentEnrFrom.controls.OTP.value;

    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {

        try {
        
          this.loaderService.requestStarted();
          console.log(this.request);
          await this.staffMasterService.ApporveOrRejectEnrCancelRequest(this.request)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data)

              if (data.State == EnumStatus.Success) {
                this.toastr.success("Approved enrollment cancellation request successfully");   
                this.ClosePopup();
                this.GetAllData();
            
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
      else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;


    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true; // Show the button when time is up
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
  }


  async VerifyOTPInRejection() {
    this.OTP = this.StudentEnrFrom.controls.OTP.value;
    this.request.Remarks = this.StudentEnrFrom.controls.Remarks.value;
    this.isSubmitted = true;    

    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {

        if (this.request.Remarks == "") {
          return;
        }
        else {
          try {

            this.loaderService.requestStarted();
            console.log(this.request);

            await this.staffMasterService.ApporveOrRejectEnrCancelRequest(this.request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)

                if (data.State == EnumStatus.Success) {
                  this.toastr.success("Rejected enrollment cancellation request Successfully");                
                  this.ClosePopup();
                  this.GetAllData();
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
      }
      else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  
}
