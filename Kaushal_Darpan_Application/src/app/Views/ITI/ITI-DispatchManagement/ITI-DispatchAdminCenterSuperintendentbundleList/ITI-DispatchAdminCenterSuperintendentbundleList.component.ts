import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ITIDispatchFormDataModel, ITIBundelDataModel, ITIDispatchSearchModel, ITIDispatchReceivedModel, ITIDownloadDispatchReceivedSearchModel, ITI_Dispatch_ShowbundleSearchModel } from '../../../../Models/ITIDispatchFormDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

import { ToastrService } from 'ngx-toastr';
import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumITIDispatchDDlValue, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { max } from 'rxjs';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../../../Services/Report/report.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ITIDispatchService } from '../../../../Services/ITIDispatch/ITIDispatch.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ITITheorySearchModel } from '../../../../Models/ITI/ItiInvigilatorDataModel';
import { ItiExaminerService } from '../../../../Services/ItiExaminer/iti-examiner.service';
import { ITITheoryExaminer } from '../../../../Models/ITI/AssignExaminerDataModel';

@Component({
  selector: 'app-ITI-DispatchAdminCenterSuperintendentbundleList',
  templateUrl: './ITI-DispatchAdminCenterSuperintendentbundleList.component.html',
  styleUrls: ['./ITI-DispatchAdminCenterSuperintendentbundleList.component.css'],
  standalone: false
})

export class ITIDispatchAdminCenterSuperintendentbundleListComponent implements OnInit {
  public DispatchForm!: FormGroup
  public BundelForm!: FormGroup
  public SearchForm!: FormGroup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
 
  public RadioForm!: FormGroup
  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public theorylist: any = {}
  public request = new ITITheoryExaminer();
  public Searchrequest = new ITI_Dispatch_ShowbundleSearchModel();
  public DownloadSearchrequest = new ITIDownloadDispatchReceivedSearchModel();
  public SearchBundelrequest = new ITIBundelDataModel();
  public StudentList: any = [];
  private modalRef: any;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
/*  public theorylist = new ITITheorySearchModel()*/
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
  public DispatchITI_Dispatch_ShowAllbundleList: any = [];
  @ViewChild('modal_ViewApplication') modal_ViewApplication: any;
  public examinerList:any=[]
  public AssignedExaminerInstituteDetailList: any = [];
  IsEditData: boolean = false;
  public AppointExaminerFromGroup!: FormGroup;



  public _DispatchDDlValue = EnumITIDispatchDDlValue



