import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCampusPostService } from '../../../../Services/ITI/ITICampusPost/iticampus-post.service';
import { ItiCampusPostMaster_EligibilityCriteriaModel, ItiCampusPostMasterModel } from '../../../../Models/ITI/ITICampusPostDataModel';
import { ItiCompanyMasterDataModels } from '../../../../Models/ITI/ItiCompanyMasterDataModels';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { error } from 'highcharts';



@Component({
  selector: 'app-iticampus-post',
  templateUrl: './iticampus-post.component.html',
  styleUrls: ['./iticampus-post.component.css'],
  standalone: false
})
export class ItiCampusPostComponent implements OnInit {
  CampusForm!: FormGroup;
  EligibilityCriteriaForm!: FormGroup;
  public isUpdate: boolean = false;
  public PostID: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public AllSelect: boolean = false
  public TehsilMasterList: any = [];
  public DivisionMasterList: any = [];
  public State: number = -1;
  public LevelMasterList: any = [];
  public SalaryListList: any = [];
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public DistrictMasterList: any = []
  public StateMasterList: any = []
  public BranchList: any = []
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new ItiCampusPostMasterModel();
  Companyrequest = new ItiCompanyMasterDataModels();
  request_EligibilityCriteriaModel = new ItiCampusPostMaster_EligibilityCriteriaModel();
  public filteredDistricts: any[] = [];
  public filteredState: any[] = [];
  public categoryList: any = []
  public ManagmentTypeList: any = []
  public DistrictList: any = []
  public CompanyMasterList: any = []
  public StreamMasterList: any = []
  public PassingYearMasterList: any = []
  public filteredPassingYears: any[] = [];
  public SemesterMasterList: any = []
  public HiringRoleMasterList: any = []
  public EligibleInstitutesList: any = []
  public CompanyTypeList: any = []

