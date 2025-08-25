import { Component } from '@angular/core';
import { EnumCourseType, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StudentsJoiningStatusMarksDataMedels, StudentsJoiningStatusMarksSearchModel } from '../../../../Models/StudentsJoiningStatusMarksDataMedels';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { StudentsJoiningStatusMarksService } from '../../../../Services/Students-Joining-Status-Marks/students-joining-status-marks.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import * as XLSX from 'xlsx';
import { BterStudentsJoinStatusMarksMedel, BterStudentsJoinStatusMarksSearchModel } from '../../../../Models/BterStudentJoinStatusDataModel';
import { BterStudentsJoinStatusMarksService } from '../../../../Services/BterStudentJoinStatus/Student-join-status-mark.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { BTERAllotmentService } from '../../../../Services/BTER/Allotment/allotment.service';
@Component({
  selector: 'app-nodal-center-list',
  standalone: false,

  templateUrl: './nodal-center-list.component.html',
  styleUrl: './nodal-center-list.component.css'
})
export class NodalCenterListComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  request = new BterStudentsJoinStatusMarksMedel()
  public searchRequest = new BterStudentsJoinStatusMarksSearchModel();
  public tbl_txtSearch: string = '';
  public AllotmentId: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudentsJoiningStatusMarksList: any[] = [];
  public filteredData: any[] = [];
  public StudentsJoiningStatusMarksDetails: any[] = [];
  public StreamList: any[] = [];
  public AllotmentTypeList: any[] = [];
  public courseTypeList: any[] = [];
  public IsStatusMark: boolean = false;
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  public StreamType: string = ''
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any;
  id: any;
  AllotmentKey: string = "";
  status: number = 0
  public ApplicationID: number = 0
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  public DateConfigSetting: any = [];

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private StudentsJoiningStatusMarksService: BterStudentsJoinStatusMarksService,
    private toastr: ToastrService,
    private appsettingConfig: AppsettingService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private reportService: ReportService,
    private bterAllotmentService: BTERAllotmentService,
    private http: HttpClient,
    private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });

  }


  async ngOnInit() {
    debugger;
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.sSOLoginDataModel.InstituteID = 45;
    this.searchRequest.CourseTypeId = parseInt(this.id);
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.AllotmentStatus = 0;


    this.GetDateConfig();

    this.loadDropdownData('AllotmentType')


    /*    this.searchRequest.CourseTypeId = Number(this.route.snapshot.paramMap.get('id') ?? 0);*/
    this.searchRequest.CourseTypeId = Number(this.route.snapshot.paramMap.get('id') ?? 0);

    this.status = Number(this.route.snapshot.paramMap.get('status'));
    if (this.status != 0) {
      this.searchRequest.AllotmentMasterId = 2
      this.getStudentsJoiningStatusMarksList(1);
    }

    this.courseTypeList = this.commonMasterService.ConvertEnumToList(EnumCourseType);
    if (this.searchRequest.CourseTypeId > 0) {
      this.StreamType = this.courseTypeList.find((e: any) => e.value == this.searchRequest.CourseTypeId)?.key || null;

    }
    this.getStudentsJoiningStatusMarksList(1);


  }
  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();

    if (filterValue === "all" || filterValue === "") {
      this.filteredData = [...this.StudentsJoiningStatusMarksList]; // Reset to full dataset
    } else {
      this.filteredData = this.StudentsJoiningStatusMarksList.filter(item =>
        Object.values(item).some(value =>
          value != null && value.toString().toLowerCase().includes(filterValue)
        )
      );
    }
  }

  AllotmentChange() {
    if (this.searchRequest.AllotmentMasterId == 2) {
      this.AllotmentKey = "FIRST NODAL REPORTING";
    } else if (this.searchRequest.AllotmentMasterId == 4) {
      this.AllotmentKey = "SECOND NODAL REPORTING";
    } else if (this.searchRequest.AllotmentMasterId == 6) {
      this.AllotmentKey = "INTERNAL SLIDING";
    } else {

    }

  }

  async GetDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.searchRequest.CourseTypeId,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      Key: "FIRST NODAL REPORTING,SECOND NODAL REPORTING,INTERNAL SLIDING",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
        if (this.DateConfigSetting[0]['FIRST NODAL REPORTING'] == 1) {
          this.searchRequest.AllotmentMasterId = 2;
          this.AllotmentKey = "FIRST NODAL REPORTING";
        } else if (this.DateConfigSetting[0]['UPWARD NODAL REPORTING'] == 1) {
          this.searchRequest.AllotmentMasterId = 3;
          this.AllotmentKey = "UPWARD NODAL REPORTING";
        } else if (this.DateConfigSetting[0]['SECOND NODAL REPORTING'] == 1) {
          this.searchRequest.AllotmentMasterId = 4;
          this.AllotmentKey = "SECOND NODAL REPORTING";
        }

        //console.log(this.DateConfigSetting[0]['GENERATE MERIT']);

      }, (error: any) => console.error(error)
      );
  }
  get _groupForm() { return this.groupForm.controls; }


  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'AllotmentType':
          this.AllotmentTypeList = data['Data'];
          console.log(this.AllotmentTypeList, "datatatata")
          break;
        default:
          break;
      }
    });
  }




  async getStudentsJoiningStatusMarksList(i: any) {

    if (i == 1) {
      this.pageNo = 1;
    } else if (i == 2) {
      this.pageNo++;
    } else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    } else {
      this.pageNo = i;
    }
    try {
      this.loaderService.requestStarted();
      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;

      await this.StudentsJoiningStatusMarksService.GetStudentAllotmentDetails(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentsJoiningStatusMarksList = data['Data'];
          this.filteredData = [...this.StudentsJoiningStatusMarksList];
          if (this.status !== 0 && this.status !== null) {

            if (this.status === 1) {
              this.filteredData = this.filteredData.filter(x => x.JoiningStatus === "Pending");


            }
            if (this.status === 2) {
              this.filteredData = this.filteredData.filter(x => x.JoiningStatus === "Reported");
            }
            if (this.status === 3) {
              this.filteredData = this.filteredData.filter(x => x.JoiningStatus === "Not Reported");
            }
          }
          this.totalRecord = this.filteredData.length;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
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


  onCancel(): void {
    this.searchRequest.StreamId = 0;
    this.searchRequest.ApplicationID = 0;

    this.searchRequest.CourseTypeId = 0
    this.searchRequest.AllotmentMasterId = 0
    this.getStudentsJoiningStatusMarksList(1);
  }


  async addStatusMark(content: any, ID: number) {
    this.GetByID(ID)
    //alert(ID)
    this.IsStatusMark = true;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
    });

  }


  CloseAddStatusMark() {
    this.modalService.dismissAll();
  }




  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
    const filteredData = this.StudentsJoiningStatusMarksList.map((item: any) => {
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
    XLSX.writeFile(wb, 'StudentsJoiningStatusMarksList.xlsx');
  }


  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AllotmentId = id;

      await this.StudentsJoiningStatusMarksService.GetByID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentsJoiningStatusMarksDetails = data['Data'];
          this.request.AllotmentId = this.StudentsJoiningStatusMarksDetails[0]['AllotmentId'];
          this.request.ReportingStatus = this.StudentsJoiningStatusMarksDetails[0]['ReportingStatus'];
          this.request.ReportingRemark = this.StudentsJoiningStatusMarksDetails[0]['ReportingRemark'];
          console.log(this.StudentsJoiningStatusMarksDetails, "StudentsJoiningStatusMarksDetails")


          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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





  async saveData() {
    ;
    console.log(this.groupForm.value)
    this.isSubmitted = true;
    if (!this.groupForm.value.ddlReportingStatus && !this.groupForm.value.txtReportingRemark) {
      return console.log("error")
      //return console.log(this.groupForm.errors)
    }
    this.request.ReportingStatus = this.groupForm.value.ddlReportingStatus;
    this.request.ReportingRemark = this.groupForm.value.txtReportingRemark;
    //alert(this.request.AllotmentId);
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.StudentsJoiningStatusMarksService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            setTimeout(() => {
              this.toastr.success(this.Message)
              this.searchRequest.AllotmentId = 0;
              this.CloseAddStatusMark();
              this.ResetControl();
              this.getStudentsJoiningStatusMarksList(1);
            }, 200);
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message);
            this.searchRequest.AllotmentId = 0;
            this.CloseAddStatusMark();
            this.ResetControl();
            this.getStudentsJoiningStatusMarksList(1);
          }
          else {
            this.toastr.error(this.ErrorMessage);
            this.CloseAddStatusMark();
            this.searchRequest.AllotmentId = 0;
            this.ResetControl();
            this.getStudentsJoiningStatusMarksList(1);
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }

  }



  async ResetControl() {
    this.isSubmitted = false;
    this.request = new StudentsJoiningStatusMarksDataMedels()
    this.groupForm.reset();
    this.groupForm.patchValue({

      code: '',

    });
  }


  async openModalGenerateOTP(content: any, AllotmentId: number) {
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.request.AllotmentId = AllotmentId
    this.MobileNo
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
  CloseModal() {

    this.modalService.dismissAll();
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

          this.CloseModal();

          if (this.searchRequest.CourseTypeId == 1) {
            this.router.navigate(['/student-nodal-status/1'], {
              queryParams: { AllotmentID: this.request.AllotmentId }
            });
          } else if (this.searchRequest.CourseTypeId == 2) {
            this.router.navigate(['/student-nodal-status/2'], {
              queryParams: { AllotmentID: this.request.AllotmentId }
            });
          } else if (this.searchRequest.CourseTypeId == 3) {
            this.router.navigate(['/student-nodal-status/3'], {
              queryParams: { AllotmentID: this.request.AllotmentId }
            });
          } else if (this.searchRequest.CourseTypeId == 4) {
            this.router.navigate(['/student-nodal-status/4'], {
              queryParams: { AllotmentID: this.request.AllotmentId }
            });
          } else if (this.searchRequest.CourseTypeId == 5) {
            this.router.navigate(['/student-nodal-status/5'], {
              queryParams: { AllotmentID: this.request.AllotmentId }
            });
          }



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
        this.toastr.error('Invalid OTP Please Try Again');
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
      this.MobileNo = this.sSOLoginDataModel.Mobileno;

      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
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

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }




  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.getStudentsJoiningStatusMarksList(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentsJoiningStatusMarksList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.getStudentsJoiningStatusMarksList(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.getStudentsJoiningStatusMarksList(3)
    }
  }


  async DownloadAllotmentLetter(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.bterAllotmentService.DownloadAllotmentLetter(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'AllotmentLetter' + id + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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


 
  async DownloadRepoprtingReceipt(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.bterAllotmentService.GetStudentReportingReceipt(id)
        .then((data: any) => {
       
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'Repoprting-Receipt' + id + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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

  async DownloadAllotmentLetterFeeRpt(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.bterAllotmentService.GetAllotmentFeeReceipt(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));   
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'Allotment-Fee-Receipt' + id + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }
  redirect(AllotmentId: number) {
    if (this.searchRequest.CourseTypeId == 1) {
      this.router.navigate(['/student-nodal-status/1'], {
        queryParams: { AllotmentID: AllotmentId }
      });
    } else if (this.searchRequest.CourseTypeId == 2) {
      this.router.navigate(['/student-nodal-status/2'], {
        queryParams: { AllotmentID: AllotmentId }
      });
    } else if (this.searchRequest.CourseTypeId == 3) {
      this.router.navigate(['/student-nodal-status/3'], {
        queryParams: { AllotmentID: AllotmentId }
      });
    } else if (this.searchRequest.CourseTypeId == 4) {
      this.router.navigate(['/student-nodal-status/4'], {
        queryParams: { AllotmentID: AllotmentId }
      });
    } else if (this.searchRequest.CourseTypeId == 5) {
      this.router.navigate(['/student-nodal-status/5'], {
        queryParams: { AllotmentID: AllotmentId }
      });
    }
  }

}
