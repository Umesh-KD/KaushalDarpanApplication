import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { ITIFeeDataModels, ITIFeeSearchModel } from '../../../Models/ITIFeeDataModels';
import { ItiFeeService } from '../../../Services/iti-fee/iti-fee.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
    selector: 'app-iti-fee',
    templateUrl: './iti-fee.component.html',
    styleUrls: ['./iti-fee.component.css'],
    standalone: false
})
export class ITIFeeComponent {
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  public TradeId: number | null = null;
  public TradeTypesList: any = [];
  request = new ITIFeeDataModels();
  requestSearch = new ITIFeeSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public ItiFeeID: number | null = null;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ITIFeeServices: ItiFeeService,
    private toastr: ToastrService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) { }


  async ngOnInit() {
    
    this.groupForm = this.fb.group({

      txtAdmissionFee: ['', Validators.required],
      txtApplicationProcessingFee: ['', Validators.required],
      txtAppFormFeeGen: ['', Validators.required],
      txtAppFormFeeSc: ['', Validators.required],
      txtAppFormFeeSt: ['', Validators.required],
      txtAppFormFeeObc: ['', Validators.required],
      txtAppFormFeeMbc: ['', Validators.required],
      txtAcademicYear:['',Validators.required],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   // console.log(this.sSOLoginDataModel);
    //alert(this.sSOLoginDataModel.EndTermID);
    this.requestSearch.AcademicYear = this.sSOLoginDataModel.EndTermID;
    this.request.AcademicYear = this.sSOLoginDataModel.EndTermID;

    await this.GetByID(this.request.AcademicYear)
  }

  get () { return this.groupForm.controls; }

  GenerateOTP_save() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.SaveData();
    })
  }

  async SaveData() {
    
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {

      await this.ITIFeeServices.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.ResetControl();
            this.toastr.success(this.Message)
            this.GetByID(this.request.AcademicYear)
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
        this.isLoading = false;

      }, 200);
    }
  }
  async ResetControl() {
    this.isSubmitted = false;
    this.request = new ITIFeeDataModels
    this.groupForm.reset();
    // Reset form values if necessary
    this.groupForm.patchValue({

      code: '',

    });
  }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.ITIFeeServices.GetByID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if(data.Data !== null){
          this.request = data.Data;
        }
        console.log(this.request, "request")
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
 


}
