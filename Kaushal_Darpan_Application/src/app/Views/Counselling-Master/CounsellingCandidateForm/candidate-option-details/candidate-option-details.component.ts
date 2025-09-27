import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { Counselling_DropdownDataModel, Counselling_OptionFormDataModel } from '../../../../Models/CounsellingApplicationFormDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EncryptionService } from '../../../ITI/idffund-details/idffund-details.component';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { CounsellingApplicationFormService } from '../../../../Services/CounsellingApplicationForm/counselling-application-form.service';

@Component({
  selector: 'app-candidate-option-details',
  standalone: false,
  templateUrl: './candidate-option-details.component.html',
  styleUrl: './candidate-option-details.component.css'
})
export class CandidateOptionDetailsComponent {
  public OptionsFormGroup!: FormGroup

  public SSOLoginDataModel = new SSOLoginDataModel();
  public formData = new Counselling_OptionFormDataModel();
  public tradeRequest = new Counselling_DropdownDataModel();
  public insRequest = new Counselling_DropdownDataModel();
  public searchReq = new Counselling_OptionFormDataModel();

  public TradeList: any = []
  public InstituteList: any = []
  public AddedChoices: any = []

  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();

  public isSubmitted: boolean = false

  constructor(
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SSOLoginDataModel.ApplicationFinalSubmit == 2) {
      this.formSubmitSuccess.emit(true); // Notify parent of success
      this.tabChange.emit(6); // Move to the next tab (index 1)
    }

    this.OptionsFormGroup = this.formBuilder.group({
        TradeId: ['', [DropdownValidators]],
        InstituteID: ['', [DropdownValidators]],
      });
    this.formData.DepartmentID = EnumDepartment.BTER;

    await this.GetTradeList();
    await this.Counselling_GetOptionDetailsByID();
  }

  get _OptionsFormGroup() { return this.OptionsFormGroup.controls; }

  async GetTradeList() {
    try {
      this.tradeRequest.Action = 'GetTradeList'
      await this.counsellingApplicationFormService.Counselling_GetDropdownByAction(this.tradeRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeList = data.Data;
      })
    } catch (error) {
      console.error(error)
    }
  }

  async GetInstituteList() {
    try {
      this.tradeRequest.Action = 'GetCollegeList'
      await this.counsellingApplicationFormService.Counselling_GetDropdownByAction(this.tradeRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteList = data.Data;
      })
    } catch (error) {
      console.error(error)
    }
  }

  async AddChoice() {
    try {
      this.formData.CandidateID = 1;
      this.formData.Priority = this.AddedChoices.length + 1
      this.formData.ModifyBy = this.SSOLoginDataModel.UserID
      await this.counsellingApplicationFormService.Counselling_SaveOption(this.formData).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message)

        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message)
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async Counselling_GetOptionDetailsByID() {
    try {
      this.searchReq.CandidateID = 1
      await this.counsellingApplicationFormService.Counselling_GetOptionDetailsByID(this.searchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message)
          this.AddedChoices = data.Data
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message)
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async SaveAndNext() {
    this.formSubmitSuccess.emit(true);
    this.tabChange.emit(3)
  }

  async Back() {
    this.tabChange.emit(1)
  }

}
