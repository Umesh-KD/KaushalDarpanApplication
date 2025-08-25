import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { enumExamStudentStatus, EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreExam_UpdateEnrollmentNoModel, PreExamStudentDataModel } from '../../../Models/PreExamStudentDataModel';
import { SubjectSearchModel } from '../../../Models/SubjectMasterDataModel';
import { M_StudentMaster_QualificationDetailsModel, StudentMasterModel } from '../../../Models/StudentMasterModels';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DocumentDetailsService } from '../../../Common/document-details';
import { StudentEnrollmentService } from '../../../Services/studentenrollment/student-enrollment.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { UploadFileModel } from '../../../Models/UploadFileModel';

@Component({
  selector: 'app-student-enrollment-report',
  templateUrl: './student-enrollment-report.component.html',
  styleUrls: ['./student-enrollment-report.component.css'],
  standalone: false
})

export class StudentEnrollmentReportComponent implements AfterViewInit {
  Message: string = '';
  ErrorMessage: string = '';
  public State: number = -1;
  viewAdminDashboardList: StudentExamDetails[] = [];
  filteredData: any[] = [];
  displayedColumns: string[] = ['SrNo', 'StudentName', 'FatherName', 'InstituteName', 'BranchName', 'SemesterName', 'Status', 'Action'];
  dataSource: MatTableDataSource<StudentExamDetails> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel: any;
  id: any;
  instituteId: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  filterForm: FormGroup | undefined;
  request = new PreExamStudentDataModel();
  searchrequest = new SubjectSearchModel()
  requestStudent = new StudentMasterModel();
  RequestStudent = new M_StudentMaster_QualificationDetailsModel();
  requestUpdateEnrollmentNo = new PreExam_UpdateEnrollmentNoModel();
  EditStudentDataFormGroup!: FormGroup;
  public TodayDate = new Date();
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public IsShowViewStudent: boolean = false;
  public isSubmitted: boolean = false;
  public StudentFilterStatusId: number = 0;
  public SubCasteCategoryADDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public SubjectID: any[] = [];
  IsVerified: boolean = false;
  isDisabled:boolean=false
  constructor(
    private AdminReportsService: ReportService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private documentDetailsService: DocumentDetailsService,
    private studentEnrollmentService: StudentEnrollmentService,
    private toastr: ToastrService,
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this.instituteId = params.get('instituteId');
    });
    if (this.instituteId == null || this.instituteId == undefined) {
      this.instituteId=0
    }
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
    this.loadMasterData();
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      selectedInstitute: [0],
      selectedSemester: [0],
    });
    this.checkInstituteStatus()
    this.filterForm.valueChanges.subscribe((values) => {
      this.applyFilter(values);
    });
    this.EditStudentDataFormGroup = this.fb.group(
      {
        txtStudentName: [{ value: '', disabled: true }, Validators.required],
        txtStudentNameHindi: [{ value: '', disabled: true }, Validators.required],
        txtFatherName: [{ value: '', disabled: true }, Validators.required],
        txtFatherNameHindi: [{ value: '', disabled: true }, Validators.required],
        txtMotherName: [{ value: '', disabled: true }, Validators.required],
        txtMotherNameHindi: [{ value: '', disabled: true }, Validators.required],
        ddlStudentTypeID: [{ value: '', disabled: true }],
        ddlGender: [{ value: '', disabled: true }, Validators.required],
        txtPapers: [{ value: '', disabled: true },],
        ddlInstituteID: [{ value: '', disabled: true }, [DropdownValidators]],
        ddlStreamID: [{ value: '', disabled: true }, [DropdownValidators]],
        txtMobileNo: ['', Validators.required],

        ddlCategoryA_ID: [{ value: '', disabled: true }, [DropdownValidators]],
        ddlCategoryB_ID: [{ value: '', disabled: true }, [DropdownValidators]],
        txtDOB: [{ value: '', disabled: true }, Validators.required],
        txtEmail: [''],
        txtAadharNo: [{ value: '', disabled: true },],
        txtBhamashahNo: [{ value: '', disabled: true },],
        JanAadharNo: [{ value: '', disabled: true },],
        txtAddress: [''],
        txtBankName: [{ value: '', disabled: true },],
        txtIFSCCode: [{ value: '', disabled: true },],
        txtBankAccountNo: [{ value: '', disabled: true },],
        IsVerified: [{ value: '', disabled: false },],
        ddlSubCategoryA_ID: [{ value: '', disabled: true }, Validators.required],
      })
  }
  get EditStudentDataform() { return this.EditStudentDataFormGroup.controls; }

  ngAfterViewInit(): void {
    // Apply filter after the view is initialized
    setTimeout(() => {
      this.applyFilter(this.filterForm?.value);
    }, 1000);
  }

  loadMasterData(): void {
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
        this.filterForm?.patchValue({
          selectedInstitute: parseInt(this.instituteId),
        });
      }, (error: any) => console.error(error));

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'EndTermID', 'InstituteID', 'Selected', 'SemesterID', 'Status', 'StreamID', 'StudentID'
    ];
    const filteredData = this.viewAdminDashboardList.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = Object.keys(this.viewAdminDashboardList[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...this.viewAdminDashboardList.map(item => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Extra padding
    }));

    ws['!cols'] = columnWidths; 

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  async GetAllData() {
    try {
      const ssoLoginUser = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');
      let requestData: any = {
        EndTermID: ssoLoginUser.EndTermID,
        DepartmentID: ssoLoginUser.DepartmentID,
        Eng_NonEng: ssoLoginUser.Eng_NonEng,
        UserID: ssoLoginUser.UserID,
        RoleID: ssoLoginUser.RoleID,
        Status: this.id,
        InstituteID: ssoLoginUser.InstituteID
      }

      await this.AdminReportsService.GetStudentEnrollmentReports(requestData)
        .then((data: any) => {
          this.viewAdminDashboardList = data['Data'];
          this.filteredData = [...this.viewAdminDashboardList];
          this.dataSource = new MatTableDataSource(this.filteredData);
          this.dataSource.sort = this.sort;
          this.totalRecords = this.filteredData.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updateTable();
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();
  }

  applyFilter(filterValue: any): void {
    const { searchTerm, selectedInstitute, selectedSemester } = filterValue;
    this.filteredData = this.viewAdminDashboardList.filter(item => {
      const matchesSearchTerm = item.StudentName.toLowerCase().includes(filterValue.searchTerm.trim().toLowerCase());
      const matchesInstitute = selectedInstitute === 0 || item.InstituteID == selectedInstitute;
      const matchesSemester = selectedSemester === 0 || item.SemesterName === selectedSemester;

      return matchesSearchTerm && matchesInstitute && matchesSemester;
    });

    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1;
    this.updateTable();

    if (this.isDisabled) {


      this.filterForm?.controls['selectedInstitute'].disable(); // 🔥 Disables the control
    } else {
      this.filterForm?.controls['selectedInstitute'].enable(); // 🔥 Enables the control
    }

  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    this.dataSource.data = this.filteredData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }


  checkInstituteStatus() {
    this.isDisabled = this.sSOLoginDataModel?.InstituteID > 0 && this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel?.InstituteID > 0 && this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon;
    this.instituteId = this.sSOLoginDataModel.InstituteID
   
  }




  resetForm(): void {
    this.filterForm?.reset({
      searchTerm: '',
      selectedInstitute: 0,
      selectedSemester: 0,
    });

    this.applyFilter(this.filterForm?.value);
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

  async GetPreExam_StudentMaster(StudentID: number) {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    var Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    var EndTermID = this.sSOLoginDataModel.EndTermID
    this.StudentFilterStatusId = this.request.StudentFilterStatusId
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.PreExam_StudentMaster(StudentID, this.request.StudentFilterStatusId, DepartmentID, Eng_NonEng, EndTermID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestStudent = data['Data'];
          console.log(this.requestStudent, 'ITPL')
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
          this.requestUpdateEnrollmentNo.InstituteID = data['Data']['InstituteID'];
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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

  CloseViewStudentDetails() {
    this.modalService.dismissAll();
    this.requestStudent = new StudentMasterModel()
    this.SubjectID = []
    this.SubjectMasterDDLList = []
    this.GetSubjectMasterDDL()
    this.IsVerified = false;
    this.requestStudent.DocumentDetails = []
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
            await this.CloseViewStudentDetails();
            this.requestStudent.DocumentDetails = []
            await this.viewAdminDashboardList;
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
}
