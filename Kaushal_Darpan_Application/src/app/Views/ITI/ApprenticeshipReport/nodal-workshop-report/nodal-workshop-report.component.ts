import { Component } from '@angular/core';
import { HrMasterDataModel } from '../../../../Models/HrMasterDataModel';
import { ScholarshipModel } from '../../../../Models/ScholarshipDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

import { ScholarshipService } from '../../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ITIAAA_SSODetailsModel, ITIApprenticeshipWorkshopModel } from '../../../../Models/ITI/ITIApprenticeshipWorkshopDataModel';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service';
@Component({
  selector: 'app-nodal-workshop-report',
  standalone: false,
  templateUrl: './nodal-workshop-report.component.html',
  styleUrl: './nodal-workshop-report.component.css'
})
export class NodalWorkshopReportComponent {
  public ScholarshipID: number = 0;
  public ID: number = 0;
  public SemesterMasterList: any[] = [];
  public BranchList: any[] = [];
  public DistrictLisrt: any[] = [];
  public CategoryList: any[] = [];
  public Isverifed: boolean = false
  public requestSSoApi = new CommonVerifierApiDataModel();
  public request = new ITIApprenticeshipWorkshopModel()
  AddedAAAList: ITIAAA_SSODetailsModel[] = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ScholarshipFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public streamsearchmodel = new StreamDDL_InstituteWiseModel()
  public buttonHide: boolean = false

