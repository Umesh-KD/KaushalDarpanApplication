import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyMasterDataModels } from '../../Models/CompanyMasterDataModel';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators, DropdownValidatorsString } from '../../Services/CustomValidators/custom-validators.service';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel } from '../../Models/CommonMasterDataModel';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { CounsellingAllotmentListModel, CounsellingEditImportedCandidateListModel } from '../../Models/CounsellingMasterModel';
import { CounsellingImportCandidateListService } from '../../Services/CounsellingImportCandidateList/CounsellingImportCandidateList.service';
import { ITIStudentCorrectionMasterSearchModel } from '../../Models/StudentMasterModels';
import { ItiDataMasterService } from '../../Services/ITI/ITIDataMaster/iti-datamaster.service';
import { OTPModalComponent } from '../otpmodal/otpmodal.component';
import { DateConfigurationModel } from '../../Models/DateConfigurationDataModels';
import { DateConfigService } from '../../Services/DateConfiguration/date-configuration.service';

@Component({
    selector: 'edit-student-correction-master',
    templateUrl: './edit-student-correction-master.component.html',
    styleUrls: ['./edit-student-correction-master.component.css'],
    standalone: false
})
export class EditStudentCorrectionMasterComponent implements OnInit {

    @ViewChild('otpModal') childComponent!: OTPModalComponent;
  
  public CandidateID: number = 0;
  public request =new ITIStudentCorrectionMasterSearchModel();
 
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  dateConfiguration = new DateConfigurationModel();
  public State: number = 0;
  public AdmissionDateList: any = []
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public CandidateFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public DistrictMasterList: IDistrictMaster_StateIDWiseDataModel[] = []
  public StateMasterList: IStateMasterDataModel[] = []
  public CompanyTypeList: any = [];
  public CandidateData:any=[];
  public GenderList: any = [];
  public FromDate: string = ''

  constructor(private commonMasterService: CommonFunctionService, private CompanyMasterService: CompanyMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, public appsettingConfig: AppsettingService, private routers: Router, private modalService: NgbModal,
  private counsellingImportCandidateListService:CounsellingImportCandidateListService,
    private ItiDataMasterService: ItiDataMasterService,
    private dateMasterService: DateConfigService,

) 
    {}

