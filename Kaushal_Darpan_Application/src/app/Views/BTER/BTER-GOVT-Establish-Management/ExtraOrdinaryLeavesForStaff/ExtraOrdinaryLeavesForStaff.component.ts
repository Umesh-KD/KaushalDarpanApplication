import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BTERGovtEMStaff_ServiceDetailsOfPersonalModel, BTERGovtEMStaffMasterDataModel, BTER_Govt_EM_ZonalOFFICERSSearchDataModel, UpdateSSOIDByPricipleModel, BTER_Govt_EM_PersonalDetailByUserIDSearchModel, Bter_RequestUpdateStatus, BTER_Govt_EM_ServiceDeleteModel, BTERExtraOrdinaryLeavesForStaffModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
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
  selector: 'app-ExtraOrdinaryLeavesForStaff',
  standalone: false,
  
  templateUrl: './ExtraOrdinaryLeavesForStaff.component.html',
  styleUrl: './ExtraOrdinaryLeavesForStaff.component.css'
})
export class ExtraOrdinaryLeavesForStaffComponent implements OnInit {
  public AddExtraOrdinaryLeaveForm!: FormGroup;
  public formData = new BTERExtraOrdinaryLeavesForStaffModel();
  public SearchData = new BTERExtraOrdinaryLeavesForStaffModel();
  public isSubmitted: boolean = false;


  public deleteRequest = new BTERExtraOrdinaryLeavesForStaffModel();

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
  leavesList: BTERExtraOrdinaryLeavesForStaffModel[] = [];
  leaves: BTERExtraOrdinaryLeavesForStaffModel[] = [];
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

    this.AddExtraOrdinaryLeaveForm = this.formBuilder.group({
      FromDate: ['', Validators.required],
      ToDate: ['', Validators.required],
      Comments: [''],
      LeaveDayCount: [{ value: 0, disabled: true }, Validators.required]
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.AddExtraOrdinaryLeaveForm.get('FromDate')!.valueChanges.subscribe(() => {
      this.updateLeaveDayCount();
    });

    this.AddExtraOrdinaryLeaveForm.get('ToDate')!.valueChanges.subscribe(() => {
      this.updateLeaveDayCount();
    });
     await this.GetUserProfileStatus();
   
    await this.BterExtraOrdinaryLeavesForStaffList();
    
    console.log(this.sSOLoginDataModel);
  }
  get _AddExtraOrdinaryLeaveForm() {
    return this.AddExtraOrdinaryLeaveForm.controls;
  }


  updateLeaveDayCount() {
    const fromDate = this.AddExtraOrdinaryLeaveForm.get('FromDate')!.value;
    const toDate = this.AddExtraOrdinaryLeaveForm.get('ToDate')!.value;

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      if (end >= start) {
        const timeDiff = end.getTime() - start.getTime();
        const dayCount = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
        this.AddExtraOrdinaryLeaveForm.get('LeaveDayCount')!.setValue(dayCount);
      } else {
        // If ToDate is before FromDate, reset the count and optionally clear ToDate
        this.AddExtraOrdinaryLeaveForm.get('LeaveDayCount')!.setValue(0);
      }
    } else {
      this.AddExtraOrdinaryLeaveForm.get('LeaveDayCount')!.setValue(0);
    }
  }

  addLeave() {
    if (this.AddExtraOrdinaryLeaveForm.valid) {
      const rawLeave = this.AddExtraOrdinaryLeaveForm.getRawValue() as BTERExtraOrdinaryLeavesForStaffModel;

      // Format the dates for comparison and storage
      const newLeave = {
        ...rawLeave,
        FromDate: this.formatDate(rawLeave.FromDate),
        ToDate: this.formatDate(rawLeave.ToDate)
      };

      // Check for duplicates after formatting
      const isDuplicate = this.leaves.some(leave =>
        leave.FromDate === newLeave.FromDate &&
        leave.ToDate === newLeave.ToDate &&
        leave.Comments === newLeave.Comments &&
        leave.LeaveDayCount === newLeave.LeaveDayCount
      );

      if (isDuplicate) {
        this.toastr.warning("This leave entry already exists!");
      } else {
        this.leaves.push(newLeave);
        this.AddExtraOrdinaryLeaveForm.reset();
        this.AddExtraOrdinaryLeaveForm.get('LeaveDayCount')!.setValue(0);
      }
    } else {
      this.toastr.error("Please fill all required fields correctly!");
    }
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  //removeLeave(index: number) {
  //  this.leaves.splice(index, 1);
  //}


  async removeLeave(index: number, ID: number) {
    debugger
    

    if (ID === undefined || ID === null) {
      ID = 0;
    }
    if (index === undefined || index === null) {
      index = 0;
    }

    if (ID == 0 && index != 0) {
      this.leaves.splice(index, 1);
    }
    else if (ID != 0) {
      try {
        this.deleteRequest.ID = ID;
        this.loaderService.requestStarted();
        await this.BTER_EstablishManagementService.DeleteBterExtraOrdinaryLeavesForStaff(this.deleteRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.leavesList = [];
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
    debugger
    if (this.leaves.length == 0) {
      this.toastr.error("Please Add At Least One Extra Ordinary Leaves For Staff");
      return;
    }
    
    this.leaves.forEach((element: any) => {
     
      element.CreatedBy = this.sSOLoginDataModel.UserID;
      element.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      element.StaffUserID = this.sSOLoginDataModel.UserID;      
      element.EndTermID = this.sSOLoginDataModel.EndTermID;      
    })

    try {
      this.loaderService.requestStarted();

      await this.BTER_EstablishManagementService.Save_BterExtraOrdinaryLeavesForStaff(this.leaves).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.leavesList = [];
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
    this.formData = new BTERExtraOrdinaryLeavesForStaffModel();
    
    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }

  async BterExtraOrdinaryLeavesForStaffList() {
   
    try {
      this.loaderService.requestStarted();
      this.SearchData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchData.EndTermId = this.sSOLoginDataModel.EndTermID;

      await this.BTER_EstablishManagementService.BterExtraOrdinaryLeavesForStaffList(this.SearchData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.leaves = data['Data'];
          
          console.log(this.leaves, "leaves data")
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


}
