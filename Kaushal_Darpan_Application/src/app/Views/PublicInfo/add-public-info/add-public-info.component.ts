import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SeatIntakeDataModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumCourseType, EnumStatus, PublicAddType } from '../../../Common/GlobalConstants';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../Models/CommonMasterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { BTERSeatsDistributionsService } from '../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { BTERCollegeTradeSearchModel } from '../../../Models/BTER/BTERSeatIntakeDataModel';
import { BranchStreamTypeWiseSearchModel, BTERCollegeBranchModel } from '../../../Models/BTER/BTERSeatsDistributions';
import { PublicInfoDataModel } from '../../../Models/PublicInfoDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
    selector: 'app-public-info',
  templateUrl: './add-public-info.component.html',
  styleUrls: ['./add-public-info.component.css'],
    standalone: false
})
export class AddPublicInfoComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public PublicInfoFormGroup!: FormGroup;
  //public request = new SeatIntakeDataModel()
  public isSubmitted = false;
  public tradeSearchRequest = new ItiTradeSearchModel()
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ItiTradeListAll: any = [];
  public CollegesListAll: any = [];
  public BranchList: any = [];
  public ITIRemarkList: any = [];
  public SanctionedList: any = [];
  public FinancialYearList: any = [];
  public SeatIntakeID: number | null = null;
  public branchSearchRequest = new BranchStreamTypeWiseSearchModel()
  public BranchID: number = 0
  public request = new PublicInfoDataModel()
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public IsUpload: boolean = false;
  public LableText: string = '';
  public _PublicAddType = PublicAddType
  public _startl: string=''
  public _startf: string=''
  

  constructor(
    private commonFunctionService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private ItiSeatIntakeService: ItiSeatIntakeService,

    private SeatsDistributionsService: BTERSeatsDistributionsService,

    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    public appsettingConfig: AppsettingService,  

  ) { }

  async ngOnInit() {
    
    this.PublicInfoFormGroup = this.formBuilder.group(
      {
        PublicInfoType: ['', [DropdownValidators]],
        DescriptionEn: ['', Validators.required],
        DescriptionHi: ['', Validators.required],
        LinkUrl: ['', Validators.required]  ,   
        Upload: ['', Validators.required]     
      });

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng
    this.request.CreatedBy = this.SSOLoginDataModel.UserID;
    this.request.IPAddress = "";
    this.request.AcademicYearId = this.SSOLoginDataModel.FinancialYearID;
    this.request.DepartmentId = this.SSOLoginDataModel.DepartmentID;



    this.request.PublicInfoId = Number(this.routers.snapshot.queryParamMap.get('id')?.toString());

    if (this.request.PublicInfoId == null || this.routers.snapshot.queryParamMap.get('id')?.toString() == undefined) {
      this.request.PublicInfoId = 0;
    }
    if (this.request.PublicInfoId>0) {
      await this.GetPublicInfo()
    }
  }

  get _PublicInfoFormGroup() { return this.PublicInfoFormGroup.controls; }


  async GetPublicInfo() {
    try {
      this.loaderService.requestStarted();
      this.request.Actoin = "LIST";
      await this.commonFunctionService.PublicInfo(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        //this.CollegesListAll = data.Data
        //console.log(data, "ok");
        //alert(data.Data[0].PublicInfoTypeId);
        /* this.request.PublicInfoType = data.Data[0].PublicInfoType;*/
        //if (this.request.PublicInfoType == "Downloads") {

        //}


        this.request.PublicInfoType = data.Data[0].PublicInfoTypeId;
        this.request.DescriptionEn = data.Data[0].DescriptionEn;
        this.request.DescriptionHi = data.Data[0].DescriptionHi;
        this.request.LinkUrl = data.Data[0].LinkUrl;
        this.request.FileName = data.Data[0].FileName;
        this.request.Dis_FileName = data.Data[0].Dis_FileName;

        if (this._PublicAddType.Downloads == this.request.PublicInfoType) {
          this.LableText = 'Link/Url'
          this.IsUpload = true;
          this._startf = '*'
          this._startl = ''
          this.PublicInfoFormGroup.controls['LinkUrl'].clearValidators();
          this.PublicInfoFormGroup.controls['Upload'].setValidators(Validators.required);
        }

        if (this._PublicAddType.Highlights == this.request.PublicInfoType) {
          this.LableText = 'text'
          this.IsUpload = false;
          this._startf = ''
          this._startl = '*'
          this.PublicInfoFormGroup.controls['Upload'].clearValidators();
          this.PublicInfoFormGroup.controls['LinkUrl'].setValidators(Validators.required);
        }
        if (this._PublicAddType.Notes == this.request.PublicInfoType) {
          this.LableText = 'Url'
          this.IsUpload = false;
          this._startf = ''
          this._startl = ''
          this.PublicInfoFormGroup.controls['Upload'].clearValidators();
          this.PublicInfoFormGroup.controls['LinkUrl'].clearValidators();
        }

        this.PublicInfoFormGroup.controls['Upload'].updateValueAndValidity();
        this.PublicInfoFormGroup.controls['LinkUrl'].updateValueAndValidity();


      });   
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  
  async onSubmit() {
    this.isSubmitted = true;
    console.log(this.PublicInfoFormGroup.value)
    if(this.PublicInfoFormGroup.invalid) {
      this.toastr.error("invalid Form Data")
      //Object.keys(this.PublicInfoFormGroup.controls).forEach(key => {
      //  const control = this.PublicInfoFormGroup.get(key);

      //  if (control && control.invalid) {
      //    this.toastr.error(`Control ${key} is invalid`);
      //    Object.keys(control.errors!).forEach(errorKey => {
      //      this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //    });
      //  }
      //});
      return
    }
    try {
      this.loaderService.requestStarted();

      this.request.Actoin = this.request.PublicInfoId > 0 ?"UPDATE": "ADD";
      await this.commonFunctionService.PublicInfo(this.request).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
         if (data.State === EnumStatus.Success) {          
             if (data.Data[0].Status == 1) {
               this.toastr.success(data.Data[0].MSG);
               this.router.navigate(['/public-info-list'])
             } else {
               this.toastr.error(data.Data[0].MSG);
             }
           
          } else {
            this.toastr.error(data.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
    } catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  
  async onReset() {
    this.isSubmitted = false;
    //this.request = new BTERCollegeBranchModel()
  }


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('error this file ?')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();
        await this.commonFunctionService.UploadPublicInfoDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_FileName = data['Data'][0]["Dis_FileName"];
                this.request.FileName = data['Data'][0]["FileName"];

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

  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonFunctionService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Photo") {
            this.request.Dis_FileName = '';
            this.request.FileName = '';
          }
          //else if (Type == "Sign") {
          //  this.requestStudent.Dis_StudentSign = '';
          //  this.requestStudent.StudentSign = '';
          //}
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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

  async Hi_Update_file() {

    
   if(this._PublicAddType.Downloads == this.request.PublicInfoType)
    {
     this.LableText ='Link/Url'
     this.IsUpload = true;
     this._startf = '*'
     this._startl = ''
     this.PublicInfoFormGroup.controls['LinkUrl'].clearValidators();
     this.PublicInfoFormGroup.controls['Upload'].setValidators(Validators.required);
    }

    if (this._PublicAddType.Highlights == this.request.PublicInfoType) {
      this.LableText = 'text'
      this.IsUpload = false;
      this._startf = ''
      this._startl = '*'
      this.PublicInfoFormGroup.controls['Upload'].clearValidators();
      this.PublicInfoFormGroup.controls['LinkUrl'].setValidators(Validators.required);
    }
    if (this._PublicAddType.Notes == this.request.PublicInfoType) {
      this.LableText = 'Url'
      this.IsUpload = false;
      this._startf = ''
      this._startl = ''
      this.PublicInfoFormGroup.controls['Upload'].clearValidators();
      this.PublicInfoFormGroup.controls['LinkUrl'].clearValidators();
    }

    this.PublicInfoFormGroup.controls['Upload'].updateValueAndValidity();
    this.PublicInfoFormGroup.controls['LinkUrl'].updateValueAndValidity();

  }



  //async RefereshValidators() {


  //  
  //  if (this.request.LinkUrl == 76) {
  //    this.instituteForm.controls['Administrative'].clearValidators();
  //    this.instituteForm.controls['CantonmentBoard'].clearValidators();
  //    this.instituteForm.controls['CityID'].clearValidators();
  //    this.instituteForm.controls['Ward'].clearValidators();
  //    this.instituteForm.controls['NagarNigam'].clearValidators();
  //    this.instituteForm.controls['NagarPalika'].clearValidators();
  //    this.instituteForm.controls['NagarParishad'].clearValidators();
  //  } else {

  //    this.instituteForm.controls['Administrative'].setValidators([DropdownValidators]);
  //    this.instituteForm.controls['CantonmentBoard'].setValidators(Validators.required);
  //    this.instituteForm.controls['CityID'].setValidators([DropdownValidators]);
  //    this.instituteForm.controls['Ward'].setValidators(Validators.required);
  //    this.instituteForm.controls['NagarNigam'].setValidators(Validators.required);
  //    this.instituteForm.controls['NagarPalika'].setValidators(Validators.required);
  //    this.instituteForm.controls['NagarParishad'].setValidators(Validators.required);
  //  }

  //  this.instituteForm.controls['Administrative'].updateValueAndValidity();
  //  this.instituteForm.controls['CantonmentBoard'].updateValueAndValidity();
  //  this.instituteForm.controls['CityID'].updateValueAndValidity();
  //  this.instituteForm.controls['Ward'].updateValueAndValidity();



  //}

}