  async ngOnInit() {


    // form group
    this.CandidateFormGroup = this.formBuilder.group(
      {
        Name: [{ value: '', disabled: true }, Validators.required],
        CandidateFatherName: [{value:'',disabled:true},Validators.required],
        // Address: ['', Validators.required],
        Email: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
        MobileNo: ['', [
          Validators.required,  
          Validators.pattern('^[0-9]*$'),  // only digits
          Validators.minLength(10),        // min 10 digits
          Validators.maxLength(10) ]],        // max 10 digits]],
          CandidateMotherName:[{value:'',disabled:true}],
        CandidateGender: [{ value: 0 }, [DropdownValidatorsString]],
        txtDOB: ['', [Validators.required, this.minimumAgeValidator(14)]],

          
          UIDNumber:[{value:'',disabled:true},Validators.required]
      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CandidateID = Number(this.activatedRoute.snapshot.queryParamMap.get('ID')?.toString());
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    // this.request.RoleID = this.sSOLoginDataModel.RoleID;
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    // await this.GetMaterData()
    // await this.loadDropdownData('CompanyType')
    //edit
    // console.log(this.request.Gender,"gender")
    debugger
    this.loadDropdownData('Gender');
    await this.GetDateDataList()
    if (this.CandidateID > 0) {
      await this.GetById(this.CandidateID);
    }
    if(this.key==3){
      this.CandidateFormGroup.disable();
    }

    // this.loadDropdownData('Gender');

  }
  get _CandidateFormGroup() { return this.CandidateFormGroup.controls; }

  minimumAgeValidator(minYears: number) {
    return (control: AbstractControl) => {
      if (!control.value) return null;
      debugger
      const inputDate = new Date(control.value);
      const baseDate = new Date(this.FromDate); // reference date (e.g., admission date)

      // Normalize both dates to remove time part (set to 00:00:00)
      const dob = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
      const minAllowedDOB = new Date(
        baseDate.getFullYear() - minYears,
        baseDate.getMonth(),
        baseDate.getDate()
      );

      if (dob.getTime() > minAllowedDOB.getTime()) {
        return { invalidAge: true }; // Too young
      }

      return null;
    };
  }


  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async Back() {
    if (this.key == 1) {
      this.routers.navigate(['/StudentCorrectionMaster'])
    }
 
    else{
       this.routers.navigate(['/StudentCorrectionMaster'])
    }
  }



  // get detail by id
  async GetById(candidateID: number = 0) {
    debugger
    try {
   
      this.loaderService.requestStarted();
      this.request.CandidateID = candidateID;
      this.request.action="_GetStudentCorrectionDataByID"
      
      await this.ItiDataMasterService.GetStudentCorrectionDataByID(this.request)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data,"Candidate data");
          this.CandidateData=data.Data;
          if(data && data.Data){
            this.request.StateRegNumber = data.Data[0].StateRegNumber
            debugger
           
            this.CandidateFormGroup.patchValue({
              Name: data.Data[0].Name,
              CandidateFatherName: data.Data[0].FatherGuardianName,
              // Address: data.Data.CandidateName,
              Email: data.Data[0].EmailID,
              MobileNo: data.Data[0].MobileNumber,
              CandidateMotherName: data.Data[0].MotherName,
              CandidateGender: data.Data[0].Gender,
              UIDNumber: data.Data[0].UIDNumber,
              txtDOB: data.Data[0].DateOfBirth
  
            })
          }
          console.log(this.CandidateFormGroup.value, " check data");

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

   async SaveData() {

    try{
      
      debugger
      this.isSubmitted = true;
      // if(this.CandidateFormGroup.get('SSOID')?.value=='' || this.CandidateFormGroup.get('SSOID')?.value==null){
      //   this.CandidateFormGroup.get('SSOID')?.setValue('NA');
      // }
      
      if(this.CandidateFormGroup.invalid){
        return;
      }
      // this.childComponent.MobileNo = '8334874706'
      this.childComponent.MobileNo= this.CandidateFormGroup.get('MobileNo')?.value;
      this.childComponent.OpenOTPPopup();
      this.request.DepartmentID=this.sSOLoginDataModel.DepartmentID;
      // this.request.RoleID=this.sSOLoginDataModel.RoleID;
      this.request.ModifyBy=this.sSOLoginDataModel.UserID;
      // let obj=JSON.parse(this.request);
      this.request.action="Update_studData"
      //save
        //  this.childComponent.onVerified.subscribe(() =>
      // { 
        this.childComponent.onVerified.subscribe(async ()=>{
          await this.ItiDataMasterService.SaveStudentCorrectionData(this.request)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              this.ResetControls();
              this.routers.navigate(['/StudentCorrectionMaster']);
             
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }

          }, (error: any) => console.error(error)
          );
        })
    

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


  // reset
  ResetControls() {
     this.request.MobileNo='';
      this.request.Email='';
    //this.multiSelect.toggleSelectAll();
  }


  async loadDropdownData(type: string) {     
    debugger     
   await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList)
        }, (error: any) => console.error(error)
        );
      }
  async GetDateDataList() {

    try {
      this.dateConfiguration.DepartmentID = 2;
      this.dateConfiguration.SSOID = this.sSOLoginDataModel.SSOID;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AdmissionDateList = data['Data'];
          const today = new Date();
 
          var activeCourseID: any = [];

       

      

            const admissionEntry = this.AdmissionDateList.find((e: any) => e.TypeID == 148);
            this.FromDate = admissionEntry ? admissionEntry.From_Date : null;
            console.log(this.FromDate, "from date")
          

         
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

}
