import { Component } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants, enumExamStudentStatus } from '../../Common/GlobalConstants';
import { M_StudentMaster_QualificationDetailsModel, StudentMarkedModel, StudentMarkedModelForJoined, StudentMasterModel, Student_DataModel } from '../../Models/StudentMasterModels';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { StudentEnrollmentService } from '../../Services/studentenrollment/student-enrollment.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { UserMasterService } from '../../Services/UserMaster/user-master.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { ActivatedRoute } from '@angular/router';
import { PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../Models/PreExamStudentDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { SubjectSearchModel } from '../../Models/SubjectMasterDataModel';
import { CommonSubjectDetailsMasterModel } from '../../Models/CommonSubjectDetailsMasterModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { ReportService } from '../../Services/Report/report.service';
import { ReportBasedModel } from '../../Models/ReportBasedDataModel';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { UploadFileModel } from '../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel } from '../../Models/DeleteDocumentDetailsModel';
import { ViewStudentDetailsRequestModel } from '../../Models/ViewStudentDetailsRequestModel';
import { DocumentDetailsModel } from '../../Models/DocumentDetailsModel';
import { DocumentDetailsService } from '../../Common/document-details';


@Component({
  selector: 'app-student-enrollment-admitted',
  templateUrl: './student-enrollment-admitted.component.html',
  styleUrls: ['./student-enrollment-admitted.component.css'],
  standalone: false
})
export class StudentEnrollmentAdmittedComponent {
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
  public PreExamStudentAnnextureData: StudentMasterModel[] = [];

  public StudentProfileDetailsData: any = [];
  public Student_QualificationDetailsData: any = [];
  public documentDetails: DocumentDetailsModel[] = [];

  public settingsMultiselect: object = {};
  public commonSubjectDetails: CommonSubjectDetailsMasterModel[] = [];
  public Student_DataList: Student_DataModel[] = []
  public statusID: number = 0
  public NesStudentID: number = 0;
  public InstitutesListForStudent: any = [];

  request = new PreExamStudentDataModel();
  searchrequest = new SubjectSearchModel()
  requestStudent = new StudentMasterModel();
  RequestStudent = new M_StudentMaster_QualificationDetailsModel();
  requestUpdateEnrollmentNo = new PreExam_UpdateEnrollmentNoModel();
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
  public status: number = 0
  public FinancialYear: any = []
  public isShowdrop: boolean = true
  isSearchEnabled: boolean = false;
  IsVerified: boolean = false;
  isDropdownVisible: boolean = false;
  public NewExamStudentStatusDDLList: any = []
  EditStudentDataFormGroup!: FormGroup;
  formUpdateEnrollmentNo!: FormGroup;
  public SearchStudentDataFormGroup!: FormGroup;
  public reportRequest = new ReportBasedModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public StudentFilterStatusId: number = 0;
  public GenderList: any = []

  public TodayDate = new Date()

  public _enumExamStudentStatus = enumExamStudentStatus;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public DateConfigSetting: any = [];
  //end table feature default

  public SubCasteCategoryADDLList: any[] = [];
  MapKeyEng: number = 0;

  constructor(private commonMasterService: CommonFunctionService,
    private studentEnrollmentService: StudentEnrollmentService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private UserMasterService: UserMasterService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    private reportService: ReportService,
    private http: HttpClient,
    private documentDetailsService: DocumentDetailsService
  ) {
    
  }

  async ngOnInit() {
    
    this.SearchStudentDataFormGroup = this.formBuilder.group(
      {
        ApplicationNo: [''],
        ddlInstituteID: [{ value: '', disabled: false }],
        ddlStreamID: [''],
        ddlSemesterID: [''],
        ddlStudentTypeID: [''],
        ddlManagementID: [''],
        ddlstatus: [''],
        ddlsubjectstaus: [''],
        ddlbridege: [''],
        ddlExamCategoryID: [''],
        txtStudentName: [''],
        txtMobileNo: ['']
      })


    this.EditStudentDataFormGroup = this.formBuilder.group(
      {
        txtStudentName: ['', Validators.required],
        txtStudentNameHindi: ['', Validators.required],
        txtFatherName: ['', Validators.required],
        txtFatherNameHindi: ['', Validators.required],
        txtMotherName: ['', Validators.required],
        txtMotherNameHindi: ['', Validators.required],
        ddlStudentTypeID: [{ value: '', disabled: true }],
        ddlGender: ['', Validators.required],
        txtPapers: [''],
        ddlInstituteID: [{ value: '', disabled: true }, [DropdownValidators]],
        ddlStreamID: [{ value: '', disabled: true }, [DropdownValidators]],
        txtMobileNo: ['', Validators.required],

        ddlCategoryA_ID: ['', [DropdownValidators]],
        ddlCategoryB_ID: ['', [DropdownValidators]],
        txtDOB: ['', Validators.required],
        txtEmail: [''],
        txtAadharNo: [''],
        txtBhamashahNo: [''],
        JanAadharNo: [''],
        txtAddress: [''],
        txtBankName: [''],
        txtIFSCCode: [''],
        txtBankAccountNo: [''],
        IsVerified: [''],
        ddlSubCategoryA_ID: ['', Validators.required],
      })
    this.requestStudent.commonSubjectDetails = [];

    this.formUpdateEnrollmentNo = this.formBuilder.group(
      {
        //txtEnrollmentNo: ['', Validators.required, disable: true],
        txtEnrollmentNo: [{ value: '', disabled: true }, Validators.required],
        ddlInstituteID: ['', [DropdownValidators]],
        ddlBranch: ['', [DropdownValidators]],
        txtOrderNo: ['', Validators.required],
        txtOrderDate: ['', Validators.required],
        txtUpdatedDate: ['', Validators.required]
      })
    this.requestStudent.QualificationDetails = [];
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.UserID = this.sSOLoginDataModel.UserID
   // this.request.InstituteID = this.sSOLoginDataModel.InstituteID
    console.log(this.sSOLoginDataModel, 'this.sSOLoginDataModel')
    //console.log(this.request.InstituteID, 'this.request.InstituteID')

    await this.GetMasterData();
    await this.GetDateConfig();
  }
  get EditStudentDataform() { return this.EditStudentDataFormGroup.controls; }
  get FormUEM() { return this.formUpdateEnrollmentNo.controls; }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList);
        }, (error: any) => console.error(error)
      );

      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
          //this.request.InstituteID = this.sSOLoginDataModel.InstituteID
        //  this.InstituteMasterList = this.InstituteMasterList.filter((x: any) => { return x.InstituteID == this.request.InstituteID });
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

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StudentType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentTypeList = data['Data'];
          this.StudentTypeMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetStudentStatusByRole(this.sSOLoginDataModel.RoleID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentStatusList = data['Data'];
          this.status = 36;
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
      await this.commonMasterService.ExamStudentStatus(this.sSOLoginDataModel.RoleID, 1)
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
    if (this.SearchStudentDataFormGroup.invalid) {
      return
    }
    try {
      await this.GetPreExamStudent();
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  //get student data
  async GetPreExamStudent() {
    try {
      this.isSubmitted = true;
      //session
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.FinacialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      //call
      this.loaderService.requestStarted();
      console.log(this.request);  
      await this.studentEnrollmentService.GetStudentAdmitted(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.PreExamStudentData = data['Data'];
            console.log(this.PreExamStudentData,"lisssstDataaa")

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
    this.InstituteMasterList = [];   
    this.request.ManagementTypeID = 0;
    this.request.MobileNo = '';
    this.request.BranchID = 0;
    this.request.Year_SemID = 0;
    this.request.StudentTypeID = 0;
    this.request.StudentStatusID = 0;
    this.request.StudentFilterStatusId = 0;
    this.request.ExamCategoryID = 0;
    this.request.OptionalSubjectStatus = '0';
    this.request.BridgeCourseID = '0';
    this.btn_SearchClick();
  }

  async ViewStudentDetails(content: any, ApplicationID: number) {
    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    
    await this.GetStudentProfileDetails(ApplicationID)
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
    this.requestStudent.DocumentDetails = []
  }

  async GetStudentProfileDetails(ApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      //model
      let model = new ViewStudentDetailsRequestModel()
      model.ApplicationID = ApplicationID;
      model.StudentFilterStatusId = this.request.StudentFilterStatusId;
      model.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      model.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      model.EndTermID = this.sSOLoginDataModel.EndTermID;
      //
      await this.commonMasterService.ViewStudentAdmittedDetails(model)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          
          this.StudentProfileDetailsData = data.Data[0]

          console.log("ViewStudentAdmittedDetails", this.StudentProfileDetailsData.InstituteName)

          // for admitted/new admitted
          if (this.StudentProfileDetailsData[0].status == null || this.StudentProfileDetailsData[0].status == "") {
            this.StudentProfileDetailsData[0].status = this.StudentProfileDetailsData[0].status1;
          } 
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
  async GetPreExam_StudentMaster(StudentID: number) {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    var Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    var EndTermID = this.sSOLoginDataModel.EndTermID
    this.StudentFilterStatusId = this.request.StudentFilterStatusId
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.PreExam_StudentMaster(StudentID, this.request.StudentFilterStatusId, DepartmentID, Eng_NonEng,EndTermID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestStudent = data['Data'];
          console.log(this.requestStudent, 'ITPL')
          this.requestStudent.StudentID = data['Data']['StudentID'];
          this.requestStudent.ApplicationNo = data['Data']['ApplicationNo'];
          this.requestStudent.EnrollmentNo = data['Data']['EnrollmentNo'];
          this.requestStudent.AdmissionCategoryID = data['Data']['AdmissionCategoryID'];
         // this.requestStudent.InstituteID = data['Data']['InstituteID'];
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
          // this.requestStudent.DOB = new Date(data['Data']['DOB']).toISOString().split('T').shift().toString();

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
          this.requestStudent.StudentFilterStatusId = this.StudentFilterStatusId;

          // document
          this.requestStudent.Dis_StudentPhoto = data['Data']['Dis_StudentPhoto'];
          this.requestStudent.StudentPhoto = data['Data']['StudentPhoto'];
          this.requestStudent.Dis_StudentSign = data['Data']['Dis_StudentSign'];
          this.requestStudent.StudentSign = data['Data']['StudentSign'];
          //end

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
          //this.requestUpdateEnrollmentNo.InstituteID = data['Data']['InstituteID'];
          this.requestUpdateEnrollmentNo.StreamID = data['Data']['StreamID'];

          /*this.requestUpdateEnrollmentNo.OrderNo = data['Data']['OrderNo'];*/
          const selectedSubjectIDs = this.requestStudent.commonSubjectDetails?.map((x: any) => x.SubjectId);
          console.log(selectedSubjectIDs, "subjectId")

          //sub caste
          this.requestStudent.SubCategoryA_ID = data.Data.SubCategoryA_ID;
          await this.GetSubCasteCategoryADDL();//ddl

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
  async EditStudentData(content: any, StudentID: number) {

    this.requestUpdateEnrollmentNo.OrderDate = (new Date(this.TodayDate)?.toISOString()?.split('T')?.shift()?.toString()) ?? "";
    this.requestUpdateEnrollmentNo.UpdatedDate = (new Date(this.TodayDate)?.toISOString()?.split('T')?.shift()?.toString()) ?? "";

    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //

    await this.GetPreExam_StudentMaster(StudentID);
  }

  // save edited student
  async SaveData_EditStudentDetails() {

    //reset    
    if (this.SubCasteCategoryADDLList.length > 0) {
      this.resetValidationSubCastCategoryA(true);
    }
    else {
      this.resetValidationSubCastCategoryA(false);
    }

    this.isSubmitted = true;
    if (this.requestStudent.StudentFilterStatusId == enumExamStudentStatus.Addimited) {
      this.requestStudent.StudentID = this.requestStudent.ApplicationID;
    } else {
      this.requestStudent.StudentID = this.requestStudent.StudentID;

    }

    //form
    if (this.EditStudentDataFormGroup.invalid) {
      return;
    }

    //document required
    if (this.documentDetailsService.HasRequiredDocument(this.requestStudent.DocumentDetails)) {
      return;
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestStudent.CreatedBy = this.sSOLoginDataModel.UserID;
    this.requestStudent.SSOID = this.sSOLoginDataModel.SSOID;
    this.requestStudent.BhamashahNo = this.requestStudent.BhamashahNo || '0';
    this.requestStudent.EnrollmentNo = this.requestStudent.EnrollmentNo || '0';
    this.requestStudent.StudentExamStatus = this.requestStudent.StudentExamStatus || '0';

    if (this.IsVerified && this.sSOLoginDataModel.RoleID == EnumRole.Principal && this.requestStudent.status == enumExamStudentStatus.SelectedForEnrollment) {
      this.requestStudent.status = enumExamStudentStatus.VerifiedForEnrollment// verified for enrollment(bter) 
    }
    else if (this.IsVerified && this.sSOLoginDataModel.RoleID == EnumRole.Principal && this.requestStudent.status == enumExamStudentStatus.SelectedForExamination) {
      this.requestStudent.status = enumExamStudentStatus.VerifiedForExamination// verified for examination(principle)
    }
    else {
      this.requestStudent.status = 0;
    }
    console.log(this.requestStudent.status, '4')
    //    
    this.loaderService.requestStarted();
    try {
      await this.studentEnrollmentService.EditStudentData_PreExam(this.requestStudent)
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

  // Update Enrollment No
  async EditEnrollmentNo(content: any, StudentID: number) {
    this.requestUpdateEnrollmentNo.OrderDate = (new Date(this.TodayDate).toISOString().split('T').shift()?.toString()) ?? "";
    this.requestUpdateEnrollmentNo.UpdatedDate = (new Date(this.TodayDate).toISOString().split('T').shift()?.toString()) ?? "";

    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetPreExam_StudentMaster(StudentID);

  }

  async SaveData_PreExam_UpdateEnrollmentNo() {
    this.isSubmitted = true;

    if (this.formUpdateEnrollmentNo.invalid) {
      return
    }
    //Show Loading
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestUpdateEnrollmentNo.CreatedBy = this.sSOLoginDataModel.UserID;
    this.loaderService.requestStarted();
    try {
      await this.studentEnrollmentService.SaveData_PreExam_UpdateEnrollmentNo(this.requestUpdateEnrollmentNo)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.GetPreExam_StudentMaster(this.requestUpdateEnrollmentNo.StudentID);
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

    if (this.status == enumExamStudentStatus.Addimited) {
      await this.SaveAdmittedStudentData();
    }
    else {
      this.toastr.error("Invalid action!");
    }
  }

  // save selected for enrollment status
  async SaveAdmittedStudentData() {
    // confirm
    
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {

      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();
          // Filter out only the selected students
          var request: StudentMarkedModelForJoined[] = [];
          const selectedStudents = this.PreExamStudentData.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              ApplicationID: x.ApplicationID,
              Status: 2,
              StudentFilterStatusId: this.request.StudentFilterStatusId,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleId: this.sSOLoginDataModel.RoleID,
              Marked: x.Selected,
              AllotmentId: x.AllotmentId
            })
          });
          // Call service to save student exam status
          await this.studentEnrollmentService.SaveAdmittedFinalStudentData(request)
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

  // save enrolled status
  async SaveEligibleForEnrollment() {
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
          await this.studentEnrollmentService.SaveEligibleForEnrollment(request)
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
          await this.studentEnrollmentService.SaveRejectAtBTER(request)
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

  async GetStudentEnrolled(item: any) {
    console.log(item, 'GetStudentEnrolled')

    try {
      this.reportRequest.StudentID = item.StudentID
      this.reportRequest.EnrollmentNo = item.EnrollmentNo
      this.loaderService.requestStarted();
      await this.reportService.GetStudentEnrolledForm(this.reportRequest)
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


  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
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
  // (replace org.list here)
  sortInTableData(field: string) {
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
  // (replace org.list here)
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
    const data = this.PreExamStudentData.filter(x => x.ApplicationID == item.ApplicationID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.PreExamStudentData.every(r => r.Selected);
  }
  // end table feature

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status',
      'EndTermID', 'StreamID', 'SemesterID', 'StudentType'
    ];
    const filteredData = this.PreExamStudentData.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StudentsData.xlsx');
  }

  async GetPreExamStudentAnnexture() {
    try {
      this.isSubmitted = true;
      //session
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.FinacialYearID = this.sSOLoginDataModel.FinancialYearID;
      //call
      this.loaderService.requestStarted();
      console.log(this.request);
      await this.studentEnrollmentService.GetAnnextureListPreExamStudent(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.PreExamStudentAnnextureData = data['Data'];
          }
          else {
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

  exportAnnextureToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status',
      'EndTermID', 'StreamID', 'SemesterID', 'StudentType', 'RollNo'
    ];
    const filteredData = this.PreExamStudentAnnextureData
      .filter((item: any) => item.EnrollmentNo)
      .map((item: any) => {
        const filteredItem: any = {};
        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'PreExamStudentAnnextureData.xlsx');
  }


  async exportAnnexture() {
    await this.GetPreExamStudentAnnexture();
    await this.exportAnnextureToExcel();
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

  async GetStudentFeeReceipt(TransactionId: any) {
    
    try {
      this.loaderService.requestStarted();

      await this.reportService.GetStudentFeeReceipt(TransactionId)
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

  //document
  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel = new UploadFileModel();
      uploadModel.FileExtention = item.FileExtention ?? "";
      uploadModel.MinFileSize = item.MinFileSize ?? "";
      uploadModel.MaxFileSize = item.MaxFileSize ?? "";
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

  async GetDateConfig()
  {
    this.GetExamDateConfig();
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "MARKADMITTED",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.MARKADMITTED;
      }, (error: any) => console.error(error)
      );
  }
  async GetExamDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "ExaminationFee",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.ExaminationFee;
        console.log(this.DateConfigSetting)
      }, (error: any) => console.error(error)
      );
  }
}

