import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PreExamStudentDataModel } from '../../../Models/PreExamStudentDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { enumExamStudentStatus, EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { PreExamStudentExaminationService } from '../../../Services/PreExamStudent/pre-exam-student-examination.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { SubjectSearchModel } from '../../../Models/SubjectMasterDataModel';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { StudentMarkedModel, StudentMasterModel } from '../../../Models/StudentMasterModels';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewStudentDetailsRequestModel } from '../../../Models/ViewStudentDetailsRequestModel';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-pre-exam-student-verification',
  standalone: false,
  templateUrl: './pre-exam-student-verification.component.html',
  styleUrl: './pre-exam-student-verification.component.css'
})
export class PreExamStudentVerificationComponent {
  public SearchStudentDataFormGroup!: FormGroup;

  public request = new PreExamStudentDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchrequest = new SubjectSearchModel()
  requestStudent = new StudentMasterModel();

  public filteredSemesterList: any = [];
  public SemesterMasterList: any = [];
  public InstituteMasterList: any = [];
  public InstitutesListForStudent: any = [];
  public InstitutionManagementMasterList: any = [];
  public StreamMasterList: any = [];
  public StudentTypeList: any = [];
  public StudentTypeMasterList: any = [];
  public StudentStatusList: any = [];
  public ExamCategoryList: any = [];
  public CasteCategoryAMasterData: any = [];
  public SessionTypeList: any = [];
  public ExamStudentStatusDDLList: any = [];
  public FinancialYear: any = [];
  public PassingYearList: any = [];
  public BoardMasterList: any = [];
  public CasteCategoryBMasterData: any = [];
  public PreExamStudentData: any = [];
  public PreExamStudentDataForExcel: any = [];
  public SubjectMasterDDLList: any = [];
  public StudentProfileDetailsData: any = [];
  public Student_QualificationDetailsData: any = [];
  public documentDetails: DocumentDetailsModel[] = [];
  public SubjectID: any = [];

  public isSubmitted: boolean = false;
  public showSubject: boolean = false;
  public IsShowViewStudent: boolean = false;
  public IsYearly: boolean = false;
  public IsVerified: boolean = false;
  public status: number = 0
  public statusID: number = 0
  public closeResult: string | undefined;

  _EnumRole = EnumRole;

