import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HiringRoleMasterDataModel, SanctionOrderDataModel } from '../../Models/HiringRoleMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { HiringRoleMasterService } from '../../Services/HiringRoleMaster/hiring-role-master.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-greviance-mapping',
  standalone: false,
  templateUrl: './greviance-mapping.component.html',
  styleUrl: './greviance-mapping.component.css'
})
export class GrevianceMappingComponent {
  RoleMasterFormGroup!: FormGroup;

  public State: number = -1;
  public Message: any = [];
  public selectedRoleIDs: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public RoleMasterList: any = [];
  public RoleNameMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public LevelMasterList: any = [];
  public DepartmentList: any = [];
  public DesignationMasterList: any = [];
  public Table_SearchText: string = '';
  public _enumRole = EnumRole

  request = new SanctionOrderDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private commonMasterService: CommonFunctionService, private HiringRoleMasterService: HiringRoleMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.RoleMasterFormGroup = this.formBuilder.group(
      {
        txtRoleName: ['', Validators.required],
        DepartmentID: ['', [DropdownValidators]],
        chkActiveStatus: ['true'],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
    this.loadDropdownData('QueryFor');
    await this.GetRoleMasterList();
  }
  get form() { return this.RoleMasterFormGroup.controls; }


  async GetRoleMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.HiringRoleMasterService.GetAllDepartmentMapping()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleMasterList = data['Data'];
          if (this.sSOLoginDataModel.RoleID == EnumRole.DTE_TrainingT2_establishment) {
            this.RoleMasterList = this.RoleMasterList.filter((e: any) => e.ParentID == 4)
          } else {
            this.RoleMasterList = data['Data'];
          }
        }, (error: any) => console.error(error));
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


  async GetRoleNameMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('IssueRole')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleNameMasterList = data['Data'];
         
        }, (error: any) => console.error(error));
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
    this.isSubmitted = true;
    if (this.RoleMasterFormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.Action ='SaveData'

    try {
      await this.HiringRoleMasterService.SaveGrevianceModule(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetRoleMasterList();
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

  async btnEdit_OnClick(row: any) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();

      this.request.Name = row.ModuleName
      this.request.DepartmentID = row.DepartmentID
      this.request.ID = row.ID

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async btnDelete_OnClick(ID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.HiringRoleMasterService.DeleteDataBySanctionID(ID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetRoleMasterList();
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


  async ResetControl() {
    const txtRoleName = document.getElementById('txtRoleName');
    if (txtRoleName) txtRoleName.focus();
    this.isSubmitted = false;
    this.request.ID = 0;
    this.request.DepartmentID = 0;
    this.request.Name = '';
    this.request.ActiveStatus = true;
    this.request.ActiveDeactive = '';
    this.request.DeleteStatus = false;

    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }
  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'QueryFor':
          this.DepartmentList = data['Data'];
          break;
        case 'Grievance Category':
          //this.CategoryList = data['Data'];
          //console.log(this.CategoryList, "CategoryList")
          break;
        case 'CollegeName':
          //this.Collegename = data['Data'];
          //console.log(this.CategoryList, "CategoryList")
          break;
        case 'PrivateITICollege':
          //this.Collegename = data['Data'];
          //console.log(this.CategoryList, "CategoryList")
          break;
        default:
          break;
      }
    });
  }




  async AddStaffData(content: any, rowData: any = null) {

    debugger;
    this.request.ID = rowData.ID
    // ============================
    // RESET LIST FOR NEW ENTRY
    //// ============================
    //this.request.DepartmentID = rowData.DepartmentID
    //this.request.ID = rowData.ID


    await this.commonMasterService.GetCommonMasterData('IssueRole', rowData.DepartmentID)
      .then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {

               this.RoleNameMasterList=data['Data']
        }
        else {

        }
      })


    await this.commonMasterService.GetCommonMasterData('GetMaprole', rowData.ID)
      .then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {
          debugger
          this.selectedRoleIDs = (data['Data'] ?? [])
            .map((x: any) => Number(x.RoleID ?? x.ID ?? x));
        
     /*     this.RoleNameMasterList=data['Data']*/
        }
        else {
       
        }
      })

    // ============================
    // CHECK EDIT MODE
    // ============================



    // ============================
    // LOAD DROPDOWNS
    // ============================



    // ============================
    // EDIT DATA
    // ============================



    // ============================
    // STREAM LOAD
    // ============================






    // ============================
    // PATCH FORM IN EDIT MODE
    // ============================


    // ============================
    // NEW ADD MODE
    // ============================

     

      this.isSubmitted = false;



      // ============================
      // OPEN MODAL
      // ============================

      this.modalService.open(content, {

        size: 'xl',

        ariaLabelledBy: 'modal-basic-title',

        backdrop: 'static'

      }).result.then((result) => {

        this.closeResult = `Closed with: ${result}`;

      }, (reason: any) => {

        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
    
  }
  async SaveRoleMapping() {
    this.isSubmitted = true;
    if (this.selectedRoleIDs.length === 0) return;

    const request = {
      MappingID: this.request.ID,        // MappingID from the list row
      RoleIDs: this.selectedRoleIDs,
      
    };

    try {
      const data: any = await this.HiringRoleMasterService.SaveGrevianceRoleMapping(request);

      this.State = data?.['State'];
      this.Message = data?.['Message'];
      this.ErrorMessage = data?.['ErrorMessage'];

      if (this.State == EnumStatus.Success) {
        this.toastr.success(this.Message);
        this.CloseModal();
      } else {
        this.toastr.error(this.ErrorMessage || 'Something went wrong .!');
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('Something went wrong .!');
    }
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

  async CloseModal() {
    this.request.DepartmentID = 0
    this.request.ID = 0
    this.selectedRoleIDs=[]
    this.modalService.dismissAll()
  }
}
