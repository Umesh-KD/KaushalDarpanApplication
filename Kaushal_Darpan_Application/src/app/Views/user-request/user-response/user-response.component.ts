  import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { AssignRoleRightsService } from '../../../Services/AssignRoleRights/assign-role-rights.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { UserRequestService } from '../../../Services/UserRequest/user-request.service';
import { UserRequestModel, UserSearchModel } from '../../../Models/UserRequestDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-user-response',
  templateUrl: './user-response.component.html',
  styleUrls: ['./user-response.component.css'],
  standalone: false
})
export class UserResponseComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public UserRequestList: any = []
  public DesignationMasterList: any = []
  public DivisionMasterList: any = []
  public DistrictMasterList: any = []
  public InstituteMasterList: any = []
  public RoleMasterList: any = []
  //public searchRequest = new UserRequestModel();
  public userRequest = new UserSearchModel();
  public State: number = 0;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public request = new UserRequestModel()
  public UserRequestFormGroup!: FormGroup;
  public selectedUser: any = {};



  constructor(
    private commonMasterService: CommonFunctionService,
    private sSOLoginService: SSOLoginService,
    private assignRoleRightsService: AssignRoleRightsService,
    private UserRequestService: UserRequestService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private _fb: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.UserRequestFormGroup = this.formBuilder.group(
      {
        Name: ['', Validators.required],
        MobileNo: ['', Validators.required],
        Email: ['', Validators.required],
        SSOID: ['', Validators.required],
        UserStatus: ['', Validators.required],
        ddlDesignation: ['', [DropdownValidators]],

        AadhaarID: ['', [Validators.required, Validators.pattern(GlobalConstants.AadhaarPattern),]],

        districtID: ['', DropdownValidators],
        divisionID: ['', DropdownValidators],
        InstituteID: ['', [DropdownValidators]],
        RoleID: ['', [DropdownValidators]]

      })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetUserRequestList();
    await this.GetDivisionMasterList();
    await this.GetMasterData();
    await this.GetRoleMasterData();
  }


  async GetUserRequestList() {
    try {
      this.loaderService.requestStarted();
      await this.sSOLoginService.GetUserRequestList(this.userRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.UserRequestList = data.Data;
        console.log(this.UserRequestList)
      }, (error: any) => console.error(error))
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


  //onEdit(content: any, request: any) {
  //  
  //  this.request = { ...request };

  //  this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  //}

  onEdit(content: any, request: any) {
    this.request = { ...request };
    console.log('Request:', this.request);
    // Patch the form values
    this.UserRequestFormGroup.patchValue({
      Name: this.request.Name,
      Email: this.request.Email,
      AadhaarID: this.request.AadhaarID,
      DesignationID: this.request.DesignationID,
      DistrictID: this.request.DistrictID,
      DivisionID: this.request.DivisionID,
      InstituteID: this.request.InstituteID,
      MobileNo: this.request.MobileNo,
      SSOID: this.request.SSOID,
      RoleID: this.request.RoleID,
      UserStatus: this.request.UserStatus
    });
    this.ddlDivision_Change();  
    this.ddlDistrict_Change();  
    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }



  closeModal() {
    this.modalReference?.close();
  }

  async UpdateUserReqData() {
    this.isSubmitted = true;
    try {
      this.loaderService.requestStarted();
      this.isLoading = true;

      await this.sSOLoginService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.ResetControl();
            this.closeModal();
            this.ngOnInit();
          } else {
            this.toastr.error(this.ErrorMessage || 'Failed to save ABC ID');
          }
        });
    } catch (ex) {
      console.log('Error saving data:', ex);
      this.toastr.error('An unexpected error occurred');
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  ResetControl() {
    this.isSubmitted = false;
  }


  // get all data
  async ClearSearchData() {
    this.userRequest.UserStatus = '';

    await this.GetUserRequestList();
  }
    
  async GetMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetDesignationMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DesignationMasterList = data['Data'];
          console.log(this.DesignationMasterList)
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

  async GetDivisionMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];

          //console.log(this.DivisionMasterList)
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

  async ddlDivision_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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
      console.log(this.request.DistrictID, "disti")
      this.loaderService.requestStarted();
      await this.commonMasterService.InsituteMaster_DistrictIDWise(this.request.DistrictID, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
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


  async GetRoleMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


}


