import { Component } from '@angular/core';
import { HrMasterDataModel } from '../../../Models/HrMasterDataModel';
import { ScholarshipModel, ScholarshipOnBoardModel } from '../../../Models/ScholarshipDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { HrMasterService } from '../../../Services/HrMaster/hr-master.service';
import { ScholarshipService } from '../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { StreamDDL_InstituteWiseModel } from '../../../Models/CommonMasterDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
@Component({
  selector: 'app-scholarship-onboard',
  standalone: false,
  templateUrl: './scholarship-onboard.component.html',
  styleUrl: './scholarship-onboard.component.css'
})
export class ScholarshipOnboardComponent {
  public ScholarshipID: number = 0;
  public SemesterMasterList: any[] = [];
  public BranchList: any[] = [];
  public CategoryList: any[] = [];


  public request = new ScholarshipOnBoardModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ScholarshipFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public streamsearchmodel = new StreamDDL_InstituteWiseModel()
  public InstituteID: number = 0
  constructor(private commonMasterService: CommonFunctionService, private ScholarshipService: ScholarshipService, private toastr: ToastrService,
    private loaderService: LoaderService, private formBuilder: FormBuilder, public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private sweetAlert2: SweetAlert2) {

  }

  async ngOnInit() {


    // form group
    this.ScholarshipFormGroup = this.formBuilder.group(
      {
        NODALOFFICERNAME: ['', Validators.required],
        NODALOFFICEREMAIL: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
        NODALOFFICERMOBILE: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],
        NODALOFFICERAADHAAR: ['', [Validators.required, Validators.pattern(GlobalConstants.AadhaarPattern)]],
        NODALOFFICERAADHAAR_REFNO: ['', Validators.required],

        DESIGNATION1: ['', Validators.required],
        NAME1: ['', Validators.required],
        EMAILADDRESS1: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
        MOBILENUMBER1: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],

        DESIGNATION2: ['', Validators.required],
        NAME2: ['', Validators.required],
        EMAILADDRESS2: ['', [Validators.required, Validators.pattern(GlobalConstants.EmailPattern)]],
        MOBILENUMBER2: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]]

      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ScholarshipID = this.sSOLoginDataModel.InstituteID
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    await this.GetSemesterMatserDDL();
    await this.GetCategoryMatserDDL()
    await this.GetStreamMatserDDL()


 
      await this.GetById();

    
  }
  get _ScholarshipFormGroup() { return this.ScholarshipFormGroup.controls; }

  checkValue(event: any) {
    const value = event.target.value;
    if (value <= 0) {
      event.target.value = '';
    }
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async Back() {
    this.routers.navigate(['/SchlorshipList'])
  }


  // get semestar ddl
  async GetSemesterMatserDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
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
  async GetStreamMatserDDL() {
    try {
      this.streamsearchmodel.InstituteID = this.sSOLoginDataModel.InstituteID
      this.streamsearchmodel.StreamType = this.sSOLoginDataModel.Eng_NonEng

      this.loaderService.requestStarted();
      await this.commonMasterService.StreamDDLInstituteIdWise(this.streamsearchmodel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BranchList = data['Data'];
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

  async GetCategoryMatserDDL() {
    try {
      this.streamsearchmodel.InstituteID = this.sSOLoginDataModel.DepartmentID

      this.loaderService.requestStarted();
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryList = data['Data'];
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


  // get detail by id
  async GetById() {
    try {
    
      this.loaderService.requestStarted();
      await this.ScholarshipService.GetByIdOnBoard(this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];
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

  // get detail by id
  async SaveData() {

    try {

      this.isSubmitted = true;

      if (this.ScholarshipFormGroup.invalid) {
        return;
      }

      this.sweetAlert2.Confirmation(
        'Are you sure you want to submit this Scholarship Onboarding form?\n\nOnce submitted, it cannot be edited again.',
        async (result: any) => {

          if (result.isConfirmed) {

            this.isLoading = true;
            this.loaderService.requestStarted();

            this.request.SSOID = this.sSOLoginDataModel.SSOID;

            // Save Data
            await this.ScholarshipService.SaveDataOnBoard(this.request)
              .then((data: any) => {

                data = JSON.parse(JSON.stringify(data));

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {

                  this.toastr.success(
                    'Scholarship onboarding submitted successfully.'
                  );

                  this.ResetControls();

                  this.routers.navigate(['/dashboard']);

                }
                else {

                  this.toastr.error(this.ErrorMessage);

                }

              }, (error: any) => console.error(error));

            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);

          }

        });

    }
    catch (ex) {

      console.log(ex);

      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);

    }
  }

  // reset

    ResetControls() {

      this.isSubmitted = false;

      this.request.NODALOFFICERNAME = '';
      this.request.NODALOFFICEREMAIL = '';
      this.request.NODALOFFICERMOBILE = '';
      this.request.NODALOFFICERAADHAAR = '';
      this.request.NODALOFFICERAADHAAR_REFNO = '';

      this.request.DESIGNATION1 = '';
      this.request.NAME1 = '';
      this.request.EMAILADDRESS1 = '';
      this.request.MOBILENUMBER1 = '';

      this.request.DESIGNATION2 = '';
      this.request.NAME2 = '';
      this.request.EMAILADDRESS2 = '';
      this.request.MOBILENUMBER2 = '';

      this.ScholarshipFormGroup.reset();

    
    //this.multiSelect.toggleSelectAll();
  }

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }



}
