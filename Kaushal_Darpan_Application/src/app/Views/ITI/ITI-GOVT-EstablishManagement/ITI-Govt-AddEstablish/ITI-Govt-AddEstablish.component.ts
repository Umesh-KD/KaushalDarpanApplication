import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterDataModel, ITIGovtEMStaffMasterSearchModel, ITIGovtEMStaffHostelListModel, UpdateSSOIDByPricipleModel, RequestUpdateStatus, ITI_Govt_EM_UserRequestHistoryListSearchDataModel, DeleteModel, ITT_EM_ApproveStaffDataModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, ITIGovtEM_EnumStaffType, ITIGovtEM_EnumStaffLevel, ITIGovtEM_EnumStaffLevelChild, EnumEMProfileStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { ItiTradeSearchModel, StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-ITI-Govt-AddEstablish',
  standalone: false,

  templateUrl: './ITI-Govt-AddEstablish.component.html',
  styleUrl: './ITI-Govt-AddEstablish.component.css'
})
export class ITIGovtAddEstablishComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITIGovtEMAddStaffBasicDetailDataModel();
  public isSubmitted: boolean = false;
  public searchRequest = new ITIGovtEMStaffMasterSearchModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public isLoading: boolean = false;
  public deleteRequest = new DeleteModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];

  public StaffMasterList: any = [];
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;
  // New Work Pawan 18-02-2025
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
  public ListITICollegeByManagement: any = [];
  public StaffPostTypeList: any = [];
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number = 0
  public requestSSoApi = new CommonVerifierApiDataModel();
  public isSSOVisible: boolean = false;
  public GetDesignationID: number = 0
  public PostList: any = [];
  public RequestUpdateStatus = new RequestUpdateStatus();
  public approveRequest = new ITT_EM_ApproveStaffDataModel();
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public filteredStatusList: any[] = [];
  public TradeList: any[] = [];
  public type: string = ''
  StaffMasterFormGroup!: FormGroup;
  public _ITIGovtEM_EnumStaffType = ITIGovtEM_EnumStaffType
  public _ITIGovtEM_EnumStaffLevel = ITIGovtEM_EnumStaffLevel
  public _ITIGovtEM_EnumStaffLevelChild = ITIGovtEM_EnumStaffLevelChild
  public searchRequestUserProfileStatus = new ITI_Govt_EM_UserRequestHistoryListSearchDataModel();
  public UserProfileStatusHistoryList: any = [];
  public StreamSearch = new StreamDDL_InstituteWiseModel();
  public CourseMasterDDL: any[] = [];
  public OfficeList: any = [];
  public OfficeWorkList: any = [];
  public InstituteMasterDDLList: any[] = [];
  public DesignationMasterDDLList: any = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public tradeSearchRequest = new ItiTradeSearchModel()
  constructor(private commonMasterService: CommonFunctionService, private Staffservice: ITIGovtEMStaffMaster, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService
  ) {

  }



  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;

    this.StaffMasterFormGroup = this.formBuilder.group({
      ddlStatus: [0, [DropdownValidators]],
      txtRemark: ['', Validators.required],
      /*DesignationID: [0, [DropdownValidators]],*/
      DesignationID: [{ value: 0, disabled: true }, [DropdownValidators]],
      WorkOfficeID: [0, [DropdownValidators]],
      IsExtraWorking: ['false'],
      IsEmpWorkingOnPost: [false],
      IsEmpWorkingOnDeputationFromOther: [''],
      EmpInstituteID: [0, [DropdownValidators]],
      IsEmpWorkingOnDeputationToOther: [false],
      EmpDeputatedInstituteID: [0,],
      IsSalaryDrawnFromSamePost: [false],
      SalaryDrawnPostID: [0, [DropdownValidators]],
      IsSalaryDrawnFromOtherInstitute: [''],
      SalaryDrawnInstituteID: [0, [DropdownValidators]],
      DateOfRetirement: [''],
      AnyCourtCasePending: ['', [Validators.required]],
      AnyDisciplinaryActionPending: ['', [Validators.required]],
    });

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      ddlStaffType: ['', [DropdownValidators]],
      ddlStaffLevel: [''],
      ddlStaffLevelChild: [''],
      ddlTrade: [''],
      ddlTechnician: [''],
      ddlITICollegeTrade: ['', [DropdownValidators]],
      txtSSOID: [{ value: '' }, [Validators.required]],
      txtName: [{ value: '', disabled: true }],
      txtMobileNo: [{ value: '', disabled: true }],
      txtEmailID: [{ value: '', disabled: true }],
      ddlHostel: [''],
      ddlPost: [{ value: ''  }, [DropdownValidators]],
      StaffPostTypeID: [{ value: 0 }, [DropdownValidators]],
    })

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['', [Validators.required]]
    });

    this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID

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
      IsVerified: false,
    };

    await this.GetStaffTypeData();
    await this.GetStatusList();
    await this.getITICollege();
    await this.GetAllData();

    await this.GetStaffPostTypeList();
    await this.StaffLevelType();
    await this.GetOfficeList();
    await this.StaffLevelChild();
    await this.GetTechnicianDll();
    /* await this.GetHostelData()*/
    await this.GetBranchesMasterData();
    await this.GetTradeData();
    await this.getInstituteMasterList();
    await this.GetPostList();
    await this.GetDesignationMasterData();
    this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.AddStaffBasicDetailFromGroup.get('ddlITICollegeTrade')?.disable();
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }
  get _StaffMasterFormGroup() { return this.StaffMasterFormGroup.controls; }

  async getITICollege() {
    try {
      this.searchRequestITi.Action = "_ITICollegeByManagementType";
      this.searchRequestITi.FinancialYearID = 9;
      this.searchRequestITi.ManagementTypeId = 0;

      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('GovtIti')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITICollegeByManagement = data['Data'];

          this.ListITICollegeByManagement = this.ListITICollegeByManagement.filter((item: any) => item.ID == this.sSOLoginDataModel.InstituteID)

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
  async GetAllData() {

    this.searchRequest.StaffLevelID = 0;
    this.searchRequest.StaffTypeID = 0;

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    try {
      this.loaderService.requestStarted();
      await this.Staffservice.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          /*this.StaffMasterList = this.StaffMasterList.fillter((item: any) => item.UserCreatedBy == this.sSOLoginDataModel.UserID)*/
          console.log(this.StaffMasterList)
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


  async EditInfo(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.GetByID(id)

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async AddValidationStaffWiseNon() {

    if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.NonTeaching) {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevel'].setValidators([DropdownValidators]);

    } else {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevel'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevel'].updateValueAndValidity();

  }

  async AddValidationStaffWise() {

    if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching) {
      this.AddStaffBasicDetailFromGroup.controls['ddlTrade'].setValidators([DropdownValidators]);

    } else {
      this.AddStaffBasicDetailFromGroup.controls['ddlTrade'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['ddlTrade'].updateValueAndValidity();

  }


  async AddValidationStaffLevelNon() {
    if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.NonTeaching) {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].setValidators([DropdownValidators]);
    }
    else if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching) {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].setValidators([DropdownValidators]);
    }
    else {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].updateValueAndValidity();
  }

  async GetChangeTechcian() {
    if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching && this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
      this.AddStaffBasicDetailFromGroup.controls['ddlTechnician'].setValidators([DropdownValidators]);
    } else {
      this.AddStaffBasicDetailFromGroup.controls['ddlTechnician'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['ddlTechnician'].updateValueAndValidity();

    this.formData.multiHostelIDs = "";
    if (this.formData.StaffLevelID == this._ITIGovtEM_EnumStaffLevel.HostelWarden) {
      await this.GetHostelData();

      this.AddStaffBasicDetailFromGroup.controls['ddlHostel'].setValidators([Validators.required]);
    }
    else {
      this.AddStaffBasicDetailFromGroup.controls['ddlHostel'].clearValidators();
    }

    this.AddStaffBasicDetailFromGroup.controls['ddlHostel'].updateValueAndValidity();
  }




  async GetByID(id: number) {

    this.formData = new ITIGovtEMAddStaffBasicDetailDataModel();

    try {

      this.loaderService.requestStarted();

      await this.Staffservice.GetByID(id, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'FFFFF');

          /*     this.formData = data['Data']*/

          this.formData.StaffID = data['Data']["StaffID"];

          this.formData.StaffTypeID = data['Data']["StaffTypeID"];

          await this.StaffLevelType()

          this.formData.StaffLevelID = data['Data']["StaffLevelID"];
          /* alert(this.formData.StaffLevelID)*/

          await this.StaffLevelChild()
          this.formData.StaffLevelChildID = data['Data']["StaffLevelChildID"];
          this.formData.SSOID = data['Data']["SSOID"];
          this.formData.RoleID = data['Data']["RoleID"];
          this.formData.Displayname = data['Data']["Name"];
          this.formData.DesignationID = data['Data']["DesignationID"];
          this.formData.StaffLevelChildID = data['Data']["StaffLevelChildID"];
          this.formData.InstituteID = data['Data']["InstituteID"];
          if (this.formData.HostelIDs.length > 0) {
            // Assuming HostelList is an array of objects, and each object has a property 'HostelID'
            this.formData.multiHostelIDs = this.formData.HostelIDs.map((item: any) => item.ID).join(',');
          } else {
            this.formData.multiHostelIDs = "";
          }

          //this.formData.StaffLevelID;
          //this.formData.StaffTypeID ;


          await this.GetBranchesMasterData()
          this.formData.BranchID = data['Data']["CourseID"];

          /* await this.GetHOD_DDL()*/


          await this.GetTechnicianDll()
          this.formData.TechnicianID = data['Data']["TechnicianID"];

          await this.GetHostelData()



          this.formData.HostelIDs = data['Data']["StaffHostelListModel"];



          console.log(this.formData.HostelIDs)

          this.formData.HostelID = data['Data']["HostelID"];

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








  async OnConfirm(content: any, ID: number) {

    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;


    // Open the modal
    this.GetByID(ID)


  }

  // Method to close the modal when Close button is clicked
  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
  }

  async GetDetails_btnClick() {


    if (this.formData.SSOID != null && this.formData.SSOID != '') {
      const SSOID = this.formData.SSOID;

      const SSOUserName: string = "rti.test";
      const SSOPassword: string = "Test@1234";
      /*this.formData.Displayname = "ram";*/
      try {
        this.loaderService.requestStarted();

        await this.Staffservice.GetSSOIDDetails(SSOID, SSOUserName, SSOPassword)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.formData.Displayname = data.Dis_ProfileName;
            if (data.State === EnumStatus.Success) {
            }
          }, (error: any) => console.error(error));
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }
    else {
      this.ErrorMessage = "please enter the SSOID";
      this.toastr.error(this.ErrorMessage)
    }

  }

  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ITI_StaffType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async OnFormSubmit() {

    try {
      this.isSubmitted = true;
      if (this.AddStaffBasicDetailFromGroup.invalid) {
        return
      }

      this.isLoading = true;

      this.loaderService.requestStarted();

      this.formData.ModifyBy = this.sSOLoginDataModel.UserID;
      this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.formData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;

      if (this.formData.StaffLevelID != this._ITIGovtEM_EnumStaffLevel.HostelWarden) {
        this.formData.HostelID = 0;
      }

      if (this.formData.StaffID == 0 && this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.NonTeaching) {
        this.formData.StatusOfStaff = EnumStatusOfStaff.Draft;
      }

      if (this.formData.StaffID == 0 && this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching) {
        this.formData.StatusOfStaff = EnumStatusOfStaff.Draft;
      }

      if (this.formData.StaffLevelChildID != this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
        this.formData.TechnicianID = 0;
      }

      if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.HostelWarden) {
        if (this.sSOLoginDataModel.DepartmentID == 1) {
          this.formData.RoleID = 0;
        }
        else {
          if (this.sSOLoginDataModel.DepartmentID == 2 && this.sSOLoginDataModel.Eng_NonEng == 1) {
            this.formData.RoleID = 0;
          }
          else if (this.sSOLoginDataModel.DepartmentID == 2 && this.sSOLoginDataModel.Eng_NonEng == 2) {
            this.formData.RoleID = 0;
          }

        }


      }
      else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.TPO) {
        this.formData.RoleID = 0;
      }
      else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.GuestRoomWarden) {
        this.formData.RoleID = 0;
      }


      else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.Lecturer) {
        this.formData.RoleID = 0;
      }

      else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
        this.formData.RoleID = 0;
      }
      else {
        this.formData.RoleID = 0;
      }
      this.formData.EMTypeID = 1;

      if (this.formData.HostelIDs.length > 0) {
        // Assuming HostelList is an array of objects, and each object has a property 'HostelID'
        this.formData.multiHostelIDs = this.formData.HostelIDs.map((item: any) => item.ID).join(',');
      } else { this.formData.multiHostelIDs = "";}
       
      

      if (this.formData.StaffID == 0)
      {
        this.formData.OfficeID = this.sSOLoginDataModel.OfficeID;
      }
      /* alert('save data chek vaildation');*/
      //save
      await this.Staffservice.SaveStaffBasicDetails(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.GetAllData();

            const btnSave = document.getElementById('btnSave');
            if (btnSave) btnSave.innerHTML = "Submit";
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
            this.ResetControls();
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


  ResetControls() {
    this.isSubmitted = false;
    this.formData = new ITIGovtEMAddStaffBasicDetailDataModel();

    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.innerHTML = "Submit";
    this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
    this.isSSOVisible = false;
  }


  async ResetControlFilter() {
    this.isSubmitted = false;
    this.searchRequest.FilterStaffTypeID = 0;
    this.searchRequest.FilterSSOID = "";
    this.searchRequest.FilterName = "";
    await this.GetAllData();
  }

  // New Work Pawan 18-02-2025

  async StaffLevelType() {

    //this.formData.StaffLevelID = 0;


    this.AddValidationStaffWiseNon();
    this.AddValidationStaffWise();
    //  await this.GetPostList();  
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.StaffTypeID = this.formData.StaffTypeID;

    //Teaching=30
    if (this.searchRequest.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching) {
      this.formData.StaffLevelID = this._ITIGovtEM_EnumStaffLevel.TeachingRole;
      this.formData.BranchID = 0;
      await this.GetBranchesMasterData();
      this.formData.HostelID = 0;
      await this.StaffLevelChild();


    }
    //Non Teaching=31
    if (this.searchRequest.StaffTypeID == this._ITIGovtEM_EnumStaffType.NonTeaching) {
      this.HOD_DDlList = [];
      this.formData.HODsId = 0;
      this.formData.BranchID = 0;
      this.formData.TechnicianID = 0;

      await this.StaffLevelChild();


    }

    this.formData.Show_StaffLevelChild = false;
    /* alert(this.searchRequest.StaffTypeID)*/

    try {
      this.loaderService.requestStarted();
      await this.Staffservice.StaffLevelType(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "sss");
          this.StaffLevelList = data['Data'];
          this.StaffLevelList = this.StaffLevelList.filter((item: any) => item.ID == this._ITIGovtEM_EnumStaffLevel.Placement ||
            item.ID == this._ITIGovtEM_EnumStaffLevel.Staff || item.ID == this._ITIGovtEM_EnumStaffLevel.StoreKeeper || item.ID == this._ITIGovtEM_EnumStaffLevel.Admision);
          console.log(this.StaffLevelList, "StaffLevelList")
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
  async StaffLevelChild() {

    this.formData.StaffLevelChildID = 0;
    this.AddValidationStaffLevelNon();
    this.formData.Show_StaffLevelChild = true;
    this.searchRequest.StaffLevelID = this.formData.StaffLevelID;
    /* alert(this.searchRequest.StaffLevelID);*/


    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.Staffservice.StaffLevelChild(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffLevelChildList = data['Data'];
          this.StaffLevelChildList = this.StaffLevelChildList.filter((item: any) => item.ID != 15);
          //if (this.formData.BranchID != 0) {

          //} 
          console.log(this.StaffLevelChildList, "StaffLevelChildList")
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

  async GetBranchesMasterData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchesMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  //async GetHOD_DDL() {


  //  try {
  //    this.loaderService.requestStarted();

  //    await this.commonMasterService.GetHOD_DDL(this.formData.BranchID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.HOD_DDlList = data['Data'];
  //        this.formData.HODsId = this.HOD_DDlList.map((item: any) => item.ID);
  //        console.log('HOD_DDLList', this.HOD_DDlList)
  //      }, (error: any) => console.error(error)
  //      );
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


  async GetChange() {
    this.AddValidationStaffLevelNon();

    try {
      this.formData
      /* await this.GetHOD_DDL();*/
      await this.StaffLevelChild();

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

  async GetTechnicianDll() {

    try {
      this.loaderService.requestStarted();
      this.StaffParentID = 12;
      await this.commonMasterService.GetTechnicianDDL(this.StaffParentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TechnicianList = data['Data'];
          console.log('TechnicianList', this.TechnicianList)
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


  onItemSelect(item: any, centerID: number) {

    // If the item is not already in the HostelIDs array, add it
    if (!this.formData.HostelIDs.some(hostel => hostel.ID === item.ID)) {
      const selectedHostel = new ITIGovtEMStaffHostelListModel();
      selectedHostel.ID = item.ID;
      selectedHostel.Name = item.Name; // Optional: You may want to store the name as well.
      this.formData.HostelIDs.push(selectedHostel);
    }

    // Update the multiHostelIDs field with only the IDs as a comma-separated string
    this.formData.multiHostelIDs = this.formData.HostelIDs.map(hostel => hostel.ID).join(',');
  }

  //onSelectAll(items: any[], centerID: number) {
  //  
  //  this.HostelList = [...items];
  //  console.log(this.HostelList, 'ListDAtA')
  //  if (this.HostelList.length > 0)
  //  {
  //    this.formData.multiHostelIDs = this.HostelList.HostelIDs.map(ID).join(',');
  //  }
  //  console.log(this.formData.multiHostelIDs,'HostelIDSSSSS')
  //}

  onSelectAll(items: any[], centerID: number) {

    this.HostelList = [...items];
    console.log(this.HostelList, 'ListDAtA');

    if (this.HostelList.length > 0) {
      // Assuming HostelList is an array of objects, and each object has a property 'HostelID'
      this.formData.multiHostelIDs = this.HostelList.map((item: any) => item.ID).join(',');
    }

    console.log(this.formData.multiHostelIDs, 'HostelIDSSSSS');
  }



  onDeSelectAll(centerID: number) {

    //this.SelectedInstituteList = [];
    this.formData.multiHostelIDs = '';
  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  // multiselect events
  public onFilterChanges(item: any) {
    console.log(item);
  }
  public onDropDownCloses(item: any) {
    console.log(item);
  }

  public onItemSelects(item: any) {
    console.log(item);
  }
  public onDeSelects(item: any) {
    console.log(item);
  }




  //onItemSelect(item: any, centerID: number) {
  //  
  //  if (!this.formData.HostelIDs.includes(item.ID)) {  
  //    this.formData.HostelIDs.push(item.ID);  
  //  }
  //  this.formData.multiHostelIDs = this.formData.HostelIDs.join(','); 
  //}




  async GetHostelData() {
    try {
      this.loaderService.requestStarted();
      this.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.commonMasterService.GetHostelDDL(this.DepartmentID, this.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.HostelList = data.Data;
        console.log("HostelList", this.HostelList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async IsDeleteHostelWarden(SSOID: string) {
    this.Swal2.Confirmation("Are you sure you want to delete hostel warden?", async (result: any) => {
      if (result.isConfirmed) {

        //alert(SSOID);
        try {
          this.loaderService.requestStarted();

          await this.Staffservice.IsDeleteHostelWarden(SSOID)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));

              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              // Check if status update was successful
              if (this.State === EnumStatus.Success) {
                this.toastr.success(this.Message);


                window.location.reload();
                await this.GetAllData();

              } else {
                this.toastr.error(this.ErrorMessage);
              }
            }, (error: any) => console.error(error));
        } catch (ex) {
          console.log(ex);
        } finally {
          // End loading indicator
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
      else {
        window.location.reload();
        await this.GetAllData();
      }
    });
  }


  CloseModalPopup() {
    this.isSubmitted = false;

    this.modalService.dismissAll();

  }

  get _QueryReqFormGroup() {
    return this.QueryReqFormGroup.controls;
  }


  async GetPostList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PostMaster', this.formData.StaffPostTypeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
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


  async GetPopupSSOIDByPriciple(item: any) {

    //alert(item);
    this.searchRequestUpdateSSOIDByPricipleModel.StaffID = item;
    this.searchRequestUpdateSSOIDByPricipleModel.UserID = this.sSOLoginDataModel.UserID;
    this.ViewHistory(this.MyModel_ReplayQuery, item);
  }

  async ViewHistory(content: any, item: any) {

    console.log('item', item);

    this.searchRequestUpdateSSOIDByPricipleModel.StaffID = item;
    this.searchRequestUpdateSSOIDByPricipleModel.UserID = this.sSOLoginDataModel.UserID;

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //async UpdateSSOIDByPriciple() {
  //  
  //  try {
  //    await this.Staffservice.UpdateSSOIDByPriciple(this.searchRequestUpdateSSOIDByPricipleModel)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);

  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (data.State == EnumStatus.Success) {
  //          this.toastr.success(this.Message)
  //          this.ResetControls();
  //          this.CloseModalPopup();
  //          this.searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  //          this.GetAllData();

  //          const btnSave = document.getElementById('btnSave');
  //          if (btnSave) btnSave.innerHTML = "Submit";
  //        }
  //        else if (data.State == EnumStatus.Warning) {
  //          this.toastr.warning(this.ErrorMessage);
  //          this.ResetControls();
  //        }
  //        else {

  //          this.toastr.error(this.ErrorMessage)
  //        }

  //      }, (error: any) => console.error(error)
  //      );


  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //      // this.isLoading = false;

  //    }, 200);
  //  }
  //}

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {

    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      return;
    }

    const username = SSOID;
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {

      this.loaderService.requestStarted();
      this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            this.DuplicateCheck(this.requestSSoApi.SSOID);
            //this.formData.Displayname = parsedData.displayName
            this.isSSOVisible = true;
            this.formData.Displayname = parsedData.displayName;
            this.formData.MobileNo = parsedData.mobile;
            this.formData.Mailpersonal = parsedData.mailPersonal;
            this.formData.SSOID = parsedData.SSOID;
            this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.disable();
            if (parsedData.designation != null) {
              this.GetDesignationID = this.PostList.find((item: any) =>
                item.Name?.toLowerCase().trim() === parsedData.designation?.toLowerCase().trim()
              )?.ID ?? 0;

              this.formData.DesignationID = this.GetDesignationID;


            }
            else {
              this.formData.DesignationID = 0;
            }
          }
          else {
            this.toastr.error("Record Not Found");
            this.formData.SSOID = "";
            this.isSSOVisible = false;
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




    //try {
    //  this.loaderService.requestStarted();

    //  const result = await this.http.get<any>(url).toPromise();
    //  console.log('SSO Details:', result);



    //  return result;

    //} catch (ex) {
    //  console.error('Error fetching SSO details:', ex);
    //} finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }
  async DuplicateCheck(SSOID: string) {

    // console.log('id test ', this.searchRequest.DivisionID);
    try {
      this.loaderService.requestStarted();
      await this.Staffservice.ITIGovtEM_SSOIDCheck(SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


          }
          else if (data.State == EnumStatus.Warning) {

            const msg = `SSOID ${SSOID} is already mapped.To assign a new role, please use the Additional Role Mapping section.`;
            this.toastr.warning(msg);
            this.formData.SSOID = '';
            this.isSSOVisible = false;
            this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
          }
          else {
            this.toastr.error(data.ErrorMessage);
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

  async onCheckData(userSubmitData: any) {

    this.RequestUpdateStatus = { ...userSubmitData };
    /* this.RequestUpdateStatus.StaffID*/
    const id = userSubmitData.StaffID;
    /* window.open(`/ITIGOVTEMPersonalDetailsApplicationTab/${id}`);*/
    this.routers.navigate(['/ITIGOVTEMPersonalDetailsApplicationTab'], { queryParams: { id: id } });
    /* this.routers.navigate(['/ITIGOVTEMPersonalDetailsApplicationTab'])*/
  }


  async btnDelete_OnClick(UserID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          try {
            this.deleteRequest.ModifyBy = this.sSOLoginDataModel.UserID;
            this.deleteRequest.ID = UserID;
            //Show Loading
            this.loaderService.requestStarted();
            /*     alert(isParent)*/
            await this.Staffservice.ITIGovtEM_OfficeDelete(this.deleteRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.GetAllData()

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
      });
  }

  async onSubmit(model: any, userSubmitData: any) {

    try {

      

      this.approveRequest = { ...userSubmitData };
      /*  this.RequestUpdateStatus = { ...userSubmitData };*/
      this.approveRequest.StatusIDs = 0;
      this.approveRequest.Remark = '';
      this.approveRequest.WorkOfficeID = 0;
      if (this.approveRequest.DateOfBirth) {
        // Handle both "/" and "-" just in case
        const dateParts = this.approveRequest.DateOfBirth.includes('/')
          ? this.approveRequest.DateOfBirth.split('/')
          : this.approveRequest.DateOfBirth.split('-');

        const [dayStr, monthStr, yearStr] = dateParts;

        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10); // 1-12
        const year = parseInt(yearStr, 10);

        // Format DateOfBirth as yyyy-MM-dd
        const dob = new Date(year, month - 1, day);
        // this.approveRequest.DateOfBirth = dob.toISOString().split('T')[0]; // yyyy-MM-dd format

        // Calculate retirement year
        const retirementYear = year + 60;

        // Calculate Date of Retirement
        let retirementDate: Date;
        if (day === 1) {
          // Last date of previous month in retirement year
          retirementDate = new Date(retirementYear, month - 1, 0);
        } else {
          // Last date of current month in retirement year
          retirementDate = new Date(retirementYear, month, 0);
        }

        // Format retirement date as yyyy-MM-dd
        const rdDay = String(retirementDate.getDate()).padStart(2, '0');
        const rdMonth = String(retirementDate.getMonth() + 1).padStart(2, '0');
        const rdYear = retirementDate.getFullYear();

        this.approveRequest.DateOfRetirement = `${rdYear}-${rdMonth}-${rdDay}`;
      }

      this.approveRequest.IsExtraWorking = false;

      if (this.approveRequest.IsExtraWorking == false) {
        this.approveRequest.IsSalaryDrawnFromSamePost = true;
        this.approveRequest.IsSalaryDrawnFromOtherInstitute = false;

        this.approveRequest.IsEmpWorkingOnDeputationToOther = false;
      }
      else {
        this.approveRequest.IsSalaryDrawnFromSamePost = false;
        this.approveRequest.IsSalaryDrawnFromOtherInstitute = true;
        this.approveRequest.IsEmpWorkingOnDeputationToOther = false;
      }


      console.log(this.approveRequest, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async GetStatusList() {

    try {
      this.loaderService.requestStarted();
      this.type = 'ITIvtARRStauts';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.filteredStatusList = data['Data'];
          this.filteredStatusList = this.filteredStatusList.filter((item: any) => item.ID != this._EnumEMProfileStatus.Pending && item.ID != this._EnumEMProfileStatus.Completed && item.ID != this._EnumEMProfileStatus.LockAndSubmit)
          console.log(this.filteredStatusList, "GetStatusList")
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
  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.RequestUpdateStatus.StatusIDs = 0;
    this.RequestUpdateStatus.Remark = '';
    this.isSubmitted = false;
  }

  getInvalidControls(formGroup: FormGroup): string[] {
    const invalidControls: string[] = [];

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        // Recursively check nested groups
        invalidControls.push(...this.getInvalidControls(control));
      } else if (control && control.invalid) {
        invalidControls.push(key);
      }
    });

    return invalidControls;
  }


  async updateReqStatus() {

    if (this.approveRequest.StatusIDs == 247) {
      await this.refreshValidators();
    } else {
      await this.refreshRemoveRejectRevertValidators();
    }

    debugger

    this.isSubmitted = true;
    if (this.StaffMasterFormGroup.invalid) {
      const invalidControls = this.getInvalidControls(this.StaffMasterFormGroup);
      console.error("❌ Form validation failed. Missing/Invalid fields:", invalidControls);

      // Optional: show Toastr error to user
      this.toastr.error(`Please fill required fields: ${invalidControls.join(', ')}`);

      return; // Stop execution
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;


      if (this.RequestUpdateStatus.StatusIDs == 247) {
        this.RequestUpdateStatus.ProfileStatusID = 3;
      }
      else if (this.RequestUpdateStatus.StatusIDs == 248) {
        this.RequestUpdateStatus.ProfileStatusID = 5;
      }
      else if (this.RequestUpdateStatus.StatusIDs == 249) {
        this.RequestUpdateStatus.ProfileStatusID = 4;
      }

      await this.Staffservice.ITI_EM_PostWithVacancyApproveStaffProfile(this.approveRequest)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.CloseModal();
            this.GetAllData();
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
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

  CloseModalProfileStatuslist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }

  async onUserProfileStatusHistorylist(model: any, StaffUserID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequestUserProfileStatus.StaffUserID = StaffUserID;
      this.searchRequestUserProfileStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.Staffservice.UserProfileStatusHistoryList(this.searchRequestUserProfileStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserProfileStatusHistoryList = data.Data;


        }, (error: any) => console.error(error))

      console.log(StaffUserID, "modal");
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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





  async getStreamMasterData() {
    try {
      this.StreamSearch.InstituteID = this.sSOLoginDataModel.InstituteID
      this.StreamSearch.StreamType = this.sSOLoginDataModel.Eng_NonEng
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamDDLInstituteIdWise(this.StreamSearch).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CourseMasterDDL = data.Data;
        console.log("StreamMasterList", this.CourseMasterDDL)
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




  async GetOfficeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          this.OfficeWorkList = data['Data'];
          console.log(this.OfficeList, "OfficeList")
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


  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetITIPostDepartmentWise(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterDDLList = data.Data;
        //this.DesignationMasterDDLList = this.DesignationMasterDDLList.filter((item: any) => item.TypeID == this.approveRequest.StaffTypeID);
        // console.log("DesignationMasterList", this.DesignationMasterDDLList);
      }, error => console.error(error))

      //await this.commonMasterService.GetCommonMasterDDLByType('Gender')
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.GenderList = data['Data'];
      //    console.log("GenderList", this.GenderList);
      //  }, (error: any) => console.error(error)
      //  );
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async refreshValidators() {
    debugger;

    // Remove validators based on conditions
    if (this.approveRequest?.IsEmpWorkingOnDeputationFromOther === false || this.approveRequest?.IsEmpWorkingOnDeputationFromOther == null) {
      this.StaffMasterFormGroup.get('EmpInstituteID')?.removeValidators([DropdownValidators]);
    }

    if (this.approveRequest?.IsEmpWorkingOnDeputationToOther === false || this.approveRequest?.IsEmpWorkingOnDeputationToOther == null) {
      this.StaffMasterFormGroup.get('EmpDeputatedInstituteID')?.removeValidators([DropdownValidators]);
    }

    if (this.approveRequest?.IsSalaryDrawnFromSamePost === true) {
      this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.removeValidators([DropdownValidators]);
    }

    if (this.approveRequest?.IsSalaryDrawnFromOtherInstitute === false || this.approveRequest?.IsSalaryDrawnFromOtherInstitute == null) {
      this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.removeValidators([DropdownValidators]);
    }

    if (this.approveRequest?.HigherEduPermission === false || this.approveRequest?.HigherEduPermission == null) {
      this.StaffMasterFormGroup.get('HigherEduInstitute')?.removeValidators([Validators.required]);
    }

    // Update value & validity
    [
      'EmpInstituteID',
      'EmpDeputatedInstituteID',
      'SalaryDrawnPostID',
      'SalaryDrawnInstituteID',
      'HigherEduInstitute'
    ].forEach(controlName => {
      this.StaffMasterFormGroup.get(controlName)?.updateValueAndValidity();
    });
  }


  async refreshRemoveRejectRevertValidators() {
    debugger;

    this.StaffMasterFormGroup.get('DesignationID')?.removeValidators(DropdownValidators);
    this.StaffMasterFormGroup.get('WorkOfficeID')?.removeValidators(DropdownValidators);
    this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.removeValidators(DropdownValidators);
    this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.removeValidators(DropdownValidators);
    this.StaffMasterFormGroup.get('HigherEduInstitute')?.removeValidators(Validators.required);
    this.StaffMasterFormGroup.get('AnyCourtCasePending')?.removeValidators(Validators.required);
    this.StaffMasterFormGroup.get('AnyDisciplinaryActionPending')?.removeValidators(Validators.required);

    this.StaffMasterFormGroup.get('DesignationID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('WorkOfficeID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnPostID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('SalaryDrawnInstituteID')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('HigherEduInstitute')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('AnyCourtCasePending')?.updateValueAndValidity();
    this.StaffMasterFormGroup.get('AnyDisciplinaryActionPending')?.updateValueAndValidity();
  }

  onEmpWorkingChange(value: boolean) {
    debugger;
    this.approveRequest.IsEmpWorkingOnPost = value;

    if (value === true) {
      // If working on post is 'Yes', default salary drawn to 'No'
      this.approveRequest.IsSalaryDrawnFromSamePost = false;
    } else {
      // If working on post is 'No', default salary drawn to 'Yes'
      this.approveRequest.IsSalaryDrawnFromSamePost = true;
    }
  }

  onSalaryDrawnChange(value: boolean) {
    debugger;
    this.approveRequest.IsSalaryDrawnFromSamePost = value;

    if (value === true) {
      // If salary is drawn from same post 'Yes', working on post should be 'No'
      this.approveRequest.IsEmpWorkingOnPost = false;
    } else {
      // If salary is drawn from same post 'No', working on post should be 'Yes'
      this.approveRequest.IsEmpWorkingOnPost = true;
    }
  }

  WorkAccordingonSalaryDrawnChange(value: boolean) {
    debugger;
    /*this.approveRequest.IsSalaryDrawnFromSamePost = value;*/

    if (value === true) {
      // If salary is drawn from same post 'Yes', working on post should be 'No'
      this.approveRequest.IsSalaryDrawnFromSamePost = false;
      this.approveRequest.IsSalaryDrawnFromOtherInstitute = true;
      this.approveRequest.IsEmpWorkingOnDeputationFromOther = false;

    } else {
      // If salary is drawn from same post 'No', working on post should be 'Yes'
      this.approveRequest.IsSalaryDrawnFromSamePost = true;
      this.approveRequest.IsSalaryDrawnFromOtherInstitute = false;
      this.approveRequest.IsEmpWorkingOnDeputationFromOther = true;
    }
  }

  async GetStaffPostTypeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PostType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffPostTypeList = data.Data;
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

    this.tradeSearchRequest.action = 'Posttrade_EM'

    this.tradeSearchRequest.CollegeID = this.sSOLoginDataModel.InstituteID;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeList = data.Data
        console.log(this.TradeList, "ItiTradeListAll")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetIFMSDATA(SSOID: any) {
    try {
      this.loaderService.requestStarted();

      var request = {
        MasterCode: "GetDataFromIFMS",
        FilterBy: 'SSOID'
      }

      await this.commonMasterService.CommonMasterDataByAction(request).then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.isSSOVisible = true;
          this.formData.Displayname = data.Data[0].NAME_ENGLISH;
          this.formData.MobileNo = data.Data[0].MOB_NO;
          this.formData.Mailpersonal = data.Data[0].EMAIL;
          this.formData.SSOID = data.Data[0].EMPLOYEE_CODE;
          this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.disable();

        }
        else {
          this.toastr.warning('No Record Found');
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
  async onEdit(item: any)
  {
    debugger;

    this.isSSOVisible = true;
    this.formData.Displayname = item.Name;
    this.formData.MobileNo = item.MobileNumber;
    this.formData.Mailpersonal = item.Email;
    this.formData.SSOID = item.SSOID;
    this.formData.StaffID = item.StaffID;
    this.formData.InstituteId = item.InstituteID;

    this.formData.StaffPostTypeID = item.StaffPostTypeID;
    this.formData.OfficeID = item.OfficeID;
    //await this.GetPostList();
    await new Promise(resolve => setTimeout(resolve, 100));
    this.formData.DesignationID = item.DesignationID;
   // await this.StaffLevelType();
    await new Promise(resolve => setTimeout(resolve, 300));
    this.formData.StaffLevelID = item.StaffLevelID;
   // await this.StaffLevelChild();
    await new Promise(resolve => setTimeout(resolve, 300));
    this.formData.StaffLevelChildID = item.StaffLevelChildID;


    this.formData.StaffTypeID = item.StaffTypeID;

    await this.StaffLevelType();

/*    this.formData.StaffLevelID = item.StaffLevelID;*/
    this.formData.BranchID = item.TradeID;
    await this.GetChange();

    this.formData.TechnicianID = item.TechnicianID;


  }

  exportToPDF(): void {

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'Govt Establish Info Details',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    const body = this.StaffMasterList.map((row: any, index: number) => [
      index + 1,
      row.Name || '',
      row.SSOID || '',
      row.ServiceName || '',
      row.MobileNumber || '',
      row.DesignationName || '',
      row.OfficeName || '',
      row.DesignationName || '',
      row.StaffType || '',
      this.getProfileStatus(row.ProfileStatus)
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr. No.',
        'Employee Name',
        'Employee Id',
        'Service Category',
        'Mobile No',
        'Designation Name',
        'Office Name',
        'Post Deployed',
        'Cadre',
        'Profile Status'
      ]],

      body,

      theme: 'grid',

      styles: {
        fontSize: 7,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        cellPadding: 2
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });

    doc.save('Govt_Establish_Info_Details.pdf');
  }
  exportToExcel(): void {

    const exportData = this.StaffMasterList.map((row: any, index: number) => ({
      'Sr. No.': index + 1,
      'Employee Name': row.Name || '',
      'Employee Id': row.SSOID || '',
      'Service Category': row.ServiceName || '',
      'Mobile No': row.MobileNumber || '',
      'Designation Name': row.DesignationName || '',
      'Office Name': row.OfficeName || '',
      'Post Deployed': row.DesignationName || '',
      'Cadre': row.StaffType || '',
      'Profile Status': this.getProfileStatus(row.ProfileStatus)
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    ws['!cols'] = [
      { wch: 10 }, // Sr No
      { wch: 30 }, // Employee Name
      { wch: 20 }, // Employee Id
      { wch: 25 }, // Service Category
      { wch: 18 }, // Mobile
      { wch: 30 }, // Designation
      { wch: 35 }, // Office
      { wch: 25 }, // Post Deployed
      { wch: 20 }, // Cadre
      { wch: 20 }  // Profile Status
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff List');

    XLSX.writeFile(wb, 'StaffList.xlsx');
  }
  getProfileStatus(status: number): string {

    switch (status) {
      case 0:
        return 'Pending';

      case 1:
        return 'Complete';

      case 2:
        return 'Final Submit';

      case 3:
        return 'Approve';

      case 4:
        return 'Revert';

      case 5:
        return 'Reject';

      default:
        return '';
    }
  }
}
