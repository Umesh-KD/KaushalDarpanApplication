import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumConfigurationType, EnumFeeFor, EnumRole, EnumStatus, EnumUserType, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { GrievanceDataModel, GrivienceReopenModelsDataModel, GrivienceSearchModel, GrivienceResponseDataModel } from '../../../Models/GrievanceData/GrievanceDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { GrievanceService } from '../../../Services/Grievance/grievance.service';
import { SeatMatrixService } from '../../../Services/ITISeatMatrix/seat-matrix.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ApplyDuplicateDocument } from '../../../Models/BTER/ApplyDuplicateDocDataModel';
import { EmitraRequestDetails } from '../../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { ApplyDuplicateDocService } from '../../../Services/ApplyDuplicateDoc/ApplyDuplicateDoc.service';
import {StudentService} from '../../../Services/Student/student.service';
import { DownloadMarksheetSearchModel } from '../../../Models/DownloadMarksheetDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ReportService } from '../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';

@Component({
  selector: 'app-apply-duplicate-doc',
  standalone: false,
  templateUrl: './apply-duplicate-doc.component.html',
  styleUrl: './apply-duplicate-doc.component.css'
})

export class ApplyDuplicateDocComponent implements OnInit {
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  GrievanceFormGroup!: FormGroup;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  public request = new ApplyDuplicateDocument();
  public studentInfo=new StudentSearchModel();
  public DepartmentList: any = [];
  public FeesAmount: any = [];
  public SemesterMasterList: any[] = [];
  public DocumentTypeList: any[] = [];
  public DocumentTypeList1: any[] = [];
  public SessionList:any[]=[];
  public PaymentDetailtList: any = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  emitraRequest = new EmitraRequestDetails();
  public isFormSubmitted: boolean = false;
  public OTP: string = '';
  public MobileNo: string = '';
  public GeneratedOTP:string='';
  public showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  // showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public InstituteMasterDDLList: any = [];
  public departmentFlag: string = 'BTER';
  public saveFlag: number=0;
  public isMarksheet:boolean=false;
  public isMigration:boolean=false;
  public downloadReq = new DownloadMarksheetSearchModel();


  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private emitraPaymentService: EmitraPaymentService,
    private applyDuplicateDocService :  ApplyDuplicateDocService,
    private routers: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private Student:StudentService
  )  { }

  async ngOnInit() {
    this.GrievanceFormGroup = this.formBuilder.group(
      {
        ddlDocumentID: ['', [DropdownValidators]],
        // SemesterID: ['', [DropdownValidators]],
        SemesterID: [''],
        ddlDepartmentID: ['', [DropdownValidators]],
        ApplicationNo: [{value:'',disabled:true}],  
        // ApplicationNo: [{ value: '', disabled: true }]
        FeeAmount: [ { value: '', disabled: true }],
        ddlInstituteID: ['', [DropdownValidators]],
        ddlSessionID:['']
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.StudentName = this.sSOLoginDataModel.DisplayName
    this.request.StudentID = this.sSOLoginDataModel.StudentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID

    //this.loadDropdownData('QueryFor');
    await this.GetDocumentTypeDDL();
    await this.GetSemesterMatserDDL();
    await this.GetStudentDataBy_StudID();

    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
    // debugger;
      data = JSON.parse(JSON.stringify(data));
      console.log(data);
        this.InstituteMasterDDLList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
      })
    //this.ShowAllData();
    await this.GetStudentApplyDuplicateDocumentList();
  }

  get form() { return this.GrievanceFormGroup.controls; }
  // Load data for dropdown based on MasterCode
  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'QueryFor':
          this.DepartmentList = data['Data'];
          break;
        default:
          break;
      }
    });
  }



  ondepartmentChange()
  {
    //debugger;
    if(this.request.DepartmentID==2){
      this.request.DepartmentID=this.sSOLoginDataModel.DepartmentID;
      this.departmentFlag='NodalCenter';
      this.GetInstituteMatserDDL(this.request.DepartmentID);
      this.GrievanceFormGroup.get('ddlInstituteID')?.setValidators([DropdownValidators]);
    }
    else{
      this.departmentFlag='BTER';
      this.GrievanceFormGroup.get('ddlInstituteID')?.clearValidators();
      this.GrievanceFormGroup.get('ddlInstituteID')?.reset();
    }

    this.GrievanceFormGroup.get('ddlInstituteID')?.updateValueAndValidity();
  }
  async GetInstituteMatserDDL(DeptId: number) {
    try {
      this.loaderService.requestStarted();
     await this.commonMasterService.InstituteMaster(DeptId, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.InstituteMasterDDLList = data.Data;
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
  FeeAmount(MasterCode: string):void {
   // debugger
    // 1336 ->marksheet 
    //1337 -> migration
    
    if(this.request.DocumentID==1336)
    {
      this.isMarksheet=true;
      this.isMigration=false;
    }
    else{
      this.isMarksheet=false;
      this.isMigration=true;
    }
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      //debugger
      switch (MasterCode) {
        case 'DuplicateDocStudentWise':
          this.FeesAmount = data['Data'];
          if (this.FeesAmount && this.FeesAmount.length > 0 ) {
            this.request.FeeAmount = this.FeesAmount[0].FeeAmount || 0;
            // this.request.ApplicationNo=this.FeesAmount[0].ApplicationNo;
            // this.request.SemesterID=this.FeesAmount[0].SemesterID;
            this.request.ConfigurationTypeID = this.FeesAmount[0].TypeID || 0;
            // this.GrievanceFormGroup.get('FeeAmount')?.setValue(this.FeesAmount[0].FeeAmount);
            // this.GrievanceFormGroup.get('ApplicationNo')?.setValue(this.FeesAmount[0].ApplicationNo);
            // this.GrievanceFormGroup.get('SemesterID')?.setValue(this.FeesAmount[0].SemesterID);
          }
          break;
        default:
          break;
      }
    });
  }

  async OnSemChange() {
    //debugger
    // 1336 ->marksheet 
    //1337 -> migration
    if(this.request.DocumentID==1336)
    {
      this.isMarksheet=true;
      this.GrievanceFormGroup.get('ddlSessionID')?.setValidators([DropdownValidators]);
    }
    else{
      this.isMarksheet=false;
      this.GrievanceFormGroup.get('ddlSessionID')?.clearValidators();
      this.GrievanceFormGroup.get('ddlSessionID')?.reset();
    }
    this.GrievanceFormGroup.get('ddlSessionID')?.updateValueAndValidity();
    
    if(this.isMarksheet)
    {
          // GetStudentDMarshkeetSession(SemesterID: number=0, DepartmentID: number = 0, StudentID: number = 0) 
        await this.applyDuplicateDocService.GetStudentDMarshkeetSession(this.request.SemesterID ,this.sSOLoginDataModel.StudentID,this.sSOLoginDataModel.DepartmentID).then((data: any) => {       
            data=JSON.parse(JSON.stringify(data));
            console.log(data);
            this.SessionList=data.Data;
            console.log("sessionlist" ,this.SessionList);
              // this.FeesAmount = data['Data'];
              // this.request.FeeAmount = this.FeesAmount[0].FeeAmount;
              // this.request.ApplicationNo=this.FeesAmount[0].ApplicationNo;
              // this.request.SemesterID=this.FeesAmount[0].SemesterID;
              // this.request.ConfigurationTypeID=this.FeesAmount[0].TypeID;
        });

    }

  }

    async openModalGenerateOTP(content: any, item: ApplyDuplicateDocument) {
      //debugger
      // this.refreshValidation();// refresh validation
      this.isFormSubmitted = true;
      // if (this.GrievanceFormGroup.invalid) {
      //   return
      // }
      //category validation
      //if ([1, 111, 152].includes(this.request.TypeID)) {
      //  this.request.CasteCategoryID.
      //}
      this.OTP = '';
      this.MobileNo = GlobalConstants.DefaultMobileNo.length > 0 ? GlobalConstants.DefaultMobileNo : '';//this.sSOLoginDataModel.Mobileno; 9460476972
      this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.MobileNo = this.MobileNo;
      this.request = item;
      await this.SendOTP();
    }
  
      // Helper function to safely stringify errors with circular reference protection
 getCircularReplacer() {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  };
}

    async VerifyOTP() {
       // debugger
        if (this.OTP.length > 0) {
          if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
    
            // await this.nonItiValidator();
            const errors: any[] = [];
            // Object.keys(this.FeeConfigurationFromGroup.controls).forEach((key) => {
            //   const controlErrors = this.FeeConfigurationFromGroup.get(key)?.errors;
            //   if (controlErrors) {
            //     Object.keys(controlErrors).forEach((errorKey) => {
            //       errors.push({ control: key, error: errorKey, value: controlErrors[errorKey] });
            //     });
            //   }
            // });
            try {
              console.log(this.GrievanceFormGroup.value);

              if(this.departmentFlag=='NodalCenter'){            
                this.GetInstituteMatserDDL(this.request.DepartmentID);
                this.GrievanceFormGroup.get('ddlInstituteID')?.setValidators([DropdownValidators]);
              }
              else{
                this.GrievanceFormGroup.get('ddlInstituteID')?.clearValidators();
                this.GrievanceFormGroup.get('ddlInstituteID')?.reset();
              }
              
              this.GrievanceFormGroup.get('ddlInstituteID')?.updateValueAndValidity();

              if (this.GrievanceFormGroup.invalid) {
                  Object.keys(this.GrievanceFormGroup.controls).forEach(key => {
                    const control = this.GrievanceFormGroup.get(key);
                    if (control && control.invalid) {
                      console.error(`Field '${key}' is invalid.`);

                      if (control.errors) {
                        Object.keys(control.errors).forEach(errorKey => {
                          // Safely stringify the error value to avoid issues
                          const errorValue = control.errors![errorKey];
                          const errorMessage = (typeof errorValue === 'string')
                            ? errorValue
                            : JSON.stringify(errorValue, this.getCircularReplacer());

                          /*console.error(`  Error: ${errorKey} - ${errorMessage}`);*/
                        });
                      }
                    }
                  });
                return  
              }
        
              const formValues = this.GrievanceFormGroup.value;
              
              this.isLoading = true;
              this.loaderService.requestStarted();
              await this.PayApplicationFees();
              this.isLoading = false;
              this.loaderService.requestEnded();
              this.isFormSubmitted = false;    
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
      //category validation
      this.GeneratedOTP = "";
      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
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


    numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

    formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
 async GetDocumentTypeDDL() {
  //debugger;
    try {
      this.loaderService.requestStarted();
      await this.applyDuplicateDocService.GetApplyDuplicateDocumentTypeList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DocumentTypeList1 = data['Data'];

          console.log("docyment",this.DocumentTypeList);
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



  async GetSemesterMatserDDL() {
    //debugger;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
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


  async GetStudentDataBy_StudID() {
    //debugger;
    try {
      this.studentInfo.StudentID=this.sSOLoginDataModel.StudentID;
      this.studentInfo.DepartmentID=this.sSOLoginDataModel.DepartmentID;
      
      this.loaderService.requestStarted();

      await this.Student.GetStudentDataBy_StudID(this.studentInfo)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          const student = data['Data']?.[0];

          if (student?.ApplicationID) {
            this.request.ApplicationNo = student.ApplicationID;
          } else {
            this.request.ApplicationNo = student?.EnrollmentNo;
          }

          // this.SemesterMasterList = data['Data'];
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

  async GetStudentApplyDuplicateDocumentList() {
   // debugger
    try {
      this.request.StudentID= this.sSOLoginDataModel.StudentID;
      this.loaderService.requestStarted();
      //debugger;
      await this.applyDuplicateDocService.GetApplyDuplicateDocumentList(this.request)
        .then(async (data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.DocumentTypeList = data['Data'];
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
  async proceedToSave() {
   // debugger
    if(!this.isMigration){
      this.GrievanceFormGroup.get('SemesterID')?.setValidators([DropdownValidators]);
    }
    else{
     
      this.GrievanceFormGroup.get('SemesterID')?.clearValidators();
      this.GrievanceFormGroup.get('SemesterID')?.reset();
    }

    this.GrievanceFormGroup.get('SemesterID')?.updateValueAndValidity();
    
    this.loaderService.requestStarted();
    this.isLoading = true; 
    try {
      //  debugger;
       this.request.StudentID= this.sSOLoginDataModel.StudentID;
       this.request.DocumentID= this.GrievanceFormGroup.value.ddlDocumentID;
       this.request.SemesterID= this.GrievanceFormGroup.value.SemesterID;
       this.request.DepartmentID= this.sSOLoginDataModel.DepartmentID; //this.GrievanceFormGroup.value.ddlDepartmentID;
       this.request.InstituteID= this.GrievanceFormGroup.value.ddlInstituteID;
       this.request.ApplicationNo=  this.request.ApplicationNo;//this.GrievanceFormGroup.value.ApplicationNo;
       this.request.FeeAmount= this.request.FeeAmount; //this.GrievanceFormGroup.value.FeeAmount;
       this.request.createdBy= this.sSOLoginDataModel.UserID;
       this.request.modifyBy= this.sSOLoginDataModel.UserID;
       this.request.EndTermID=this.sSOLoginDataModel.EndTermID;
      //  this.request.SessionID=
       this.request.IsActive= true;
       this.request.IsDelete= false;
       this.request.IsPayment= false; 
      await this.applyDuplicateDocService.SaveDuplicateDocumentDetails(this.request)
        .then(async (data: any) => {
          //debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            
            this.saveFlag=1;
          } 
        })

    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  async PayApplicationFees() {
    //debugger;
    await this.proceedToSave();
    if(this.saveFlag == 0){
      return;
    }
    this.emitraRequest = new EmitraRequestDetails();
    //Set Parameters for emitra
    this.emitraRequest.Amount = Number(this.request.FeeAmount);
    this.emitraRequest.ApplicationIdEnc = this.request.ApplicationID.toString();
    this.emitraRequest.ServiceID = (this.request.ServiceID).toString();  //"2920";
    // -- this.request.ServiceID.toString();
    this.emitraRequest.ID = this.request?.UniqueServiceID ?? 0;
    this.emitraRequest.UserName = this.request.StudentName;
    //this.emitraRequest.MobileNo = this.request.MobileNo;
    this.emitraRequest.MobileNo = GlobalConstants.DefaultMobileNo; //this.sSOLoginDataModel.Mobileno;
    this.emitraRequest.StudentID = this.request.StudentID;
    this.emitraRequest.SemesterID = this.GrievanceFormGroup.value.SemesterID?? 0;
    this.emitraRequest.ExamStudentStatus = 0;
    this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
    this.emitraRequest.DepartmentID =  1// this.request.DepartmentID;
    this.emitraRequest.CourseTypeID =  1 //this.request.CourseTypeID;
    this.emitraRequest.TypeID = EnumConfigurationType.DuplicateDocument;
    this.emitraRequest.FeeFor = EnumFeeFor.DuplicateDocument;
    this.emitraRequest.InstituteIDEnc= this.GrievanceFormGroup.value.ddlInstituteID;
    if (this.sSOLoginDataModel.RoleID == EnumRole.Student || this.sSOLoginDataModel.UserType == EnumUserType.KIOSK) {
      this.emitraRequest.IsKiosk = true;
    }     
   // debugger;

    this.loaderService.requestStarted();
    try {
      await this.emitraPaymentService.EnrollmentExaminationFeePayment(this.emitraRequest)
        .then(async (data: any) => {
         // debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {            
            this.PaymentDetailtList = data;
            await this.RedirectEmitraPaymentRequest(data.Data.MERCHANTCODE, data.Data.ENCDATA, data.Data.PaymentRequestURL)
          }
          else {
            let displayMessage = this.Message ?? this.ErrorMessage;
            this.toastr.error(displayMessage)
          }
        })
    }
    catch (ex) {
      console.log(ex)
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  RedirectEmitraPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any) {
    //debugger
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


  // async DownloadMarksheet(row: any) {
  //   try {
  //     debugger;
  //     this.downloadReq.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //     this.downloadReq.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
  //     this.downloadReq.EndTermID = this.sSOLoginDataModel.EndTermID;
  //     this.downloadReq.StudentID = row.Student_Id;
  //     this.downloadReq.SemesterID = row.Semester_ID;
  //     this.downloadReq.ResultTypeID = 1//row.Document_ID;
  //     this.downloadReq.IsRevised = 0; //row.IsRevised;
  //     this.downloadReq.IsReval = false ; //row.IsReval;
  //     console.log(JSON.stringify(this.downloadReq),'SearchRequestData')
  //     const requestArray = [this.downloadReq];
  //     this.loaderService.requestStarted();

  //     await this.reportService.DownloadMarksheet(this.downloadReq)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         console.log(data, "Data");
  //         if (data.State == EnumStatus.Success) {
  //           this.DownloadFile(data.Data, 'file download');
  //         }
  //         else {
  //           this.toastr.error(data.ErrorMessage)
  //           //    data.ErrorMessage
  //         }
  //       }, (error: any) => console.error(error)
  //       );
  //   }
  //   catch (ex) {
  //     console.log(ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  async DownloadDuplicateMarksheet(element: any) {
    //debugger;
    try {
      this.downloadReq.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.downloadReq.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
      this.downloadReq.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.downloadReq.StudentID = element.Student_Id;
      this.downloadReq.SemesterID = element.Semester_ID;
      this.downloadReq.RequestEndTerm=element.RequestEndTerm;
      
      this.downloadReq.ResultTypeID = 1 // element.ResultTypeID;
      this.downloadReq.IsRevised = 0 //element.IsRevised;
      this.downloadReq.IsReval = false; //element.IsReval;
      this.loaderService.requestStarted();

      await this.reportService.DownloadDuplicateMarksheet(this.downloadReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data);
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
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

  // DownloadFile(FileName: string, DownloadfileName: any): void {

  //   const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
  //   // Fetch the file as a blob
  //   this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
  //     const downloadLink = document.createElement('a');
  //     const url = window.URL.createObjectURL(blob);
  //     downloadLink.href = url;
  //     downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
  //     downloadLink.click();
  //     // Clean up the object URL
  //     window.URL.revokeObjectURL(url);
  //   });
  // }

  DownloadFile(fileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${fileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = this.generateFileName('pdf');
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }


  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }
  //async ShowAllData() {
  //  //this.isSubmitted = true;
  //  //alert(this.sSOLoginDataModel.StudentID);
  //  if (this.sSOLoginDataModel.StudentID > 0) {
  //    this.searchRequest.CreatedBy = this.sSOLoginDataModel.StudentID;
  //  }
  //  else {
  //    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
  //  }
  //  try {
  //    this.loaderService.requestStarted();
  //    //await this.grievanceService.GetAllData(this.searchRequest)
  //    await this.grievanceService.GetAllData(this.searchRequest)
  //      .then((data: any) => {
  //        this.ShowGrievanceList = data['Data'];
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State = EnumStatus.Success) {
  //          //this.toastr.success(this.Message)
  //          this.ResetControl();
  //          //this.ShowSeatMetrix();
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      })
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //      this.isLoading = false;

  //    }, 200);
  //  }
  //}

}
