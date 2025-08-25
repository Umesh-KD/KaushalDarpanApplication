import { Component, ViewChild } from '@angular/core';
import { DetainedStudentsDataModel, DetainedStudentsSearchModel } from '../../../Models/BTER/DetainedStudentsDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ToastrService } from 'ngx-toastr';
import { DetainedStudentsService } from '../../../Services/BTER/DetainedStudents/detained-students.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-detained-students',
  templateUrl: './detained-students.component.html',
  styleUrl: './detained-students.component.css',
  standalone: false
})
export class DetainedStudentsComponent {
  public ssoLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new DetainedStudentsSearchModel();
  public DetainedStudentsData: any = [];
  public InstituteMasterDDLList: any = []
  public StreamMasterDDLList: any = []
  public SemesterMasterDDLList: any = []
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  closeResult: string | undefined;
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any
  OtpVerified: boolean = false
  public RevokeStudentID: number = 0
  public request = new DetainedStudentsDataModel();

  timeLeft: number = GlobalConstants.DefaultTimerOTP; 
  showResendButton: boolean = false; 
  private interval: any;

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
  //end table feature default

  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private detainedStudentsService: DetainedStudentsService,
    private smsMailService: SMSMailService,
    private modalService: NgbModal,
  ){}

  async ngOnInit() {
    this.ssoLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.DepartmentID = this.ssoLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;

    this.request.DepartmentID = this.ssoLoginDataModel.DepartmentID;
    this.request.EndTermID = this.ssoLoginDataModel.EndTermID;
    this.request.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
    this.request.UserID = this.ssoLoginDataModel.Eng_NonEng;
    await this.GetAllDetainedStudentsData();
    await this.GetMasterData();
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.ssoLoginDataModel.DepartmentID, this.ssoLoginDataModel.Eng_NonEng, this.ssoLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      }, (error: any) => console.error(error))

      await this.commonMasterService.InstituteMaster(this.ssoLoginDataModel.DepartmentID, this.ssoLoginDataModel.Eng_NonEng, this.ssoLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
      })

      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetSearchRequest() {
    this.searchRequest = new DetainedStudentsSearchModel();
    this.searchRequest.DepartmentID = this.ssoLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
    this.GetAllDetainedStudentsData();
  }

  async GetAllDetainedStudentsData() {
    try {
      this.loaderService.requestStarted();
      console.log("this.searchRequest",this.searchRequest);
      await this.detainedStudentsService.GetAllDetainedStudentsData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.DetainedStudentsData = data['Data'];
          console.log("this.DetainedStudentsData", this.DetainedStudentsData);

          this.loadInTable();
        }, (error: any) => console.error(error)
      )
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async alertForRevoke(StudentID: number) {
    this.Swal2.Confirmation(`Do you want to Revoke this Student: ${StudentID}?`,
      async (result: any) => {
        if (result.isConfirmed) {
          this.openModalGenerateOTP(this.modal_GenrateOTP);
          console.log("result", StudentID);
          this.RevokeStudentID = StudentID
        } else {
          this.RevokeStudentID = 0
        }
      });
  }

  async openModalGenerateOTP(content: any) {
    console.log("content",content);
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
    this.SendOTP();
  }

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      await this.smsMailService.SendMessage(this.ssoLoginDataModel.Mobileno, "OTP")
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
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;


    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true;
      }
    }, 1000);
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
    this.OtpVerified = false
    this.RevokeStudentID = 0
    this.modalService.dismissAll();
  }

  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.OtpVerified = true
          await this.RevokeDetain();
          this.CloseModal();
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

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  async RevokeDetain() {
    try {
      this.loaderService.requestStarted();
      this.request.StudentID = this.RevokeStudentID
      await this.detainedStudentsService.RevokeDetain(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.GetAllDetainedStudentsData();
          } else {
            this.toastr.warning(data.Message);
          }
        }, (error: any) => console.error(error)
      )
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  
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
    this.paginatedInTableData = [...this.DetainedStudentsData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.DetainedStudentsData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.DetainedStudentsData.length;
  }
  // (replace org.list here)
  // get totalInTableSelected(): number {
  //   return this.DetainedStudentsData.filter(x => x.Selected)?.length;
  // }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  // selectInTableAllCheckbox() {
  //   this.DetainedStudentsData.forEach(x => {
  //     x.Selected = this.AllInTableSelect;
  //   });
  // }
  //checked single (replace org. list here)
  // selectInTableSingleCheckbox(isSelected: boolean, item: any) {
  //   const data = this.DetainedStudentsData.filter(x => x.StudentID == item.StudentID);
  //   data.forEach(x => {
  //     x.Selected = isSelected;
  //   });
  //   //select all(toggle)
  //   this.AllInTableSelect = this.DetainedStudentsData.every(r => r.Selected);
  // }
  // end table feature

  exportToExcel(): void {
    const unwantedColumns = ['StudentID'];
    const filteredData = this.DetainedStudentsData.map((item: any) => {
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
    XLSX.writeFile(wb, 'DetainedStudentsData.xlsx');
  }
}
