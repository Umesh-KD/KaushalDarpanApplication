import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumConfigurationType, EnumFeeFor, EnumRole, EnumStatus, EnumUserType } from '../../../Common/GlobalConstants';
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
  public DepartmentList: any = [];
  public FeesAmount: any = [];
  public SemesterMasterList: any[] = [];
  public PaymentDetailtList: any = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  emitraRequest = new EmitraRequestDetails();
  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private emitraPaymentService: EmitraPaymentService,
    private routers: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.StudentName = this.sSOLoginDataModel.DisplayName
    this.request.StudentID = this.sSOLoginDataModel.StudentID
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GrievanceFormGroup = this.formBuilder.group(
      {
        ddlDocumentID: ['', [DropdownValidators]],
        SemesterID: ['', [DropdownValidators]],
        ddlDepartmentID: ['', [DropdownValidators]],
        ApplicationNo: [''],
        FeeAmount: [''],
      })
    //this.loadDropdownData('QueryFor');
    await this.GetSemesterMatserDDL();
    //this.ShowAllData();
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

  FeeAmount(MasterCode: string): void {
    
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      
      switch (MasterCode) {
        case 'DuplicateDoc':
          this.FeesAmount = data['Data'];
          this.request.FeeAmount = this.FeesAmount[0].FeeAmount;
          break;
        default:
          break;
      }
    });
  }

  async GetSemesterMatserDDL() {
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


  async PayApplicationFees() {
    
    this.emitraRequest = new EmitraRequestDetails();
    //Set Parameters for emitra
    this.emitraRequest.Amount = Number(this.request.FeeAmount);
    this.emitraRequest.ApplicationIdEnc = this.request.ApplicationID.toString();
    this.emitraRequest.ServiceID = this.request.ServiceID.toString();
    this.emitraRequest.ID = this.request?.UniqueServiceID ?? 0;
    this.emitraRequest.UserName = this.request.StudentName;
    this.emitraRequest.MobileNo = this.request.MobileNo;
    this.emitraRequest.StudentID = this.request.StudentID;
    this.emitraRequest.SemesterID = 0;
    this.emitraRequest.ExamStudentStatus = 0;
    this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
    this.emitraRequest.DepartmentID = this.request.DepartmentID;
    this.emitraRequest.CourseTypeID = this.request.CourseTypeID;
    this.emitraRequest.TypeID = EnumConfigurationType.DuplicateDocument;
    this.emitraRequest.FeeFor = EnumFeeFor.DuplicateDocument;

    this.emitraRequest.DepartmentID = this.request.DepartmentID;;
    if (this.sSOLoginDataModel.RoleID == EnumRole.Student || this.sSOLoginDataModel.UserType == EnumUserType.KIOSK) {
      this.emitraRequest.IsKiosk = true;
    }



    this.loaderService.requestStarted();
    try {
      await this.emitraPaymentService.EmitraApplicationPayment(this.emitraRequest)
        .then(async (data: any) => {
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