  @ViewChild('otpModal') childComponent!: OTPModalComponent;

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
  //end table feature default

  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private preExamStudentExaminationService: PreExamStudentExaminationService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2
  ) { }
  async ngOnInit() { 
    this.SearchStudentDataFormGroup = this.formBuilder.group(
      {
        txtEnrollmentNo: [''],
        ddlInstituteID: [{ value: '', disabled: false }],
        //ddlFinancialYearID: ['', [DropdownValidators]],
        ddlStreamID: [''],
        ddlSemesterID: [''],
        IsYearly: [''],
        /*        ddlExamstatus: ['', [DropdownValidators]],*/
        ddlStudentTypeID: [''],
        ddlManagementID: [''],
        ddlstatus: [''],
        ddlsubjectstaus: [''],
        ddlbridege: [''],
        ddlExamCategoryID: [''],
        txtStudentName: [''],
        txtMobileNo: [''],
        SessionType: ['']
      })
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.statusID = Number(this.activatedRoute.snapshot.queryParamMap.get('Status')?.toString());
    
    await this.GetMasterData();
    await this.ExaminationSchemeChange();

    if (this.statusID > 0) {
      this.request.StudentFilterStatusId = this.statusID
      await this.GetPreExamStudentForVerify();
    }
    
  }

  async GetMasterData() {
    try {
      
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
            this.InstituteMasterList = data['Data'];
            this.request.InstituteID = this.sSOLoginDataModel.InstituteID
            this.InstituteMasterList = this.InstituteMasterList.filter((x: any) => { return x.InstituteID == this.request.InstituteID });
            //console.log(this.sSOLoginDataModel.InstituteID,'ss1')
            //console.log(this.InstituteMasterList,'ss2')
          } else {
            this.InstituteMasterList = data['Data'];
            //this.request.InstituteID = 0
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

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));
      await this.commonMasterService.SemesterMaster(1)
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

      await this.commonMasterService.GetStudentStatusByRole(this.sSOLoginDataModel.RoleID, 2)
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
      await this.commonMasterService.ExamStudentStatus(this.sSOLoginDataModel.RoleID, 2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamStudentStatusDDLList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetExamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.SessionTypeList = data['Data'];
          console.log("this.SessionTypeList", this.SessionTypeList);
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

  ExaminationSchemeChange() {
    this.request.Year_SemID = 0
    if (this.request.IsYearly == 0) {
      this.filteredSemesterList = this.SemesterMasterList.filter((item: any) => item.SemesterID <= 6);
    } else if (this.request.IsYearly == 1) {
        this.filteredSemesterList = this.SemesterMasterList.filter((item: any) => item.SemesterID >= 7);
    } else {
      this.filteredSemesterList = this.SemesterMasterList
    }
  }

  async GetPreExamStudentForVerify() {
    try {
      this.isSubmitted = true;
      //session
      this.PreExamStudentData = []
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.request.RoleID = this.sSOLoginDataModel.RoleID
      //call
      this.loaderService.requestStarted();
      await this.preExamStudentExaminationService.GetPreExamStudentForVerify(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.PreExamStudentData = data['Data'];
            this.PreExamStudentDataForExcel = data['Data'];
            console.log(this.PreExamStudentData, "daataa")
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

  async btn_SearchClick() {
    this.isSubmitted = true;
    if (this.SearchStudentDataFormGroup.invalid) {
      return
    }
    try {
      await this.GetPreExamStudentForVerify();

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

  async btn_Clear() {
    /* this.SearchStudentDataFormGroup.reset()*/
    this.request.ApplicationNo = '';
    this.request.Name = '';
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
  }

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData()
  {
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
    return this.PreExamStudentData.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.PreExamStudentData.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.PreExamStudentData.filter((x: any) => x.StudentID == item.StudentID && x.SemesterID == item.SemesterID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.PreExamStudentData.every((r: any) => r.Selected);
  }
  // end table feature

  async exportToExcel() {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status', 'StudentID',
      'EndTermID', 'StreamID', 'SemesterID', 'StudentType', 'StudentTypeID', 'StudentExamID'
    ];
    //
    await this.GetPreExamStudentForExcel();
    //
    const filteredData = this.PreExamStudentDataForExcel.map((item: any) =>
    {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...filteredData.map((item: any) => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Extra padding
    }));

    ws['!cols'] = columnWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'fulldata.xlsx');
  }

  async GetPreExamStudentForExcel() {
    try {
      //session
      this.PreExamStudentDataForExcel = []
      let request = new PreExamStudentDataModel();
      request.EndTermID = this.sSOLoginDataModel.EndTermID
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      //call
      await this.preExamStudentExaminationService.GetPreExamStudent(request)
        .then(async (data: any) =>
        {
          //
          if (data.State == EnumStatus.Success)
          {
            this.PreExamStudentDataForExcel = data.Data
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async VerifyStudent_ExaminationIncharge() {

    var request: StudentMarkedModel[] = [];
    const selectedStudents = this.PreExamStudentData.filter((x: any) => x.Selected);
    selectedStudents.forEach((x: any) => {
      request.push({
        StudentId: x.StudentID,
        Status: 13,
        StudentFilterStatusId: this.request.StudentFilterStatusId,
        ModifyBy: this.sSOLoginDataModel.UserID,
        RoleId: this.sSOLoginDataModel.RoleID,
        Marked: x.Selected,
        StudentExamID: x.StudentExamID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        RoleID: this.sSOLoginDataModel.RoleID
      })
    });
    try {
      
      await this.preExamStudentExaminationService.VerifyByExaminationIncharge(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.GetPreExamStudentForVerify();
        }
        else {
          this.toastr.error(data.Message);
        }
      })
    } catch (error) {
      console.log(error);
    } 
    
  }

  async VerifyStudent_Registrar() {

    var request: StudentMarkedModel[] = [];
    const selectedStudents = this.PreExamStudentData.filter((x: any) => x.Selected);
    selectedStudents.forEach((x: any) => {
      request.push({
        StudentId: x.StudentID,
        Status: 13,
        StudentFilterStatusId: this.request.StudentFilterStatusId,
        ModifyBy: this.sSOLoginDataModel.UserID,
        RoleId: this.sSOLoginDataModel.RoleID,
        Marked: x.Selected,
        StudentExamID: x.StudentExamID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        RoleID: this.sSOLoginDataModel.RoleID
      })
    });
    try {
      
      await this.preExamStudentExaminationService.VerifyStudent_Registrar(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.GetPreExamStudentForVerify();
        }
        else {
          this.toastr.error(data.Message);
        }
      })
    } catch (error) {
      console.log(error);
    } 
    
  }

  async ViewStudentDetails(content: any, StudentID: number, StudentExamID: number) {
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

  async GetStudentProfileDetails(StudentID: number, StudentExamID: number) {
    try {
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
      await this.preExamStudentExaminationService.ViewStudentDetails(model)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentProfileDetailsData = data['Data']['ViewStudentDetails'];
          this.Student_QualificationDetailsData = data['Data']['Student_QualificationDetails'];
          this.documentDetails = data['Data']['documentDetails'];
          // for admitted/new admitted
          if (this.StudentProfileDetailsData[0].status == null || this.StudentProfileDetailsData[0].status == "") {
            this.StudentProfileDetailsData[0].status = this.StudentProfileDetailsData[0].status1;
          }
          this.IsYearly = data['Data']['ViewStudentDetails'][0]['IsYearly'];
          //this.setStudentFilesForOldBterview()
          console.log(data['Data']['ViewStudentDetails'][0]['IsYearly'],"yearly")
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

  CloseViewStudentDetails() {

    this.modalService.dismissAll();
    this.requestStudent = new StudentMasterModel()
    this.SubjectID = []
    this.SubjectMasterDDLList = []
    this.GetSubjectMasterDDL()
    this.IsVerified = false;

  }

    async openOTPModal() {
    const isAnySelected = this.PreExamStudentData.some((x: any) => x.Selected);
    if (!isAnySelected) {
      this.toastr.error('Please select at least one Student!');
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to Verify ?",
      async (result: any) => {
        if (result.isConfirmed) {
          this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

          // await for open model
          await this.childComponent.OpenOTPPopup();

          // await OTP verification
          await this.childComponent.waitForVerification();

          // do work
          if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge || 
            this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng) {
            await this.VerifyStudent_ExaminationIncharge();
          }

          if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar || 
            this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng) {
            await this.VerifyStudent_Registrar();
          }
        }
      });
  }
}
