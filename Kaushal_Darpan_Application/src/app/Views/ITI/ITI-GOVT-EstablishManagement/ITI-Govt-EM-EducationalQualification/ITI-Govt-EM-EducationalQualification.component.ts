import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, ITI_Govt_EM_PersonalDetailByUserIDSearchModel, ITI_Govt_EM_EducationDeleteModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumProfileStatus, EnumEMProfileStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';

@Component({
  selector: 'app-ITI-Govt-EM-EducationalQualification',
  standalone: false,
  
  templateUrl: './ITI-Govt-EM-EducationalQualification.component.html',
  styleUrl: './ITI-Govt-EM-EducationalQualification.component.css'
})
export class ITIGovtEMEducationalQualificationComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel();
  public isSubmitted: boolean = false;

  public searchRequest = new ITI_Govt_EM_ZonalOFFICERSSearchDataModel();
  public deleteRequest = new ITI_Govt_EM_EducationDeleteModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
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
  public ExamOfLevelList: any = [];
  public ExamTypeList: any = [];
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number=0
  public ProfileStatusID: number=0
  public DdlType: string=''
  AddedEducationList: ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel[] = [];
  public educationDetailsRequest = new ITI_Govt_EM_PersonalDetailByUserIDSearchModel();
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public CheckUserID: number = 0
  public _EnumProfileStatus = EnumProfileStatus;
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public IsLockandSubmit: boolean = false;
  constructor(private commonMasterService: CommonFunctionService, private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService
  ) {

  }



  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      
      //ddlPost: ['', [DropdownValidators]],
      //txtSSOID: ['', Validators.required],
      ddlLevelOfExamId: ['', [DropdownValidators]],
      ddlExamTypeID: ['', [DropdownValidators]],
      //txtNameOfTheExam: ['', [Validators.required]],
      txtNameOfTheExam: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      /*txtNameOfTheBoard: ['', [Validators.required]],*/
      txtNameOfTheBoard: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      //txtStateOfTheBoard: [''], 
      txtStateOfTheBoard: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      txtDateOfPassing: [''],
      txtYearOfPassing: [''],
      //txtSubject_Occupation_Branch: [''],
      txtSubject_Occupation_Branch: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],
      //txtNameOfTheInstituteFromWherePassed: [''],
      txtNameOfTheInstituteFromWherePassed: ['', [Validators.pattern(/^[A-Za-z\s]+$/)]],

    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });

 
    //this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID
   



    this.formData.LevelOfExamID = 0;
    this.formData.ExamTypeID = 0;
  
    this.GetLevelOfExamList();
    this.GetExamTypeList();
   /* await this.GetAllData()*/

    this.CheckUserID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    console.log(this.CheckUserID)


    if (this.CheckUserID > 0) {
      this.sSOLoginDataModel.StaffID = this.CheckUserID;


      await this.GetEducationDetails();
    } else {
      this.CheckUserID = 0;
      this.sSOLoginDataModel.StaffID = this.sSOLoginDataModel.StaffID;
      if (this.sSOLoginDataModel.StaffID > 0) {
        await this.GetEducationDetails();
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


  async GetLevelOfExamList() {
    try {
      this.loaderService.requestStarted();
      this.DdlType = 'ExamOfLevel';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamOfLevelList = data['Data'];
          console.log(this.ExamOfLevelList, "ExamOfLevelList")
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
      await this.ITIGovtEMStaffMasterService.GetITI_Govt_EM_GetUserProfileStatus(this.sSOLoginDataModel.StaffID)
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

  async GetExamTypeList() {
    try {
      this.loaderService.requestStarted();
      this.DdlType = 'ExamType';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamTypeList = data['Data'];
          console.log(this.ExamTypeList, "ExamTypeList")
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
    const isDuplicate = this.AddedEducationList.some((element: any) =>
      this.formData.ExamTypeID === element.ExamTypeID &&
      this.formData.LevelOfExamID === element.LevelOfExamID &&
      this.formData.NameOfTheExam === element.NameOfTheExam
    );

    if (isDuplicate) {
      this.toastr.error('Level Of Exam and Exam Type Already Exists.');
      return;
    } else {
      // Adding office and post names from the respective lists
      this.formData.LevelOfExamName = this.ExamOfLevelList.find((x: any) => x.ID == this.formData.LevelOfExamID)?.Name;
      this.formData.ExamTypeName = this.ExamTypeList.find((x: any) => x.ID == this.formData.ExamTypeID)?.Name;
      

      // Push the deployment data into the AddedDeploymentList
      this.AddedEducationList.push({ ...this.formData });

      // Reset the deployment request object to clear the form fields
      this.formData = new ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel();

      // After adding, reset some form values if needed
      this.isSubmitted = false;
    }
  }


  async DeleteRow(item: ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel) {
    
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
              await this.ITIGovtEMStaffMasterService.ITI_Govt_EM_EducationalQualificationDeleteByID(this.deleteRequest)
                .then(async (data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  console.log(data)
                  this.State = data['State'];
                  this.Message = data['Message'];
                  this.ErrorMessage = data['ErrorMessage'];

                  if (this.State == EnumStatus.Success) {
                    this.toastr.success(this.Message)
                    //this.GetOfficeMasterList()
                    await this.GetEducationDetails();
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
            const index: number = this.AddedEducationList.indexOf(item);
            if (index != -1) {
              this.AddedEducationList.splice(index, 1)
              this.toastr.success("Deleted sucessfully")
            }
          }

        }

      });
  }


  async GetEducationDetails() {

    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      this.educationDetailsRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.educationDetailsRequest.StaffID = this.sSOLoginDataModel.StaffID;
      this.educationDetailsRequest.StaffUserID = this.sSOLoginDataModel.UserID;
      this.educationDetailsRequest.Action = 'UserEducationalQualification';
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_ITI_Govt_Em_PersonalDetailByUserID(this.educationDetailsRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          
          this.AddedEducationList = data['Data']['EducationalList'];
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



  

  async SaveData() {

    if (this.AddedEducationList.length == 0) {
      this.toastr.error("Please Add At Least One Educational Qualification");
      return;
    }

    this.AddedEducationList.forEach((element: any) => {
     
      element.CreatedBy = this.sSOLoginDataModel.UserID;
      element.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      element.StaffUserID = this.sSOLoginDataModel.UserID;
      
       
       
       
       
    })

    try {
      this.loaderService.requestStarted();

      await this.ITIGovtEMStaffMasterService.ITIGovtEM_Govt_StaffProfileQualification(this.AddedEducationList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddedEducationList = [];
          this.GetEducationDetails();
          this.tabChange.emit(2);
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
    this.formData = new ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel();
    this.AddedEducationList = [];
    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }




 


  






 






}
