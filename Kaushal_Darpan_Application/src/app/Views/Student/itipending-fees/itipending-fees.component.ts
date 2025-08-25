import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { EmitraRequestDetails, StudentFeesTransactionItems } from '../../../Models/PaymentDataModel';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumDepartment, enumExamStudentStatus, EnumFeeFor, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StudentService } from '../../../Services/Student/student.service';

@Component({
  selector: 'app-itipending-fees',
  standalone: false,
  
  templateUrl: './itipending-fees.component.html',
  styleUrl: './itipending-fees.component.css'
})
export class ITIPendingFeesComponent implements OnInit {
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: any = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public SemesterName: string = '';

  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new StudentSearchModel();

  public StudentDetailsModelList: StudentDetailsModel[] = [];
  emitraRequest = new EmitraRequestDetails();
  studentDetailsModel = new StudentDetailsModel();

  public Status?: string = 'PendingFees'
  public enumExamStudentStatus = enumExamStudentStatus;
  public StudenetTranList: [] = [];
  public StudentSubjectList: [] = [];
  public isShowSelected: boolean = false;
  public totalAmount: number = 0;
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  constructor(private commonMasterService: CommonFunctionService,
    private studentService: StudentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: ActivatedRoute,
    private emitraPaymentService: EmitraPaymentService,
    private modalService: NgbModal,
    private sweetAlert2: SweetAlert2
  ) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.action = this.Status;
    await this.GetAllData();
  }

  @ViewChild('content') content: ElementRef | any;

  async openModal(content: any, item: StudentDetailsModel)
  {
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
    await this.GetITIStudentDeatilsByAction()

  }

  CloseModal() {
    this.modalService.dismissAll();
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


  async GetAllData() {
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
      this.searchRequest.roleId = this.sSOLoginDataModel.RoleID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this.studentService.ITIGetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success)
          {
            this.StudentDetailsModelList = data['Data'];
            if (this.StudentDetailsModelList.length > 1)
            {
              this.isShowSelected = true;
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


  async GetITIStudentDeatilsByAction() {
    this.StudentSubjectList = [];
    try {
      this.loaderService.requestStarted();
      await this.studentService.GetITIStudentDeatilsByAction(this.searchRequest)
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
      //await this.emitraPaymentService.GetTransactionDetailsActionWise(this.searchRequest)
      await this.studentService.GetITIStudentDeatilsByAction(this.searchRequest)
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

  async PayEnrollmentFee(item: StudentDetailsModel)
  {
    this.emitraRequest = new EmitraRequestDetails();
    //Set Parameters for emitra
    this.emitraRequest.Amount = Number(item.FeeAmount);
    this.emitraRequest.ApplicationIdEnc = item.StudentSemesterID.toString();
    this.emitraRequest.ServiceID = item.ServiceID.toString();
    this.emitraRequest.ID = item.ID;
    this.emitraRequest.UserName = item.StudentName;
    this.emitraRequest.MobileNo = item.MobileNo;
    this.emitraRequest.StudentID = item.StudentID;
    this.emitraRequest.SemesterID = item.SemesterID;
    this.emitraRequest.ExamStudentStatus = item.ExamStudentStatus;
    this.emitraRequest.DepartmentID = item.DepartmentID;
    //student details
    this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;

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
  async PayExamFee1(item: StudentDetailsModel, IsMultiPayment = false)
  {
    ;
    this.emitraRequest = new EmitraRequestDetails();
    //Set Parameters for emitra
    this.emitraRequest.Amount = Number(item.FeeAmount);
    this.emitraRequest.ApplicationIdEnc = item.StudentSemesterID.toString();
    this.emitraRequest.ServiceID = item.ServiceID.toString();
    this.emitraRequest.ID = item.ID;
    this.emitraRequest.UserName = item.StudentName;
    this.emitraRequest.MobileNo = item.MobileNo;
    this.emitraRequest.StudentID = item.StudentID;
    this.emitraRequest.SemesterID = item.SemesterID;
    this.emitraRequest.ExamStudentStatus = item.ExamStudentStatus;
    this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
    this.emitraRequest.DepartmentID = item.DepartmentID;

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





  async PayExamFee(item: StudentDetailsModel, IsMultiPayment = false) {

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
      this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
      this.emitraRequest.DepartmentID = EnumDepartment.ITI;
      this.emitraRequest.FeeFor = EnumFeeFor.ExamFee;
      this.emitraRequest.ID = item?.ID ?? 0;
      //multiple data handel
      this.emitraRequest.StudentFeesTransactionItems.push({
        itemAmount: Number(item.FeeAmount ?? 0),
        status: item.ExamStudentStatus,
        transactionApplicationID: item.StudentSemesterID,
        tranSemesterID: item.SemesterID
      } as StudentFeesTransactionItems);


      this.loaderService.requestStarted();
      try {
        await this.emitraPaymentService.EmitraPaymentITI(this.emitraRequest)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['SuccessMessage'];
            this.ErrorMessage = data['ErrorMessage'];
            if (data.State == EnumStatus.Success) {
              await this.RedirectEmitraPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
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
    else {
      this.sweetAlert2.Info('Exam Fee Date Is Not Open Yet Please Try Again');
    }

  }


  async MultiPaymentold()
  {
    this.totalAmount = 0;
    this.emitraRequest = new EmitraRequestDetails();
    this.studentDetailsModel = new StudentDetailsModel()
    if (this.StudentDetailsModelList.some(f => f.IsSelected == true)) {
      this.StudentDetailsModelList.filter(f => f.IsSelected == true).forEach(item => {
        this.totalAmount += Number(item.FeeAmount);
        this.emitraRequest.StudentFeesTransactionItems.push({
          itemAmount: Number(item.FeeAmount ?? 0),
          status: item.ExamStudentStatus,
          transactionApplicationID: item.StudentSemesterID,
          tranSemesterID: item.SemesterID
        } as StudentFeesTransactionItems);

      });

      if (this.totalAmount > 0) {
        var message = "You are about to pay " + this.totalAmount + " for your fee.Would you like to proceed ? ";
        // confirm
        this.sweetAlert2.Confirmation(message, async (result: any) => {
          //confirmed btn click
          if (result.isConfirmed) {

            this.studentDetailsModel = this.StudentDetailsModelList.filter(f => f.IsSelected == true)[0];
            //Set Parameters for emitra
            this.emitraRequest.Amount = Number(this.totalAmount);
            this.emitraRequest.ApplicationIdEnc = "0";
            this.emitraRequest.ServiceID = this.studentDetailsModel.ServiceID.toString();
            this.emitraRequest.UserName = this.studentDetailsModel.StudentName;
            this.emitraRequest.MobileNo = this.studentDetailsModel.MobileNo;
            this.emitraRequest.StudentID = this.studentDetailsModel.StudentID;
            this.emitraRequest.SemesterID = this.studentDetailsModel.SemesterID;
            this.emitraRequest.ExamStudentStatus = this.studentDetailsModel.ExamStudentStatus;
            this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;



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
        });
      }
      else {
        this.toastr.warning('Payment amount is greater then 0')
      }
    }
    else {
      this.toastr.warning('Please Select One Record ')
    }

  }


  async MultiPayment()
  {
    this.totalAmount = 0;
    this.emitraRequest = new EmitraRequestDetails();
    this.studentDetailsModel = new StudentDetailsModel()
    if (this.StudentDetailsModelList.some(f => f.IsSelected == true)) {
      this.StudentDetailsModelList.filter(f => f.IsSelected == true).forEach(item => {
        this.totalAmount += Number(item.FeeAmount);
        this.emitraRequest.StudentFeesTransactionItems.push({
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

              this.studentDetailsModel = this.StudentDetailsModelList.filter(f => f.IsSelected == true)[0];
              //Set Parameters for emitra
              this.emitraRequest.Amount = Number(this.totalAmount);
              this.emitraRequest.ApplicationIdEnc = "0";
              this.emitraRequest.ServiceID = this.studentDetailsModel.ServiceID.toString();
              this.emitraRequest.UserName = this.studentDetailsModel.StudentName;
              this.emitraRequest.MobileNo = this.studentDetailsModel.MobileNo;
              this.emitraRequest.StudentID = this.studentDetailsModel.StudentID;
              this.emitraRequest.SemesterID = this.studentDetailsModel.SemesterID;
              this.emitraRequest.ExamStudentStatus = this.studentDetailsModel.ExamStudentStatus;
              this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
              this.emitraRequest.DepartmentID = EnumDepartment.ITI;
              this.emitraRequest.FeeFor = EnumFeeFor.ExamFee;
              this.emitraRequest.ID = this.studentDetailsModel.ID;
              this.loaderService.requestStarted();
              try {
                await this.emitraPaymentService.EmitraPaymentITI(this.emitraRequest)
                  .then(async (data: any) => {
                    data = JSON.parse(JSON.stringify(data));
                    this.State = data['State'];
                    this.Message = data['SuccessMessage'];
                    this.ErrorMessage = data['ErrorMessage'];
                    if (data.State == EnumStatus.Success) {
                      await this.RedirectEmitraPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
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
          });
        }
        else {
          this.toastr.warning('Payment amount is greater then 0')

        }
      }
      else {
        this.sweetAlert2.Info('Exam Fee Date Is Not Open Yet Please Try Again');

      }
    }
    else {
      this.toastr.warning('Please Select One Record ')

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


  async ValidateExamDate(Eng_NonEng: number = 0, FinancialYearID: number = 0, EndTermID: number = 0): Promise<boolean> {
    try {

      const data =
      {
        DepartmentID: EnumDepartment.ITI,
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
      else {
        return false; // Success case
      }

    } catch (error) {
      console.error(error);
      return false; // Failure case
    }
  }

}
