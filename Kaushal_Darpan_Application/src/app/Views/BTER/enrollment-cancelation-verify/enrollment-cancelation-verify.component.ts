import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { EnumEnrollNoStatus, EnumRole, GlobalConstants, EnumStatus, EnumMessageType, EnumEnrollCancelStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { GenerateEnrollData, GenerateEnrollSearchModel } from '../../../Models/GenerateEnrollDataModel';
import { GenerateRollSearchModel } from '../../../Models/GenerateRollDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GetEnrollService } from '../../../Services/GenerateEnroll/generateEnroll.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { GetRollService } from '../../../Services/GenerateRoll/generate-roll.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StudentEnrolmentCancelModel } from '../../../Models/StudentDetailsModel';
import { StudentEnrollmentCancelationService } from '../../../Services/EnrollmentCancelation/student-enrollment-cancelation.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ReportService } from '../../../Services/Report/report.service';

@Component({
  selector: 'app-enrollment-cancelation-verify',
  standalone: false,
  templateUrl: './enrollment-cancelation-verify.component.html',
  styleUrl: './enrollment-cancelation-verify.component.css'
})

export class EnrollmentCancelationVerifyComponent {
  public SearchForm!: FormGroup;
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StudentTypeList: any[] = [];
  public ExamList: any[] = [];
  public Table_SearchText: any = '';
  public StudentList: GenerateEnrollData[] = [];
  public InstituteMasterList: any = [];
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new StudentEnrolmentCancelModel();
  public UserID: number = 0;
  public RoleID: number = 0;
  public ddlRollListStatus: number = 0;
  public _RollListStatus = EnumEnrollCancelStatus;
  public SearchReqForEnroll = new GenerateRollSearchModel()
  //table feature default
  public paginatedInTableData: any[] = []; //copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = '50';
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public selectedEndTermID: number = 0;
  public currentStatus: number = 0;
  public PageNameTitile: string = '';
  public currentTab: number = 0;
  public _EnumRole = EnumRole;
  public VerifierStatusDDL: any = [];

  public RoleIdStatusMap: { [key: number]: string } = {
    [EnumEnrollCancelStatus.Verified]: 'Dropout',
    [EnumEnrollCancelStatus.Return]: 'Returned',
    [EnumEnrollCancelStatus.VerifiedEnrollCancelByAdmin]: 'Admin Approved',
    [EnumEnrollCancelStatus.VerifiedEnrollCancelByPrincipal]: 'Principal Approved',
    [EnumEnrollCancelStatus.VerifiedEnrollCancelByRegistrar]: 'Registrar Approved',
    [EnumEnrollCancelStatus.VerifiedEnrollCancelByExamIncharge]: 'Exam Incharge Approved',
    [EnumEnrollCancelStatus.VerifiedEnrollCancelByITSupport]: 'Dropout',
    [EnumEnrollCancelStatus.VerifiedEnrollCancelBySectionIncharge]: 'Section Incharge Requested',
    [EnumEnrollCancelStatus.VerifiedEnrollCancelByStudent]: 'Student Requested',
  };


  //end table feature default
  closeResult: string | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public ActionDynamic: string = 'Cancel-Enrollment-migration';

  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  constructor(
    private commonMasterService: CommonFunctionService,
    private GetRollService: GetRollService,
    private GetEnrollRollService: GetEnrollService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private swal2: SweetAlert2,
    private reportService: ReportService,
    private toastr: ToastrService,
    private sMSMailService: SMSMailService,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService, 
    private EnrollmentCancelation: StudentEnrollmentCancelationService,
    private routers: Router
  ) { }

  async ngOnInit() {
    this.SearchForm = this.formBuilder.group({
      ddlInstitute: [''],
      ddlSemester: [''],
      ddlStream: [''],
      /*ddlStudentTypeID: [''],*/
    });
    debugger;
    this.sSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );
    this.RoleID = this.sSOLoginDataModel.RoleID;
    this.selectedEndTermID = Number(this.route.snapshot.queryParamMap.get("EndTermID") ?? 0);
    //this.currentStatus = Number(this.route.snapshot.paramMap.get("id") ?? 0);
    //this.currentStatus = Number(this.route.snapshot.queryParamMap.get("Status") ?? 0);
    this.currentTab = Number(this.route.snapshot.queryParamMap.get("tab") ?? 0);

    if (this.RoleID == 7 || this.RoleID == 2) {
      this.currentStatus = Number(this.route.snapshot.paramMap.get("id") ?? 0);
    } else {
      this.currentStatus = Number(this.route.snapshot.queryParamMap.get("Status") ?? 0);
    }


    this.GetPageName(this.currentStatus);

    this.UserID = this.sSOLoginDataModel.UserID;
    this.GetAllData();
    this.getInstituteMasterList();
    this.getExamMasterList();
    this.GetVerifierStatusDDL();


  }


  downloadBase64PDF(base64: string, filename: string): void {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  async CertificateDownload(row: any): Promise<void> {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = this.ActionDynamic;
      this.searchRequest.StudentID = row.StudentID;
      this.searchRequest.EnrollmentNo = row.EnrollmentNo;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      const data = await this.reportService.BterCertificateReportDownload(this.searchRequest);
      if (data && data.Data) {
        this.downloadBase64PDF(data.Data, `${this.ActionDynamic}.pdf`);
      } else {
        this.toastr.error('Data not found');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async GetVerifierStatusDDL() {
    try {
      await this.commonMasterService.GetCommonMasterDDLStatusByType('EnrollmentCancelation')
        .then((data: any) => {
          this.VerifierStatusDDL = data['Data'];

          /*this.VerifierStatusDDL = this.VerifierStatusDDL.filter((f: any) => f.ID != EnumEnrollNoStatus.Published);*/
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }


  async GetAllData() {
    try {
      debugger;
      this.StudentList = []
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Status = this.currentStatus;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      //call
      this.loaderService.requestStarted();
      await this.EnrollmentCancelation.GetEnrollCancelationData(this.searchRequest)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
            console.log(this.StudentList, "Studentlist")
            //this.updateButtonStates();
            //this.GetVerifyRollData();
            //table feature load
            this.loadInTable();
            //end table feature load
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

  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService
        .InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data.Data;
        });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
      });

      await this.commonMasterService.StudentType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentTypeList = data['Data'];
          console.log("StudentTypeList", this.StudentTypeList)
        }, (error: any) => console.error(error));

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new StudentEnrolmentCancelModel();

    this.SubjectMasterDDLList = [];
    this.GetAllData()
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(
      this.totalInTableRecord / parseInt(this.pageInTableSize)
    );
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex =
      (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex =
      this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex =
      this.endInTableIndex > this.totalInTableRecord
        ? this.totalInTableRecord
        : this.endInTableIndex;
    this.paginatedInTableData = [...this.StudentList].slice(
      this.startInTableIndex,
      this.endInTableIndex
    );
    console.log(this.paginatedInTableData, "paginatedData")
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
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
    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (
      this.currentInTablePage <= 0 ||
      this.currentInTablePage > this.totalInTablePage
    ) {
      this.currentInTablePage = 1;
    }
    if (
      this.currentInTablePage > 0 &&
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = []; //copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StudentList.length;
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  //get totalInTableSelected(): number {
  //  return this.StudentList.filter((x) => x.Selected)?.length;
  //}

  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  // end table feature

  exportToExcel(): void {
    const columnOrder = [
      'SrNo', 'StudentName', 'MotherName', 'FatherName', 'DOB', 'InstituteName', 'StreamName', 'SemesterName', 'EnrollmentNo', 'RollNumber', 'Action',
    ];

    const unwantedColumns = [
      'StudentID', 'RollNumber', 'dob_org', 'StreamID', 'SemesterID', 'InstituteID', 'InstituteCode', 'streamCode', 'MobileNo', 'EndTermID',
    ];

    // ✅ Define status labels (same as in your template)
    const statusLabels: { [key: number]: string } = {
      205: 'Section Incharge Requested',
      7: 'Principal Approved',
      38: 'Exam Incharge Approved',
      40: 'Registrar Approved',
      2: 'Admin Approved',
      206: 'Verified',
    };

    const filteredData = this.StudentList.map((item: any, index: number) => {
      const filteredItem: any = {};

      columnOrder.forEach((column) => {
        if (column === 'SrNo') {
          filteredItem[column] = index + 1;
        } else if (column === 'Action') {
          // ✅ Set Action column based on Status
          filteredItem[column] = statusLabels[item.Status] || 'Pending';
        } else if (item[column] && !unwantedColumns.includes(column)) {
          filteredItem[column] = item[column];
        }
      });

      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = columnOrder.map((column) => ({
      wch: Math.max(
        column.length,
        ...filteredData.map((item: any) => item[column]?.toString().length || 0)
      ) + 2,
    }));

    ws['!cols'] = columnWidths;

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1';
        if (!ws[cellAddress]) continue;

        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '#f3f3f3' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'EnrollmentCancellationVerifiedData.xlsx');
  }


  VerifyRollNumber() {
    debugger;
    if (this.ddlRollListStatus > 0) {
      if (this.ddlRollListStatus == EnumEnrollCancelStatus.Return) {
        Swal.fire({
          title: 'Return Enrollment No. Cancel',
          input: 'textarea',
          inputLabel: 'Remark',
          inputPlaceholder: 'Enter your remark here...',
          inputAttributes: {
            'aria-label': 'Type your remark here'
          },
          showCancelButton: true,
          confirmButtonText: 'Save Remark',
          cancelButtonText: 'Cancel'
        }).then(async (result: any) => {
          if (result.isConfirmed && result.value?.trim()) {
            const remark = result.value.trim();
            await this.ChangeEnRollNoStatus("_Return", EnumEnrollCancelStatus.Return, remark);
          } else if (result.isConfirmed && !result.value?.trim()) {
            this.toastr.warning('Remark is required.');
          }
        });
      }

      if (this.ddlRollListStatus == EnumEnrollCancelStatus.Verified) {

        this.swal2.Confirmation("Are you sure you want to verified Enrollment Cancellation no?", async (result: any) => {
          // Check if the user confirmed the action
          if (result.isConfirmed) {
            this.openModalGenerateOTP(this.modal_GenrateOTP);
          }
        });

        //this.ChangeRollNoStatus("_UpdateStatusVerify", EnumRollNoStatus.Verified);
      }


    }
    else {

      this.toastr.error('please select status')
    }
  }


  async ChangeEnRollNoStatus(action: string, Status: number, remark: string) {
    debugger;
    try {
      this.StudentList = [];
      //session
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.Status = Status;
      this.searchRequest.Remark = remark;
      this.searchRequest.Action = action;
      this.loaderService.requestStarted();
      //call
      await this.EnrollmentCancelation.ChangeEnRollNoStatus(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.CloseOTPModal();
            this.toastr.success('Status Changed Successfully');


            setTimeout(() => {
              this.routers.navigate(['/dashboard']);
            }, 200);


          }
          else {
            this.toastr.error(data.Message);
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //async SaveApplicationWorkFlow(Action: number) {
  //  try {
  //    this.StudentList = [];
  //    //session
  //    this.SearchReqForEnroll.EndTermID = this.sSOLoginDataModel.EndTermID;
  //    this.SearchReqForEnroll.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.SearchReqForEnroll.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //    /*      this.SearchReqForEnroll.action = "_GenerateRollNumbers"*/
  //    this.SearchReqForEnroll.Status = Action

  //    this.SearchReqForEnroll.ModuleID = 2;

  //    this.loaderService.requestStarted();
  //    //call
  //    await this.GetEnrollRollService.SaveApplicationWorkFlow(this.SearchReqForEnroll).then(
  //      (data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          this.StudentList = data['Data'];
  //          this.CloseOTPModal()          
  //          this.GetAllData()
  //        }
  //      },
  //      (error: any) => console.error(error)
  //    );
  //  } catch (ex) {
  //    console.log(ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  resetOTPControls() {
    this.OTP = "";
    this.GeneratedOTP = "";

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




  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          //Call Function
          /* this.SaveApplicationWorkFlow( EnumEnrollNoStatus.Verified);*/
          this.ChangeEnRollNoStatus("_StatusVerify", this.currentStatus, this.searchRequest.Remark);

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

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      //this.sSOLoginDataModel.Mobileno = "7737348604";
      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, EnumMessageType.Bter_OTP)
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



  //Start Section Model
  async openModalGenerateOTP(content: any) {
    this.resetOTPControls();
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.SendOTP();
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


  CloseOTPModal() {

    this.modalService.dismissAll();
  }

  GetPageName(tabno: number) {
    if (tabno == 205) {
      this.PageNameTitile = 'Pending For Principal EnrollMent Cancellation Request'
    }
    else if (tabno == 7 && this.RoleID == 7) {
      this.PageNameTitile = 'Verified By Principal EnrollMent Cancellation Request'
    }
    else if (tabno == 7 && this.RoleID == 38) {
      this.PageNameTitile = 'Pending For ExamIncharge Enrollment Cancellation Request'
    }
    else if (tabno == 38 && this.RoleID == 38) {
      this.PageNameTitile = 'Verified By ExamIncharge EnrollMent Cancellation Request'
    }
    else if (tabno == 38 && this.RoleID == 40) {
      this.PageNameTitile = 'Pending For Registrar Enrollment Cancellation Request'
    }
    else if (tabno == 40 && this.RoleID == 40) {
      this.PageNameTitile = 'Verified By Registrar EnrollMent Cancellation Request'
    }
    else if (tabno == 40 && this.RoleID == 2) {
      this.PageNameTitile = 'Pending For Admin(BTER) Enrollment Cancellation Request'
    }
    else if (tabno == 2 && this.RoleID == 2) {
      this.PageNameTitile = 'Verified By Admin(BTER) EnrollMent Cancellation Request'
    }

    else if (tabno == 2 && this.RoleID == 206) {
      this.PageNameTitile = 'Pending For IT-Cell Enrollment Cancellation Request'
    }
    else if (tabno == 206 && this.RoleID == 206) {
      this.PageNameTitile = 'Verified By IT-Cell EnrollMent Cancellation Request'
    }

    else if (tabno == 3 && this.RoleID == 205) {
      this.PageNameTitile = 'Pending For Student-Section-Incharge Enrollment Cancellation Request'
    }
    else if (tabno == 205 && this.RoleID == 205) {
      this.PageNameTitile = 'Verified By Student-Section-Incharge EnrollMent Cancellation Request'
    }

    else {
      this.PageNameTitile = 'EnrollMent Number List'
    }
  }
}
