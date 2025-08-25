import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { RoleSearchModel, RoleMasterDataModel } from '../../Models/RoleMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { RevaluationModel, StudentDetailsByRollNoModel } from '../../Models/RevaluationModel';
import { RevaluationService } from '../../Services/Revaluation/revaluation.service';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../Common/appsetting.service';
import { enumExamStudentStatus, EnumStatus } from '../../Common/GlobalConstants';
import { MatStepper } from '@angular/material/stepper';
import { EmitraRequestDetails, StudentFeesTransactionItems, TransactionStatusDataModel } from '../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../Services/EmitraPayment/emitra-payment.service';
import { StudentDetailsModel } from '../../Models/StudentDetailsModel';
import { DateConfigurationModel } from '../../Models/DateConfigurationDataModels';
import { DateConfigService } from '../../Services/DateConfiguration/date-configuration.service';

@Component({
  selector: 'app-revaluation',
  templateUrl: './revaluation.component.html',
  styleUrls: ['./revaluation.component.css'],
  standalone: false
})
export class RevaluationComponent implements AfterViewInit {
  rollDobSectionVisible: boolean = true;
  studentDetailsSectionVisible: boolean = false;
  paymentSectionVisible: boolean = false;
  public AllInTableSelect: boolean = false;
  public searchRequest = new RevaluationModel();
  public Request = new StudentDetailsByRollNoModel();
  emitraRequest = new EmitraRequestDetails();
  sSOLoginDataModel = new SSOLoginDataModel();
  studentDetailsModel = new StudentDetailsModel();
  public dateConfiguration = new DateConfigurationModel()
  isStep2Disabled: boolean=false;
  isStep3Disabled: boolean= false;


  public transactionStatusDataModel = new TransactionStatusDataModel();
  public totalAmount: number = 0;
  selectedCount: number = 0;
  selectedSubjects: any[] = [];
  StudentSemesterDetails: any[] = [];
  GetStudentDetails: any[] = [];
  public AdmissionDateList: any = [];
  public showFeeButton: boolean = false;
  @ViewChild('stepper') stepper!: MatStepper;
  State: any;
  Message: any;
  ErrorMessage: any;
  toastrService: any;

  constructor(private commonFunctionService: CommonFunctionService,
    private revaluationService: RevaluationService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private sweetAlert2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private emitraPaymentService: EmitraPaymentService,
    private cdr: ChangeDetectorRef,
    private dateMasterService: DateConfigService,
    private Router: Router
  ) { }

  ngAfterViewInit(): void {

  }


  async submitRollDob(stepper: MatStepper): Promise<void> {
    try {

      if (!this.searchRequest.RollNo || !this.searchRequest.DOB) {
        this.toastr.error('Please fill in both Roll Number and Date of Birth.');
        return;  // Exit the function if validation fails
      }
      await this.revaluationService.GetDetails(this.searchRequest).then((data: any) => {

        if (data.State == EnumStatus.Success) {

          this.Request = data['Data'][0];

          if (!this.Request.IsReval) {
            this.Request.StudentName = data['Data'][0]['StudentName']
            this.StudentSemesterDetails = data['Data']
            this.GetDateDataList();
            this.switchSection('studentDetails');
            //go to next Step
            stepper.next();
          }
          else {
            this.toastr.error('you already applied for reval.');
          }
        }
        else {
          this.toastr.error('No Record Found.');
        }

      });

    } catch (error) {
      console.error('Error fetching student details:', error);
      this.toastr.error('An error occurred while fetching student details. Please try again later.');
    }
  }


