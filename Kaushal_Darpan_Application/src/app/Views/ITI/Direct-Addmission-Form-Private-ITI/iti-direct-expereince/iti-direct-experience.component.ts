import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ExperienceDetailsDataModel, OptionsDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { EnumDepartment, EnumDirectAdmissionType, EnumStatus } from '../../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-iti-direct-experience',
  standalone: false,
  templateUrl: './iti-direct-experience.component.html',
  styleUrl: './iti-direct-experience.css'
})
export class ITIDirectExperienceComponent {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public ManagmentTypeList: any = []
  public DistrictMasterList: any = []
  public totals: any = [];
  public formData = new ExperienceDetailsDataModel()
  public OptionsFormGroup!: FormGroup
  public DirectAdmissionType: number = 0
  public IsJailAdmission: boolean = false
  public isSubmitted: boolean = false
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public InstituteMasterList: any = []
  public BranchName: any = []
  public ItiTradeList: any = []
  public searchRequest = new ItiApplicationSearchmodel()
  public ItiCollegesList: any = []
  public ItiTradeListAll: any = []
  public ItiCollegesListAll: any = []
  public tradeSearchRequest = new ItiTradeSearchModel()
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ApplicationID: number = 0;
  public QualificationDataList: any = []
  public box10thChecked: boolean = false
  public box8thChecked: boolean = false
  public box12thChecked: boolean = false
  public AddedChoices: ExperienceDetailsDataModel[] = []
  // public IsPriorityChange: boolean = false
  @Output() IsPriorityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public MathsMaxMarks10: number = 0
  public MathsMarksObtained10: number = 0
  public ScienceMaxMarks10: number = 0
  public ScienceMarksObtained10: number = 0

  public AddedChoices8: OptionsDetailsDataModel[] = []
  public AddedChoices12: OptionsDetailsDataModel[] = []
  public AddedChoices10: OptionsDetailsDataModel[] = []
  public PersonalDetailsData: any = []
  includedKeys: string[] = [
    'Year',
    'Month'



  ];
  Object = Object;
  constructor(
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private ItiApplicationFormService: ItiApplicationFormService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService
  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.OptionsFormGroup = this.formBuilder.group(
      {
        NameOfIndustry: ['', [Validators.required]],
        TypeOfWork: ['', [Validators.required]],
        ExperienceDetailDescription: ['', [Validators.required]],
        Year: ['', [DropdownValidators]],
        Month: ['', [DropdownValidators]]
      });




    this.searchRequest.DepartmentID = EnumDepartment.ITI;

    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    if (this.ApplicationID > 0) {
      this.searchRequest.ApplicationID = this.ApplicationID;
      this.formData.ApplicationID = this.ApplicationID;
      await this.GetById()
      await this.GetPersonalDetailsById()
      await this.calculateDynamicTotals(this.AddedChoices);
    }

    this.GetManagmentType()
    this.GetDistrictMaster()
    this.GetTradeAndColleges()
    this.QualificationDataById()

    if (this.IsJailAdmission) {

      this.OptionsFormGroup.controls['ddlManagementType'].disable();
      this.OptionsFormGroup.controls['ddlDistrict'].disable();
      this.OptionsFormGroup.controls['ddlInstitute'].disable();


    }



  }

  get _OptionsFormGroup() { return this.OptionsFormGroup.controls; }

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetManagType(EnumDepartment.ITI)
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


