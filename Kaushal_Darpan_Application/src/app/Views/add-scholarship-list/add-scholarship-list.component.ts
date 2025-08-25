import { Component } from '@angular/core';
import { HrMasterDataModel } from '../../Models/HrMasterDataModel';
import { ScholarshipModel } from '../../Models/ScholarshipDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { HrMasterService } from '../../Services/HrMaster/hr-master.service';
import { ScholarshipService } from '../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { StreamDDL_InstituteWiseModel } from '../../Models/CommonMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Component({
  selector: 'app-add-scholarship-list',
  standalone: false,
  templateUrl: './add-scholarship-list.component.html',
  styleUrl: './add-scholarship-list.component.css'
})
export class AddScholarshipListComponent {

  public ScholarshipID: number = 0;
  public SemesterMasterList: any[] = [];
  public BranchList: any[] = [];
  public CategoryList: any[] = [];


  public request = new ScholarshipModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ScholarshipFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public streamsearchmodel = new StreamDDL_InstituteWiseModel()

  constructor(private commonMasterService: CommonFunctionService, private ScholarshipService: ScholarshipService, private toastr: ToastrService,
    private loaderService: LoaderService, private formBuilder: FormBuilder, public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {


    // form group
    this.ScholarshipFormGroup = this.formBuilder.group(
      {
        txtToatlstudent: ['', Validators.required],

        txtAmount: ['', Validators.required],
        StreamID: ['', [DropdownValidators]],
        SemesterID: ['', [DropdownValidators]],
        CategoryID: ['', [DropdownValidators]],

      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ScholarshipID = Number(this.activatedRoute.snapshot.queryParamMap.get('ScholarshipID')?.toString());
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    await this.GetSemesterMatserDDL();
    await this.GetCategoryMatserDDL()
    await this.GetStreamMatserDDL()


    if (this.ScholarshipID > 0) {
      await this.GetById();
     
    }
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
      await this.ScholarshipService.GetById(this.ScholarshipID)
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
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;


      //save
      await this.ScholarshipService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.routers.navigate(['/SchlorshipList']);
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

  // reset
  ResetControls() {

    this.request.StreamID = 0
    this.request.SemesterID = 0
    this.request.Amount = null
    this.request.TotalStudent = null
    this.request.Category = 0 
    //this.multiSelect.toggleSelectAll();
  }

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }
 
  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {
        
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_DocName = data['Data'][0]["Dis_FileName"];
                this.request.Document = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
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
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }




}
