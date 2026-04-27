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

@Component({
  selector: 'app-em-add-training-details',
  standalone: false,
  templateUrl: './em-add-training-details.component.html',
  styleUrl: './em-add-training-details.component.css'
})
export class EMAddTrainingDetailsComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new StaffTrainingDetailDataModel();
  public searchRequest = new StaffTrainingDetailSearchData();

  public AddTrainingDetailsFromGroup!: FormGroup;

  public EM_TrainingCourseTypeList: any = [];
  public StaffTrainingDetailsDataList: any = [];
  public StaffTrainingDetailsCompletedTrainingDataList: any = [];
  public StaffTrainingDetailsNewTrainingDataList: any = [];

  isSubmitted: boolean = false;
  Table_SearchText: string = '';
  public file!: File;
  public Uploadfile: string = '';

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
  ) { }

  async ngOnInit() {
    debugger
    this.AddTrainingDetailsFromGroup = this.formBuilder.group({
      OrganizinglnstituteName: ['', [Validators.required]],
      CourseType: ['', [DropdownValidators1]],
      CourseName: ['', [Validators.required]],
      DurationUnit: ['', [DropdownValidators1]],
      Duration: ['', [Validators.required]],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      ModeOfTraining: ['', [DropdownValidators1]],
      Venue: ['', [Validators.required]],
      TrainingDoc: ['', [Validators.required]],
      TrainingType: [''],
      ComplitionTrainingDoc: ['']
      
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetEM_TrainingCourseType();
    await this.StaffTrainingDetailsCompletedTraining_GetData();
    await this.StaffTrainingDetailsNewTraining_GetData();
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
    if(this.request.ModeOfTraining == 1) {
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
        Object.keys(this.AddTrainingDetailsFromGroup.controls).forEach(key => {
          const control = this.AddTrainingDetailsFromGroup.get(key);

          if (control && control.invalid) {
            this.toastr.error(`Control ${key} is invalid`);
            Object.keys(control.errors!).forEach(errorKey => {
              this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
            });
          }
        });
        return;
      }

      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.StaffID = this.sSOLoginDataModel.StaffID;

      
      await this.staffServiceDetailsService.Save_StaffTrainingDetails(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.ResetControl();
          await this.StaffTrainingDetailsCompletedTraining_GetData();
          await this.StaffTrainingDetailsNewTraining_GetData();
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
    this.isSubmitted = false;
  }

  //async StaffTrainingDetails_GetData() {
  //  try {
  //    this.searchRequest.StaffID=this.sSOLoginDataModel.StaffID
  //    this.searchRequest.UserID=this.sSOLoginDataModel.UserID
  //    this.searchRequest.Action = "GetAllData";

  //    await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      if (data.State === EnumStatus.Success) {
  //        this.StaffTrainingDetailsDataList = data.Data;
  //      }
  //    })
  //  } catch (error) {
  //    console.error(error);
  //  }
  //}

  async StaffTrainingDetails_GetDataById(ID: number) {
    try {
      this.searchRequest.StaffID=this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID=this.sSOLoginDataModel.UserID
      this.searchRequest.StaffTrainingDetailID = ID
      this.searchRequest.Action = "GetByID";

      await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.request = this.StaffTrainingDetailsDataList[0];
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async StaffTrainingDetails_DeleteById(ID: number) {
    try {
      this.searchRequest.StaffID=this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID=this.sSOLoginDataModel.UserID
      this.searchRequest.StaffTrainingDetailID = ID
      this.searchRequest.Action = "DeleteByID";

      await this.staffServiceDetailsService.StaffTrainingDetails_DeleteById(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success("Updated Successfully")
          await this.StaffTrainingDetailsCompletedTraining_GetData();
          await this.StaffTrainingDetailsNewTraining_GetData();
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async onFilechange(event: any, Name: any) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        // Type validation
        if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select valid file type jpg/jpeg/png/pdf');
          this.Uploadfile = '';
          this.request.TrainingDoc = '';
          event.target.value = null;
          return;
        }

        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "BTER_Establishment/StaffTrainingDocument";

        //Upload to server folder
        await this.commonFunctionService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              if (Name == 'TrainingDoc') {
                this.request.TrainingDoc = data['Data'][0]["FileName"];
                this.request.Dis_TrainingDoc = data['Data'][0]["Dis_FileName"];
              } else if (Name == 'ComplitionDoc') {
                this.request.ComplitionTrainingDoc = data['Data'][0]["FileName"];
                this.request.Dis_complitionTrainingDoc = data['Data'][0]["Dis_FileName"];
              } else {
                this.toastr.warning("no action provided")
              }
              
            }

            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async StaffTrainingDetailsCompletedTraining_GetData() {
    debugger
    try {
      this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.Action = "GetAllDataCompletedTraining";

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
  async StaffTrainingDetailsNewTraining_GetData() {
    debugger
    try {
      this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.Action = "GetAllDataNewTraining";

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


  onTrainingTypeChange(event: any) {
    debugger
   
    this.request.TrainingTypeID = event;
  }

  onDateChange() {
    const start = this.AddTrainingDetailsFromGroup.get('StartDate')?.value;
    const end = this.AddTrainingDetailsFromGroup.get('EndDate')?.value;

    if (start && end && new Date(end) < new Date(start)) {
      alert("End Date cannot be less than Start Date");

      // clear EndDate properly
      this.AddTrainingDetailsFromGroup.get('EndDate')?.setValue(null);

      // if you are still using request object
      this.request.EndDate = "null";
    }
  }
}