  async AddChoice() {
    this.isSubmitted = true
    if (this.OptionsFormGroup.invalid) {
      this.OptionsFormGroup.markAllAsTouched();
      return;
    }

    if (!this.AddedChoices) {
      this.AddedChoices =[]
    }
    this.AddedChoices.push({
      ...this.formData
    });
    await this.calculateDynamicTotals(this.AddedChoices);

    this.isSubmitted = false
    this.formData.ExperienceDetailDescription = ''
    this.formData.ExperienceID = 0
    this.formData.Month = 0
    this.formData.Year = 0
    this.formData.NameOfIndustry = ''
    this.formData.TypeOfWork = ''

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



  async DeleteOptionByID(row: any) {
    try {
      await this.ItiApplicationFormService.DeleteOptionByID(row)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)

            this.ResetOptions();
            // this.tabChange.emit(5)
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

  async PriorityChange(row: OptionsDetailsDataModel, Type: string) {
    row.Type = Type

    try {
      await this.ItiApplicationFormService.PriorityChange(row)
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

  ResetChoice() {
    this.isSubmitted = false
    //this.ItiCollegesList = []
    this.ItiTradeList = []
    /*    this.formData = new OptionsDetailsDataModel()*/

    this.formData.ApplicationID = this.ApplicationID;

  }


  async SaveOptionDetailsData() {
    if (this.AddedChoices?.length == 0) {
      this.toastr.error("Please Add Least One Data")
      return
    }

     try {
 
       this.loaderService.requestStarted();
     
       

       this.AddedChoices.map((choice: any) => {
         choice.ApplicationID = this.ApplicationID
         choice.ModifyBy = this.SSOLoginDataModel.UserID

       })



       console.log("Final AddedChoices", this.AddedChoices);
       await this.ItiApplicationFormService.SaveExperienceDetails(this.AddedChoices)
          .then(async (data: any) => {
            if (data.State == EnumStatus.Success) {
              this.toastr.success(data.Message) 

              this.ResetOptions();
               this.tabChange.emit(4)
            
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
     catch (ex) {
       console.log(ex);
     }
     finally {
       setTimeout(() => {
         this.loaderService.requestEnded();
         this.isSubmitted = false;
       }, 200);
     }
  }

  ResetOptions() {
    this.isSubmitted = false

    this.formData = new ExperienceDetailsDataModel

    this.formData.ApplicationID = this.ApplicationID;

  }

  async calculateDynamicTotals(data: any[]) {

    debugger
    this.totals = {};

    // Initialize totals
    this.includedKeys.forEach(key => {
      this.totals[key] = 0;
    });

    // Sum values
    data.forEach(row => {

      this.includedKeys.forEach(key => {

        const value = row[key];

        if (value !== null && value !== '' && !isNaN(value)) {
          this.totals[key] = (this.totals[key] || 0) + Number(value);
        }

      });

    });

    // Convert total months to year + month
    const totalMonths = (this.totals['Year'] * 12) + this.totals['Month'];

    this.totals['Year'] = Math.floor(totalMonths / 12);
    this.totals['Month'] = totalMonths % 12;

  }


  async GetById() {

    this.isSubmitted = false;

    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetExpereinceDetailsbyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("AddedChoices on getby id", data.Data)
          this.AddedChoices = data['Data']
          console.log(this.AddedChoices, "addeddata")
         

        

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //calculatePercentages(): void {
  //  const mathMax = this.MathsMaxMarks10 || 0;
  //  const mathObtained = this.MathsMarksObtained10 || 0;
  //  this.tradeSearchRequest.MathPercentage = (mathMax == 0)
  //    ? '0.00'
  //    : ((mathObtained / mathMax) * 100).toFixed(2);

  //  const scienceMax = this.ScienceMaxMarks10 || 0;
  //  const scienceObtained = this.ScienceMarksObtained10 || 0;
  //  this.tradeSearchRequest.SciencePercentage = (scienceMax == 0)
  //    ? '0.00'
  //    : ((scienceObtained / scienceMax) * 100).toFixed(2);
  //}




  async GetTradeAndColleges() {
    this.tradeSearchRequest.action = '_getAllData'
    try {

      this.loaderService.requestStarted();
      await this.commonFunctionService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeListAll = data.Data

      })

      this.collegeSearchRequest.action = '_getAllData'
      await this.commonFunctionService.ItiCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiCollegesListAll = data.Data

      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async Back() {
    this.tabChange.emit(0)
  }

  async QualificationDataById() {
    this.isSubmitted = false;

    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetQualificationDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.QualificationDataList = data.Data
          console.log("this.QualificationDataList", this.QualificationDataList)
          this.QualificationDataList.map((list: any) => {
            if (list.Qualification == "10") {
              this.box10thChecked = true
              //this.MathsMaxMarks10 = this.QualificationDataList.MathsMaxMarks
              //this.MathsMarksObtained10 = this.QualificationDataList.MathsMarksObtained
              //this.ScienceMaxMarks10 = this.QualificationDataList.ScienceMaxMarks
              //this.ScienceMarksObtained10 = this.QualificationDataList.ScienceMarksObtained
            }
            if (list.Qualification == "8") {
              this.box8thChecked = true
            }
            if (list.Qualification == "12") {
              this.box12thChecked = true
            }
          })
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
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
      await this.ItiApplicationFormService.GetApplicationDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            this.PersonalDetailsData = data['Data']
            debugger


            console.log("PersonalDetailsData", this.PersonalDetailsData);
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
  async DeleteExperience(idx: number) {
    this.AddedChoices.splice(idx, 1);
    await this.calculateDynamicTotals(this.AddedChoices);
  }
}
