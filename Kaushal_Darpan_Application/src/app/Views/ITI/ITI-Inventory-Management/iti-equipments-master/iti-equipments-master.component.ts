import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { DTEEquipmentsDataModel } from '../../../../Models/DTEInventory/DTEEquipmentsDataModel';
import { DTEItemsSearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';

@Component({
  selector: 'app-iti-equipments-master',
  templateUrl: './iti-equipments-master.component.html',
  styleUrls: ['./iti-equipments-master.component.css'],
  standalone: false
})
export class ITIEquipmentsMasterComponent {
  public request = new DTEEquipmentsDataModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Searchrequest = new DTEItemsSearchModel()
  public Message: string = '';
  public ErrorMessage: string = '';
  public EquipmentsRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public EquipmentsId: number = 0;
  public Table_SearchText: string = "";
  public EquipmentsMasterList: any = [];
  public UnitDDLList: any = [];
  public CategoryDDLList: any = [];

  public isFormVisible: boolean = false;
  public isUpdate: boolean = false;

  constructor(
    private toastr: ToastrService,
    private itiInventoryService: ITIInventoryService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2) { }


  async ngOnInit() {

    this.EquipmentsRequestFormGroup = this.formBuilder.group({
      txtName: ['', Validators.required],
      //txtName: ['', [Validators.required, Validators.pattern(GlobalConstants.NameNoNumbersPattern),]],
      Specification: ['', Validators.required],
      UnitId: ['', [DropdownValidators]],
      itemCategoryId: ['', [DropdownValidators]],
    });

    this.EquipmentsId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    await this.GetUnitDDL();
    await this.GetCategoryDDL();
    if (this.EquipmentsId > 0) {
      await this.GetByID(this.EquipmentsId);
    }
  }

  get _EquipmentsRequestFormGroup() { return this.EquipmentsRequestFormGroup.controls; }
  customSearch(term: string, item: any) {
    if (!term) return true;  // If no search term is provided, show all items.
    return item.Name.toLowerCase().includes(term.toLowerCase());  // Filter based on item Name
  }

  

  async saveData() {
    debugger
    this.isSubmitted = true;
    if (this.EquipmentsRequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.EquipmentsId) {
        this.request.EquipmentsId = this.EquipmentsId
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      this.request.OfficeID = this.sSOLoginDataModel.OfficeID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.itiInventoryService.SaveEquipmentsMasterData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetAllData();
            const btnSave = document.getElementById('btnSave');
            if (btnSave) btnSave.innerHTML = "Submit";
            this.routers.navigate(['/iti-equipments-master']);


          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
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

  async GetByID(id: number) {
    
    try {
      this.loaderService.requestStarted();

      await this.itiInventoryService.GetByIDEquipmentsMaster(id)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.request.Name = data['Data']["Name"];
          this.request.Specification = data['Data']["Specification"];
          this.request.UnitId = data['Data']["UnitId"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          this.request.ItemCategoryId = data['Data']["ItemCategoryId"];
          console.log(data)
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

  async GetAllData() {
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
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.EquipmentsMasterList = data['Data'];
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

  async GetUnitDDL() {
    try {
      this.loaderService.requestStarted();
      await this.itiInventoryService.GetAllItemUnitMaster()
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.UnitDDLList = data['Data'];
          console.log(this.UnitDDLList)
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

  async GetCategoryDDL() {
    
    try {
      this.loaderService.requestStarted();
      await this.itiInventoryService.GetAllCategoryMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.CategoryDDLList = data['Data'];
          const selectOption = { ItemCategoryID: 0, Name: '--Select--' };
          this.CategoryDDLList = [selectOption, ...data['Data']];
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

  //async btnEdit_OnClick(EquipmentsId: number) {
  //  if (EquipmentsId > 0) {
  //    this.EquipmentsId = EquipmentsId;
  //    await this.GetByID(this.EquipmentsId);
  //  }
  //}

  //async ResetControl() {
  //  this.isSubmitted = false;
  //  this.request = new DTEEquipmentsDataModel();
  //  this.EquipmentsRequestFormGroup.reset({
  //    UnitId: 0
  //  });
  //  await this.GetAllData();
  //}


  btnEdit_OnClick(EquipmentsId: number) {
    debugger
    if (EquipmentsId > 0) {
      this.EquipmentsId = EquipmentsId;
      this.GetByID(this.EquipmentsId);
    }
    this.isUpdate = true;
    this.isFormVisible = true;
  }

  async ResetControl() {
    debugger
    this.isSubmitted = false;
    this.isUpdate = false; 
    this.request = new DTEEquipmentsDataModel();
    this.EquipmentsId = 0;
    this.EquipmentsRequestFormGroup.patchValue({
      EquipmentsId: 0,
      itemCategoryId: 0,
      txtName: '',
      UnitId: 0,
      Specification: ''
    });

    await this.GetAllData();

  }


  async btnDelete_OnClick(CategoryId: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.itiInventoryService.DeleteEquipmentsMasterByID(CategoryId, this.UserID)
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
}
