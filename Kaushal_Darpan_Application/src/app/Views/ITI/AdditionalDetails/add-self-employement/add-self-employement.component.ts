import { Component, OnInit } from '@angular/core';
import { CompanyMasterDataModels, CompanyMasterSearchByIdModel, CompanyMasterSearchModel, StudentEmploymentDetailsModel } from '../../../../Models/CompanyMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../../../Services/CompanyMaster/company-master.service.ts';
import {StudentdetailUpdateService} from '../../../../Services/StudentDetailUpdate/studentdetail-update.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel } from '../../../../Models/CommonMasterDataModel';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HrMasterDataModel } from '../../../../Models/HrMasterDataModel';

@Component({
    selector: 'add-self-employement',
    templateUrl: './add-self-employement.component.html',
    styleUrls: ['./add-self-employement.component.css'],
    standalone: false
})
export class AddStudentEmployementComponent implements OnInit {

  public ID: number = 0;
  //public request = new CompanyMasterDataModels();
  public request = new StudentEmploymentDetailsModel();
  public personRequest = new HrMasterDataModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isEmployementFormSubmitted:boolean=false;
  public isCompanyTypeSelected:boolean=false;
  public isExperienceSelected: boolean = false;
  public MinAge:number=0;
  public MaxAge:number=0;
  public calculatedAge:string='';
  public minDate: string = '';
  public maxDate: string = '';

  public State: number = 0;
  public key: number = 0;
   public flag: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public EmployementDetailFormGroup!: FormGroup;
  public HrMasterFormGroup!: FormGroup;

   public searchRequest = new StudentEmploymentDetailsModel();
   public _EnumRole = EnumRole;
    

  public sSOLoginDataModel = new SSOLoginDataModel();
  public DistrictMasterList: IDistrictMaster_StateIDWiseDataModel[] = []
  public StateMasterList: IStateMasterDataModel[] = []
  public CompanyTypeList: any = []
  public StreamMasterList: any = []
  public StudEmployementList: StudentEmploymentDetailsModel[] = [];

  public ListEmployementDetails:StudentEmploymentDetailsModel[]=[];

  constructor(private commonMasterService: CommonFunctionService, private CompanyMasterService: CompanyMasterService, private StudentdetailUpdateService:StudentdetailUpdateService,
    private toaster: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, public appsettingConfig: AppsettingService, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {


    // form group
    this.EmployementDetailFormGroup = this.formBuilder.group(
      {

        EnrollmentNo: [''],
        ddlCompanyType: ['',Validators.required],    // self / firm
        CompanyName: ['', Validators.required],

        ddlStateID: ['', [DropdownValidators]],          // dropdown validation
        ddlDistrictID: ['', [DropdownValidators]],
        CompanyAddress: ['', Validators.required],

        ddlJobType: ['', Validators.required],          // fulltime / parttime
        ddlExperience: ['',Validators.required],      // current / past

        WorkingFromDate: ['', Validators.required],
        WorkingToDate: [''],

        ddlSalaryType: ['',Validators.required],      // stipend / ctc / salary
        SalaryAmount: ['', Validators.required],

        StudentName: [{ value: '', disabled: true }],
        StudFatherName: [{ value: '', disabled: true }],
        DOB:[{value:'',disabled:true}],
        Email:[{value:'',disabled:true}],
        AadharNo:[{value:'',disabled:true}],
        TradeID:['0',Validators.required]

      });

    this.HrMasterFormGroup=this.formBuilder.group(
    {
        Name: ['', Validators.required],
        EmailId: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
        MobileNo: ['', Validators.required],
    })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('ID')?.toString());
    // this.flag=Number(this.activatedRoute.snapshot.queryParamMap.get('flag')?.toString());

    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    await this.GetMaterData()
    await this.loadDropdownData('CompanyType')
    //edit
    if (this.ID > 0) {
      this.searchRequest.AID = this.ID;
      await this.GetStudentEmployementData();
      if (this.request.EnrollmentNo) {
        await this.getStudBasicDetails(this.request.EnrollmentNo);
      }
      
    }
  }
  get _EmployementDetailFormGroup() { return this.EmployementDetailFormGroup.controls; }
  // get _HrMasterFormGroup(){return this.HrMasterFormGroup.controls;}




