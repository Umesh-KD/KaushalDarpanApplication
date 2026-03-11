import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumITIBudgetDDLAction, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ITI_BGT_HeadMasterSearchModel, ITI_BGT_HeadMasterDataModel } from '../../../../Models/ITI/ItiBGTHeadMasterDataModel';
import { ITIBudgetDropdownDataModel } from '../../../../Models/ITI/ITIBudgetCreateDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ITI_BGTHeadmasterService } from '../../../../Services/ITI/ITI_BGT_Headmaster/ITI_BGTHeadmaster.Service';
import { ITIBudgetCreateService } from '../../../../Services/ITI/ITIBudgetCreate/itibudget-create.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';

@Component({
  selector: 'app-em-budget-head-master',
  standalone: false,
  templateUrl: './em-budget-head-master.component.html',
  styleUrl: './em-budget-head-master.component.css'
})
export class EMBudgetHeadMasterComponent {
  public BGTHeadForm!: FormGroup;

  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest: any = {};
  public request: any = {}

  public UCHeadDataList: any = [];
  public ddlBudgetTypeList: any = [];

  modalReference: NgbModalRef | undefined;
  public isSubmitted: boolean = false

  constructor(
    private modalService: NgbModal,
    private formBuilder:FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private ItiBGTHeadmasterServices: ITI_BGTHeadmasterService,
    private budgetCreateService: ITIBudgetCreateService,
    private bterEstablishManagementService: BTEREstablishManagementService,
  ) {}

  async ngOnInit() {
    this.BGTHeadForm=this.formBuilder.group({
      HeadName: ['', Validators.required],
      HeadDescription: [''],
      BudgetTypeID: ['', [DropdownValidators]],
    })
    this.request.BudgetTypeID = 0
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetBudgetHeadMasterData_EM();
  }

  get _BGTHeadForm() { return this.BGTHeadForm.controls; }

  async ViewandUpdate(content: any, id : number = 0) {
    if(id > 0) {
      await this.GetBudgetHeadById_EM(id);
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });    
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.request = {}
    // this.AppointExaminer = new ExaminerDataModel();
  }

  async GetBudgetHeadMasterData_EM() {
    try {
      this.searchRequest.Action = "GetAllData"

      await this.bterEstablishManagementService.GetBudgetHeadMasterData_EM(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.UCHeadDataList = data.Data;
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetBudgetHeadById_EM(id: number) {
    try {
      await this.bterEstablishManagementService.GetBudgetHeadById_EM(id).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          // this.BGTHeadForm.patchValue(data.Data[0]);
          this.request = data.Data[0];
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async onDeleteClick(id: number) {
    try {
      await this.bterEstablishManagementService.DeleteBudgetHeadById_EM(id, this.sSOLoginDataModel.UserID).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.GetBudgetHeadMasterData_EM();
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async EM_BudgetHeadMaster_Save() {
    //Show Loading
    this.loaderService.requestStarted();

    try {
      if (this.BGTHeadForm.valid) {        
        this.request.CreatedBy = this.sSOLoginDataModel.UserID.toString();
        this.request.FinYearID = this.sSOLoginDataModel.FinancialYearID;
        this.request.UserID = this.sSOLoginDataModel.UserID;
        console.log('Form Submitted:request', this.request);

        await this.bterEstablishManagementService.EM_BudgetHeadMaster_Save(this.request)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.CloseModalPopup();
              this.ngOnInit();
            } else {
              this.toastr.error(data.ErrorMessage)
            }
          });
      } else {
        this.toastr.error('Form is invalid');
        this.BGTHeadForm.markAllAsTouched();
      }
    } catch (ex) { 
      console.log(ex) 
    }
  }
  
  async onResetSearch() {
    this.searchRequest = {};
    await this.GetBudgetHeadMasterData_EM();
  }
}
