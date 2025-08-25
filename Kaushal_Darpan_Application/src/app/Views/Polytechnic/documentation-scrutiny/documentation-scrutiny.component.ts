import { Component, EventEmitter, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DocumentDetailList, DocumentDetailsDataModel } from '../../../Models/ITIFormDataModel';
import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumVerificationAction, GlobalConstants } from '../../../Common/GlobalConstants';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ItiApplicationFormService } from '../../../Services/ItiApplicationForm/iti-application-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BterSearchmodel, LateralEntryQualificationModel, Lateralsubject, SupplementaryDataModel } from '../../../Models/ApplicationFormDataModel';
import { DocumentScrutinyDataModel, RejectModel } from '../../../Models/DocumentScrutinyDataModel';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { StudentVerificationListService } from '../../../Services/StudentVerificationList/student-verification-list.service';
import { VerificationDocumentDetailList } from '../../../Models/StudentVerificationDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { TSPTehsilDataModel } from '../../../Models/CommonMasterDataModel';
import { TspAreasService } from '../../../Services/Tsp-Areas/Tsp-Areas.service';
import { StudentStatusHistoryComponent } from '../../Student/student-status-history/student-status-history.component';

@Component({
  selector: 'app-documentation-scrutiny',
  templateUrl: './documentation-scrutiny.component.html',
  styleUrls: ['./documentation-scrutiny.component.css'],
  standalone: false
})
export class DocumentationScrutinyComponent {