  public errormessage: string = ''

  
  public btnText: string = '';
  public IsBtn: boolean = false;
  public statusCh: number = 0;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private dispatchService: ITIDispatchService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private reportService: ReportService,
    private modalService: NgbModal,
    private Itiexaminerservice: ItiExaminerService,
    private router: Router,
  ) { }

  async ngOnInit() {
    


    this.AppointExaminerFromGroup = this.formBuilder.group({

      ddlSSOID: ['', [DropdownValidators]],
      RollNoFrom: ['', [Validators.required]],
      RollNoTo: ['', [Validators.required]],
      ExaminerCode: ['', [Validators.required]],


    });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
  }
  get _AppointExaminerFromGroup() { return this.AppointExaminerFromGroup.controls; }

  get _DispatchForm() { return this.DispatchForm.controls; }
  get _SearchForm() { return this.SearchForm.controls; }

  async ResetControl() {
    
    this.isSubmitted = false;
/*    this.request = new ITITheoryExaminer();*/
  }

  async GetAllData() {
    try {
        this.loaderService.requestStarted();
      await this.dispatchService.GetITI_Dispatch_Showbundle(this.Searchrequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            this.DispatchITI_Dispatch_ShowAllbundleList = data['Data'];

            console.log(this.DispatchITI_Dispatch_ShowAllbundleList)
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

  async GetITIExaminer() {
    try {
      this.loaderService.requestStarted();
      await this.Itiexaminerservice.GetITIExaminer(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.examinerList = data['Data'];
      
          console.log(this.examinerList)
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


  async CloseOTPModal() {
    this.modalService.dismissAll()
  }

  async GetAllTheoryStudents(content: any='',item:any) {

    this.request.ExaminerCode = '';
    this.request.RollNoFrom = '';
    this.request.RollNoTo = '';
    this.request.AppointExaminerID = 0;


    this.modalRef = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    await this.GetITIExaminer()
 /*   t
 
 his.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;*/


    this.request.BundleID = item.BundelID
    this.request.CenterID = item.CenterID
    this.request.SemesterID = item.SemesterID
    this.request.StreamID = item.StreamId
    this.request.SubjectID = item.SubjectId
    //this.request.subj = item.BundleID
    this.theorylist.EndtermID = this.sSOLoginDataModel.EndTermID
    this.theorylist.EngNong = this.sSOLoginDataModel.Eng_NonEng
    this.theorylist.InstituteID = item.CenterID
    this.theorylist.SubjectCode = item.SubjectCode
    this.theorylist.SemesterID = item.SemesterIDSemesterID
    this.theorylist.StreamID = item.StreamId
    try {


      await this.Itiexaminerservice.GetStudentTheory(this.theorylist)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentList = data['Data'];


   /*       console.log("StudentList", this.StudentList)*/
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  async SaveData() {

    try {
      this.isSubmitted = true;
      if (this.AppointExaminerFromGroup.invalid) {
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      //this.request.InstituteID = this.sSOLoginDataModel.InstituteID
      // Convert range values to numbers

      var isFromrollNumber = this.StudentList.find((x: any) => x.RollNo == this.request.RollNoFrom)
      var isTorollNumber = this.StudentList.find((x: any) => x.RollNo == this.request.RollNoTo)
      if (!isFromrollNumber) {
        this.toastr.error("The From Roll No is not in List to assign")
        return
      }
      if (!isTorollNumber) {
        this.toastr.error("The To Roll No is not in List to assign")
        return
      }


      const fromRoll = Number(this.request.RollNoFrom);
      const toRoll = Number(this.request.RollNoTo);

      if (fromRoll > toRoll) {
        this.toastr.error("Roll no from cannot be more than To roll No");
        return;
      }

      // Get students within range (inclusive)
      this.request.StudentList = this.StudentList.filter((student: any) => {
        const rollNo = Number(student.RollNo);
        return rollNo >= fromRoll && rollNo <= toRoll;
      });

      // Optional: check if no students matched
      if (this.request.StudentList.length === 0) {
        this.toastr.warning("No students found in the selected roll number range.");
        return;
      }


      //save
      await this.Itiexaminerservice.SaveExaminerdata(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            //this.GetInvigilatorList()
            /*       this.ResetControls();*/
            this.CloseOTPModal();
            this.CloseModalPopup();
            this.GetAllData();
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
 

  async GetAllExaminerAndInstituteDetails(content: any, item: any) {




    this.modalRef = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    await this.GetITIAssignedExaminerInstituteData(item.BundelID)
    this.request.BundleID = item.BundelID
    this.request.CenterID = item.CenterID
    this.request.SemesterID = item.SemesterID
    this.request.StreamID = item.StreamId
    this.request.SubjectID = item.SubjectId
    //this.request.subj = item.BundleID
    this.theorylist.EndtermID = this.sSOLoginDataModel.EndTermID
    this.theorylist.EngNong = this.sSOLoginDataModel.Eng_NonEng
    this.theorylist.InstituteID = item.CenterID
    this.theorylist.SubjectCode = item.SubjectCode
    this.theorylist.SemesterID = item.SemesterIDSemesterID
    this.theorylist.StreamID = item.StreamId
    try {
      debugger

      await this.Itiexaminerservice.GetStudentTheory(this.theorylist)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentList = data['Data'];


          /*       console.log("StudentList", this.StudentList)*/
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
    /*   t
    
    his.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;*/


    //this.request.BundleID = item.BundelID
   // this.request.CenterID = item.CenterID
      //this.request.SemesterID = item.SemesterID
      //this.request.StreamID = item.StreamId
      //this.request.SubjectID = item.SubjectId
      ////this.request.subj = item.BundleID
      //this.theorylist.EndtermID = this.sSOLoginDataModel.EndTermID
      //this.theorylist.EngNong = this.sSOLoginDataModel.Eng_NonEng
      //this.theorylist.InstituteID = item.CenterID
      //this.theorylist.SubjectCode = item.SubjectCode
      //this.theorylist.SemesterID = item.SemesterIDSemesterID
      //this.theorylist.StreamID = item.StreamId
    //try {
    //  debugger

    //  await this.Itiexaminerservice.GetStudentTheory(this.theorylist)
    //    .then((data: any) => {
    //      data = JSON.parse(JSON.stringify(data));
    //      this.StudentList = data['Data'];


    //      /*       console.log("StudentList", this.StudentList)*/
    //    }, error => console.error(error));
    //}
    //catch (Ex) {
    //  console.log(Ex);
    //}
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }


  async GetITIAssignedExaminerInstituteData(BundelID : number) {
    try {
      this.loaderService.requestStarted();
      await this.Itiexaminerservice.GetITIAssignedExaminerInstituteData(BundelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.examinerList = data['Data'];
          this.AssignedExaminerInstituteDetailList = data['Data'];

          console.log(this.examinerList)
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

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.IsEditData = false;
  }

 async EditData(item: any)
 {

    this.IsEditData = true;
   this.request.ExaminerCode = item.ExaminerCode;
   this.request.RollNoFrom = item.RollNo_From;
   this.request.RollNoTo = item.RollNo_To;
   this.request.ExaminerID = item.ExaminerID
   this.request.AppointExaminerID = item.AppointExaminerID;
    await this.GetITIExaminer();
   // this.request.CenterID = item.CenterID

  }

}

















