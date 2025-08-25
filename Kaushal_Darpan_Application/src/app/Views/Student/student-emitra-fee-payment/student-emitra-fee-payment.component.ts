
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumDepartment, EnumFeeFor, EnumStatus, GlobalConstants, enumExamStudentStatus } from '../../../Common/GlobalConstants';
import { Component, OnInit } from '@angular/core';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { StudentService } from '../../../Services/Student/student.service';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EmitraRequestDetails, StudentFeesTransactionItems } from '../../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
@Component({
  selector: 'app-student-emitra-fee-payment',
  templateUrl: './student-emitra-fee-payment.component.html',
  styleUrls: ['./student-emitra-fee-payment.component.css'],
  standalone: false
})
export class StudentEmitraFeePaymentComponent implements OnInit {
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: any = false;
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public StudentDetailsModelList: StudentDetailsModel[] = [];
  public searchRequest = new StudentSearchModel();
  public isShowGrid: boolean = false;
  emitraRequest = new EmitraRequestDetails();
  public OTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudenetTranList: [] = [];
  studentDetailsModel = new StudentDetailsModel();
  //Modal Boostrap.
  public searchssoform!: FormGroup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public totalAmount: number = 0;
  public enumExamStudentStatus = enumExamStudentStatus;
  public SemesterName: String = ''
  public StudentSubjectList: any[] = [];
  public isSubmitted: boolean = false
  public isShowSelected: boolean = false;
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  constructor(private loaderService: LoaderService, private commonservice: CommonFunctionService,
    private studentService: StudentService, private modalService: NgbModal, private toastrService: ToastrService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService
  ) { }

  async ngOnInit() {

    this.searchssoform = this.formBuilder.group({
      txtApplicationNo: ['', Validators.required],
      txtMobileNo: ['', Validators.required],
      DOB: ['', Validators.required],

    })



    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //
    await this.GetStreamMaster();
    await this.GetSemesterMaster();

    this.StudentDetailsModelList.forEach(row => {
      row.IsSelected = true; // Set all checkboxes to be pre-selected
    });
  }
 

  get _searchssoform() { return this.searchssoform.controls; }


