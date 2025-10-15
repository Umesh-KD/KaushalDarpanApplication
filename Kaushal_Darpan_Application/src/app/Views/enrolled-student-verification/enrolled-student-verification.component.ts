import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { GlobalConstants, EnumRole, enumExamStudentStatus, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { StudentApplicationModel, StudentApplicationSaveModel } from '../../Models/StudentApplicationDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { OTPModalComponent } from '../otpmodal/otpmodal.component';
import { EnrolledPromotedStudentVerifyService } from '../../Services/Enrolled-promoted-student-verify/enrolled-promoted-student-verify.service';
import { EnrolledPromotedStudentModel, EnrolledPromotedStudentSaveModel } from '../../Models/EnrolledPromotedStudentDataModel';
import { StudentExamDetailsViewModalComponent } from '../Student/student-exam-details-view-modal/student-exam-details-view-modal.component';


@Component({
  selector: 'app-enrolled-student-verification',
  standalone: false,
  templateUrl: './enrolled-student-verification.component.html',
  styleUrl: './enrolled-student-verification.component.css'
})

export class EnrolledStudentVerificationComponent {
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

  public StudentProfileDetailsData: any = [];
  public Student_QualificationDetailsData: any = [];

  public settingsMultiselect: object = {};
  public statusID: number = 0
  public NesStudentID: number = 0;
  public InstitutesListForStudent: any = [];

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
  public ExamStudentStatusList: any[] = [];
  public status: number = 0
  public FinancialYear: any = []
  public isShowdrop: boolean = true

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public StudentFilterStatusId: number = 0;
  public GenderList: any = []

  public _enumExamStudentStatus = enumExamStudentStatus;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  @ViewChild('MyModel_ViewStudentExam') childComponentViewStudentExam!: StudentExamDetailsViewModalComponent;

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

  public enrolledPromotedStudentRequest = new EnrolledPromotedStudentModel();
  public enrolledPromotedStudentList: any[] = [];

  public ValidParamTab: any[] = [1, 2, 3, 4];
  public ParamTab: number = 0;

  constructor(private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    public enrolledPromotedStudentVerifyService: EnrolledPromotedStudentVerifyService,
    private router: Router
  ) { }

  async ngOnInit() {

    // get key by param
    this.ParamTab = Number(this.activatedRoute.snapshot.queryParamMap.get("tab") ?? 0);
    if (!this.ValidParamTab.includes(this.ParamTab)) {
      this.router.navigate(['/**']);
      return;
    }

    //session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //load data
    await this.GetMasterData();
  }

  async GetMasterData() {
    try {
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetCommonMasterDDLByType('ExamStudentStatus')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamStudentStatusList = data['Data'];

          //debugger
          //filter
          this.ExamStudentStatusList = this.ExamStudentStatusList.filter((x: any) => {
            if (this.ParamTab == 1 && (this.sSOLoginDataModel.RoleID === EnumRole.Admin || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon)) {
              return x.ID === enumExamStudentStatus.VerifyandForwardtoExamIncharge;
            } else if (this.ParamTab == 2 && (this.sSOLoginDataModel.RoleID === EnumRole.ExaminationIncharge || this.sSOLoginDataModel.RoleID === EnumRole.ExaminationIncharge_NonEng)) {
              return x.ID === enumExamStudentStatus.VerifyandForwardtoRegistrar || x.ID === enumExamStudentStatus.ReturnbyExamIncharge;
            } else if (this.ParamTab == 3 && (this.sSOLoginDataModel.RoleID === EnumRole.Registrar || this.sSOLoginDataModel.RoleID === EnumRole.Registrar_NonEng)) {
              return x.ID === enumExamStudentStatus.ApprovebyRegistrar || x.ID === enumExamStudentStatus.ReturnbyRegistrar;
            } else if (this.ParamTab == 4 && (this.sSOLoginDataModel.RoleID === EnumRole.ACP || this.sSOLoginDataModel.RoleID === EnumRole.ACP_NonEng)) {
              return x.ID === enumExamStudentStatus.SelectedForExamination;
            }
            return false; // default case, exclude others
          });


        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_SearchClick() {
    await this.GetEnrolledPromotedStudentForVerification();
  }

  // ---------- get student data
  async GetEnrolledPromotedStudentForVerification() {
    // get
    if (this.ParamTab == 1 && (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon)) {
      await this.GetEnrolledStudent_Promoted();
    } else if (this.ParamTab == 2 && (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng)) {
      await this.GetEnrolledStudent_VerifyandForwardtoExamIncharge();
    } else if (this.ParamTab == 3 && (this.sSOLoginDataModel.RoleID == EnumRole.Registrar || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng)) {
      await this.GetEnrolledStudent_VerifyandForwardtoRegistrar();
    } else if (this.ParamTab == 4 && (this.sSOLoginDataModel.RoleID == EnumRole.ACP || this.sSOLoginDataModel.RoleID == EnumRole.ACP_NonEng)) {
      await this.GetEnrolledStudent_ApprovebyRegistrar();
    }
    else {
      this.toastr.error("Invalid action!");
    }
  }

  async GetEnrolledStudent_Promoted() {
    try {
      this.isSubmitted = true;

      //session
      this.enrolledPromotedStudentRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.enrolledPromotedStudentRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.enrolledPromotedStudentRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.enrolledPromotedStudentRequest.RoleID = this.sSOLoginDataModel.RoleID;

      //call
      await this.enrolledPromotedStudentVerifyService.GetEnrolledStudent_Promoted(this.enrolledPromotedStudentRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.enrolledPromotedStudentList = data['Data'];

            //table feature load
            this.loadInTable();
            //end table feature load
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

  async GetEnrolledStudent_VerifyandForwardtoExamIncharge() {
    try {
      this.isSubmitted = true;

      //session
      this.enrolledPromotedStudentRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.enrolledPromotedStudentRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.enrolledPromotedStudentRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.enrolledPromotedStudentRequest.RoleID = this.sSOLoginDataModel.RoleID;

      //call
      await this.enrolledPromotedStudentVerifyService.GetEnrolledStudent_VerifyandForwardtoExamIncharge(this.enrolledPromotedStudentRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.enrolledPromotedStudentList = data['Data'];

            //table feature load
            this.loadInTable();
            //end table feature load
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

  async GetEnrolledStudent_VerifyandForwardtoRegistrar() {
    try {
      this.isSubmitted = true;

      //session
      this.enrolledPromotedStudentRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.enrolledPromotedStudentRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.enrolledPromotedStudentRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.enrolledPromotedStudentRequest.RoleID = this.sSOLoginDataModel.RoleID;

      //call
      await this.enrolledPromotedStudentVerifyService.GetEnrolledStudent_VerifyandForwardtoRegistrar(this.enrolledPromotedStudentRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.enrolledPromotedStudentList = data['Data'];

            //table feature load
            this.loadInTable();
            //end table feature load
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

  async GetEnrolledStudent_ApprovebyRegistrar() {
    try {
      this.isSubmitted = true;

      //session
      this.enrolledPromotedStudentRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.enrolledPromotedStudentRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.enrolledPromotedStudentRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.enrolledPromotedStudentRequest.RoleID = this.sSOLoginDataModel.RoleID;

      //call
      await this.enrolledPromotedStudentVerifyService.GetEnrolledStudent_ApprovebyRegistrar(this.enrolledPromotedStudentRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.enrolledPromotedStudentList = data['Data'];

            //table feature load
            this.loadInTable();
            //end table feature load
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

  async GetEnrolledStudent_ReturnbyRegistrar() {
    try {
      this.isSubmitted = true;

      //session
      this.enrolledPromotedStudentRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.enrolledPromotedStudentRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.enrolledPromotedStudentRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.enrolledPromotedStudentRequest.RoleID = this.sSOLoginDataModel.RoleID;

      //call
      await this.enrolledPromotedStudentVerifyService.GetEnrolledStudent_ReturnbyRegistrar(this.enrolledPromotedStudentRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.enrolledPromotedStudentList = data['Data'];

            //table feature load
            this.loadInTable();
            //end table feature load
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

  async GetEnrolledStudent_ReturnbyExamIncharge() {
    try {
      this.isSubmitted = true;

      //session
      this.enrolledPromotedStudentRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.enrolledPromotedStudentRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.enrolledPromotedStudentRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.enrolledPromotedStudentRequest.RoleID = this.sSOLoginDataModel.RoleID;

      //call
      await this.enrolledPromotedStudentVerifyService.GetEnrolledStudent_ReturnbyExamIncharge(this.enrolledPromotedStudentRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //success
          if (data.State == EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.enrolledPromotedStudentList = data['Data'];

            //table feature load
            this.loadInTable();
            //end table feature load
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

  async btn_Clear() {
    //clear
    this.enrolledPromotedStudentRequest = new EnrolledPromotedStudentModel();
    this.enrolledPromotedStudentList = [];
  }

  // ---------- save marked student 
  async SaveDataMarked() {
    //debugger
    // status marked
    if (this.status <= 0) {
      this.toastr.error("Please select status!");
      return;
    }
    // any student selected
    const anyStudentSelected = this.enrolledPromotedStudentList.some(student => student.Selected);
    if (!anyStudentSelected) {
      this.toastr.error("Please select Student(s)!");
      return;
    }

    if (this.ParamTab == 1 && (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon)
      && this.status == enumExamStudentStatus.VerifyandForwardtoExamIncharge) {
      await this.SaveEnrolledStudentVerify_VerifyandForwardtoExamIncharge();
    } else if (this.ParamTab == 2 && (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng)
      && this.status == enumExamStudentStatus.VerifyandForwardtoRegistrar) {
      await this.SaveEnrolledStudentVerify_VerifyandForwardtoRegistrar();
    } else if (this.ParamTab == 3 && (this.sSOLoginDataModel.RoleID == EnumRole.Registrar || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng)
      && this.status == enumExamStudentStatus.ApprovebyRegistrar) {
      await this.SaveEnrolledStudentVerify_ApprovebyRegistrar();
    } else if (this.ParamTab == 3 && (this.sSOLoginDataModel.RoleID == EnumRole.Registrar || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng)
      && this.status == enumExamStudentStatus.ReturnbyRegistrar) {
      await this.SaveEnrolledStudentVerify_ReturnbyRegistrar();
    } else if (this.ParamTab == 4 && (this.sSOLoginDataModel.RoleID == EnumRole.ACP || this.sSOLoginDataModel.RoleID == EnumRole.ACP_NonEng)
      && this.status == enumExamStudentStatus.SelectedForExamination) {
      await this.SaveEnrolledStudentVerify_SelectedforExamination();
    } else if (this.ParamTab == 2 && (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng)
      && this.status == enumExamStudentStatus.ReturnbyExamIncharge) {
      await this.SaveEnrolledStudentVerify_ReturnbyExamIncharge();
    }
    else {
      this.toastr.error("Invalid action!");
    }
  }

  async SaveEnrolledStudentVerify_VerifyandForwardtoExamIncharge() {

    this.Swal2.Confirmation("Are you sure to continue?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //
            this.isSubmitted = true;
            this.loaderService.requestStarted();

            // await for otp
            await this.openOTPModal();

            //
            var request: EnrolledPromotedStudentSaveModel[] = [];
            const selectedStudents = this.enrolledPromotedStudentList.filter(x => x.Selected);
            selectedStudents.forEach(x => {
              request.push({
                StudentId: x.StudentID,
                ModifyBy: this.sSOLoginDataModel.UserID,
                RoleID: this.sSOLoginDataModel.RoleID,
                DepartmentID: this.sSOLoginDataModel.DepartmentID,
                Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
                EndTermID: this.sSOLoginDataModel.EndTermID,
                StudentExamID: x.StudentExamID
              })
            });
            // call
            await this.enrolledPromotedStudentVerifyService.SaveEnrolledStudentVerify_VerifyandForwardtoExamIncharge(request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.AllInTableSelect = false;
                  await this.GetEnrolledPromotedStudentForVerification();
                  this.toastr.success(data.Message)
                } else {
                  this.toastr.error(data.Message)
                }
              })
          } catch (ex) {
            console.log(ex);
            console.log(this.ErrorMessage);
          }
        }
      });
  }

  async SaveEnrolledStudentVerify_VerifyandForwardtoRegistrar() {

    this.Swal2.Confirmation("Are you sure to continue?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.isSubmitted = true;
            this.loaderService.requestStarted();

            // await for otp
            await this.openOTPModal();

            var request: EnrolledPromotedStudentSaveModel[] = [];
            const selectedStudents = this.enrolledPromotedStudentList.filter(x => x.Selected);
            selectedStudents.forEach(x => {
              request.push({
                StudentId: x.StudentID,
                ModifyBy: this.sSOLoginDataModel.UserID,
                RoleID: this.sSOLoginDataModel.RoleID,
                DepartmentID: this.sSOLoginDataModel.DepartmentID,
                Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
                EndTermID: this.sSOLoginDataModel.EndTermID,
                StudentExamID: x.StudentExamID
              })
            });
            // call
            await this.enrolledPromotedStudentVerifyService.SaveEnrolledStudentVerify_VerifyandForwardtoRegistrar(request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.AllInTableSelect = false;
                  await this.GetEnrolledPromotedStudentForVerification();
                  this.toastr.success(data.Message)
                } else {
                  this.toastr.error(data.Message)
                }
              })
          } catch (ex) {
            console.log(ex);
            console.log(this.ErrorMessage);
          }
        }
      });
  }

  async SaveEnrolledStudentVerify_ApprovebyRegistrar() {

    this.Swal2.Confirmation("Are you sure to continue?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.isSubmitted = true;
            this.loaderService.requestStarted();

            // await for otp
            await this.openOTPModal();

            var request: EnrolledPromotedStudentSaveModel[] = [];
            const selectedStudents = this.enrolledPromotedStudentList.filter(x => x.Selected);
            selectedStudents.forEach(x => {
              request.push({
                StudentId: x.StudentID,
                ModifyBy: this.sSOLoginDataModel.UserID,
                RoleID: this.sSOLoginDataModel.RoleID,
                DepartmentID: this.sSOLoginDataModel.DepartmentID,
                Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
                EndTermID: this.sSOLoginDataModel.EndTermID,
                StudentExamID: x.StudentExamID
              })
            });
            // call
            await this.enrolledPromotedStudentVerifyService.SaveEnrolledStudentVerify_ApprovebyRegistrar(request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.AllInTableSelect = false;
                  await this.GetEnrolledPromotedStudentForVerification();
                  this.toastr.success(data.Message)
                } else {
                  this.toastr.error(data.Message)
                }
              })
          } catch (ex) {
            console.log(ex);
            console.log(this.ErrorMessage);
          }
        }
      });
  }

  async SaveEnrolledStudentVerify_ReturnbyRegistrar() {

    this.Swal2.ConfirmationWithRemark("Are you sure to continue?",
      async (result: any) => {
        //confirmed
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();

          // await for otp
          await this.openOTPModal();

          var request: EnrolledPromotedStudentSaveModel[] = [];
          const selectedStudents = this.enrolledPromotedStudentList.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleID: this.sSOLoginDataModel.RoleID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              StudentExamID: x.StudentExamID,
              Remark: result
            })
          });
          // call
          await this.enrolledPromotedStudentVerifyService.SaveEnrolledStudentVerify_ReturnbyRegistrar(request)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success) {
                this.AllInTableSelect = false;
                await this.GetEnrolledPromotedStudentForVerification();
                this.toastr.success(data.Message)
              } else {
                this.toastr.error(data.Message)
              }
            })
        } catch (ex) {
          console.log(ex);
          console.log(this.ErrorMessage);
        }
      });
  }

  async SaveEnrolledStudentVerify_SelectedforExamination() {

    this.Swal2.Confirmation("Are you sure to continue?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.isSubmitted = true;
            this.loaderService.requestStarted();

            // await for otp
            await this.openOTPModal();

            var request: EnrolledPromotedStudentSaveModel[] = [];
            const selectedStudents = this.enrolledPromotedStudentList.filter(x => x.Selected);
            selectedStudents.forEach(x => {
              request.push({
                StudentId: x.StudentID,
                ModifyBy: this.sSOLoginDataModel.UserID,
                RoleID: this.sSOLoginDataModel.RoleID,
                DepartmentID: this.sSOLoginDataModel.DepartmentID,
                Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
                EndTermID: this.sSOLoginDataModel.EndTermID,
                StudentExamID: x.StudentExamID
              })
            });
            // call
            await this.enrolledPromotedStudentVerifyService.SaveEnrolledStudentVerify_SelectedforExamination(request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.AllInTableSelect = false;
                  await this.GetEnrolledPromotedStudentForVerification();
                  this.toastr.success(data.Message)
                } else {
                  this.toastr.error(data.Message)
                }
              })
          } catch (ex) {
            console.log(ex);
            console.log(this.ErrorMessage);
          }
        }
      });
  }

  async SaveEnrolledStudentVerify_ReturnbyExamIncharge() {

    this.Swal2.ConfirmationWithRemark("Are you sure to continue?",
      async (result: any) => {
        //confirmed
        try {
          this.isSubmitted = true;
          this.loaderService.requestStarted();

          // await for otp
          await this.openOTPModal();

          var request: EnrolledPromotedStudentSaveModel[] = [];
          const selectedStudents = this.enrolledPromotedStudentList.filter(x => x.Selected);
          selectedStudents.forEach(x => {
            request.push({
              StudentId: x.StudentID,
              ModifyBy: this.sSOLoginDataModel.UserID,
              RoleID: this.sSOLoginDataModel.RoleID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
              EndTermID: this.sSOLoginDataModel.EndTermID,
              StudentExamID: x.StudentExamID,
              Remark: result
            })
          });
          // call
          await this.enrolledPromotedStudentVerifyService.SaveEnrolledStudentVerify_ReturnbyExamIncharge(request)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success) {
                this.AllInTableSelect = false;
                await this.GetEnrolledPromotedStudentForVerification();
                this.toastr.success(data.Message)
              } else {
                this.toastr.error(data.Message)
              }
            })
        } catch (ex) {
          console.log(ex);
          console.log(this.ErrorMessage);
        }
      });
  }

  async openOTPModal() {
    // debugger
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

    // await for open model
    await this.childComponent.OpenOTPPopup();

    // await OTP verification
    await this.childComponent.waitForVerification();
  }
  // ---------- end save marked student



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
    this.paginatedInTableData = [...this.enrolledPromotedStudentList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.enrolledPromotedStudentList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.enrolledPromotedStudentList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.enrolledPromotedStudentList.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.enrolledPromotedStudentList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.enrolledPromotedStudentList.filter(x => x.StudentExamID == item.StudentExamID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.enrolledPromotedStudentList.every(r => r.Selected);
  }
  // end table feature

  //excel export
  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Selected', 'status',
      'EndTermID', 'StreamID', 'SemesterID', 'StudentType'
    ];
    const filteredData = this.enrolledPromotedStudentList.map((item: any) => {
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

  async openViewStudentExamDetailsPopup(StudentID: number, StudentExamID: number) {
    //debugger
    this.childComponentViewStudentExam.StudentID = StudentID;
    this.childComponentViewStudentExam.StudentExamID = StudentExamID;
    await this.childComponentViewStudentExam.OpenViewStudentExamDetailsPopup();
  }
}
