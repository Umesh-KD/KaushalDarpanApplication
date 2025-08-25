import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';
import { EnumConfigTypeTabs, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { UserMasterService } from '../../../Services/UserMaster/user-master.service';
import { DataPagingListModel } from '../../../Models/DataPagingListModel';

@Component({
  selector: 'app-date-configuration-bter',
  templateUrl: './date-configuration-bter.component.html',
  styleUrls: ['./date-configuration-bter.component.css'],
  standalone: false
})
export class DateConfigurationBTERComponent implements OnInit, OnDestroy {
  public DateConfigurationFormGroup!: FormGroup;

  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public request = new DateConfigurationModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public Table_SearchText: string = '';
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
      /*cbIsLateral: [false]*/
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.RoleID = this.sSOLoginDataModel.RoleID
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID

    
    
    this.todayDate = new Date().toISOString().substring(0, 16);
    /*   this.request.CourseTypeID = this.sSOLoginDataModel.*///eng non engnerring course type

    /*    await this.GetAppointExaminerList()*/
    await this.GetConfigType()
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
      await this.commonMasterService.GetConfigurationType(this.RoleID, EnumConfigTypeTabs.Date_Tab).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TypeMasterDDL = data.Data;
        
      }, (error: any) => console.error(error))
    }
    catch (ex) {
      console.log(ex);
    }
  }


  async GetDataUpadate(ID: number) {
    
    var Model = new DateConfigurationModel()
    if (ID > 0) {

      Model = this.DateConfigList.find((x: any) => x.TypeID == ID)
      console.log(Model)
      if (Model != undefined && Model.DateConfigID != 0) {
        this.btnEdit_OnClick(Model.DateConfigID)
      } else {
        this.request.CourseSubTypeID = 0
        this.request.DateConfigID = 0
        this.request.From_Date = ''
        this.request.To_Date = ''
       
        this.request.IsLateral = false

     
        
      }
      console.log(this.request, "request")
    }
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
      await this.DateConfigService.SaveData(this.request)
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
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
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
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      await this.DateConfigService.GetAllData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DateConfigList = data['Data'];
          //table feature load
          console.log(this.DateConfigList)
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
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
  }

  async btnEdit_OnClick(ID: number) {
    this.isFormSubmitted = false;
    try {
      await this.DateConfigService.GetByID(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];
          if (this.request.CourseSubTypeID == 3)
            this.request.IsLateral = true;
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
  }

  async btnDelete_OnClick(ID: number) {
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {
      if (result.isConfirmed) {
        this.isFormSubmitted = false;
        try {
          await this.DateConfigService.DeleteByID(ID)
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


  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.isLoading = true;
          if (this.request.IsLateral && this.request.TypeID == 1)
            this.request.CourseSubTypeID = 3;
          else if (this.request.TypeID == 1)
            this.request.CourseSubTypeID = 1;
          await this.DateConfigService.SaveData(this.request)
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
    if (this.DateConfigurationFormGroup.invalid) {
      return
    }
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

