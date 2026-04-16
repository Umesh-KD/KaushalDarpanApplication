import { Component, ViewChild, ElementRef } from '@angular/core';
import { EnumDeploymentStatus, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { InspectionMemberDetailsDataModel, InspectionDeploymentDataModel, ITI_InspectionDataModel, ITI_InspectionSearchModel, ConsentModel, CenterMasterDDLDataModel, UpdateConsentModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SearchRequest } from '../../../../Models/CitizenSuggestionDataModel';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { EmitraRequestDetails } from '../../../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../../../Services/EmitraPayment/emitra-payment.service';

@Component({
  selector: 'app-iti-consent-update',
  standalone: false,
  templateUrl: './iti-consent-update.component.html',
  styleUrl: './iti-consent-update.component.css'
})
export class ITIConsentUpdateComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITI_InspectionSearchModel();
  public InspectionConsentID: number = 0
  public request = new ITI_InspectionDataModel();
  public modalReference: NgbModalRef | undefined;
  public consentForm!: FormGroup;
  public consentRequest = new ConsentModel();
  public ConsentData: any = [];
  public InstituteMasterDDL: any = [];
  public DistrictMasterDDL: any = [];
  public requestCenter = new CenterMasterDDLDataModel();
  public consentDeploy = new ConsentModel();
  public UpdateConsentRequest = new UpdateConsentModel();
  emitraRequest = new EmitraRequestDetails();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public isSubmitted: boolean = false;
  public totalAmount: number = 0;
  public PaymentStatus: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  public Table_SearchText: string = '';
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private fb: FormBuilder,
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private emitraPaymentService: EmitraPaymentService,

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GetAllData()
    //this.getMasterData()
    this.consentForm = this.fb.group({
      Remarks: ['', Validators.required],
      TentativeDate: ['', Validators.required]
    });
    this.consentDeploy = new ConsentModel();
  }

  async ResetControl() {
    this.UpdateConsentRequest = new UpdateConsentModel();
    this.GetAllData();
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.consentRequest.UserID = this.sSOLoginDataModel.UserID
      this.consentRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      await this.itiInspectionService.GetAllConsentbyPrincipal(this.consentRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.ConsentData = data.Data
          console.log("Consent Data ==>", this.ConsentData)
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
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

  async GetById_Consent(InspectionConsentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.itiInspectionService.GetById_Consent(InspectionConsentID).then((data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        var id = data.Data
        if (data.State === EnumStatus.Success) {
          this.request = data.Data

        } else if (data.State === EnumStatus.Warning) {
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

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async ViewandUpdate(content: any, InspectionConsentID: number) {

    debugger
    try {
      this.InspectionConsentID = InspectionConsentID;

      // const response: any = await this.GetById_Consent(InspectionConsentID);
      const response: any = await this.itiInspectionService.GetById_Consent(InspectionConsentID);

      if (response && response.State === EnumStatus.Success && response.Data) {
        const row = response.Data;
        console.log(row.TentativeDate);
        console.log(row[0].TentativeDate)
        console.log(row[0].IsAnyCourtCase);

        this.UpdateConsentRequest = {
          TentativeDate: row[0].TentativeDate ? row[0].TentativeDate.split('T')[0] : '', 
          Remark: row[0].Remark || '',
          DocConsent: null, 
          UserID: row[0].UserID || 0, 
          InspectionConsentID: row[0].InspectionConsentID || InspectionConsentID ,
          Amount:row[0].Amount || 0,
          ServiceID:row[0].ServiceID || 0,
          ID:row[0].ID || 0,
          IsAnyCourtCase:row[0].IsAnyCourtCase || false
        };
        console.log("update", this.UpdateConsentRequest);
      } else {
        console.warn('No data found for the given ID:', InspectionConsentID);
        this.UpdateConsentRequest = {
          TentativeDate: '',
          Remark: '',
          DocConsent: null,
          UserID: 0,
          InspectionConsentID: InspectionConsentID,
          Amount:0,
          ServiceID:0,
          ID:0
        };
      }

      this.modalReference = this.modalService.open(content, {
        backdrop: 'static',
        size: 'xl',
        keyboard: true,
        centered: true
      });
    } catch (error) {
      console.error('Error fetching consent details:', error);
    }
  }

  async ViewForPayment( InspectionConsentID: number) {
    debugger
    try {
      this.InspectionConsentID = InspectionConsentID;

      // const response: any = await this.GetById_Consent(InspectionConsentID);
      const response: any = await this.itiInspectionService.GetById_Consent(InspectionConsentID);

      if (response && response.State === EnumStatus.Success && response.Data) {
        const row = response.Data;
        console.log(row.TentativeDate);
        console.log(row[0].TentativeDate)

        this.UpdateConsentRequest = {
          TentativeDate: row[0].TentativeDate ? row[0].TentativeDate.split('T')[0] : '', 
          Remark: row[0].Remark || '',
          DocConsent: null, 
          UserID: row[0].UserID || 0, 
          InspectionConsentID: row[0].InspectionConsentID || InspectionConsentID ,
          Amount:row[0].Amount || 0,
          ServiceID:row[0].ServiceID || 0,
          ID:row[0].ID || 0
        };
      } else {
        console.warn('No data found for the given ID:', InspectionConsentID);
        this.UpdateConsentRequest = {
          TentativeDate: '',
          Remark: '',
          DocConsent: null,
          UserID: 0,
          InspectionConsentID: InspectionConsentID,
          Amount:0,
          ServiceID:0,
          ID:0
        };
      }

    } catch (error) {
      console.error('Error fetching consent details:', error);
    }
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {

        if (this.file.size > 2000000) {
          this.toastr.error('Select less then 2MB File');
          return;
        }
        this.loaderService.requestStarted();

        let uploadModel = new UploadFileModel();

        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITI/Consent";
        await this.commonMasterService
        .UploadDocument(this.file, uploadModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            if (Type == 'Photo') {

              this.consentDeploy.DocConsent =
                data['Data'][0]['FileName'];

              this.UpdateConsentRequest.DocConsent = data['Data'][0]['FileName'];
            }
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
          } else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
          }
        });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async onSubmitConsent(status:any) {
    debugger
    this.isSubmitted = true;
    if (!this.UpdateConsentRequest.DocConsent || this.UpdateConsentRequest.DocConsent === '') {
      this.toastr.error('Please upload the required document.');
      return;
    }
    if(this.consentForm.invalid){
      this.toastr.error('Please fill all mandatory fields !');
      return;
    }
    // if(status==1){
    //   console.log(this.UpdateConsentRequest.Amount);
    //    await this.submitPayment();
    // }

      this.UpdateConsentRequest.UserID = this.sSOLoginDataModel.UserID;
      this.UpdateConsentRequest.Remark = this.consentForm.get('Remarks')?.value;
      this.UpdateConsentRequest.TentativeDate = this.consentForm.get('TentativeDate')?.value;
      this.UpdateConsentRequest.InspectionConsentID = this.InspectionConsentID;
      this.UpdateConsentRequest.Status=status;
      try {
        this.isSubmitted = true;
        this.loaderService.requestStarted();
        this.itiInspectionService.updateConsent(this.UpdateConsentRequest)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.CloseModalPopup();
              this.GetAllData();
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          });
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    
  }

  openDatePicker(event: any) {
    event.target.showPicker();   
  }


  trackById(index: number, item: any) {
    return item?.InspectionConsentID ?? index;
  }

  onSort(column: string) {
    // toggle direction
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.ConsentData.sort((a: any, b: any) => {
      const aVal = this.toComparable(a, column);
      const bVal = this.toComparable(b, column);
      if (aVal === null || aVal === '') return (bVal === null || bVal === '') ? 0 : (this.sortDirection === 'asc' ? -1 : 1);
      if (bVal === null || bVal === '') return (this.sortDirection === 'asc' ? 1 : -1);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const sa = String(aVal).toLowerCase();
      const sb = String(bVal).toLowerCase();
      return this.sortDirection === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }

  private toComparable(row: any, column: string): string | number | null {
    if (!row) return null;
    if (column === 'consentTypeID') {
      const label = this.getConsentTypeLabel(row.consentTypeID);
      return label ? label.toLowerCase() : '';
    }

    const val = row[column];
    if (val === null || val === undefined || val === '') return '';
    if (column.toLowerCase().includes('date')) {
      const ts = this.parseDateToTimestamp(val);
      return ts !== null ? ts : String(val).toLowerCase();
    }
    if (!isNaN(Number(val))) {
      return Number(val);
    }

    return String(val).toLowerCase();
  }

  private getConsentTypeLabel(id: any): string {
    if (id === null || id === undefined) return '';
    const s = String(id);
    if (s === '1') return 'Planned (Affiliation)';
    if (s === '3') return 'General Inspection (Planned)';
    return '';
  }

  private parseDateToTimestamp(value: any): number | null {
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'number' && !isNaN(value)) return value;

    if (typeof value === 'string') {
      const v = value.trim();
      const ddmmyyyy = /^\d{2}\/\d{2}\/\d{4}$/.test(v);
      if (ddmmyyyy) {
        const [d, m, y] = v.split('/');
        const t = Date.parse(`${y}-${m}-${d}`);
        return isNaN(t) ? null : t;
      }
      const t2 = Date.parse(v);
      return isNaN(t2) ? null : t2;
    }

    return null;
  }

  async openOTPModal(status:any) {
    let dymsg='';
    if(status==1){
      dymsg='Submit';
    }
    else{
      dymsg='Decline';
    }

    if (!this.UpdateConsentRequest.DocConsent || this.UpdateConsentRequest.DocConsent === '') {
      this.toastr.error('Please upload the required document.');
      return;
    }
    if(this.consentForm.invalid){
      this.toastr.error('Please fill all mandatory fields !');
      return;
    }

    this.Swal2.Confirmation(`Are you sure you want to ${dymsg} ?`,
      async (result: any) => {
        if (result.isConfirmed) {
          this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

          // await for open model
          await this.childComponent.OpenOTPPopup();

          // await OTP verification
          // await this.childComponent.waitForVerification();
          let isVerified = false;

          const timeout = new Promise<void>((resolve) => {
            setTimeout(() => {
              if (!isVerified) {
                console.log('OTP timeout');
                // optional: close popup
                this.childComponent.CloseOTPModal?.();
                resolve();
              }
            }, 60000);
          });

          const verify = this.childComponent.waitForVerification().then(() => {
            isVerified = true;
          });

          await Promise.race([verify, timeout]);

          if (isVerified) {         
            await this.onSubmitConsent(status);
          } else {
            alert('OTP verification timeout');
          }

        }
      });
  }


  async openOTPModal1(InspectionConsentID:number) {
   // debugger;
    this.Swal2.Confirmation(`Are you sure you want to Pay ?`,
      async (result: any) => {
        if (result.isConfirmed) {
          this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

          // await for open model
          await this.childComponent.OpenOTPPopup();

          // await OTP verification
          // await this.childComponent.waitForVerification();
          let isVerified = false;

          const timeout = new Promise<void>((resolve) => {
            setTimeout(() => {
              if (!isVerified) {
                console.log('OTP timeout');
                // optional: close popup
                this.childComponent.CloseOTPModal?.();
                resolve();
              }
            }, 60000);
          });

          const verify = this.childComponent.waitForVerification().then(() => {
            isVerified = true;
          });

          await Promise.race([verify, timeout]);

          if (isVerified) {         
            await this.submitPayment(InspectionConsentID);
          } else {
            alert('OTP verification timeout');
          }

        }
      });
  }

  async submitPayment(InspectionConsentID:number) {
    await this.ViewForPayment(InspectionConsentID);
    debugger
    this.totalAmount = this.UpdateConsentRequest.Amount ?? 0;
    this.emitraRequest = new EmitraRequestDetails();
    // this.studentDetailsModel = new StudentDetailsModel()
    // if (this.GetStudentDetails.some(f => f.IsSelected == true)) {
    //   this.GetStudentDetails.filter(f => f.IsSelected == true).forEach(item => {
    //     this.totalAmount += Number(item.FeeAmount);
    //     this.emitraRequest.StudentFeesTransactionItems.push(
    //       {
    //         itemAmount: Number(item.FeeAmount ?? 0),
    //         status: item.ExamStudentStatus,
    //         transactionApplicationID: item.StudentExamPaperID,
    //         tranSemesterID: item.SemesterID
    //       } as StudentFeesTransactionItems);

    //   });

      if (this.totalAmount > 0) {
        var message = "You are about to pay " + this.totalAmount + " for your fee.Would you like to proceed ? ";
        // confirm
        this.Swal2.Confirmation(message, async (result: any) => {
          //confirmed btn click
          if (result.isConfirmed) {
            ;

            this.emitraRequest.Amount = Number(this.totalAmount);
            // this.emitraRequest.ApplicationIdEnc = this.studentDetailsModel?.StudentExamID?.toString() 
            this.emitraRequest.ServiceID = this.UpdateConsentRequest.ServiceID?.toString()?? '';
            this.emitraRequest.ID = this.UpdateConsentRequest.ID ?? 0;
            this.emitraRequest.UserName = this.sSOLoginDataModel.DisplayName;
            this.emitraRequest.MobileNo = this.sSOLoginDataModel.Mobileno;
            this.emitraRequest.StudentID = this.sSOLoginDataModel.UserID;
            this.emitraRequest.SsoID=this.sSOLoginDataModel.SSOID;
            // this.emitraRequest.SemesterID = this.studentDetailsModel.SemesterID;
            this.emitraRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            this.emitraRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
            this.emitraRequest.InstituteID=this.sSOLoginDataModel.InstituteID;
            this.emitraRequest.InspectionConsentID=this.UpdateConsentRequest.InspectionConsentID;
            // this.emitraRequest.ExamStudentStatus = enumExamStudentStatus.Revaluation;
            this.emitraRequest.FeeFor = "InspectionFee";
            this.emitraRequest.USEREMAIL = this.sSOLoginDataModel.Mailofficial ? this.sSOLoginDataModel.Mailpersonal:"";
            //common
           
            this.emitraRequest.IsKiosk = false;
            //this.GetDateDataList();
            this.loaderService.requestStarted();
            try {
              await this.emitraPaymentService.InspectionFeePayment_Principle(this.emitraRequest)
                .then(async (data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  if (data.State == EnumStatus.Success) {
                    this.PaymentStatus=true;
                    await this.RedirectEmitraPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
                  }
                  else {
                    this.toastr.error(data.ErrorMessage)
                  }
                })
            }
            catch (ex) { console.log(ex) }
            finally {
              setTimeout(() => {
                this.loaderService.requestEnded();
              }, 200);
            }
          }
        });
      }
      else {
        this.toastr.warning('Payment amount should be greater then 0')
      }
    // }
    // else {
    //   this.toastr.error('Please select atleast one subject..');
    // }

  }

  RedirectEmitraPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pServiceURL);

    //Hidden Encripted Data
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);

    //Hidden Service ID
    var hiddenFieldService = document.createElement("input");
    hiddenFieldService.setAttribute("type", "hidden");
    hiddenFieldService.setAttribute("name", "SERVICEID");
    hiddenFieldService.setAttribute("value", this.emitraRequest.ServiceID);
    form.appendChild(hiddenFieldService);
    //Hidden Service ID
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

}
