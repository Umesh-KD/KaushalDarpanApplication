import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { StudentDetailsModel } from '../../../../Models/StudentDetailsModel';
import { StudentSearchModel } from '../../../../Models/StudentSearchModel';
import { EnumCourseType, EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { StudentService } from '../../../../Services/Student/student.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ITICollegeAdmissionService } from '../../../../Services/ITICollegeAdmission/iticollege-admission.service';
import { ITICollegeAdmissionDataModels } from '../../../../Models/ITI/ITICollegeAdmissionDataModels';
import { ItiTradeSearchModel, StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { Router } from '@angular/router';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-iticollege-admission',
  //imports: [],
  templateUrl: './iticollege-admission.component.html',
  styleUrl: './iticollege-admission.component.css',
  standalone: false
})
export class ITICollegeAdmissionComponent implements OnInit {
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public StreamID: number = 0;
  public selectedApplicationID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public DOB: string = '';
  public StudentDetailsModelList: StudentDetailsModel[] = [];
  public request = new ITICollegeAdmissionDataModels();
  public searchRequest = new StudentSearchModel();
  public _EnumDepartment = EnumDepartment;
  public isShowGrid: boolean = false;
  public searchssoform!: FormGroup
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public DefaultApplicationText: String = '';
  public RequestFormGroup!: FormGroup;
  public RequestFormGroupBter!: FormGroup;
  public isLoading: boolean = false;
  public State: number = 0;
  public SuccessMessage: any = [];
  public Message: any = [];
  public ErrorMessage: any = [];
  public isSubmitted: boolean = false
  public TradeList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel();
  public box10thChecked: boolean = true
  public box8thChecked: boolean = true
  public BranchName: any = [];
  public streamSearchRequest = new StreamDDL_InstituteWiseModel();
public ApplicationID: number = 0;

  @Output() IsPriorityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  studentDetailsModel = new StudentDetailsModel();
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  constructor(
    private loaderService: LoaderService, 
    private commonservice: CommonFunctionService, 
    public appsettingConfig: AppsettingService,
    private studentService: StudentService, 
    private modalService: NgbModal, 
    private toastrService: ToastrService, 
    private sMSMailService: SMSMailService, 
    private cookieService: CookieService, 
    private formBuilder: FormBuilder,
    private itiCollegeAdmissionService: ITICollegeAdmissionService, 
    private route: Router, 
    private commonFunctionService: CommonFunctionService,
    private encryptionService: EncryptionService,
  ) { }

  //private interval: any; // Holds the interval reference


