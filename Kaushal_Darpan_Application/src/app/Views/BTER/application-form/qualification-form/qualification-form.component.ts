import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BoardDat, BterSearchmodel, EnglishQualificationDataModel, HighestQualificationModel, LateralEntryQualificationModel, Lateralsubject, QualificationDataModel, SupplementaryDataModel } from '../../../../Models/ApplicationFormDataModel';
import { DropdownValidators, DropdownValidatorsString } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { ToastrService } from 'ngx-toastr';
import { EnumCasteCategory, EnumCourseType, EnumDegreeCourse, EnumDepartment, EnumLateralCourse, EnumStatus } from '../../../../Common/GlobalConstants';
import { JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { max } from 'rxjs';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { StudentJanAadharDetailService } from '../../../../Services/StudentJanAadharDetail/student-jan-aadhar-detail.service';

@Component({
  selector: 'app-qualification-form',
  templateUrl: './qualification-form.component.html',
  styleUrls: ['./qualification-form.component.css'],
  standalone: false
})

export class QualificationFormComponent implements OnInit {
  public QualificationForm!: FormGroup
  public EnglishQualificationForm!: FormGroup
  public SupplementaryForm!: FormGroup
  public RadioForm!: FormGroup
  public CompanyMasterDDLList: any[] = [];
  public BoardList10: any = [];
  public BoardList12: any = [];
  public BoardStateList10: any = [];
  public BoardStateList12: any = [];
  public BoardExamList10: any = [];
  public BoardExamList12: any = [];
  public ShowOtherBoard10th: boolean = false;
  public ShowOtherBoard12th: boolean = false;
  public LateralBoardList: any = [];
  public request = new QualificationDataModel()
  public engRequest = new EnglishQualificationDataModel()
  public addrequest = new SupplementaryDataModel()
  public formData = new HighestQualificationModel()
  public BoardDatas = new BoardDat()
  public HighQualificationList: any[] = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isSu: boolean = false;
  public isSub: boolean = false;
  public isLateralFormSubmit: boolean = false
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public GetBoardList: any = []
  public QualificationPassingYearList: any = []
  public SupplyPassingYearList: any = []
  public marktypelist: any = []
  public isSupplement: boolean = false
  calculatedPercentage: number = 0;
  calculatedPercentageHigh: number = 0;
  public settingsMultiselect: object = {};
  public searchrequest = new BterSearchmodel()
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public ApplicationID: number = 0;
  public Lateralcourselist: any = []
  public Degreecourselist: any = []
  public _EnumCourseType = EnumCourseType
  public LateralQualificationForm !: FormGroup
  public HighestQualificationForm !: FormGroup
  public action: string = ''
  public SubjectMasterDDLList: any = []
  public CoreBranchList: any = []
  public BranchList: any = []
  public SubjectID: Lateralsubject[] = []
  public lateralrequest = new LateralEntryQualificationModel()
  public errormessage: string = ''
  public DDL_heading: string = ''
  nonEngHighQuali: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: BterApplicationForm,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
    private studentjanAadhar: StudentJanAadharDetailService
  ) { }

  async ngOnInit() {

    
    this.QualificationForm = this.formBuilder.group({
      txtRollNumber: ['', [Validators.required]],

      txtAggregateMaximumMarks: ['', [DropdownValidators]],
      txtAggregateMarksObtained: ['', [DropdownValidators]],
      txtpercentage: [{ value: '', disabled: true }],
      StateID: ['', [DropdownValidators]],
      ddlBoardID: ['', [DropdownValidators]],
      ddlPassyear: ['', [DropdownValidators]],
      ddlMarksType: ['', [DropdownValidators]],
      ddlBoardStateID: ['', [DropdownValidators]],
      ddlBoardExamID: ['', [DropdownValidators]],
    });

    this.SupplementaryForm = this.formBuilder.group({

      txtsubject: ['', Validators.required],
      txtRollNumber: ['', [Validators.required]],

      ddlPassingYear: ['', [DropdownValidators]],
      ddlEducationCategory: ['', [DropdownValidators]],

      txtSupplyMaxMarks: ['', [DropdownValidators]],
      txtSupplyObatined: ['', [DropdownValidators]],
    });

    this.RadioForm = this.formBuilder.group({
      SubjectRadio: ['']
    })

    this.LateralQualificationForm = this.formBuilder.group({
      ddlCourseID: ['', [DropdownValidators]],
      txtRollNumber: ['', Validators.required],

      txtAggregateMaximumMarks: ['', [DropdownValidators]],
      txtAggregateMarksObtained: ['', [DropdownValidators]],
      txtpercentage: [{ value: '', disabled: true }],
      //ddlStateID: ['', [DropdownValidators]],
      StateID: ['', [DropdownValidators]],
      ddlBoardID: ['', [DropdownValidators]],
      ddlPassyear: ['', [DropdownValidators]],
      ddlMarksType: ['', [DropdownValidators]],
      SubjectID: ['', Validators.required],
      txtBoardName: [''],
      txtClassSubject: [''],
      ddlBoardStateID: ['', [DropdownValidators]],
      ddlBoardExamID: ['', [DropdownValidators]],
      CoreBranchID: ['', [DropdownValidators]],
      BranchID: ['', [DropdownValidators]],
    })

    this.HighestQualificationForm = this.formBuilder.group({
      ddlYearOfPassing: ['', [DropdownValidators]],
      ddlMarksType: ['', [DropdownValidators]],
      txtBoardUniversity: ['', Validators.required],
      txtSchoolCollege: ['', Validators.required],
      txtHighestQualification: [''],
      txtRollNumber: ['', Validators.required],
      txtMaxMarks: ['', [DropdownValidators]],
      txtMarksObatined: ['', [DropdownValidators]],
      //txtAggregateMarksObtained: ['', Validators.required],
      txtPercentage: [{ value: '', disabled: true }],
      ClassSubject: ['', Validators.required],
      StateIDHigh: [''],
      ddlBoardID: ['', [DropdownValidators]],
      ddlBoardStateID: ['',],
      ddlBoardExamID: ['',],
    })

    this.EnglishQualificationForm = this.formBuilder.group({
      RollNumberEnglish: ['', [Validators.required]],

      MaxMarksEnglish: ['', [DropdownValidators]],
      MarksObtainedEnglish: ['', [DropdownValidators]],
      PercentageEnglish: [{ value: '', disabled: true }],
      StateOfStudyEnglish: ['', [DropdownValidators]],
      UniversityBoardEnglish: ['', Validators.required],
      YearofPassingEnglish: ['', [DropdownValidators]],
      MarksTypeIDEnglish: ['', [DropdownValidators]],
    });

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

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.sSOLoginDataModel.ApplicationFinalSubmit == 2) {
      this.formSubmitSuccess.emit(true); // Notify parent of success
      this.tabChange.emit(6); // Move to the next tab (index 1)
    }

    /*    this.HRManagerID = Number(this.activatedRoute.snapshot.queryParamMap.get('HRManagerID')?.toString());*/
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = EnumDepartment.BTER;

    await this.loadDropdownData('BTER_Board')
    await this.GetStateMatserDDL()
    await this.GetPassingYearDDL()
    await this.calculatePercentage()
    await this.calculateLateralPercentage()
    await this.GetMarktYPEDDL()
    await this.GetLateralCourse()
    await this.GetDegreeCourse()
    await this.GetCoreBranches()
    //this.request


    //this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    if (this.sSOLoginDataModel.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.sSOLoginDataModel.ApplicationID;
      await this.GetById();

    }
    this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng;
    this.request.DepartmentID = 1;

  }



  // multiselect events
  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }

  get _QualificationForm() { return this.QualificationForm.controls; }
  get _SupplementaryForm() { return this.SupplementaryForm.controls; }
  get _LateralQualificationForm() { return this.LateralQualificationForm.controls; }
  get _HighQualificationForm() { return this.HighestQualificationForm.controls; }
  get _EnglishQualificationForm() { return this.EnglishQualificationForm.controls; }


  async OnShow(item: any) {
    debugger
    if (item == 1) {
      this.isSupplement = true
      if(this.request.CourseType == 1 || this.request.CourseType == 2) {
        this.addrequest.EducationCategory = '10';
        await this.SupplypassingYear();
      }
      
    } else {
      this.isSupplement = false
      this.request.SupplementaryDataModel = []


    }
  }


  passingYearValidation() {

    if (this.request.CourseType == EnumCourseType.Lateral && this.request.PassingID != '' && this.lateralrequest.PassingID != '' && this.lateralrequest.PassingID <= this.request.PassingID ||
      this.request.CourseType == EnumCourseType.Non_Engineering && this.request.PassingID != '' && this.formData.YearofPassingHigh != '' && this.formData.YearofPassingHigh <= this.request.PassingID) {
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


  //passingYearValidation() {
  //   ;
  //  const highestQualification = this.formData.HighestQualificationHigh;
  //  const yearOfPassingHigh = this.formData.YearofPassingHigh;
  //  const tenthPassingYear = this.request.PassingID; // Assuming this is 10th passing year
  //  const twelfthPassingYears  = (this.HighQualificationList || [])
  //    .filter((x: any) => x?.HighestQualificationHigh === '12' && x?.YearofPassingHigh != null && x.YearofPassingHigh !== '')
  //    .map((x: any) => parseInt(x.YearofPassingHigh, 10))
  //    .filter((year: number) => !isNaN(year)); // Optional: filter out invalid parsed numbers

  //  const graduationPassingYear = (this.HighQualificationList || [])
  //    .filter((x: any) => x?.HighestQualificationHigh === 'Graduation' && x?.YearofPassingHigh != null && x.YearofPassingHigh !== '')
  //    .map((x: any) => parseInt(x.YearofPassingHigh, 10))
  //    .filter((year: number) => !isNaN(year));

  //  const postGradPassingYear = (this.HighQualificationList || [])
  //    .filter((x: any) => x?.HighestQualificationHigh === 'PostGraduation' && x?.YearofPassingHigh != null && x.YearofPassingHigh !== '')
  //    .map((x: any) => parseInt(x.YearofPassingHigh, 10))
  //    .filter((year: number) => !isNaN(year));

  //  if (!yearOfPassingHigh || yearOfPassingHigh === '') {
  //    return; // Do not validate if Year of Passing High is not entered
  //  }

  //  if (highestQualification == '12') {
  //    if (yearOfPassingHigh <= tenthPassingYear) {
  //      this.toastr.error('Passing Year of Higher Qualification must be greater than 10th Passing Year', 'Error');
  //      this.formData.YearofPassingHigh = '';
  //      return;
  //    }
  //  }

  //  if (highestQualification == 'Graduation') {
  //    if (yearOfPassingHigh <= twelfthPassingYears) {
  //      this.toastr.error('Passing Year of Higher Qualification must be greater than 12th Passing Year', 'Error');
  //      this.formData.YearofPassingHigh = '';
  //      return;
  //    }
  //  }

  //  if (highestQualification == 'PostGraduation') {
  //    if (yearOfPassingHigh <= graduationPassingYear) {
  //      this.toastr.error('Passing Year of Higher Qualification must be greater than Graduation Passing Year', 'Error');
  //      this.formData.YearofPassingHigh = '';
  //      return;
  //    }
  //  }
  //}



  async AddNew() {
     debugger;
    this.isSu = true;
    if (this.SupplementaryForm.invalid) {
      return console.log("error");
    }
    //Show Loading
    if (this.request.PassingID < this.addrequest.PassingID && this.addrequest.EducationCategory == '10') {
      this.toastr.warning('Please Enter Supplementary Year Of Passing less than or equal to 10th Qualification Year', 'Error');
      return console.log("error");
    }

    // show Obtain Marks
    if (this.addrequest.MaxMarksSupply < this.addrequest.ObtMarksSupply) {
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return console.log("error");
    }

    if(this.request.SupplementaryDataModel == null || this.request.SupplementaryDataModel == undefined) {
      this.request.SupplementaryDataModel = []
    }
    

    try {

      /*this.addrequest.PassingID = this.FinalcialList.filter((x: any) => x.FinancialYearID == this.EducationalQualificationFormData.PassingYearID)[0]['FinancialYearName'];*/
      this.request.SupplementaryDataModel.push({
          PassingID: this.addrequest.PassingID,
          RollN0: this.addrequest.RollN0,
          Subject: this.addrequest.Subject,
          EducationCategory: this.addrequest.EducationCategory,
          MaxMarksSupply: this.addrequest.MaxMarksSupply,
          ObtMarksSupply: this.addrequest.ObtMarksSupply,
          SupplementryID: 0
        }
      );

      
      this.isSu = false
      console.log(this.request.SupplementaryDataModel)
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
    this.addrequest.EducationCategory = '';
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

  btnRowDelete_On(row: any): void {

    this.Swal2.Confirmation('Are you sure you want to delete this row?',
      async (result: any) => {
        if (result.isConfirmed) {

          this.formData.ApplicationQualificationId = row.ApplicationQualificationId;
          await this.ApplicationService.DeleteByID(row)
            .then(async (data: any) => {

              this.HighQualificationList = [];
              if (data.State == EnumStatus.Success) {
                this.toastr.success(data.Message)
                await this.GetById()
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

      });

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


  async btnEdit_On(row: any) {

    this.isSubmitted = false;

    try {
      this.loaderService.requestStarted();

      const response = await this.ApplicationService.GetDetailsbyID(row);
      const data = JSON.parse(JSON.stringify(response)); // Optional: depends on what's returned

      console.log("AddedChoices on getby id", data.Data);
      this.formData = data.Data[0]
    } catch (error) {
      console.error("Error in btnEdit_On:", error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  async loadDropdownData(MasterCode: string) {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'BTER_Board':
          this.BoardList10 = data['Data'];
          this.BoardList12 = data['Data'];
          //console.log(this.BoardList)
          break;
        default:
          break;
      }
    });
  }

  async GetCoreBranches() {
    this.commonMasterService.GetCommonMasterData('CORE BRANCH').then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      if(data.State == EnumStatus.Success){
        this.CoreBranchList = data['Data'];
      } 
      
    });
  }

  async GetBranches_ByCoreBranch() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DC2ndYear_BranchesDDL(this.request.CourseType,this.lateralrequest.CoreBranchID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success){
          this.BranchList = data['Data'];
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async BoardChange(Type: number) {

    try {

      if ((this.request.BoardID == 38 && Type == 10) || (this.formData.BoardID == 38 && Type == 12) || (this.lateralrequest.BoardID == 38 && Type == 12)) {

        this.loaderService.requestStarted();
        await this.commonMasterService.GetCommonMasterData("BTER_Other_State")
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            if (Type == 10) {
              this.ShowOtherBoard10th = true
              this.BoardStateList10 = data['Data'];
            } else if (Type == 12) {
              this.ShowOtherBoard12th = true
              this.BoardStateList12 = data['Data'];
            }
          }, (error: any) => console.error(error)
          );
      } else {
        if (Type == 10) {
          this.ShowOtherBoard10th = false;
          this.BoardStateList10 = [];
        } else if (Type == 12) {
          this.ShowOtherBoard12th = false;
          this.BoardStateList12 = [];
        }
      }
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


  async BoardStateChange(Type: number) {



    try {

      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterData("BTER_Other_Board", Type, (Type == 10 ? this.request.BoardStateID : Type == 12 ? this.formData.BoardStateID : 0))

        .then((data: any) => {



          data = JSON.parse(JSON.stringify(data));

          console.log(data);

          if (Type == 10) {

            this.BoardExamList10 = data['Data'];

          } else if (Type == 12) {

            this.BoardExamList12 = data['Data'];

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

  async BoardStateChangeDiploma(Type: number) {



    try {

      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterData("BTER_Other_Board", Type, (Type == 12 ? this.lateralrequest.BoardStateID : 0))

        .then((data: any) => {



          data = JSON.parse(JSON.stringify(data));

          console.log(data);

          if (Type == 10) {

            this.BoardExamList10 = data['Data'];

          } else if (Type == 12) {

            this.BoardExamList12 = data['Data'];

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







  async GetLateralQualificationBoard() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLateralQualificationBoard(this.lateralrequest.CourseID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LateralBoardList = data['Data'];
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

  async GetDegreeCourse() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DegreeCourse1stYear_NonEngg')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Degreecourselist = data['Data'];
          console.log(this.Degreecourselist,"degree")
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
        //this.lateralrequest.Qualification = "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        //this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        //this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        //this.lateralrequest.Qualification = "ITI_Tenth"
      }

      this.lateralrequest.Qualification = this.GetLateralCourseName(this.lateralrequest.CourseID);
      if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        this.settingsMultiselect = {
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          enableCheckAll: false,
          selectAllText: 'Select Maximum 3 Subject only',
          unSelectAllText: 'Unselect All',
          allowSearchFilter: true,
          limitSelection: 3,
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
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        this.settingsMultiselect = {
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          enableCheckAll: false,
          selectAllText: 'Select 1 Branch Only',
          unSelectAllText: 'Unselect All',
          allowSearchFilter: true,
          limitSelection: 1,
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
      }

      this.SubjectID = []
      this.lateralrequest.BoardID = 0;
      this.lateralrequest.BoardName = '';
      if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 142) {
        await this.GetLateralQualificationBoard();
      }

      await this.commonMasterService.GetCommonMasterData(this.action)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SubjectMasterDDLList = data['Data'];
          console.log("this.SubjectMasterDDLList",this.SubjectMasterDDLList)

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

  async GetStream() {
    try {
      this.loaderService.requestStarted();
      debugger
      if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
        this.action = "Lateral_Diploma"
        //this.lateralrequest.Qualification = this.GetLateralCourseName(this.lateralrequest.CourseID); // "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        //this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        //this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumLateralCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        //this.lateralrequest.Qualification = "ITI_Tenth"
      }

      this.lateralrequest.Qualification = this.GetLateralCourseName(this.lateralrequest.CourseID);

      /*    this.SubjectID = []*/
      //this.lateralrequest.BoardID = 0;
      //this.lateralrequest.BoardName = '';
      if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 142) {
        await this.GetLateralQualificationBoard();
      }

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


  GetLateralCourseName(CourseID: number) {
    debugger
    if (CourseID == EnumLateralCourse.Diploma_Engineering) {
      return "Diploma"
    } else if (CourseID == EnumLateralCourse.Senior_Secondary_Vocational) {
      return "10th + C.Voc"
    } else if (CourseID == EnumLateralCourse.Senior_Secondary) {
      return "12Th"
    } else if (CourseID == EnumLateralCourse.ITI_Tenth) {
      return "10th + ITI";
    } else {
      return "";
    }
  }


  async GetStreamDegreeCourse() {
    try {
      this.loaderService.requestStarted();
      if (this.lateralrequest.CourseID == EnumDegreeCourse.Diploma_Engineering) {
        this.action = "Lateral_Diploma"
        //this.lateralrequest.Qualification = "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        //this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        //this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumDegreeCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        //this.lateralrequest.Qualification = "ITI_Tenth"
      }

      this.lateralrequest.Qualification = this.GetDegreeCourseName(this.lateralrequest.CourseID);
      if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary) {
        this.settingsMultiselect = {
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          enableCheckAll: false,
          selectAllText: 'Select Maximum 3 Subject only',
          unSelectAllText: 'Unselect All',
          allowSearchFilter: true,
          limitSelection: 3,
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
      } else if (this.lateralrequest.CourseID == EnumDegreeCourse.Diploma_Engineering) {
        this.settingsMultiselect = {
          singleSelection: false,
          idField: 'ID',
          textField: 'Name',
          enableCheckAll: false,
          selectAllText: 'Select 1 Branch Only',
          unSelectAllText: 'Unselect All',
          allowSearchFilter: true,
          limitSelection: 1,
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
      }

      this.SubjectID = []
      this.lateralrequest.BoardID = 0;
      this.lateralrequest.BoardName = '';

      if (this.lateralrequest.CourseID == 281 || this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 280) {
        await this.GetLateralQualificationBoard();
      }
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



  async GetStreamDegree() {
    try {
      this.loaderService.requestStarted();

      if (this.lateralrequest.CourseID == EnumDegreeCourse.Diploma_Engineering) {
        this.action = "Lateral_Diploma"
        //this.lateralrequest.Qualification = this.GetLateralCourseName(this.lateralrequest.CourseID); // "Diploma_Engineering"
      } else if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary_Vocational) {
        this.action = "Senior_Seconary_Vocational"
        //this.lateralrequest.Qualification = "Senior_Secondary_Vocational"
      } else if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary) {
        this.action = "Senior_Seconary"
        //this.lateralrequest.Qualification = "Senior_Secondary"
      }
      else if (this.lateralrequest.CourseID == EnumDegreeCourse.ITI_Tenth) {
        this.action = "Lateral_Trade"
        //this.lateralrequest.Qualification = "ITI_Tenth"
      }

      this.lateralrequest.Qualification = this.GetDegreeCourseName(this.lateralrequest.CourseID);

      /*    this.SubjectID = []*/
      //this.lateralrequest.BoardID = 0;
      //this.lateralrequest.BoardName = '';

      if (this.lateralrequest.CourseID == 281 || this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 280) {
        await this.GetLateralQualificationBoard();
      }
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


  GetDegreeCourseName(CourseID: number) {
    if (CourseID == EnumDegreeCourse.Diploma_Engineering) {
      return "Diploma"
    } else if (CourseID == EnumDegreeCourse.Senior_Secondary_Vocational) {
      return "10th + D.Voc"
    } else if (CourseID == EnumDegreeCourse.Senior_Secondary) {
      return "12Th"
    } else if (CourseID == EnumDegreeCourse.ITI_Tenth) {
      return "10th + ITI + English";
    } else {
      return "";
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


  async passingYear() {

    const selectedYear = this.request.PassingID;
    if (selectedYear) {
      this.QualificationPassingYearList = this.PassingYearList.filter((item: any) => item.Year > selectedYear);
      this.SupplypassingYear();
    } else {
      this.PassingYearList;
    }
  }


  //SupplypassingYear() {

  //  const selectedYear10 = this.request.PassingID;
  //  if (selectedYear10) {
  //    this.SupplyPassingYearList = this.PassingYearList.filter((item: any) => item.Year >= selectedYear10);
  //  } else {
  //    this.PassingYearList;
  //  }
  //}


  SupplypassingYear() {
    const selectedYear10 = this.request.PassingID;
    const educationCategory = this.addrequest.EducationCategory;

    if (educationCategory == '10' && selectedYear10) {
      // Filter PassingYearList for years >= selectedYear10
      this.SupplyPassingYearList = this.PassingYearList.filter(
        (item: any) => item.Year >= selectedYear10
      );
    } else if (educationCategory == '12') {
      const selectedYear12 = this.formData.YearofPassingHigh;
      if (selectedYear12) {
        // Match PassingYearList where year equals selectedYear12
        this.SupplyPassingYearList = this.PassingYearList.filter(
          (item: any) => item.Year >= selectedYear12
        );
      } else {
        this.SupplyPassingYearList = this.PassingYearList;
      }
    } else {
      // Default to showing all years if no valid category or value
      this.SupplyPassingYearList = this.PassingYearList;
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
    await this.RefreshValidators()
    if (this.QualificationForm.invalid) {
      return
    }
    if (this.request.BoardID != 38) {
      this.request.BoardExamID = 0
      this.request.BoardStateID = 0
    }


    if (this.request.CourseType == 4 || this.request.CourseType == 2) {
      this.isSub = true;
      this.HighestQualificationForm.get('txtHighestQualification')?.setValidators([DropdownValidatorsString]);
      this.request.HighestQualificationModel = [];
      await this.RefreshValidators()

      //if (this.request.CourseType == 4) {
      //  if (this.HighestQualificationForm.invalid) {
      //    this.toastr.warning("Please Fill Highest Qualification Form Properly")

      //    //Object.keys(this.HighestQualificationForm.controls).forEach(key => {
      //    //  const control = this.HighestQualificationForm.get(key);
      //    //   if (control && control.invalid) {
      //    //     this.toastr.error(`Control ${key} is invalid`);
      //    //     Object.keys(control.errors!).forEach(errorKey => {
      //    //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //    //     });
      //    //   }
      //    // });

      //    return
      //  }
      //}


      if (this.request.CourseType != 2 && this.nonEngHighQuali != '') {
        if (this.HighestQualificationForm.invalid) {
          this.toastr.warning("Please Fill Highest Qualification Form Properly")

          //Object.keys(this.HighestQualificationForm.controls).forEach(key => {
          //  const control = this.HighestQualificationForm.get(key);
          //   if (control && control.invalid) {
          //     this.toastr.error(`Control ${key} is invalid`);
          //     Object.keys(control.errors!).forEach(errorKey => {
          //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          //     });
          //   }
          // });

          return
        }
      }

      if (this.request.CourseType != 2 && this.nonEngHighQuali != '') {
        if (this.formData.HighestQualificationHigh == '') {
          this.toastr.warning("Please Select Highest Qualification")
          return
        }
      }




      this.HighQualificationList = []
      if (this.formData.BoardID != 38) {
        this.formData.BoardStateID = 0
        this.formData.BoardExamID = 0
      }
      if (this.nonEngHighQuali != '12') {
        this.formData.BoardID = 0
      } else if (this.nonEngHighQuali == '12') {
        this.formData.UniversityBoard = ''
      }
      if (this.request.CourseType == 4 && this.formData.StateIDHigh == 6) {
      /*  this.formData.HighestQualificationHigh = 'D-Voc'*/
      }
      this.HighQualificationList.push(
        {
          UniversityBoard: this.formData.UniversityBoard,
          SchoolCollegeHigh: this.formData.SchoolCollegeHigh,
          HighestQualificationHigh: this.formData.HighestQualificationHigh,
          YearofPassingHigh: this.formData.YearofPassingHigh,
          RollNumberHigh: this.formData.RollNumberHigh,
          MarksTypeIDHigh: this.formData.MarksTypeIDHigh,
          MaxMarksHigh: this.formData.MaxMarksHigh,
          PercentageHigh: this.formData.PercentageHigh,
          MarksObtainedHigh: this.formData.MarksObtainedHigh,
          ClassSubject: this.formData.ClassSubject,
          BoardID: this.formData.BoardID,
          BoardStateID: this.formData.BoardStateID,
          BoardExamID: this.formData.BoardExamID,
          ApplicationQualificationId: this.formData.ApplicationQualificationId,
          StateIDHigh: this.formData.StateIDHigh
        },
      );

      this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
      this.request.HighestQualificationModel = this.HighQualificationList
      // this.AddMore()
    }

    if (this.request.CourseType == 2 && this.nonEngHighQuali != '') {

      this.isSub = true;
      this.request.HighestQualificationModel = [];
      this.formData.HighestQualificationHigh = this.nonEngHighQuali


      //if (this.HighestQualificationForm.invalid) {
      //  this.toastr.warning("Please Fill Highest Qualification Form Properly")
      //  return
      //}

      if (this.formData.StateIDHigh == 0 && this.nonEngHighQuali == '12') {
        this.toastr.warning("Please Select State of Study")
        return
      }

      if (Number(this.request.Percentage) > Number(this.formData.PercentageHigh)) {
        this.toastr.warning("Highest Qualification Percentage should be greater then 10th Qualification Percentage")
        return
      }

      if (this.nonEngHighQuali != '12') {
        this.formData.StateIDHigh = 0
      } else if (this.nonEngHighQuali == '12' && this.formData.StateIDHigh == 0) {
        this.toastr.warning("Please Select State of Study for Highest qualification")
        return
      }

      this.HighQualificationList = []
      this.HighQualificationList.push({
        UniversityBoard: this.formData.UniversityBoard,
        SchoolCollegeHigh: this.formData.SchoolCollegeHigh,
        HighestQualificationHigh: this.formData.HighestQualificationHigh,
        YearofPassingHigh: this.formData.YearofPassingHigh,
        RollNumberHigh: this.formData.RollNumberHigh,
        MarksTypeIDHigh: this.formData.MarksTypeIDHigh,
        MaxMarksHigh: this.formData.MaxMarksHigh,
        PercentageHigh: this.formData.PercentageHigh,
        MarksObtainedHigh: this.formData.MarksObtainedHigh,
        ClassSubject: this.formData.ClassSubject,
        ApplicationQualificationId: this.formData.ApplicationQualificationId,
        StateIDHigh: this.formData.StateIDHigh,
        BoardID: this.formData.BoardID,
        BoardStateID: this.formData.BoardStateID,
        BoardExamID: this.formData.BoardExamID,
      },
      );



      this.request.HighestQualificationModel = this.HighQualificationList
    } else if (this.request.CourseType == 2 && this.nonEngHighQuali == '') {
      this.formData = new HighestQualificationModel()
      this.request.HighestQualificationModel = [];
    }


    if (this.HighQualificationList.length == 0 && this.request.CourseType == 2 && this.nonEngHighQuali != '') {
      this.toastr.error("Please Fill HighQualification Form")
      return
    }

    if (this.HighQualificationList.length == 0 && this.request.CourseType == 4) {
      this.toastr.error("Please Fill HighQualification Form")
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



            if (this.request.CourseType == EnumCourseType.Lateral || this.request.CourseType == 4) {
              await this.RefreshValidators()


              if(this.lateralrequest.CourseID == 143){
                this.LateralQualificationForm.get('txtClassSubject')?.clearValidators();
              }

              if (this.LateralQualificationForm.invalid) {

                this.toastr.error("Please Fill Lateral Qualification Form Properly")
                Object.keys(this.LateralQualificationForm.controls).forEach(key => {
                 const control = this.LateralQualificationForm.get(key);
                  if (control && control.invalid) {
                    this.toastr.error(`Control ${key} is invalid`);
                    Object.keys(control.errors!).forEach(errorKey => {
                      this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
                    });
                  }
                });

                return
              }
              //if (this.lateralrequest.CourseID == EnumLateralCourse.Diploma_Engineering) {
              //  if (this.SubjectID.length != 1) {
              //    this.toastr.error("Please Select Only One Stream")
              //    this.isSubmitted = false
              //    return
              //  }

              //}

              if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary) {
                if (this.SubjectID.length != 3) {
                  this.toastr.error("Please Select 3 Subjects")
                  this.isSubmitted = false
                  return
                }

              }

              if (this.lateralrequest.CourseID == EnumLateralCourse.Senior_Secondary ) {
                const selectedCount = this.SubjectID?.length || 0;

                if (selectedCount < 2 || selectedCount > 3) {
                  this.toastr.error("Please select Minimum 2 subjects and Maximum 3 subjects.");
                  this.isSubmitted = false;
                  return;
                }
              }

              if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary) {
                if (this.SubjectID.length != 3) {
                  this.toastr.error("Please Select 3 Subjects")
                  this.isSubmitted = false
                  return
                }

              }

              if (this.lateralrequest.CourseID == EnumDegreeCourse.Senior_Secondary) {
                const selectedCount = this.SubjectID?.length || 0;

                if (selectedCount < 2 || selectedCount > 3) {
                  this.toastr.error("Please select Minimum 2 subjects and Maximum 3 subjects.");
                  this.isSubmitted = false;
                  return;
                }
              }


              if (this.lateralrequest.BoardID != 38) {
                this.lateralrequest.BoardStateID = 0
                this.lateralrequest.BoardExamID = 0
              }
              if (this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 279) {
                this.lateralrequest.BoardID = 0
              }

              if (this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 279) {
                this.lateralrequest.BoardID = 0
              }
              if ((this.lateralrequest.CourseID != 141 && this.lateralrequest.CourseID != 279) && this.lateralrequest.BoardID != 38) {
                this.lateralrequest.BoardName = ''
              }
              if (!this.ShowOtherBoard12th && (this.lateralrequest.CourseID != 143 && this.lateralrequest.CourseID != 281)) {
                this.lateralrequest.BoardStateID = 0
                this.lateralrequest.BoardExamID = 0
              }

              if (this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 142) {
                this.SubjectID = []
              }

              if (this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 279 || this.lateralrequest.CourseID == 280) {
                this.SubjectID = []
              }


              if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 281) {
                this.lateralrequest.ClassSubject = ''
              }

               
              this.SubjectID.forEach(e => e.CourseID = this.lateralrequest.CourseID)
              this.request.LateralEntryQualificationModel.push({
                CourseID: this.lateralrequest.CourseID,
                SubjectID: this.SubjectID,
                BoardID: this.lateralrequest.BoardID,
                BoardName: this.lateralrequest.BoardName,
                ClassSubject: this.lateralrequest.ClassSubject,
                PassingID: this.lateralrequest.PassingID,
                AggMaxMark: this.lateralrequest.AggMaxMark,
                AggObtMark: this.lateralrequest.AggObtMark,
                Percentage: this.lateralrequest.Percentage,
                Qualification: this.lateralrequest.Qualification,
                RollNumber: this.lateralrequest.RollNumber,
                StateID: this.lateralrequest.StateID,
                MarkType: this.lateralrequest.MarkType,
                BoardStateID: this.lateralrequest.BoardStateID,
                BoardExamID: this.lateralrequest.BoardExamID,
                ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId,
                CoreBranchID: this.lateralrequest.CoreBranchID,
                BranchID: this.lateralrequest.BranchID
              });
            }

            console.log(this.request.LateralEntryQualificationModel)

            this.request.LateralCourseID = this.lateralrequest.CourseID
            this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng

            this.isLoading = true;

            this.loaderService.requestStarted();

            this.request.ModifyBy = this.sSOLoginDataModel.UserID;

            this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
            this.request.QualificationID = 10

            console.log(this.request, "console.log(this.request)")

            if (this.request.CourseType == 2 && this.nonEngHighQuali == '') {
              this.request.HighestQualificationModel = []
            }
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
                  this.tabChange.emit(2); //
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

  async RefreshValidators() {
    /* for 2nd year lateral Diploma */
    debugger
    if(this.request.CourseType == 3){
      if (this.lateralrequest.CourseID == 143) {

        this.LateralQualificationForm.get('txtClassSubject')?.clearValidators();
        this.LateralQualificationForm.get('SubjectID')?.setValidators(Validators.required);
      } else {
        this.LateralQualificationForm.get('txtClassSubject')?.setValidators(Validators.required);
        this.LateralQualificationForm.get('SubjectID')?.clearValidators();
      }

      this.LateralQualificationForm.get('txtClassSubject')?.updateValueAndValidity();
      this.LateralQualificationForm.get('SubjectID')?.updateValueAndValidity();

      if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 142) {

        this.LateralQualificationForm.get('txtBoardName')?.clearValidators();
        this.LateralQualificationForm.get('ddlBoardID')?.setValidators([DropdownValidators]);

      } else {
        //this.LateralQualificationForm.get('txtBoardName')?.setValidators(Validators.required);
        this.LateralQualificationForm.get('ddlBoardID')?.clearValidators();
      }

      this.LateralQualificationForm.get('txtBoardName')?.updateValueAndValidity();
      this.LateralQualificationForm.get('ddlBoardID')?.updateValueAndValidity();

      if (this.lateralrequest.BoardID == 38 && this.lateralrequest.CourseID == 143) {
        this.LateralQualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
        this.LateralQualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);
      }
      else {
        this.LateralQualificationForm.get('ddlBoardStateID')?.clearValidators();
        this.LateralQualificationForm.get('ddlBoardExamID')?.clearValidators();
      }
      this.LateralQualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
      this.LateralQualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();
    }

    /* end 2nd year lateral Diploma */

    if (this.request.BoardID == 38) {
      this.QualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
      this.QualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);
    }
    else {
      this.QualificationForm.get('ddlBoardStateID')?.clearValidators();
      this.QualificationForm.get('ddlBoardExamID')?.clearValidators();
    }
    this.QualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
    this.QualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();

    if (this.nonEngHighQuali == '12') {
      this.HighestQualificationForm.get('ddlBoardID')?.setValidators([DropdownValidators]);
      this.HighestQualificationForm.get('txtBoardUniversity')?.clearValidators();
    } else {
      this.HighestQualificationForm.get('ddlBoardID')?.clearValidators();
      this.HighestQualificationForm.get('txtBoardUniversity')?.setValidators(Validators.required);
    }
    this.HighestQualificationForm.get('ddlBoardID')?.updateValueAndValidity();
    this.HighestQualificationForm.get('txtBoardUniversity')?.updateValueAndValidity();

    if (this.formData.BoardID == 38 && this.nonEngHighQuali == '12') {

      this.HighestQualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
      this.HighestQualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);

    }
    else {
      this.HighestQualificationForm.get('ddlBoardStateID')?.clearValidators();
      this.HighestQualificationForm.get('ddlBoardExamID')?.clearValidators();

    }

    this.HighestQualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
    this.HighestQualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();
    

    /* for Degree Course 1st year*/

    if(this.request.CourseType == 4 || this.request.CourseType == 5) {
      this.LateralQualificationForm.get('SubjectID')?.clearValidators();
      if (this.lateralrequest.CourseID == 281) {

        this.LateralQualificationForm.get('txtClassSubject')?.setValidators(Validators.required);
        this.LateralQualificationForm.get('SubjectID')?.clearValidators();
      } else {
        this.LateralQualificationForm.get('txtClassSubject')?.clearValidators();
        // this.LateralQualificationForm.get('SubjectID')?.setValidators(Validators.required);
      }


      this.LateralQualificationForm.get('txtClassSubject')?.updateValueAndValidity();
      this.LateralQualificationForm.get('SubjectID')?.updateValueAndValidity();


      if (this.lateralrequest.CourseID == 281 || this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 280) {

        this.LateralQualificationForm.get('txtBoardName')?.clearValidators();
        this.LateralQualificationForm.get('ddlBoardID')?.setValidators([DropdownValidators]);

      } else {
        //this.LateralQualificationForm.get('txtBoardName')?.setValidators(Validators.required);
        this.LateralQualificationForm.get('ddlBoardID')?.clearValidators();
      }

      this.LateralQualificationForm.get('txtBoardName')?.updateValueAndValidity();
      this.LateralQualificationForm.get('ddlBoardID')?.updateValueAndValidity();


      if (this.lateralrequest.BoardID == 38 && this.lateralrequest.CourseID == 281) {
        this.LateralQualificationForm.get('ddlBoardStateID')?.setValidators([DropdownValidators]);
        this.LateralQualificationForm.get('ddlBoardExamID')?.setValidators([DropdownValidators]);
      }
      else {
        this.LateralQualificationForm.get('ddlBoardStateID')?.clearValidators();
        this.LateralQualificationForm.get('ddlBoardExamID')?.clearValidators();
      }
      this.LateralQualificationForm.get('ddlBoardStateID')?.updateValueAndValidity();
      this.LateralQualificationForm.get('ddlBoardExamID')?.updateValueAndValidity();
    }
    /* end Degree Course 1st year*/

    /* for Degree Course 2nd Year Lateral*/

    if(this.request.CourseType == 5) {
      if(this.lateralrequest.CourseID == 278) {
        this.LateralQualificationForm.get('CoreBranchID')?.setValidators([DropdownValidators]);
        this.LateralQualificationForm.get('BranchID')?.setValidators([DropdownValidators]);
      } else {
        this.LateralQualificationForm.get('CoreBranchID')?.removeValidators([DropdownValidators]);
        this.LateralQualificationForm.get('BranchID')?.removeValidators([DropdownValidators]);
      }

      this.LateralQualificationForm.get('CoreBranchID')?.updateValueAndValidity();
      this.LateralQualificationForm.get('BranchID')?.updateValueAndValidity();
      
    }

    /* end Degree Course 2nd Year Lateral*/
  }


  async MarksTypeChange() {
    if (this.request.MarkType == 84) {
      this.request.AggMaxMark = 10
      this.request.Percentage = '';
      this.request.AggObtMark = 0;
      this.QualificationForm.get('txtAggregateMaximumMarks')?.disable();
    } else {
      this.request.AggMaxMark = 0
      this.request.Percentage = '';
      this.request.AggObtMark = 0;
      this.QualificationForm.get('txtAggregateMaximumMarks')?.enable();
    }
  }

  async EnglishMarksTypeChange() {
    if (this.engRequest.MarksTypeIDEnglish == 84) {
      this.engRequest.MaxMarksEnglish = 10
      this.engRequest.PercentageEnglish = '';
      this.engRequest.MarksObtainedEnglish = 0;
      this.EnglishQualificationForm.get('MaxMarksEnglish')?.disable();
    } else {
      this.engRequest.MaxMarksEnglish = 0
      this.engRequest.PercentageEnglish = '';
      this.engRequest.MarksObtainedEnglish = 0;
      this.EnglishQualificationForm.get('MaxMarksEnglish')?.enable();
    }
  }

  async highMarksTypeChange() {
    if (this.formData.MarksTypeIDHigh == 84) {
      this.formData.MaxMarksHigh = 10
      this.formData.MarksObtainedHigh = 0;
      this.formData.PercentageHigh = '';
      this.HighestQualificationForm.get('txtMaxMarks')?.disable();
    } else {
      this.formData.MaxMarksHigh = 0
      this.formData.MarksObtainedHigh = 0;
      this.formData.PercentageHigh = '';
      this.HighestQualificationForm.get('txtMaxMarks')?.enable();
    }
  }

  async lateralMarksTypeChange() {
    if (this.lateralrequest.MarkType == 84) {
      this.lateralrequest.AggMaxMark = 10
      this.lateralrequest.Percentage = '';
      this.lateralrequest.AggObtMark = 0;
      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.disable();
    } else {
      this.lateralrequest.AggMaxMark = 0
      this.lateralrequest.Percentage = '';
      this.lateralrequest.AggObtMark = 0;
      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.enable();
    }
  }


  async calculatePercentage() {
    ;
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
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.request.Percentage = '';
          this.request.AggObtMark = 0;
        } else {
          this.request.Percentage = percentage.toFixed(2);
        }
      } else {
        this.request.Percentage = '';
      }
    } else if (this.request.MarkType == 83) {
      this.QualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage < 33) {
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
        this.request.SupplementaryDataModel = []
      }
    }
  }

  async calculatePercentageEnglish() {
    ;
    let maxMarks = this.engRequest.MaxMarksEnglish;
    const marksObtained = this.engRequest.MarksObtainedEnglish;
    if (Number(this.engRequest.MarksObtainedEnglish) > Number(this.engRequest.MaxMarksEnglish)) {

      this.engRequest.PercentageEnglish = '';
      this.engRequest.MarksObtainedEnglish = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.engRequest.MarksTypeIDEnglish == 84) {
      maxMarks = 10
      this.engRequest.MaxMarksEnglish = 10
      this.EnglishQualificationForm.get('MaxMarksEnglish')?.disable();
      if (this.engRequest.MarksObtainedEnglish > 10) {
        this.engRequest.MarksObtainedEnglish = 0;
        this.engRequest.PercentageEnglish = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.engRequest.PercentageEnglish = '';
          this.engRequest.MarksObtainedEnglish = 0;
        } else {
          this.engRequest.PercentageEnglish = percentage.toFixed(2);
        }
      } else {
        this.engRequest.PercentageEnglish = '';
      }
    } else if (this.engRequest.MarksTypeIDEnglish == 83) {
      this.EnglishQualificationForm.get('MaxMarksEnglish')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.engRequest.PercentageEnglish = '';
          this.engRequest.MarksObtainedEnglish = 0;
        } else {
          this.engRequest.PercentageEnglish = percentage.toFixed(2);
        }

      } else {
        this.engRequest.PercentageEnglish = '';
      }
    }
  }


  calculatePercentageHigh(): void {

    let maxMarks = this.formData.MaxMarksHigh;
    const marksObtained = this.formData.MarksObtainedHigh;
    if (Number(this.formData.MarksObtainedHigh) > Number(this.formData.MaxMarksHigh)) {
      this.formData.PercentageHigh = '';
      this.formData.MarksObtainedHigh = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.formData.MarksTypeIDHigh == 84) {
      maxMarks = 10
      this.formData.MaxMarksHigh = 10
      this.HighestQualificationForm.get('txtMaxMarks')?.disable();
      if (this.formData.MarksObtainedHigh > 10) {
        this.formData.MarksObtainedHigh = 0;
        this.formData.PercentageHigh = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        } else {
          this.formData.PercentageHigh = percentage.toFixed(2);
        }
      } else {
        this.formData.PercentageHigh = '';
      }
    } else if (this.formData.MarksTypeIDHigh == 83) {
      this.HighestQualificationForm.get('txtMaxMarks')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage < 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        } else {
          this.formData.PercentageHigh = percentage.toFixed(2);
        }

      } else {
        this.formData.PercentageHigh = '';
      }
      if (this.request.SupplementaryDataModel == null) {
        this.request.SupplementaryDataModel = []
      }
    }
  }

  async calculateLateralPercentage() {
    ;
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
        var percentage = 0.0;
        if ((this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 278) && (this.lateralrequest.BoardID == 20 || this.lateralrequest.BoardID == 42)) {
          percentage = (marksObtained * 10) - 5;
        } else {
          percentage = marksObtained * 9.5;
        }
        if (percentage <= 33) {
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
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage <= 33) {
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



  calculatePercentageCourseTypeWise(): void {

    this.BoardChange(12)

    if (this.request.CourseType == 2) {
      this.calculatePercentageHigh()
    }

    else if (this.request.CourseType == 4) {
      //this.calculatePercentageDegreeCourse1st2nd()
      this.calculateLateralPercentage()
    }

    else if (this.request.CourseType == 5) {
      // this.calculateLateralPercentageCourseType()
      this.calculateLateralPercentage();
    }

    else if (this.request.CourseType == EnumCourseType.Lateral) {
      this.calculateLateralPercentage()
    }

  }



  calculatePercentageDegreeCourse1st2nd(): void {
    ;
    let maxMarks = this.formData.MaxMarksHigh;
    const marksObtained = this.formData.MarksObtainedHigh;
    if (Number(this.formData.MarksObtainedHigh) > Number(this.formData.MaxMarksHigh)) {
      this.formData.PercentageHigh = '';
      this.formData.MarksObtainedHigh = 0;
      this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
      return;
    }
    if (this.formData.MarksTypeIDHigh == 84) {
      maxMarks = 10
      this.formData.MaxMarksHigh = 10
      this.HighestQualificationForm.get('txtMaxMarks')?.disable();
      if (this.formData.MarksObtainedHigh > 10) {
        this.formData.MarksObtainedHigh = 0;
        this.formData.PercentageHigh = '';
        return
      }
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;

        if (this.request.CategoryA == EnumCasteCategory.GENERAL) {
          if (percentage < 45) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 45%');
            this.formData.PercentageHigh = '';
            this.formData.MarksObtainedHigh = 0;
          } else {
            this.formData.PercentageHigh = percentage.toFixed(2);
          }
        }
        else {
          if (percentage < 40) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 40%');
            this.formData.PercentageHigh = '';
            this.formData.MarksObtainedHigh = 0;
          } else {
            this.formData.PercentageHigh = percentage.toFixed(2);
          }
        }
      } else {
        this.formData.PercentageHigh = '';
      }

    } else if (this.formData.MarksTypeIDHigh == 83) {
      this.HighestQualificationForm.get('txtMaxMarks')?.enable();

      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;

        // Apply condition based on CourseType
        if (this.request.CategoryA == EnumCasteCategory.GENERAL) {
          if (percentage < 45) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 45%');
            this.formData.PercentageHigh = '';
            this.formData.MarksObtainedHigh = 0;
          } else {
            this.formData.PercentageHigh = percentage.toFixed(2);
          }
        } else {
          if (percentage < 40) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 40%');
            this.formData.PercentageHigh = '';
            this.formData.MarksObtainedHigh = 0;
          } else {
            this.formData.PercentageHigh = percentage.toFixed(2);
          }
        }

      } else {
        this.formData.PercentageHigh = '';
      }

      if (this.request.SupplementaryDataModel == null) {
        this.request.SupplementaryDataModel = [];
      }
    }
  }

  async calculateLateralPercentageCourseType() {
    ;
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
        var percentage = 0.0;
        if ((this.lateralrequest.CourseID == 140 || this.lateralrequest.CourseID == 278) && this.lateralrequest.BoardID == 20) {
          percentage = (marksObtained * 10) - 5;
        } else {
          percentage = marksObtained * 9.5;
        }

        if (this.request.CategoryA == EnumCasteCategory.GENERAL) {
          if (percentage < 45) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 45%');
            this.lateralrequest.Percentage = '';
            this.lateralrequest.AggObtMark = 0;
          } else {
            this.lateralrequest.Percentage = percentage.toFixed(2);
          }
        }
        else {
          if (percentage < 40) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 40%');
            this.lateralrequest.Percentage = '';
            this.lateralrequest.AggObtMark = 0;
          } else {
            this.lateralrequest.Percentage = percentage.toFixed(2);
          }
        }

      } else {
        this.lateralrequest.Percentage = '';
      }
    } else if (this.lateralrequest.MarkType == 83) {

      this.LateralQualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
        const percentage = (marksObtained / maxMarks) * 100;

        if (this.request.CategoryA == EnumCasteCategory.GENERAL) {
          if (percentage < 45) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 45%');
            this.lateralrequest.Percentage = '';
            this.lateralrequest.AggObtMark = 0;
          } else {
            this.lateralrequest.Percentage = percentage.toFixed(2);
          }
        } else {
          if (percentage < 40) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 40%');
            this.formData.PercentageHigh = '';
            this.formData.MarksObtainedHigh = 0;
          } else {
            this.lateralrequest.Percentage = percentage.toFixed(2);
          }
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
    this.HighQualificationList = []
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetQualificationDatabyID(this.searchrequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          this.request.ApplicationID = data['Data']['ApplicationID']
          if (data['Data'] != null) {
            this.request = data['Data']
            if (this.request.PassingID == null) {
              this.request.PassingID = ''
            } else {
              this.request.PassingID = data['Data']['PassingID']
              this.passingYear();
            }

            this.request.IsSupplement = data['Data']['IsSupplement']
            if (data['Data']['IsSupplement'] === true) {
              this.isSupplement = true
            } else {
              this.isSupplement = false
            }

            this.BoardChange(this.request.QualificationID)
            this.BoardStateChange(this.request.QualificationID)
            if (this.request.CourseType == 2 && this.request.HighestQualificationModel.length > 0) {
              this.nonEngHighQuali = this.request.HighestQualificationModel[0].HighestQualificationHigh
              this.formData.StateIDHigh = this.request.HighestQualificationModel[0].StateIDHigh
              this.formData = this.request.HighestQualificationModel[0]
            }

            if (this.request.CourseType == 4 && this.request.HighestQualificationModel.length > 1) {
              const engqua = this.request.HighestQualificationModel.filter((x: any) => x.HighestQualificationHigh == 'English');
              console.log("engqua", engqua)

              if(engqua.length > 0){
                this.engRequest.ApplicationQualificationId = engqua[0].ApplicationQualificationId
                this.engRequest.RollNumberEnglish = engqua[0].RollNumberHigh
                this.engRequest.MaxMarksEnglish = engqua[0].MaxMarksHigh
                this.engRequest.MarksObtainedEnglish = engqua[0].MarksObtainedHigh
                this.engRequest.PercentageEnglish = engqua[0].PercentageHigh
                this.engRequest.UniversityBoardEnglish = engqua[0].UniversityBoard
                this.engRequest.YearofPassingEnglish = engqua[0].YearofPassingHigh
                this.engRequest.MarksTypeIDEnglish = engqua[0].MarksTypeIDHigh
                this.engRequest.StateOfStudyEnglish = engqua[0].StateIDHigh

              }
            
            }
            
            if (this.formData.HighestQualificationHigh == '12') {
              this.BoardChange(12);
              this.BoardStateChange(12);
            }

            if (this.request.HighestQualificationModel == null) {
              this.request.HighestQualificationModel = []
              this.formData = new HighestQualificationModel()
            } else {
              this.HighQualificationList = data['Data']['HighestQualificationModel'][0]
            }

            if (this.request.SupplementaryDataModel == null) {
              this.request.SupplementaryDataModel = []
              this.addrequest = new SupplementaryDataModel()
            }
            if (this.request.LateralEntryQualificationModel == null) {

              this.request.LateralEntryQualificationModel = []
              this.lateralrequest = new LateralEntryQualificationModel()
            }
            else {

              this.request.LateralEntryQualificationModel = data['Data']['LateralEntryQualificationModel']
              this.lateralrequest = data['Data']['LateralEntryQualificationModel'][0]
              
              if (this.request.CourseType == 3) {await this.GetStream(); }
              if (this.request.CourseType == 4 || this.request.CourseType == 5) {await this.GetStreamDegree(); }
              if(this.request.CourseType == 5) { await this.GetBranches_ByCoreBranch(); }
              

              this.SupplypassingYear();
              if (data['Data']['LateralEntryQualificationModel'][0]['SubjectID'] != null) {
                this.SubjectID = data['Data']['LateralEntryQualificationModel'][0]['SubjectID']
              } else {
                this.SubjectID = []
              }

              if (this.lateralrequest.Qualification == '12Th') {
                this.BoardChange(12);
                this.BoardStateChangeDiploma(12);
              }

            }
          }          

          console.log(this.request, "123")
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


  async Back() {
    this.tabChange.emit(2)
  }



  async AddMore() {
    this.isSub = true;
    if (this.HighestQualificationForm.invalid) {
      console.log("error");
      return
    }

    var th = this;
    if (this.HighQualificationList.filter(function (data: any) { return data.HighestQualificationHigh == th.formData.HighestQualificationHigh }).length > 0) {
      this.Swal2.Warning('Qualification Aready added');
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to Add More Qualification Detail ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {

            if (!this.HighQualificationList) {
              this.HighQualificationList = [];
            }

            this.HighQualificationList.push(
              {
                UniversityBoard: this.formData.UniversityBoard,
                SchoolCollegeHigh: this.formData.SchoolCollegeHigh,
                HighestQualificationHigh: this.formData.HighestQualificationHigh,
                YearofPassingHigh: this.formData.YearofPassingHigh,
                RollNumberHigh: this.formData.RollNumberHigh,
                MarksTypeIDHigh: this.formData.MarksTypeIDHigh,
                MaxMarksHigh: this.formData.MaxMarksHigh,
                PercentageHigh: this.formData.PercentageHigh,
                MarksObtainedHigh: this.formData.MarksObtainedHigh,
                ClassSubject: this.formData.ClassSubject,
                ApplicationQualificationId: this.formData.ApplicationQualificationId
              },
            );

            this.request.LateralCourseID = this.lateralrequest.CourseID
            this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng

            this.isLoading = true;

            this.loaderService.requestStarted();

            this.request.ModifyBy = this.sSOLoginDataModel.UserID;

            this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
            this.request.HighestQualificationModel = this.HighQualificationList
            //save
            await this.ApplicationService.SaveHighQualificationData(this.request)
              .then((data: any) => {
                ;
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  console.log(this.HighQualificationList);
                  this.formData.UniversityBoard = ''
                  this.formData.SchoolCollegeHigh = ''
                  this.formData.HighestQualificationHigh = ''
                  this.formData.YearofPassingHigh = ''
                  this.formData.RollNumberHigh = ''
                  this.formData.MarksObtainedHigh = 0
                  this.formData.MaxMarksHigh = 0
                  this.formData.MarksTypeIDHigh = 0
                  this.formData.PercentageHigh = ''
                  this.formData.ClassSubject = ''
                  this.isSub = false
                  this.GetById();
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

  onHighestQualificationChange() {
    this.formData.HighestQualificationHigh = this.nonEngHighQuali

    if (this.nonEngHighQuali == '') {
      this.formData = new HighestQualificationModel();
      this.isSub = false
    }
    console.log("formData.HighestQualificationHigh", this.formData.HighestQualificationHigh)
  }

  async GetBoardData() {

    try {

      if (this.request.CourseType == EnumCourseType.Lateral || this.request.CourseType == 5) {
        if ((this.lateralrequest.CourseID != 143 && this.lateralrequest.CourseID != 281) || this.lateralrequest.RollNumber == '' || this.lateralrequest.PassingID == '' || this.lateralrequest.BoardID == 0) {
          return;
        }

        let boardNamelateral = '';
        if (this.lateralrequest.BoardID == 26) {
          boardNamelateral = 'RBSC';
        } else if (this.lateralrequest.BoardID == 34) {
          boardNamelateral = 'CBSE';
        } else if (this.lateralrequest.BoardID == 38) {
          boardNamelateral = 'Other';
        } else {
          boardNamelateral = 'Unknown';
        }

        if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 281) {
          this.BoardDatas.Class = 12;
        }


        this.BoardDatas.rollno = this.lateralrequest.RollNumber;
        this.BoardDatas.year = this.lateralrequest.PassingID;
        this.BoardDatas.board = boardNamelateral;

      }

      else if (this.request.CourseType == EnumCourseType.Non_Engineering) {
        if (this.formData.HighestQualificationHigh == '' || this.formData.RollNumberHigh == '' || this.formData.YearofPassingHigh == '' || this.formData.BoardID == 0) {
          return;
        }

        let boardName = '';
        if (this.formData.BoardID == 26) {
          boardName = 'RBSC';
        } else if (this.formData.BoardID == 34) {
          boardName = 'CBSE';
        } else if (this.formData.BoardID == 38) {
          boardName = 'Other';
        } else {
          boardName = 'Unknown';
        }


        this.BoardDatas.class = this.formData.HighestQualificationHigh;
        this.BoardDatas.rollno = this.formData.RollNumberHigh;
        this.BoardDatas.year = this.formData.YearofPassingHigh;
        this.BoardDatas.board = boardName;
      }


      else if (this.request.CourseType != 2) {
        if (this.formData.HighestQualificationHigh == '' || this.formData.RollNumberHigh == '' || this.formData.YearofPassingHigh == '' || this.formData.UniversityBoard == '') {
          return;
        }

        this.BoardDatas.class = this.formData.HighestQualificationHigh;
        this.BoardDatas.rollno = this.formData.RollNumberHigh;
        this.BoardDatas.year = this.formData.YearofPassingHigh;
        this.BoardDatas.board = this.formData.UniversityBoard;
      }

      this.loaderService.requestStarted();

      await this.studentjanAadhar.GetBoardData(this.BoardDatas)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.GetBoardList = data['Data'];

          if (this.request.CourseType == EnumCourseType.Lateral || this.request.CourseType == 5) {
            this.lateralrequest.AggMaxMark = data['Data'][0]['MAXNO']
            this.lateralrequest.AggObtMark = data['Data'][0]['GRAND_TOT']
            this.calculatePercentageCourseTypeWise();
          }

          if (this.request.CourseType == EnumCourseType.Non_Engineering) {
            this.formData.MaxMarksHigh = data['Data'][0]['MAXNO']
            this.formData.MarksObtainedHigh = data['Data'][0]['GRAND_TOT']
            this.calculatePercentageCourseTypeWise();
          }

          if (this.request.CourseType != 2) {
            this.formData.MaxMarksHigh = data['Data'][0]['MAXNO']
            this.formData.MarksObtainedHigh = data['Data'][0]['GRAND_TOT']
            this.calculatePercentageCourseTypeWise();
          }

        }, (error: any) => console.error(error));
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


  async GetBoardData10() {

    try {

      if (this.request.QualificationID == 0 || this.request.RollNumber == '' || this.request.PassingID == '' || this.request.BoardID == 0) {
        return;
      }

      let boardName10 = '';
      if (this.request.BoardID == 26) {
        boardName10 = 'RBSC';
      } else if (this.request.BoardID == 34) {
        boardName10 = 'CBSE';
      } else if (this.request.BoardID == 38) {
        boardName10 = 'Other';
      } else {
        boardName10 = 'Unknown';
      }

      this.BoardDatas.Class = this.request.QualificationID;
      this.BoardDatas.rollno = this.request.RollNumber;
      this.BoardDatas.year = this.request.PassingID;
      this.BoardDatas.board = boardName10;

      this.loaderService.requestStarted();

      await this.studentjanAadhar.GetBoardData(this.BoardDatas)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.GetBoardList = data['Data'];
          this.request.AggMaxMark = data['Data'][0]['MAXNO'];
          this.request.AggObtMark = data['Data'][0]['GRAND_TOT'];
          this.calculatePercentage();
        }, (error: any) => console.error(error));
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


  async SaveDataDegree1stYear() {
    this.isSubmitted = true;
     await this.RefreshValidators()
    if (this.QualificationForm.invalid) {
      return
    }

   
    if (this.request.BoardID != 38) {
      this.request.BoardExamID = 0
      this.request.BoardStateID = 0
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
            if (this.request.CourseType == 4) {  
              if (this.lateralrequest.BoardID != 38) {
                this.lateralrequest.BoardStateID = 0
                this.lateralrequest.BoardExamID = 0
              }
              if (this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 279) {
                this.lateralrequest.BoardID = 0
              }

              if (this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 279) {
                this.lateralrequest.BoardID = 0
              }
              if ((this.lateralrequest.CourseID != 141 && this.lateralrequest.CourseID != 279) && this.lateralrequest.BoardID != 38) {
                this.lateralrequest.BoardName = ''
              }
              if (!this.ShowOtherBoard12th && (this.lateralrequest.CourseID != 143 && this.lateralrequest.CourseID != 281)) {
                this.lateralrequest.BoardStateID = 0
                this.lateralrequest.BoardExamID = 0
              }

              if (this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 279 || this.lateralrequest.CourseID == 280 || this.lateralrequest.CourseID == 281) {
                this.SubjectID = []
              }
              debugger
              // if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 281) {
              //   this.lateralrequest.ClassSubject = ''
              // }               

              // this.SubjectID.forEach(e => e.CourseID = this.lateralrequest.CourseID)

              if(this.LateralQualificationForm.untouched == false){
                this.request.LateralEntryQualificationModel = []
                this.request.LateralEntryQualificationModel.push({
                  CourseID: this.lateralrequest.CourseID,
                  SubjectID: this.SubjectID,
                  BoardID: this.lateralrequest.BoardID,
                  BoardName: this.lateralrequest.BoardName,
                  ClassSubject: this.lateralrequest.ClassSubject,
                  PassingID: this.lateralrequest.PassingID,
                  AggMaxMark: this.lateralrequest.AggMaxMark,
                  AggObtMark: this.lateralrequest.AggObtMark,
                  Percentage: this.lateralrequest.Percentage,
                  Qualification: this.lateralrequest.Qualification,
                  RollNumber: this.lateralrequest.RollNumber,
                  StateID: this.lateralrequest.StateID,
                  MarkType: this.lateralrequest.MarkType,
                  BoardStateID: this.lateralrequest.BoardStateID,
                  BoardExamID: this.lateralrequest.BoardExamID,
                  ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId,
                  CoreBranchID: this.lateralrequest.CoreBranchID,
                  BranchID: this.lateralrequest.BranchID
                });
              }
              
            }            


            if(this.request.CourseType == 4 && this.lateralrequest.CourseID == 280) {

              if(this.EnglishQualificationForm.untouched == false){
                this.HighQualificationList = []
                this.HighQualificationList.push({
                  UniversityBoard: this.engRequest.UniversityBoardEnglish,
                  SchoolCollegeHigh: this.engRequest.SchoolCollegeEnglish,
                  HighestQualificationHigh: 'English',
                  YearofPassingHigh: this.engRequest.YearofPassingEnglish,
                  RollNumberHigh: this.engRequest.RollNumberEnglish,
                  MarksTypeIDHigh: this.engRequest.MarksTypeIDEnglish,
                  MaxMarksHigh: this.engRequest.MaxMarksEnglish,
                  PercentageHigh: this.engRequest.PercentageEnglish,
                  MarksObtainedHigh: this.engRequest.MarksObtainedEnglish,
                  ApplicationQualificationId: this.engRequest.ApplicationQualificationId,
                  StateIDHigh: this.engRequest.StateOfStudyEnglish,
                  BoardID: this.formData.BoardID,
                },
                );
                this.request.HighestQualificationModel = this.HighQualificationList
              } else {
                this.request.HighestQualificationModel = []
              }
            } else {
              this.request.HighestQualificationModel = []
            }

            this.request.LateralCourseID = this.lateralrequest.CourseID
            this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng

            this.isLoading = true;

            this.loaderService.requestStarted();

            this.request.ModifyBy = this.sSOLoginDataModel.UserID;

            this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
            this.request.QualificationID = 10

            //save
            await this.ApplicationService.SaveQualificationData(this.request)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.formSubmitSuccess.emit(true); // Notify parent of success
                  this.tabChange.emit(4); //
                  this.CancelData();
                  /* this.routers.navigate(['/Hrmaster']);*/

                }
                else {
                  this.toastr.error(data.ErrorMessage)
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

  async SaveDataDegree2ndYearLateral() {
    debugger
    this.isSubmitted = true;
    this.isLateralFormSubmit = true;
    await this.RefreshValidators()
    if (this.QualificationForm.invalid) {
      return
    }

    if (this.LateralQualificationForm.invalid) {
        //  Object.keys(this.LateralQualificationForm.controls).forEach(key => {
        //   const control = this.LateralQualificationForm.get(key);
        //    if (control && control.invalid) {
        //      this.toastr.error(`Control ${key} is invalid`);
        //      Object.keys(control.errors!).forEach(errorKey => {
        //        this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
        //      });
        //    }
        //  });
      return
    }

   
    if (this.request.BoardID != 38) {
      this.request.BoardExamID = 0
      this.request.BoardStateID = 0
    }


    if (this.request.IsSupplement == true) {
      if (this.request.SupplementaryDataModel.length < 1) {
        this.toastr.error("please Add Supplementry details")
        return
      }
    } 

    if (this.request.CourseType == 5) {  
      if (this.lateralrequest.BoardID != 38) {
        this.lateralrequest.BoardStateID = 0
        this.lateralrequest.BoardExamID = 0
      }
      if (this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 279) {
        this.lateralrequest.BoardID = 0
      }

      if (this.lateralrequest.CourseID == 141 || this.lateralrequest.CourseID == 279) {
        this.lateralrequest.BoardID = 0
      }
      if ((this.lateralrequest.CourseID != 141 && this.lateralrequest.CourseID != 279) && this.lateralrequest.BoardID != 38) {
        this.lateralrequest.BoardName = ''
      }
      if (!this.ShowOtherBoard12th && (this.lateralrequest.CourseID != 143 && this.lateralrequest.CourseID != 281)) {
        this.lateralrequest.BoardStateID = 0
        this.lateralrequest.BoardExamID = 0
      }

      if (this.lateralrequest.CourseID == 278 || this.lateralrequest.CourseID == 279 || this.lateralrequest.CourseID == 280 || this.lateralrequest.CourseID == 281) {
        this.SubjectID = []
      }

      if(this.lateralrequest.CourseID == 278) {
        this.lateralrequest.ClassSubject = ''
      }
      if(this.lateralrequest.CourseID != 278) {
        this.lateralrequest.BranchID = 0
        this.lateralrequest.CoreBranchID = 0
      }
      // if (this.lateralrequest.CourseID == 143 || this.lateralrequest.CourseID == 281) {
      //   this.lateralrequest.ClassSubject = ''
      // }               

      // this.SubjectID.forEach(e => e.CourseID = this.lateralrequest.CourseID)

      if(this.LateralQualificationForm.untouched == false){
        this.request.LateralEntryQualificationModel = []
        this.request.LateralEntryQualificationModel.push({
          CourseID: this.lateralrequest.CourseID,
          SubjectID: this.SubjectID,
          BoardID: this.lateralrequest.BoardID,
          BoardName: this.lateralrequest.BoardName,
          ClassSubject: this.lateralrequest.ClassSubject,
          PassingID: this.lateralrequest.PassingID,
          AggMaxMark: this.lateralrequest.AggMaxMark,
          AggObtMark: this.lateralrequest.AggObtMark,
          Percentage: this.lateralrequest.Percentage,
          Qualification: this.lateralrequest.Qualification,
          RollNumber: this.lateralrequest.RollNumber,
          StateID: this.lateralrequest.StateID,
          MarkType: this.lateralrequest.MarkType,
          BoardStateID: this.lateralrequest.BoardStateID,
          BoardExamID: this.lateralrequest.BoardExamID,
          ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId,
          CoreBranchID: this.lateralrequest.CoreBranchID,
          BranchID: this.lateralrequest.BranchID
        });
      }
      
    }            


    // if(this.request.CourseType == 4 && this.lateralrequest.CourseID == 280) {

    //   if(this.EnglishQualificationForm.untouched == false){
    //     this.HighQualificationList = []
    //     this.HighQualificationList.push({
    //       UniversityBoard: this.engRequest.UniversityBoardEnglish,
    //       SchoolCollegeHigh: this.engRequest.SchoolCollegeEnglish,
    //       HighestQualificationHigh: 'English',
    //       YearofPassingHigh: this.engRequest.YearofPassingEnglish,
    //       RollNumberHigh: this.engRequest.RollNumberEnglish,
    //       MarksTypeIDHigh: this.engRequest.MarksTypeIDEnglish,
    //       MaxMarksHigh: this.engRequest.MaxMarksEnglish,
    //       PercentageHigh: this.engRequest.PercentageEnglish,
    //       MarksObtainedHigh: this.engRequest.MarksObtainedEnglish,
    //       ApplicationQualificationId: this.engRequest.ApplicationQualificationId,
    //       StateIDHigh: this.engRequest.StateOfStudyEnglish,
    //       BoardID: this.formData.BoardID,
    //     },
    //     );
    //     this.request.HighestQualificationModel = this.HighQualificationList
    //   } else {
    //     this.request.HighestQualificationModel = []
    //   }
    // } else {
    //   this.request.HighestQualificationModel = []
    // }

    this.Swal2.Confirmation("Are you sure you want to Submit this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            

            this.request.LateralCourseID = this.lateralrequest.CourseID
            this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng

            this.isLoading = true;

            this.loaderService.requestStarted();

            this.request.ModifyBy = this.sSOLoginDataModel.UserID;

            this.request.ApplicationID = this.sSOLoginDataModel.ApplicationID;
            this.request.QualificationID = 10

            //save
            await this.ApplicationService.SaveQualificationData(this.request)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.formSubmitSuccess.emit(true); // Notify parent of success
                  this.tabChange.emit(4); //
                  this.CancelData();
                  /* this.routers.navigate(['/Hrmaster']);*/

                }
                else {
                  this.toastr.error(data.ErrorMessage)
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
}