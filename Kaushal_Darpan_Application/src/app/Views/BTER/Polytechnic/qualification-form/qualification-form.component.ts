import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BterSearchmodel, LateralEntryQualificationModel, Lateralsubject, QualificationDataModel, SupplementaryDataModel } from '../../../Models/ApplicationFormDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { ToastrService } from 'ngx-toastr';
import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus } from '../../../Common/GlobalConstants';
import { JanAadharMemberDetails } from '../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { max } from 'rxjs';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-qualification-form',
  templateUrl: './qualification-form.component.html',
  styleUrls: ['./qualification-form.component.css'],
  standalone: false
})
export class QualificationFormComponent implements OnInit {
  public QualificationForm!: FormGroup
  public SupplementaryForm!: FormGroup
  public RadioForm!: FormGroup
  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new QualificationDataModel()
  public addrequest = new SupplementaryDataModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public marktypelist: any = []
  public isSupplement: boolean = false
  calculatedPercentage: number = 0;
  public settingsMultiselect: object = {};
  public searchrequest = new BterSearchmodel()
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public ApplicationID: number = 0;
  public Lateralcourselist: any = []
  public _EnumCourseType = EnumCourseType
  public LateralQualificationForm !: FormGroup
  public action: string = ''
  public SubjectMasterDDLList: any = []
  public SubjectID: Lateralsubject[] = []
  public lateralrequest = new LateralEntryQualificationModel()
  public errormessage: string = ''
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: BterApplicationForm,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService
  ) { }

  async ngOnInit() {
    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      IsVerified: false,
    };

    this.QualificationForm = this.formBuilder.group(
      {
        txtRollNumber: ['', [Validators.required]],

        txtAggregateMaximumMarks: ['', [DropdownValidators]],
          txtAggregateMarksObtained: ['', [DropdownValidators]],
        txtpercentage: [{ value: '', disabled: true }],
        //ddlStateID: ['', [DropdownValidators]],
        ddlBoardID: ['', [DropdownValidators]],
        ddlPassyear: ['', [DropdownValidators]],
        ddlMarksType: ['', [DropdownValidators]],
      });

    this.SupplementaryForm = this.formBuilder.group(
      {

        txtsubject: ['', Validators.required],
        txtRollNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],

        ddlPassingYear: ['', [DropdownValidators]],

      });
    this.RadioForm = this.formBuilder.group(
      {
        SubjectRadio: ['']
      }
    )
    this.LateralQualificationForm = this.formBuilder.group(
      {
        ddlCourseID: ['', [DropdownValidators]],
        txtRollNumber: ['',Validators.required],

        txtAggregateMaximumMarks: ['', [DropdownValidators]],
        txtAggregateMarksObtained: ['', [DropdownValidators]],
        txtpercentage: [{ value: '', disabled: true }],
        //ddlStateID: ['', [DropdownValidators]],
        ddlBoardID: ['', [DropdownValidators]],
        ddlPassyear: ['', [DropdownValidators]],
        ddlMarksType: ['', [DropdownValidators]],
        SubjectID: ['', Validators.required]
      }

    )




    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*    this.HRManagerID = Number(this.activatedRoute.snapshot.queryParamMap.get('HRManagerID')?.toString());*/
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = EnumDepartment.BTER;

    await this.loadDropdownData('Board')
    await this.GetStateMatserDDL()
    await this.GetPassingYearDDL()
    this.calculatePercentage()
    this.calculateLateralPercentage()
    this.GetMarktYPEDDL()
    this.GetLateralCourse()


    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.GetById();
      if (this.request.IsFinalSubmit == 2) {
        window.open(`/PreviewForm?AppID=${this.ApplicationID}`, "_self");
      }
    }
   
  }



  onItemSelect(item: any, centerID: number) {

    if (!this.SubjectID.includes(item)) {
      this.SubjectID.push(item);
    }

  }

  onDeSelect(item: any, centerID: number) {

    /*  this.SubjectID = this.SubjectID.filter((i: any) => i.InstituteID !== item.InstituteID);*/

  }

  onSelectAll(items: any[], centerID: number) {

    /*    this.SelectedSubjectList = [...items];*/

  }

  onDeSelectAll(centerID: number) {

    /*  this.SelectedSubjectList = [];*/

  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  get _QualificationForm() { return this.QualificationForm.controls; }
  get _SupplementaryForm() { return this.SupplementaryForm.controls; }
  get _LateralQualificationForm() { return this.LateralQualificationForm.controls; }


  async OnShow(item: any) {

    if (item == 1) {
      this.isSupplement = true



    } else {
      this.isSupplement = false
      this.request.SupplementaryDataModel = []


    }
  }


  passingYearValidation() {

    if (this.request.CourseType == EnumCourseType.Lateral && this.request.PassingID != '' && this.lateralrequest.PassingID != '' && this.lateralrequest.PassingID <= this.request.PassingID) {
      this.lateralrequest.PassingID = '';
      this.GetPassingYearDDL()
      this.toastr.error('Passing Year of Higher Qualification must be greater than 10th Passing Year', 'Error');
  
      return;
      //} else if (this.request.PassingID != '' && this.lateralrequest.PassingID != '' && this.request.PassingID > this.lateralrequest.PassingID) {

      //  this.toastr.error('Passing Year of 8th must be less than or equal to Highest Qualification Passing Year', 'Error');
      //  this.formData.YearofPassingHigh = '';
      //  return;
      //} else if (this.formData10th.YearofPassing10 != '' && this.formData.YearofPassingHigh != '' && this.formData10th.YearofPassing10 > this.formData.YearofPassingHigh) {

      //  this.toastr.error('Passing Year of 10th must be less than or equal to Highest Qualification Passing Year', 'Error');
      //  this.formData10th.YearofPassing10 = '';
      //  return;

    }//}

    //if (this.request.PassingID != '' && this.addrequest.PassingID != '' && this.addrequest.PassingID >= this.request.PassingID) {

    //  this.toastr.error('Year of Supplementry must be less than 10th Passing Year', 'Error');
    //  this.addrequest.PassingID = ''
    //  this.GetPassingYearDDL()
    //  return
    //}
    //if (this.lateralrequest.PassingID != '' && this.addrequest.PassingID != '' && this.addrequest.PassingID >= this.lateralrequest.PassingID) {
    //  this.addrequest.PassingID = ''
    //  this.toastr.error('Year of Supplementry must be less than Higher Qualification Passing Year', 'Error');
    //  return
    //}
  }





  async AddNew() {

    this.isSubmitted = true;
    if (this.SupplementaryForm.invalid) {
      return console.log("error");
    }
    //Show Loading
    if (this.request.PassingID < this.addrequest.PassingID) {
      this.toastr.warning('Please Enter Supplementary Year Of Passing less than or equal to 10th Qualification Year', 'Error');
      return console.log("error");
      this.addrequest.PassingID=''
    }

    try {

      /*this.addrequest.PassingID = this.FinalcialList.filter((x: any) => x.FinancialYearID == this.EducationalQualificationFormData.PassingYearID)[0]['FinancialYearName'];*/
      this.request.SupplementaryDataModel.push(
        {

          PassingID: this.addrequest.PassingID,
          RollN0: this.addrequest.RollN0,
          Subject: this.addrequest.Subject,
          SupplementryID: 0


        },

      );

      this.isSubmitted = false

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(async () => {
        await this.ResetRow();
        this.loaderService.requestEnded();

      }, 200);
    }
  }




  async CancelData() {

    this.request.StateID = 0;
    this.request.BoardID = 0;
    this.request.PassingID = '';
    this.request.RollNumber = '';
    this.request.MarkType = 0;
    this.request.AggMaxMark = 0;
    this.request.Percentage = '';
    this.request.AggObtMark = 0;
    this.request.SupplementaryDataModel = [];
    this.request.IsSupplement = false;
    this.lateralrequest = new LateralEntryQualificationModel()
    this.SubjectID = []

  }

  async ResetRow() {
    this.loaderService.requestStarted();

    this.addrequest.PassingID = '';
    this.addrequest.Subject = '';
    this.addrequest.RollN0 = '';


    // this.isSubmittedItemDetails = false;
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);
  }



  async btnRowDelete_OnClick(item: SupplementaryDataModel) {
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.SupplementaryDataModel.indexOf(item);
        if (index != -1) {
          this.request.SupplementaryDataModel.splice(index, 1)
        }
      }
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


  async btnEdit_OnClick(item: SupplementaryDataModel) {
  try {
    this.loaderService.requestStarted();
    const index: number = this.request.SupplementaryDataModel.indexOf(item);
    if (index != -1) {
      this.request.SupplementaryDataModel.splice(index, 1)
    }
    // Your logic to populate form or set current item for editing
    this.addrequest = { ...item }; // Deep copy to avoid auto-updating original
    this.SupplementaryForm.patchValue(this.addrequest); // If using reactive form

    // Optionally, scroll to form or open edit section
    // e.g., this.scrollToEditForm();
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




  async loadDropdownData(MasterCode: string) {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Board':
          this.BoardList = data['Data'];
          console.log(this.BoardList)
          break;
        default:
          break;
      }
    });
  }

  async GetStateMatserDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.stateMasterDDL = data['Data'];

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

  async GetMarktYPEDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MarksType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.marktypelist = data['Data'];

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
  async GetLateralCourse() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('LateralAdmission')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.Lateralcourselist = data['Data'];

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

  async GetStreamCourse() {
    try {

      this.loaderService.requestStarted();
      if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        this.action = "Lateral_Diploma"
        this.lateralrequest.Qualification = "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        this.lateralrequest.Qualification = "ITI_Tenth"
      }
      this.SubjectID = []

      await this.commonMasterService.GetCommonMasterData(this.action)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SubjectMasterDDLList = data['Data'];
          console.log(this.SubjectMasterDDLList)

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

  async GetPassingYearDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.AdmissionPassingYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.PassingYearList = data['Data'];

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

  //refreshBranchRefValidation(isValidate: boolean) {

  //  // clear
  //  this.SupplementaryForm.get('txtRollNo')?.clearValidators();
  //  this.SupplementaryForm.get('txtsubject')?.clearValidators();
  //  this.SupplementaryForm.get('ddlPassingYear')?.clearValidators();
  //  // set
  //  if (isValidate) {
  //    this.SupplementaryForm.get('txtRollNo')?.setValidators(Validators.required);
  //    this.SupplementaryForm.get('txtsubject')?.setValidators(Validators.required);
  //    this.SupplementaryForm.get('ddlPassingYear')?.setValidators([DropdownValidators]);
  //  }
  //  // update
  //  this.SupplementaryForm.get('txtRollNo')?.updateValueAndValidity();
  //  this.SupplementaryForm.get('txtsubject')?.updateValueAndValidity();
  //  this.SupplementaryForm.get('ddlPassingYear')?.updateValueAndValidity();
  //}




  async SaveData() {

    this.isSubmitted = true;
    if (this.QualificationForm.invalid) {
      return
    }
    if (this.request.IsSupplement == true) {
      if (this.request.SupplementaryDataModel.length < 1) {
        this.toastr.error("please Add Supplementry details")
        return
      }

    }

    this.Swal2.Confirmation("Are you sure you want to Submit this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
        




            this.request.LateralEntryQualificationModel = []
            if (this.request.CourseType == EnumCourseType.Lateral) {
              if (this.LateralQualificationForm.invalid) {
                return
              }
              if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
                if (this.SubjectID.length != 1) {
                  this.toastr.error("Please Select Only One Stream")
                  this.isSubmitted = false
                  return
                }

              } else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
                if (this.SubjectID.length != 1) {
                  this.toastr.error("Please Select Only One trade")
                  this.isSubmitted = false
                  return
                }

              } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
                if (this.SubjectID.length != 3) {
                  this.toastr.error("Please Select 3 Subjects")
                  this.isSubmitted = false
                  return
                }



              }

              this.SubjectID.forEach(e => e.CourseID = this.lateralrequest.CourseID)
              this.request.LateralEntryQualificationModel.push({
                CourseID: this.lateralrequest.CourseID,
                SubjectID: this.SubjectID,
                BoardID: this.lateralrequest.BoardID,
                PassingID: this.lateralrequest.PassingID,
                AggMaxMark: this.lateralrequest.AggMaxMark,
                AggObtMark: this.lateralrequest.AggObtMark,
                Percentage: this.lateralrequest.Percentage,
                Qualification: this.lateralrequest.Qualification,
                RollNumber: this.lateralrequest.RollNumber,
                StateID: this.lateralrequest.StateID,
                MarkType: this.lateralrequest.MarkType,
                ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId

              })
            }
            console.log(this.request)

            this.request.LateralCourseID = this.lateralrequest.CourseID

            this.isLoading = true;

            this.loaderService.requestStarted();

            this.request.ModifyBy = this.sSOLoginDataModel.UserID;

            this.request.ApplicationID = this.ApplicationID;
            this.request.QualificationID = 10

            //save
            await this.ApplicationService.SaveQualificationData(this.request)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.formSubmitSuccess.emit(true); // Notify parent of success
                  this.tabChange.emit(1); //
                  this.CancelData();
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
      });

  }






  calculatePercentage(): void {
    
    let maxMarks = this.request.AggMaxMark;
    const marksObtained = this.request.AggObtMark;
    if (Number(this.request.AggObtMark) > Number(this.request.AggMaxMark)) {
      this.request.Percentage = '';
      this.request.AggObtMark = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.request.MarkType == 84) {
      maxMarks = 10
      this.request.AggMaxMark = 10
      this.QualificationForm.get('txtAggregateMaximumMarks')?.disable();
      if (this.request.AggObtMark > 10) {
        this.request.AggObtMark = 0;
        this.request.Percentage = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if(percentage < 33){
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.request.Percentage = '';
          this.request.AggObtMark = 0;
        } else {
          this.request.Percentage = percentage.toFixed(2);
        }
      } else {
        this.request.Percentage = '';
      }
    } else if (this.request.MarkType == 83)
    {
      this.QualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && Number( marksObtained) <= Number(maxMarks))
      {
        const percentage = (marksObtained / maxMarks) * 100;
        if(percentage < 33){
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.request.Percentage = '';
          this.request.AggObtMark = 0;
        } else {
          this.request.Percentage = percentage.toFixed(2);
        }
        
      } else {
        this.request.Percentage = '';
      }
      if (this.request.SupplementaryDataModel == null) {
        this.request.SupplementaryDataModel=[]
      }
    }
  }

  calculateLateralPercentage(): void {
    let maxMarks = this.lateralrequest.AggMaxMark;
    const marksObtained = this.lateralrequest.AggObtMark;
    if (Number(this.lateralrequest.AggObtMark) > Number(this.lateralrequest.AggMaxMark)) {
      this.lateralrequest.Percentage = '';
      this.lateralrequest.AggObtMark = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.lateralrequest.MarkType == 84) {
      
      maxMarks = 10
      this.lateralrequest.AggMaxMark = 10
      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.disable();
      if (this.lateralrequest.AggObtMark > 10) {
        this.lateralrequest.AggObtMark = 0;
        this.lateralrequest.Percentage = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if(percentage <= 33){
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.lateralrequest.Percentage = '';
          this.lateralrequest.AggObtMark = 0;
        } else {
          this.lateralrequest.Percentage = percentage.toFixed(2);
        }
        
      } else {
        this.lateralrequest.Percentage = '';
      }
    } else if (this.lateralrequest.MarkType == 83) {
     
      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = (marksObtained / maxMarks) * 100;
        if(percentage <= 33){
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.lateralrequest.Percentage = '';
          this.lateralrequest.AggObtMark = 0;
        } else {
          this.lateralrequest.Percentage = percentage.toFixed(2);
        }
      } else {
        this.lateralrequest.Percentage = '';
      }
      //if (this.request.SupplementaryDataModel == null) {
      //  this.request.SupplementaryDataModel = []
      //}
    }
  }




  //calculateLateralPercentage(): void {
  //  const maxMarks = this.lateralrequest.AggMaxMark;
  //  const marksObtained = this.lateralrequest.AggObtMark;

  //  if (this.lateralrequest.MarkType == 84) {
  //    if (maxMarks && marksObtained) {
  //      const percentage = marksObtained * 9.5;
  //      this.lateralrequest.Percentage = percentage.toFixed(2);
  //    } else {
  //      this.lateralrequest.Percentage = '';
  //    }
  //  } else if (this.lateralrequest.MarkType == 83) {
  //    if (maxMarks && marksObtained) {
  //      const percentage = (marksObtained / maxMarks) * 100;
  //      this.lateralrequest.Percentage = percentage.toFixed(2);
  //    } else {
  //      this.lateralrequest.Percentage = '';
  //    }
      
  //  }
  //}


  async GetById() {
    this.isSubmitted = false;
    this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetQualificationDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data,'ada');
          this.request.ApplicationID = data['Data']['ApplicationID']
          if (data['Data'] != null) {
            this.request = data['Data']
            this.request.IsSupplement = data['Data']['IsSupplement']
           /* alert(this.request.IsSupplement)*/
            if (data['Data']['IsSupplement'] === true)
            {
              this.isSupplement = true
            }
            else
            {
              this.isSupplement = false
            }

            if (this.request.PassingID == null) {
              this.request.PassingID = ''
            } else {
              this.request.PassingID=data['Data']['PassingID']
            }
            //if (this.request.LateralEntryQualificationModel.CourseID == null) {
            //  this.request.LateralEntryQualificationModel.CourseID = 0
            //} else {
            //  this.request.LateralEntryQualificationModel.CourseID = data['Data']['CourseID']
            //}
         
            if (this.request.SupplementaryDataModel == null) {
              this.request.SupplementaryDataModel = []
              this.addrequest = new SupplementaryDataModel()
            }
            if (this.request.LateralEntryQualificationModel == null) {
              this.request.LateralEntryQualificationModel = []
              this.lateralrequest = new LateralEntryQualificationModel()
            } else {
              this.request.LateralEntryQualificationModel = data['Data']['LateralEntryQualificationModel']
              this.lateralrequest = data['Data']['LateralEntryQualificationModel'][0]

              this.GetStreamCourse()
            
              this.SubjectID = data['Data']['LateralEntryQualificationModel'][0]['SubjectID']
             
             
             

            }
          }

          console.log(this.request,"123")
          console.log(data['Data'], 'ffff');
          console.log(this.request, "123344")
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

  //async Back() {

  //  this.tabChange.emit(0)
  //}

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];


    if (this.request.MarkType == 84) {
     

      if (!/^[0-9.]$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
    else {
      
      if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }

  }
 
  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }


}

















