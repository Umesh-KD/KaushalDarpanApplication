
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { DesignationMasterDataModel } from '../../Models/DesignationMasterDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DesignationMasterService } from '../../Services/DesignationMaster/Designation-master.service';
import { UserMasterService } from '../../Services/UserMaster/user-master.service';
import { EnumStatus } from '../../Common/GlobalConstants';
import { AssignRoleRightsDataModel, AssignRoleRightsModel, UserMasterModel, UserMasterSerchModel } from '../../Models/UserMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel } from '../../Models/CommonMasterDataModel';
import { AssignRoleRightsService } from '../../Services/AssignRoleRights/assign-role-rights.service';


@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css'],
  standalone: false
})
export class UserMasterComponent implements OnInit {
  UserMasterFormGroup!: FormGroup;

  public State: number = 0;
  public SuccessMessage: any = [];
  public AllSelect: boolean = false;
  public AllCheck: boolean = false;
  public Marked: boolean = false;
  public Message: any = [];
  public AssignedRoleRights: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public UserMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  allSelected = false;
  public LevelMasterList: any = [];
  public DesignationMasterList: any = [];
  public Table_SearchText: string = '';
  public RoleMasterList: AssignRoleRightsDataModel[] = [];
  public searchRequest = new UserMasterSerchModel();

  request = new UserMasterModel();

  sSOLoginDataModel = new SSOLoginDataModel();

  public DistrictMasterList: IDistrictMaster_StateIDWiseDataModel[] = []
  public StateMasterList: IStateMasterDataModel[] = []


