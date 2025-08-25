import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { DTEItemUnitModel } from '../../../../Models/DTEInventory/DTEItemUnitModel';
import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';

@Component({
  selector: 'app-iti-unit-master',
  templateUrl: './iti-unit-master.component.html',
  styleUrls: ['./iti-unit-master.component.css'],
  standalone: false
})
export class ITIUnitMasterComponent {
  public request = new DTEItemUnitModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public UnitId: number = 0;
  public Table_SearchText: string = "";
  public UnitMasterList: any = [];


  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private itiInventoryService: ITIInventoryService) { }


  async ngOnInit() {

    this.RequestFormGroup = this.formBuilder.group({
      UnitName: ['', Validators.required]
    });

    this.UnitId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    if (this.UnitId > 0) {
      await this.GetByID(this.UnitId);  
    }
  }

  get _RequestFormGroup() { return this.RequestFormGroup.controls; }


  async saveData() {
    
    this.isSubmitted = true;
    if (this.RequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {

      if (this.UnitId) {
        this.request.UnitId = this.UnitId
        this.request.DepartmentID = 2;
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
        this.request.DepartmentID = 2;
      }
      await this.itiInventoryService.SaveItemUnitMaster(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetAllData();
            this.routers.navigate(['/iti-unit-master']);

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

      await this.itiInventoryService.GetItemUnitMasterByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.UnitName = data['Data']["UnitName"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
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
      await this.itiInventoryService.GetAllItemUnitMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UnitMasterList = data['Data'];
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
    this.request = new DTEItemUnitModel();
    this.RequestFormGroup.reset();
    this.GetAllData();
  }
  async btnEdit_OnClick(UnitId: number) {
    if (UnitId > 0) {
      this.UnitId = UnitId;
      await this.GetByID(this.UnitId);
    }
  }
  async btnDelete_OnClick(UnitId: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.itiInventoryService.DeleteItemUnitMasterByID(UnitId, this.UserID)
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