  async GetRevalation(stepper: MatStepper, row: any): Promise<void> {
    try {
      console.log(row, "dadadadadda")
     
      await this.revaluationService.GetRevalation(row).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.state !== EnumStatus.Error) {

          this.GetStudentDetails = data['Data']
          console.log(this.GetStudentDetails, "deeeemoooon")
          console.log(data, 'hhhhh');
          this.switchSection('payment');
        } else {
          this.toastr.error('Invalid Roll Number or Date of Birth.');
        }
      });
      stepper.next();
    } catch (error) {
      console.error('Error fetching student details:', error);
      this.toastr.error('An error occurred while fetching student details. Please try again later.');
    }
  }

  //onCheckboxChange(row: any) {
  //  
  //  var selectedCount = this.GetStudentDetails.filter((f: any) => f.IsSelected == true).length;
  //  // Prevent selection if 3 items are already selected
  //  if (selectedCount > 3)
  //  {

  //    row.IsSelected = false;  // Unselect the current checkbox
  //    this.cdr.detectChanges();
  //    this.toastr.error('You can only select up to 3 subjects.');
  //  }
  //}

  onCheckboxChange(row: any) {
    
    var selectedCount = this.GetStudentDetails.filter((f: any) => f.IsSelected).length;



    if (selectedCount > 3) {
      setTimeout(() => {
        row.IsSelected = false; // Uncheck the checkbox
        this.toastr.error('You can only select up to 3 subjects for revaluation.');
      });
    }
  }



  async MultiPayment() {

    this.totalAmount = 0;
    this.emitraRequest = new EmitraRequestDetails();
    this.studentDetailsModel = new StudentDetailsModel()
    if (this.GetStudentDetails.some(f => f.IsSelected == true)) {
      this.GetStudentDetails.filter(f => f.IsSelected == true).forEach(item => {
        this.totalAmount += Number(item.FeeAmount);
        this.emitraRequest.StudentFeesTransactionItems.push(
          {
            itemAmount: Number(item.FeeAmount ?? 0),
            status: item.ExamStudentStatus,
            transactionApplicationID: item.StudentExamPaperID,
            tranSemesterID: item.SemesterID
          } as StudentFeesTransactionItems);

      });

      //this.GetStudentDetails
      //  .filter(f => f.IsSelected)
      //  .map((student, index) => {
      //    if (index === 0) {
      //      this.emitraRequest.SsoID = student.SSOID;
      //    }
      //  });

      if (this.totalAmount > 0) {
        var message = "You are about to pay " + this.totalAmount + " for your fee.Would you like to proceed ? ";
        // confirm
        this.sweetAlert2.Confirmation(message, async (result: any) => {
          //confirmed btn click
          if (result.isConfirmed) {
            ;
            this.studentDetailsModel = this.GetStudentDetails.filter(f => f.IsSelected == true)[0];
            //Set Parameters for emitra
            this.emitraRequest.Amount = Number(this.totalAmount);
            this.emitraRequest.ApplicationIdEnc = this.studentDetailsModel?.StudentExamID?.toString();
            this.emitraRequest.ServiceID = this.studentDetailsModel.ServiceID?.toString();
            this.emitraRequest.ID = this.studentDetailsModel.ID ?? 0;
            this.emitraRequest.UserName = this.studentDetailsModel.StudentName;
            this.emitraRequest.MobileNo = this.studentDetailsModel.MobileNo;
            this.emitraRequest.StudentID = this.studentDetailsModel.StudentID;
            this.emitraRequest.SemesterID = this.studentDetailsModel.SemesterID;
            this.emitraRequest.DepartmentID = this.studentDetailsModel.DepartmentID;
            this.emitraRequest.CourseTypeID = this.studentDetailsModel.CourseTypeID;
            this.emitraRequest.ExamStudentStatus = enumExamStudentStatus.Revaluation;
            this.emitraRequest.FeeFor = "RevalFee";
            //common
           
            this.emitraRequest.IsKiosk = false;
            //this.GetDateDataList();
            this.loaderService.requestStarted();
            try {
              await this.emitraPaymentService.EmitraPayment(this.emitraRequest)
                .then(async (data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  this.State = data['State'];
                  this.Message = data['SuccessMessage'];
                  this.ErrorMessage = data['ErrorMessage'];
                  if (data.State == EnumStatus.Success) {
                    await this.RedirectEmitraPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
                  }
                  else {
                    this.toastrService.error(this.ErrorMessage)
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
        this.toastrService.warning('Payment amount is greater then 0')
      }
    }
    else {
      this.toastr.error('Please select atleast one subject..');
    }

  }
  async EmitraPaymentCheckStatus(item: StudentDetailsModel) { console.log(item); }
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





  proceedToPayment(): void {
    this.switchSection('payment');
  }

  // Method to handle "Pay Now" button click
  payNow(): void {
    if (this.selectedSubjects.length === 0) {
      this.toastr.error('Please select at least one subject for revaluation.');
      return;
    }
    this.toastr.success(`Payment successful for ${this.selectedSubjects.length} subject(s).`);
    // Reset sections for a new operation
    //this.resetSections();
  }

  // Utility method to switch sections
  private switchSection(section: string): void {
    if (section === 'rollDob') {
      this.rollDobSectionVisible = true;
      this.studentDetailsSectionVisible = false;
      this.paymentSectionVisible = false;
    } else if (section === 'studentDetails') {
      this.rollDobSectionVisible = true;
      this.studentDetailsSectionVisible = true;
      this.paymentSectionVisible = false;
    } else if (section === 'payment') {
      this.rollDobSectionVisible = true;
      this.studentDetailsSectionVisible = true;
      this.paymentSectionVisible = true;
    }
  }

  // Utility method to reset all sections
  //private resetSections(): void {
  //  this.rollNumber = '';
  //  this.dob = '';
  //  this.selectedSubjects = [];
  //  this.switchSection('rollDob');
  //}

  // Added on 2025-01-25 #Pradeep 
  async GetDateDataList() {
    ;
    try {
      this.dateConfiguration.DepartmentID = this.Request.DepartmentID;
      this.dateConfiguration.CourseTypeID = this.Request.CourseTypeID;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel.SSOID;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AdmissionDateList = data['Data'];
          const today = new Date();
          this.AdmissionDateList.filter((x: any) => {
            if (new Date(x.To_Date) > today && x.DepartmentID == this.Request.DepartmentID && x.CourseTypeID == this.Request.CourseTypeID && x.TypeID == 15) {
              this.showFeeButton = true;
            }
          })
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async CheckPaymentSataus() {
    try {
      

      this.studentDetailsModel = this.GetStudentDetails[0];


      this.transactionStatusDataModel.TransactionID = this.studentDetailsModel.TransactionID
      this.transactionStatusDataModel.DepartmentID = this.studentDetailsModel.DepartmentID;
      this.transactionStatusDataModel.PRN = this.studentDetailsModel.PRN;
      this.transactionStatusDataModel.ServiceID = this.studentDetailsModel.ServiceID;


      await this.emitraPaymentService.GetTransactionStatus(this.transactionStatusDataModel)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['SuccessMessage'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            if (data.Data?.STATUS == 'SUCCESS' || data.Data?.STATUS == 'Success') {
              if (data.Data?.PRN) {
                window.open(`/PaymentStatus?TransID=${data.Data.PRN}`, "_self")
              }
            }
            else {
              this.toastr.error(this.Message)
            }
          }
          else {
            this.toastr.error(this.ErrorMessage)
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



}
