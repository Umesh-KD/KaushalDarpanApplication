import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BTERGovtEMStaff_ServiceDetailsOfPersonalModel, BTERGovtEMStaffMasterDataModel, BTER_Govt_EM_ZonalOFFICERSSearchDataModel, UpdateSSOIDByPricipleModel, BTER_Govt_EM_PersonalDetailByUserIDSearchModel, Bter_RequestUpdateStatus, BTER_Govt_EM_ServiceDeleteModel, OfficeVacancyModel, BTER_GetStaffPersonalDetailsModel, BTER_EM_TransferSystemModle, BTER_EM_TransferSystemExtModle } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
/*import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';*/
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumProfileStatus, EnumEMProfileStatus }
  from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { BTERCollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { ITIOfficeVacancyModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ItiSanctionOrderList } from '../../../../Models/ITI/ItiReportDataModel';
import { HiringRoleMasterService } from '../../../../Services/HiringRoleMaster/hiring-role-master.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
@Component({
  selector: 'app-AddTransferRequest',
  standalone: false,
  templateUrl: './AddTransferRequest.component.html',
  styleUrl: './AddTransferRequest.component.css'
})
export class AddTransferRequestComponent {
  public AddTransferRequest!: FormGroup;
  public groupForm!: FormGroup;
  public formData = new ITIOfficeVacancyModel();
  public SearchData = new ITIOfficeVacancyModel();
  public isSubmitted: boolean = false;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public ItiCollegesListAll: any = [];
  public OrderNoList: any = [];
  public AcademicOrderNoList: any = [];
  public FinancialOrderNoList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel()
  public deleteRequest = new ITIOfficeVacancyModel();
  public ItiSanctionOrderList = new ItiSanctionOrderList();
  @Output() IsPriorityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public currentDate = new Date();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];
  public InstituteMasterDDLList: any = [];
  public ITIGovtEMOFFICERSList: any[] = [];
  public OfficeList: any[] = [];
  public PostList: any = [];
  public StaffTypeList: any[] = []
  public TradeList: any[] = []
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
  public GetRoleID: number = 0
 
  OfficeVacancy: ITIOfficeVacancyModel[] = [];
  public ProfileStatus: number = 0;
  public ProfileStatusID: number = 0;
  public _EnumProfileStatus = EnumProfileStatus;
  public serviceDetailsRequest = new BTER_Govt_EM_PersonalDetailByUserIDSearchModel();
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public DdlType: string = "";
  public CheckUserID: number = 0
  public InsOfficeID: number = 21;
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public IsLockandSubmit: boolean = false;
  
  

  //test
  StaffTransferList: BTER_EM_TransferSystemExtModle[] = [];
  StaffTransferObject: ITIOfficeVacancyModel[] = [];
  public file!: File;
  public Uploadfile: string = '';
  public GazettedList: any[] = [
    { ID: 1, Name: 'Gazetted' },
    { ID: 2, Name: 'Non-Gazetted' }
  ];

  public PriorityList: any[] = [
    { ID: 1, Name: '1' },
    { ID: 2, Name: '2' },
    { ID: 3, Name: '3' },
    { ID: 4, Name: '4' },
    { ID: 5, Name: '5' },
    { ID: 6, Name: '6' },
    { ID: 7, Name: '7' },
    { ID: 8, Name: '8' },
    { ID: 9, Name: '9' },
    { ID: 10, Name: '10' },
    { ID: 11, Name: '11' },
    { ID: 12, Name: '12' }
  ];


  public requestModel = new BTER_GetStaffPersonalDetailsModel();
  public request = new BTER_EM_TransferSystemModle();
  public req_child=new BTER_EM_TransferSystemExtModle();

  public GetStaffPersonalDetailsList: any = [];

  public GetTransfercateList: any = [];

  constructor(private commonMasterService: CommonFunctionService, private ITIGovtEMStaffMaster: ITIGovtEMStaffMaster, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService, private ScholarshipService: HiringRoleMasterService,
    private staffServiceDetailsService: BTEREMStaffServiceDetailsService, private appsettingConfig: AppsettingService,
  ) {

  }

  async ngOnInit() {

    this.AddTransferRequest = this.formBuilder.group({
      TransferCategoryID: [0, [DropdownValidators]],
      SupportingDocuments: ['', [Validators.required]],
      ReasonDescription: ['', [Validators.required]],
      // Priority: [0, [DropdownValidators]],
      // OfficeID: [0, [DropdownValidators]],
      Priority: [0],
      OfficeID: [0],
      ddlCollege: [0, []],
      ddlDistrictID: [0, []],
      PostID: [{ value: 0, disabled: true }],
    });

    // this.groupForm = this.formBuilder.group({
    //   OfficeID: [0, [DropdownValidators]],
    //   ddlCollege: [0, [DropdownValidators]],
    //   InstituteID: [0, []],
    //   StaffTypeID: [0, [DropdownValidators]],
    //   DesignationID: [0, [DropdownValidators]],
    //   TotalSeatID: ['', [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern("^[0-9]*$")]],
    //   Comments: [''],
    //   TradeID: [0,],
    // });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;
    await this.GetCollegesListAll();
    await this.OfficeVacancyDataList();
    await this.GetOfficeList();
    await this.GetInstitute();
    await this.GetStaffTypeData();
    await this.GetOrderDetailsList();
    console.log(this.sSOLoginDataModel);
    ///test
    await this.GetStaffPersonalDetails();
    await this.ddl_District();

    

    await this.commonMasterService.GetCommonMasterDDLByType('TransferRequest').then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.GetTransfercateList = data['Data'];
      console.log(this.GetTransfercateList, "GetTransfercateList");
    });

  }
  get _AddOfficeVacancyForm() {
    return this.AddTransferRequest.controls;
  }
  get _groupForm() {
    return this.groupForm.controls;
  }



  tempIndex: number = 1;

  async addStaffTransferRequest() {
    debugger

    // if(this.AddTransferRequest.invalid){
    //   this.toastr.error("Please fill in all required fields.");
    //   return;
    // }
    if(this.req_child.OfficeID==undefined || this.req_child.OfficeID==null || this.req_child.OfficeID==0 || this.req_child.Priority==undefined || this.req_child.Priority==null || this.req_child.Priority==0 ){
      this.toastr.warning("Please select Office and Priority.");
      return;
    }
    const formValues = this.AddTransferRequest.value;

    const getoffice = this.OfficeList.find((item: any) => item.ID == formValues.OfficeID);
    const getdesignation = this.PostList.find((item1: any) => item1.ID == this.req_child.PostID);
   
    const Non_Gazetted = this.GazettedList.find((item: any) => item.ID == this.request.NonGazettedID);

    const District=this.DistrictList.find((item:any)=>item.ID==formValues.ddlDistrictID);

    const Priority=this.PriorityList.find((item:any)=>item.ID==formValues.Priority)?.Name;
    const DistrictName=District?.Name || '';
    /*const getstaffType = this.StaffTypeList.find((item3: any) => item3.ID == formValues.StaffTypeID);*/
    this.req_child.PostID=this.GetStaffPersonalDetailsList[0]["DesignationID"];
    let getinstitute = [];

    if (formValues.ddlCollege && formValues.ddlCollege !== 0) {
      getinstitute = this.ItiCollegesListAll.filter((item2: any) => item2.ID == formValues.ddlCollege) || [];
    } else {
      getinstitute = [];
    }

    const getinstituteName = getinstitute.length > 0 ? getinstitute[0].Name : '';

    console.log(getinstituteName);

    const StaffTransferData: any = {
     
      PostID: this.req_child.PostID,
      // InstituteID: formValues.InstituteID || 0,  // fallback if null
      OfficeID: formValues.OfficeID,
      // StaffTypeID: formValues.StaffTypeID,
      // TotalSeatID: formValues.TotalSeatID,
      InstituteID: formValues.ddlCollege||0,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CreatedBy: this.sSOLoginDataModel.UserID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      DistrictID:this.req_child.DistrictID,
      CourseTypeID: 1,
      ActiveStatus: true,
      DeleteStatus: false,
      RTS: '',
      ModifyBy: 0,
      ModifyDate: '',
      IPAddress: '',
      ID: 0,
      RemainingSeatID: 0, 
      OfficeName: getoffice?.Name,
      DesignationName: getdesignation?.Name,
      InstituteName: getinstituteName,
      NonGazetteName: Non_Gazetted.Name,
      DistrictName:DistrictName,
      Priority: this.StaffTransferList.length + 1,
      PostedSeat: 0,
      // TradeID: formValues.TradeID,
    
      Index: this.tempIndex++,
      // PostSanctionDate: formValues.PostSanctionDate,
      // PostSanctionedID: formValues.PostSanctionedID,
    

    };

    console.log('Vacancy being added:', StaffTransferData);

    this.StaffTransferList.push(StaffTransferData); 
    this.StaffTransferList = this.StaffTransferList;
    this.toastr.success("Vacancy added successfully.");

    // this.AddTransferRequest.reset(); 
    this.AddTransferRequest.get('OfficeID')?.reset(0);
    this.AddTransferRequest.get('ddlCollege')?.reset(0);
    
     this.GetPostList();
      this.req_child.PostID=this.GetStaffPersonalDetailsList[0]["DesignationID"];
  }


  async GetCollegesListAll() {

    try {

      await this.commonMasterService.GetCommonMasterData('PlanningCollege').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiCollegesListAll = data.Data
        console.log(this.ItiCollegesListAll, "ItiCollegesListAll")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async SaveData() {
    debugger
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.isSubmitted = true;

    if (this.StaffTransferList.length <3) {
      this.toastr.warning("Please add at least three valid vacancy before saving.");
      return;
    }
    
    if(this.request.SupportingDocuments==undefined || this.request.SupportingDocuments==null || this.request.SupportingDocuments==""){
      this.toastr.error("Please upload supporting documents.");
      return;
    }
    if(this.AddTransferRequest.invalid){
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.request.CreatedBy=this.sSOLoginDataModel.UserID;
    this.request.UserID=this.sSOLoginDataModel.UserID;
    this.request.SSOID=this.sSOLoginDataModel.SSOID;
    this.request.TransferExtDetails=this.StaffTransferList;
    this.request.StaffID=this.sSOLoginDataModel.StaffID??0;
    try {
      this.loaderService.requestStarted();

      await this.staffServiceDetailsService.Save_StaffTansferRequestDetails(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {

          this.OfficeVacancy = [];
          this.OfficeVacancyDataList();
          this.toastr.success('Data saved successfully!');

          window.location.reload();
          // Clear array after successful save
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });

    } catch (error) {
      console.error("Error saving data:", error);
      this.toastr.error("An unexpected error occurred while saving data.");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  async removeLeave(index: number, ID: number) {
    debugger
    if (ID === undefined || ID === null) {
      ID = 0;
    }
    if (index === undefined || index === null) {
      index = -1;
    }


    if (ID == 0 && index >-1) {
      this.StaffTransferList.splice(index, 1);
      // this.StaffTransferList = this.StaffTransferList.filter((item:any) => item.idx !== index);
      // this.StaffTransferObject = [...this.StaffTransferList];
      // this.StaffTransferList = [...this.StaffTransferList];
    }
    else if (ID != 0) {
      try {
        this.deleteRequest.ID = ID;
        this.loaderService.requestStarted();
        await this.ITIGovtEMStaffMaster.DeleteOfficeVacancy(this.deleteRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.AddTransferRequest.reset();
            this.StaffTransferList = [];
            this.OfficeVacancyDataList();
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
    else {

    }

  }





  ResetControl() {
    this.isSubmitted = false;
    this.formData = new ITIOfficeVacancyModel();

    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }

  async OfficeVacancyDataList() {
    
    try {
      this.loaderService.requestStarted();
      this.SearchData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchData.EndTermID = this.sSOLoginDataModel.EndTermID;

      // await this.ITIGovtEMStaffMaster.OfficeVacancyListPlanning(this.SearchData)
      //   .then((data: any) => {
      //     data = JSON.parse(JSON.stringify(data));
      //     this.StaffTransferList = data['Data'];
      //   }, error => console.error(error));
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

  ///ddl binding


  async GetOfficeList() {
  
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_ITI_GovtEMDDLOfficeVacancy(this.sSOLoginDataModel.DepartmentID, 0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList");
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


  async GetInstitute() {
    await this.commonMasterService
      .InstituteMaster(
        this.sSOLoginDataModel.DepartmentID,
        this.sSOLoginDataModel.Eng_NonEng,
        this.sSOLoginDataModel.EndTermID
      )
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        //  Filter only InstitutionManagementTypeID = 1
        this.InstituteMasterDDLList = data.Data;

        console.log("Filtered Institute Master List ==>", this.InstituteMasterDDLList);
      });
  }


  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PostType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetTradeData() {

    this.tradeSearchRequest.action = 'Posttrade'
    this.tradeSearchRequest.CollegeID = this.formData.PlanningID
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeList = data.Data
        console.log(this.TradeList, "ItiTradeListAll")
      })

      //this.collegeSearchRequest.action = '_getAllData'
      //await this.commonFunctionService.ItiCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.ItiCollegesListAll = data.Data
      //  console.log(this.ItiCollegesListAll, "ItiCollegesListAll")
      //})
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetPostList() {
    try {
      debugger
      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetCommonMasterData('GazettedNonGazettedPost',0,0, this.request.NonGazettedID);
      this.PostList = data['Data'];
      console.log(this.PostList, "PostList");
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async Function_UpdateVacancyPost(model: any, userSubmitData: any) {
    debugger;
    try {

      // ✅ FIX: remove focus from background element
      (document.activeElement as HTMLElement)?.blur();

      this.modalReference = this.modalService.open(model, {
        size: 'sm',
        backdrop: 'static'
      });

      if (userSubmitData != null) {

        this.formData = userSubmitData;

        // ✅ Load dropdown first
       /* await this.fillupDesignation();*/
        this.formData.PlanningID = this.formData.InstituteID;
        await this.GetTradeData();
        // ✅ Then patch values
       

        // this.groupForm.patchValue({
        //   DesignationID: Number(this.formData.DesignationID),
        //   TradeID: Number(this.formData.TradeID),
        //   InstituteID: Number(this.formData.InstituteID)
        // });

        // ✅ Your original logic (unchanged)
        if (this.formData.PostedSeat !== 0) {

          this.groupForm.get('OfficeID')?.disable();
          this.groupForm.get('StaffTypeID')?.disable();
          this.groupForm.get('DesignationID')?.disable();

          if (this.formData.InstituteID !== 0) {
            this.formData.PlanningID = this.formData.InstituteID;
            this.groupForm.get('ddlCollege')?.disable();
          }

        } else {

          this.groupForm.get('OfficeID')?.enable();
          this.groupForm.get('StaffTypeID')?.enable();
          this.groupForm.get('DesignationID')?.enable();

          if (this.formData.InstituteID !== 0) {
            this.groupForm.get('InstituteID')?.enable();
          }
        }

      } else {
        this.formData = new ITIOfficeVacancyModel();
        this.groupForm.reset();
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
 


  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.formData = new ITIOfficeVacancyModel();
    this.isSubmitted = false;
  }


  async OnfinalSave() {
    if (this.StaffTransferList.length <3) {
      this.toastr.warning("Please add at least three valid vacancy before saving.");
      return;
    }
    
    if(this.request.SupportingDocuments==undefined || this.request.SupportingDocuments==null || this.request.SupportingDocuments==""){
      this.toastr.error("Please upload supporting documents.");
      return;
    }
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    // await for open model
    await this.childComponent.OpenOTPPopup();
    // await OTP verification
    await this.childComponent.waitForVerification();
    this.SaveData()
  }

  async VacancyPostUpdate() {
    debugger
    try {
      if (this.formData.ID != 0) {
        await this.ITIGovtEMStaffMaster.UpdateOfficeVacancy(this.formData).then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.CloseModal();
            await this.OfficeVacancyDataList();
            this.formData = new ITIOfficeVacancyModel();
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message);
          } else {
            this.toastr.error('Some error! Please check.');
          }
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      this.toastr.error("An unexpected error occurred while saving data.");
    }
  }

  async OfficeVacancyActiveDeActive(ID: number, IsActive: boolean) {
    if (ID != 0) {
      this.formData.ID = ID;
      this.formData.ActiveStatus = IsActive;
      await this.ITIGovtEMStaffMaster.OfficeVacancyActiveDeActive(this.formData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.OfficeVacancyDataList();
          this.formData = new ITIOfficeVacancyModel();
          // Clear array after successful save
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });
    }
  }

  async GetOrderDetailsList() {
    

    try {
      this.loaderService.requestStarted();
      this.ItiSanctionOrderList.InstituteID = this.formData.PlanningID

      await this.ScholarshipService.GetsanctionOrder(this.ItiSanctionOrderList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        // this.request = data.Data[0];
        this.OrderNoList = data.Data;
        this.AcademicOrderNoList = this.OrderNoList.filter((x: any) => x.ParentID == 3);
        this.FinancialOrderNoList = this.OrderNoList.filter((x: any) => x.ParentID == 2);


        this.GetTradeData()

        console.log(this.OrderNoList, "orderlist");
      });
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async OnOrderChange(type: number) {
    
    if (type == 1) {
      const item = this.AcademicOrderNoList.find(
        (e: any) => e.ID == this.formData.PostSanctionedID
      );

      this.formData.PostSanctionDate = item?.OrderDate ?? '';
      this.AddTransferRequest.controls['PostSanctionDate'].disable()

    }
    
  }
  //test

  async GetStaffPersonalDetails() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.requestModel.StaffID = this.sSOLoginDataModel.StaffID;

      await this.staffServiceDetailsService.GetStaffPersonalDetails(this.requestModel).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        
        this.GetStaffPersonalDetailsList = data['Data'];
        this.request.SSOID = this.GetStaffPersonalDetailsList[0]["SSOID"];
        this.request.EmployeeName = this.GetStaffPersonalDetailsList[0]["DisplayName"];
        this.request.EmployeeDesignation = this.GetStaffPersonalDetailsList[0]["DesignationNameEnglish"];
        this.request.NonGazettedID = this.GetStaffPersonalDetailsList[0]["ISNonGazetted"];
        this.req_child.PostID=this.GetStaffPersonalDetailsList[0]["DesignationID"];
         this.GetPostList();

        console.log(this.OrderNoList, "orderlist");
      });
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async onFilechange(event: any, Name: any) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        // Type validation
        if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select valid file type jpg/jpeg/png/pdf');
          this.Uploadfile = '';
          event.target.value = null;
          return;
        }

        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "BTER_Establishment/TransferRequestDocument";

        //Upload to server folder
        await this.commonMasterService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              if (Name == 'SupportingDocuments') {
                this.request.SupportingDocuments = data['Data'][0]["FileName"];
                this.request.SupportingDocumentsDis = data['Data'][0]["Dis_FileName"];
              }  else {
                this.toastr.warning("no action provided")
              }
            }

            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async ddl_District() {

    try {
      this.loaderService.requestStarted();
      this.DistrictList = [];
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


  async getITICollege() {
    try {
      debugger
      await this.commonMasterService.GetInstituteMaster_ByDistrictWise(this.req_child.DistrictID, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ItiCollegesListAll = data['Data'];
         
        }, error => console.error(error));

    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }



  priorityUp(index: number)
  {
    if (index > 0) {
      let temp: any;
   
      temp = this.StaffTransferList[index];
      this.StaffTransferList[index] = this.StaffTransferList[index - 1];
      this.StaffTransferList[index - 1] = temp;
      this.StaffTransferList[index].Priority = index + 1;
      this.StaffTransferList[index - 1].Priority = index;
   

      this.IsPriorityChange.emit(true)
    }
  }

  priorityDown(index: number) {

      let temp: any;
   
    temp = this.StaffTransferList[index];
    this.StaffTransferList[index] = this.StaffTransferList[index + 1];
    this.StaffTransferList[index + 1] = temp;
    this.StaffTransferList[index].Priority = index + 1;
    this.StaffTransferList[index + 1].Priority = index + 2;

      this.IsPriorityChange.emit(true)
    
  }


  deleteRow(index: number) {
   
    this.StaffTransferList.splice(index, 1);
    this.StaffTransferList.forEach((item, i) => {
        item.Priority = i + 1;
      });
    
    this.IsPriorityChange.emit(true)
  }


}