  public SSOLoginDataModel = new SSOLoginDataModel()
  public DocumentDetailsFormGroup!: FormGroup;
  public formData = new DocumentDetailsDataModel()
  public _GlobalConstants: any = GlobalConstants;
  public request = new DocumentScrutinyDataModel()
  public searchRequest = new BterSearchmodel()
  public isSubmitted: boolean = false
  public QualificationDataList: any = []
  public box10thChecked: boolean = false
  public box8thChecked: boolean = false
  public isSupp: boolean = false
  public ApplicationID: number = 0;
  public PersonalDetailForm!: FormGroup
  public QualificationForm!: FormGroup
  public SupplementaryForm!: FormGroup
  public RadioForm!: FormGroup
  public errorMessage = '';
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public maritialList: any = []
  public CategoryBlist: any = []
  public CategoryAlist: any = []
  public isSupplement: boolean = false
  public NationalityList: any = []
  public ReligionList: any = []
  public category_CList: any = []
  public category_PreList: any = []
  public GenderList: any = []
  public marktypelist: any = []
  public BoardList: any = []
  public addrequest = new SupplementaryDataModel()
  calculatedPercentage: number = 0;
  public DocumentStatusList: any = []
  public Isremarkshow: boolean = false
  public changeshow: boolean = false
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  closeResult: string | undefined;
  public reject = new RejectModel()
  public Lateralcourselist: any = []
  public _EnumCourseType = EnumCourseType
  public _EnumActionStatus = EnumVerificationAction
  public LateralQualificationForm !: FormGroup
  public action: string = ''
  public SubjectMasterDDLList: any = []
  public CategoryDlist: any = []
  public SubjectID: Lateralsubject[] = []
  public lateralrequest = new LateralEntryQualificationModel()
  public errormessage: string = ''
  public settingsMultiselect: object = {};
  public filteredDocumentDetails: VerificationDocumentDetailList[] = []
  public TspDistrictList: any = []
  public filteredTehsilList: any = []
  public TspTehsilRequest = new TSPTehsilDataModel()
  public TspTehsilList: any = []
  public DevnarayanAreaList: any = []
  public DevnarayanTehsilList: any = []
  @ViewChild(StudentStatusHistoryComponent) childComponent!: StudentStatusHistoryComponent;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private ItiApplicationFormService: ItiApplicationFormService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ApplicationService: StudentVerificationListService,
    private modalService: NgbModal,
    private swat: SweetAlert2,
    private tspAreaService: TspAreasService
  ) { }

  async ngOnInit() {
    // form group


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



    this.PersonalDetailForm = this.formBuilder.group(
      {
        txtName: ['', Validators.required],
        txtSSOID: ['', Validators.required],
        txtnameHindi: [{ value: '' }, Validators.required],
        txtEmail: [''],
        txtFather: [{ value: '', disabled: true }, Validators.required],
        txtFatherHindi: [{ value: '' }, Validators.required],
        txtDOB: ['', Validators.required],
        txtMotherEngname: [{ value: '' }, Validators.required],
        Gender: [''],
        MobileNumber: ['', Validators.required],
        /*   txtWhatsappMobileNumber: [''],*/
        txtMotherHindiname: [{ value: '' }, Validators.required],
        /*  txtLandlineNumber: [''],*/
        ddlIdentityProof: ['', Validators.required],
        txtDetailsofIDProof: ['', [Validators.required, this.validateIDLength.bind(this)]],

        ddlMaritial: ['', [DropdownValidators]],
        ddlReligion: ['', [DropdownValidators]],
        ddlNationality: ['', [DropdownValidators]],
        ddlCategoryA: [{ value: '', disabled: true }],
        ddlCategoryB: [{ value: '', disabled: true }],
        ddlCategoryc: [{ value: '', disabled: true }],
        ddlCategoryE: [{ value: '', disabled: true }],
        ddlPrefential: [{ value: '', disabled: true }, [DropdownValidators]],
        IsTSP: [''],
        IsSaharia: [''],
        TspDistrictID: [''],
        subCategory: [''],
        IsDevnarayan: [''],
        DevnarayanDistrictID: [''],
        DevnarayanTehsilID: [''],
        TSPTehsilID: [''],
        ddlCategoryD: [{ value: '', disabled: true }],
      });
    this.QualificationForm = this.formBuilder.group(
      {
        txtRollNumber: ['', Validators.required],
        txtAggregateMaximumMarks: ['', Validators.required],
        txtAggregateMarksObtained: ['', Validators.required],
        txtpercentage: [{ value: '', disabled: true }],
        ddlStateID: ['', [DropdownValidators]],
        ddlBoardID: ['', [DropdownValidators]],
        ddlPassyear: ['', [DropdownValidators]],
        ddlMarksType: ['', [DropdownValidators]],
      });

    this.SupplementaryForm = this.formBuilder.group(
      {

        txtsubject: ['', Validators.required],
        txtRollNo: ['', Validators.required],
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
        txtRollNumber: ['', Validators.required],
        txtAggregateMaximumMarks: ['', Validators.required],
        txtAggregateMarksObtained: ['', Validators.required],
        txtpercentage: [{ value: '', disabled: true }],
        ddlStateID: ['', [DropdownValidators]],
        ddlBoardID: ['', [DropdownValidators]],
        ddlPassyear: ['', [DropdownValidators]],
        ddlMarksType: ['', [DropdownValidators]],
        SubjectID: ['', Validators.required]
      }

    )


    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.DocumentDetailsFormGroup = this.formBuilder.group({

    });
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.ApplicationID = Number(this.activatedRoute.snapshot.queryParamMap.get('ApplicationID') ?? 0);
    if (this.ApplicationID > 0) {
      this.searchRequest.ApplicationID = this.ApplicationID;
      this.GetDocumentbyID()

    }
    else {
      window.location.href = "/StudentVerificationList";

    }

    this.GetMasterDDL()

    await this.GetStateMatserDDL()
    await this.GetPassingYearDDL()
    this.calculatePercentage()
    this.GetMarktYPEDDL()
    this.calculateLateralPercentage()

    this.GetLateralCourse()
  }
  get _PersonalDetailForm() { return this.PersonalDetailForm.controls; }
  get _QualificationForm() { return this.QualificationForm.controls; }
  get _SupplementaryForm() { return this.SupplementaryForm.controls; }
  get _LateralQualificationForm() { return this.LateralQualificationForm.controls; }


  passingYearValidation() {
    if (this.request.PassingID != '' && this.lateralrequest.PassingID != '' && this.lateralrequest.PassingID <= this.request.PassingID) {
      this.toastr.error('Passing Year of Higher Qualification must be greater than 10th Passing Year', 'Error');
      this.lateralrequest.PassingID = '';
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
  }


  async ViewHistory(row: any, ID: number) {
    //this.searchRequest.action = "_GetstudentWorkflowdetails";
    //this.GetAllDataActionWise();

    this.childComponent.OpenRevertDocumentPopup(ID, this.searchRequest.ApplicationID);
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

  async GetTspTehsilList() {
    this.TspTehsilRequest.DistrictID = this.request.TspDistrictID
    try {
      this.loaderService.requestStarted();

      await this.tspAreaService.TSPArea_GetTehsil_DistrictWise(this.TspTehsilRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TspTehsilList = data['Data'];
          console.log("TspTehsilList", this.TspTehsilList)
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

  async selectDDID(districtID: number) {
    if (districtID > 0) {
      this.filteredTehsilList = this.DevnarayanTehsilList.filter((tehsil: any) =>
        Number(tehsil.DistrictID.toString().trim()) == Number(districtID)
      );
      console.log('Filtered Tehsils:', this.filteredTehsilList);
    } else {
      this.filteredTehsilList = [];
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



  async GetDocumentbyID() {
    this.isSubmitted = false;

    this.searchRequest.SSOID = this.SSOLoginDataModel.SSOID;
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.DocumentScrunityData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'data ');

          if (data['Data'] != null) {
            this.request = data['Data']

            this.request.IsSupplement = data['Data']['IsSupplement']
            this.request = data['Data']
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;
            this.request.Religion = data['Data']['Religion']
            /* alert(this.request.IsSupplement)*/
            if (data['Data']['IsSupplement'] === true) {
              this.isSupplement = true
            }
            else {
              this.isSupplement = false
            }

            if (this.request.PassingID == null) {
              this.request.PassingID = ''
            } else {
              this.request.PassingID = data['Data']['PassingID']
            }
            this.request.VerificationDocumentDetailList = data['Data']['VerificationDocumentDetailList']
            //this.request.DOB = new Date(data['Data']['DOB']).toISOString().split('T').shift().toString();
            //this.request.Religion = data['Data']['Religion
            this.request.VerificationDocumentDetailList = this.request.VerificationDocumentDetailList.map(doc => ({
              ...doc,
              DisFileName: doc.DisFileName.replace(/^upload the scanned copy of /i, '') // Remove "upload the "
            }));
            this.request.VerificationDocumentDetailList.forEach((dOC: any) => {
              dOC.ShowRemark = dOC.Status === EnumVerificationAction.Revert;
            });
           this.request.VerificationDocumentDetailList.some((x: any) => x.Status === 5); this.request.VerificationDocumentDetailList.forEach((x: any) => {
              if (x.Status === 5) {
                x.Status = 0;
              }
           });
            
            if (this.request.VerificationDocumentDetailList.some((x: any) => x.Status != 0)) {
              this.changeshow = false
            } else if (this.request.VerificationDocumentDetailList.every((x: any) => x.Status == 0)) {
              this.changeshow = true
            }
     
            this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status === EnumVerificationAction.Revert);
          }
          if (this.request.LateralEntryQualificationModel == null) {
            this.request.LateralEntryQualificationModel = []
            this.lateralrequest = new LateralEntryQualificationModel()
          } else {
            this.request.LateralEntryQualificationModel = data['Data']['LateralEntryQualificationModel']
            this.lateralrequest = data['Data']['LateralEntryQualificationModel'][0]
            this.GetStreamCourse()

            this.SubjectID = data['Data']['LateralEntryQualificationModel'][0]['SubjectID']

            console.log(this.SubjectID, "Subjects")
          }
            if (this.request?.VerificationDocumentDetailList) {

              this.filteredDocumentDetails = this.request.VerificationDocumentDetailList.filter((x) => x.GroupNo === 1);

            } else {
         
              this.filteredDocumentDetails = [];
            }


            if (data.Data.IsTSP == true) {
              this.request.subCategory = 1
              console.log("subCategory", this.request.subCategory)
            } else if (data.Data.IsSaharia == true) {
              this.request.subCategory = 2
            } else {
              this.request.subCategory = 3
            }
            console.log(this.request.VerificationDocumentDetailList,"ddd")
            this.GetTspTehsilList()
            this.commonMasterService.GetCommonMasterData('DevnarayanAreaTehsil')
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.DevnarayanTehsilList = data['Data'];
                this.selectDDID(this.request.DevnarayanDistrictID);
                this.filteredTehsilList.ID = this.request.DevnarayanDistrictID;
                this.request.DevnarayanTehsilID = data.Data.DevnarayanTehsilID;
              }, (error: any) => {
              });
            this.request.DevnarayanTehsilID;

          
          

          //this.request = data['Data'];

          /* alert(this.request.IsSupplement)*/
 

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

  onIdentityProofChange() {
    this.PersonalDetailForm.get('txtDetailsofIDProof')?.updateValueAndValidity();
  }

  validateIDLength(control: any) {
    const identityProof = this.PersonalDetailForm?.get('ddlIdentityProof')?.value; // Access the value correctly
    const value = control.value; // This is the value of the current input

    if (identityProof === '1' && value?.length !== 12) {
      this.errorMessage = 'Aadhar Number must be exactly 12 digits.';
      return { invalidLength: true };
    } else if (identityProof === '2' && value?.length !== 28) {
      this.errorMessage = 'Aadhar Enrolment ID must be exactly 28 digits.';
      return { invalidLength: true };
    }
    return null; // Validation passed
  }
  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MaritalStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.maritialList = data['Data'];

        }, (error: any) => console.error(error)
      );
      await this.commonMasterService.GetCommonMasterDDLByType('CategoryD')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.CategoryDlist = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.CategoryBDDLData(EnumDepartment.BTER)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryBlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.CategoryAlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('Nationality')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.NationalityList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('Religion')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /* console.log(data, 'ggg');*/
          this.ReligionList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('Category_C')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*  console.log(data, 'ggg');*/
          this.category_CList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('PrefentialCategory')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          /*console.log(data, 'ggg');*/
          this.category_PreList = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList)
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('Board')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BoardList = data['Data'];
          console.log("GenderList", this.GenderList)
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterData('DocumentScruitny')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DocumentStatusList = data['Data'];
          this.DocumentStatusList = data['Data'].filter((item: any) => item.ID === EnumVerificationAction.Approved || item.ID === EnumVerificationAction.Revert);

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


  async OnShow(item: any) {

    if (item == 1) {
      this.isSupplement = true



    } else {
      this.isSupplement = false
      this.request.SupplementaryDataModel = []


    }
  }

  async AddNew() {
    this.isSupp = true

    if (this.SupplementaryForm.invalid) {
      return console.log("error");
    }
    //Show Loading

    try {

      /*this.addrequest.PassingID = this.FinalcialList.filter((x: any) => x.FinancialYearID == this.EducationalQualificationFormData.PassingYearID)[0]['FinancialYearName'];*/
      this.request.SupplementaryDataModel.push(
        {

          PassingID: this.addrequest.PassingID,
          RollN0: this.addrequest.RollN0,
          Subject: this.addrequest.Subject,
          EducationCategory: this.addrequest.EducationCategory,
          MaxMarksSupply: this.addrequest.MaxMarksSupply,
          ObtMarksSupply: this.addrequest.ObtMarksSupply,
          SupplementryID: 0


        },

      );

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
        if (percentage <= 33) {
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
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage <= 33) {
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
      this.QualificationForm.get('txtAggregateMaximumMarks')?.enable();
      if (maxMarks && marksObtained && marksObtained <= maxMarks) {
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


  async GetPassingYearDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.PassingYear()
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

  //calculatePercentage(): void {
  //  const maxMarks = this.request.AggMaxMark;
  //  const marksObtained = this.request.AggObtMark;

  //  if (this.request.MarkType == 84) {
  //    if (maxMarks && marksObtained) {
  //      const percentage = marksObtained * 9.5;
  //      this.request.Percentage = percentage.toFixed(2);
  //    } else {
  //      this.request.Percentage = '';
  //    }
  //  } else if (this.request.MarkType == 83) {
  //    if (maxMarks && marksObtained) {
  //      const percentage = (marksObtained / maxMarks) * 100;
  //      this.request.Percentage = percentage.toFixed(2);
  //    } else {
  //      this.request.Percentage = '';
  //    }
  //    if (this.request.SupplementaryDataModel == null) {
  //      this.request.SupplementaryDataModel = []
  //    }
  //  }

  //}



  async OnRemarkChange(dOC: any) {
    if (this.request.VerificationDocumentDetailList.some((x: any) => x.Status != 0)) {
      this.changeshow = false
    } else if (this.request.VerificationDocumentDetailList.every((x: any) => x.Status == 0)) {
      this.changeshow = true
    }
    if (dOC.Status == EnumVerificationAction.Revert) {
      dOC.ShowRemark = true;
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
    }
    this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);
  }



  async SaveData() {
    this.isSubmitted = true;
    if (this.request.IsSupplement == true) {
      if (this.request.SupplementaryDataModel.length < 1) {
        this.toastr.error("please Add Supplementry details")
        return
      }
    }
    const IsRemarKvalid = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert && x.Remark == '' || x.Status == 0);
    if (IsRemarKvalid == true) {
      /*      this.toastr.error("Please enter valisd Remark")*/
      return
    }


    this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);



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
        ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId

      })
    }
    console.log(this.request)
   

    if (this.Isremarkshow == true) {
      this.request.status = EnumVerificationAction.Revert
      this.request.Remark = 'Revert'
    } else {
      this.request.status = EnumVerificationAction.Approved
      this.request.Remark = 'Approved'
    }
      
    const confirmationMessage =
      this.request.status === EnumVerificationAction.Approved
        ? "Are you sure you want to Approve?"
        : "Are you sure you want to Revert?";


    if (this.request.CategoryA == 3) {
      if (this.request.subCategory == 1) {
        this.request.IsTSP = true
        this.request.IsSaharia = false
      } else if (this.request.subCategory == 2) {
        this.request.IsSaharia = true
        this.request.IsTSP = false
        this.request.TspDistrictID = 0
        this.request.TSPTehsilID = 0
      } else if (this.request.subCategory == 3) {
        this.request.IsTSP = false
        this.request.IsSaharia = false
        this.request.TspDistrictID = 0
        this.request.TSPTehsilID = 0
      } else {
        this.toastr.error('Please Select उप वर्ग (Subcategory)');
        return
      }
    }


    if (this.request.IsTSP == true) {
      if (this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
        this.toastr.error('Please Select अनुसूचित जिला (Tribal District)');
        return
      }
    } else {
      this.request.TspDistrictID = 0
    }







    this.request.ModifyBy = this.SSOLoginDataModel.UserID;
    this.request.DepartmentID = EnumDepartment.BTER
    this.request.IsSupplement = this.isSupplement

    this.swat.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          await this.ApplicationService.Save_Documentscrutiny(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.router.navigate(['/StudentVerificationList'])
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }

            }, (error: any) => console.error(error)
            );
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }
  async RejectPreview(content: any) {



    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async CloseModel() {
    this.loaderService.requestStarted();
    this.request.Remark = ''
   
    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
    }, 200);
  }

  async RejectDocument() {

    if (this.reject.Remark == '') {
      this.toastr.error("Please Enter Remarks")
      return
    }
    this.reject.ModifyBy = this.SSOLoginDataModel.UserID;
    this.reject.DepartmentID = EnumDepartment.BTER
    this.reject.ApplicationID = this.request.ApplicationID
    this.reject.Action = EnumVerificationAction.Reject
    this.CloseModel()
    this.swat.Confirmation("Are you sure you want to Reject?", async (result: any) => {
 
      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          await this.ApplicationService.Reject_Document(this.reject)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.CloseModel()
                this.router.navigate(['/StudentVerificationList'])
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }



            }, (error: any) => console.error(error)
            );

        }

        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })

  }
  SaveDataChange() {
    this.isSubmitted = true;
    if (this.request.IsSupplement == true) {
      if (this.request.SupplementaryDataModel.length < 1) {
        this.toastr.error("please Add Supplementry details")
        return
      }
    }
    //const IsRemarKvalid = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert && x.Remark == '' || x.Status == 0);
    //if (IsRemarKvalid == true) {
    //  /*      this.toastr.error("Please enter valisd Remark")*/
    //  return
    //}


/*    this.Isremarkshow = this.request.VerificationDocumentDetailList.some((x: any) => x.Status == EnumVerificationAction.Revert);*/



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
        ApplicationQualificationId: this.lateralrequest.ApplicationQualificationId

      })
    }
    console.log(this.request)


    this.request.status = EnumVerificationAction.Changed
    this.request.Remark="Changed"

    const confirmationMessage =
      this.request.status === EnumVerificationAction.Changed
        ? "Are you sure you want to Changed?"
        : "Are you sure you want to Revert?";


    if (this.request.CategoryA == 3) {
      if (this.request.subCategory == 1) {
        this.request.IsTSP = true
        this.request.IsSaharia = false
      } else if (this.request.subCategory == 2) {
        this.request.IsSaharia = true
        this.request.IsTSP = false
        this.request.TspDistrictID = 0
        this.request.TSPTehsilID = 0
      } else if (this.request.subCategory == 3) {
        this.request.IsTSP = false
        this.request.IsSaharia = false
        this.request.TspDistrictID = 0
        this.request.TSPTehsilID = 0
      } else {
        this.toastr.error('Please Select उप वर्ग (Subcategory)');
        return
      }
    }


    if (this.request.IsTSP == true) {
      if (this.request.TspDistrictID == 0 || this.request.TspDistrictID == null || this.request.TspDistrictID == undefined) {
        this.toastr.error('Please Select अनुसूचित जिला (Tribal District)');
        return
      }
    } else {
      this.request.TspDistrictID = 0
    }







    this.request.ModifyBy = this.SSOLoginDataModel.UserID;
    this.request.DepartmentID = EnumDepartment.BTER
    this.request.IsSupplement = this.isSupplement

    this.swat.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          await this.ApplicationService.Save_Documentscrutiny(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.router.navigate(['/StudentVerificationList'])
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }

            }, (error: any) => console.error(error)
            );
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }

  

}
