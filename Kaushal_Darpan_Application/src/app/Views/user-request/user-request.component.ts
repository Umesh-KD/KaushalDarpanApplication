import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRequestModel } from '../../Models/UserRequestDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel } from '../../Models/CommonMasterDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignRoleRightsService } from '../../Services/AssignRoleRights/assign-role-rights.service';
import { UserMasterService } from '../../Services/UserMaster/user-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { GlobalConstants, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { AssignRoleRightsModel, UserMasterModel } from '../../Models/UserMasterDataModel';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { SSOLoginService } from '../../Services/SSOLogin/ssologin.service';
import { UserRequestService } from '../../Services/UserRequest/user-request.service';

@Component({
    selector: 'app-user-request',
    templateUrl: './user-request.component.html',
    styleUrls: ['./user-request.component.css'],
    standalone: false
})

export class UserRequestComponent implements OnInit {
  UserRequestFormGroup!: FormGroup;

  public State: number = 0;
  public SuccessMessage: any = [];
  public AllSelect: boolean = false;
  public AllCheck: boolean = false;
  public Marked: boolean = false;
  public Message: any = [];
  public InstituteList: any = []
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public UserRequestList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  allSelected = false;
  public DivisionMasterList: any = [];
  public TehsilMasterList: any = [];
  public DesignationMasterList: any = [];
  public Table_SearchText: string = '';
  public InstituteMasterList: any = [];
  //public RoleMasterList: AssignRoleRightsModel[] = [];

  request = new UserRequestModel()

  sSOLoginDataModel = new SSOLoginDataModel();

  public DistrictMasterList: IDistrictMaster_StateIDWiseDataModel[] = []
  public StateMasterList: IStateMasterDataModel[] = []


  constructor(private commonMasterService: CommonFunctionService, private sSOLoginService: SSOLoginService, private UserRequestService: UserRequestService, private Router: Router, private assignRoleRightsService: AssignRoleRightsService,
    private UserMasterService: UserMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private modalService: NgbModal, private Swal2: SweetAlert2) {
  }

  


       async ngOnInit() {

      this.UserRequestFormGroup = this.formBuilder.group(
        {
          Name: ['', Validators.required],
          MobileNo: ['', Validators.required],
          Email: ['', Validators.required],
          SSOID: ['', Validators.required],
          ddlDesignation: ['', [DropdownValidators]],

          AadhaarID: ['', [Validators.required, Validators.pattern(GlobalConstants.AadhaarPattern),]],

          districtID: ['', DropdownValidators],
          divisionID: ['', DropdownValidators],
          InstituteID: ['', [DropdownValidators]]

        })
    //this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    await this.GetDivisionMasterList();
    await this.GetMasterData();
    await this.loadDropdownData('Institute');

  }
  get _UserRequestFormGroup() { return this.UserRequestFormGroup.controls; }

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Institute':
          this.InstituteList = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetDesignationMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DesignationMasterList = data['Data'];
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
  
  //async SaveData() {
  //  
  //  this.isSubmitted = true;
  //  this.request.SSOID = this.sSOLoginDataModel.SSOID;
  //  /*this.request.UserID = this.sSOLoginDataModel.UserID;*/
  //  //if (this.UserRequestFormGroup.invalid) {
  //  //  return
  //  //}

  //  //Show Loading
  //  this.loaderService.requestStarted();
  //  this.isLoading = true;
  //  try {
  //    /*await this.UserRequestService.SaveData(this.request)*/
  //    await this.sSOLoginService.SaveData(this.request)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State = EnumStatus.Success) {
  //          this.toastr.success(this.Message)
  //          this.ResetControl();
  //          /* this.OnReset()*/
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      })
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //      this.isLoading = false;

  //    }, 200);
  //  }
  //}

  async SaveData() {
    
    this.request.UserStatus = 'Pending'
    this.isSubmitted = true;
    //this.request.SSOID = this.sSOLoginDataModel.SSOID;
    /*this.request.UserID = this.sSOLoginDataModel.UserID;*/
    console.log(this.UserRequestFormGroup)
    if (this.UserRequestFormGroup.invalid) {
      return
    }

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      /*await this.UserRequestService.SaveData(this.request)*/
      await this.sSOLoginService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.routers.navigate(['/login']);
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





  ResetControl() {
    this.isSubmitted = false;
    this.UserRequestFormGroup.reset();
  }

  

  //async GetUserMasterList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.UserRequestService.GetAllData()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.UserRequestList = data['Data'];
  //        //this.ddlState_Change();
  //        //this.request.DistrictID = data['Data']["DistrictID"];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async btnEdit_OnClick(UserID: number) {
  //  this.isSubmitted = false;
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.UserRequestService.GetByID(UserID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);
  //        /*this.request.UserID = data['Data']["RoleID"];*/
  //        this.request.UserID = data['Data']["UserID"];
  //        this.request.Name = data['Data']["Name"];
  //        this.request.LevelID = data['Data']["LevelID"];
  //        this.request.DesignationID = data['Data']["DesignationID"];
  //        this.request.Email = data['Data']["Email"];
  //        this.request.EmailOfficial = data['Data']["EmailOfficial"];
  //        this.request.StateID = data['Data']["StateID"];
  //        this.ddlState_Change();
  //        this.request.DistrictID = data['Data']["DistrictID"];
  //        this.request.MobileNo = data['Data']["MobileNo"];
  //        this.request.SSOID = data['Data']["SSOID"];
  //        this.request.AadhaarID = data['Data']["AadhaarID"];
  //        this.request.ActiveStatus = data['Data']["ActiveStatus"];
  //        this.request.Gender = data['Data']["Gender"];
  //        const btnSave = document.getElementById('btnSave')
  //        if (btnSave) btnSave.innerHTML = "Update";
  //        const btnReset = document.getElementById('btnReset')
  //        if (btnReset) btnReset.innerHTML = "Cancel";

  //      }, error => console.error(error));
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }

  //}

  //async btnDelete_OnClick(UserID: number) {

  //  this.Swal2.Confirmation("Are you sure you want to delete this ?",
  //    async (result: any) => {
  //      //confirmed
  //      if (result.isConfirmed) {
  //        try {
  //          //Show Loading
  //          this.loaderService.requestStarted();

  //          await this.UserMasterService.DeleteDataByID(UserID, this.request.UserID)
  //            .then(async (data: any) => {
  //              data = JSON.parse(JSON.stringify(data));
  //              console.log(data);

  //              this.State = data['State'];
  //              this.Message = data['Message'];
  //              this.ErrorMessage = data['ErrorMessage'];

  //              if (this.State = EnumStatus.Success) {
  //                this.toastr.success(this.Message)
  //                //reload
  //                this.GetUserMasterList();
  //              }
  //              else {
  //                this.toastr.error(this.ErrorMessage)
  //              }

  //            }, (error: any) => console.error(error)
  //            );
  //        }
  //        catch (ex) {
  //          console.log(ex);
  //        }
  //        finally {
  //          setTimeout(() => {
  //            this.loaderService.requestEnded();
  //          }, 200);
  //        }
  //      }
  //    });
  //}
  
}
