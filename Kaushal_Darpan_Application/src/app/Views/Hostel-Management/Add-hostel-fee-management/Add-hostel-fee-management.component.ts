import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ITIPlanningBankGuarantee } from '../../../Models/ItiPlanningDataModel';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../../Common/document-details';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { HostelFeeModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';

@Component({
  selector: 'app-Add-hostel-fee-management',
  standalone: false,
  templateUrl: './Add-hostel-fee-management.component.html',
  styleUrl: './Add-hostel-fee-management.component.css'
})


export class AddhostelfeemanagementComponent implements OnInit {
 // bankGuarantee!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = -1;
  public UserID: number = 0;
  sSOLoginDataModel = new SSOLoginDataModel();


  public HostelFeeId: number = 0;
  public requestFormGroup: any;
  public request = new HostelFeeModel()

  constructor(
    private formBuilder: FormBuilder,
    private campusPostService: ITIsService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private http: HttpClient,
    private _HostelManagmentService: HostelManagmentService,
    private documentDetailsService: DocumentDetailsService
  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.requestFormGroup = this.formBuilder.group({
      Cautionfee: ['', Validators.required],
      HostelFee: ['', Validators.required]
    });
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.HostelFeeId = +id;
        this.GetHostelFeeByID(this.HostelFeeId);
      }
    });
       
  }
  get _requestFormGroup() { return this.requestFormGroup.controls; }


  async GetHostelFeeByID(id: number) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this._HostelManagmentService.GetHostelFeeByID(id)   
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const record = data.Data[0];
          this.request = record;
          console.log('Hostel main data ===>',this.request)

          this.requestFormGroup.patchValue({
            Cautionfee: record.Cautionfee,
            HostelFee: record.HostelFee,
          });

        });

    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  get form() { return this.requestFormGroup.controls; }

  async saveData() {
    debugger;
    this.isSubmitted = true;
    if (this.requestFormGroup.invalid) {
      return;
    }

    const formValue = this.requestFormGroup.value;

    if (formValue.Cautionfee <= 0 || formValue.HostelFee <= 0) {
      this.toastr.error('Value must be greater than 0');
      return;
    }

    this.isLoading = true;
    this.loaderService.requestStarted();

    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.CourseTypeID = 0
    this.request.HostelId = 0;
   
    const isUpdate = this.request.HostelFeeId && this.request.HostelFeeId > 0;

    try {
      const data: any = await this._HostelManagmentService.SaveHostelFee(this.request);

      this.State = data.State;
      this.Message = data.Message;
      this.ErrorMessage = data.ErrorMessage;

      if (this.State === EnumStatus.Success) {

        const successMsg = isUpdate
          ? 'Hostel fee updated successfully'
          : 'Hostel fee saved successfully';

        this.toastr.success(successMsg);
        this.routers.navigate(['/hostel-fee-management']);
      }
      else {
        this.toastr.error(this.ErrorMessage);
      }

    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  async ResetControl() {
    debugger
    this.isSubmitted = false;
    this.request = new HostelFeeModel();
    this.requestFormGroup.reset();
    this.request.Cautionfee = 0;
    this.request.HostelFee = 0;
  }
  

 
  

}
