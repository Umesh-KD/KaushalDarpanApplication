import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumDeploymentStatus, GlobalConstants, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { CODeploymentDataModel, CenterObserverSearchModel, CenterObserverDataModel } from '../../../../Models/CenterObserverDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CenterObserverService } from '../../../../Services/CenterObserver/center-observer.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { ITICenterObserverService } from '../../../../Services/ITI/ITICenterObserver/iticenter-observer.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify-iti-center-observer-deployment',
  standalone: false,
  templateUrl: './verify-iti-center-observer-deployment.component.html',
  styleUrl: './verify-iti-center-observer-deployment.component.css'
})
export class VerifyItiCenterObserverDeploymentComponent {
  public Table_SearchText: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public CenterObserverData: CODeploymentDataModel[] = [];
  public searchRequest = new CenterObserverSearchModel();
  closeResult: string | undefined;
  CenterObserverTeamID: number = 0
  modalReference: NgbModalRef | undefined;
  public requestObs = new CenterObserverDataModel()
  public _EnumDeploymentStatus = EnumDeploymentStatus;
  public Status: number = 0           // 1 for varify observer deployment and 2 for Generate Order for deployment
  public _GlobalConstants = GlobalConstants
  public _EnumRole = EnumRole;

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

   VerifyDeploymentForm!: FormGroup;
   public allowedDates: string[] = []
   public TimeTableDates: any = []



  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  
  constructor(
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private sMSMailService: SMSMailService,
    private route: ActivatedRoute,
    private appsettingConfig: AppsettingService,
    private itiCenterObserverService: ITICenterObserverService,
    private fb: FormBuilder,
  ) {}

  async ngOnInit() {
      this.VerifyDeploymentForm = this.fb.group({
      ExamDate: ['', Validators.required],
      Status: [{ value: '', disabled: true },]
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Status = Number(this.route.snapshot.paramMap.get('id')?.toString());
      // this.searchRequest.Status = 1
    this.searchRequest.Status = this.Status
      this.GetAllDataForVerify()
    this.GetTimeTableDates()
    console.log(this.Status,this._EnumDeploymentStatus.Verified)
}
 ResetControl() {
    this.searchRequest.ExamDate = ''
    this.GetAllDataForVerify()
  }

    checkValidDate(event: Event): void {
      
      const selectedDate = (event.target as HTMLInputElement).value;
      const control = this.VerifyDeploymentForm.get('DeploymentDate') as FormControl;
  
      if (!this.allowedDates.includes(selectedDate)) {
        this.toastr.warning('Exam not scheduled for selected date. Please choose another date.');
  
        this.searchRequest.ExamDate = '';
        control.setValue('');
        control.setErrors({ invalidDate: true });
  
      } else {
        this.GetAllDataForVerify();
        if (control.hasError('invalidDate')) {
          const errors = { ...control.errors };
          delete errors.invalidDate;
  
          if (Object.keys(errors).length === 0) {
            control.setErrors(null);
          } else {
            control.setErrors(errors);
          }
        }
      }
    }
  
    async GetTimeTableDates () {
      try {
        this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
        this.sSOLoginDataModel.Eng_NonEng= this.sSOLoginDataModel.Eng_NonEng
        this.loaderService.requestStarted();
        await this.itiCenterObserverService.GetTimeTableDates(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State == EnumStatus.Success) {
            this.TimeTableDates = data.Data;
            this.allowedDates = this.TimeTableDates.map((item: any) => item.ExamDate);
            console.log("this.allowedDates",this.allowedDates)
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        })
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200)
      }
    }
  async GetAllDataForVerify() {
    try {
      debugger
      this.loaderService.requestStarted();
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this.itiCenterObserverService.GetAllDataForVerify(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterObserverData = data['Data'];
          this.loadInTable()
          console.log("CenterObserverData",this.CenterObserverData)
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      })}
  }

  // async GetAllDataForGenerateOrder() {
  //   try {
  //     this.loaderService.requestStarted();
  //     this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
  //     this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
  //     await this.itiCenterObserverService.GetAllDataForGenerateOrder(this.searchRequest)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.CenterObserverData = data['Data'];
  //         this.loadInTable()
  //         console.log("CenterObserverData",this.CenterObserverData)
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     })}
  // }

  CloseModalPopup() {
    this.modalService.dismissAll();
    // this.requestInv = new TimeTableInvigilatorModel()
  }

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  async ViewandUpdate(content: any, id: number) {
    this.CenterObserverTeamID = id
    await this.GetByID()
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

  }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.itiCenterObserverService.GetByID(this.CenterObserverTeamID, this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        
        if (data.State == EnumStatus.Success) {
          this.requestObs = data.Data;
        }
        console.log("getbyid", this.requestObs)
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
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

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  async openModalGenerateOTP(content: any) {
    const anyTeamSelected = this.CenterObserverData.some(x => x.Selected);
    if (!anyTeamSelected) {
      this.toastr.error("Please select at least one Team!");
      return;
    }
    this.resetOTPControls();
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
      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
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

   CloseOTPModal() {

    this.modalService.dismissAll();
  }

  async VerifyOTP() {
    
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.VerifyDeployment();
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      } else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    } else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  async VerifyOTPGenerate() {
    
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.GenerateOrder();
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      } else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    } else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  async VerifyDeployment() {
    const Selected = this.CenterObserverData.filter(x => x.Selected == true)
    Selected.forEach((x: any) => {
      x.UserID = this.sSOLoginDataModel.UserID;
      x.DeploymentStatus = EnumDeploymentStatus.Verified;
    })

    try {
      this.loaderService.requestStarted();
      await this.itiCenterObserverService.SaveDeploymentVerifiedData(Selected).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success("Center Observer Deployment Verified")
          this.CloseOTPModal()
          this.GetAllDataForVerify()
        } else {
          this.toastr.error(data.ErrorMessage)
        }

      }, (error: any) => console.error(error))
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }

  }

  async GenerateOrder() {
    debugger;
    const Selected = this.CenterObserverData.filter(x => x.Selected == true)
    Selected.forEach((x: any) => {
      x.UserID = this.sSOLoginDataModel.UserID;
      x.DeploymentStatus = EnumDeploymentStatus.OrderGenerated;
      x.ExamDate = this.searchRequest.ExamDate;
      x.EndTermID = this.sSOLoginDataModel.EndTermID
    })

    try {
      debugger;
      this.loaderService.requestStarted();
      await this.itiCenterObserverService.GenerateCenterObserverDutyOrder(Selected).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success("Order Generated")
          this.CloseOTPModal()
          this.GetAllDataForVerify()
        } else {
          this.toastr.error(data.ErrorMessage)
        }

      }, (error: any) => console.error(error))
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
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
    this.paginatedInTableData = [...this.CenterObserverData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.CenterObserverData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.CenterObserverData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.CenterObserverData.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.CenterObserverData.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.CenterObserverData.filter(x=> x.DeploymentID == item.DeploymentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.CenterObserverData.every(r => r.Selected);
  }
  // end table feature

}
