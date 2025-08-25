import { Component } from '@angular/core';
import { PaymentServiceDataModel } from '../../../Models/PaymentServiceDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { PaymentServiceService } from '../../../Services/PaymentService/payment-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-payment-service',
  standalone: false,
  templateUrl: './add-payment-service.component.html',
  styleUrl: './add-payment-service.component.css',
})
export class AddPaymentServiceComponent {
  ssoLoginDataModel = new SSOLoginDataModel();
  request = new PaymentServiceDataModel();
  PaymentServiceForm!: FormGroup;
  isSubmitted: boolean = false;
  public CourseTypeList: any = [];
  ExamStudentStatusDDLList: any = []

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService,
    private paymentService: PaymentServiceService,
    private toastr: ToastrService,
  ) {}

  async ngOnInit() {
    this.PaymentServiceForm = this.fb.group({
      SchemeId: ['', Validators.required],
      ServiceName: ['', Validators.required],
      ServiceId: ['', Validators.required],
      SubServiceId: ['', Validators.required],

      MerchantCode: ['', Validators.required],
      RevenueHead: ['', Validators.required],
      CommType: ['', Validators.required],
      OfficeCode: ['', Validators.required],

      ServiceURL: ['', Validators.required],
      EncryptionKey: ['', Validators.required],
      VerifyURL: ['', Validators.required],
      Flag: ['', Validators.required],

      IsActive: ['', ],
      ViewName: ['', Validators.required],
      ControllerName: ['', Validators.required],
      JanaadhaarSchemeCode: ['', Validators.required],

      IsLive: ['', ],
      IsKiosk: ['', ],
      CHECKSUMKEY: ['', Validators.required],
      REDIRECTURL: ['', Validators.required],
      WebServiceURL: ['', Validators.required],

      SuccessFailedURL: ['', Validators.required],
      SuccessURL: ['', Validators.required],
      ExamStudentStatus: ['', [DropdownValidators]],
      CourseType: ['', [DropdownValidators]],
    });
    this.ssoLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.ssoLoginDataModel);
    this.request.UserID = this.ssoLoginDataModel.UserID
    this.request.DepartmentID = this.ssoLoginDataModel.DepartmentID
    this.GetCourseTypeData();
  }

  get paymentServiceForm() { return this.PaymentServiceForm.controls; }

  async SaveData() {
    this.isSubmitted = true
    if(this.PaymentServiceForm.invalid) return
    try {
      this.loaderService.requestStarted();
      await this.paymentService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.ResetControl();
            this.isSubmitted = false;
          }
        }, error => console.error(error));

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
  ResetControl() {
    this.request = new PaymentServiceDataModel()
  }

  async GetCourseTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetStreamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseTypeList = data['Data'];
          console.log("CourseTypeList",this.CourseTypeList)
        }, error => console.error(error));

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
}
