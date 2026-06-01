import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStaffTrainingStatus, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { StaffTrainingDetailDataModel, StaffTrainingDetailSearchData } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { DropdownValidators1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';



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
  todayDate: any = new Date().toISOString().split('T')[0];
  _EnumStaffTrainingStatus = EnumStaffTrainingStatus;

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

    this.TrainingDocFromGroup = this.formBuilder.group({
      ComplitionTrainingDoc: ['', [Validators.required]]
    });



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
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;

      
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
      this.searchRequest.Action = "GetAllDataCompletedTrainingList";

      await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingDetailsCompletedTrainingDataList = data.Data;
        } else {
          this.StaffTrainingDetailsCompletedTrainingDataList = [];
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
      this.searchRequest.Action = "GetAllDataNewTrainingList";

      await this.staffServiceDetailsService.StaffTrainingDetails_GetData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.StaffTrainingDetailsNewTrainingDataList = data.Data;
        } else {
          this.StaffTrainingDetailsNewTrainingDataList = [];
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  onTrainingTypeChange(event: any) {

    this.request.TrainingTypeID = event;

    // Completion document validation
    if (this.request.TrainingTypeID == 1) {

      this.AddTrainingDetailsFromGroup.controls['ComplitionTrainingDoc']
        .setValidators([Validators.required]);

    }
    else {

      this.AddTrainingDetailsFromGroup.controls['ComplitionTrainingDoc']
        .clearValidators();

    }

    this.AddTrainingDetailsFromGroup.controls['ComplitionTrainingDoc']
      .updateValueAndValidity();

    // Reset dates
    this.request.StartDate = '';
    this.request.EndDate = '';

  }

  //onTrainingTypeChange(event: any) {
  //  debugger
   
  //  this.request.TrainingTypeID = event;

  //  if (this.request.TrainingTypeID == 1) {
  //    this.AddTrainingDetailsFromGroup.controls['ComplitionTrainingDoc'].setValidators([Validators.required]);
  //    } 
  //  else {
  //    this.AddTrainingDetailsFromGroup.controls['ComplitionTrainingDoc'].clearValidators();
  //  }
  //  this.AddTrainingDetailsFromGroup.controls['ComplitionTrainingDoc'].updateValueAndValidity();

    

  //}
    onDateChange() {
    const start = this.AddTrainingDetailsFromGroup.get('StartDate')?.value;
    const end = this.AddTrainingDetailsFromGroup.get('EndDate')?.value;

      if (start && end && new Date(end) < new Date(start)) {
        this.toastr.warning("End Date cannot be less than Start Date");

      // clear EndDate properly
      this.AddTrainingDetailsFromGroup.get('EndDate')?.setValue(null);

      // if you are still using request object
      this.request.EndDate = "null";
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

  async onEmtrainingDocUpdate(model: any, StaffTrainingDetailId: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.request.StaffTrainingDetailID = StaffTrainingDetailId;
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


  async SubmitDocUpdate() {

    this.isSubmitted = true;
    if (this.TrainingDocFromGroup.invalid) {
      this.TrainingDocFromGroup.markAllAsTouched();
      this.toastr.error('Please fill all the required fields.', 'Error');
      Object.keys(this.TrainingDocFromGroup.controls).forEach(key => {
        const control = this.TrainingDocFromGroup.get(key);

        if (control && control.invalid) {
          this.toastr.error(`Control ${key} is invalid`);
          Object.keys(control.errors!).forEach(errorKey => {
            this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          });
        }
      });
      return;
    }
    await this.staffServiceDetailsService.StaffTrainingDocUpdate(this.request).then(async (data: any) => {
      data = JSON.parse(JSON.stringify(data));
      if (data.State === EnumStatus.Success) {
        this.toastr.success(data.Message);
        this.CloseModal();
        this.ResetControl();
        window.location.reload();
      } else {
        this.toastr.error(data.ErrorMessage);
      }
    })

  }
  validateTrainingDates() {

    const startDate = this.request.StartDate;
    const duration = Number(this.request.Duration);
    const durationUnit = Number(this.request.DurationUnit);
    const trainingType = Number(this.request.TrainingTypeID);

    if (!startDate || !duration || !durationUnit) {
      return;
    }

    // =========================
    // Parse Start Date Properly
    // =========================

    const start = new Date(startDate);

    start.setHours(0, 0, 0, 0);

   

    let totalDays = 0;

    // Days
    if (durationUnit === 1) {
      totalDays = duration;
    }

    // Weeks
    if (durationUnit === 2) {
      totalDays = duration * 7;
    }

   

    const end = new Date(start);

    end.setDate(end.getDate() + totalDays - 1);


    const yyyy = end.getFullYear();
    const mm = String(end.getMonth() + 1).padStart(2, '0');
    const dd = String(end.getDate()).padStart(2, '0');

    const endDate = `${yyyy}-${mm}-${dd}`;

    this.request.EndDate = endDate;

    this.AddTrainingDetailsFromGroup.controls['EndDate']
      .setValue(endDate);


    this.AddTrainingDetailsFromGroup.controls['StartDate']
      .setErrors(null);

    this.AddTrainingDetailsFromGroup.controls['EndDate']
      .setErrors(null);


    const today = new Date();

    today.setHours(0, 0, 0, 0);


    if (trainingType == 1) {

      if (start > today) {

        this.AddTrainingDetailsFromGroup.controls['StartDate']
          .setErrors({
            futureDateNotAllowed: true
          });

      }

    }

    if (trainingType == 2) {

      if (start < today) {

        this.AddTrainingDetailsFromGroup.controls['StartDate']
          .setErrors({
            backDateNotAllowed: true
          });

      }

    }

  }
  //validateTrainingDates() {

  //  const startDate = this.request.StartDate;
  //  const duration = Number(this.request.Duration);
  //  const durationUnit = Number(this.request.DurationUnit);
  //  const trainingType = Number(this.request.TrainingTypeID);

  //  if (!startDate || !duration || !durationUnit) {
  //    return;
  //  }

  //  const start = new Date(startDate);

  //  let totalDays = 0;

  //  // Days
  //  if (durationUnit == 1) {
  //    totalDays = duration;
  //  }

  //  // Weeks
  //  if (durationUnit == 2) {
  //    totalDays = duration * 7;
  //  }

  //  // Calculate End Date
  //  const end = new Date(start);

  //  end.setDate(end.getDate() + totalDays);

  //  const endDate = end.toISOString().split('T')[0];

  //  this.request.EndDate = endDate;

  //  this.AddTrainingDetailsFromGroup.controls['EndDate']
  //    .setValue(endDate);

  //  // Clear old errors
  //  this.AddTrainingDetailsFromGroup.controls['StartDate']
  //    .setErrors(null);

  //  this.AddTrainingDetailsFromGroup.controls['EndDate']
  //    .setErrors(null);

  //  const today = new Date();

  //  today.setHours(0, 0, 0, 0);

  //  // =========================
  //  // Completed Training
  //  // =========================

  //  if (trainingType == 1) {

  //    // Future end date not allowed

  //    if (end > today) {

  //      this.AddTrainingDetailsFromGroup.controls['EndDate']
  //        .setErrors({
  //          futureDateNotAllowed: true
  //        });

  //    }

  //  }

  //  // =========================
  //  // Add New Training
  //  // =========================

  //  if (trainingType == 2) {

  //    // Back date not allowed

  //    if (start < today) {

  //      this.AddTrainingDetailsFromGroup.controls['StartDate']
  //        .setErrors({
  //          backDateNotAllowed: true
  //        });

  //    }

  //  }

  //}


  exportToExcelNew(): void {

    if (this.StaffTrainingDetailsNewTrainingDataList.length == 0) {
      this.toastr.warning('No records available for Excel export.');
      return;
    }

    const unwantedColumns = [
      'StaffTrainingDetailID',
      'StaffID',
      'UserID',
      'StaffTypeID',
      'StatusID',
      'ISNonGazetted',
      'RoleID',
      'StaffUserID'
    ];

    const filteredData = this.StaffTrainingDetailsNewTrainingDataList.map(
      (item: any, index: number) => {

        const filteredItem: any = {};

        // Add Serial Number
        filteredItem["Sr. No"] = index + 1;

        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            filteredItem[key] = item[key];
          }
        });

        return filteredItem;
      });

    const ws: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(filteredData);

    const wb: XLSX.WorkBook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.-]/g, '_');

    XLSX.writeFile(
      wb,
      `StaffDetailsNewTraining_${timestamp}.xlsx`
    );
  }

  exportToExcelCom(): void {

    const unwantedColumns = [
      'StaffTrainingDetailID',
      'StaffID',
      'UserID',
      'StaffTypeID',
      'StatusID',
      'ISNonGazetted',
      'RoleID',
      'StaffUserID'
    ];

    if (this.StaffTrainingDetailsCompletedTrainingDataList.length == 0) {
      this.toastr.warning('No records available for Excel export.');
      return;
    }

    const filteredData = this.StaffTrainingDetailsCompletedTrainingDataList.map(
      (item: any, index: number) => {

        const filteredItem: any = {};

        // Add Serial Number
        filteredItem["Sr. No"] = index + 1;

        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            filteredItem[key] = item[key];
          }
        });

        return filteredItem;
      });

    const ws: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(filteredData);

    const wb: XLSX.WorkBook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.-]/g, '_');

    XLSX.writeFile(
      wb,
      `StaffDetailsCompletedTraining_${timestamp}.xlsx`
    );
  }


  async deleteRow(id: number) {
    try {
      debugger
      this.searchRequest.StaffTrainingDetailID = id;
      await this.staffServiceDetailsService.DeleteStaffTrainingData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          debugger
          this.toastr.success(data.Message);
          await this.StaffTrainingDetailsCompletedTraining_GetData();
          await this.StaffTrainingDetailsNewTraining_GetData();
        }
        else {
          this.toastr.error(data.ErrorMessage);
        }
      })

     
    } catch (error) {
      console.error(error);
    }
  }
}
