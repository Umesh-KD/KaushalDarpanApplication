import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { ModalDismissReasons,NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { EnumStatus, GlobalConstants } from '../../../../../Common/GlobalConstants';
import { ReturnDteItemDataModel, ReturnDteItemSearchModel,DTEReturnItemSearchModel } from '../../../../../Models/DTEInventory/DTEIssuedItemDataModel';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { ITIInventoryService } from '../../../../../Services/ITI/ITIInventory/iti-inventory.service';



@Component({
  selector: 'app-iti-return-items-list',
  templateUrl: './iti-return-items-list.component.html',
  styleUrls: ['./iti-return-items-list.component.css'],
  standalone: false
})
export class ITIReturnItemsListComponent {
  public Searchrequest = new ReturnDteItemSearchModel()
  public Returnrequest = new ReturnDteItemDataModel()
  
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public ReturnItemList: any = [];
  public EquipmentddlList: any = [];
  public CategoryddlList: any = [];
  closeResult: string | undefined;
  public ItemddlList: any = [];

  constructor(
    private toastr: ToastrService,
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }
  public RequestFormGroup!: FormGroup;

  async ngOnInit() {

    this.RequestFormGroup = this.formBuilder.group({
      //ddlItemId: ['', [DropdownValidators]],
      ddlItemId: [{ value: null, disabled: true }, Validators.required],
      txtIssueNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.AllowNumbersPattern),]],
      txtIssueQuantity: ['', [Validators.required, Validators.pattern(GlobalConstants.AllowNumbersPattern),]],
      txtReturnRemark: ['', Validators.required],

      IssueDate: ['', Validators.required],
      ddlreturnStatus: ['', [DropdownValidators]],
    });

    this.ItemId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    await this.GetCategoryDDL();
    await this.GetEquipmentDDL();
    await this.GetItemsDDL();
  }

  get _RequestFormGroup() { return this.RequestFormGroup.controls; }

  async GetAllData() {
    //
    try {
      this.loaderService.requestStarted();
      if (this.Searchrequest.IssueDate) {
        const date = new Date(this.Searchrequest.IssueDate);
        this.Searchrequest.IssueDate = date;
      }
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.CategoryId = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;

      await this.itiInventoryService.GetAllRetunItem(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ReturnItemList = data['Data'];

          console.log('ReturnItemList',this.ReturnItemList)
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

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest.EquipmentsId = 0;
    this.Searchrequest.CategoryId = 0;
    this.Searchrequest.IssueDate = null;
    this.Searchrequest.Issuenumber = null;
    await this.GetAllData();
  }

  async btnDelete_OnClick(Id: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.itiInventoryService.DeleteIssuedItemsByID(Id, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetAllData()
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

  async GetCategoryDDL() {
    try {
      this.loaderService.requestStarted();
      await this.itiInventoryService.GetAllCategoryMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryddlList = data['Data'];
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

  async GetEquipmentDDL() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      await this.itiInventoryService.GetAllEquipmentsMaster(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EquipmentddlList = data['Data'];
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


  async GetItemsDDL() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;
      await this.itiInventoryService.GetAllEquipmentsMaster(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ItemddlList = data['Data'];
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


  CloseModalPopup() {
    this.modalService.dismissAll();
  }
  async onReturnSubmit(content: any, IssuedId: number) {
    
    this.Returnrequest.IssuedId = IssuedId;
    this.GetByID(this.Returnrequest.IssuedId);
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

  async SaveData_ReturnItem() {
    
    this.isSubmitted = true;

    if (this.RequestFormGroup.invalid) {
      return
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Returnrequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.Returnrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.itiInventoryService.SaveDataReturnItem(this.Returnrequest)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            await this.GetAllData();
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

  async GetByID(id: number) {
    
    try {
      this.loaderService.requestStarted();

      await this.itiInventoryService.GetIssuedItemsByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));          
          this.Returnrequest.ItemId = data['Data']["EquipmentsId"];
          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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
