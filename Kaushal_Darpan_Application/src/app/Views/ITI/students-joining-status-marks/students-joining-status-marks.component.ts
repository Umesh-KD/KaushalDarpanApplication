import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { StudentsJoiningStatusMarksDataMedels, StudentsJoiningStatusMarksSearchModel } from '../../../Models/StudentsJoiningStatusMarksDataMedels';
import { StudentsJoiningStatusMarksService } from '../../../Services/Students-Joining-Status-Marks/students-joining-status-marks.service';
import { EnumDepartment, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { ITIAllotmentService } from '../../../Services/ITI/ITIAllotment/itiallotment.service';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { IMCAllocationDataModel } from '../../../Models/ITIIMCAllocationDataModel';
import { SearchSlidingModel } from '../../../Models/InternalSlidingDataModel';
import { InternalSlidingService } from '../../../Services/ITIInternalSliding/internal-sliding.service';
@Component({
  selector: 'app-students-joining-status-marks',
  standalone: false,

  templateUrl: './students-joining-status-marks.component.html',
  styleUrl: './students-joining-status-marks.component.css'
})
export class StudentsJoiningStatusMarksComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  request = new StudentsJoiningStatusMarksDataMedels()
  public searchRequest = new StudentsJoiningStatusMarksSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public AllotmentId: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudentsJoiningStatusMarksList: any[] = [];
  public StudentsJoiningStatusMarksDetails: any[] = [];
  public TradeList: any[] = [];
  public AllotmentTypeList: any[] = [];
  public ITITradeSchemeList: any[] = [];
  public IsStatusMark: boolean = false;
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any;
  public DateConfigSetting: any = [];
  public ShiftUnitList: any = [];
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  AllotmentKey: string = "";
  public isprofile: number = 0;
  public shiftUnitRequest = new SearchSlidingModel()

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private StudentsJoiningStatusMarksService: StudentsJoiningStatusMarksService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private route: ActivatedRoute,
    private Swal2: SweetAlert2,
    private ITIAdminDashboardService: ITIAdminDashboardServiceService,
    private sweetAlert2: SweetAlert2,
    private itiallotmentStatusService: ITIAllotmentService,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private internalSlidingService: InternalSlidingService,
    private http: HttpClient,
  ) {
  }


  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlReportingStatus: ['0', [DropdownValidators]],
      txtReportingRemark: ['']
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if ((this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || EnumRole.Principal_NCVT)) {
      await this.CheckProfileStatus();
      if (this.isprofile == 0) {
        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
          window.open("/ITIUpdateCollegeProfile?id=" + this.sSOLoginDataModel.InstituteID, "_Self")
        }, 'OK', false);

      }
    }
    //this.AllotmentKey = "FIRST NODAL REPORTING";
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.loadDropdownData('AllotmentType')
    this.searchRequest.TradeLevel = parseInt(this.route.snapshot.paramMap.get('id'));
    await this.GetDateConfig();
    await this.GetTradeSchemeDDL(); 
    //await  this.getStudentsJoiningStatusMarksList(1);
    this.searchRequest.ReportingStatus = "0";

    
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
  async GetTradeSchemeDDL() {
    const MasterCode = "IITTradeScheme";
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
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
      this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      //this.searchRequest.ReportingStatus = this.request.ReportingStatus;
      await this.StudentsJoiningStatusMarksService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentsJoiningStatusMarksList = data['Data'];

          this.totalRecord = this.StudentsJoiningStatusMarksList[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

          console.log(this.StudentsJoiningStatusMarksList, "StudentsJoiningStatusMarksList")
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
    this.searchRequest.TradeId = 0;
    this.searchRequest.ApplicationID = 0;
    this.searchRequest.TradeId = 0
    this.searchRequest.TradeSchemeId = 0
    this.searchRequest.TradeLevel = 0
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




  async ExPortExcelData() {

    try {

      var _searchRequest = new StudentsJoiningStatusMarksSearchModel();
      this.loaderService.requestStarted();
      _searchRequest = this.searchRequest;
      _searchRequest.PageNumber = 1;
      _searchRequest.PageSize = this.totalRecord;
      _searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      //this.searchRequest.ReportingStatus = this.request.ReportingStatus;
      await this.StudentsJoiningStatusMarksService.GetAllData(_searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          const StudentsJoiningStatusMarksListEx = data['Data'];
          var columns:any = [];

          if (this.searchRequest.TradeLevel == 10) {
            columns = ["SrNo", "ApplicationNo", "Name", "FatherName", "DOB", "Gender", "StudentCategory", "MobileNo", "AadharNo", "TradeCode", "TradeName", "Shift", "Unit", "AllotedCategory", "JoiningStatus", "TradeSchemeName", "ClassPer", "TenthMathsPer", "TenthSciencePer", "MeritNo"];
          } else {
            columns = ["SrNo", "ApplicationNo", "Name", "FatherName", "DOB", "Gender", "StudentCategory", "MobileNo", "AadharNo", "TradeCode", "TradeName", "Shift", "Unit", "AllotedCategory","JoiningStatus", "TradeSchemeName", "ClassPer", "MeritNo"];
          }
          const filteredData = StudentsJoiningStatusMarksListEx.map((item: any) => {
            const filteredItem: any = {};
            Object.keys(item).forEach(key => {
              if (columns.includes(key)) {
                filteredItem[key] = item[key];
              }
            });
            return filteredItem;
          });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, 'StudentsJoiningStatusMarksList.xlsx');

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

  async exportPDFData() {

    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return
    }
    try {


      var _searchRequest = new StudentsJoiningStatusMarksSearchModel();
      this.loaderService.requestStarted();
      _searchRequest = this.searchRequest;
      _searchRequest.PageNumber = 1;
      _searchRequest.PageSize = this.totalRecord;
      _searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;

      this.loaderService.requestStarted();
      await this.itiallotmentStatusService.DownloadCollegeAllotmentData(this.searchRequest)
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
            link.download = 'AllotmentList_' + this.sSOLoginDataModel.InstituteID + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => console.error(error))
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


  async openModalGenerateOTP(content: any, AllotmentId: number, JoinStatus: string) {
    if (JoinStatus != 'Reported') {
      this.searchRequest.AllotmentId = AllotmentId
      await this.StudentsJoiningStatusMarksService.CheckAllotment(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (data['Data'][0]['CheckStatus'] == -1) {
            this.toastr.warning("Already Alloted For Other College or Trade !")
            return
          } else {
            this.router.navigate(['/ITIAllotmentReporting'], {
              queryParams: { AllotmentID: AllotmentId, Key: this.searchRequest.TradeLevel }
            });

          }
        })
    } else {
      this.router.navigate(['/ITIAllotmentReporting'], {
        queryParams: { AllotmentID: AllotmentId, Key: this.searchRequest.TradeLevel }
      });
    }



    //this.OTP = '';
    //this.MobileNo = '';
    //this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
    //  this.closeResult = `Closed with: ${result}`;
    //}, (reason) => {
    //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //});
    //this.request.AllotmentId = AllotmentId
    //this.MobileNo 
    //this.SendOTP();
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
          this.router.navigate(['/ITIAllotmentReporting'], {
            queryParams: { AllotmentID: this.request.AllotmentId }
          });



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


  async GetDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: 1,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      Key: "IMC ALLOTMENT REPORTING,FIRST NODAL REPORTING,SECOND NODAL REPORTING,INTERNAL SLIDING REPORTING",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];

        debugger;

        if (this.DateConfigSetting[0]["FIRST NODAL REPORTING"] == 1) {
          this.searchRequest.AllotmentMasterId = 2;
          this.AllotmentKey = "FIRST NODAL REPORTING";
        } else if (this.DateConfigSetting[0]["SECOND NODAL REPORTING"] == 1) {
          this.searchRequest.AllotmentMasterId = 4;
          this.AllotmentKey = "SECOND NODAL REPORTING";
        }
        this.searchRequest.ReportingStatus = "0";
        //this.AllotmentChange();
        this.getStudentsJoiningStatusMarksList(1);

        console.log(this.DateConfigSetting);

      }, (error: any) => console.error(error)
      );
  }

  AllotmentChange() {



    if (this.searchRequest.AllotmentMasterId == 1) {
      this.AllotmentKey = "IMC ALLOTMENT REPORTING";
    } else if (this.searchRequest.AllotmentMasterId == 2 || this.searchRequest.AllotmentMasterId == -2) {
      this.AllotmentKey = "FIRST NODAL REPORTING";
    } else if (this.searchRequest.AllotmentMasterId == 4) {
      this.AllotmentKey = "SECOND NODAL REPORTING";
    } else if (this.searchRequest.AllotmentMasterId == 6) {
      this.AllotmentKey = "INTERNAL SLIDING REPORTING";
    } else {

    }
    this.getStudentsJoiningStatusMarksList(1);
  }

  async CheckAllot(id: number) {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AllotmentId = id;

      await this.StudentsJoiningStatusMarksService.CheckAllotment(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (data['Data'][0]['CheckStatus'] == -1) {
            this.toastr.warning("Already Alloted")
          }

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

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      await this.ITIAdminDashboardService.GetProfileStatus(this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.isprofile = data['Data'][0]['IsProfile'];


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

  async DownloadAllotmentLetter(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.itiallotmentStatusService.GetAllotmentLetter(id)
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

  async DownloadAllotmentReportingReceipt(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.itiallotmentStatusService.GetAllotmentReportingReceipt(id)
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
            link.download = 'Allotment-Reporting-Receipt' + id + '.pdf';
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

  async GetAllotmentFeeReceipt(id: any) {
    try {
      this.loaderService.requestStarted();
      //this.ApplicationID = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.itiallotmentStatusService.GetAllotmentFeeReceipt(id)
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
            link.download = 'Allotment_fee_Receipt' + id + '.pdf';
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
  async DownloadApplicationForm(ApplicationID: number) {
    try {
      this.loaderService.requestStarted();

      var searchrequest = new ItiApplicationSearchmodel()

      searchrequest.DepartmentID = EnumDepartment.ITI;
      searchrequest.ApplicationID = ApplicationID;
      await this.reportService.GetITIApplicationForm(searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
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


  async OpenShifUnit(content: any, CollegeTradeId: number, ApplicationID: number, AllotmentId: number, AllotedCategory: any, Name: any, ApplicationNo: any, TradeName:any) {
    debugger;
    this.shiftUnitRequest.InsID = CollegeTradeId;
    this.shiftUnitRequest.ApplicationID =ApplicationID;
    this.shiftUnitRequest.AllotmentId = AllotmentId;
    this.shiftUnitRequest.ApplicationNo = ApplicationNo;
    this.shiftUnitRequest.Name = Name;
    this.shiftUnitRequest.AllotedCategory = AllotedCategory;
    this.shiftUnitRequest.TradeName = TradeName;

    this.shiftUnitRequest.action = "List";
    this.shiftUnitRequest.SeatIntakeId = 0;
    this.ShiftUnitList = [];
    //this.slidingrequest.TradeLevel = this.request.trade;
    try {
      await this.internalSlidingService.GetDDLInternalSlidingUnitList(this.shiftUnitRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.ShiftUnitList = data['Data'];           
          } else {
            /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  async SaveShitUnit() {
    this.shiftUnitRequest.action = "UPDATE";
    //this.slidingrequest.TradeLevel = this.request.trade;
    if (this.shiftUnitRequest.SeatIntakeId == 0) {
      this.toastr.error('Select shit/Unit')
    } else {

      try {
        await this.internalSlidingService.GetDDLInternalSlidingUnitList(this.shiftUnitRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              if (data.Data[0].Status == 1) {
                this.CloseModal();
                this.toastr.success(data.Data[0].MSG);
                this.getStudentsJoiningStatusMarksList(1);
              } else {
                this.toastr.error(data.Data[0].MSG);
              }
             
            } else {
              this.toastr.error(data.ErrorMessage)
              /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
            }
          }, (error: any) => console.error(error));
      } catch (Ex) {
        console.log(Ex);
      }
    }
  }

}
