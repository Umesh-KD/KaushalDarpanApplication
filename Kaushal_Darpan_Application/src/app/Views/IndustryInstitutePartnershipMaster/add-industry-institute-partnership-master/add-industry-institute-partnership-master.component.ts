import { Component, OnInit } from '@angular/core';
import {ConcernPersonDetailsDataModel, IIP_SearchModel, IndustryInstitutePartnershipMasterDataModels } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { IndustryInstitutePartnershipMasterService} from '../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel } from '../../../Models/CommonMasterDataModel';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-add-industry-institute-partnership-master',
  standalone: false,
  templateUrl: './add-industry-institute-partnership-master.component.html',
  styleUrl: './add-industry-institute-partnership-master.component.css'
})
export class AddIndustryInstitutePartnershipMasterComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new IndustryInstitutePartnershipMasterDataModels()
  public personRequest = new ConcernPersonDetailsDataModel();
  public searchReq = new IIP_SearchModel();
  
  public IIPMasterFormGroup!: FormGroup;
  public HrMasterFormGroup!: FormGroup;
  
  public DistrictMasterList: IDistrictMaster_StateIDWiseDataModel[] = []
  public StateMasterList: IStateMasterDataModel[] = []
  public CompanyMasterList: any = []
  public CompanyDetails: any = []
  public HRList: ConcernPersonDetailsDataModel[] = []

  public ID: number = 0;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isHrFormSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public CompanyID: number = 0


  constructor(
    private commonMasterService: CommonFunctionService, 
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private appsettingConfig: AppsettingService
  ) { }


  async ngOnInit() {
    // form group
    this.IIPMasterFormGroup = this.formBuilder.group({
        Website: ['', Validators.required],
        Address: ['', Validators.required],
        ddlState: ['', [DropdownValidators]],
        ddlDistrict: ['', [DropdownValidators]],
        PlacementCompanyID: ['', [DropdownValidators]],
      });

    this.HrMasterFormGroup = this.formBuilder.group({
        Name: ['', Validators.required],
        EmailId: ['', [Validators.required,Validators.pattern(GlobalConstants.EmailPattern)]],
        MobileNo: ['', Validators.required],
        Designation: ['', Validators.required],
      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('IndustryInstitutePartnershipID')?.toString());
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    await this.GetMaterData()

    //edit
    if (this.ID > 0) {
      this.searchReq.CompanyID = this.ID
      await this.GetById();
    }
  }

  get _IIPMasterFormGroup() { return this.IIPMasterFormGroup.controls; }
  get _HrMasterFormGroup() { return this.HrMasterFormGroup.controls; }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  async GetComapnyDetailsByID() {
    try {
      let companyID = this.request.PlacementCompanyID ?? 0
debugger
      await this.commonMasterService.PlacementCompanyMaster_IDWise(companyID, this.sSOLoginDataModel.DepartmentID)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CompanyDetails = data.Data;//data['Data'][0];
        debugger
        this.request.Website = this.CompanyDetails.Website
        this.request.StateID = this.CompanyDetails.StateID
        await this.ddlState_Change()
        this.request.DistrictID = this.CompanyDetails.DistrictID
        this.request.Address = this.CompanyDetails.Address
        this.request.Logo = this.CompanyDetails.Logo
        // this.request.ConcernPersonDetails[0].MobileNo = this.CompanyDetails.ListCompanyHRDetails[0].MobileNo
        // this.request.ConcernPersonDetails[0].EmailId = this.CompanyDetails.ListCompanyHRDetails[0].EmailId
        // this.request.ConcernPersonDetails[0].Name = this.CompanyDetails.ListCompanyHRDetails[0].Name
        // this.personRequest.MobileNo = this.CompanyDetails.ListCompanyHRDetails[0].MobileNo
        // this.personRequest.EmailId = this.CompanyDetails.ListCompanyHRDetails[0].EmailId
        // this.personRequest.Name = this.CompanyDetails.ListCompanyHRDetails[0].Name


        // HR LIST BIND
        this.request.ConcernPersonDetails = [];

        if (
          this.CompanyDetails.ListCompanyHRDetails &&
          this.CompanyDetails.ListCompanyHRDetails.length > 0
        ) {

          this.request.ConcernPersonDetails =
            this.CompanyDetails.ListCompanyHRDetails.map((x: any) => {

              let hr = new ConcernPersonDetailsDataModel();

              hr.HRManagerID = x.HRManagerID;
              hr.PlacementCompanyID = x.PlacementCompanyID;
              hr.Name = x.Name;
              hr.MobileNo = x.MobileNo;
              hr.EmailId = x.EmailId;

              return hr;
            });
        }

      })
    } catch (error) {
      console.error(error);
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
        }, error => console.error(error));

      await this.commonMasterService.PlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          debugger
          data = JSON.parse(JSON.stringify(data));
          this.CompanyMasterList = data['Data'];
        }, (error: any) => console.error(error));
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

  async Back() {
    if (this.key == 1) {
      this.routers.navigate(['/IndustryInstitutePartnershipList'])
    }
    else if (this.key == 2) {
      this.routers.navigate(['/industryInstitutePartnership-validation'])
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
  async GetById() {
    try {

      this.loaderService.requestStarted();
      
      await this.industryInstitutePartnershipMasterService.GetById_IIP_CompanyDetails(this.searchReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log('data',data);
          debugger
          this.request = data['Data'];
          this.request.Dis_Logo = data['Data']['Logo'];
          this.request.Logo = data['Data']['Logo'];
          this.ddlState_Change();
          this.request.DistrictID = data['Data']["DistrictID"];
          console.log(this.request, "request");


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
      if (this.IIPMasterFormGroup.invalid) {
        console.log("errro")
        return
      }

      if(this.request.ConcernPersonDetails.length <= 0 ) {
        this.toastr.error("Please add at least one concern person details");
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;


      //save
      await this.industryInstitutePartnershipMasterService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.routers.navigate(['/IndustryInstitutePartnershipList']);
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)

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

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_Logo = data['Data'][0]["Dis_FileName"];
                this.request.Logo = data['Data'][0]["FileName"];

              }
              event.target.value = null;
            }
            if (data.State == EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage)
            }
            else if (data.State == EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage)
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


  async onFilechangeCompany(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {
        //if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png') {
        //  //size validation
        //  if (this.file.size > 2000000) {
        //    this.toastr.error('Select less then 2MB File')
        //    return
        //  }
        //  //if (this.file.size < 100000) {
        //  //  this.toastr.error('Select more then 100kb File')
        //  //  return
        //  //}
        //}
        //else {// type validation
        //  this.toastr.error('Select Only jpeg/jpg/png file')
        //  return
        //}
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "CompanyDocument") {
                this.request.Dis_DocName = data['Data'][0]["Dis_FileName"];
                this.request.CompanyDocument = data['Data'][0]["FileName"];

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
      await this.commonMasterService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Photo") {
            this.request.Dis_CompanyName = '';
            this.request.CompanyPhoto = '';
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

  // reset
  ResetControls() {
    this.request = new IndustryInstitutePartnershipMasterDataModels();
  }

  async resetHrDetails() {
    this.personRequest = new ConcernPersonDetailsDataModel();
  }

  async AddMoreMembers() {
    
    this.isHrFormSubmitted = true;
    if(this.HrMasterFormGroup.invalid) {
      this.toastr.error("Please fill all the required fields of Concern Person Form")
      return;
    }

    const personExists = this.request.ConcernPersonDetails.some(person =>
      person.EmailId === this.personRequest.EmailId && person.MobileNo === this.personRequest.MobileNo
    );

    if (!personExists) {
      this.request.ConcernPersonDetails.push(this.personRequest);
      this.personRequest = new ConcernPersonDetailsDataModel();
      this.isHrFormSubmitted = false;
    } else {
      this.toastr.error("Person already exists with the same emailid and mobileno.");
      return
    }

    // this.request.ConcernPersonDetails.push(this.personRequest);
  
  }

  async SaveData_IIP_Company() {
    
    try {
      this.isSubmitted = true;
      if (this.IIPMasterFormGroup.invalid) {
        console.log("errro")
        return
      }

      if(this.request.ConcernPersonDetails.length <= 0 ) {
        this.toastr.error("Please add at least one concern person details");
        return
      }
      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

debugger
      //save
      await this.industryInstitutePartnershipMasterService.SaveData_IIP_Company(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControls();
            this.routers.navigate(['/IndustryInstitutePartnershipList']);
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.ErrorMessage)

          } else {
            this.toastr.error(data.ErrorMessage)
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

  async Delete_Hr(idx: number) {
    try {
      this.request.ConcernPersonDetails.splice(idx, 1);
    } catch (error) {
      console.error(error)
    }
  }
}
