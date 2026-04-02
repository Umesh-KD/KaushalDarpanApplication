import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { StaffTrainingDetailDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';

@Component({
  selector: 'app-em-add-training-details',
  standalone: false,
  templateUrl: './em-add-training-details.component.html',
  styleUrl: './em-add-training-details.component.css'
})
export class EMAddTrainingDetailsComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new StaffTrainingDetailDataModel();

  public AddTrainingDetailsFromGroup!: FormGroup;

  public EM_TrainingCourseTypeList: any = [];

  isSubmitted: boolean = false;
    constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private bterEstablishManagementService: BTEREstablishManagementService,
  ) { }

  async ngOnInit() {

    this.AddTrainingDetailsFromGroup = this.formBuilder.group({
      OrganizinglnstituteName: ['', [Validators.required]],
      CourseType: ['', [DropdownValidators]],
      CourseName: ['', [Validators.required]],
      DurationUnit: ['', [DropdownValidators]],
      Duration: ['', [Validators.required]],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      ModeOfTraining: ['', [DropdownValidators]],
      Venue: ['', [Validators.required]],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetEM_TrainingCourseType();

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

  async refreshValidators() {
    if(this.request.ModeOfTraining == 2) {
      this.AddTrainingDetailsFromGroup.get('Venue')?.clearValidators();
      this.AddTrainingDetailsFromGroup.get('Venue')?.updateValueAndValidity();
    }
  }

  async SaveData() {
    try {
      await this.refreshValidators();
      this.isSubmitted=true;
      if(this.AddTrainingDetailsFromGroup.invalid){
        this.AddTrainingDetailsFromGroup.markAllAsTouched();
        this.toastr.error('Please fill all the required fields.', 'Error');
        return;
      }

      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.StaffID = this.sSOLoginDataModel.StaffID;

      await this.bterEstablishManagementService.Save_StaffTrainingDetails(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.ErrorMessage);
          this.ResetControl();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ResetControl() {
    this.request = new StaffTrainingDetailDataModel();
  }
}
