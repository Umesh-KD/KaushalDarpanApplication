import { Component, ViewChild } from '@angular/core';
import { EnumDepartment, EnumEligibilityStatus, enumExamStudentStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { M_StudentMaster_QualificationDetailsModel, RevertDataModel, Student_DataModel, StudentAttendenceModel, StudentMarkedModel, StudentMasterModel } from '../../../../Models/StudentMasterModels';
import { DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { CommonSubjectDetailsMasterModel } from '../../../../Models/CommonSubjectDetailsMasterModel';
import { SubjectSearchModel } from '../../../../Models/SubjectMasterDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ReportBasedModel } from '../../../../Models/ReportBasedDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { UserMasterService } from '../../../../Services/UserMaster/user-master.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../../../Services/Report/report.service';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ViewStudentDetailsRequestModel } from '../../../../Models/ViewStudentDetailsRequestModel';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { StudentExaminationITIService } from '../../../../Services/ITI/Examination/student-examination-iti.service';
import { ITIExamination_UpdateEnrollmentNoModel, ITIExaminationOptionalSubjectRequestModel, ITIExaminationStudentDataModel } from '../../../../Models/ITIExaminationDataModel';
import { ApplicationStatusService } from '../../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { StudentSearchModel } from '../../../../Models/StudentSearchModel';
import { EmitraApplicationstatusModel } from '../../../../Models/EmitraApplicationstatusDataModel';

@Component({
  selector: 'app-student-examination-iti',
  standalone: false,
  templateUrl: './student-examination-iti.component.html',
  styleUrl: './student-examination-iti.component.css'
})
export class StudentExaminationITIComponent
{
  public _GlobalConstants: any = GlobalConstants;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public SubjectID: any[] = [];
  public UserID: number = 0
  public RoleID: number = 0
  public InstituteMasterList: any = [];
  public InstitutionManagementMasterList: any = [];
  public StreamMasterList: any = [];
  public SemesterMasterList: any = [];
  public StudentTypeList: any = [];
  public StudentStatusList: any = [];
  public ExamCategoryList: any = [];
  public PreExamStudentData: StudentMasterModel[] = [];
  public attendence = new StudentAttendenceModel()
  public StudentProfileDetailsData: any = [];
  public Student_QualificationDetailsData: any = [];
  public documentDetails: DocumentDetailsModel[] = [];

  public settingsMultiselect: object = {};
  public commonSubjectDetails: CommonSubjectDetailsMasterModel[] = [];
  public Student_DataList: Student_DataModel[] = []
  public statusID: number = 0
  public showSubject: boolean = false

  request = new ITIExaminationStudentDataModel();
  Revert = new RevertDataModel();
  searchrequest = new SubjectSearchModel()
  requestStudent = new StudentMasterModel();
  RequestStudent = new M_StudentMaster_QualificationDetailsModel();
  requestUpdateEnrollmentNo = new ITIExamination_UpdateEnrollmentNoModel();
  optSubRequest = new ITIExaminationOptionalSubjectRequestModel();
  public _EnumRole = EnumRole;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public IsShowViewStudent: boolean = false;
  public StudentTypeMasterList: any = [];
  public BoardMasterList: any = [];
  public PassingYearList: any = [];
  public ExamStudentStatusDDLList: any = [];
  public CasteCategoryAMasterData: any = [];
  public CasteCategoryBMasterData: any = [];
  public SubjectMasterDDLList: any[] = [];
  public selectedSubjects: any = [];
  public optionalSubjectList: any = [];
  public optionalChildSubjectList: any = [];
  public status: number = 0
  public FinancialYear: any = []
  public isShowdrop: boolean = true
  isSearchEnabled: boolean = false;
  IsVerified: boolean = false;
  isDropdownVisible: boolean = false;
  public NewExamStudentStatusDDLList: any = []
  EditStudentDataFormGroup!: FormGroup;
  formUpdateEnrollmentNo!: FormGroup;
  AttendenceFormGroup!: FormGroup;
  public SearchStudentDataFormGroup!: FormGroup;
  public OptionalSubjectFormGroup!: FormGroup;
  public InstitutesListForStudent: any = []

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isFormSubmitted: boolean = false;
  public EligibilityStatusData: any = [];
  public _EnumEligibilityStatus = EnumEligibilityStatus;
  public isinstitutelist: boolean = false;

  public TodayDate = new Date()

  public _enumExamStudentStatus = enumExamStudentStatus;

  public ReportBasedModelSearch = new ReportBasedModel()
  public file!: File;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public StudentName: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  public SubCasteCategoryADDLList: any[] = [];
  public reportRequest = new ReportBasedModel()
  public searchRequest = new StudentSearchModel();

  public isShowGrid: boolean = false;
  public StudentDetailsModelList: EmitraApplicationstatusModel[] = []

  public AttendancePercentage: string = '';

  //closeResult: string | undefined;
  //modalReference: NgbModalRef | undefined;
  @ViewChild('modal_StudentStatusHistory') modal_StudentStatusHistory: any; item: any;

  constructor(private commonMasterService: CommonFunctionService,
    private studentExaminationITIService: StudentExaminationITIService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private UserMasterService: UserMasterService,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private http: HttpClient,
    private studentService: ApplicationStatusService,
    private documentDetailsService: DocumentDetailsService
  ) {
  }

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
      isinstitutelist: false,
    };


    this.SearchStudentDataFormGroup = this.formBuilder.group(
      {
        txtEnrollmentNo: [''],
        ddlInstituteID: [{ value: '' }],
        //ddlFinancialYearID: ['', [DropdownValidators]],
        ddlStreamID: [''],
        ddlSemesterID: [''],
        /*        ddlExamstatus: ['', [DropdownValidators]],*/
        ddlStudentTypeID: [''],
        ddlManagementID: [''],
        ddlstatus: [''],
        ddlsubjectstaus: [''],
        ddlbridege: [''],
        ddlExamCategoryID: [''],
        txtStudentName: [''],
        txtMobileNo: [''],
        ddlEligibilityStatus:['0']
      })

    this.OptionalSubjectFormGroup = this.formBuilder.group(
      {
        ddlOptSubjectParentID: [''],
        ddlOptSubjectID: [''],
      })

    this.EditStudentDataFormGroup = this.formBuilder.group(
      {
        txtStudentName: [{ value: '', disabled: true }, Validators.required],
        txtStudentNameHindi: [{ value: '', disabled: true }, Validators.required],
        txtFatherName: [{ value: '', disabled: true }, Validators.required],
        txtFatherNameHindi: [{ value: '', disabled: true }, Validators.required],
        txtMotherName: [{ value: '', disabled: true }, Validators.required],
        txtMotherNameHindi: [{ value: '', disabled: true }, Validators.required],
        ddlStudentTypeID: [{ value: '', disabled: true }, Validators.required],
        ddlGender: [{ value: '', disabled: true }, Validators.required],
        txtPapers: [{ value: '', disabled: true }],
        ddlInstituteID: [{ value: '', disabled: true }, [DropdownValidators]],
        ddlStreamID: [{ value: '', disabled: true }, [DropdownValidators]],
        txtMobileNo: ['', Validators.required],

        ddlCategoryA_ID: [{ value: '', disabled: true }, [DropdownValidators]],
        ddlCategoryB_ID: [{ value: '', disabled: true }, [DropdownValidators]],
        txtDOB: [{ value: '', disabled: true }, Validators.required],
        txtEmail: [{ value: '', disabled: true }, Validators.required],
        txtAadharNo: [{ value: '', disabled: true }],
        txtBhamashahNo: [{ value: '', disabled: true }],
        txtAddress: [{ value: '', disabled: true }],
        txtBankName: [{ value: '', disabled: true }],
        txtIFSCCode: [{ value: '', disabled: true }],
        txtBankAccountNo: [{ value: '', disabled: true }],
        IsVerified: [''],
        ddlSubCategoryA_ID: [{ value: '', disabled: true }, Validators.required],
      })
    this.requestStudent.commonSubjectDetails = [];

    this.formUpdateEnrollmentNo = this.formBuilder.group(
      {
        //txtEnrollmentNo: ['', Validators.required, disable: true],

      
        txtOrderNo: ['', Validators.required],
        txtOrderDate: ['', Validators.required],

      })


    this.AttendenceFormGroup = this.formBuilder.group(
      {
        //txtEnrollmentNo: ['', Validators.required, disable: true],

        EligibilityStatus: ['', [DropdownValidators]],

        FaMark: ['', [Validators.required, this.conditionalFaMarkValidator('EligibilityStatus'), Validators.max(200)]],
        Remarks: ['']
        //ReceiptNo: ['', Validators.required],
        //DepositDate: ['', Validators.required]
      })

    


    this.requestStudent.QualificationDetails = [];
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.statusID = Number(this.activatedRoute.snapshot.queryParamMap.get('status')?.toString());
    if (this.statusID > 0)
    {
      this.request.StudentFilterStatusId = this.statusID
    }

    this.UserID = this.sSOLoginDataModel.UserID
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID

    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
      this.isShowdrop = true;

      this.SearchStudentDataFormGroup.get('ddlInstituteID')?.disable();


    } else {
      this.isShowdrop = false;
      this.SearchStudentDataFormGroup.get('ddlInstituteID')?.enable();

    }


    await this.GetMasterData();
    await this.StreamMaster();
    await this.GetcOmmonData();

  }


  async RevertStatus(item: any) {
    // confirm
    this.Swal2.Confirmation("Are you sure you want to Revert This?", async (result: any) => {
      
      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          this.Revert.StudentExamID = item.StudentExamID
          this.Revert.status = item.status
          // Call service to save student exam status
          await this.studentExaminationITIService.RevertStatus(this.Revert)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }

  OpenHistoryPopup(item: any) {
    
    this.searchRequest.StudentExamID = item.StudentExamID;
    this.ViewHistory(this.modal_StudentStatusHistory, item)
    this.GetAllDataActionWise();
  }
  async GetAllDataActionWise() {
    
    this.isShowGrid = true;

    this.searchRequest.action = "_GetITIstudentWorkflowdetails";
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.StudentExamID
      await this.studentService.StudentApplicationStatus(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            this.searchRequest.CreateDate = data['Data']['CreateDate'];
            console.log(this.searchRequest.CreateDate, 'CreatedDate')
            console.log(this.StudentDetailsModelList, 'List')
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
  async ViewHistory(content: any, item: any) {
    this.StudentName = item.StudentName
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  

  get EditStudentDataform() { return this.EditStudentDataFormGroup.controls; }
  get FormUEM() { return this.formUpdateEnrollmentNo.controls; }
  get _OptionalSubjectFormGroup() { return this.OptionalSubjectFormGroup.controls; }
  get _AttendenceFormGroup() { return this.AttendenceFormGroup.controls; }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.Iticollege(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT) {
            this.InstituteMasterList = data['Data'];
            this.request.InstituteID = this.sSOLoginDataModel.InstituteID
            this.InstituteMasterList = this.InstituteMasterList.filter((x: any) => { return x.InstituteID == this.request.InstituteID });
            //console.log(this.sSOLoginDataModel.InstituteID,'ss1')
            //console.log(this.InstituteMasterList,'ss2')
            //this.isinstitutelist = true;
            this.SearchStudentDataFormGroup.get('ddlInstituteID')?.disable();
          
          } else {
            this.InstituteMasterList = data['Data'];
            this.request.InstituteID = 0
          }
        }, (error: any) => console.error(error));


      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstitutesListForStudent = data['Data'];
          console.log("InstitutesListForStudent", this.InstitutesListForStudent);
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetManagType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstitutionManagementMasterList = data['Data'];
        }, (error: any) => console.error(error));

      //await this.commonMasterService.StreamMaster()
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.StreamMasterList = data['Data'];
      //    this.StreamMasterList = data['Data'];
      //  }, (error: any) => console.error(error));
      await this.commonMasterService.ITI_SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];

         // this.SemesterMasterList = [{ 'SemesterID:1' "SemesterName:1 Year" } { "SemesterName:1 Year"}]
        }, (error: any) => console.error(error));

      await this.commonMasterService.StudentType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentTypeList = data['Data'];
          this.StudentTypeMasterList = data['Data'];


        }, (error: any) => console.error(error));

      await this.commonMasterService.ItiGetStudentStatusByRole(this.sSOLoginDataModel.RoleID, 2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentStatusList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.ExamCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamCategoryList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CasteCategoryAMasterData = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.CasteCategoryB()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CasteCategoryBMasterData = data['Data'];
          console.log("this.CasteCategoryBMasterData", this.CasteCategoryBMasterData);
        }, (error: any) => console.error(error));

      await this.commonMasterService.Board_UniversityMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BoardMasterList = data['Data'];
          //console.error(this.BoardMasterList);
        }, (error: any) => console.error(error));

      await this.commonMasterService.PassingYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PassingYearList = data['Data'];
        }, (error: any) => console.error(error));
      await this.commonMasterService.GetFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FinancialYear = data['Data'];
          console.log(this.FinancialYear, "Year")
        }, (error: any) => console.error(error));
      await this.commonMasterService.ITIExamStudentStatus(this.sSOLoginDataModel.RoleID, 2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamStudentStatusDDLList = data['Data'];
        }, (error: any) => console.error(error));
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

  async GetcOmmonData() {
  try {
    this.loaderService.requestStarted();
    await this.commonMasterService.GetCommonMasterDDLByType('EligibilityStatus')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.EligibilityStatusData = data['Data'];
        console.log("this.EligibilityStatusData",this.EligibilityStatusData);
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

  async StreamMaster() {
    const MasterCode = "Lateral_Trade";
    try {
      this.loaderService.requestStarted();
      debugger;
      var InstID = this.sSOLoginDataModel.InstituteID;
      var InstituteID1 = this.InstituteMasterList.InstituteID;
      var id = this.request.InstituteID;

      if (id != null && id != undefined && id != 0) {
        InstID = id;
      }
      await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, InstID)
        .then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.StreamMasterList = parsedData.Data;
        console.log("this.StreamMasterList",this.StreamMasterList);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetSubjectMasterDDL() {
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetParentSubjectDDL(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SubjectMasterDDLList = data['Data'];
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

  updateSelectedSubjects() {
    // Filter the SubjectMasterDDLList to get subjects whose IDs are in SubjectID
    this.selectedSubjects = this.SubjectMasterDDLList.filter(subject =>
      this.SubjectID.includes(subject.SubjectID)
    );
  }

  async btn_SearchClick() {
    this.isSubmitted = true;
    if (this.SearchStudentDataFormGroup.invalid)
    {
      return
    }
    try {
      await this.GetPreExamStudent();
      if (this.request.Year_SemID == 3) {
        this.showSubject = true

      } else {
        this.showSubject = false
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetPreExamStudent() {
    try {
      ;
      this.isSubmitted = true;
      //session
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.request.FinacialYearID = this.sSOLoginDataModel.FinancialYearID;
      //call
      this.loaderService.requestStarted();
      await this.studentExaminationITIService.GetPreExamStudent(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.PreExamStudentData = data['Data'];
            console.log(this.PreExamStudentData,"daaaattaaaaa")
            //table feature load
            this.loadInTable();
            //end table feature load
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
          this.searchrequest.BranchID = this.request.BranchID
          this.searchrequest.SemesterID = this.request.Year_SemID
          await this.GetSubjectMasterDDL()
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }
  }

  async btn_Clear() {
    /* this.SearchStudentDataFormGroup.reset()*/
    this.request.ApplicationNo = '';
    this.request.Name = '';

    this.request.EnrollmentNo=''
    this.StudentTypeList = []
    this.InstituteMasterList = []

    this.GetMasterData()

    this.showSubject = false

    this.request.ManagementTypeID = 0;
    this.request.MobileNo = '';
    this.request.BranchID = 0;
    this.request.Year_SemID = 0;

    this.request.StudentStatusID = 0;
    this.request.StudentFilterStatusId = 0;
    this.request.ExamCategoryID = 0;
    this.request.OptionalSubjectStatus = '0';
    this.request.BridgeCourseID = '0';
    this.request.EligibilityStatus = 0;
    this.GetPreExamStudent();
    
  }

  async ITIViewStudentDetails(content: any, StudentID: number, StudentExamID:number) {
    ;
    if (this.request.StudentFilterStatusId == enumExamStudentStatus.Addimited) {
      return
    }

    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetStudentProfileDetails(StudentID, StudentExamID)
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

  CloseViewStudentDetails() {

    this.modalService.dismissAll();
    this.requestStudent = new StudentMasterModel()
    this.SubjectID = []
    this.SubjectMasterDDLList = []
    this.GetSubjectMasterDDL()
    this.IsVerified = false;

  }

  async GetStudentProfileDetails(StudentID: number, StudentExamID :number) {
    try {
      ;
      this.loaderService.requestStarted();
      //model
      let model = new ViewStudentDetailsRequestModel()
      model.StudentID = StudentID;
      model.StudentFilterStatusId = this.request.StudentFilterStatusId;
      model.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      model.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      model.EndTermID = this.sSOLoginDataModel.EndTermID;
      model.StudentExamID = StudentExamID;
      //
      await this.commonMasterService.ITIViewStudentDetails(model)
        .then((data: any) =>
        {
          
          data = JSON.parse(JSON.stringify(data));


          this.StudentProfileDetailsData = data['Data']['ViewStudentDetails'];
          console.log(this.StudentProfileDetailsData,"dddd")
          this.Student_QualificationDetailsData = data['Data']['Student_QualificationDetails'];
         
          this.documentDetails = data['Data']['documentDetails'];

          // for admitted/new admitted
          if (this.StudentProfileDetailsData[0].status == null || this.StudentProfileDetailsData[0].status == "") {
            this.StudentProfileDetailsData[0].status = this.StudentProfileDetailsData[0].status1;
          }
          console.log(this.StudentProfileDetailsData, "view student")
          console.log(data)

        }, (error: any) => console.error(error));
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

  //get edit student
  async GetPreExam_StudentMaster(StudentID: number, StudentExamID: number)
  {
    
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    var Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ITIPreExam_StudentMaster(StudentID, this.request.StudentFilterStatusId, DepartmentID, Eng_NonEng, this.sSOLoginDataModel.EndTermID, StudentExamID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestStudent = data['Data'];
          console.log(data, 'ankit')
          this.requestStudent.StudentID = data['Data']['StudentID'];
          this.requestStudent.ApplicationNo = data['Data']['ApplicationNo'];
          this.requestStudent.EnrollmentNo = data['Data']['EnrollmentNo'];
          this.requestStudent.AdmissionCategoryID = data['Data']['AdmissionCategoryID'];
          this.requestStudent.InstituteID = data['Data']['InstituteID'];
          this.requestStudent.StreamID = data['Data']['StreamID'];
          this.requestStudent.InstituteStreamID = data['Data']['InstituteStreamID'];
          this.requestStudent.StudentName = data['Data']['StudentName'];
          this.requestStudent.StudentNameHindi = data['Data']['StudentNameHindi'];
          this.requestStudent.FatherName = data['Data']['FatherName'];
          this.requestStudent.FatherNameHindi = data['Data']['FatherNameHindi'];
          this.requestStudent.MotherName = data['Data']['MotherName'];
          this.requestStudent.StudentExamStatus = data['Data']['StudentExamStatus'];
          this.requestStudent.MotherNameHindi = data['Data']['MotherNameHindi'];
          this.requestStudent.Gender = data['Data']['Gender'];
          // this.requestStudent.Dis_DOB = new Date(data['Data']['DOB']).toISOString().split('T').shift().toString();
          const dob = new Date(data['Data']['DOB']);
          const year = dob.getFullYear();
          const month = String(dob.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
          const day = String(dob.getDate()).padStart(2, '0');
          this.requestStudent.DOB = `${year}-${month}-${day}`;

          this.requestStudent.CategoryA_ID = data['Data']['CategoryA_ID'];
          this.requestStudent.CategoryB_ID = data['Data']['CategoryB_ID'];
          this.requestStudent.MobileNo = data['Data']['MobileNo'];
          this.requestStudent.TelephoneNo = data['Data']['TelephoneNo'];
          this.requestStudent.Email = data['Data']['Email'];
          this.requestStudent.Address1 = data['Data']['Address1'];
          this.requestStudent.AadharNo = data['Data']['AadharNo'];
          this.requestStudent.FatherAadharNo = data['Data']['FatherAadharNo'];
          this.requestStudent.JanAadharNo = data['Data']['JanAadharNo'];
          this.requestStudent.JanAadharMobileNo = data['Data']['JanAadharMobileNo'];
          this.requestStudent.JanAadharName = data['Data']['JanAadharName'];
          this.requestStudent.BankAccountNo = data['Data']['BankAccountNo'];
          this.requestStudent.IFSCCode = data['Data']['IFSCCode'];
          this.requestStudent.BankAccountName = data['Data']['BankAccountName'];
          this.requestStudent.BankName = data['Data']['BankName'];

          this.requestStudent.Remark = data['Data']['Remark'];
          this.requestStudent.TypeOfAdmissionID = data['Data']['TypeOfAdmissionID'];
          this.requestStudent.StudentStatusID = data['Data']['StudentStatusID'];
          this.requestStudent.SemesterID = data['Data']['SemesterID'];
          this.requestStudent.StudentTypeID = data['Data']['StudentTypeID'];
          this.requestStudent.BhamashahNo = data['Data']['BhamashahNo'];
          this.requestStudent.JanAadharMemberId = data['Data']['JanAadharMemberId'];
          this.requestStudent.JanAadharMemberId = data['Data']['JanAadharMemberId'];
          this.requestStudent.Papers = data['Data']['Papers'];

          if (data['Data']['Dis_StudentPhoto'] != null) {

            this.requestStudent.Dis_StudentPhoto = data['Data']['Dis_StudentPhoto'];
          } else {
            this.requestStudent.Dis_StudentPhoto = ''
          }
          if (data['Data']['Dis_StudentSign'] != null) {

            this.requestStudent.Dis_StudentSign = data['Data']['Dis_StudentSign'];
          } else {
            this.requestStudent.Dis_StudentSign = ''
          }
          if (data['Data']['StudentPhoto'] != null) {

            this.requestStudent.StudentPhoto = data['Data']['StudentPhoto'];
          } else {
            this.requestStudent.StudentPhoto = ''
          }
          if (data['Data']['StudentSign'] != null) {

            this.requestStudent.StudentSign = data['Data']['StudentSign'];
          } else {
            this.requestStudent.StudentSign = ''
          }

          try {
            this.requestStudent.Dis_DOB = (new Date(data['Data']['Dis_DOB'])?.toISOString()?.split('T')?.shift()?.toString()) ?? "";
          }
          catch (ex) {
          }

          this.requestStudent.QualificationDetails = data['Data']['QualificationDetails'];
          this.requestStudent.commonSubjectDetails = data['Data']['Subjects'];
          this.requestStudent.Status_old = data['Data']['Status_old'];

          /*this.requestStudent.QualificationDetails = data['Data'].QualificationDetails ;*/

          this.requestUpdateEnrollmentNo.StudentID = data['Data']['StudentID'];
          this.requestUpdateEnrollmentNo.EnrollmentNo = data['Data']['EnrollmentNo'];
          this.requestUpdateEnrollmentNo.InstituteID = data['Data']['InstituteID'];
          this.requestUpdateEnrollmentNo.StreamID = data['Data']['StreamID'];

          console.log(this.requestStudent.Papers, 'Papers')
          /*this.requestUpdateEnrollmentNo.OrderNo = data['Data']['OrderNo'];*/
          const selectedSubjectIDs = this.requestStudent.commonSubjectDetails?.map((x: any) => x.SubjectId);

          //sub caste
          this.requestStudent.SubCategoryA_ID = data.Data.SubCategoryA_ID;
          await this.GetSubCasteCategoryADDL();//ddl

          // Map the SubjectIDs to the corresponding full object in SubjectMasterDDLList
          this.SubjectID = this.SubjectMasterDDLList.filter((subject: any) =>
            selectedSubjectIDs?.includes(subject.ID)
          );


        }, (error: any) => console.error(error));
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

  // get edit student
  async EditStudentData(content: any, StudentID: number, StudentExamID: number) {
    this.requestUpdateEnrollmentNo.OrderDate = (new Date(this.TodayDate).toISOString()?.split('T')?.shift()?.toString()) ?? "";
    this.requestUpdateEnrollmentNo.UpdatedDate = (new Date(this.TodayDate).toISOString()?.split('T')?.shift()?.toString()) ?? "";

    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //
    await this.GetPreExam_StudentMaster(StudentID, StudentExamID);
  }


  async SaveData_EditStudentDetails() {
    ;
    this.isSubmitted = true;

    //reset    
    if (this.SubCasteCategoryADDLList.length > 0)
    {
      this.resetValidationSubCastCategoryA(true);
    }
    else {
      this.resetValidationSubCastCategoryA(false);
    }

    //form
    if (this.EditStudentDataFormGroup.invalid) {
      return
    }

    //document required
    if (this.documentDetailsService.HasRequiredDocument(this.requestStudent.DocumentDetails))
    {
      return;
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestStudent.CreatedBy = this.sSOLoginDataModel.UserID;

    if (this.IsVerified && this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal && this.requestStudent.status == enumExamStudentStatus.SelectedForExamination)
    {
      this.requestStudent.status = enumExamStudentStatus.VerifiedForExamination// verified for examination(principle)
    }
    else
    {
      this.requestStudent.status = 0;
    }

    console.log(this.requestStudent.status, '4')
    //
    this.loaderService.requestStarted();
    try {
      
      await this.studentExaminationITIService.EditStudentData_PreExam(this.requestStudent)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            await this.GetPreExamStudent();
            await this.ResetControls();
            await this.CloseViewStudentDetails();
            this.requestStudent.DocumentDetails = []
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }





  // ---------- save marked student with exam flow ------
  async SaveDataMarked() {
    ;
    // status marked
    if (this.status <= 0) {
      this.toastr.error("Please select 'Mark As' status!");
      return;
    }
    // any student selected
    const anyStudentSelected = this.PreExamStudentData.some(student => student.Selected);
    if (!anyStudentSelected) {
      this.toastr.error("Please select at least one Student!");
      return;
    }

    // Reject at BTER any stage
    if (this.status != enumExamStudentStatus.RejectatBTER) {
      //verified for examination for each edit student
      if (this.request.StudentFilterStatusId == enumExamStudentStatus.SelectedForExamination && this.status != enumExamStudentStatus.VerifiedForExamination) {
        this.toastr.error("Please verify each student then choose 'Eligible For Examination' student!");
        return;
      }
      // Examination Fee Paid
      if (this.request.StudentFilterStatusId == enumExamStudentStatus.ExaminationFeesPaid) {
        this.toastr.warning("Student already 'Eligible For Examination' and Paid Fee also!");
        return;
      }
    }

    // all steps
    try {
      // reject at BTER (at any level)
      if (this.status == enumExamStudentStatus.RejectatBTER) {
        if (this.request.StudentFilterStatusId != enumExamStudentStatus.RejectatBTER && this.sSOLoginDataModel.RoleID == EnumRole.Admin) {
          await this.SaveRejectAtBTER();
        }
        else {
          this.toastr.error("Please do not choose 'Reject at BTER' Mark As with 'Reject at BTER' status!");
        }
        return;
      }
      // selected for enrollment(admin)
      if (this.request.StudentFilterStatusId == enumExamStudentStatus.Enrolled || this.request.StudentFilterStatusId == enumExamStudentStatus.New_Enrolled) {
        if (this.status == enumExamStudentStatus.SelectedForExamination && (this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_SCVT || this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_NCVT)) {
          await this.SaveSelectedForExamination();
        }
        else {
          this.toastr.error("Please choose 'Selected For Examination' Mark As with 'Enrolled or New Enrolled' status!");
        }
        return;
      }
      // eligible for enrollment
      if (this.request.StudentFilterStatusId == enumExamStudentStatus.VerifiedForExamination) {
        if (this.status == enumExamStudentStatus.EligibleForExamination && this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal) {
          await this.SaveEligibleForExamination();
        }
        else {
          this.toastr.error("Please choose 'Eligible For Examination' Mark As with 'Verified For Examination' status!");
        }
        return;
      }

      // invalid
      this.toastr.error("Not a valid action!");
    } catch (ex) {
      console.log(ex);
    }
  }

  // Selected For Examination
  async SaveSelectedForExamination()
  {
    ;
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID,
              StudentExamID: x.StudentExamID

            })
          });
          // Call service to save student exam status
          await this.studentExaminationITIService.SaveSelectedForExamination(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }

  // Eligible For Examination
  async SaveEligibleForExamination() {
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {
      ;
      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID
            })
          });
          // Call service to save student exam status
          await this.studentExaminationITIService.SaveEligibleForExamination(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }

  // Reject At BTER
  async SaveRejectAtBTER() {
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModel[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              Status: this.status,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              RoleID: this.sSOLoginDataModel.RoleID
            })
          });
          // Call service to save student exam status
          await this.studentExaminationITIService.SaveRejectAtBTER(request)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetPreExamStudent();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.isSubmitted = false;
          }, 200);
        }
      }
    });
  }
  // ---------- end save marked student with exam flow ------

  //
  ResetControls() {
    this.commonSubjectDetails = [];
    this.SubjectID = [];
    this.Student_DataList = []
    //this.multiSelect.toggleSelectAll();
  }

  //
  async GetStudentSubject_ByID(StudentID: number)
  {
    try {
      this.loaderService.requestStarted();

      await this.studentExaminationITIService.GetStudentSubject_ByID(StudentID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestStudent = data['Data'];

          console.log(this.requestStudent, "Shubh")
          this.requestStudent.StudentID = data['Data']['StudentID'];
          this.requestStudent.EnrollmentNo = data['Data']['EnrollmentNo'];


          this.requestStudent.StudentName = data['Data']['StudentName'];

          this.requestStudent.FatherName = data['Data']['FatherName'];


          this.requestStudent.Gender = data['Data']['Gender'];
          /*     this.requestStudent.DOB = data['Data']['DOB'];*/



          this.requestStudent.Dis_DOB = (new Date(data['Data']['Dis_DOB'])?.toISOString()?.split('T')?.shift()?.toString()) ?? "";


          this.requestStudent.commonSubjectDetails = data['Data']['Subjects'];
          /*        console.log(this.requestStudent.commonSubjectDetails, "commonsubject")*/


          ///*this.requestUpdateEnrollmentNo.OrderNo = data['Data']['OrderNo'];*/
          //const selectedSubjectIDs = this.requestStudent.commonSubjectDetails.map((x: any) => x.SubjectName);
          //console.log(selectedSubjectIDs, "subjectId")
          //// Map the SubjectIDs to the corresponding full object in SubjectMasterDDLList
          //this.SubjectID = this.SubjectMasterDDLList.filter((subject: any) =>
          //  selectedSubjectIDs.includes(subject.SubjectName)
          //);


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

  async SaveAllData() {

    this.isSubmitted = true;
    //
    /*    this.refreshBranchRefValidation(true);*/
    //
    //if (this.PlacementShortListStudentForm.invalid) {CloseViewStudentDetailsEditStudentData
    //  return console.log("error")
    //}



    try {
      this.loaderService.requestStarted();

      const isAnySelected = this.PreExamStudentData.some(x => x.Selected);
      if (!isAnySelected) {
        this.toastr.error('Please select at least one checkbox!');
        return;
      }
      // Validate if at least one subject is selected
      if (!this.SubjectID || this.SubjectID.length === 0) {
        this.toastr.error('Please select at least one subject!');
        this.loaderService.requestEnded();
        return;
      }

      if (this.sSOLoginDataModel.RoleID = EnumRole.Principal) {
        const isStudentType = this.PreExamStudentData.filter(x => x.StudentTypeID = 2)
        if (!isStudentType) {
          this.toastr.error('Please Select Only Ex Students(Type)');
          return;
        }
      }





      this.PreExamStudentData.forEach(x => {
        this.Student_DataList.push({
          StudentSubjectID: 0,
          StudentId: x.StudentID,
          Selected: x.Selected,
          StreamId: x.StreamID,
          SemesterId: x.SemesterID,
          EndTermID: 0,
          FeeAmount: 0,
          status: this.status,
          ActiveStatus: true,
          DeleteStatus: false,
          IsParent: true,
          ModifyBy: 0
        });
      })


      this.commonSubjectDetails = this.commonSubjectDetails || [];

      this.commonSubjectDetails = this.commonSubjectDetails.filter(subjectDetail =>
        this.SubjectID.some(selectedSubject => selectedSubject.ID === subjectDetail.SubjectID)
      );


      this.SubjectID.forEach(subject => {
        if (!this.commonSubjectDetails.some(detail => detail.SubjectID === subject.ID)) {
          this.commonSubjectDetails.push({
            SubjectID: subject.ID,
            CommonSubjectDetailsID: 0,
            CommonSubjectID: 0,
            StreamID: 0
          });
        }

        this.Student_DataList.forEach(x => {
          x.ModifyBy = this.sSOLoginDataModel.UserID;

        });



      });


      const selectedSubjects = this.Student_DataList.filter(student => student.Selected);
      console.log(' student Subjects:', selectedSubjects);
      console.log(' Common Subjects:', this.commonSubjectDetails);
      await this.studentExaminationITIService.Save_Student_Subject(this.commonSubjectDetails, selectedSubjects)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)
            await this.GetPreExamStudent();
            await this.ResetControls()

          }
          else {

            this.toastr.error(this.ErrorMessage)

          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action Short List!');
        });
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


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.PreExamStudentData].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.PreExamStudentData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.PreExamStudentData.length;
  }
  // (replace org. list here)
  get totalInTableSelected(): number {
    return this.PreExamStudentData.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.PreExamStudentData.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.PreExamStudentData.filter(x => x.StudentID == item.StudentID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.PreExamStudentData.every(r => r.Selected);
  }
  // end table feature

  



  exportToExcel(): void {
    const wantedColumns = ['SrNo', 'StudentName', 'FatherName', 'ApplicationNo', 'EnrollmentNo', 'Dis_DOB', 'MobileNo', 'RollNo', 'InstituteName','InstituteCode',
      'TradeName','TradeCode', 'SemesterName', 'StudentExamStatus', 'strEligibilityStatus', 'StudentExamType', 'TransctionDate','PaidAmount'
    ];

    const exportData = this.PreExamStudentData.map((row: any, index: number) => {
      const filteredRow: any = {};
      wantedColumns.forEach(col => {
        filteredRow[col] = (col === 'SrNo') ? index + 1 : row[col];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // 🧠 Auto-width calculation
    const colWidths = wantedColumns.map(col => {
      const maxLength = Math.max(
        col.length,
        ...exportData.map(row => (row[col] ? row[col].toString().length : 0))
      );
      return { wch: maxLength + 2 }; // Add padding
    });

    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'PreExamStudentsData.xlsx');
  }


  async GetSubCasteCategoryADDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubCasteCategoryA(this.requestStudent.CategoryA_ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SubCasteCategoryADDLList = data['Data'];
          console.log(this.SubCasteCategoryADDLList);
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

  resetValidationSubCastCategoryA(isValidate: boolean) {
    // clear
    this.EditStudentDataFormGroup.get('ddlSubCategoryA_ID')?.clearValidators();
    // set
    if (isValidate) {
      this.EditStudentDataFormGroup.get('ddlSubCategoryA_ID')?.setValidators(Validators.required);
    }
    // update
    this.EditStudentDataFormGroup.get('ddlSubCategoryA_ID')?.updateValueAndValidity();
  }

  async GetStudentEnrolled(item: any) {
    console.log(item, 'qqqqqq')
    try {
      this.ReportBasedModelSearch.StudentID = item.StudentID;
      this.ReportBasedModelSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.ReportBasedModelSearch.StudentExamID = item.StudentExamID;
      this.loaderService.requestStarted();
      await this.reportService.GetITIExaminationForm(this.ReportBasedModelSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
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

  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }

  async GetITIStudentFeeReceipt(ID: any) {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIStudentFeeReceipt(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else
          {
            this.toastr.error('Some thing went wrong')
            //    data.ErrorMessage
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

  //2025-01-21 #Pradeep

  // add student optional subject
  //async StudentOptionalSubjectModelView(content: any, StudentID: number) {

  //  this.modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
  //    this.closeResult = `Closed with: ${result}`;
  //  }, (reason: any) => {
  //    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //  });
  //  await this.GetOptionalSubjectMaster(StudentID);
  //}

  //async GetOptionalSubjectMaster(StudentID: number) {
  //  try {
  //    await this.commonMasterService.GetOptionalSubjectsByStudentID(StudentID, this.sSOLoginDataModel.DepartmentID)
  //      .then(async (data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.optionalSubjectList = data['Data'];
  //      }, (error: any) => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //}

  async GetOptionalChildSubjectsBySubjectID(SubjectID: number) {
    try {
      await this.commonMasterService.GetOptionalChildSubjectsBySubjectID(0,SubjectID, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.optionalChildSubjectList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
  }

  // end add student optional subject

  //document
  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel = new UploadFileModel();
      //uploadModel.AcceptExtentions = ".jpg,.jpeg,.png";
      //uploadModel.AcceptFileSize = "1mb";
      uploadModel.FolderName = item.FolderName ?? "";
      //call
      await this.documentDetailsService.UploadDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            //add/update document in js list
            const index = this.requestStudent.DocumentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.requestStudent.DocumentDetails[index].FileName = data.Data[0].FileName;
              this.requestStudent.DocumentDetails[index].Dis_FileName = data.Data[0].Dis_FileName;
            }
            console.log(this.requestStudent.DocumentDetails)
            //reset file type
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async DeleteDocument(item: any) {
    try {
      // delete from server folder
      let deleteModel = new DeleteDocumentDetailsModel()
      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteDocument(deleteModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.requestStudent.DocumentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.requestStudent.DocumentDetails[index].FileName = '';
              this.requestStudent.DocumentDetails[index].Dis_FileName = '';
            }
            console.log(this.requestStudent.DocumentDetails)
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  //end document

  async ViewAttendenceModal(content: any, item: any)
  {

    this.AttendenceFormGroup.get('EligibilityStatus')?.valueChanges.subscribe(() => {
      this.AttendenceFormGroup.get('FaMark')?.updateValueAndValidity();
    });



    this.attendence = new StudentAttendenceModel();

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
    this.attendence.EligibilityStatus = item.EligibilityStatus;
    this.attendence.StudentExamID = item.StudentExamID
    this.attendence.StudentName = item.StudentName
    this.attendence.FaMark = item.FaMark;
    this.attendence.Remarks = item.Remarks;
    this.AttendancePercentage = item.AttendancePercentage;
    

  }
   
 
  numberOnly(event: KeyboardEvent): boolean
  {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  conditionalFaMarkValidator(attendenceControlName: string):
    ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formGroup = control.parent;
    if (!formGroup) return null;

    const attendenceControl = formGroup.get(attendenceControlName);
    if (!attendenceControl) return null;

    const attendenceValue = attendenceControl.value;
    const faMarkValue = control.value;

    if (attendenceValue == this._EnumEligibilityStatus.Eligible && (!faMarkValue || faMarkValue < 120)) {
      return { invalidFaMark: true };
    }

    return null;
    };

}
  ddlChangeAttendence()
  {
    this.attendence.FaMark = '';
  }

 


  async SaveStudentEligibility()
  {
    try
    {
      debugger;
      this.isFormSubmitted = true;
      if (this.AttendenceFormGroup.invalid) {
        return
      }
      if (this.attendence.EligibilityStatus == 239 && this.attendence.Remarks=='')
      {
        this.toastr.error('Please Fill Remarks')
        return;
      }
      //session
      this.attendence.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.attendence.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.attendence.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      //call
      this.loaderService.requestStarted();
      await this.studentExaminationITIService.UpdateStudentEligibility(this.attendence)
        .then(async (data: any) =>
        {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.toastr.success(data.Message);
            this.CloseModal();
            this.GetPreExamStudent();
          }
          else
          {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }
  }


  resetForm() {
    this.AttendenceFormGroup.reset();
  }


  DownloadAdmitCard(item: any): void
  {

    var fileUrl = '';
  
    fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ITIReportsFolder + GlobalConstants.ITIAdmitCardFolder + "/" + item.AdmitCard;;
  
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }


  async EditEnrollmentNo(content: any, StudentID: number, StudentExamID: number) {



    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetStudentupdateEnrollData(StudentID, StudentExamID);

  }

  
  async onFilechangeDropout(event: any) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {

        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
       
                this.requestUpdateEnrollmentNo.FileName = data.Data[0].FileName;

              
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }



  async GetStudentupdateEnrollData(StudentID:number,StudentExamID:number=0) {

    try {
      this.loaderService.requestStarted();
      await this.studentExaminationITIService.GetStudentDropoutStudent(StudentID, StudentExamID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          console.log(data)


         


          this.requestUpdateEnrollmentNo.OrderNo = data['Data']['OrderNo']
          this.requestUpdateEnrollmentNo.FileName = data['Data']['FileName']
          this.requestUpdateEnrollmentNo.StudentID = StudentID
          this.requestUpdateEnrollmentNo.StudentExamID = StudentExamID

          if (data['Data']['OrderDate'] != null && data['Data']['OrderDate'] !== '') {
            const OrderDate = new Date(data['Data']['OrderDate']);

            // Check if the date is valid to avoid "1-1-1970"
            if (!isNaN(OrderDate.getTime())) {
              const Orderyear = OrderDate.getFullYear();
              const OrderMonth = String(OrderDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
              const day = String(OrderDate.getDate()).padStart(2, '0');
              this.requestUpdateEnrollmentNo.OrderDate = `${Orderyear}-${OrderMonth}-${day}`;
            } else {
              this.requestUpdateEnrollmentNo.OrderDate = ''; // Handle invalid date
            }
          } else {
            this.requestUpdateEnrollmentNo.OrderDate = '';
          }


    




          console.log(this.requestUpdateEnrollmentNo.UpdatedDate)

        }, (error: any) => console.error(error));
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



  async UpdateDroput() {

    try {
      this.isSubmitted = true;
      if (this.formUpdateEnrollmentNo.invalid) {
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.requestUpdateEnrollmentNo.CreatedBy = this.sSOLoginDataModel.UserID;
     


      //save
      await this.studentExaminationITIService.UpdateDropout(this.requestUpdateEnrollmentNo)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.CloseModalpopup()
            this.GetPreExamStudent()
   
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

  async CloseModalpopup() {
    this.modalService.dismissAll()
    this.isSubmitted = false
    this.requestUpdateEnrollmentNo = new ITIExamination_UpdateEnrollmentNoModel()
  }

}
