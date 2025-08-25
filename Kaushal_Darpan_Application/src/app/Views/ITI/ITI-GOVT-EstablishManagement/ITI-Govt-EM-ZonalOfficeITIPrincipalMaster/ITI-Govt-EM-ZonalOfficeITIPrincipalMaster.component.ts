import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterDataModel, ITIGovtEMStaffMasterSearchModel, ITIGovtEMStaffHostelListModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
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
  selector: 'app-ITI-Govt-EM-ZonalOfficeITIPrincipalMaster',
  standalone: false,
  
  templateUrl: './ITI-Govt-EM-ZonalOfficeITIPrincipalMaster.component.html',
  styleUrl: './ITI-Govt-EM-ZonalOfficeITIPrincipalMaster.component.css'
})
export class ITIGovtEMZonalOfficeITIPrincipalMasterComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITI_Govt_EM_OFFICERSDataModel();
  public isSubmitted: boolean = false;

  public searchRequest = new ITI_Govt_EM_OFFICERSSearchDataModel();
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
  public DivisionList: any = [];
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number=0


  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;

  constructor(private commonMasterService: CommonFunctionService, private Staffservice: ITIGovtEMStaffMaster, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService
  ) {

  }



  async ngOnInit() {
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;



    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      ddlDivision: ['', [DropdownValidators]],
     
    })

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
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


    
  
    this.GetDivisionList();
   /* await this.GetAllData()*/

   

   
    
    console.log(this.sSOLoginDataModel);
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  async GetDivisionList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionList = data['Data'];
          console.log(this.DivisionList, "DivisionList")
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
    
    console.log('id test ', this.searchRequest.DivisionID);
    try {
      this.loaderService.requestStarted();
      await this.Staffservice.GetAllITI_Govt_EM_OFFICERS(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.ITIGovtEMOFFICERSList = data['Data'];
          console.log(this.ITIGovtEMOFFICERSList)
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




 



  




  async OnConfirm(content: any, ID: number) {

    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;
    // Open the modal
    

  }

  // Method to close the modal when Close button is clicked
  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
  }

  

 

  async OnFormSubmit() {
    
    try {
      this.isSubmitted = true;
      

      this.isLoading = true;

      this.loaderService.requestStarted();
      await this.GetAllData()
      
      
   
      
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
    this.formData = new ITI_Govt_EM_OFFICERSDataModel();

    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }

  // New Work Pawan 18-02-2025

 


  




  CloseModalPopup() {
    this.isSubmitted = false;
    
    this.modalService.dismissAll();
   
  }

  get _QueryReqFormGroup() {
    return this.QueryReqFormGroup.controls;
  }


  async GetPopupSSOIDByZonal(item: any) {
    
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

  async UpdateSSOIDByPriciple() {
    
    try {
      //await this.Staffservice.UpdateSSOIDByPriciple(this.searchRequestUpdateSSOIDByPricipleModel)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    console.log(data);

      //    this.State = data['State'];
      //    this.Message = data['Message'];
      //    this.ErrorMessage = data['ErrorMessage'];
      //    if (data.State == EnumStatus.Success) {
      //      this.toastr.success(this.Message)
      //      this.ResetControls();
      //      this.CloseModalPopup();
      //      this.searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
      //      this.GetAllData();
            
      //      const btnSave = document.getElementById('btnSave');
      //      if (btnSave) btnSave.innerHTML = "Submit";
      //    }
      //    else if (data.State == EnumStatus.Warning) {
      //      this.toastr.warning(this.ErrorMessage);
      //      this.ResetControls();
      //    }
      //    else {

      //      this.toastr.error(this.ErrorMessage)
      //    }

      //  }, (error: any) => console.error(error)
      //  );


    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        // this.isLoading = false;

      }, 200);
    }
  }

}