  async loadDropdownData(MasterCode: string) {
    await this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'CompanyType':
          this.CompanyTypeList = data['Data'];
          console.log(this.CompanyTypeList)
          break;
        default:
          break;
      }
    });

    await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterList = data['Data'];
      }, error => console.error(error));
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }


  async getStudBasicDetails(EnrollmentNo:string){
    debugger;
    try {
      this.loaderService.requestStarted();
      this.request.StudentName='';
      this.request.StudFatherName='';
      this.request.DOB='';
      // this.request=new StudentEmploymentDetailsModel();
      await this.commonMasterService.getStudBasicDetailsEnrollmentWise(EnrollmentNo,this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.StudentName=data['Data'][0].StudentName;
          this.request.StudFatherName=data['Data'][0].FatherName;
          this.request.DOB=this.formatDate(data['Data'][0].DOB); 
          this.request.Email=data['Data'][0].Email;
          console.log(data['Data']);
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

  

  async GetMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StateMasterList = data['Data'];
          console.log(this.StateMasterList);
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

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async Back() {
    if (this.key == 1) {
      this.routers.navigate(['/student-employement-history'])
    }
    else{
      this.routers.navigate(['/student-employement-history'])
    }
  }
  GotoCommonSubject(): void {
    this.routers.navigate(['/commonsubjects']);
  }

  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.request.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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

  


  // get detail by id
  // async GetById() {
  //   debugger
  //   try {

  //     this.loaderService.requestStarted();

  //     await this.CompanyMasterService.GetById(this.searchReq)

  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         console.log(data,"company");

  //         this.request = data['Data'];
  //        // this.request.Dis_CompanyName = data['Data']['Dis_CompanyName'];
  //        // this.request.CompanyPhoto = data['Data']['CompanyPhoto'];
  //         this.ddlState_Change();
  //         this.request.DistrictID = data['Data']["DistrictID"];
  //         console.log(this.request, "request");


  //       }, (error: any) => console.error(error)
  //       );
  //   }
  //   catch (ex) {
  //     console.log(ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // } 

  formatDateToInput(date: string): string {
    if(!date) return "";
    return date.split('T')[0];
  }

    async GetStudentEmployementData() {
      debugger
    try {
      // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.isCompanyTypeSelected=true
        this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.searchRequest.Action="GetAllDataBy_StudID";
      this.loaderService.requestStarted();
      await this.StudentdetailUpdateService.GetStudentEmployementData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("Employement data",data);
        this.request = data.Data[0];

        this.request.WorkingFromDate=this.formatDateToInput(this.request.WorkingFromDate);
        this.request.WorkingToDate=this.formatDateToInput(this.request.WorkingToDate);

       

        this.ddlState_Change();
        this.request.DistrictID=data.Data[0].DistrictID;

        // this.StudEmployementList = data.Data;
        // console.log(this.StudEmployementList)
      }, (error: any) => console.error(error))
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

  getInvalidControls(formGroup: FormGroup) {
  const invalid = [];
  const controls = formGroup.controls;

  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }

  return invalid;
}

  
  

  async AddMore() {
      debugger
      this.isEmployementFormSubmitted = true;

        // Add a condition to add a required validator for EnrollmentNo based on RoleID
        if (this._EnumRole.Student != this.sSOLoginDataModel.RoleID) {
          // If the role is not 'Student', make EnrollmentNo required
          this.EmployementDetailFormGroup.get('EnrollmentNo')?.setValidators([Validators.required]);
        } else {
          // If the role is 'Student', make EnrollmentNo optional
          this.EmployementDetailFormGroup.get('EnrollmentNo')?.clearValidators();
        }

            // Revalidate the form control after changing validators
        this.EmployementDetailFormGroup.get('EnrollmentNo')?.updateValueAndValidity();

      // const gett= this._EmployementDetailFormGroup.ddlCompanyType.errors?.required
      if(this.EmployementDetailFormGroup.invalid) {
        this.toaster.error("Please fill all the required fields of Employement Form");
         const invalidFields = this.getInvalidControls(this.EmployementDetailFormGroup);
        console.log("Invalid Fields:", invalidFields);
      
        // alert("jahsjahjas")
        return;
      }

      if(this.request.WorkingToDate=="" || this.request.WorkingToDate==null){
        const today = new Date();
        this.request.WorkingToDate=today.toISOString().split('T')[0];
      }
      
      if(this.request.WorkingToDate<this.request.WorkingFromDate ){
        this.toaster.error("Working To Date should be greater than Working From Date");
        return;
      }
  
      const personExists = this.ListEmployementDetails.some(person =>
        // person.EmailId === this.request.EmailId && person.MobileNo === this.personRequest.MobileNo
         person.CompanyName===this.request.CompanyName  &&
         person.CompanyType===this.request.CompanyType &&
         person.StateID===this.request.StateID &&
         person.DistrictID===this.request.DistrictID &&
         person.WorkingFromDate=== this.request.WorkingFromDate &&
         person.WorkingToDate===this.request.WorkingToDate &&
         person.SalaryAmount===this.request.SalaryAmount
      );
  
      if (!personExists) {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;

        if(this._EnumRole.Student== this.sSOLoginDataModel.RoleID){
          this.request.StudentID = this.sSOLoginDataModel.StudentID;
        }
        this.request.InstituteID=this.sSOLoginDataModel.InstituteID;

        this.ListEmployementDetails.push(this.request);
        this.request = new StudentEmploymentDetailsModel();
        this.isEmployementFormSubmitted = false;
      } else {
        this.toaster.error("Person already exists with the same fields.");
        return
      }
    
    }
  

  async resetFormDetails() {
    debugger
    this.request = new StudentEmploymentDetailsModel();
  }

  // get detail by id
  async SaveEmployementData() {
    debugger
    try {
      this.isSubmitted = true;
     
      if(this.ListEmployementDetails.length<=0){
        this.toaster.error("Please add at least one Employement details");
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      let obj = {
        ListEmployementDetails: this.ListEmployementDetails
      }
      

      
      await this.StudentdetailUpdateService.SaveEmployementData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toaster.success(this.Message)
            this.ResetControls();
             this.Back();
            // this.routers.navigate(['/CompanyMaster']);
          }
          else {
            this.toaster.error(this.ErrorMessage)
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

  public file!: File;
  // async onFilechange(event: any, Type: string) {
  //   try {

  //     this.file = event.target.files[0];
  //     if (this.file) {
  //       if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png') {
  //         //size validation
  //         if (this.file.size > 2000000) {
  //           this.toastr.error('Select less then 2MB File')
  //           return
  //         }
  //         //if (this.file.size < 100000) {
  //         //  this.toastr.error('Select more then 100kb File')
  //         //  return
  //         //}
  //       }
  //       else {// type validation
  //         this.toastr.error('Select Only jpeg/jpg/png file')
  //         return
  //       }
  //       // upload to server folder
  //       this.loaderService.requestStarted();

  //       await this.commonMasterService.UploadDocument(this.file)
  //         .then((data: any) => {
  //           data = JSON.parse(JSON.stringify(data));

  //           this.State = data['State'];
  //           this.Message = data['Message'];
  //           this.ErrorMessage = data['ErrorMessage'];

  //           if (this.State == EnumStatus.Success) {
  //             if (Type == "Photo") {
  //               this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
  //               this.request.CompanyPhoto = data['Data'][0]["FileName"];

  //             }
  //             //else if (Type == "Sign") {
  //             //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
  //             //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
  //             //}
  //             /*              item.FilePath = data['Data'][0]["FilePath"];*/
  //             event.target.value = null;
  //           }
  //           if (this.State == EnumStatus.Error) {
  //             this.toastr.error(this.ErrorMessage)
  //           }
  //           else if (this.State == EnumStatus.Warning) {
  //             this.toastr.warning(this.ErrorMessage)
  //           }
  //         });
  //     }
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     /*setTimeout(() => {*/
  //     this.loaderService.requestEnded();
  //     /*  }, 200);*/
  //   }
  // }

  // async DeleteImage(FileName: any, Type: string) {
  //   try {
  //     // delete from server folder
  //     this.loaderService.requestEnded();
  //     await this.commonMasterService.DeleteDocument(FileName).then((data: any) => {
  //       this.State = data['State'];
  //       this.Message = data['Message'];
  //       this.ErrorMessage = data['ErrorMessage'];
  //       if (this.State == 0) {
  //         if (Type == "Photo") {
  //           this.request.Dis_CompanyName = '';
  //           this.request.CompanyPhoto = '';
  //         }
  //         //else if (Type == "Sign") {
  //         //  this.requestStudent.Dis_StudentSign = '';
  //         //  this.requestStudent.StudentSign = '';
  //         //}
  //         this.toastr.success(this.Message)
  //       }
  //       if (this.State == 1) {
  //         this.toastr.error(this.ErrorMessage)
  //       }
  //       else if (this.State == 2) {
  //         this.toastr.warning(this.ErrorMessage)
  //       }
  //     });
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  // reset
 
 
  ResetControls() {
    this.request = new StudentEmploymentDetailsModel();

    this.ListEmployementDetails=[];
    //this.multiSelect.toggleSelectAll();
  }

  async Delete_EmpDetails(idx:number){
    try{
      this.ListEmployementDetails.splice(idx,1);
    }
    catch(error){
      console.log(error);
    }
  }


  async OnCompanyChange(){
    try{
      this.isCompanyTypeSelected = true;
    }
    catch(error){
      console.log(error);
    }
  }

  async OnExperienceChange(){
    try{
      this.isExperienceSelected = true;
    }
    catch(error){
      console.log(error);
    }
  }

    onAgeRangeChange() {
    debugger;
    this.MinAge=0
    const fromDateStr = this.request.WorkingFromDate;
    const toDateStr = this.request.WorkingToDate;
    console.log('fromDateStr:', fromDateStr, 'toDateStr:', toDateStr); // Debug

    const today = new Date();

    let minAge = 0;
    let maxAge = 0;

    if (fromDateStr) {
      const fromDate = new Date(fromDateStr);

      if (!isNaN(fromDate.getTime())) {
        minAge = today.getFullYear() - fromDate.getFullYear();
        const monthDiff = today.getMonth() - fromDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fromDate.getDate())) {
          minAge--;
        }

        minAge = Math.max(minAge, 0);
      } else {
        console.error('Invalid fromDate!');
      }
    }

    if (toDateStr) {
      const toDate = new Date(toDateStr);

      if (!isNaN(toDate.getTime())) {
        maxAge = today.getFullYear() - toDate.getFullYear();
        const monthDiff = today.getMonth() - toDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < toDate.getDate())) {
          maxAge--;
        }

        maxAge = Math.max(maxAge, 0);
      } else {
        console.error('Invalid toDate!');
      }
    }

    //// ✅ Correct Validation: From Age should not be GREATER than To Age
    //if (fromDateStr && toDateStr) {
    //  const fromDate = new Date(fromDateStr);
    //  const toDate = new Date(toDateStr);

    //  if (fromDate > toDate) { // 🔥 Corrected here
    //    this.toastr.warning('Error: "From Age" cannot be greater than "To Age"!');
    //    this.calculatedAge = '';
    //    return;
    //  }
    //}

    // Now you have minAge and maxAge!
    if (minAge === 0 && maxAge === 0) {
      // alert('Warning: Both minimum and maximum ages are zero!');
      this.calculatedAge = '';
    } else {
      this.calculatedAge = `${maxAge}y to ${minAge}y`;
      this.MinAge = maxAge
      this.MaxAge = minAge
    }

    console.log('Calculated Age Range:', this.calculatedAge);

    // Optional
    this.minDate = fromDateStr;


  }


}
