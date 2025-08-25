import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel,  ITI_Govt_EM_SanctionedPostBasedInstituteModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';

@Component({
  selector: 'app-ITI-Govt-EM-SanctionedPostBasedInstitute',
  standalone: false,
  
  templateUrl: './ITI-Govt-EM-SanctionedPostBasedInstitute.component.html',
  styleUrl: './ITI-Govt-EM-SanctionedPostBasedInstitute.component.css'
})
export class ITIGovtEMSanctionedPostBasedInstituteComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITI_Govt_EM_SanctionedPostBasedInstituteModel();
  public isSubmitted: boolean = false;

  public searchRequest = new ITI_Govt_EM_ZonalOFFICERSSearchDataModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
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
  public InstituteList: any = [];
  public PostList: any = [];
  public P_GList: any = [];  
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number=0
  AddedSanctionedList: ITI_Govt_EM_SanctionedPostBasedInstituteModel[] = [];

  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;

  constructor(private commonMasterService: CommonFunctionService, private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService
  ) {

  }



  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      ddlInstituteID: [''],
      ddlSanctionedBudgetPostID: [''],
      txtSanctionedBudgetBusiness: [''],
      ddlP_GID: [''],
      txtEmpName: [''],
      txtSSOID: [''],
      ddlPersonnelPostID: [''],
      txtPersonnelBusiness: [''],
      txtPostingType: [''],
      txtDateOfJoiningRetiredPersonnelHonorarium: [''],
      txtDateDepartureAssignedWork: [''],
      txtBudgetChief: ['']     

    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });

 
    //this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID
   


  

    
    this.GetP_GList();
    this.GetInsituteList();
    this.GetPostList();
   /* await this.GetAllData()*/

   

   
    
    console.log(this.sSOLoginDataModel);
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  async GetInsituteList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID,0,0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteList = data['Data'];
          console.log(this.InstituteList, "InstituteList")
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

  async GetPostList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_PostMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
          console.log(this.PostList, "PostList")
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

  GetP_GList() {
    this.P_GList = [
      { ID: 1, Name: 'PERMANENT' },
      { ID: 2, Name: 'GUEST FACULTY' }
      
    ];
  }

  async AddAddedSanctioned() {
    
    this.isSubmitted = true;
    // If the form is invalid, return early
    if (this.AddStaffBasicDetailFromGroup.invalid) {
      return;
    }

    // Check for duplicate deployment dates in the AddedDeploymentList
    const isDuplicate = this.AddedSanctionedList.some((element: any) =>
      this.formData.SSOID === element.SSOID
    );

    if (isDuplicate) {
      this.toastr.error('SSO ID Already Exists.');
      return;
    } else {
      // Adding office and post names from the respective lists
      this.formData.SanctionedBudgetPostName = this.PostList.find((x: any) => x.ID == this.formData.SanctionedBudgetPostID)?.Name;
      this.formData.InstituteName = this.InstituteList.find((x: any) => x.InstituteID == this.formData.InstituteID)?.InstituteName;
      this.formData.PersonnelPostName = this.PostList.find((x: any) => x.ID == this.formData.PersonnelPostID)?.Name;
      this.formData.P_GName = this.P_GList.find((x: any) => x.ID == this.formData.P_GID)?.Name;
      

      // Push the deployment data into the AddedDeploymentList
      this.AddedSanctionedList.push({ ...this.formData });

      // Reset the deployment request object to clear the form fields
      this.formData = new ITI_Govt_EM_SanctionedPostBasedInstituteModel();

      // After adding, reset some form values if needed
      this.isSubmitted = false;
    }
  }


  async DeleteRow(item: ITI_Govt_EM_SanctionedPostBasedInstituteModel) {
    
    const index: number = this.AddedSanctionedList.indexOf(item);
    if (index != -1) {
      this.AddedSanctionedList.splice(index, 1)
    }
  }




  async DuplicateCheck(SSOID : string) {
    
   // console.log('id test ', this.searchRequest.DivisionID);
    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_SSOIDCheck(SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
          
           
          }
          else if (data.State == EnumStatus.Warning) {
            
            const msg = `SSOID ${SSOID} is already mapped.To assign a new role, please use the Additional Role Mapping section.`;
            this.toastr.warning(msg);
            this.formData.SSOID = '';
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



  

  async SaveData() {

    if (this.AddedSanctionedList.length == 0) {
      this.toastr.error("Please Add At Least One Sanctioned");
      return;
    }

    this.AddedSanctionedList.forEach((element: any) => {
     
      element.CreatedBy = this.sSOLoginDataModel.UserID;
      element.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      
    })
   
    try {
      this.loaderService.requestStarted();

      await this.ITIGovtEMStaffMasterService.ITIGovtEM_Govt_PersonnelDetailsInstitutionsAccordingBudget_Save(this.AddedSanctionedList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {    
          this.toastr.success(data.Message);
          this.AddedSanctionedList = [];
          this.routers.navigate(['/ITIGovtEMSanctionedPostBasedInstituteList']);
        }
        else if (data.State == EnumStatus.Warning) {
          const duplicateSSOIDs = data.Data.map((item: any) => item.SSOID).join(', ');
          const msg = `SSOID ${duplicateSSOIDs} is already mapped.To assign a new role, please use the Additional Role Mapping section.`;
          this.toastr.warning(msg);
          this.AddedSanctionedList = [];
        }
        else {
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


  async goBack() {
    window.location.href = '/ITIGovtEMSanctionedPostBasedInstituteList';
  }

  ResetControl() {
    this.isSubmitted = false;
    this.formData = new ITI_Govt_EM_SanctionedPostBasedInstituteModel();
    this.AddedSanctionedList = [];
    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }


 


  






 






}
