import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { Counselling_DropdownDataModel, Counselling_OptionFormDataModel, InstituteListDataModel_Coun } from '../../../../Models/CounsellingApplicationFormDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { CounsellingApplicationFormService } from '../../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

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
  public priorityChangeReq = new Counselling_OptionFormDataModel();
  public deleteOptionReq = new Counselling_OptionFormDataModel();
  public childpriorityChangeReq = new InstituteListDataModel_Coun();
  public childDeleteOptionReq = new InstituteListDataModel_Coun();

  public TradeList: any = []
  public InstituteList: any = []
  public AddedChoices: Counselling_OptionFormDataModel[] = []

  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public settingsMultiselect: object = {};

  public isSubmitted: boolean = false
  public CandidateID: number = 0

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

    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'InstituteID',
      textField: 'InstituteName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 300,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.OptionsFormGroup = this.formBuilder.group({
        TradeId: ['', [DropdownValidators]],
        // InstituteID: ['', [DropdownValidators]],
        InstituteList: ['', ],
      });
    this.CandidateID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SSOLoginDataModel.ApplicationFinalSubmit == 2) {
      this.formSubmitSuccess.emit(true); // Notify parent of success
      this.tabChange.emit(6); // Move to the next tab (index 1)
    }
    
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
        this.InstituteList = this.InstituteList.map((item: any, index: number) => ({
          ...item,
          DisplayText: `${index + 1}. ${item.InstituteName}`
        }));
      })
    } catch (error) {
      console.error(error)
    }
  }

  async AddChoice() {
    if(this.OptionsFormGroup.invalid) {
      this.toastr.error("Please fill all the required fields");
      return;
    }
    try {
      this.formData.CandidateID = this.CandidateID;
      this.formData.Priority = this.AddedChoices.length + 1
      this.formData.ModifyBy = this.SSOLoginDataModel.UserID
      await this.counsellingApplicationFormService.Counselling_SaveOption(this.formData).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message)
          await this.Counselling_GetOptionDetailsByID();
          this.formData.TradeId = 0;
          this.formData.InstituteID = 0;
          this.formData.InstituteList = [];
          this.isSubmitted = false;
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
      this.searchReq.CandidateID = this.CandidateID;
      await this.counsellingApplicationFormService.Counselling_GetOptionDetailsByID(this.searchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          // this.toastr.success(data.Message)
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

  async PriorityChange_Counselling(row: any, Type: string) {
    try {
      this.priorityChangeReq.CandidateID = row.CandidateID
      this.priorityChangeReq.OptionID = row.OptionID
      this.priorityChangeReq.Type = Type
      await this.counsellingApplicationFormService.PriorityChange_Counselling(this.priorityChangeReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message)
          await this.Counselling_GetOptionDetailsByID();
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

  async DeleteOptionByID_Counselling(row: any) {
    try {
      this.deleteOptionReq.CandidateID = row.CandidateID
      this.deleteOptionReq.OptionID = row.OptionID
      await this.counsellingApplicationFormService.DeleteOptionByID_Counselling(this.deleteOptionReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message)
          await this.Counselling_GetOptionDetailsByID();
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

  async ChildPriorityChange_Counselling(row: any, Type: string) {
    try {
      this.childpriorityChangeReq.InstituteOptionID = row.InstituteOptionID
      this.childpriorityChangeReq.OptionID = row.OptionID
      this.childpriorityChangeReq.Type = Type
      await this.counsellingApplicationFormService.ChildPriorityChange_Counselling(this.childpriorityChangeReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message)
          await this.Counselling_GetOptionDetailsByID();
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

  async DeleteChildOptionByID_Counselling(row: any) {
    debugger
    try {
      this.childDeleteOptionReq.InstituteOptionID = row.InstituteOptionID
      await this.counsellingApplicationFormService.DeleteChildOptionByID_Counselling(this.childDeleteOptionReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message)
          await this.Counselling_GetOptionDetailsByID();
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

  updatePriorityList() {
    if (!this.formData.InstituteList) return;
    this.formData.InstituteList.forEach((item, index) => {
      item.Priority = index + 1; // assign priority starting from 1
    });

    // Optionally, create a new field 'DisplayText' for showing priority in dropdown:
    this.formData.InstituteList = this.formData.InstituteList.map(item => ({
      ...item,
      DisplayText: `${item.Priority}. ${item.InstituteName}`
    }));
  }

  // updatePriorityList() {
  //   if (!this.formData.InstituteList) return;

  //   this.formData.InstituteList.forEach((item: any, index) => {
  //     item.Priority = index + 1;
  //     item.InstituteName = `${item.Priority}. ${item.InstituteName.replace(/^\d+\.\s*/, '')}`; // prevent duplicate priority prefix
  //   });
  // }

// ---------------------- Multiselect functions --------------------------------------
  onItemSelect(event: InstituteListDataModel_Coun) {
    if (!this.formData.InstituteList) this.formData.InstituteList = [];
    this.formData.InstituteList.push(event);
    this.updatePriorityList();
  }

  onDeSelect(event: InstituteListDataModel_Coun) {
    if (!this.formData.InstituteList) return;
    this.formData.InstituteList = this.formData.InstituteList.filter(item => item.InstituteID !== event.InstituteID);
    this.updatePriorityList();
  }

  onSelectAll(items: InstituteListDataModel_Coun[]) {
    this.formData.InstituteList = [...items];
    this.updatePriorityList();
  }

  onDeSelectAll(event: any) {
    this.formData.InstituteList = [];
  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  // ---------------------- Multiselect functions End --------------------------------------
}
