import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { OptionsDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { BterCollegesSearchModel, BterOptionsDetailsDataModel, BterSearchmodel } from '../../../../Models/ApplicationFormDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { ToastrService } from 'ngx-toastr';
import { EnumCourseType, EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-optional-form',
  templateUrl: './optional-form.component.html',
  styleUrls: ['./optional-form.component.css'],
  standalone: false
})
export class OptionalFormComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public ManagmentTypeList: any = []
  public DistrictMasterList: any = []
  public InstituteMasterList: any = []
  public BranchName: any = []
  public formData = new BterOptionsDetailsDataModel()
  public OptionsFormGroup!: FormGroup
  public AddedChoices: BterOptionsDetailsDataModel[] = []
  public isSubmitted: boolean = false
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ApplicationID: number = 0
  public searchrequest = new BterSearchmodel()
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public collegeSearchRequest = new BterCollegesSearchModel()
  public streamSearchRequest = new StreamDDL_InstituteWiseModel()
  public PersonalDetailsData: any = []

  constructor(
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private ApplicationService: BterApplicationForm,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService
  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SSOLoginDataModel.ApplicationFinalSubmit == 2) {
      this.formSubmitSuccess.emit(true); // Notify parent of success
      this.tabChange.emit(6); // Move to the next tab (index 1)
    }

    this.ApplicationID = this.SSOLoginDataModel.ApplicationID;
    this.OptionsFormGroup = this.formBuilder.group(
      {
        ddlManagementType: ['', [DropdownValidators]],
        ddlDistrict: ['', [DropdownValidators]],
        ddlInstitute: ['', [DropdownValidators]],
        ddlTrade: ['', [DropdownValidators]],
      });
    this.formData.DepartmentID = EnumDepartment.BTER;
    await this.GetManagmentType()
    await this.GetDistrictMaster()
    await this.GetPersonalDetailsById()
    /*  this.GetInstituteMaster()*/
    // this.GetBranchMaster()


    //this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.SSOLoginDataModel.ApplicationID;
      this.searchrequest.DepartmentID = 1;
      this.searchrequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng;
      await this.GetById();
    
      await this.GetPersonalDetailsById()
      this.formData.CourseType = this.SSOLoginDataModel.Eng_NonEng;
      this.searchrequest.DepartmentID = 1;
      this.searchrequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng;
    }

    // this.GetById()
  }

  get _OptionsFormGroup() { return this.OptionsFormGroup.controls; }

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetManagType(EnumDepartment.BTER)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ManagmentTypeList = data['Data'];
        }, error => console.error(error));
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

  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
        }, error => console.error(error));
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

  //async GetInstituteMaster() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonFunctionService.InstituteMaster(this.formData.DepartmentID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.InstituteMasterList = data['Data'];

  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  // async GetBranchMaster() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonFunctionService.StreamMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.BranchName = data['Data'];
  //         console.log(this.BranchName)
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  async GetStreamMasterInstituteWise() {
    //try {
    //  this.loaderService.requestStarted();
    //  this.streamSearchRequest.InstituteID = this.formData.InstituteID
    //  this.streamSearchRequest.ApplicationID = this.formData.ApplicationID
    //  this.streamSearchRequest.StreamType = this.formData.CourseType
    //  await this.commonFunctionService.StreamDDL_InstituteWise(this.streamSearchRequest)
    //    .then((data: any) => {
    //      data = JSON.parse(JSON.stringify(data));
    //      this.BranchName = data['Data'];
    //      console.log("BranchName", this.BranchName)
    //    }, error => console.error(error));
    //}
    //catch (Ex) {
    //  console.log(Ex);
    //}
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}

    console.log("formdata in institute", this.formData)
    try {
      this.collegeSearchRequest.College_TypeID = this.formData.College_TypeID
      this.collegeSearchRequest.DistrictID = this.formData.DistrictID
      this.collegeSearchRequest.ApplicationID = this.formData.ApplicationID

      this.collegeSearchRequest.InstituteID = this.formData.InstituteID  
      this.collegeSearchRequest.StreamType = this.formData.CourseType
   
       this.collegeSearchRequest.action = '_getDatabyCollege'  
      this.collegeSearchRequest.EndTermId = this.SSOLoginDataModel.EndTermID;

      this.loaderService.requestStarted();
      await this.commonFunctionService.BterCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchName = data.Data
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  get CheckInstitute(): boolean {

    const insdtitutexist = this.AddedChoices.some(x => x.InstituteID == this.formData.InstituteID && x.BranchID == this.formData.BranchID)
    if (insdtitutexist) {
      return true
    } else {
      return false
    }
  }


  AddChoice() {
    this.isSubmitted = true;
    if (this.OptionsFormGroup.invalid) {
      /*this.OptionsFormGroup.markAllAsTouched();*/
      return;
    }

    if (this.CheckInstitute) {
      this.toastr.error("आपने पहले ही इस संयोजन को चुन लिया है")
    }
    else {

      // Get the selected values
      this.formData.College_TypeName = this.ManagmentTypeList.filter((x: any) => x.InstitutionManagementTypeID == this.formData.College_TypeID)[0]['InstitutionManagementType'];
      this.formData.DistrictName = this.DistrictMasterList.filter((x: any) => x.ID == this.formData.DistrictID)[0]['Name'];
      this.formData.InstituteName = this.InstituteMasterList.filter((x: any) => x.InstituteID == this.formData.InstituteID)[0]['InstituteName'];
      this.formData.BranchName = this.BranchName.filter((x: any) => x.StreamID == this.formData.BranchID)[0]['StreamName'];
      this.formData.Priority = this.AddedChoices.length + 1;

      this.AddedChoices.push({
        InstituteName: this.formData.InstituteName,
        BranchName: this.formData.BranchName,
        InstituteID: this.formData.InstituteID,
        BranchID: this.formData.BranchID,
        DistrictName: this.formData.DistrictName,
        College_TypeID: this.formData.College_TypeID,
        College_TypeName: this.formData.College_TypeName,
        DistrictID: this.formData.DistrictID,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: EnumDepartment.BTER,
        ApplicationID: this.formData.ApplicationID,
        optionID: this.formData.optionID,
        Priority: this.formData.Priority,
        IsFinalSubmit: 0,
        CourseType: this.formData.CourseType,
        AcademicYear: this.SSOLoginDataModel.FinancialYearID_Session,

      });

      console.log(this.AddedChoices);

      this.SaveData();
      this.resetFormData();
    }
  }

  resetFormData() {
    this.formData.InstituteID = 0
    this.formData.InstituteName = ''
    this.formData.BranchID = 0
    this.formData.BranchName = ''
    this.formData.DistrictID = 0
    this.formData.DistrictName = ''
    this.formData.College_TypeName = ''
    this.formData.College_TypeID = 0
    this.isSubmitted = false
    this.BranchName = []
  }

  deleteRow(index: number): void {
    this.AddedChoices.splice(index, 1);
    this.AddedChoices.forEach((item, i) => {
      item.Priority = i + 1; // Recalculate indices
    });
  }


  priorityUp(index: number): void {
    if (index > 0) {
      const temp = this.AddedChoices[index];
      this.AddedChoices[index] = this.AddedChoices[index - 1];
      this.AddedChoices[index - 1] = temp;

      // Update the Index property
      this.AddedChoices[index].Priority = index + 1;
      this.AddedChoices[index - 1].Priority = index;
    }
  }

  priorityDown(index: number): void {
    if (index < this.AddedChoices.length - 1) {
      const temp = this.AddedChoices[index];
      this.AddedChoices[index] = this.AddedChoices[index + 1];
      this.AddedChoices[index + 1] = temp;

      // Update the Index property
      this.AddedChoices[index].Priority = index + 1;
      this.AddedChoices[index + 1].Priority = index + 2;
    }
  }


  async SaveData() {
    try {
      
      if (this.AddedChoices.length < 1) {
        this.toastr.error("Please add at least one options")
        return
      }
      this.loaderService.requestStarted();
      this.AddedChoices.forEach((item, index) => {
        item.DepartmentID = EnumDepartment.BTER;
        item.ModifyBy = this.SSOLoginDataModel.UserID;
        item.Priority = index + 1;
      });
      //save
      await this.ApplicationService.SaveOptionalData(this.AddedChoices)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.GetById();
            // this.formSubmitSuccess.emit(true);
            // this.tabChange.emit(5)
            /*    this.CancelData();*/
            /* this.routers.navigate(['/Hrmaster']);*/
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetData() {

    // this.formData.College_TypeID = 0;
    // this.formData.College_TypeName = '';
    // this.formData.DistrictID = 0;
    // this.formData.DistrictName = '';
    // this.formData.InstituteID = 0;
    // this.formData.InstituteName = '';
    // this.formData.BranchID = 0;
    // this.formData.BranchName = '';
    // this.AddedChoices = []
  }

  async DeleteOptionByID(row: any) {
    try {
      await this.ApplicationService.DeleteOptionByID(row)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message) 
            
            this.GetById();
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action on Selection!');
        });
    }
    catch (Ex) {
      console.error(Ex);
    }
  }

  async PriorityChange(row: BterOptionsDetailsDataModel, Type: string) {
    row.Type = Type

    try {
      await this.ApplicationService.PriorityChange(row)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message) 
            this.GetById();
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action on Selection!');
        });
    }
    catch (Ex) {
      console.error(Ex);
    }
  }

  async SaveAndNext() {
    this.formSubmitSuccess.emit(true);
    this.tabChange.emit(5)
  }

  async GetById() {
    this.isSubmitted = false;
    this.searchrequest.SSOID = this.SSOLoginDataModel.SSOID;
    this.searchrequest.DepartmentID = EnumDepartment.BTER;

    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetOptionalDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data && data['Data'] && data['Data'].length > 0) {
            this.AddedChoices = data['Data'].filter((item: any) => !!item.InstituteID);
            this.formData.ApplicationID = data['Data'][0].ApplicationID;
          } else {
            this.AddedChoices = [];
          }

          console.log(this.AddedChoices, 'Filtered Choices');
        }, error => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async Back() {
    this.tabChange.emit(3)
  }

  async GetInstituteListDDL() {
    console.log("formdata in institute", this.formData)
    try {
      this.collegeSearchRequest.College_TypeID = this.formData.College_TypeID
      this.collegeSearchRequest.DistrictID = this.formData.DistrictID
      this.collegeSearchRequest.ApplicationID = this.formData.ApplicationID

      this.collegeSearchRequest.InstituteID = this.formData.InstituteID
      this.collegeSearchRequest.StreamType = this.formData.CourseType

      if (this.formData.CourseType == EnumCourseType.Non_Engineering) {
        this.collegeSearchRequest.action = '_getfemalecollege'
      } else {
        this.collegeSearchRequest.action = '_getDatabyDistrict'
      }

      this.collegeSearchRequest.EndTermId = this.SSOLoginDataModel.EndTermID;

      this.loaderService.requestStarted();
      await this.commonFunctionService.BterCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterList = data.Data
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetPersonalDetailsById() {
    // const DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetApplicationDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            this.PersonalDetailsData = data['Data']
            console.log("PersonalDetailsData", this.PersonalDetailsData);

            this.formData.CourseType = data.Data.CourseType

            if (data.Data.DirectAdmissionType !== 0) {
              this.OptionsFormGroup.get('ddlManagementType')?.disable();
              this.OptionsFormGroup.get('ddlDistrict')?.disable();
              this.OptionsFormGroup.get('ddlInstitute')?.disable();
              this.OptionsFormGroup.get('ddlTrade')?.disable();
            }

          }
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

}