  async ngOnInit() {
    this.searchssoform = this.formBuilder.group({
      txtApplicationNo: ['', Validators.required],
      txtMobileNo: ['', Validators.required],
      DOB: ['', Validators.required],
      //ddlDepartment: ['', [DropdownValidators]]
    })

    this.RequestFormGroup = this.formBuilder.group({
      ddlTradeLevelId: ['', [DropdownValidators]],
      ddlTradeId: ['', [DropdownValidators]],
    })

    this.RequestFormGroupBter = this.formBuilder.group({
      BranchID: ['', [DropdownValidators]]
    })
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

  }
  get _searchssoform() { return this.searchssoform.controls; }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }
  get _RequestFormGroupBter() { return this.RequestFormGroupBter.controls; }


  



  async onSearchClick() {
    /*if (this.ApplicationNo.length > 0) {*/
    await this.GetAllDataActionWise();
    //}
    //else
    //{
    //  this.toastrService.warning('Please Enter Application No')
    //}
  }
 
 
  async GetAllDataActionWise() {

    this.isShowGrid = true;
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      await this.itiCollegeAdmissionService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("this.StudentDetailsModelList", data.Data)
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
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


  async SaveDirectAddmissionData() {
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    
    this.isSubmitted = true;
    if (this.RequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      console.log(this.request)
      await this.itiCollegeAdmissionService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastrService.success(this.Message)
            this.ResetControl();
            this.CloseModal();
            window.location.reload();
          }
          else {
            this.toastrService.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async SaveDirectAddmissionBterData() {
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.isSubmitted = true;
    if (this.RequestFormGroupBter.invalid) {
      this.toastrService.error("Form is invalid, cannot submit")
       return
    }

    if(this.request.BranchID == 0 || this.request.BranchID == null || this.request.BranchID == undefined){
      this.toastrService.error("Please Select Branch")
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    console.log("SaveBterData",this.request)
    try {
      await this.itiCollegeAdmissionService.SaveBterData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastrService.success(this.Message)
            this.ResetControl();
            this.CloseModal();
            this.isSubmitted = false
          }
          else {
            this.toastrService.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }



  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.itiCollegeAdmissionService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("this.request at gertbyid", data.Data)
          this.request.TradeId = data['Data']["TradeId"];
          this.request.TradeLevel = data['Data']["TradeLevel"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          



          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
          //this.GetTradeListDDL();

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



  CloseModal() {
    this.TradeList = [];
    this.modalService.dismissAll();
    this.modalReference?.close();
  }
 
  @ViewChild('content') content: ElementRef | any;


  async openModal(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  onModalAdmission(content: any, request: any) {
    this.request = request

    // this.GetByID(request.ApplicationID)

    // this.isSubmitted = false
    // this.request = request;
    // console.log('Request:', this.request);
    // this.selectedApplicationID = request?.EnrollmentNo ?? 0;

    // if (this.selectedApplicationID > 0) {
    //   this.GetByID(this.selectedApplicationID);
    // }
    this.modalReference = this.modalService.open(content, { size: 'sm', backdrop: 'static' });
  }

  onModalAdmissionBTER(content: any, request: any) {
    this.request = request
    // this.isSubmitted = false
    // this.request = request;
    // console.log('Request:', this.request);
    // this.selectedApplicationID = request?.EnrollmentNo ?? 0;
    this.GetStreamMasterInstituteWise();
    this.modalReference = this.modalService.open(content, { size: 'sm', backdrop: 'static' });
  }


  async GetStreamMasterInstituteWise() {

    try {
      this.loaderService.requestStarted();
      this.streamSearchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      
      if(this.sSOLoginDataModel.Eng_NonEng !== EnumCourseType.Non_Engineering) {
        this.streamSearchRequest.StreamType = EnumCourseType.Engineering
      } else {
        this.streamSearchRequest.StreamType = EnumCourseType.Non_Engineering
      }
      await this.commonFunctionService.StreamDDL_InstituteWise(this.streamSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BranchName = data['Data'];
          console.log("BranchName", this.BranchName)
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


  async GetTradeListDDL() {
    try {
      this.tradeSearchRequest.TradeLevel = this.request.TradeLevel
      this.tradeSearchRequest.CollegeID = this.sSOLoginDataModel.InstituteID  

      this.tradeSearchRequest.action = '_getDatabyCollege'
      this.loaderService.requestStarted();
      await this.commonservice.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeList = data.Data
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.isShowGrid = false;
    this.StudentDetailsModelList = [];
    this.studentDetailsModel = new StudentDetailsModel();
    this.searchRequest = new StudentSearchModel();
    this.request = new ITICollegeAdmissionDataModels();
    this.streamSearchRequest = new StreamDDL_InstituteWiseModel();
    this.RequestFormGroup.reset();
    this.RequestFormGroupBter.reset();
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

  async Redirect(key:number) {
    if (key == EnumDepartment.BTER) {
      this.CloseModal()
      await this.route.navigate(['/StudentJanAadharDetail'], 
        { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.BTER), isDirectAdmission: this.encryptionService.encryptData(true) } }
      );
    } else if (key == EnumDepartment.ITI) {
      this.CloseModal()
      await this.route.navigate(['/StudentJanAadharDetail'], 
        { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.ITI), isDirectAdmission: this.encryptionService.encryptData(true) } }
      );
    } else if (key == 4) {
      this.CloseModal()
      this.route.navigate(['/StudentJanAadharDetail'], 
        { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.ITI), isJailAdmission: this.encryptionService.encryptData(true) } });
      
    }
  }
}
