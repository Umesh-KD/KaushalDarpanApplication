import { Component, OnInit } from '@angular/core';
import { CompanyMasterDataModels } from '../../Models/CompanyMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel } from '../../Models/CommonMasterDataModel';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { CounsellingAllotmentListModel, CounsellingEditImportedCandidateListModel } from '../../Models/CounsellingMasterModel';
import { CounsellingImportCandidateListService } from '../../Services/CounsellingImportCandidateList/CounsellingImportCandidateList.service';
import { ITIStudentCorrectionMasterSearchModel } from '../../Models/StudentMasterModels';
import { ItiDataMasterService } from '../../Services/ITI/ITIDataMaster/iti-datamaster.service';

@Component({
    selector: 'edit-student-correction-master',
    templateUrl: './edit-student-correction-master.component.html',
    styleUrls: ['./edit-student-correction-master.component.css'],
    standalone: false
})
export class EditStudentCorrectionMasterComponent implements OnInit {

  public CandidateID: number = 0;
  public request =new ITIStudentCorrectionMasterSearchModel();
 
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public CandidateFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public DistrictMasterList: IDistrictMaster_StateIDWiseDataModel[] = []
  public StateMasterList: IStateMasterDataModel[] = []
  public CompanyTypeList: any = [];
  public CandidateData:any=[];

  constructor(private commonMasterService: CommonFunctionService, private CompanyMasterService: CompanyMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, public appsettingConfig: AppsettingService, private routers: Router, private modalService: NgbModal,
  private counsellingImportCandidateListService:CounsellingImportCandidateListService,
    private ItiDataMasterService:ItiDataMasterService
) 
    {}

  async ngOnInit() {


    // form group
    this.CandidateFormGroup = this.formBuilder.group(
      {
        Name: ['', Validators.required],
        CandidateFatherName: ['', Validators.required],
        // Address: ['', Validators.required],
        Email: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
        MobileNo: ['', [
          Validators.required,  
          Validators.pattern('^[0-9]*$'),  // only digits
          Validators.minLength(10),        // min 10 digits
          Validators.maxLength(10) ]],        // max 10 digits]],
          CandidateMotherName:[''],
          CandidateGender:['',DropdownValidators],
          UIDNumber:['',Validators.required]
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
    debugger
    if (this.CandidateID > 0) {
      await this.GetById(this.CandidateID);
    }
    if(this.key==3){
      this.CandidateFormGroup.disable();
    }
  }
  get _CandidateFormGroup() { return this.CandidateFormGroup.controls; }





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
            this.CandidateFormGroup.patchValue({
              CandidateName: data.Data[0].CandidateName,
              CandidateFatherName: data.Data[0].CandidateFatherName,
              // Address: data.Data.CandidateName,
              Email: data.Data[0].Email,
              MobileNo: data.Data[0].MobileNo,
              SSOID: data.Data[0].SSOID,
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

   SaveData(): void {
      debugger
      this.isSubmitted = true;
      if(this.CandidateFormGroup.get('SSOID')?.value=='' || this.CandidateFormGroup.get('SSOID')?.value==null){
        this.CandidateFormGroup.get('SSOID')?.setValue('NA');
      }
      if(this.CandidateFormGroup.invalid){
        return;
      }
      this.request.DepartmentID=this.sSOLoginDataModel.DepartmentID;
      // this.request.RoleID=this.sSOLoginDataModel.RoleID;
      this.request.ModifyBy=this.sSOLoginDataModel.UserID;
      // let obj=JSON.parse(this.request);
      let jsonArray=[this.request];
        console.log(this.request,"request data");
        this.counsellingImportCandidateListService.SaveImportExcelData(jsonArray).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.isSubmitted = false;
            // this.CandidateData = [];
            //  this.GetCandidateList(1);
          }
          else{
            this.toastr.error(data.Data[0].ErrorMessage);
          }
        });
    }

  // reset
  ResetControls() {
    this.request = new ITIStudentCorrectionMasterSearchModel();

    //this.multiSelect.toggleSelectAll();
  }


}
