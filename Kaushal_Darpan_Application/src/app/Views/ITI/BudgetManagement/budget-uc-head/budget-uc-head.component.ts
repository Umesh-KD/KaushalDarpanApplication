import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITI_BGT_HeadMasterDataModel, ITI_BGT_HeadMasterSearchModel } from '../../../../Models/ITI/ItiBGTHeadMasterDataModel';
import { ITI_BGTHeadmasterService } from '../../../../Services/ITI/ITI_BGT_Headmaster/ITI_BGTHeadmaster.Service';

@Component({
  selector: 'app-budget-uc-head',
  standalone: false,
  templateUrl: './budget-uc-head.component.html',
  styleUrl: './budget-uc-head.component.css'
})
export class BudgetUCHeadComponent {
  public BGTHeadForm!: FormGroup;

  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITI_BGT_HeadMasterSearchModel();
  public request = new ITI_BGT_HeadMasterDataModel()

  public UCHeadDataList: any = [];

  modalReference: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private formBuilder:FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private ItiBGTHeadmasterServices: ITI_BGTHeadmasterService,
  ) {}

  async ngOnInit() {
    this.BGTHeadForm=this.formBuilder.group({
      HeadId: ['0'],
      HeadName: ['', Validators.required],
      HeadCode: ['', Validators.required],
      HeadDescription: ['']
    })
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.getUCHeadDataList();
  }

  get _BGTHeadForm() { return this.BGTHeadForm.controls; }
  async ViewandUpdate(content: any, id : number = 0) {
    if(id > 0) {
      await this.GetUCHeadDataById_ITI_BGT(id);
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });    
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    // this.AppointExaminer = new ExaminerDataModel();
  }

  async getUCHeadDataList() {
    try {
      this.searchRequest.FinYearID = this.sSOLoginDataModel.FinancialYearID;
      await this.ItiBGTHeadmasterServices.GetUCHeadData_ITI_BGT(this.searchRequest).then(async (data: any) => {
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

  async GetUCHeadDataById_ITI_BGT(id: number) {
    try {
      await this.ItiBGTHeadmasterServices.GetUCHeadDataById_ITI_BGT(id).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.BGTHeadForm.patchValue(data.Data[0]);
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
      await this.ItiBGTHeadmasterServices.DeleteUCHeadById_ITI_BGT(id, this.sSOLoginDataModel.UserID).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.getUCHeadDataList();
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async addUCHeadmaster() {
    //Show Loading
    this.loaderService.requestStarted();

    try {
      if (this.BGTHeadForm.valid) {
        console.log('Form submitted successfully:', this.BGTHeadForm.value);
        this.request = this.BGTHeadForm.value as ITI_BGT_HeadMasterDataModel;
        
        console.log('Form Submitted:request', this.request);
        this.request.CreatedBy = this.sSOLoginDataModel.UserID.toString();
        this.request.FinYearID = this.sSOLoginDataModel.FinancialYearID;

        await this.ItiBGTHeadmasterServices.SaveUCHeadData_ITI_BGT(this.request)
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

}