  constructor(private commonMasterService: CommonFunctionService, private Router: Router, private assignRoleRightsService: AssignRoleRightsService,
    private UserMasterService: UserMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private modalService: NgbModal, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.UserMasterFormGroup = this.formBuilder.group(
      {
        txtUserName: ['', Validators.required],
        ddlLevel: [''],
        ddlDesignation: [''],
        txtUserEmail: ['', Validators.required],
        txtOfficialEmail: ['', Validators.required],
        txtSSOID: ['', Validators.required],

        txtAadhaarID: [
          '',
          [
            Validators.required,
            Validators.pattern(GlobalConstants.AadhaarPattern),

          ]
        ],


        txtMobileNo: ['', Validators.required],
        ddlGender: ['', Validators.required],
        ddlStateID: ['', [DropdownValidators]],
        ddlDistrictID: ['', [DropdownValidators]],
        chkActiveStatus: ['true'],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("sSOLoginDataModel", this.sSOLoginDataModel);
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID

    await this.GetMasterData();
    await this.GetUserMasterList();
    await this.GetRoleMasterData();

  }
  get _UserMasterFormGroup() { return this.UserMasterFormGroup.controls; }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.LevelMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StateMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetDesignationMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DesignationMasterList = data['Data'];;
          console.log(this.DesignationMasterList);
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

  checkMainRoleSelected(): boolean {
    return this.RoleMasterList.some(role => role.IsMainRole && role.Marked);
  }

  toggleAllCheckboxes(event: any): void {
    const isChecked = event.target.checked;
    this.RoleMasterList.forEach(r => {
      const assignedRole = this.AssignedRoleRights.find((role: { ID: number; }) => role.ID === r.ID);
      if (assignedRole) {
        assignedRole.Marked = isChecked;
      }
    });
  }

  toggleCheckbox(role: any): void {
    const assignedRole = this.AssignedRoleRights.some((r: { ID: any; }) => r.ID === role.ID);
    if (assignedRole) {
      role.Marked = !assignedRole.Marked;
    }
    this.allSelected = this.RoleMasterList.every(r => this.isChecked(r.ID));
  }

  toggleIsMainRole(row: any): void {
    //const assignedRole = this.AssignedRoleRights.find((r: { ID: any; }) => r.ID === row.ID);
    //if (assignedRole)
    //{
    //  this.AssignedRoleRights.forEach((r: { IsMainRole: boolean; }) => r.IsMainRole = false);
    //  row.IsMainRole = true;
    //}

    //console.log(row);
    //if (this.isChecked(row.ID))
    //{
    //  alert(row);
    //}
  }

  ResetCheck(row: AssignRoleRightsDataModel) {
    this.RoleMasterList.forEach(r => r.IsMainRole = false);
    this.RoleMasterList.forEach(r => r.Marked = false);
  }

  isChecked(roleId: number, row?: any): boolean {
    const assignedRole = this.AssignedRoleRights.some((role: { ID: number; }) => role.ID === roleId);
    if (assignedRole) {
      row.Marked = true;
    }
    return this.AssignedRoleRights.some((role: { ID: number; }) => role.ID === roleId);
  }

  isMainRole(roleId: number): boolean {
    const assignedRole = this.AssignedRoleRights.find((role: { ID: number; }) => role.ID === roleId);
    return assignedRole ? assignedRole.IsMainRole : false;
  }


  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      this.DistrictMasterList = []
      await this.commonMasterService.DistrictMaster_StateIDWise(this.request.StateID)
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

  async GetUserMasterList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.UserMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UserMasterList = data['Data'];
          //this.ddlState_Change();
          //this.request.DistrictID = data['Data']["DistrictID"];
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
    this.isSubmitted = true;
    if (this.UserMasterFormGroup.invalid) {
      return
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.UserMasterService.SaveData(this.request)
        .then((data: any) => {
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];


          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetUserMasterList();
            /* this.OnReset()*/
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
    this.UserMasterFormGroup.reset();
  }

  async btnEdit_OnClick(UserID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.UserMasterService.GetByID(UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          /*this.request.UserID = data['Data']["RoleID"];*/
          this.request.UserID = data['Data']["UserID"];
          this.request.Name = data['Data']["Name"];
          this.request.LevelID = data['Data']["LevelID"];
          this.request.DesignationID = data['Data']["DesignationID"];
          this.request.Email = data['Data']["Email"];
          this.request.EmailOfficial = data['Data']["EmailOfficial"];
          this.request.StateID = data['Data']["StateID"];
          this.ddlState_Change();
          this.request.DistrictID = data['Data']["DistrictID"];
          this.request.MobileNo = data['Data']["MobileNo"];
          this.request.SSOID = data['Data']["SSOID"];
          this.request.AadhaarID = data['Data']["AadhaarID"];
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
          this.request.Gender = data['Data']["Gender"];
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

  async SaveData_AssignRole() {

    try {
      //this.isSubmitted = true;
      //if (this.CommonSubjectFormGroup.invalid) {
      //  return
      //}
      this.isLoading = true;
      //Show Loading
      this.loaderService.requestStarted();
      //child data process....
      //edit child data

      var editChild = this.RoleMasterList.filter(x => x.Marked == true);

      editChild.forEach(x => {
        x.UserID = this.request.UserID,
          x.SSOID = this.request.SSOID,
          x.ModifiedBy = this.sSOLoginDataModel.UserID,
          x.DepartmentID = this.sSOLoginDataModel.DepartmentID,
          x.InstituteID = this.sSOLoginDataModel.InstituteID
         //x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      });

      console.log("editChild", editChild);


      await this.assignRoleRightsService.SaveData(editChild)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.State = data['State'];
          this.SuccessMessage = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.SuccessMessage)
            this.CloseModalPopup();
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




  async btnDelete_OnClick(UserID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.UserMasterService.DeleteDataByID(UserID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetUserMasterList();
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


  onCheckboxChange(row: any): void {
    // If unchecked, unset as the main role
    if (!row.Marked) {
      row.IsMainRole = false;
    }

  }
  onRadioChange(row: any): void {
    if (row.Marked) {
      // Unset other rows as main role
      this.RoleMasterList.forEach(r => r.IsMainRole = false); row.IsMainRole = true;
    }
  }



  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.UserMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "UserMaster.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }
  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  async OnReset() {
    this.request = new UserMasterModel()
  }

  async SetUserRoleRights(RoleID: number) {
    this.routers.navigate(['/userrolerights' + "/" + encodeURI(RoleID.toString())]);
  }

  async redirecttorights(RoleID: number) {
    this.routers.navigate(['/rolemenuright' + "/" + encodeURI(RoleID.toString())]);
  }




  async ViewandUpdate(content: any, UserID: number) {

    const initialState = {
      UserID: UserID,
      Type: "Admin",
    };

    try {
      await this.UserMasterService.GetByID(UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          /*this.request.UserID = data['Data']["RoleID"];*/
          this.request.UserID = data['Data']["UserID"];
          this.request.SSOID = data['Data']["SSOID"];
        }, error => console.error(error));

      await this.assignRoleRightsService.GetAssignedRoleById(UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.RoleMasterList = data['Data'];


          console.log("AssignedRoleRights", this.RoleMasterList);
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    // this.modalReference.componentInstance.initialState = initialState;

    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
  }
  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async GetRoleMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        // this.RoleMasterList = data.Data;
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

