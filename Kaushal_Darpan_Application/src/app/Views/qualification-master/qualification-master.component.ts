import { Component } from '@angular/core';
import { QualificationMasterService } from '../../Services/QualificationMaster/qualification-master.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DropdownValidators, DropdownValidators1 } from '../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { QualificationMasterDataModel, QualificationMasterSearchModel } from '../../Models/QualificationMasterDataModel';
import { EnumStatus, QualificationLevel } from '../../Common/GlobalConstants';

@Component({
  selector: 'app-qualification-master',
  standalone: false,
  templateUrl: './qualification-master.component.html',
  styleUrl: './qualification-master.component.css'
})
export class QualificationMasterComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new QualificationMasterDataModel();
  public searchRequest = new QualificationMasterSearchModel();

  public AddQualificationFromGroup!: FormGroup;

  public QualificationMasterDataList: any = [];

  isSubmitted: boolean = false;
  Table_SearchText: string = '';

  _QualificationLevel = QualificationLevel;

  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private appsettingConfig: AppsettingService,
    private qualificationMasterService: QualificationMasterService
  ) { }

  async ngOnInit() {
    this.AddQualificationFromGroup = this.formBuilder.group({
      QualificationLevelID: ['', [DropdownValidators]],
      QualificationName: ['', [Validators.required]],
      Remarks: ['', [Validators.required]]
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.QualificationMaster_GetData();
  }

  get _AddQualificationFromGroup() { return this.AddQualificationFromGroup.controls; }

  async QualificationMaster_GetData() {
    try {
      this.searchRequest.Action = 'GetAllData';
      await this.qualificationMasterService.QualificationMaster_GetData(this.searchRequest).then(async (data: any) => {
        if(data.State === EnumStatus.Success) {
          this.QualificationMasterDataList = data.Data;
        } else {
          this.toastr.error(data.ErrorMessage);
        }        
      })
    } catch (error) {
      console.error(error);
    }
  }

  async SaveData() {
    try {

      const selected = this._QualificationLevel.find(
        (x: any) => x.id === Number(this.request.QualificationLevelID)
      );
      this.request.QualificationLevel = selected?.name || '';

      if(this.request.QualificationLevel == '') {
        this.toastr.error('Select Qualification Level');
        return;
      }

      this.isSubmitted = true;
      if(this.AddQualificationFromGroup.invalid) {
        this.toastr.error('Please fill all required fields.');
        return;
      }

      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      await this.qualificationMasterService.Save_QualificationMasterData(this.request).then(async (data: any) => {
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.ResetControl();
          await this.QualificationMaster_GetData();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new QualificationMasterDataModel();
  }

  async Qualification_DeleteById(Id: number) {
    try {
      const deleteRequest: any = {};
      deleteRequest.Action = 'DeleteById';
      deleteRequest.QualificationID = Id;
      deleteRequest.UserID = this.sSOLoginDataModel.UserID;
      await this.qualificationMasterService.QualificationMaster_GetData(deleteRequest).then(async (data: any) => {
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.QualificationMaster_GetData();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async QualificationData_GetByID(Id: number) {
    try {
      const Request: any = {};
      Request.Action = 'GetByID';
      Request.QualificationID = Id;
      await this.qualificationMasterService.QualificationMaster_GetData(Request).then(async (data: any) => {
        if(data.State === EnumStatus.Success) {
          this.request = data.Data[0];
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
}