  public HRDetailsList: any = []
  public NoRangeList: any[] = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
  @Input() public initialState: any;
  public minDate: string = '';
  public maxDate: string = '';
  public mincampusDate: string = '';
  public calculatedAge: string = '';
  public MinAge: number = 0
  public MaxAge: number = 0
  public CampusPostTypeList: any = [];
  public settingsMultiselect: object = {};


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private CampusPostService: ItiCampusPostService,
    public appsettingConfig: AppsettingService,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };


    this.CampusForm = this.formBuilder.group({
      ddlCompanyID: ['', [DropdownValidators]],
      ddlCompanyType: [{ value: '', disabled: true }],

      txtWebsite: ['', Validators.required],
      ddlState: ['', [DropdownValidators]],
      ddlDistrict: ['', [DropdownValidators]],
      txtAddress: ['', Validators.required],
      //txtHR_Name: ['', Validators.required],
      //txtHR_MobileNo: ['', Validators.required],
      //txtHR_Email: ['', Validators.required],
      //txtHR_SSOID: [''],
      txtCampusVenue: ['', Validators.required],
      txtCampusVenueLocation: [''],
      txtCampusFromDate: ['', Validators.required],
      txtCampusFromTime: [''],
      txtCampusToDate: ['', Validators.required],
      txtCampusToTime: [''],
      txtCampusAddress: ['', Validators.required],
      txtMarked: [false, Validators.requiredTrue]

    });

    this.EligibilityCriteriaForm = this.formBuilder.group({
      // ddlBranch: ['', [DropdownValidators]],
      ddlPassingYear: ['', [DropdownValidators]],
      ddlCampusPostType: [''],
      ddlToPassingYear: ['', [DropdownValidators]],
      /*ddlSemesterID: ['', [DropdownValidators]],*/
      ddlMinPre_10: [''],
      SalaryTypeID: ['', [DropdownValidators]],
      ddlMinPre_12: [''],
      ddlMinPre_Diploma: [''],
      //ddlNoofBackPapersAllowed: ['', [DropdownValidators]],
      ddlNoofBackPapersAllowed: [''],

      txtAgeAllowedFrom: ['', Validators.required],
      txtAgeAllowedTo: ['', Validators.required],
      ddlHiringRoleID: ['', [DropdownValidators]],
      /*txtNoofPositions: ['', [Validators.required, Validators.pattern(GlobalConstants.PositionPattern)]],*/
      txtNoofPositions: ['', Validators.required],
      txtCTC: ['', Validators.required],
      txtSalaryRemark: [''],
      ddlGender: [''],
      txtOtherBenefit: [''],
      ddlCampusType: [''],

      ddlInterviewType: [''],
      ddlEligibleInstitutes: ['', [DropdownValidators]],
      ddlNoOfInterviewRound: [''],
    });

    // await this.GetStreamType();
    this.request.EligibilityCriteriaModel = [];
    this.filteredPassingYears = this.PassingYearMasterList;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    /*this.GetNameWiseData(this.request.CompanyID);*/
    await this.GetMaterData();
    await this.loadDropdownData('CompanyType')
    //await this.GetDistrictMasterList();
    //await this.GetStateMasterList();
    if (this.activatedRoute.snapshot.queryParamMap.get('id') != null) {
      this.PostID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
      await this.GetByID(this.PostID);
    }
    if (this.initialState != undefined) {
      this.PostID = Number(this.initialState["PostID"]);
      await this.GetByID(this.PostID);
    }
    const ddlCompanyID = document.getElementById('ddlCompanyID');
    if (ddlCompanyID) ddlCompanyID.focus();

  }
  onStartDateChange(): void {
    // Ensure the "minDate" is set to the "AgeAllowedFrom" date value
    this.minDate = this.request_EligibilityCriteriaModel.AgeAllowedFrom;
  }

  onStartCampusDateChange(): void {
    // Ensure the "minDate" is set to the "AgeAllowedFrom" date value
    this.mincampusDate = this.request.CampusFromDate
  }

  onPassingYearChange() {
    const selectedPassingYear = this.request_EligibilityCriteriaModel.PassingYear;

    // Filter the "To Passing Year" options to be greater than the selected "Passing Year From"
    if (selectedPassingYear > 0) {
      this.filteredPassingYears = this.PassingYearMasterList.filter((item: any) => item.Year > selectedPassingYear);
    } else {
      this.filteredPassingYears = []; // Clear options if no valid Passing Year From selected
    }

    // Reset the "Passing Year To" field if the selected "Passing Year From" makes it invalid
    if (this.request_EligibilityCriteriaModel.ToPassingYear <= selectedPassingYear) {
      this.request_EligibilityCriteriaModel.ToPassingYear = 0;
    }
  }
  //checkValue(event: any) {
  //  if (event.target.value < 0) {
  //    event.target.value = '';
  //  }
  //}

  checkValue(event: any) {
    const value = event.target.value;
    if (value <= 0) {
      event.target.value = '';
    }
  }



  CampusPostTypechange() {

    console.log(this.request.CampusPostType)
  }


  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  omit_special_char(event: any) {
    var k; k = event.charCode;
    //         k = event.keyCode;  (Both can be used)return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  async GetMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ITIPlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.CompanyMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StateMasterList = data['Data'];
        }, error => console.error(error));

      debugger
      // await this.commonMasterService.StreamMaster()
      await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, 2, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID)
        // await this.commonMasterService.GetITITradeList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.PassingYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PassingYearMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetHiringRoleMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.HiringRoleMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetCommonMasterDDLByType('EligibleInstitutes')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EligibleInstitutesList = data['Data'];
        }, error => console.error(error));


      await this.commonMasterService.GetCommonMasterDDLByType('SalaryType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SalaryListList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.DDL_CampusPostTypeMaster('CampusPostType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusPostTypeList = data['Data'];
          console.log(" this.CampusPostTypeList", this.CampusPostTypeList)
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

  get filteredSortedSemesters() {
    return this.SemesterMasterList
      .filter((item: any) => item.SemesterID == 5 || item.SemesterID == 6) // Filter by SemesterID 5 or 6
      .sort((a: any, b: any) => b.SemesterName.localeCompare(a.SemesterName)); // Sort in descending order by SemesterName
  }


  async ddlState_Change() {
    debugger;
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

  async GetStreamType() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStreamType()
        // debugger
        //  await this.commonMasterService.GetTradeTypesList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BranchList = data['Data'];
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


  async GetNameWiseData(id: number) {
    debugger
    try {
      this.request.Website = ''
      this.request.StateID = 0
      this.request.DistrictID = 0
      this.request.Address = ''
      this.request.CompanyTypeID = 0
      this.loaderService.requestStarted();
      debugger;
      await this.CampusPostService.GetNameWiseData(id, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.HRDetailsList = data['Data'];
          if (data['Data']?.length > 0)
            if (data['Data'][0]["Website"] != null || data['Data'][0]["Website"] != undefined) {
              this.request.Website = data['Data'][0]["Website"];
            }
          //this.request.Website = data['Data'][0]["Website"];
          this.request.StateID = data['Data'][0]["StateID"];
          this.request.CompanyTypeID = data['Data'][0]["CompanyID"];
          await this.ddlState_Change();
          this.request.DistrictID = data['Data'][0]["DistrictID"];
          this.request.Address = data['Data'][0]["Address"];
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


  async loadDropdownData(MasterCode: string) {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'CompanyType':
          this.CompanyTypeList = data['Data'];
          console.log(this.CompanyTypeList)
          break;
        default:
          break;
      }
    });
  }

  toggleIsMainRole(row: ItiCampusPostMasterModel): void {
    ;
    // Set IsMainRole to false for all rows
    this.HRDetailsList.forEach((r: any) => r.IsMainRole = 0);

    //
    this.request.HR_Email = row.HR_Email;
    this.request.HR_MobileNo = row.HR_MobileNo;
    this.request.HR_Name = row.HR_Name;
    this.request.HR_SSOID = row.HR_SSOID;

    // Set the clicked row's IsMainRole to true
    row.IsMainRole = 1;
  }

  async GetByID(id: number) {

    try {
      ;
      this.loaderService.requestStarted();
      await this.CampusPostService.GetByID(id)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.PostID = data['Data']["PostID"];
          this.request.PostNo = data['Data']["PostNo"];
          this.request.PostCollegeID = data['Data']["PostCollegeID"];
          this.request.RoleID = data['Data']["RoleID"];
          this.request.PostSSOID = data['Data']["PostSSOID"];
          this.request.CompanyID = data['Data']["CompanyID"];
          await this.GetNameWiseData(this.request.CompanyID);
          this.request.Website = data['Data']["Website"];
          this.request.StateID = data['Data']["StateID"];
          this.request.DistrictID = data['Data']["DistrictID"];
          await this.ddlState_Change();
          //await this.ddlState_Change(this.request.CompanyID);
          this.request.Address = data['Data']["Address"];
          this.request.HR_Name = data['Data']["HR_Name"];
          this.request.HR_MobileNo = data['Data']["HR_MobileNo"];
          this.request.HR_Email = data['Data']["HR_Email"];
          this.request.HR_SSOID = data['Data']["HR_SSOID"];
          this.request.CampusVenue = data['Data']["CampusVenue"];
          this.request.CampusVenueLocation = data['Data']["CampusVenueLocation"];
          this.request.CampusPostType = data['Data']["CampusPostType"];
          this.request.DistrictID = data['Data']["DistrictID"];



          this.request.CampusFromDate = this.dateSetter(data['Data']['CampusFromDate']); //new Date(data['Data']['CampusFromDate']).toISOString().split('T').shift().toString();
          this.request.CampusFromTime = data['Data']["CampusFromTime"];
          this.request.CampusToDate = this.dateSetter(data['Data']['CampusToDate']);// new Date(data['Data']['CampusToDate']).toISOString().split('T').shift().toString();
          this.request.CampusToTime = data['Data']["CampusToTime"];
          this.request.CampusAddress = data['Data']["CampusAddress"];
          this.request.Action = data['Data']["Action"];
          this.request.ActionRemarks = data['Data']["ActionRemarks"];
          this.request.ActionBy = data['Data']["ActionBy"];
          this.request.ActionRTS = data['Data']["ActionRTS"];
          /*     this.HRDetailsList = data['Data'];*/
          this.request.EligibilityCriteriaModel = data['Data']["EligibilityCriteriaModel"];
          let indexToUpdate = this.HRDetailsList.findIndex((f: any) => f.HR_MobileNo == this.request.HR_MobileNo && f.HR_Name == this.request.HR_Name);
          this.HRDetailsList[indexToUpdate].IsMainRole = true;

          this.request_EligibilityCriteriaModel.PassingYear = data['Data']["EligibilityCriteriaModel"][0]["PassingYear"];
          await this.onPassingYearChange();
          this.request_EligibilityCriteriaModel.ToPassingYear = data['Data']["EligibilityCriteriaModel"][0]["ToPassingYear"];
          this.request_EligibilityCriteriaModel.MinPre_10 = data['Data']["EligibilityCriteriaModel"][0]["MinPre_10"];
          this.request_EligibilityCriteriaModel.MinPre_12 = data['Data']["EligibilityCriteriaModel"][0]["MinPre_12"];
          this.request_EligibilityCriteriaModel.MinPre_Diploma = data['Data']["EligibilityCriteriaModel"][0]["MinPre_Diploma"];
          this.request_EligibilityCriteriaModel.NoofBackPapersAllowed = data['Data']["EligibilityCriteriaModel"][0]["NoofBackPapersAllowed"];
          this.request_EligibilityCriteriaModel.HiringRoleID = data['Data']["EligibilityCriteriaModel"][0]["HiringRoleID"];
          this.request_EligibilityCriteriaModel.NoofPositions = data['Data']["EligibilityCriteriaModel"][0]["NoofPositions"];
          this.request_EligibilityCriteriaModel.SalaryTypeID = data['Data']["EligibilityCriteriaModel"][0]["SalaryTypeID"];
          this.request_EligibilityCriteriaModel.CTC = data['Data']["EligibilityCriteriaModel"][0]["CTC"];
          this.request_EligibilityCriteriaModel.SalaryRemark = data['Data']["EligibilityCriteriaModel"][0]["SalaryRemark"];
          this.request_EligibilityCriteriaModel.Gender = data['Data']["EligibilityCriteriaModel"][0]["Gender"];
          this.request_EligibilityCriteriaModel.OtherBenefit = data['Data']["EligibilityCriteriaModel"][0]["OtherBenefit"];
          this.request_EligibilityCriteriaModel.CampusType = data['Data']["EligibilityCriteriaModel"][0]["CampusType"];
          this.request_EligibilityCriteriaModel.InterviewType = data['Data']["EligibilityCriteriaModel"][0]["InterviewType"];
          this.request_EligibilityCriteriaModel.NoOfInterviewRound = data['Data']["EligibilityCriteriaModel"][0]["NoOfInterviewRound"];
          this.request_EligibilityCriteriaModel.EligibleInstitutesID = data['Data']["EligibilityCriteriaModel"][0]["EligibleInstitutesID"];
          this.request_EligibilityCriteriaModel.BranchID = data['Data']["EligibilityCriteriaModel"][0]["BranchID"];
          this.request_EligibilityCriteriaModel.AgeAllowedFrom = this.dateSetter(data['Data']["EligibilityCriteriaModel"][0]["AgeAllowedFrom"]);
          this.onAgeRangeChange();
          this.request_EligibilityCriteriaModel.Dis_AgeAllowedFrom = data['Data']["EligibilityCriteriaModel"][0]["Dis_AgeAllowedFrom"];
          this.request_EligibilityCriteriaModel.AgeAllowedTo = this.dateSetter(data['Data']["EligibilityCriteriaModel"][0]["AgeAllowedTo"]);
          this.onAgeRangeChange();
          this.request_EligibilityCriteriaModel.Dis_AgeAllowedTo = data['Data']["EligibilityCriteriaModel"][0]["Dis_AgeAllowedTo"];



          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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
  get form() { return this.CampusForm.controls; }
  get form_Eligibility() { return this.EligibilityCriteriaForm.controls; }

  async saveData() {

    ;
    this.isSubmitted = true;
    const mainRoleSelected = this.HRDetailsList.some((r: any) => r.IsMainRole == 1);


    if (!mainRoleSelected) {
      this.toastr.warning('Please Select HR Detail.');
    }
    if (this.CampusForm.invalid) {
      return
    }

    if (this.request.EligibilityCriteriaModel.length == 0) {
      this.toastr.error("Add Eligibility Criteria Details");
      return;
    }

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {

      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


      this.request.PostSSOID = this.sSOLoginDataModel.SSOID;
      this.request.PostCollegeID = this.sSOLoginDataModel.InstituteID;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      debugger
      await this.CampusPostService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message);
            if (this.initialState != undefined) {
              this.modalService.dismissAll();
              //window.open('itiCampusPostList.html', '_blank');
              this.routers.navigate(['/ItiCampusPostList']);
            }
            else {
              this.ResetControl();
            }
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

  async AddNewRole() {

    this.isSubmittedItemDetails = true;
    if (this.BranchList.length < 1) {
      this.toastr.error("Please Select Branch")
    }
    if (this.EligibilityCriteriaForm.invalid) {
      return
    }
    if (this.MinAge < 18) {
      this.toastr.error("Age should be more than 18 years")

      return
    }

    if (this.MaxAge < 18) {
      this.toastr.error("Age should be more than 18 years")

      return
    }

    //Show Loading
    this.loaderService.requestStarted();
    try {
      debugger;
      //this.request_EligibilityCriteriaModel.BranchName = this.StreamMasterList.filter((x: any) => x.StreamID == this.request_EligibilityCriteriaModel.BranchID)[0]['StreamName'];
      //this.request_EligibilityCriteriaModel.HiringRoleName = this.HiringRoleMasterList.filter((x: any) => x.ID == this.request_EligibilityCriteriaModel.HiringRoleID)[0]['Name'];

      this.BranchList.forEach((branch: any) => {
        //const branch = this.StreamMasterList.find((x: any) => x.StreamID == x.StreamID);

        //if (branch) {
        //  this.request_EligibilityCriteriaModel.BranchName = branch.StreamName;
        //}
        const hiringRole = this.HiringRoleMasterList.find((x: any) => x.ID == this.request_EligibilityCriteriaModel.HiringRoleID);
        const SalaryName = this.SalaryListList.find((x: any) => x.ID == this.request_EligibilityCriteriaModel.SalaryTypeID);

        //if (branch) {
        //  this.request_EligibilityCriteriaModel.BranchName = branch.StreamName;
        //}

        if (hiringRole) {
          this.request_EligibilityCriteriaModel.HiringRoleName = hiringRole.Name;
        }
        if (SalaryName) {
          this.request_EligibilityCriteriaModel.SalaryName = SalaryName.Name;
        }
        // Check if the BranchName already exists in the list
        const isDuplicateBranch = this.request.EligibilityCriteriaModel.some(
          (item: any) => item.BranchName === this.request_EligibilityCriteriaModel.BranchName
        );

        if (isDuplicateBranch) {
          this.toastr.error("You Can Not Add Same Branch")
          return; // Or show a toast/alert if needed
        }

        this.request.EligibilityCriteriaModel.push(
          {
            AID: this.request_EligibilityCriteriaModel.AID,
            PostID: this.request_EligibilityCriteriaModel.PostID,
            BranchID: branch.ID,
            BranchName: branch.Name,
            PassingYear: this.request_EligibilityCriteriaModel.PassingYear,
            ToPassingYear: this.request_EligibilityCriteriaModel.ToPassingYear,
            MinPre_10: this.request_EligibilityCriteriaModel.MinPre_10,
            MinPre_12: this.request_EligibilityCriteriaModel.MinPre_12,
            MinPre_Diploma: this.request_EligibilityCriteriaModel.MinPre_Diploma,
            NoofBackPapersAllowed: this.request_EligibilityCriteriaModel.NoofBackPapersAllowed,
            AgeAllowedFrom: this.request_EligibilityCriteriaModel.AgeAllowedFrom,
            Dis_AgeAllowedFrom: this.request_EligibilityCriteriaModel.AgeAllowedFrom,
            AgeAllowedTo: this.request_EligibilityCriteriaModel.AgeAllowedTo,
            Dis_AgeAllowedTo: this.request_EligibilityCriteriaModel.AgeAllowedTo,
            HiringRoleID: this.request_EligibilityCriteriaModel.HiringRoleID,
            HiringRoleName: this.request_EligibilityCriteriaModel.HiringRoleName,
            NoofPositions: this.request_EligibilityCriteriaModel.NoofPositions,
            CTC: this.request_EligibilityCriteriaModel.CTC,
            SalaryRemark: this.request_EligibilityCriteriaModel.SalaryRemark,
            Gender: this.request_EligibilityCriteriaModel.Gender,
            OtherBenefit: this.request_EligibilityCriteriaModel.OtherBenefit,
            CampusType: this.request_EligibilityCriteriaModel.CampusType,
            InterviewType: this.request_EligibilityCriteriaModel.InterviewType,
            NoOfInterviewRound: this.request_EligibilityCriteriaModel.NoOfInterviewRound,
            EligibleInstitutesID: this.request_EligibilityCriteriaModel.EligibleInstitutesID,
            EligibleInstitutesName: this.request_EligibilityCriteriaModel.EligibleInstitutesName,
            ActiveStatus: this.request_EligibilityCriteriaModel.ActiveStatus,
            DeleteStatus: this.request_EligibilityCriteriaModel.DeleteStatus,
            SalaryName: this.request_EligibilityCriteriaModel.SalaryName,
            SalaryTypeID: this.request_EligibilityCriteriaModel.SalaryTypeID
          }
        );

      })

      console.log("this.request_EligibilityCriteriaModel", this.request_EligibilityCriteriaModel)

      return
      //const branch = this.StreamMasterList.find((x: any) => x.StreamID == this.request_EligibilityCriteriaModel.BranchID);

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(async () => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async ResetRow() {
    this.loaderService.requestStarted();
    this.request_EligibilityCriteriaModel.AID = 0;
    this.request_EligibilityCriteriaModel.PostID = 0;
    // this.request_EligibilityCriteriaModel.BranchID = 0;
    this.request_EligibilityCriteriaModel.BranchName = '';
    this.request_EligibilityCriteriaModel.PassingYear = 0;
    this.request_EligibilityCriteriaModel.MinPre_10 = 0;
    this.request_EligibilityCriteriaModel.MinPre_12 = 0;
    this.request_EligibilityCriteriaModel.MinPre_Diploma = 0;
    this.request_EligibilityCriteriaModel.NoofBackPapersAllowed = 0;
    this.request_EligibilityCriteriaModel.AgeAllowedFrom = '';
    this.request_EligibilityCriteriaModel.AgeAllowedTo = '';
    this.request_EligibilityCriteriaModel.HiringRoleID = 0;
    this.request_EligibilityCriteriaModel.HiringRoleName = '';
    this.request_EligibilityCriteriaModel.NoofPositions = 0;
    this.request_EligibilityCriteriaModel.CTC = '';
    this.request_EligibilityCriteriaModel.SalaryRemark = '';
    this.request_EligibilityCriteriaModel.Gender = '';
    this.request_EligibilityCriteriaModel.OtherBenefit = '';
    this.request_EligibilityCriteriaModel.CampusType = '0';
    this.request_EligibilityCriteriaModel.InterviewType = 'Both';
    this.request_EligibilityCriteriaModel.NoOfInterviewRound = 0;
    this.request_EligibilityCriteriaModel.ActiveStatus = true;
    this.request_EligibilityCriteriaModel.DeleteStatus = false;
    this.isSubmittedItemDetails = false;
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);
  }

  async ResetControl() {
    this.loaderService.requestStarted();
    if (this.initialState != undefined) {
      this.modalService.dismissAll();
    }

    if (this.activatedRoute.snapshot.queryParamMap.get('id') != null) {
      this.routers.navigate(['/ItiCampusPostList']);
    }

    this.isSubmitted = false;
    this.request.AID = 0;
    this.request.PostID = 0;
    this.request.PostNo = '';
    this.request.PostCollegeID = 0;
    this.request.RoleID = 0;
    this.request.PostSSOID = '';
    this.request.CompanyID = 0;
    this.request.Website = '';
    this.request.StateID = 0;
    this.request.DistrictID = 0;
    this.request.Address = '';
    this.request.HR_Name = '';
    this.request.HR_MobileNo = '';
    this.request.HR_Email = '';
    this.request.HR_SSOID = '';
    this.request.CampusVenue = '';
    this.request.CampusVenueLocation = '';
    this.request.CampusFromDate = '';
    this.request.CampusFromTime = '';
    this.request.CampusToDate = '';
    this.request.CampusToTime = '';
    this.request.CampusAddress = '';
    this.request.Action = '';
    this.request.ActionRemarks = '';
    this.request.ActionBy = 0;
    this.request.ActionRTS = '';
    this.request.ActiveStatus = false;
    this.request.DeleteStatus = false;
    this.request.RTS = '';
    this.request.CreatedBy = 0;
    this.request.UserID = 0;
    this.request.ModifyBy = 0;
    this.request.ModifyDate = '';
    this.request.IPAddress = '';
    this.request.EligibilityCriteriaModel = [];
    const ddlCompanyID = document.getElementById('ddlCompanyID');
    if (ddlCompanyID) ddlCompanyID.focus();
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);

  }

  async onCancel() {
    await this.ResetControl();
  }

  async btnRowDelete_OnClick(item: ItiCampusPostMaster_EligibilityCriteriaModel) {
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.EligibilityCriteriaModel.indexOf(item);
        if (index != -1) {
          this.request.EligibilityCriteriaModel.splice(index, 1)
        }
      }
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


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
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
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                //this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
                this.request.JobDiscription = data['Data'][0]["FileName"];
                this.request.Dis_JobDiscription = data['Data'][0]["Dis_FileName"];

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


  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //onAgeRangeChange() {
  //  const fromDateStr = this.request_EligibilityCriteriaModel.AgeAllowedFrom;
  //  const toDateStr = this.request_EligibilityCriteriaModel.AgeAllowedTo;

  //  if (fromDateStr && toDateStr) {
  //    const fromDate = new Date(fromDateStr);
  //    const toDate = new Date(toDateStr);

  //    let age = toDate.getFullYear() - fromDate.getFullYear();
  //    const monthDiff = toDate.getMonth() - fromDate.getMonth();

  //    // Adjust if the birthday hasn't occurred yet this year
  //    if (monthDiff < 0 || (monthDiff === 0 && toDate.getDate() < fromDate.getDate())) {
  //      age--;
  //    }

  //    this.calculatedAge = Math.max(age, 0);
  //  } else {
  //    this.calculatedAge = 0;
  //  }

  //  // Optional: Set minDate for the "To" input
  //  this.minDate = fromDateStr;
  //}

  onAgeRangeChange() {
    this.MinAge = 0
    const fromDateStr = this.request_EligibilityCriteriaModel.AgeAllowedFrom;
    const toDateStr = this.request_EligibilityCriteriaModel.AgeAllowedTo;
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

    // ✅ Correct Validation: From Age should not be GREATER than To Age
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



  dateSetter(date: any) {
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  // multiselect events
  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }

}
