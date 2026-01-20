import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BTERGovtEMStaff_ServiceDetailsOfPersonalModel, BTERGovtEMStaffMasterDataModel, BTER_Govt_EM_ZonalOFFICERSSearchDataModel, UpdateSSOIDByPricipleModel, BTER_Govt_EM_PersonalDetailByUserIDSearchModel, Bter_RequestUpdateStatus, BTER_Govt_EM_ServiceDeleteModel, OfficeVacancyModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
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
  selector: 'app-OfficeVacancy',
  standalone: false,
  
  templateUrl: './OfficeVacancy.component.html',
  styleUrl: './OfficeVacancy.component.css'
})
export class OfficeVacancyComponent implements OnInit {
  public AddOfficeVacancyForm!: FormGroup;
  public groupForm!: FormGroup;
  public formData = new OfficeVacancyModel();
  public SearchData = new OfficeVacancyModel();
  public isSubmitted: boolean = false;
 public isFinalSave:boolean=true;

  public deleteRequest = new OfficeVacancyModel();

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
  public BugetHeadList:any=[];
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
  OfficeVacancyList: OfficeVacancyModel[] = [];
  OfficeVacancy: OfficeVacancyModel[] = [];
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

    this.AddOfficeVacancyForm = this.formBuilder.group({
      OfficeID: [0, [DropdownValidators]],
      InstituteID: [0,[]],
      StaffTypeID: [0, [DropdownValidators]],
      DesignationID: [0, [DropdownValidators]],
      TotalSeatID: ['', [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern("^[0-9]*$")]],
      Comments: [''],
      BugetHeadID: [0, [DropdownValidators]]
    });

    this.groupForm = this.formBuilder.group({
      OfficeID: [0, [DropdownValidators]],
      InstituteID: [0, []],
      StaffTypeID: [0, [DropdownValidators]],
      DesignationID: [0, [DropdownValidators]],
      TotalSeatID: ['', [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern("^[0-9]*$")]],
      Comments: ['']
    });

    this.BugetHeadList = [
      { ID: 1, Name: 'State Plan Budget' },
      { ID: 2, Name: 'Center Plan Budget' },
      { ID: 3, Name: 'Unplanned Budget' }
    ];

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    
    await this.OfficeVacancyDataList();
    await this.GetOfficeList();
    await this.GetInstitute();
    await this.GetStaffTypeData();
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
    debugger;
    const formValues = this.AddOfficeVacancyForm.value;

