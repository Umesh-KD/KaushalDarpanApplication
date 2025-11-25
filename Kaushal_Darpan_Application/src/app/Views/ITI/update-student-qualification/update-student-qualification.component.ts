import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentDashboardModel } from '../../../Models/StudentDashboardModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StudentService } from '../../../Services/Student/student.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumDepartment, EnumRole, EnumStatus, EnumUserType, GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LateralEntryQualificationModel, QualificationDataModel } from '../../../Models/ApplicationFormDataModel';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../../Common/document-details';


@Component({
  selector: 'update-student-qualification',
  templateUrl: './update-student-qualification.component.html',
  styleUrls: ['./update-student-qualification.component.css'],
  standalone: false
})


export class UpdateStudentQualificationComponent implements OnInit {

  public _GlobalConstants: any = GlobalConstants;

  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isOtherQuali:boolean=false;

  public UserID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new StudentSearchModel();
  public StudantDashboardList: StudentDashboardModel[] = [];
  public PassingYearList: any = [];
  public BoardList: any = [];
  public marktypelist:any=[];

  public qualificationList:LateralEntryQualificationModel[]=[];

  public otherQualification:string='';
  public otherdoc:string='';


  public StudantCourseList: StudentDetailsModel[] = [];
  public request = new LateralEntryQualificationModel();

  public _EnumDepartment = EnumDepartment;
  public IsShowDashboard: boolean = false;
  public isqualificationformSubmitted:boolean=false;

 public qualificationForm!: FormGroup;
  
