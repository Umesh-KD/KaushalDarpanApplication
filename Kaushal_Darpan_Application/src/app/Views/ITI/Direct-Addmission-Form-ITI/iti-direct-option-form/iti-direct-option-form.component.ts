import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { OptionsDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { EnumDepartment, EnumDirectAdmissionType, EnumStatus } from '../../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-iti-direct-option-form',
  standalone: false,
  templateUrl: './iti-direct-option-form.component.html',
  styleUrl: './iti-direct-option-form.component.css'
})
export class ITIDirectOptionFormComponent {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public ManagmentTypeList: any = []
  public DistrictMasterList: any = []
  public formData = new OptionsDetailsDataModel()
  public OptionsFormGroup!: FormGroup
  public DirectAdmissionType: number = 0
  public IsJailAdmission: boolean=false
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
  public box8thChecked: boolean =false
  public box12thChecked: boolean =false
  public AddedChoices: OptionsDetailsDataModel[] = []  
  // public IsPriorityChange: boolean = false
  @Output() IsPriorityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public MathsMaxMarks10: number = 0
  public MathsMarksObtained10: number = 0
  public ScienceMaxMarks10: number = 0
  public ScienceMarksObtained10 :number=0

  public AddedChoices8: OptionsDetailsDataModel[] = []
  public AddedChoices12: OptionsDetailsDataModel[] = []
  public AddedChoices10: OptionsDetailsDataModel[] = []
  public PersonalDetailsData: any = []

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
        ddlManagementType: ['', [DropdownValidators]],
        ddlDistrict: ['', [DropdownValidators]],
        ddlInstitute: ['', [DropdownValidators]],
        ddlTrade: ['', [DropdownValidators]],
        TradeLevel: ['', [DropdownValidators]]
      });




    this.searchRequest.DepartmentID = EnumDepartment.ITI;

    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0) {
      this.searchRequest.ApplicationID = this.ApplicationID;
      this.formData.ApplicationID = this.ApplicationID;
     await this.GetById()
    await  this.GetPersonalDetailsById()
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

  async GetInstituteDetails() {
    try {
      
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetCommonMasterData('JailCollege', this.SSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          this.formData.ManagementTypeID = data['Data'][0]['ManagementTypeId'];
          this.formData.DistrictID = data['Data'][0]['DistrictId'];
    
          this.GetInstituteListDDL()
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

  get CheckInstitute(): boolean {
    const insdtitutexist = this.AddedChoices.some(x => x.InstituteID == this.formData.InstituteID && x.InstituteID == this.formData.TradeID)
    if (insdtitutexist) {
      return true
    } else {
      return false
    }
  }




  async AddChoice() {
    
    this.AddedChoices = [];
    const AddedChoices_8: OptionsDetailsDataModel[] = [];
    const AddedChoices_10: OptionsDetailsDataModel[] = [];
    const AddedChoices_12: OptionsDetailsDataModel[] = [];

    this.isSubmitted = true
    if (this.OptionsFormGroup.invalid)
    {
      this.OptionsFormGroup.markAllAsTouched();
      return;
    }
    if (this.formData.InstituteID == 0 || this.formData.InstituteID == null)
    {
      this.toastr.error("आईटीआई")
    }

    if (this.formData.TradeID == 0 || this.formData.TradeID == null) {
      this.toastr.error("Trade Name")
    }


    if (this.CheckInstitute) {
      this.toastr.error("आपने पहले ही इस संयोजन को चुन लिया है")
    }
    else {
      this.formData.ManagementTypeName = this.ManagmentTypeList.filter((x: any) => x.InstitutionManagementTypeID == this.formData.ManagementTypeID)[0]['InstitutionManagementType'];
      this.formData.DistrictName = this.DistrictMasterList.filter((x: any) => x.ID == this.formData.DistrictID)[0]['Name'];
      debugger
      if (this.IsJailAdmission) {
        this.formData.InstituteName = this.ItiCollegesList.filter((x: any) => x.InstituteID == this.formData.InstituteID)[0]['InstituteName'];
      } else {
        this.formData.InstituteName = this.ItiCollegesListAll.filter((x: any) => x.Id == this.formData.InstituteID)[0]['CodeAndName'];
      }
  
      this.formData.TradeName = this.ItiTradeList.filter((x: any) => x.Id == this.formData.TradeID)[0]['TradeName'];
      
      console.log("trade name", this.formData.TradeName)

      if (this.formData.TradeLevel == 8) {
        const insdtitutexist = this.AddedChoices8.some(x => x.InstituteID == this.formData.InstituteID && x.TradeID == this.formData.TradeID)
        if (insdtitutexist) {
          this.toastr.error("आपने पहले ही इस संयोजन को चुन लिया है")
          return
        }
        this.formData.Priority = this.AddedChoices8.length + 1;
        this.AddedChoices8.push({
          ...this.formData
        });

        AddedChoices_8.push({
          ...this.formData
        });

      }
      else if (this.formData.TradeLevel == 10) {
        const insdtitutexist = this.AddedChoices10.some(x => x.InstituteID == this.formData.InstituteID && x.TradeID == this.formData.TradeID)
        if (insdtitutexist) {
          this.toastr.error("आपने पहले ही इस संयोजन को चुन लिया है")
          return
        }
        this.formData.Priority = this.AddedChoices10.length + 1;
        this.AddedChoices10.push({
          ...this.formData
        });

        AddedChoices_10.push({
          ...this.formData
        });

      }
      else if (this.formData.TradeLevel == 12) {
        const insdtitutexist = this.AddedChoices12.some(x => x.InstituteID == this.formData.InstituteID && x.TradeID == this.formData.TradeID)
        if (insdtitutexist) {
          this.toastr.error("आपने पहले ही इस संयोजन को चुन लिया है")
          return
        }
        this.formData.Priority = this.AddedChoices12.length + 1;
        this.AddedChoices12.push({
          ...this.formData
        });

        AddedChoices_12.push({
          ...this.formData
        });

      }

      this.AddedChoices = [...AddedChoices_8, ...AddedChoices_10, ...AddedChoices_12];

      console.log("AddedChoices8", this.AddedChoices8);
      console.log("AddedChoices10", this.AddedChoices10);
      console.log("AddedChoices12", this.AddedChoices12);
      console.log("AddedChoices (combined)", this.AddedChoices);

      //this.OptionsFormGroup.reset();
      //this.formData = new OptionsDetailsDataModel();
      this.formData.TradeID = 0
      this.isSubmitted = false
    }

    await this.ItiApplicationFormService.SaveOptionDetailsData(this.AddedChoices)
      .then(async (data: any) => {
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message) 
          this.AddedChoices = [...this.AddedChoices8, ...this.AddedChoices10, ...this.AddedChoices12];
          this.ResetOptions();
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
    this.ItiCollegesList = []
    this.ItiTradeList = []
    this.formData = new OptionsDetailsDataModel()
    this.formData.ApplicationID = this.ApplicationID;

  }

  deleteRow(index: number, tradeLevel: number){
    if (tradeLevel === 8) {
      this.AddedChoices8.splice(index, 1);
      this.AddedChoices8.forEach((item, i) => {
        item.Priority = i + 1;
      });
    } else if (tradeLevel === 10) {
      this.AddedChoices10.splice(index, 1);
      this.AddedChoices10.forEach((item, i) => {
        item.Priority = i + 1;
      });
    }
    else if (tradeLevel === 12) {
      this.AddedChoices12.splice(index, 1);
      this.AddedChoices12.forEach((item, i) => {
        item.Priority = i + 1;
      });
    }
    this.IsPriorityChange.emit(true)
  }

  priorityUp(index: number, tradeLevel: number) {
    if (index > 0) {
      let temp: any;
      if (tradeLevel === 8) {
        temp = this.AddedChoices8[index];
        this.AddedChoices8[index] = this.AddedChoices8[index - 1];
        this.AddedChoices8[index - 1] = temp;
        this.AddedChoices8[index].Priority = index + 1;
        this.AddedChoices8[index - 1].Priority = index;
      } else if (tradeLevel === 10) {
        temp = this.AddedChoices10[index];
        this.AddedChoices10[index] = this.AddedChoices10[index - 1];
        this.AddedChoices10[index - 1] = temp;
        this.AddedChoices10[index].Priority = index + 1;
        this.AddedChoices10[index - 1].Priority = index;
      }
      else if (tradeLevel === 12) {
        temp = this.AddedChoices12[index];
        this.AddedChoices12[index] = this.AddedChoices12[index - 1];
        this.AddedChoices12[index - 1] = temp;
        this.AddedChoices12[index].Priority = index + 1;
        this.AddedChoices12[index - 1].Priority = index;
      }

      this.IsPriorityChange.emit(true)
    }
  }

  priorityDown(index: number, tradeLevel: number) {
    if (index < (tradeLevel === 8 ? this.AddedChoices8.length : this.AddedChoices10.length) - 1) {
      let temp: any;
      if (tradeLevel === 8) {
        temp = this.AddedChoices8[index];
        this.AddedChoices8[index] = this.AddedChoices8[index + 1];
        this.AddedChoices8[index + 1] = temp;
        this.AddedChoices8[index].Priority = index + 1;
        this.AddedChoices8[index + 1].Priority = index + 2;
      } else if (tradeLevel === 10) {
        temp = this.AddedChoices10[index];
        this.AddedChoices10[index] = this.AddedChoices10[index + 1];
        this.AddedChoices10[index + 1] = temp;
        this.AddedChoices10[index].Priority = index + 1;
        this.AddedChoices10[index + 1].Priority = index + 2;
      }
      else if (tradeLevel === 12) {
        temp = this.AddedChoices12[index];
        this.AddedChoices12[index] = this.AddedChoices12[index + 1];
        this.AddedChoices12[index + 1] = temp;
        this.AddedChoices12[index].Priority = index + 1;
        this.AddedChoices12[index + 1].Priority = index + 2;
      }
      this.IsPriorityChange.emit(true)
    }
  }

  async SaveOptionDetailsData() {
    if (this.AddedChoices8.length == 0 && this.AddedChoices10.length == 0 && this.AddedChoices12.length ==0) {
      this.toastr.error("Please Select at least One Option")
      return
    }
    this.tabChange.emit(2)
    // try {
    //   this.isSubmitted = true;
    //   this.loaderService.requestStarted();
    //   if(this.box8thChecked && this.AddedChoices8.length < 1) {
    //     this.toastr.error("Please Add atleast one option for 8th Trade Level")
    //     return
    //   } else if(this.box10thChecked && this.AddedChoices10.length < 1) {
    //     this.toastr.error("Please Add atleast one option for 10th Trade Level")
    //     return
    //   } 
    //   else if (this.box12thChecked && this.AddedChoices12.length < 1) {
    //     this.toastr.error("Please Add atleast one option for 12th Trade Level")
    //     return
    //   } 
    //   this.AddedChoices = [...this.AddedChoices8, ...this.AddedChoices10, ...this.AddedChoices12];

    //   this.AddedChoices.map((choice: any) => {
    //     choice.ApplicationID = this.ApplicationID
    //     choice.ModifyBy = this.SSOLoginDataModel.UserID
    
    //   })
    //   this.AddedChoices.forEach(e => e.AcademicYear = this.SSOLoginDataModel.FinancialYearID_Session)

      
    //   console.log("Final AddedChoices", this.AddedChoices);
    //   // await this.ItiApplicationFormService.SaveOptionDetailsData(this.AddedChoices)
    //   //   .then(async (data: any) => {
    //   //     if (data.State == EnumStatus.Success) {
    //   //       this.toastr.success(data.Message) 
            
    //   //       this.ResetOptions();
    //   //       // this.tabChange.emit(5)
    //   //       this.AddedChoices = []
    //   //     }
    //   //     else {
    //   //       this.toastr.error(data.ErrorMessage)
    //   //     }
    //   //   })
    //   //   .catch((error: any) => {
    //   //     console.error(error);
    //   //     this.toastr.error('Failed to Action on Selection!');
    //   //   });
    // }
    // catch (ex) {
    //   console.log(ex);
    // }
    // finally {
    //   setTimeout(() => {
    //     this.loaderService.requestEnded();
    //     this.isSubmitted = false;
    //   }, 200);
    // }
  }

  ResetOptions() {
    this.isSubmitted = false
    this.formData.TradeID = 0

    this.formData.ApplicationID = this.ApplicationID;
    this.GetById()
  }




  async GetById() {
    
    this.isSubmitted = false;
    this.AddedChoices = []
    this.AddedChoices8 = []
    this.AddedChoices10 = []
    this.AddedChoices12 = []
    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetOptionDetailsbyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("AddedChoices on getby id",data.Data)
          this.AddedChoices = data['Data']
          console.log(this.AddedChoices,"addeddata")
          this.formData.ApplicationID = data['Data'][0].ApplicationID;

          this.AddedChoices.map((choice: any) => {
            if(choice.TradeLevel == 8) {
              this.AddedChoices8.push(choice)
            }
            else if (choice.TradeLevel == 10) {
              this.AddedChoices10.push(choice)
            }
            else if (choice.TradeLevel == 12) {
              this.AddedChoices12.push(choice)
            } 
          })

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

  async GetInstituteListDDL() {
    try {


      if (
        this.IsJailAdmission == true


      ) {
        await this.commonFunctionService.InstituteMaster(2,0,0).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          this.ItiCollegesList = data.Data
          this.formData.InstituteID = this.SSOLoginDataModel.InstituteID

          this.GetInstituteListByTradeType()
        })
      } else {



        this.tradeSearchRequest.DistrictID = this.formData.DistrictID
        this.tradeSearchRequest.ManagementTypeID = this.formData.ManagementTypeID
        this.tradeSearchRequest.action = '_getCollegebyDistrict'

        this.ItiTradeList = [];
        this.ItiCollegesList = [];
        this.formData.TradeLevel = 0

        this.formData.InstituteID = 0;
        this.formData.TradeID = 0;

        this.tradeSearchRequest.CollegeID = this.formData.InstituteID
        this.tradeSearchRequest.TradeLevel = this.formData.TradeLevel

        this.tradeSearchRequest.Age = this.PersonalDetailsData.Age




        this.loaderService.requestStarted();
        await this.commonFunctionService.ITI_DeirectAdmissionOptionFormData(this.tradeSearchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ItiCollegesList = data.Data
          this.GetInstituteListByTradeType()
        })


      }

    } catch (error) {
      console.error(error)
    } finally {
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


  async GetInstituteListByTradeType() {
    try {

      if (this.IsJailAdmission) {
        this.GetTradeListDDL()
        return
      }

      
      this.ItiTradeList = [];
      this.ItiCollegesList = [];

      this.formData.InstituteID = 0;
      this.formData.TradeID = 0;

      this.tradeSearchRequest.CollegeID = this.formData.InstituteID
      this.tradeSearchRequest.TradeLevel = this.formData.TradeLevel
      if (this.PersonalDetailsData.CategoryC === 69) {
        this.tradeSearchRequest.IsPH = 1
      } else {
        this.tradeSearchRequest.IsPH = 0
      }
      this.tradeSearchRequest.Gender = this.PersonalDetailsData.Gender
      this.tradeSearchRequest.Age = this.PersonalDetailsData.Age
      this.tradeSearchRequest.DistrictID = this.formData.DistrictID
      this.tradeSearchRequest.ManagementTypeID = this.formData.ManagementTypeID
    
      this.tradeSearchRequest.action = '_getCollegeoByTrade'

      this.loaderService.requestStarted();
      await this.commonFunctionService.ITI_DeirectAdmissionOptionFormData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiCollegesList = data.Data
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetTradeListDDL() {


    try {
      this.tradeSearchRequest.CollegeID = this.formData.InstituteID
      this.tradeSearchRequest.TradeLevel = this.formData.TradeLevel
      if (this.PersonalDetailsData.CategoryC === 69) {
        this.tradeSearchRequest.IsPH = 1
      } else {
        this.tradeSearchRequest.IsPH = 0
      }
      this.tradeSearchRequest.Gender = this.PersonalDetailsData.Gender
      this.tradeSearchRequest.Age = this.PersonalDetailsData.Age
      this.tradeSearchRequest.DistrictID = this.formData.DistrictID
      this.tradeSearchRequest.ManagementTypeID = this.formData.ManagementTypeID
      if (this.IsJailAdmission) {
    
        this.tradeSearchRequest.action = 'JailAdmisiiontrade'
      } else {
        this.tradeSearchRequest.action = '_getTradebyCollege'
      }


      this.loaderService.requestStarted();
      await this.commonFunctionService.ITI_DeirectAdmissionOptionFormData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeList = data.Data
        console.log("this.ItiTradeList",this.ItiTradeList)
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

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
            if(list.Qualification == "10") {
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
          if (data['Data'] != null){ 
            this.PersonalDetailsData = data['Data']
            debugger
            if (data['Data']['DirectAdmissionType'] == EnumDirectAdmissionType.JailAdmission) {
              this.IsJailAdmission = true
              if (this.IsJailAdmission) {
                this.GetInstituteDetails()
              }


            }

            console.log("PersonalDetailsData",this.PersonalDetailsData);
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