    // Validate required fields before adding
    if (!formValues.Comments || !formValues.DesignationID || !formValues.OfficeID || !formValues.StaffTypeID || !formValues.TotalSeatID) {
      this.toastr.warning("Please fill all required fields before adding.");
      return;
    }
    await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.OfficeList = data['Data'];
        console.log(this.OfficeList, "OfficeList");
      }, error => console.error(error));

    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDLList = data.Data;
      console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
    })


    await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StaffTypeList = data.Data;
      console.log("StaffTypeList", this.StaffTypeList);
    });


    await this.commonMasterService.GetDesignationAndPostMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.PostList = data['Data'];
      console.log("PostList", this.PostList);
    });

    // const data: any = await this.commonMasterService.GetDesignationAndPostMaster();
    // this.PostList = data['Data'];
    

    const getoffice = this.OfficeList.find((item:any) => item.ID == formValues.OfficeID);
    const getdesignation = this.PostList.find((item1: any) => item1.ID == formValues.DesignationID);

    
   
    const getstaffType = this.StaffTypeList.find((item3: any) => item3.ID == formValues.StaffTypeID);

    let getinstitute = [];

    if (formValues.InstituteID && formValues.InstituteID !== 0) {
      getinstitute = this.InstituteMasterDDLList.filter((item2: any) => item2.InstituteID == formValues.InstituteID) || [];
    } else {
      getinstitute = [];
    }

    const getinstituteName = getinstitute.length > 0 ? getinstitute[0].InstituteName : '';

    console.log(getinstituteName); 

    const vacancyData: OfficeVacancyModel = {
      Comments: formValues.Comments,
      DesignationID: formValues.DesignationID,
      BugetHeadID:formValues.BugetHeadID || 0,
      InstituteID: formValues.InstituteID || 0,  // fallback if null
      OfficeID: formValues.OfficeID,
      StaffTypeID: formValues.StaffTypeID,
      TotalSeatID: formValues.TotalSeatID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CreatedBy: this.sSOLoginDataModel.UserID,
      DepartmentID: 1,
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
      PlanningID:0,
      Index: this.tempIndex++,
      TradeID: 0,
      TradeName:''
    };

    console.log('Vacancy being added:', vacancyData);

    this.OfficeVacancyList.push(vacancyData); // Add to array
    this.OfficeVacancy = this.OfficeVacancyList;
    this.isFinalSave=false;
    this.toastr.success("Vacancy added successfully.");

    this.AddOfficeVacancyForm.reset(); // Reset form after adding
  }
  async SaveData() {
    debugger;
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.isSubmitted = true;

    if (this.OfficeVacancy.length === 0) {
      this.toastr.warning("Please add at least one valid vacancy before saving.");
      return;
    }
   
    try {
      this.loaderService.requestStarted();

      await this.BTER_EstablishManagementService.Save_M_OfficeVacancy_IU(this.OfficeVacancy).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          
          this.OfficeVacancy = [];
          this.OfficeVacancyDataList();
          this.toastr.success('Data saved successfully!');
          this.isFinalSave=true;
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
      index = 0;
    }
    // && index != 0
    if (ID == 0 && index != 0) {

      this.OfficeVacancyList = this.OfficeVacancyList.filter(item => item.Index !== index);
      this.OfficeVacancy = [...this.OfficeVacancyList];
      this.OfficeVacancyList = [...this.OfficeVacancyList];


    }
    else if (ID != 0) {
      try {
        this.deleteRequest.ID = ID;
        this.loaderService.requestStarted();
        await this.BTER_EstablishManagementService.DeleteOfficeVacancy(this.deleteRequest).then((data: any) => {
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
    this.formData = new OfficeVacancyModel();
    
    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }

  async OfficeVacancyDataList() {
   debugger
    try {
      this.loaderService.requestStarted();
      this.SearchData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchData.EndTermID = this.sSOLoginDataModel.EndTermID;

      await this.BTER_EstablishManagementService.OfficeVacancyList(this.SearchData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeVacancyList = data['Data'];
          
         
        }, error => console.error(error));

      console.log(this.OfficeVacancyList, "leaves data")
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
    debugger;
  
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList");
        }, error => console.error(error));

        await this.commonMasterService.BTER_BGT_BudgetType(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BugetHeadList = data['Data'];
          console.log(this.BugetHeadList, "BugetHeadList");
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
        this.InstituteMasterDDLList = data.Data.filter(
          (x: any) => x.InstitutionManagementTypeID === 1
        );

        console.log("Filtered Institute Master List ==>", this.InstituteMasterDDLList);
      });
  }


  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

 async fillupDesignation() {
   
    
    await  this.GetPostList();
  }

  async GetPostList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetDesignationAndPostMaster();
      this.PostList = data['Data'];
      this.PostList = this.PostList.filter((item: any) => item.TypeID == this.formData.StaffTypeID);
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
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });

      if (userSubmitData) {
        this.formData = userSubmitData;
console.log(this.formData.DesignationID);
        // If fillupDesignation is async, await it
        await this.fillupDesignation();

        if (this.formData.PostedSeat !== 0) {

          this.groupForm.get('OfficeID')?.disable();
          this.groupForm.get('StaffTypeID')?.disable();
          this.groupForm.get('DesignationID')?.disable();
          if (this.formData.InstituteID !== 0) {
            this.groupForm.get('InstituteID')?.disable();
          }
        } else {
          this.groupForm.get('OfficeID')?.enable();
          this.groupForm.get('StaffTypeID')?.enable();
         this.groupForm.get('DesignationID')?.enable();
          if (this.formData.InstituteID !== 0) {
            this.groupForm.get('InstituteID')?.enable();
          }
        }

        // No need to re-assign DesignationID if it's part of userSubmitData
        // this.formData.DesignationID = userSubmitData.DesignationID;
      } else {
        this.formData = new OfficeVacancyModel(); // or initialize with default values if needed
      }

   

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.formData = new OfficeVacancyModel();
    this.isSubmitted = false;
  }
  async LoadBasicData(){

    await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
    .then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.OfficeList = data['Data'];
      console.log(this.OfficeList, "OfficeList");
    }, error => console.error(error));

    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDLList = data.Data;
      console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
    })


    await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StaffTypeList = data.Data;
      console.log("StaffTypeList", this.StaffTypeList);
    });


    await this.commonMasterService.GetDesignationAndPostMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.PostList = data['Data'];
      console.log("PostList", this.PostList);
    });
  }


  async VacancyPostUpdate() {
    debugger
    try {
      this.loaderService.requestStarted();


      if (this.formData.ID != 0) {
        await this.BTER_EstablishManagementService.UpdateOfficeVacancy(this.formData).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
         
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);

            this.CloseModal();
            this.OfficeVacancyDataList();
            this.formData = new OfficeVacancyModel();

            setTimeout(() => {
              window.location.reload();
            }, 1500);

          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message);

            setTimeout(() => {
              window.location.reload();
            }, 1500);

          } else {
            this.toastr.error('Some error! Please check.');
          }



        });
      }
      else if (this.formData.Index!=0){
        debugger;
        const formValues=this.groupForm.value;
         // Validate required fields before adding
        if (!formValues.Comments || !formValues.DesignationID || !formValues.OfficeID || !formValues.StaffTypeID || !formValues.TotalSeatID) {
          this.toastr.warning("Please fill all required fields before adding.");
          return;
        }
        await this.LoadBasicData();
        const getoffice = this.OfficeList.find((item:any) => item.ID == formValues.OfficeID);
        const getdesignation = this.PostList.find((item1: any) => item1.ID == formValues.DesignationID);
        const getstaffType = this.StaffTypeList.find((item3: any) => item3.ID == formValues.StaffTypeID);
        let getinstitute = [];

        if (formValues.InstituteID && formValues.InstituteID !== 0) {
          getinstitute = this.InstituteMasterDDLList.filter((item2: any) => item2.InstituteID == formValues.InstituteID) || [];
        } else {
          getinstitute = [];
        }
        const getinstituteName = getinstitute.length > 0 ? getinstitute[0].InstituteName : '';

        console.log(getinstituteName); 
        const vacancyData: OfficeVacancyModel = {
          Comments: formValues.Comments,
          DesignationID: formValues.DesignationID,
          BugetHeadID:formValues.BugetHeadID || 0,
          InstituteID: formValues.InstituteID || 0,  // fallback if null
          OfficeID: formValues.OfficeID,
          StaffTypeID: formValues.StaffTypeID,
          TotalSeatID: formValues.TotalSeatID,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          CreatedBy: this.sSOLoginDataModel.UserID,
          DepartmentID: 1,
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
          PlanningID:0,
          Index: this.tempIndex++,
          TradeID: 0,
          TradeName:''
        };
        console.log('Vacancy being added:', vacancyData);
       // Remove existing record with same Index
        this.OfficeVacancyList = this.OfficeVacancyList.filter(
          (item: any) => item.Index !== this.formData.Index
        );

        // Push updated/new record
        this.OfficeVacancyList.push(vacancyData);
        this.toastr.success("Vacancy Updated successfully.");

        // Optional: reset form & close modal
        this.formData = new OfficeVacancyModel();
        this.groupForm.reset();
        this.CloseModal();

      }
      

    } catch (error) {
      console.error("Error saving data:", error);
      this.toastr.error("An unexpected error occurred while saving data.");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async OfficeVacancyActiveDeActive(ID: number, IsActive: boolean) {
    if (ID != 0) {
      this.formData.ID = ID;
      this.formData.ActiveStatus = IsActive;
      await this.BTER_EstablishManagementService.OfficeVacancyActiveDeActive(this.formData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.OfficeVacancyDataList();
          this.formData = new OfficeVacancyModel();
          // Clear array after successful save
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });
    }
  }
}
