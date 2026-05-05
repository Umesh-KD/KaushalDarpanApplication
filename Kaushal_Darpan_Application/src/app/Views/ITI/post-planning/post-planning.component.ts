import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BTERGovtEMStaff_ServiceDetailsOfPersonalModel, BTERGovtEMStaffMasterDataModel, BTER_Govt_EM_ZonalOFFICERSSearchDataModel, UpdateSSOIDByPricipleModel, BTER_Govt_EM_PersonalDetailByUserIDSearchModel, Bter_RequestUpdateStatus, BTER_Govt_EM_ServiceDeleteModel, OfficeVacancyModel } from '../../../Models/BTER/BTER_EstablishManagementDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
/*import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';*/
import { BTEREstablishManagementService } from '../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumProfileStatus, EnumEMProfileStatus, EnumOffice }
  from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { BTERCollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { ITIGovtEMStaffMaster } from '../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { ITIOfficeVacancyModel } from '../../../Models/ITIGovtEMStaffMasterDataModel';
import { ItiTradeSearchModel } from '../../../Models/CommonMasterDataModel';
import { ItiSanctionOrderList } from '../../../Models/ITI/ItiReportDataModel';
import { HiringRoleMasterService } from '../../../Services/HiringRoleMaster/hiring-role-master.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-post-planning',
  standalone: false,
  templateUrl: './post-planning.component.html',
  styleUrl: './post-planning.component.css'
})
export class PostPlanningComponent {
  public AddOfficeVacancyForm!: FormGroup;
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
  OfficeVacancyList: ITIOfficeVacancyModel[] = [];
  OfficeVacancy: ITIOfficeVacancyModel[] = [];
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
  public _EnumOffice = EnumOffice;

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ITIGovtEMStaffMaster: ITIGovtEMStaffMaster, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService, 
    private ScholarshipService: HiringRoleMasterService,
  ) { }

  async ngOnInit() {

    this.AddOfficeVacancyForm = this.formBuilder.group({
      OfficeID: [0, [DropdownValidators]],
      ddlCollege: [0, [DropdownValidators]],
      InstituteID: [0, []],
      StaffTypeID: [0, [DropdownValidators]],
      DesignationID: [0, [DropdownValidators]],
      NodalDistrictID: [0, [DropdownValidators]],
      TradeID: [0,],
      TotalSeatID: ['', [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern("^[0-9]*$")]],
      Comments: [''],
      PostSanctionDate: [''],
      PostSanctionedID: ['', [DropdownValidators]]
    });

    this.groupForm = this.formBuilder.group({
      OfficeID: [0, [DropdownValidators]],
      ddlCollege: [0, [DropdownValidators]],
      InstituteID: [0, []],
      StaffTypeID: [0, [DropdownValidators]],
      DesignationID: [0, [DropdownValidators]],
      TotalSeatID: ['', [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern("^[0-9]*$")]],
      Comments: [''],
      TradeID: [0,],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;
    await this.GetCollegesListAll();
    await this.OfficeVacancyDataList();
    await this.GetOfficeList();
    await this.GetInstitute();
    await this.GetStaffTypeData();
    await this.GetTradeData();
    await this.GetOrderDetailsList();
    /* await this.GetPostList();*/
    console.log(this.sSOLoginDataModel);
  }
  get _AddOfficeVacancyForm() {
    return this.AddOfficeVacancyForm.controls;
  }
  get _groupForm() {
    return this.groupForm.controls;
  }

  tempIndex: number = 1;

  async addOfficeVacancy() {
    debugger
    const formValues = this.AddOfficeVacancyForm.value;

    // Validate required fields before adding
    if (!formValues.Comments || !formValues.DesignationID || !formValues.OfficeID || !formValues.StaffTypeID
      || !formValues.TotalSeatID
      || !formValues.PostSanctionedID
    ) {
      this.toastr.warning("Please fill all required fields before adding.");
      return;
    }


    if (formValues.StaffTypeID == 2 && !formValues.TradeID) {
      this.toastr.warning("Please fill all required fields before adding.");
      return;
    }

    if(formValues.OfficeID == EnumOffice.ITI && !formValues.ddlCollege){
      this.toastr.warning("Please fill all required fields before adding.");
      return;
    }

    if(formValues.OfficeID == EnumOffice.NODAL_OFFICE && !formValues.NodalDistrictID){
      this.toastr.warning("Please fill all required fields before adding.");
      return;
    }

    const getoffice = this.OfficeList.find((item: any) => item.ID == formValues.OfficeID);
    const getdesignation = this.PostList.find((item1: any) => item1.ID == formValues.DesignationID);
    const gettrade = this.TradeList?.find(
      (item4: any) => item4.Id == formValues?.TradeID
    ) || '';
    const OrderName = this.AcademicOrderNoList.find((item5: any) => item5.SanctionID == formValues.PostSanctionedID);

    const getstaffType = this.StaffTypeList.find((item3: any) => item3.ID == formValues.StaffTypeID);
    const getNodalDistrictName = this.DistrictList.find((x: any) => x.ID == formValues.NodalDistrictID)?.Name || '';
    let getinstitute = [];

    if (formValues.ddlCollege && formValues.ddlCollege !== 0) {
      getinstitute = this.ItiCollegesListAll.filter((item2: any) => item2.ID == formValues.ddlCollege) || [];
    } else {
      getinstitute = [];
    }

    const getinstituteName = getinstitute.length > 0 ? getinstitute[0].Name : '';

    console.log(getinstituteName);

    const vacancyData: any = {
      Comments: formValues.Comments,
      DesignationID: formValues.DesignationID,
      InstituteID: formValues.InstituteID || 0,  // fallback if null
      OfficeID: formValues.OfficeID,
      StaffTypeID: formValues.StaffTypeID,
      TotalSeatID: formValues.TotalSeatID,
      PlanningID: formValues.ddlCollege||0,
      NodalDistrictID: formValues.NodalDistrictID||0,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CreatedBy: this.sSOLoginDataModel.UserID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeID: 1,
      ActiveStatus: true,
      DeleteStatus: false,
      RTS: '',
      ModifyBy: 0,
      ModifyDate: '',
      IPAddress: '',
      ID: 0,
      RemainingSeatID: 0,
      OfficeName: getoffice.Name,
      DesignationName: getdesignation.Name,
      InstituteName: getinstituteName,
      StaffTypeName: getstaffType.Name,
      PostedSeat: 0,
      TradeID: formValues.TradeID,
      TradeName: gettrade?.TradeName||'',
      Index: this.tempIndex++,
      PostSanctionDate: formValues.PostSanctionDate,
      PostSanctionedID: formValues.PostSanctionedID,
      OrderName: OrderName.OrderNo,
      NodalDistrictName: getNodalDistrictName,
    };

    console.log('Vacancy being added:', vacancyData);

    this.OfficeVacancyList.push(vacancyData); // Add to array
    this.OfficeVacancy = this.OfficeVacancyList;
    this.toastr.success("Vacancy added successfully.");

    this.AddOfficeVacancyForm.reset(); // Reset form after adding
    this.formData.PlanningID=0
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

    if (this.OfficeVacancy.length === 0) {
      this.toastr.warning("Please add at least one valid vacancy before saving.");
      return;
    }

    try {
      this.loaderService.requestStarted();

      await this.ITIGovtEMStaffMaster.Save_M_OfficeVacancy_IU(this.OfficeVacancy).then((data: any) => {
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
    


    if (ID === undefined || ID === null) {
      ID = 0;
    }
    if (index === undefined || index === null) {
      index = 0;
    }

    if (ID == 0 && index != 0) {

      this.OfficeVacancyList = this.OfficeVacancyList.filter(item => item.Index !== index);
      this.OfficeVacancy = [...this.OfficeVacancyList];
      this.OfficeVacancyList = [...this.OfficeVacancyList];


    }
    else if (ID != 0) {
      try {
        this.deleteRequest.ID = ID;
        this.loaderService.requestStarted();
        await this.ITIGovtEMStaffMaster.DeleteOfficeVacancy(this.deleteRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.AddOfficeVacancyForm.reset();
            this.OfficeVacancyList = [];
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
      debugger
      await this.ITIGovtEMStaffMaster.OfficeVacancyListPlanning(this.SearchData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeVacancyList = data['Data'];
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

  //async GetInstitute() {
  //  await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
  //    data = JSON.parse(JSON.stringify(data));
  //    this.InstituteMasterDDLList = data.Data;
  //    console.log("Institute Master List ==>", this.InstituteMasterDDLList);
  //  })
  //}


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


  //async GetTradeData() {

  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.().then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.TradeList = data.Data;
  //      console.log("StaffTypeList", this.StaffTypeList);
  //    });
  //  } catch (error) {
  //    console.error(error);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async fillupDesignation() {


    await this.GetPostList();
  }

  async GetPostList() {
    try {

      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetCommonMasterData('PostMaster', this.formData.StaffTypeID);
      this.PostList = data['Data'];
      //this.PostList = this.PostList.filter((item: any) => item.TypeID == this.formData.StaffTypeID);
      // Keep original list for filtering later
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
        await this.fillupDesignation();
        this.formData.PlanningID = this.formData.InstituteID;
        await this.GetTradeData();
        // ✅ Then patch values
       

        this.groupForm.patchValue({
          DesignationID: Number(this.formData.DesignationID),
          TradeID: Number(this.formData.TradeID),
          InstituteID: Number(this.formData.InstituteID)
        });

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
  //async Function_UpdateVacancyPost(model: any, userSubmitData: any) {
  //  debugger;
  //  try {
  //    this.modalReference = this.modalService.open(model, {
  //      size: 'sm',
  //      backdrop: 'static'
  //    });

  //    if (userSubmitData != null) {

  //      // Assign data
  //      this.formData = { ...userSubmitData };

  //      // ✅ FIRST load dropdown data
  //      await this.fillupDesignation();

  //      // ✅ THEN patch values (important)
  //      this.groupForm.patchValue({
  //        DesignationID: Number(this.formData.DesignationID),
  //        TradeID: Number(this.formData.TradeID),
  //        InstituteID: Number(this.formData.InstituteID)
  //      });

  //      // ✅ Handle disable/enable logic
  //      if (this.formData.PostedSeat !== 0) {

  //        this.groupForm.get('OfficeID')?.disable();
  //        this.groupForm.get('StaffTypeID')?.disable();

  //        if (this.formData.InstituteID !== 0) {
  //          this.formData.PlanningID = this.formData.InstituteID;
  //          this.groupForm.get('ddlCollege')?.disable();
  //        }

  //      } else {

  //        this.groupForm.get('OfficeID')?.enable();
  //        this.groupForm.get('StaffTypeID')?.enable();

  //        if (this.formData.InstituteID !== 0) {
  //          this.groupForm.get('InstituteID')?.enable();
  //        }
  //      }

  //    } else {
  //      this.formData = new ITIOfficeVacancyModel();
  //      this.groupForm.reset();
  //    }

  //  } catch (error) {
  //    console.error('Error fetching data:', error);
  //  }
  //}
  //async Function_UpdateVacancyPost(model: any, userSubmitData: any) {
  //  debugger
  //  try {
  //    this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
  //    if (userSubmitData!=null) {
  //      this.formData = userSubmitData;
  //      this.formData.DesignationID = userSubmitData.DesignationID

  //      this.formData.InstituteID = this.formData.InstituteID

  //      this.groupForm.patchValue({
  //        DesignationID: this.formData.DesignationID,
  //        TradeID: this.formData.TradeID,
  //        InstituteID: this.formData.InstituteID

  //      });
  //      await this.fillupDesignation();
  //      if (this.formData.PostedSeat !== 0) {

  //        this.groupForm.get('OfficeID')?.disable();
  //        this.groupForm.get('StaffTypeID')?.disable();
  //        //this.groupForm.get('DesignationID')?.disable();
  //        if (this.formData.InstituteID !== 0) {
  //          this.formData.PlanningID = this.formData.InstituteID
  //          this.groupForm.get('ddlCollege')?.disable();
  //        }
  //      } else {


  //        this.groupForm.get('OfficeID')?.enable();
  //        this.groupForm.get('StaffTypeID')?.enable();
  //        //this.groupForm.get('DesignationID')?.enable();
  //        if (this.formData.InstituteID !== 0) {
  //          this.groupForm.get('InstituteID')?.enable();
  //        }
  //      }

        

       
  //    } else {
  //      this.formData = new ITIOfficeVacancyModel(); // or initialize with default values if needed
  //    }

  //    // If fillupDesignation is async, await it
      

  //  } catch (error) {
  //    console.error('Error fetching data:', error);
  //  }
  //}



  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.formData = new ITIOfficeVacancyModel();
    this.isSubmitted = false;
  }


  async OnfinalSave() {

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
      this.AddOfficeVacancyForm.controls['PostSanctionDate'].disable()

    }
    
  }

  async onOfficeChange() {
    await this.ddl_DivisionID_Wise_District();
  }

  async ddl_DivisionID_Wise_District() {
    try {
      this.DistrictList = [];
      const DivisionID = 0;
      const StateID = 6;
      await this.commonMasterService.DistrictMaster_DivisionIDWise(DivisionID,StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
}
