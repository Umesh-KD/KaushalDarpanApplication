import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus } from '../../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';

import { AppsettingService } from '../../../../../Common/appsetting.service';
import { ItiTradeSearchModel } from '../../../../../Models/CommonMasterDataModel';
import { ITICollegeTradeSearchModel } from '../../../../../Models/ITI/SeatIntakeDataModel';
import { ITI_EM_StaffDetails_Curr_DataModel, ITI_EM_UnlockProfileDataModel, RequestSearchModel } from '../../../../../Models/ITI/UserRequestModel';
import { ITISeatIntakesModel, ITIsSearchModel } from '../../../../../Models/ITIsDataModels';
import { ItiSeatIntakeService } from '../../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITIGovtEMStaffMaster } from '../../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { UserRequestService } from '../../../../../Services/UserRequest/user-request.service';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { ItiSanctionOrderList } from '../../../../../Models/ITI/ItiReportDataModel';
import { HiringRoleMasterService } from '../../../../../Services/HiringRoleMaster/hiring-role-master.service';
import { ITI_Govt_EM_NodalSearchDataModel, ITI_Relieving_joining_CheckVacantPostModel } from '../../../../../Models/ITIGovtEMStaffMasterDataModel';

@Component({
  selector: 'app-add-request-ddo-office',
  standalone: false,
  templateUrl: './add-request-ddo-office.component.html',
  styleUrl: './add-request-ddo-office.component.css'
})
export class AddRequestDDOOfficeComponent {
  groupForm!: FormGroup;
  SearchFormGroup!: FormGroup;
  public OrderDate:string=''
  public OrderType:number=0

  public formdata = new ITISeatIntakesModel()
  public tradeSearchRequest = new ItiTradeSearchModel()
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public getUserSerivecRequest=new ITI_EM_UnlockProfileDataModel();
  public searchRequest = new RequestSearchModel();
  request = new RequestSearchModel();
  searchReq = new RequestSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  SearchRequest = new ITIsSearchModel();
  public ordersearchRequest = new ItiSanctionOrderList()
  public NodalsearchRequest = new ITI_Govt_EM_NodalSearchDataModel();
  public formData = new ITI_EM_StaffDetails_Curr_DataModel();
  requestCheckVacantPost = new ITI_Relieving_joining_CheckVacantPostModel();
  public _EnumRole = EnumRole;
  
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public InstituteCategoryList: any = [];
  public OrderList: any = [];
  public ListITICollegeByManagement: any = [];
  public filterplanorderList: any = [];
  public PostSanctionList: any = [];
  public ListITICollegeByManagement_search: any = [];
  public ItiTradeList: any = [];
  public ITITradeSchemeList: any = [];
  public ManagmentTypeList: any = [];
  public ITIRemarkList: any = [];
  public StaffListDDL: any = [];
  public RoleListDDL: any = [];

  public Id: number | null = null;

  public OfficeList: any = [];
  public OfficeList_search: any = [];
  public LevelList: any = [];
  public PostList: any = [];
  public LevelID: number = 0
  public IsDisable: boolean = false
  public isSSOVisible: boolean = false;
  public StaffTypeList: any[] = [];
  public GetStaffDetailsVRS: any[]=[];
  public DistrictList: any = [];
  public DivisionMasterList: any[] = [];
  public DivisionMasterList_search: any[] = [];
  public DistrictList_search: any[] = [];

  public OldDivisionID: number = 0
  public OldInstituteID: number = 0
  public OldNodalDistrictID: number = 0
  public OldOfficeID: number = 0
 
