import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BTERGovtEMStaff_ServiceDetailsOfPersonalModel, BTERGovtEMStaffMasterDataModel, BTER_Govt_EM_ZonalOFFICERSSearchDataModel, UpdateSSOIDByPricipleModel, BTER_Govt_EM_PersonalDetailByUserIDSearchModel, Bter_RequestUpdateStatus, BTER_Govt_EM_ServiceDeleteModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
/*import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';*/
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumProfileStatus, EnumEMProfileStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { BTERCollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';

@Component({
  selector: 'app-bter-Govt-EM-ServiceDetailsOfPersonal',
  standalone: false,
  
  templateUrl: './bter-Govt-EM-ServiceDetailsOfPersonal.component.html',
  styleUrl: './bter-Govt-EM-ServiceDetailsOfPersonal.component.css'
})
export class bterGovtEMServiceDetailsOfPersonalComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new BTERGovtEMStaff_ServiceDetailsOfPersonalModel();
  public isSubmitted: boolean = false;

  public searchRequest = new BTER_Govt_EM_ZonalOFFICERSSearchDataModel();
  public deleteRequest = new BTER_Govt_EM_ServiceDeleteModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new BTERGovtEMStaffMasterDataModel();
  public searchRequestITi = new BTERCollegeTradeSearchModel();
  public finalSubmitRequest = new Bter_RequestUpdateStatus();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];
  
  public ITIGovtEMOFFICERSList: any[] = [];
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;  
  public StaffLevelList: any = [];
  public StaffLevelChildList: any = [];
  public HostelList: any = [];
  public BranchesMasterList: any = [];
  public TechnicianList: any = [];
  public HOD_DDlList: any = [];
  public StaffParentID: number = 0;
  public settingsMultiselect: object = {};
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public OriginalPositionList: any = [];
  public CoreBusinessList: any = [];
  public DistrictList: any = [];
  public BlockList: any = [];
  public GramPanchayatList: any = [];
  public City_VillageList: any = [];
  public PostingDirectRecruitment_PromotionList: any = [];
  public CasteList: any = []; 
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number=0
  AddedServiceList: BTERGovtEMStaff_ServiceDetailsOfPersonalModel[] = [];
  AddedServiceListAdded: BTERGovtEMStaff_ServiceDetailsOfPersonalModel[] = [];
  public ProfileStatus: number = 0;
  public ProfileStatusID: number = 0;
  public _EnumProfileStatus = EnumProfileStatus;
  public serviceDetailsRequest = new BTER_Govt_EM_PersonalDetailByUserIDSearchModel();
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public DdlType: string = "";
  public CheckUserID: number = 0
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public IsLockandSubmit: boolean = false;
  constructor(private commonMasterService: CommonFunctionService, private BTER_EstablishManagementService: BTEREstablishManagementService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService
  ) {

  }



  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      
      //ddlPost: ['', [DropdownValidators]],
      //txtSSOID: ['', Validators.required],
      txtFromDate: ['', Validators.required],
      txtToDate: ['', Validators.required],
      ddlOriginalPositionID: ['', [DropdownValidators]],
      ddlCoreBusinessID: [''],
      ddlDistrictID: ['', DropdownValidators],
      ddlBlockID: ['', DropdownValidators],
      ddlGramPanchayatID: ['', DropdownValidators],
      txtNameOfRevenueVillage: [''],
      txtNameAndLocationOfTheInstitution_Office: [''],
      ddlCity_VillageID: ['', [DropdownValidators]],
      ddlPostingDirectRecruitment_PromotionID: ['', [DropdownValidators]],
      txtGradationOrderNumberAndDate: ['', Validators.required],
      ddlCasteID: [''],
      txtConfirmationDate: ['', Validators.required],
      txtDuffelCarriageOrderNoDate: [''],

    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });

    
    //this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID
   
    //this.CheckUserID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.CheckUserID = 0;
    console.log(this.CheckUserID,"uuuu")
 

    this.GetOriginalPositionList();
    this.GetCoreBusinessList();
    this.GetDistrictList();   
    this.GetCityVillageList();
    this.GetPostingDirectRecruitmentPromotionList();
    this.GetCasteList();
    await this.GetITI_Govt_EM_GetUserProfileStatus();
    await this.GetServiceDetailsList();
   /* await this.GetAllData()*/

   
    //if (this.sSOLoginDataModel.StaffID > 0) {
    //  await this.GetServiceDetails();
    //}


    if (this.CheckUserID > 0) {
      this.sSOLoginDataModel.StaffID = this.CheckUserID;


      await this.GetServiceDetails();
    } else {
      this.CheckUserID = 0;
      this.sSOLoginDataModel.StaffID = this.sSOLoginDataModel.StaffID;
      if (this.sSOLoginDataModel.StaffID > 0) {
        await this.GetServiceDetails();
      }
    }
    await this.GetUserProfileStatus();
    debugger
    if (this.CheckUserID == 0 && (this._EnumEMProfileStatus.LockAndSubmit == this.sSOLoginDataModel.ProfileID ||
      this._EnumEMProfileStatus.Approve == this.sSOLoginDataModel.ProfileID
      || this._EnumEMProfileStatus.Reject == this.sSOLoginDataModel.ProfileID)) {
      this.AddStaffBasicDetailFromGroup.disable();
      this.IsLockandSubmit = true;
    }
    else if (this.CheckUserID > 0 && (this._EnumEMProfileStatus.LockAndSubmit == this.ProfileStatusID ||
      this._EnumEMProfileStatus.Approve == this.ProfileStatusID
      || this._EnumEMProfileStatus.Reject == this.ProfileStatusID)) {
      this.AddStaffBasicDetailFromGroup.disable();
      this.IsLockandSubmit = true;
    }

    
    console.log(this.sSOLoginDataModel);
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  async GetOriginalPositionList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));     
          this.OriginalPositionList = data['Data'];
          console.log(this.OriginalPositionList, "OriginalPositionList")
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

  GetCoreBusinessList() {
    this.CoreBusinessList = [
      { ID: 1, Name: 'Education' },
      { ID: 2, Name: 'Administration' }
      
    ];
  }

  async GetDistrictList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
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

  async ddlDistrict_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.formData.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BlockList = data['Data'];
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


  async ddlBolck_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GramPanchayat(this.formData.BlockID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GramPanchayatList = data['Data'];
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


  GetCityVillageList() {
    this.City_VillageList = [
      { ID: 1, Name: 'City' },
      { ID: 2, Name: 'Village' }
    ];
  }

  GetPostingDirectRecruitmentPromotionList() {
    this.PostingDirectRecruitment_PromotionList = [
      { ID: 1, Name: 'Direct Recruitment' },
      { ID: 2, Name: 'Promotion' }
    ];
  }

  async GetCasteList() {
    try {
      this.loaderService.requestStarted();
      this.DdlType = 'Cate_Cast';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CasteList = data['Data'];
          console.log(this.CasteList, "CastList")
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

  async AddEducation() {
    
    this.isSubmitted = true;
    // If the form is invalid, return early
    if (this.AddStaffBasicDetailFromGroup.invalid) {
      return;
    }

    // Check for duplicate deployment dates in the AddedDeploymentList
    const isDuplicate = this.AddedServiceList.some((element: any) =>
      this.formData.DistrictID === element.DistrictID &&
      this.formData.BlockID === element.BlockID
      //&&
      //this.formData.GramPanchayatID === element.GramPanchayatID
    );

    if (isDuplicate) {
      this.toastr.error('District and Block Already Exists.');
      return;
    } else {
      // Adding office and post names from the respective lists
      this.formData.OriginalPositionName = this.OriginalPositionList.find((x: any) => x.ID == this.formData.OriginalPositionID)?.Name;
      this.formData.CoreBusinessName = this.CoreBusinessList.find((x: any) => x.ID == this.formData.CoreBusinessID)?.Name;
      this.formData.DistrictName = this.DistrictList.find((x: any) => x.ID == this.formData.DistrictID)?.Name;
      this.formData.BlockName = this.BlockList.find((x: any) => x.ID == this.formData.BlockID)?.Name;
      this.formData.GramPanchayatName = this.GramPanchayatList.find((x: any) => x.ID == this.formData.GramPanchayatID)?.Name;
      this.formData.City_Village = this.City_VillageList.find((x: any) => x.ID == this.formData.City_VillageID)?.Name;
      this.formData.PostingDirectRecruitment_Promotion = this.PostingDirectRecruitment_PromotionList.find((x: any) => x.ID == this.formData.PostingDirectRecruitment_PromotionID)?.Name;
      //this.formData.CasteName = this.CasteList.find((x: any) => x.ID == this.formData.CadreID)?.Name;
      this.formData.CadreID = 0;

      // Push the deployment data into the AddedDeploymentList
      this.AddedServiceList.push({ ...this.formData });

      // Reset the deployment request object to clear the form fields
      this.formData = new BTERGovtEMStaff_ServiceDetailsOfPersonalModel();

      // After adding, reset some form values if needed
      this.isSubmitted = false;
    }
  }


  async DeleteRow(item: BTERGovtEMStaff_ServiceDetailsOfPersonalModel) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          if (item.ID > 0) {
            try {
              this.deleteRequest.StaffID = item.ID;
              this.deleteRequest.UserID = this.sSOLoginDataModel.UserID;
              //Show Loading
              this.loaderService.requestStarted();
              /*     alert(isParent)*/
              await this.BTER_EstablishManagementService.BTER_Govt_EM_ServiceDetailsOfPersonnelDeleteByID(this.deleteRequest)
                .then(async (data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  console.log(data)
                  this.State = data['State'];
                  this.Message = data['Message'];
                  this.ErrorMessage = data['ErrorMessage'];

                  if (this.State == EnumStatus.Success) {
                    this.toastr.success(this.Message)
                    //this.GetOfficeMasterList()
                    await this.GetServiceDetails();
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

          else {
            const index: number = this.AddedServiceList.indexOf(item);
            if (index != -1) {
              this.AddedServiceList.splice(index, 1)
              this.toastr.success("Deleted sucessfully")
            }
          }

        }

      });
  }

  async GetITI_Govt_EM_GetUserProfileStatus() {
   
    try {
      this.loaderService.requestStarted();
      await this.BTER_EstablishManagementService.GetBTER_Govt_EM_GetUserProfileStatus(this.sSOLoginDataModel.StaffID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.Govt_EM_GetUserLevelDetails = data['Data'];
          this.ProfileStatus = data['Data'][0]["ProfileStatus"];
          /* alert(this.LevelID);*/
          //console.log(this.Govt_EM_GetUserLevelDetails, "Govt_EM_GetUserLevelDetails")
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

  DateCheckValidation() {
    
    // Convert to Date objects
    const fromDate = new Date(this.formData.FromDate);
    const toDate = new Date(this.formData.ToDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    toDate.setHours(0, 0, 0, 0);
    fromDate.setHours(0, 0, 0, 0);

   
    if (toDate < fromDate) {
      this.toastr.error("To Date cannot be earlier than From Date.");
      this.formData.ToDate = "";
      return;
    }
    if (fromDate > today) {
      this.toastr.error("From Date cannot be in the future.");
      this.formData.FromDate = "";
      return;
    }
   
    if (toDate > today) {
      this.toastr.error("To Date cannot be in the future.");
      this.formData.ToDate = "";
      return;
    }
  }


  async GetServiceDetails() {
    
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      this.serviceDetailsRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.serviceDetailsRequest.StaffID = this.sSOLoginDataModel.StaffID;
      this.serviceDetailsRequest.StaffUserID = this.sSOLoginDataModel.UserID;
      this.serviceDetailsRequest.Action = 'ServiceDetailsOfPersonnel';
      await this.BTER_EstablishManagementService.BTERGovtEM_BTER_Govt_Em_PersonalDetailByUserID(this.serviceDetailsRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);      
         
          this.AddedServiceList = data['Data']['PostingList'];

       


          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
  
  async GetServiceDetailsList() {
    debugger
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      this.serviceDetailsRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.serviceDetailsRequest.StaffID = this.sSOLoginDataModel.StaffID;
      this.serviceDetailsRequest.StaffUserID = this.sSOLoginDataModel.UserID;
      this.serviceDetailsRequest.Action = 'ServiceDetailsOfPersonnelList';
      await this.BTER_EstablishManagementService.BTERGovtEM_BTER_Govt_Em_PersonalDetailList(this.serviceDetailsRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);      
         
          this.AddedServiceListAdded = data['Data']['PostingList'];

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }


  //async GetAllData() {
  //  
  // // console.log('id test ', this.searchRequest.DivisionID);
  //  try {
  //    //this.loaderService.requestStarted();
  //    //await this.Staffservice.GetAllITI_Govt_EM_OFFICERS(this.searchRequest)
  //    //  .then((data: any) => {
  //    //    data = JSON.parse(JSON.stringify(data));
  //    //    console.log(data);
  //    //    this.ITIGovtEMOFFICERSList = data['Data'];
  //    //    console.log(this.ITIGovtEMOFFICERSList)
  //    //  }, (error: any) => console.error(error)
  //    //  );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async GetUserProfileStatus() {

    try {
      this.loaderService.requestStarted();
      await this.BTER_EstablishManagementService.GetBTER_Govt_EM_GetUserProfileStatus(this.sSOLoginDataModel.StaffID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.Govt_EM_GetUserLevelDetails = data['Data'];
          this.ProfileStatusID = data['Data'][0]["ProfileStatus"];
          /* alert(this.LevelID);*/
          //console.log(this.Govt_EM_GetUserLevelDetails, "Govt_EM_GetUserLevelDetails")
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
  

  async SaveData() {

    if (this.AddedServiceList.length == 0) {
      this.toastr.error("Please Add At Least One Service Details");
      return;
    }

    this.AddedServiceList.forEach((element: any) => {
     
      element.CreatedBy = this.sSOLoginDataModel.UserID;
      element.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      element.StaffUserID = this.sSOLoginDataModel.UserID;      
      
      
     
       
       
    })

    try {
      this.loaderService.requestStarted();

      await this.BTER_EstablishManagementService.BTERGovtEM_Govt_StaffProfileStaffPosting(this.AddedServiceList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddedServiceList = [];
          this.GetServiceDetails();
          this.GetServiceDetailsList();
          this.GetITI_Govt_EM_GetUserProfileStatus();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }


  async FinalSaveData() {
    this.finalSubmitRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.finalSubmitRequest.ID = this.sSOLoginDataModel.StaffID;
    try {
      this.loaderService.requestStarted();

      await this.BTER_EstablishManagementService.BTERFinalSubmitUpdateStaffProfileStatus(this.finalSubmitRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddedServiceList = [];
          this.sSOLoginDataModel.ProfileID = this._EnumEMProfileStatus.LockAndSubmit;
          this.commonMasterService.setsSOLoginDataModel(this.sSOLoginDataModel);

          this.GetServiceDetails();
          this.GetServiceDetailsList();
          this.GetITI_Govt_EM_GetUserProfileStatus();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  ResetControl() {
    this.isSubmitted = false;
    this.formData = new BTERGovtEMStaff_ServiceDetailsOfPersonalModel();
    this.AddedServiceList = [];
    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }




}