  async onSearchClick() { await this.GetAllDataActionWise(); }

  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.isShowGrid = false;
    this.StudentDetailsModelList = [];
    this.studentDetailsModel = new StudentDetailsModel();
  }
  async GetStreamMaster() {
    this.StreamMasterList = [];
    try {
      this.loaderService.requestStarted();
      await this.commonservice.StreamMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StreamMasterList = data['Data'];
          }
          else {

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
  async GetSemesterMaster() {
    this.SemesterList = [];
    try {
      this.loaderService.requestStarted();

      await this.commonservice.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.SemesterList = data['Data'];
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


  async GetAllDataActionWise() {
    this.isSubmitted = true
    if (this.searchssoform.invalid) {
      return
    }
    this.isShowGrid = true;
    this.searchRequest.action = "_PendingFeesForEmitra";
    this.searchRequest.MobileNumber == this.searchRequest.MobileNumber?.trim();
    this.searchRequest.ApplicationNo == this.searchRequest.ApplicationNo?.trim();
    this.searchRequest.DOB == this.searchRequest.DOB?.trim();
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();
      await this.studentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];

            if (this.StudentDetailsModelList.length > 1) {
              this.isShowSelected = this.StudentDetailsModelList.every(f =>
                [enumExamStudentStatus.VerifiedForExamination].includes(f.ExamStudentStatus)
              );

            }
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


  async PayFees(item: any) { }

  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if (this.OTP == GlobalConstants.DefaultOTP) {
        try {
          this.searchRequest.studentId = this.studentDetailsModel.StudentID;
          this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;

          this.loaderService.requestStarted();
          await this.studentService.UpdateStudentSsoMapping(this.searchRequest)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success) {
                this.toastrService.success('Student Mapped Successfully');

              }
              else {

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
        this.toastrService.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastrService.warning('Please Enter OTP');
    }
  }

  //Start Section Model
  async openModalGenerateOTP(content: any, item: StudentDetailsModel) {
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = item.MobileNo;
    this.studentDetailsModel = item;
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
  async openModal(content: any, item: StudentDetailsModel) {
    this.SemesterName = item.Semester;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.searchRequest.action = '_GetSemeterWiseSubject';
    this.searchRequest.studentId = item.StudentID;
    this.searchRequest.SemesterID = item.SemesterID;

    await this.GetStudentDeatilsByAction()

  }
  //Modal Section END

  async GetStudentDeatilsByAction() {
    this.StudentSubjectList = [];
    try {
      this.loaderService.requestStarted();
      await this.studentService.GetStudentDeatilsByAction(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudentSubjectList = data['Data'];
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
  async GetTransactionDetailsSemesterWise(content: any, item: StudentDetailsModel) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.StudenetTranList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.SemesterID = item.SemesterID;
      this.searchRequest.studentId = item.StudentID;

      this.searchRequest.action = '_GetTransactionDetailsSemesterWise';
      await this.emitraPaymentService.GetTransactionDetailsActionWise(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudenetTranList = data['Data'];
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
  async PayEnrollmentFee(item: StudentDetailsModel) {
    this.emitraRequest = new EmitraRequestDetails();
    //Set Parameters for emitra
    this.emitraRequest.Amount = Number(item.FeeAmount);
    this.emitraRequest.ApplicationIdEnc = item.StudentSemesterID.toString();
    this.emitraRequest.ServiceID = item.ServiceID.toString();
    this.emitraRequest.UserName = item.StudentName;
    this.emitraRequest.MobileNo = item.MobileNo;
    this.emitraRequest.StudentID = item.StudentID;
    this.emitraRequest.SemesterID = item.SemesterID;
    this.emitraRequest.ExamStudentStatus = item.ExamStudentStatus;
    this.emitraRequest.DepartmentID = EnumDepartment.BTER;
    //student details
    this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
    this.emitraRequest.IsKiosk = true;
    this.emitraRequest.FeeFor = EnumFeeFor.EnrollMentFee;


    this.emitraRequest.StudentFeesTransactionItems.push({
      itemAmount: Number(item.FeeAmount ?? 0),
      status: item.ExamStudentStatus,
      transactionApplicationID: item.StudentSemesterID,
      tranSemesterID: item.SemesterID
    } as StudentFeesTransactionItems);


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


  async PayExamFee(item: StudentDetailsModel, IsMultiPayment = false)
  {

    console.log(item)
    //validate function
    const isValid = await this.ValidateExamDate(item.CourseType, item.FinancialYearID, item.EndTermID);
    if (isValid)
    {

      this.emitraRequest = new EmitraRequestDetails();
      //Set Parameters for emitra
      this.emitraRequest.Amount = Number(item.FeeAmount);
      this.emitraRequest.ApplicationIdEnc = item.StudentSemesterID.toString();
      this.emitraRequest.ServiceID = item.ServiceID.toString();
      this.emitraRequest.UserName = item.StudentName;
      this.emitraRequest.MobileNo = item.MobileNo;
      this.emitraRequest.StudentID = item.StudentID;
      this.emitraRequest.SemesterID = item.SemesterID;
      this.emitraRequest.ExamStudentStatus = item.ExamStudentStatus;
      this.emitraRequest.DepartmentID = EnumDepartment.BTER;

      //common
      this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
      this.emitraRequest.IsKiosk = true;

      this.emitraRequest.FeeFor = EnumFeeFor.ExamFee;
      this.emitraRequest.ID = item.ID;

      //multiple data handel
      this.emitraRequest.StudentFeesTransactionItems.push({
        itemAmount: Number(item.FeeAmount ?? 0),
        status: item.ExamStudentStatus,
        transactionApplicationID: item.StudentSemesterID,
        tranSemesterID: item.SemesterID
      } as StudentFeesTransactionItems);


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
    else
    {
      this.sweetAlert2.Info('Exam Fee Date Is Not Open Yet Please Try Again');
    }
  }
  async MultiPayment()
  {

    
    this.totalAmount = 0;
    this.emitraRequest = new EmitraRequestDetails();
    this.studentDetailsModel = new StudentDetailsModel()
    if (this.StudentDetailsModelList.some(f => f.IsSelected == true))
    {
      this.StudentDetailsModelList.filter(f => f.IsSelected == true).forEach(item =>
      {
        this.totalAmount += Number(item.FeeAmount);
        this.emitraRequest.StudentFeesTransactionItems.push
          ({
            itemAmount: Number(item.FeeAmount ?? 0),
            status: item.ExamStudentStatus,
            transactionApplicationID: item.StudentSemesterID,
            tranSemesterID: item.SemesterID
          } as StudentFeesTransactionItems);
      });

      this.studentDetailsModel = this.StudentDetailsModelList.filter(f => f.IsSelected == true)[0];
      const isValid = await this.ValidateExamDate(this.studentDetailsModel.CourseType, this.studentDetailsModel.FinancialYearID, this.studentDetailsModel.EndTermID);
      if (isValid)
      {

      if (this.totalAmount > 0)
      {
        var message = "You are about to pay " + this.totalAmount + " for your fee.Would you like to proceed ? ";
        // confirm
        this.sweetAlert2.Confirmation(message, async (result: any) => {
          //confirmed btn click
          if (result.isConfirmed) {

         
            //Set Parameters for emitra
            this.emitraRequest.Amount = Number(this.totalAmount);
            this.emitraRequest.ApplicationIdEnc = "0";
            this.emitraRequest.ServiceID = this.studentDetailsModel.ServiceID.toString();
            this.emitraRequest.UserName = this.studentDetailsModel.StudentName;
            this.emitraRequest.MobileNo = this.studentDetailsModel.MobileNo;
            this.emitraRequest.StudentID = this.studentDetailsModel.StudentID;
            this.emitraRequest.SemesterID = this.studentDetailsModel.SemesterID;
            this.emitraRequest.ExamStudentStatus = this.studentDetailsModel.ExamStudentStatus;
            this.emitraRequest.DepartmentID = EnumDepartment.BTER;
            //common
            this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
            this.emitraRequest.IsKiosk = true;
            this.emitraRequest.FeeFor = EnumFeeFor.ExamFee;
            this.emitraRequest.ID = this.studentDetailsModel.ID;
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
      else
      {
        this.sweetAlert2.Info('Exam Fee Date Is Not Open Yet Please Try Again');
    }

  }
  else
    {
      this.toastrService.warning('Please Select Atleast one record ')

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

    //Hidden MERCHANTCODE ID
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  async ValidateExamDate(Eng_NonEng: number=0, FinancialYearID: number=0, EndTermID: number=0): Promise<boolean> {
    try {
      
      const data = {
        DepartmentID: 1,
        CourseTypeId: Eng_NonEng,
        AcademicYearID: FinancialYearID,
        EndTermID: EndTermID,
        Key: "ExaminationFee",
        SSOID: this.sSOLoginDataModel.SSOID
      };

      const response = await this.commonMasterService.GetDateConfigSetting(data);
      const parsedData = JSON.parse(JSON.stringify(response));
      this.DateConfigSetting = parsedData['Data'][0];
      this.MapKeyEng = this.DateConfigSetting.ExaminationFee;
      console.log(this.DateConfigSetting, 'DATAAAAA')

      if (this.MapKeyEng == 1) {
        return true; // Success case
      }
      else
      {
        return false; // Success case
      }
     
    } catch (error)
    {
      console.error(error);
      return false; // Failure case
    }
  }

}