  //Profile View Variables Pawan
  public ProfileLists: any = {};
  //Profile View Variables Pawan

  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  @ViewChild('modal_StudetnCourseType') modal_GenrateOTP: any;
  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private studentService: StudentService,
    private toastr: ToastrService,
    private routers: Router,
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private encryptionService: EncryptionService,
    private router: ActivatedRoute, 
    private modalService: NgbModal, 
    public appsettingConfig: AppsettingService, 
    private Swal2: SweetAlert2, 
    private route: Router,
    private ApplicationService: BterApplicationForm,
    private documentDetailsService: DocumentDetailsService, 
  ) { }
  
  async ngOnInit()
  {

    //this.Swal2.ConfirmationWithSelect("oops no record found, Kindly map sso to application", async (result: any) =>
    //{
    //  console.log(result);

    //  if (!result)
    //  {

    //  }

    //}, 'OK');
    //return;


    this.qualificationForm = this.formBuilder.group(
      {
        txtotherQualification:[''],
        ddlqualification: ['',Validators.required],
        txtAggregateMaximumMarks: ['', [DropdownValidators]],
          txtAggregateMarksObtained: ['', [DropdownValidators]],
        txtpercentage: [{ value: '', disabled: true }],
        ddlBoardID: ['', [DropdownValidators]],
        ddlPassyear: ['', [DropdownValidators]],
        ddlMarksType: ['', [DropdownValidators]],
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.sSOLoginDataModel.UserType == EnumUserType.STUDENT || this.sSOLoginDataModel.UserType == EnumUserType.CITIZEN)
    {

      if (this.sSOLoginDataModel.StudentID == 0)
      {
        await this.GetStudentCourses();
        if (this.StudantCourseList?.length == 0)
        {
          this.Swal2.Confirmation("Click 'OK' to proceed with registering this SSO ID on the Kaushal Darpan portal.", async (result: any) => {
            //this.sSOLoginDataModel.DepartmentID = result;
            //session
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
            //window.open("/StudentSsoMapping", "_Self")
            this.route.navigateByUrl('/StudentSsoMapping');
          }, 'OK');
        }
        else if (this.StudantCourseList?.length == 1)
        {
          this.sSOLoginDataModel.StudentID = this.StudantCourseList[0]?.StudentID;
          this.sSOLoginDataModel.DepartmentID = this.StudantCourseList[0]?.DepartmentID;
          localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
          this.IsShowDashboard = true;
          //changes 
          await this.GetStudentDashboard();
          await this.GetProfileDashboard();
          this.route.navigateByUrl('/dashboard');
        //  window.open("/dashboard", "_Self")
        }
        else if (this.StudantCourseList?.length > 1)
        {
          this.openModalCource(this.modal_GenrateOTP);
        }
      }
      else
      {
        this.IsShowDashboard = true;
        await this.calculatePercentage();
        await this.GetMarktYPEDDL();
        await this.GetPassingYearDDL();
        await this.GetStudentDashboard();
        await this.GetProfileDashboard();
        await this.loadDropdownData('Board');
      }


  
    }
    //else {
    //  //Redirect To Emitra Application
    //  window.open('/emitradashboard', "_self");
    //}
    //await this.GetAllData();
  }


  async openModalCource(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  
  async loadDropdownData(MasterCode: string) {
    debugger
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

  async GetStudentCourses() {
    this.StudantCourseList = [];
    try {
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.action = "GetStudentCourseDetailsBySSOID";
      this.loaderService.requestStarted();
      await this.studentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudantCourseList = data['Data'];
            console.log(this.StudantCourseList + "Course LIST");
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

  async GetStudentDashboard() {
    debugger
    this.StudantDashboardList = [];
    try {

      this.searchRequest.StudentID = this.sSOLoginDataModel.StudentID;
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.studentService.GetStudentDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudantDashboardList = data['Data'];
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


  async GetProfileDashboard() {
    debugger
    try {
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.StudentID = this.sSOLoginDataModel.StudentID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      this.loaderService.requestStarted();
      await this.studentService.GetProfileDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {

            this.ProfileLists = data['Data'][0];
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

  @ViewChild('content') content: ElementRef | any;

  async openModal(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CloseModal() {
    this.modalService.dismissAll();
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

  
  get _QualificationForm() { return this.qualificationForm.controls; }
  SetStudentDepartment(item: any)
  {
    this.sSOLoginDataModel.StudentID = item.StudentID;
    this.sSOLoginDataModel.DepartmentID = item.DepartmentID;
    localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
    this.CloseModal();
    //window.open("/dashboard", "_Self")

    this.route.navigate(['/dashboard']);
    this.IsShowDashboard = true;
    this.GetStudentDashboard();
    this.GetProfileDashboard();
  }


  async Redirect(key:number) {
 

    if (key == EnumDepartment.BTER) {
      this.CloseModal()
      await this.route.navigate(['/StudentJanAadharDetail'], { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.BTER) } });
    } else if (key == EnumDepartment.ITI) {
      this.CloseModal()
      await this.route.navigate(['/StudentJanAadharDetail'], { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.ITI) } });
    } else if (key == 4) {
      this.CloseModal()
      this.route.navigate(['/StudentJanAadharDetail'], { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.ITI), isDirectAdmission: true } });
      
    }
  }
  




  calculatePercentage(): void {
    debugger
    // this.request.MarkType= this.qualificationForm.value.ddlMarksType;
    let maxMarks = this.request.AggMaxMark;
    // this.request.AggMaxMark=this.qualificationForm.get('txtAggregateMaximumMarks')?.value;
    // this.request.AggMaxMark=this.qualificationForm.get('txtAggregateMaximumMarks')?.value;
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
      this.qualificationForm.get('txtAggregateMaximumMarks')?.disable();
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
      this.qualificationForm.get('txtAggregateMaximumMarks')?.enable();
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
     
    }
  }

  async AddMoreDetails() {
      debugger
    this.isqualificationformSubmitted = true;
    if(this.qualificationForm.invalid) {
      this.toastr.error("Please fill all the required fields of Qualification Form")
      return;
    }

    if(this.request.Qualification=="1"){
      this.request.Qualification=this.otherQualification;
    }

    const personExists = this.qualificationList.some(person =>
      person.Qualification === this.request.Qualification

    );


    if (!personExists) {
      this.qualificationList.push(this.request);
      this.request = new LateralEntryQualificationModel();
      this.isqualificationformSubmitted = false;
    } else {
      this.toastr.error("Qualification already exists with the same Field");
      return
    }

    // this.request.ConcernPersonDetails.push(this.personRequest);
  
  }


  async UploadDocument(event: any) {
    try {
      //upload model
       let uploadModel = new UploadFileModel();
      //uploadModel.FileExtention = item.FileExtention ?? "";
      //uploadModel.MinFileSize = item.MinFileSize ?? "";
     // uploadModel.MaxFileSize = item.MaxFileSize ?? "";
      uploadModel.FolderName = "ITI/AdditionalQualification/";

     
      //call
      debugger
      await this.documentDetailsService.UploadDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
        
            this.request.OtherDoc=data.Data[0].FileName;       
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


  async Delete_Qualification(idx:number){
    try{
      this.qualificationList.splice(idx,1);
    }
    catch(error){
      console.log(error);
    }
  }


    // get detail by id
    async SaveData() {
      debugger
      try {
        this.isSubmitted = true;
        // if (this.qualificationForm.invalid) {
        //   console.log("errro")
        //   return
        // }
  
        if(this.qualificationList.length<=0){
          this.toastr.error("Please add at least one Qualification details");
          return
        }
        this.isLoading = true;
  
        this.loaderService.requestStarted();
  
        // this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        // this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        let obj={
          StudentID:this.sSOLoginDataModel.UserID,
          OtherDoc:this.otherdoc,
          QualificationList:this.qualificationList
        }
  
  
        //save
        await this.ApplicationService.UpdateStudentQualificationDetails(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            // this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
  
            if (data.State = EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.ResetControls();
              // this.routers.navigate(['/CompanyMaster']);
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


  OnQulaificationChange(){
    debugger
    // isOtherQuali
    if(this.request.Qualification =="1"){
      this.isOtherQuali=true;
    }
    else{
      this.isOtherQuali=false;
    }
      
  }


  async resetcurrentDetails() {

    this.otherQualification='';
    this.request.OtherDoc='';
    this.request.Qualification='';
    this.otherQualification='';
    this.request.StateID = 0;
    this.request.BoardID = 0;
    this.request.PassingID = '';
    this.request.RollNumber = '';
    this.request.MarkType = 0;
    this.request.AggMaxMark = 0;
    this.request.Percentage = '';
    this.request.AggObtMark = 0;

  }

  async ResetControls(){
    this.qualificationList=[];
  }


  

}
