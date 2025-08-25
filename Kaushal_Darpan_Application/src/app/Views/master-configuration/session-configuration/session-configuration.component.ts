import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateConfigurationModel, SessionConfigModelModel } from '../../../Models/DateConfigurationDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { UserMasterService } from '../../../Services/UserMaster/user-master.service';

@Component({
  selector: 'app-session-configuration',
  templateUrl: './session-configuration.component.html',
  styleUrls: ['./session-configuration.component.css'],
  standalone: false
})
export class SessionConfigurationComponent implements OnInit, OnDestroy {
  public DateConfigurationFormGroup!: FormGroup;

  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public request = new DateConfigurationModel();
  public requestData = new SessionConfigModelModel()
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';

  public TypeMasterDDL: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();

  public DateConfigList: any = []
  public SemesterList: any = [];
  public StreamList: any = [];
  public todayDate: any;

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public RoleID: number = 0;
  public DepartmentID: number = 0;
  //end table feature default

  public IsShowAddNew: boolean = false;

  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private DateConfigService: DateConfigService,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private userMasterService: UserMasterService
    
  ) { }

  async ngOnInit() {
  
    this.DateConfigurationFormGroup = this.formBuilder.group({
      ddlType: ['', [DropdownValidators]],
      txtFromDate: ['', [Validators.required]],
      txtToDate: ['', [Validators.required]],
      cbIsLateral: [false]
    });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.RoleID = this.sSOLoginDataModel.RoleID
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID

    this.requestData.FinancialYearName = "0";
    this.requestData.EndTermName = "0";    
    this.todayDate = new Date().toISOString().substring(0, 16);
    /*   this.request.CourseTypeID = this.sSOLoginDataModel.*///eng non engnerring course type

    /*    await this.GetAppointExaminerList()*/
    this.GetSesionDDL();
    await this.GetAllData()
    await this.GetSemesterMasterDDL()
    await this.GetSreamMasterDDL()
    
    await this.GetUserMobileNoForOTP()
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  get _DateConfigurationFormGroup() { return this.DateConfigurationFormGroup.controls; }



  async GetConfigType() {
    
    try {
      
      this.RoleID = this.sSOLoginDataModel.RoleID;
      await this.commonMasterService.GetConfigurationType(this.RoleID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TypeMasterDDL = data.Data;
        
      }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }

  ShowAddNew() {
    
    this.IsShowAddNew = true;
  }

  async GetSesionDDL() {
    //this.getCurrentFinancialYear(0);
    //this.getCurrentFinancialYear(1);
    //this.request.TypeID = 0;

    try {

      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;

      this.requestData.FinancialYearName = this.request.FinancialYearName == '' ? '0' : this.request.FinancialYearName;
      this.requestData.CourseTypeID = this.request.CourseTypeID;
      this.requestData.CreatedBy = this.sSOLoginDataModel.UserID;
      this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestData.Action = "EndTerm";

      await this.commonMasterService.SessionConfiguration(this.requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TypeMasterDDL = data['Data'];
          //table feature load
          this.loadInTable();
          //end table feature load
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }


  }

  async getCurrentFinancialYear(i: number) {
    //document.getElementById("spFY").innerHTML = getCurrentFinancialYear(1);
      var fiscalyear = "";
      var today = new Date();
    if ((today.getMonth() + 1) <= 3) {
      fiscalyear = ((today.getFullYear() - 1) + i).toString() + "-" + (today.getFullYear() + i).toString();
    } else {
      fiscalyear = (today.getFullYear() + i).toString() + "-" + ((today.getFullYear() + 1) + i).toString()
    }


      this.TypeMasterDDL.push({ ID: fiscalyear, Name: fiscalyear });
      return fiscalyear
}



  async SaveData() {
    
    this.isFormSubmitted = true;
    try {
      if (this.DateConfigurationFormGroup.invalid) {
        return
      }
      
      this.isLoading = true;
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      if (this.request.IsLateral && this.request.TypeID == 1)
        this.request.CourseSubTypeID = 3;
      else if (this.request.TypeID == 1)
        this.request.CourseSubTypeID = 1;

      var th = this;
      this.requestData.FinancialYearName = this.TypeMasterDDL.find(function (x) { return x.EndTerm = th.request.EndTermName })[0].FYName;
      this.requestData.EndTermName = this.request.EndTermName;
      this.requestData.CourseTypeID = this.request.CourseTypeID;
      this.requestData.CreatedBy = this.sSOLoginDataModel.UserID;
      this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestData.Action = "ADD";


      await this.commonMasterService.SessionConfiguration(this.requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.GetAllData();
            this.ResetControls();
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
            this.GetAllData();
            this.ResetControls();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }
  async GetSemesterMasterDDL() {
    try {
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterList = data.Data;
        }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }
  async GetSreamMasterDDL() {
    try {
      await this.commonMasterService.StreamMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamList = data.Data;
        }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }
  async GetAllData() {
    try {
      
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;

      this.requestData.FinancialYearName = this.request.FinancialYearName == '' ? '0' : this.request.FinancialYearName;
      this.requestData.CourseTypeID = this.request.CourseTypeID;
      this.requestData.CreatedBy = this.sSOLoginDataModel.UserID;
      this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestData.Action = "LIST";

      await this.commonMasterService.SessionConfiguration(this.requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DateConfigList = data['Data'];
          //table feature load
          this.loadInTable();
          //end table feature load
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async ResetControls() {
    this.isFormSubmitted = false
    this.DateConfigurationFormGroup.reset()
    this.request = new DateConfigurationModel()
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
  }

  async btnEdit_OnClick(ID: number, Name: any, IsCurrentFY: boolean) {
    this.isFormSubmitted = false;
    try {

      this.requestData.FinancialYearName = Name;
      this.requestData.FinancialYearID = ID;
      this.requestData.IsCurrentFY = IsCurrentFY;      
    }
    catch (ex) { console.log(ex) }
  }

  async btnDelete_OnClick(ID: number) {
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {
      if (result.isConfirmed) {
        this.isFormSubmitted = false;
        try {

          this.requestData.FinancialYearID = ID;
          this.requestData.CourseTypeID = this.request.CourseTypeID;
          this.requestData.CreatedBy = this.sSOLoginDataModel.UserID;
          this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          this.requestData.Action = "DELETE";

          await this.commonMasterService.SessionConfiguration(this.requestData)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              if (data.State == EnumStatus.Success) {
                this.toastr.success(this.Message);
                this.GetAllData();
              }
              else if (data.State == EnumStatus.Warning) {
                this.toastr.warning(this.ErrorMessage);
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }

            }, error => console.error(error));
        }
        catch (ex) { console.log(ex) }
      }
    });
  }

  //async ActiveInActive(event: MouseEvent, FinancialYearID: number, ActiveStatus: boolean) {
  //  event.preventDefault();
  //  this.Swal2.Confirmation("Are you sure you want to " + (ActiveStatus ? 'Active' : 'In Active') + " this session term ?", async (result: any) => {
  //    if (result.isConfirmed) {
  //      this.isFormSubmitted = false;
  //      try {
  //        this.loaderService.requestStarted();
  //        this.requestData.FinancialYearID = FinancialYearID;
  //        this.requestData.CourseTypeID = this.request.CourseTypeID;
  //        this.requestData.CreatedBy = this.sSOLoginDataModel.UserID;
  //        this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //        this.requestData.ActiveStatus = ActiveStatus?1:0;
  //        this.requestData.Action = "ACTIVE";

  //        await this.commonMasterService.SessionConfiguration(this.requestData)
  //          .then((data: any) => {
  //            data = JSON.parse(JSON.stringify(data));
  //            this.State = data['State'];
  //            this.Message = data['Message'];
  //            this.ErrorMessage = data['ErrorMessage'];
  //            if (data.State == EnumStatus.Success) {
  //              this.toastr.success(this.Message);
  //              this.GetAllData();
  //            }
  //            else if (data.State == EnumStatus.Warning) {
  //              this.toastr.warning(this.ErrorMessage);
  //            }
  //            else {
  //              this.toastr.error(this.ErrorMessage)
  //            }

  //          }, error => console.error(error));
  //      }
  //      catch (ex) { console.log(ex) }
  //      finally {
  //        setTimeout(() => {
  //          this.loaderService.requestEnded();
  //        }, 200);
  //      }
  //    }
  //  });
  //}

  //new
  onToggleChange(event: Event, row: any) {
    event.preventDefault();

    const newStatus = row.IsCurrentFinancialYear !== 'YES';
    this.Swal2.Confirmation(`Are you sure you want to ${newStatus ? 'Active' : 'In Active'} this session term?`, async (result: any) => {
      if (result.isConfirmed) {
        await this.ActiveInActive(row.FinancialYearID, newStatus);

        row.IsCurrentFinancialYear = newStatus ? 'YES' : 'NO';
      } else {

        setTimeout(() => {
          const input = document.getElementById('Active') as HTMLInputElement;
          if (input) input.checked = row.IsCurrentFinancialYear === 'YES';
        });
      }
    });
  }


  async ActiveInActive(FinancialYearID: number, ActiveStatus: boolean) {
    try {
      this.loaderService.requestStarted();
      this.requestData.FinancialYearID = FinancialYearID;
      this.requestData.CourseTypeID = this.request.CourseTypeID;
      this.requestData.CreatedBy = this.sSOLoginDataModel.UserID;
      this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestData.ActiveStatus = ActiveStatus ? 1 : 0;
      this.requestData.Action = 'ACTIVE';

      const data = await this.commonMasterService.SessionConfiguration(this.requestData);
      const response = JSON.parse(JSON.stringify(data));

      this.State = response.State;
      this.Message = response.Message;
      this.ErrorMessage = response.ErrorMessage;

      if (response.State === EnumStatus.Success) {
        this.toastr.success(this.Message);
      } else if (response.State === EnumStatus.Warning) {
        this.toastr.warning(this.ErrorMessage);
      } else {
        this.toastr.error(this.ErrorMessage);
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //end new



  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.isLoading = true;
          //if (this.request.IsLateral && this.request.TypeID == 1)
          //  this.request.CourseSubTypeID = 3;
          //else if (this.request.TypeID == 1)
          //  this.request.CourseSubTypeID = 1;
          //this.requestData.FinancialYearName = this.request.FinancialYearName;
          
          var th = this;
          this.requestData.FinancialYearName = this.TypeMasterDDL.find(function (x) { return x.EndTerm == th.requestData.EndTermName }).FYName;
          //this.requestData.EndTermName = this.request.EndTermName;
          this.requestData.CourseTypeID = this.request.CourseTypeID;
          this.requestData.CreatedBy = this.sSOLoginDataModel.UserID;
          this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          this.requestData.Action = "ADD";

          await this.commonMasterService.SessionConfiguration(this.requestData)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              if (data.State == EnumStatus.Success) {
                this.toastr.success(this.Message);
                this.GetAllData();
                this.ResetControls();
              }
              else if (data.State == EnumStatus.Warning) {
                this.toastr.warning(this.ErrorMessage);
                this.GetAllData();
                this.ResetControls();
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            }, (error: any) => console.error(error)
            );
          this.CloseModal()
        }
        catch (ex) {
          console.log(ex);
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
      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin) {
        this.sSOLoginDataModel.Mobileno = "7568622727";
        
        await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.startTimer();
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
    }
    catch (Ex) {
      console.log(Ex);
    }
  }



  //Start Section Model
  async openModalGenerateOTP(content: any, item: DateConfigurationModel) {
    
    this.isFormSubmitted = true;
    if (this.requestData.EndTermName == "0" || this.requestData.EndTermName == "") {
      this.toastr.error('Please select Session Year');
    } else {
      this.OTP = '';
      this.MobileNo = '';
      this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.MobileNo = this.MobileNo;
      this.request = item;
      this.SendOTP();
    }
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

  @ViewChild('content') content: ElementRef | any;

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  //Modal Section END




  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.DateConfigList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.DateConfigList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.DateConfigList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.DateConfigList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.DateConfigList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }

  // end table feature

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'EndTermID', 'DepartmentID', 'CourseTypeID', 'TypeID', 'From_Date', 'To_Date'
    ];
    const filteredData = this.DateConfigList.map((item: any) => {
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
    XLSX.writeFile(wb, 'DateConfigurationData.xlsx');
  }

  async GetUserMobileNoForOTP() {
    
    try {

      this.RoleID = this.sSOLoginDataModel.RoleID;
      this.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.userMasterService.GetUserMobileNoForOTP(this.RoleID, this.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.sSOLoginDataModel.Mobileno = data.Data["MobileNo"];

      }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }

}