  public getstatuId:number=0;
  public TodayDate:string='';
  public PostMessage:string='';

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private routers: ActivatedRoute,
    private userRequestService: UserRequestService,
    private ITICollegeTradeService: ItiSeatIntakeService,
    public appsettingConfig: AppsettingService,
    private  ITIGovtEMStaffMaster: ITIGovtEMStaffMaster,
    private Swal2: SweetAlert2,
    private ScholarshipService: HiringRoleMasterService
   
  ) { }

  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlRequestType: ['', [DropdownValidators]],
      ReqRoleID: ['', [DropdownValidators]],
      /* ddlStaffType: ['', [DropdownValidators]],*/
      ddlOffice: ['', [DropdownValidators]],
      ddlITICollegeTrade: [''],
      ddlLevelID: [{ value: '' }, [DropdownValidators]],
      ddlPost: ['', [DropdownValidators]],
      /* txtSSOID: ['', Validators.required],*/
      txtName: [''],
      txtMobile: [''],
      txtEmailID: [''],
      txtRequestRemarks: ['', Validators.required],
      txtOrderNo: ['', ],
      txtOrderDate: ['',],
      /* txtJoiningDate: [''],*/
      txtRequestDate: ['', Validators.required],
      // LastworkingDate: ['', Validators.required],
      Upload: [''],
      ddlDistrictID: [''],
      divisionID: [''],
      ddlStaffType: ['', [DropdownValidators]],
      RelievingTimeID: ['', [DropdownValidators]],
      StaffID: ['', [DropdownValidators]],
      txtEmployeeName: [{ value: '', disabled: true }],
      txtEmployeeNumber: [{ value: '', disabled: true }],
      txtEmployeeDesignation:[{value:'',disabled:true}],

      /*chkIsHod: [false]*/
    });

    this.SearchFormGroup = this.fb.group({
      LevelID: [''],
      OfficeID: [''],
      DivisionID: [''],
      InstituteID: [''],
      NodalDistrictID: [''],
      SSOID: [''],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.LevelID = 1;
    await this.GetTodayData();
    await this.setRolewiseLevel(); 
    await this.GetStaffListDDL();
    await this.GetRoleListDDL();
    await this.GetLevelList();
    await this.GetOfficeList();
    await this.GetOrderList();
    //await this.getITICollege();
    //this.GetRoleMasterData();
    await this.GetStaffTypeData();
    await this.GetPostList();
    this.Id = Number(this.routers.snapshot.paramMap.get('id')?.toString());
    this.getstatuId=0;
    if (this.Id) {
      await this.Get_ITIsData_ByID(this.Id);
      this.getstatuId=this.request.RequestType;
      await this.FunctionRequestType();
    }


    this.request.CreatedBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID

    //this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
  }

  get _groupForm() { return this.groupForm.controls; }

  async GetTodayData(){
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.TodayDate = `${yyyy}-${mm}-${dd}`
  }
  async GetLevelList() {   
    try {
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LevelList = data['Data'];

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async setRolewiseLevel() {
    if(this.sSOLoginDataModel.RoleID == EnumRole.DTETraing) {
      this.groupForm.controls['ddlLevelID'].enable();
      this.request.LevelID = 1;
    } else {
      // this.groupForm.controls['ddlLevelID'].disable();
      if(this.sSOLoginDataModel.RoleID == EnumRole.Principal_SCVT 
        || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT
      ){
        this.request.LevelID = 2;
        // Principal -> District Level
      } else if(this.sSOLoginDataModel.RoleID == EnumRole.ITIZonalOfficer) {
        this.request.LevelID = 2;
        // Zonal -> District Level
      } else if(this.sSOLoginDataModel.RoleID == EnumRole.DTE_TrainingT2_establishment) {
        this.request.LevelID = 3;
        // State Level
      }
    }
    
  }

  async GetOfficeList() {
    this.request.OfficeID = 0;
    this.request.InstituteID=0
    try {
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.request.LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async GetOfficeList_search() {
    this.searchReq.OfficeID = 0;
    this.searchReq.InstituteID=0
    try {
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.searchReq.LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList_search = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async GetPostList() {
    if(this.request.ReqRoleID == 97){
      await this.DuplicateNodal();
    }
    try {
      var obj = {
        OfficeID: this.request.OfficeID,
        InstituteID: this.request.InstituteID,
        NodalDistrictID: this.request.NodalDistrictID,
      }
      await this.commonMasterService.GetItiVacantPost(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetStaffTypeData() {
    try {
      await this.commonMasterService.GetCommonMasterData('ITI_StaffType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } 
  }

  async GetTradeListDDL() {
    try {
      this.loaderService.requestStarted();
      this.tradeSearchRequest.action = "_getAllData"
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        console.log("ITITradeList", parsedData.Data);
        this.ItiTradeList = parsedData.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getITICollege() {
    
    try {
      this.searchRequestITi.Action = "_ITICollegeByManagementType";
      this.searchRequestITi.FinancialYearID = 9;
      this.searchRequestITi.ManagementTypeId = 1;

      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.getITICollegeByManagement(this.searchRequestITi)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITICollegeByManagement = data['Data'];
          this.ListITICollegeByManagement = this.ListITICollegeByManagement.filter((item: any) => item.DivisionId == this.request.DivisionID)
          console.log(this.ListITICollegeByManagement, "ListITICollegeByManagement")
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
  async getITICollege_search() {
    try {
      await this.commonMasterService.GetCommonMasterData('GovtIti', this.searchReq.DivisionID, this.searchReq.NodalDistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITICollegeByManagement_search = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetTradeSchemeDDL() {
    const MasterCode = "IITTradeScheme";
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveData() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      this.toastr.error("Please enter required fields");
      return;
    }

    if (this.request.OrderID == 0) {
      this.toastr.warning("Please Add Transfer Details")
      return
    }
    debugger

    await this.GetRelieving_joining_CheckVacantPostModel();


    this.Swal2.Confirmation(this.PostMessage,
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          this.request.RequestedUserID = this.StaffListDDL.find((x: any) => x.StaffID == this.request.StaffID).UserID

          console.log()
          this.loaderService.requestStarted();
          this.isLoading = true;
          this.request.UserId = this.sSOLoginDataModel.UserID;
          this.request.RequestCreatedRoleID = this.sSOLoginDataModel.RoleID;
          this.request.RequestCreatedInstituteID = this.sSOLoginDataModel.InstituteID;

          try {
            this.request.Action = this.request.ServiceRequestId > 0 ? "UpdateRequest" : "AddRequest";
          
            console.log( "request",this.request)
            await this.userRequestService.UserRequest(this.request).then((data: any) => {
              if (data.State === EnumStatus.Success) {
                this.toastr.success(data.Message);
                this.router.navigate(['/transfer-request-accept'])
                setTimeout(() => {
                  this.groupForm.reset();
                }, 2000);
              }
              else if (data.State === EnumStatus.Warning) {
                this.toastr.warning(data.Message);
              }

              else {
                this.toastr.error(data.ErrorMessage);
              }
            });
          } catch (error) {
            console.error(error);
            this.toastr.error("An error occurred while saving the data.");
          } finally {
            this.loaderService.requestEnded();
            this.isLoading = false;
          }
        }
      });
    
  }

  async goBack() {
    window.location.href = '/transfer-request-accept';
  }

  async Get_ITIsData_ByID(Id: number) {    
    try {
      this.groupForm.get('ddlRequestType')?.disable();

      this.searchRequest.PageNumber = 0
      this.searchRequest.PageSize = 0
      this.searchRequest.Action = "GetByID";
      this.searchRequest.ServiceRequestId = Id;
      this.loaderService.requestStarted();
      await this.userRequestService.UserRequest(this.searchRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data.Data[0];

          this.OldDivisionID = data['Data'][0]['DivisionID'];
          this.OldInstituteID = data['Data'][0]['InstituteID']
          this.OldNodalDistrictID = data['Data'][0]['NodalDistrictID']
          this.OldOfficeID = data['Data'][0]['OfficeID']

          /*this.GetLevelList();*/
          this.request.LevelID = data['Data'][0]['LevelID']

          await this.GetOfficeList();
          this.request.OfficeID = data['Data'][0]['OfficeID']
          await  this.OfficeITIWiseCollege();
         
          this.request.DivisionID = data['Data'][0]['DivisionID']
        
          await this.ddlDivision_Change();
          await this.getITICollege();
          await this.ddl_DivisionID_Wise_District();
          this.request.InstituteID = data['Data'][0]['InstituteID']

          /*this.GetPostList();*/
          this.request.PostID = data['Data'][0]['PostID']        
          this.request.StaffTypeID = data['Data'][0]['StaffTypeID']
         /* alert(this.request.StaffTypeID);*/
          this.request.RequestDate = this.dateSetter(data['Data'][0]['RequestDate'])
          this.request.OrderDate = this.dateSetter(data['Data'][0]['OrderDate'])
          this.request.JoiningDate = this.dateSetter(data['Data'][0]['JoiningDate'])
          this.request.RequestDate = this.dateSetter(data['Data'][0]['RequestDate'])

          this.request.DivisionID = this.OldDivisionID;
          this.request.InstituteID = this.OldInstituteID;
          this.request.NodalDistrictID = this.OldNodalDistrictID;
          this.request.OfficeID = this.OldOfficeID;
        }, (error: any) => console.error(error))
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    //this.request = new ITIsDataModels()
  }

  async ddl_DivisionID_Wise_District() {
    
    try {
      this.loaderService.requestStarted();
      this.DistrictList = []
      await this.commonMasterService.DistrictMaster_DivisionIDWise(Number(this.request.DivisionID))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
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
  async ddl_DivisionID_Wise_District_search() {
    
    try {
      this.loaderService.requestStarted();
      this.DistrictList_search = []
      await this.commonMasterService.DistrictMaster_DivisionIDWise(Number(this.searchReq.DivisionID))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList_search = data['Data'];
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

  async OfficeITIWiseCollege() {
    
    this.request.DivisionID = 0;
    this.request.InstituteID = 0;
    this.request.NodalDistrictID = 0;
    if (this.request.OfficeID == 11) {
      
      this.groupForm.controls['ddlDistrictID'].clearValidators();
      this.groupForm.controls['divisionID'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlITICollegeTrade'].setValidators([DropdownValidators])
    }   

    else if (this.request.OfficeID == 15) {
      this.groupForm.controls['ddlITICollegeTrade'].clearValidators();
      this.groupForm.controls['divisionID'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlDistrictID'].setValidators([DropdownValidators])
    }
    else {
      this.groupForm.controls['divisionID'].clearValidators();
      this.groupForm.controls['ddlITICollegeTrade'].clearValidators();
      this.groupForm.controls['ddlDistrictID'].clearValidators();
    }

    this.groupForm.controls['divisionID'].updateValueAndValidity();
    this.groupForm.controls['ddlITICollegeTrade'].updateValueAndValidity();
    this.groupForm.controls['ddlDistrictID'].updateValueAndValidity();
    await this.GetDivisionMasterList();
    await this.GetPostList();
  }

  async OfficeITIWiseCollege_search() {
    await this.GetDivisionMasterList_search();
    // await this.GetPostList_search();
  }

  dateSetter(date: any) {
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
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
        }
        else {// type validation
          this.toastr.error('error this file ?')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadPublicInfoDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == "Photo") {
                
                this.request.AttachDocument_file = data['Data'][0]["Dis_FileName"];
                this.request.AttachDocument_fileName = data['Data'][0]["FileName"];

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
  }

  async GetDivisionMasterList() {
    try {
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionMasterList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async GetDivisionMasterList_search() {
    try {
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionMasterList_search = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async ddlDivision_Change() {
    
    this.request.InstituteID = 0;
    this.request.NodalDistrictID = 0;
    if (this.request.LevelID == 2 && this.request.OfficeID == 11) {
      await this.getITICollege();
      this.request.NodalDistrictID = 0;
      this.request.NodalStateID = 0;
      /*this.groupForm.controls['ddlITICollegeTrade'].setValidators([DropdownValidators]);*/
    } else if (this.request.LevelID == 2 && this.request.OfficeID == 15) {
      await this.ddl_DivisionID_Wise_District();
      this.request.InstituteID = 0;
      /*this.groupForm.controls['ddlDistrictID'].setValidators([DropdownValidators]);*/
    }
  }
  async ddlDivision_Change_search() {
    
    this.searchReq.InstituteID = 0;
    this.searchReq.NodalDistrictID = 0;
    if (this.searchReq.LevelID == 2 && this.searchReq.OfficeID == 11) {
      await this.ddl_DivisionID_Wise_District_search();
      await this.getITICollege_search();
      // this.searchReq.NodalDistrictID = 0;
    } else if (this.searchReq.LevelID == 2 && this.searchReq.OfficeID == 15) {
      await this.ddl_DivisionID_Wise_District_search();
      this.searchReq.InstituteID = 0;
    }
  }

    async FunctionRequestType(): Promise<void> {
    debugger
    await this.FunctionRequestTypeShowSomePropety();
  
    if (this.request.RequestType == 2) {
      this.getstatuId = Number(this.request.RequestType);
      try {
        this.isLoading = true;
        
        this.loaderService.requestStarted();

        this.getUserSerivecRequest.SSOID = this.sSOLoginDataModel.SSOID;

        debugger
        await this.userRequestService.GetITI_GetStaffDetailsVRS(this.getUserSerivecRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          let staffData = data?.Data?.[0]; // Assuming it's an array — update if it's an object
          if (staffData) {
            this.GetStaffDetailsVRS = data.Data;
            this.request.UserName = staffData.DisplayName;
            this.request.EmployeeNumber = staffData.EmployeeNumber;
            this.request.EmployeeDesignation = staffData.DesignationNameEnglish;
            this.request.OfficeID = staffData.OfficeID;
            this.request.ReqRoleID = staffData.RoleID;
            this.request.StaffTypeID = staffData.StaffTypeID;
            this.request.PostID = staffData.DesignationID;
          }
        }, error => console.error(error));

      } catch (error) {
        console.error("Error fetching staff details:", error);
        this.toastr.error("An error occurred while getting the data.");
      } finally {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }
    } 
    else {
      this.getstatuId = Number(this.request.RequestType);
    }    
  }

  async onSearch() {
    this.request = new RequestSearchModel();
    await this.GetStaffListDDL();
  }

  async onReset() {
    this.searchReq = new RequestSearchModel();
  }
  
  async FunctionRequestTypeShowSomePropety() {
    if (this.request.RequestType == 2) {

      this.groupForm.controls['ddlOffice'].clearValidators();
      this.groupForm.controls['ddlLevelID'].clearValidators();
      this.groupForm.controls['ddlDistrictID'].clearValidators();
      this.groupForm.controls['ddlITICollegeTrade'].clearValidators();
      this.groupForm.controls['ddlStaffType'].clearValidators();
      this.groupForm.controls['ddlPost'].clearValidators();
      this.groupForm.controls['txtOrderNo'].clearValidators();
      this.groupForm.controls['txtOrderDate'].clearValidators();
      this.groupForm.controls['ddlLevelID'].clearValidators();
      this.groupForm.controls['txtOrderNo'].clearValidators();
      this.groupForm.controls['txtOrderDate'].clearValidators();
      
    } else {
      this.groupForm.controls['ddlOffice'].setValidators([DropdownValidators]);
      // this.groupForm.controls['DDlReqRoleID'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlDistrictID'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlITICollegeTrade'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlStaffType'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlPost'].setValidators([DropdownValidators]);
    }
    this.groupForm.controls['ddlOffice'].updateValueAndValidity();
    // this.groupForm.controls['DDlReqRoleID'].updateValueAndValidity();
    this.groupForm.controls['ddlDistrictID'].updateValueAndValidity();
    this.groupForm.controls['ddlITICollegeTrade'].updateValueAndValidity();
    // this.groupForm.controls['ddlStaffType'].updateValueAndValidity();
    // this.groupForm.controls['ddlPost'].updateValueAndValidity();
  }

  async GetStaffListDDL() {
    try {
      const request: any = {};
      if(this.sSOLoginDataModel.RoleID == EnumRole.DTETraing || this.sSOLoginDataModel.RoleID == EnumRole.DTE_TrainingT2_establishment){
        request.InstituteID=this.searchReq.InstituteID
        request.LevelID = this.searchReq.LevelID
        request.OfficeID = this.searchReq.OfficeID
        request.DivisionID = this.searchReq.DivisionID
        request.NodalDistrictID = this.searchReq.NodalDistrictID
        request.SSOID = this.searchReq.SSOID
      } else {
        request.InstituteID = this.sSOLoginDataModel.InstituteID;
        request.OfficeID = this.sSOLoginDataModel.OfficeID;
      }      
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.Action = 'StaffListDDL'
      await this.ITIGovtEMStaffMaster.ITI_EM_DropdownGetData(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffListDDL = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetRoleListDDL() {
    try {
      const request: any = {};
      request.InstituteID = this.sSOLoginDataModel.InstituteID;
      request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      request.RoleID = this.sSOLoginDataModel.RoleID;
      request.UserID = this.sSOLoginDataModel.UserID;
      request.Action = 'RoleListDDL'
      await this.ITIGovtEMStaffMaster.ITI_EM_DropdownGetData(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleListDDL = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetStaffDetailsByStaffID(StaffID: number) {
    if(!StaffID){
      return;
    }
    try {

      const request: any = {};
      request.UserID = StaffID;
      request.Action = 'StaffDetailsByStaffID'
      await this.ITIGovtEMStaffMaster.ITI_EM_DropdownGetData(request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.formData = data.Data[0];
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetOrderList() {
    try {

      this.PostSanctionList = []

      var obj = {
        MasterCode: 'TransferOrderNo',
        FilterBy: this.OrderDate

      }
      this.loaderService.requestStarted();
      await this.commonMasterService.CommonMasterDataByAction(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.OrderList = data['Data'];

          // console.log(this.DivisionMasterList)
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



  async getExaminerData() {
    this.ordersearchRequest.SanctionID = this.OrderType
    this.ordersearchRequest.OrderDate = this.OrderDate
    this.PostSanctionList = []
    try {
      await this.ScholarshipService.GetsanctionOrderNotAssign(this.ordersearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.PostSanctionList = data.Data;
        console.log("this.PostSanctionList", this.PostSanctionList)
        debugger
        //this.PostSanctionList = this.PostSanctionList.filter((item: any) =>

        //  !this.request.OrderDetailsList.some((order: any) => order.SanctionID === item.SanctionID)
        //);
      })
    } catch (error) {
      console.error(error);
    }
  }

  deletePost(index: any): void {
    debugger
    this.request.OrderID=0
    this.filterplanorderList.splice(index, 1);

  }


  AddPost() {


    const IsSelect = this.PostSanctionList.filter((e: any) => e.Marked == true);

    if (IsSelect.length == 0) {
      this.toastr.warning("Please Select Any Order First");
      return;
    }

    if (!this.filterplanorderList) {
      this.filterplanorderList = [];
    }

    IsSelect.forEach((item: any) => {
      const exists = this.filterplanorderList.some(
        (x: any) => x.SanctionID === item.SanctionID
      );




      if (!exists) {
 
        this.request.OrderID=item.ID
        this.filterplanorderList.push(item);
      }
    });
  }

  async onRoleChange() {
    if(this.request.ReqRoleID == 97){
      await this.DuplicateNodal();
    }
  }

  async DuplicateNodal() {
   
    this.NodalsearchRequest.DistrictID = this.request.NodalDistrictID;
    this.NodalsearchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.NodalsearchRequest.LevelID = this.request.LevelID;
    try {
      await this.ITIGovtEMStaffMaster.GetITI_Govt_CheckDistrictNodalOffice(this.NodalsearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


          }
          else if (data.State == EnumStatus.Warning) {            
            this.toastr.warning(data.Message);
            this.request.ReqRoleID = 0;
          }
          else {
            this.toastr.error(data.ErrorMessage);
            this.request.ReqRoleID = 0;
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }


  async GetRelieving_joining_CheckVacantPostModel() {
    try {
      debugger
      this.requestCheckVacantPost.Action = "Relieving_CheckVacantPost";
      this.requestCheckVacantPost.OfficeID = this.request.OfficeID;
      this.requestCheckVacantPost.InstituteID = this.request.InstituteID;
      this.requestCheckVacantPost.StaffTypeID = this.request.StaffTypeID;
      this.requestCheckVacantPost.DesignationID = this.request.PostID;
      await this.ITIGovtEMStaffMaster.Relieving_joining_CheckVacantPostModel(this.requestCheckVacantPost).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.PostMessage = "Are you sure you want to make transfer request";
        }
        else if (data.State === EnumStatus.Warning) {
          this.PostMessage = data.Message;
        }
        else {
          this.PostMessage = data.Message;
        }
      })
    } catch (error) {
      console.error
    }
  }

}
