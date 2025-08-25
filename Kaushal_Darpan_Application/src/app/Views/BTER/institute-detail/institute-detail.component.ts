import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { CollegeMasterDataModels, CollegeMasterRequestModel } from '../../../Models/CollegeMasterDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeMasterService } from '../../../Services/CollegeMaster/college-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';

@Component({
  selector: 'app-institute-detail',
  standalone: false,
  templateUrl: './institute-detail.component.html',
  styleUrl: './institute-detail.component.css'
})
export class InstituteDetailComponent implements OnInit {
  instituteForm!: FormGroup;
  public isUpdate: boolean = false;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TehsilMasterList: any = [];
  public DivisionMasterList: any = [];
  public State: number = -1;
  public LevelMasterList: any = [];
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public DistrictMasterList: any = []
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CollegeMasterDataModels();
  public filteredDistricts: any[] = [];
  public filteredTehsils: any[] = [];
  public categoryList: any = []
  public ManagmentTypeList: any = []
  public CollegeTypeList: any = []
  public CourseTypeList: any = []
  public IsCollegeType: boolean = false
  public collegeRequest = new CollegeMasterRequestModel();

  constructor(
    private formBuilder: FormBuilder,
    private instituteService: CollegeMasterService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.instituteForm = this.formBuilder.group({
      ssoid: ['', Validators.required],
      institutionCategoryID: ['', [DropdownValidators]],
      institutionManagementTypeID: ['', [DropdownValidators]],
      instituteNameEnglish: ['', Validators.required],
      instituteNameHindi: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      landNumber: [''],
      LandlineStd: [''],
      MobileNumber: ['', Validators.required],
      instituteCode: ['', Validators.required],
      faxNumber: [''],
      website: [''],
      //landlineNumber: [''],
      divisionID: ['', [DropdownValidators]],
      districtID: ['', [DropdownValidators]],
      tehsilID: ['', [DropdownValidators]],
      address: ['', Validators.required],
      pinCode: ['', Validators.required],
      InstitutionDGTCode: [''],
      CollegeType: ['', [DropdownValidators]],
      CourseType: ['', [DropdownValidators]],
      ActiveStatus: ['true'],

    });

    this.collegeRequest.InstituteID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;

    await this.GetDivisionMasterList()
    // await this.GetTehsilMasterList()
    // await this.GetDistrictMasterList()
    await this.GetCategory()
    await this.GetManagmentType()
    await this.GetCollegeType()
    await this.GetCouseType()
    await this.ChangeCollegeType()
    this.collegeRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    if (this.collegeRequest.InstituteID > 0) {
      await this.GetByID();
    }

  }

  ChangeCollegeType() {
    if (this.request.CollegeTypeID == 22) {
      this.IsCollegeType = true
    }
    else {
      this.IsCollegeType = false
    }
  }

  async GetDivisionMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];
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

  async GetCouseType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStreamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseTypeList = data['Data'];
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

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ManagmentTypeList = data['Data'];
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

  async GetCategory() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.categoryList = data['Data'];
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

  async GetCollegeType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CollegeType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeTypeList = data['Data'];
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

  // async GetTehsilMasterList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetTehsilMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.TehsilMasterList = data['Data'];
  //         console.log(this.TehsilMasterList)
  //       }, error => console.error(error));
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

  // async GetDistrictMasterList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetDistrictMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.DistrictMasterList = data['Data'];
  //         console.log(this.DistrictMasterList)
  //         // console.log(this.DivisionMasterList)
  //       }, error => console.error(error));
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

  async GetByID() {
    try {
      this.collegeRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.collegeRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.collegeRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.collegeRequest.RoleID = this.sSOLoginDataModel.RoleID;
      //get
      await this.instituteService.GetByID(this.collegeRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.SSOID = data['Data']["SSOID"];
          this.request.Address = data['Data']["Address"];

          this.request.CollegeTypeID = data['Data']["CollegeTypeID"];
          this.request.CourseTypeID = data['Data']["CourseTypeID"];
          this.request.DivisionID = data['Data']["DivisionID"];
          this.ddlDivision_Change();
          this.request.DistrictID = data['Data']["DistrictID"];
          this.ddlDistrict_Change();
          this.request.TehsilID = data['Data']["TehsilID"];
          this.request.Email = data['Data']["Email"];
          this.request.FaxNumber = data['Data']["FaxNumber"];
          this.request.MobileNumber = data['Data']["MobileNumber"];
          this.request.InstituteCode = data['Data']["InstituteCode"];
          this.request.InstitutionManagementTypeID = data['Data']["InstitutionManagementTypeID"];
          this.request.InstitutionCategoryID = data['Data']["InstitutionCategoryID"];
          this.request.LandlineStd = data['Data']["LandlineStd"];
          this.request.LandNumber = data['Data']["LandNumber"];
          this.request.Website = data['Data']["Website"];
          this.request.InstituteNameEnglish = data['Data']["InstituteNameEnglish"];
          this.request.InstituteNameHindi = data['Data']["InstituteNameHindi"];
          this.request.PinCode = data['Data']["PinCode"];
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
          this.request.InstitutionDGTCode = data['Data']['InstitutionDGTCode']
          this.request.InstituteID = data['Data']['InstituteID']
          this.request.CreatedBy = data['Data']['CreatedBy'];
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async ddlDivision_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionID)
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

  onDivisionChange() {

    const selectedDivisionID = this.request.DivisionID;

    this.filteredDistricts = this.DistrictMasterList.filter((district: any) => district.ID == selectedDivisionID);

  }

  async ddlDistrict_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.request.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];
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

  onDistrictChange() {
    const selectedDistrictID = this.request.DistrictID;
    this.filteredTehsils = this.TehsilMasterList.filter((tehsil: any) => tehsil.ID == selectedDistrictID);
  }

  get form() { return this.instituteForm.controls; }

  async saveData() {
    this.isSubmitted = true;
    //
    this.refreshCourseTypeRefValidation();
    //
    if (this.instituteForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.collegeRequest.InstituteID > 0) {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.instituteService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.routers.navigate(['/collegemaster']);
          }
          else {
            this.toastr.error(this.ErrorMessage)
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


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new CollegeMasterDataModels();
    this.instituteForm.reset();
  }

  onCancel(): void {
    this.routers.navigate(['/collegemaster']);
  }

  refreshCourseTypeRefValidation() {
    // clear
    this.instituteForm.get('CourseType')?.clearValidators();
    // set
    if (this.request.CollegeTypeID == 22) {
      this.instituteForm.get('CourseType')?.setValidators([DropdownValidators]);
    }
    // update
    this.instituteForm.get('CourseType')?.updateValueAndValidity();
  }

  GetInstitutionManagementType(id: any) {
    if (id != 0 && id != '' && id != undefined) {
      return this.ManagmentTypeList.find(function (x: any) { return x.InstitutionManagementTypeID == id }).InstitutionManagementType;
    } else {
      return "";
    }
  }
  GetInstitutionCategoryType(id: any) {
    if (id != 0 && id != '' && id != undefined) {
      return this.categoryList.find(function (x: any) { return x.ID == id }).Name;
    } else {
      return "";
    }
  }
  GetCollegeTypeName(id: any) {
    if (id != 0 && id != '' && id != undefined) {
      return this.CollegeTypeList.find(function (x: any) { return x.ID == id }).Name;
    } else {
      return "";
    }
  }


}