  constructor(private commonMasterService: CommonFunctionService, private ScholarshipService: ApprenticeReportServiceService, private toastr: ToastrService,
    private loaderService: LoaderService, private formBuilder: FormBuilder, public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {


    // form group
    this.ScholarshipFormGroup = this.formBuilder.group(
      {
       

     
        ParticipateSsoid: [''],
        /*ParticipateName: ['', Validators.required],*/
        WorkshopDetail: ['', Validators.required],
        WorkshopeDate: ['', Validators.required],
        BeforeEstablishmentNo: ['', Validators.required],
        BeforeEstablishmentSeat: ['', Validators.required],
        BeforeStudentCount: ['', Validators.required],
        AfterEstablishmentNo: ['', Validators.required],
        AfterEstablishmentSeat: ['', Validators.required],
        AfterStudentCount: ['', Validators.required],
        QuaterIncreaseEstablishment: ['', Validators.required],
        QuaterIncreaseSeat: ['', Validators.required],
        QuaterIncreaseStudent: ['', Validators.required],
        Remarks: ['', Validators.required],
       
        QuaterID: ['', [DropdownValidators]],
        DistrictID: ['', [DropdownValidators]],


      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    const Editid = sessionStorage.getItem('WorkshopID');
    debugger
    this.ID = Number(Editid)
    if (Editid != undefined && parseInt(Editid) > 0) {
      this.GetById(parseInt(Editid));
      this.GetByAAA(parseInt(Editid));
      console.log(Editid);
      this.ScholarshipFormGroup.disable();
    }
    if (
      this.sSOLoginDataModel.RoleID != 97

    ) {
      this.ScholarshipFormGroup.disable(); // Disables all form controls

    } else {
  /*    this.ScholarshipFormGroup.enable(); // Disa*/
    }
    this.ScholarshipFormGroup.controls['QuaterIncreaseEstablishment'].disable();
    this.ScholarshipFormGroup.controls['QuaterIncreaseSeat'].disable();
    this.ScholarshipFormGroup.controls['QuaterIncreaseStudent'].disable();

    this.ScholarshipID = Number(this.activatedRoute.snapshot.queryParamMap.get('ScholarshipID')?.toString());
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    await this.GetSemesterMatserDDL();
    await this.GetCategoryMatserDDL()
    await this.GetDistrictMatserDDL()


    
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
    sessionStorage.setItem('WorkshopID', '0');
    this.routers.navigate(['/QuaterWorkshopReport'])
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
  async GetDistrictMatserDDL() {
    try {

      this.loaderService.requestStarted();
      if (this.sSOLoginDataModel.RoleID == 97) {
        await this.commonMasterService.GetCommonMasterData('NodalDistrict', this.sSOLoginDataModel.DepartmentID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictLisrt = data['Data'];
            console.log(this.DistrictLisrt)
          }, (error: any) => console.error(error)
          );
      } else {
        await this.commonMasterService.GetCommonMasterData('DistrictHindi', this.sSOLoginDataModel.DepartmentID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictLisrt = data['Data'];
            console.log(this.DistrictLisrt)
          }, (error: any) => console.error(error)
          );
      }
      
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
  async GetById(ID:number) {
    try {

        this.loaderService.requestStarted();
      await this.ScholarshipService.GetQuaterReportById(ID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.request = data['Data'][0];
            this.request.WorkshopDetail = data['Data'][0]['workshopdetail'];
            
            const value = data['Data'][0]['workshopedate'];

            if (value) {
              const rawDate = new Date(value as string);
              const year = rawDate.getFullYear();
              const month = String(rawDate.getMonth() + 1).padStart(2, '0');
              const day = String(rawDate.getDate()).padStart(2, '0');
              this.request.WorkshopeDate = `${year}-${month}-${day}`;
            }

            console.log(this.request);
            console.log(this.request)
          /*  this.request.DistrictID=*/
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

  async GetByAAA(ID: number) {
    try {
      
      this.loaderService.requestStarted();
      await this.ScholarshipService.GetAAADetailsById(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));          
          this.AddedAAAList = data['Data'];
          this.request.ParticipateSsoid = '';
          this.buttonHide = true;
          console.log(this.request);
          console.log(this.request)
          /*  this.request.DistrictID=*/
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
/*  }*/

  // get detail by id
  async SaveData() {

    try {
      this.isSubmitted = true;
      if (this.ScholarshipFormGroup.invalid) {
        return
      }


      this.isLoading = true;
      this.loaderService.requestStarted();

      if (this.AddedAAAList.length == 0) {
        this.toastr.error("कृपया कम से कम एक भाग लेने वाला एएए नाम जोड़ें");
      }

      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;


      this.request.ApprenticeshipWorkshopMembersList = this.AddedAAAList;
   
      await this.ScholarshipService.Save_QuaterReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            //this.ResetControls();
            sessionStorage.setItem('WorkshopID', '0');
            this.routers.navigate(['/QuaterWorkshopReport']);
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

    this.request = new ITIApprenticeshipWorkshopModel();
    this.AddedAAAList = [];
    this.buttonHide = false;
    //this.request.StreamID = 0
    //this.request.SemesterID = 0
    //this.request.Amount = null
    //this.request.TotalStudent = null
    //this.request.Category = 0
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
                this.request.DisRegisterStudentPdf = data['Data'][0]["Dis_FileName"];
                this.request.RegisterStudentPdf = data['Data'][0]["FileName"];

              } else if (Type == "Photo2") {
                this.request.DisWorkshopPdf = data['Data'][0]["Dis_FileName"];
                this.request.WorkshopPdf = data['Data'][0]["FileName"];
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
  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {
    this.Isverifed = false
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      this.request.ParticipateSsoid = ''

      this.request.ParticipateName = ''
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            //this.request.ParticipateName = parsedData.displayName;

           // this.request.ParticipateSsoid = parsedData.SSOID;

            this.Isverifed = true
            // Add multiple Functionality
            const isDuplicate = this.AddedAAAList.some((element: any) =>
              this.request.ParticipateSsoid === element.SSOID
            );

            if (isDuplicate) {
              this.toastr.error('SSO ID Already Exists.');
              return;
            } else {

              const newItem: ITIAAA_SSODetailsModel = {
                
                SSOID: parsedData.SSOID,
                MobileNo: parsedData.mobile ?? '',
                EmailID: parsedData.mailPersonal ?? '',
                Name: parsedData.displayName ?? ''
              };

              this.AddedAAAList.push(newItem);
              this.request.ParticipateSsoid = "";
            }

          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }

  async OnCalculate() {
    if (this.request.BeforeEstablishmentNo === '' || this.request.AfterEstablishmentNo === '') {
      this.request.QuaterIncreaseEstablishment = '';
      return;
    }

    const diff = Number(this.request.AfterEstablishmentNo) - Number(this.request.BeforeEstablishmentNo);
    this.request.QuaterIncreaseEstablishment = (diff < 0 ? 0 : diff).toString();
  }

  async OnCalculate1() {
    if (this.request.BeforeEstablishmentSeat === '' || this.request.AfterEstablishmentSeat === '') {
      this.request.QuaterIncreaseSeat = '';
      return;
    }

    const diff = Number(this.request.AfterEstablishmentSeat) - Number(this.request.BeforeEstablishmentSeat);
    this.request.QuaterIncreaseSeat = (diff < 0 ? 0 : diff).toString();
  }

  //async OnCalculate2() {
  //  if (this.request.BeforeStudentCount === '' || this.request.AfterStudentCount === '') {
  //    this.request.QuaterIncreaseStudent = '';
  //    return;
  //  }

  //  const diff = Number(this.request.BeforeStudentCount) - Number(this.request.AfterStudentCount);
  //  this.request.QuaterIncreaseStudent = (diff < 0 ? 0 : diff).toString();
  //}


  async OnCalculate2() {
    if (this.request.BeforeStudentCount === '' || this.request.AfterStudentCount === '') {
      this.request.QuaterIncreaseStudent = '';
      return;
    }

    const diff = Number(this.request.AfterStudentCount) - Number(this.request.BeforeStudentCount);
    this.request.QuaterIncreaseStudent = (diff < 0 ? 0 : diff).toString();
  }


  async DeleteRow(item: ITIAAA_SSODetailsModel) {

    const index: number = this.AddedAAAList.indexOf(item);
    if (index != -1) {
      this.AddedAAAList.splice(index, 1)
    }
  }
}
