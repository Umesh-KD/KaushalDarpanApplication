import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { MenuMasterService } from '../../Services/MenuMaster/menu-master.service';
import { MenuMasterDataModel, MenuMasterSerchModel } from '../../Models/MenuMasterModel';
import { HrMasterSearchModel } from '../../Models/HrMasterDataModel';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../Common/GlobalConstants';

@Component({
    selector: 'app-menu-master',
    templateUrl: './menu-master.component.html',
    styleUrls: ['./menu-master.component.css'],
    standalone: false
})
export class MenuMasterComponent {
  sSOLoginDataModel: any;
  ParentMenuDDLList: any;
  isParentMenuVisible: boolean = false;  
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public requestMenu = new MenuMasterDataModel();
  public searchRequest = new MenuMasterSerchModel();
  public Table_SearchText: string = "";
  EditMenuDataFormGroup!: FormGroup;
  AddMenuDataFormGroup: any;
  requestStudent: any;
  preExamStudentService: any;
  requestUpdateEnrollmentNo: any;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()
  closeResult: string | undefined;
  isAddMenuModalVisible: boolean = false;
  isDropdownVisible: boolean = false; // Checkbox state
  ParentId: number | null = null;
  constructor(private fb: FormBuilder, private commonMasterService: CommonFunctionService, private MenuMasterService: MenuMasterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {

  }
  async ngOnInit() {
    this.EditMenuDataFormGroup = this.formBuilder.group(
      {
        //txtEnrollmentNo: ['', Validators.required, disable: true],
        MenuId: [''],
        ParentId: [''],
        MenuNameEn: ['', Validators.required],
        MenuNameHi: ['', Validators.required],
        MenuUrl: [''],
        MenuIcon: ['', Validators.required],
        ChkActiveStatus: ['', Validators.required],
        CheckBoxActiveStatus: ['', Validators.required],
        ddlParent: [''],

      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   /* this.GetParentMenuDDL(); */
  
    await this.GetAllData();
    /*await this.OnVisible();*/
   /* await this.OnVisible()*/
  }
  get _EditMenuDataFormGroup() { return this.EditMenuDataFormGroup.controls; }

  GetcompanyMatserDDL() {
    throw new Error('Method not implemented.');
  }

  async GetParentMenuDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ParentMenu()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ParentMenuDDLList = data['Data'];

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

  onCheckboxChange(event: any) {
    const isChecked = event.target.checked;
    
     }

  onCheckboxChangeSubMenu(event: any) {
    this.requestMenu.ParentId = event.target.checked ? 1 : 0; // Set ParentId based on checkbox state
  }
 
  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.MenuMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MenuMasterList = data['Data'];
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.ParentMenu(this.searchRequest.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ParentMenuDDLList = data['Data'];
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

  async OnVisible() {
    this.loaderService.requestStarted();
    this.isLoading = true;  // Show loader
    if (this.requestMenu.Marked == false) {
      this.requestMenu.Marked = true;
    } else {
      this.requestMenu.Marked = false;
    }
    setTimeout(() => {
      this.isLoading = false; // Hide loader
      this.loaderService.requestEnded();
    }, 500);  // Delay for 500ms (You can adjust this as needed)
  }


  //async OnVisible() {
  //  this.loaderService.requestStarted();
  //  if (this.requestMenu.Marked == false) {
  //    this.requestMenu.Marked = true
  //  } else {
  //    this.requestMenu.Marked = false
  //  }  
  //}

  async ClearSearchData() {
    this.searchRequest.MenuNameEn = '';
    this.searchRequest.MenuId = 0;
    await this.GetAllData();
  }

  async GetMenuMaster(MenuId: number) {
    try {
      this.loaderService.requestStarted();
      ;
      await this.MenuMasterService.GetMenuMaster(MenuId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestMenu.ParentId = data['Data']['ParentId'];
          if (this.requestMenu.ParentId > 0)
          {
            this.requestMenu.Marked = true
          }
          else
          {
            this.requestMenu.Marked = false;
          }
          this.requestMenu.MenuId = data['Data']['MenuId'];
          this.requestMenu.MenuNameEn = data['Data']['MenuNameEn'];
          this.requestMenu.MenuNameHi = data['Data']['MenuNameHi'];
          this.requestMenu.MenuUrl = data['Data']['MenuUrl'];
          /*this.requestMenu.MenuActionId = data['Data']['MenuActionId'];*/
          this.requestMenu.ActiveStatus = data['Data']['ActiveStatus'];
          this.requestMenu.DeleteStatus = data['Data']['DeleteStatus'];
          this.requestMenu.Priority = data['Data']['Priority'];
          this.requestMenu.MenuIcon = data['Data']['MenuIcon'];
          //
          //this.requestMenu.MenuLevel = data['Data']['MenuLevel'];
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
  async SaveData_EditMenuDetails() {
    this.isSubmitted = true;
    if (this.EditMenuDataFormGroup.invalid) {
      return;
    }
    this.requestMenu.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    // Assuming you're getting UserID from local storage
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestMenu.CreatedBy = this.sSOLoginDataModel.UserID;
    // Show Loading
    this.loaderService.requestStarted();
    try {
      await this.MenuMasterService.EditMenuData(this.requestMenu)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.modalService.dismissAll();
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.GetAllData();
            this.CancelEditMenuDetails()
            this.EditMenuDataFormGroup.reset();
            window.location.reload();
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
      }, 200);
    }
  }

  // Edit Menu Data
  async EditMenuData(content: any, MenuId: number) {
    ////this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if (MenuId > 0) {
      await this.GetMenuMaster(MenuId)
    }
  }

  //close menu
  async CancelEditMenuDetails() {
    this.EditMenuDataFormGroup.reset(); 
    this.CloseViewMenuDetails(); 
  }
  async MenuData(content: any, ParentId: number) {
    this.loaderService.requestStarted();
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.loaderService.requestEnded();
  }

  async CloseViewMenuDetails() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();
    this.EditMenuDataFormGroup.reset();
      this.loaderService.requestEnded();
      //window.location.reload();
    }, 200);
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
  // delete by id
  async DeleteById(MenuId: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.MenuMasterService.DeleteById(MenuId, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  /*await this.GetAllData();*/
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

  onToggleChange(MenuId: number, ModifyBy: number) {
    // Confirm the status change
    this.Swal2.Confirmation("Are you sure you want to change status?", async (result: any) => {
      if (result.isConfirmed) {
        try {
          // Show loading indicator
          this.loaderService.requestStarted();
          ModifyBy =this.sSOLoginDataModel.UserID;
          // Call the service to update the status
          //const IsActive = !IsActive; // Toggle the current state
          await this.MenuMasterService.ActiveStatusByID(MenuId, ModifyBy)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));

              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State = EnumStatus.Success) {
                this.toastr.success(this.Message);
                // Reload data after successful update
                this.GetAllData();
              } else {
                this.toastr.error(this.ErrorMessage);
              }

            }, (error: any) => console.error(error));
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    });
  }
}
