import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { PayLevelMasterService } from '../../../../Services/BTER/PayLevelMaster/pay-level-master.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { PayLevelMasterDataModel } from '../../../../Models/BTER/PayLevelMasterDataModel';

@Component({
  selector: 'app-pay-level-master',
  standalone: false,
  templateUrl: './pay-level-master.component.html',
  styleUrl: './pay-level-master.component.css'
})
export class PayLevelMasterComponent {
  public PayLevelMasterForm!: FormGroup;

  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new PayLevelMasterDataModel();

  public PayLevelMasterData: any = [];

  modalReference: NgbModalRef | undefined;
  public isSubmitted: boolean = false
  public Table_SearchText: string = "";

  constructor(
    private modalService: NgbModal,
    private formBuilder:FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private payLevelMasterService: PayLevelMasterService
  ){}

  async ngOnInit() {
    this.PayLevelMasterForm = this.formBuilder.group({
      PayLevel: ['', Validators.required],
    })

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetPayLevelMasterData();
  }

  get _PayLevelMasterForm() { return this.PayLevelMasterForm.controls; }

  async ViewandUpdate(content: any, id : number = 0) {
    if(id > 0) {
      await this.GetPayLevelMasterData_ByID(id);
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });    
  }

  async GetPayLevelMasterData_ByID(id: number) {
    try {
      const request = new PayLevelMasterDataModel();
      request.PayLevelID = id;
      request.Action = 'GetData_ByID';

      await this.payLevelMasterService.GetPayLevelMasterData(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.request = data.Data[0];
        }
      })  
    } catch (error) {
      console.error(error);
    }
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.request = new PayLevelMasterDataModel();
  }

  async GetPayLevelMasterData() {
    try {
      const request = new PayLevelMasterDataModel();
      request.Action = 'GetAllData';
      request.UserID = this.sSOLoginDataModel.UserID;

      await this.payLevelMasterService.GetPayLevelMasterData(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.PayLevelMasterData = data.Data;
        }
      })
    } catch (error) { 
      console.error(error);
    }
  }

  async onClickDelete(id: number) {
    try {
      const request = new PayLevelMasterDataModel();
      request.PayLevelID = id;
      request.UserID = this.sSOLoginDataModel.UserID;

      await this.payLevelMasterService.DeletePayLevel_ByID(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.GetPayLevelMasterData();
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async SavePayLevelMasterData() {
    //Show Loading
    this.loaderService.requestStarted();

    try {
      if (this.PayLevelMasterForm.valid) {        
        this.request.UserID = this.sSOLoginDataModel.UserID;

        await this.payLevelMasterService.SavePayLevelMasterData(this.request)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.CloseModalPopup();
              await this.GetPayLevelMasterData();
            } else {
              this.toastr.error(data.ErrorMessage)
            }
          });
      } else {
        this.toastr.error('Form is invalid');
        this.PayLevelMasterForm.markAllAsTouched();
      }
    } catch (ex) { 
      console.log(ex) 
    }
  }
}
