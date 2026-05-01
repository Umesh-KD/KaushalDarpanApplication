import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { StaffTrainingDetailDataModel, StaffTrainingDetailSearchData } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { DropdownValidators1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-EM_TrainingDetailsList',
  standalone: false,
  templateUrl: './EM_TrainingDetailsList.component.html',
  styleUrl: './EM_TrainingDetailsList.component.css'
})
export class EM_TrainingDetailsListComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new StaffTrainingDetailDataModel();
  public searchRequest = new StaffTrainingDetailSearchData();

  public AddTrainingDetailsFromGroup!: FormGroup;
  public TrainingDocFromGroup!: FormGroup;

  public EM_TrainingCourseTypeList: any = [];
  public StaffTrainingDetailsDataList: any = [];
  public StaffTrainingDetailsCompletedTrainingDataList: any = [];
  public StaffTrainingDetailsNewTrainingDataList: any = [];

  isSubmitted: boolean = false;
  Table_SearchText: string = '';
  public file!: File;
  public Uploadfile: string = '';
  modalReference: NgbModalRef | undefined;
  public StaffTrainingHTS_GetDataList: any = [];
  isTrainingCom: boolean = false;
  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private staffServiceDetailsService: BTEREMStaffServiceDetailsService,
    private appsettingConfig: AppsettingService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    debugger
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetEM_TrainingCourseType();
    await this.StaffTrainingDetailsCompletedTraining_GetData();
    await this.StaffTrainingDetailsNewTraining_GetData();

    this.isTrainingCom = true;
  }

  get _AddTrainingDetailsFromGroup() { return this.AddTrainingDetailsFromGroup.controls; }

  async GetEM_TrainingCourseType() {
    try {
      await this.commonFunctionService.GetCommonMasterData('EM_TrainingCourseType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EM_TrainingCourseTypeList = data['Data'];
        }, (error: any) => console.error(error)
      );
    } catch (error) {
      console.error(error);
    }
  }
  async StaffTrainingDetailsNewTraining_GetData() {
    debugger
    try {
      this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.Action = "GetNewTrainingList";

      await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingDetailsNewTrainingDataList = data.Data;
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
  async StaffTrainingDetailsCompletedTraining_GetData() {
    debugger
    try {
      this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.Action = "GetCompletedTrainingList";

      await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingDetailsCompletedTrainingDataList = data.Data;
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
  async onEmtrainingStatusHistory(model: any, StaffTrainingDetailId: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.StaffTrainingHTS_GetData(StaffTrainingDetailId)
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async StaffTrainingHTS_GetData(id: number) {
    try {
      debugger
      this.searchRequest.StaffTrainingDetailID = id;
      await this.staffServiceDetailsService.StaffTrainingHTS_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingHTS_GetDataList = data.Data;
        }
        else {
          this.StaffTrainingHTS_GetDataList = [];
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }
}
