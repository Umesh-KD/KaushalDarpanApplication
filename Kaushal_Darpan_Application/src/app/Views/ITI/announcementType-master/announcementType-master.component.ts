import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AnnouncementTypeMasterModel, SanctionOrderDataModel } from '../../../Models/HiringRoleMasterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { HiringRoleMasterService } from '../../../Services/HiringRoleMaster/hiring-role-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-announcementType-master',
  standalone: false,
  templateUrl: './announcementType-master.component.html',
  styleUrl: './announcementType-master.component.css'
})
export class AnnouncementTypeMasterComponent {

  AnnouncementTypeFormGroup!: FormGroup;

  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public AnnouncementTypeList: any[] = [];

  public UserID: number = 0;
  searchText: string = '';
 
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public Table_SearchText: string = '';
  public _enumRole = EnumRole

  request = new AnnouncementTypeMasterModel();
  sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private commonMasterService: CommonFunctionService, private HiringRoleMasterService: HiringRoleMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.AnnouncementTypeFormGroup = this.formBuilder.group({
      Name: ['', Validators.required],
      IsActive: [true]
    });

    this.sSOLoginDataModel = JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );

    this.UserID = this.sSOLoginDataModel.UserID;

    await this.GetAnnouncementTypeList();
  }
  get form() {
    return this.AnnouncementTypeFormGroup.controls;
  }

  async GetAnnouncementTypeList() {

    try {

      this.loaderService.requestStarted();

      await this.HiringRoleMasterService.GetAllAnnouncementTypes(this.request)
        .then((data: any) => {

          this.State = data.State;
          this.Message = data.Message;
          this.ErrorMessage = data.ErrorMessage;

          this.AnnouncementTypeList = data.Data;

        });

    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      this.loaderService.requestEnded();
    }
  }
  async SaveData() {
    debugger
    this.isSubmitted = true;

    if (this.AnnouncementTypeFormGroup.invalid)
      return;

    this.loaderService.requestStarted();

    try {

      if (this.request.ID == 0)
        this.request.CreatedBy = this.UserID;
      else
        this.request.UpdatedBy = this.UserID;

      await this.HiringRoleMasterService.SaveAnnouncementType(this.request)
        .then((data: any) => {

          this.State = data.State;
          this.Message = data.Message;
          this.ErrorMessage = data.ErrorMessage;

          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message);

            this.ResetControl();

            this.GetAnnouncementTypeList();
          }
          else {

            this.toastr.error(this.ErrorMessage);

          }

        });

    }
    catch (ex) {

      console.log(ex);

    }
    finally {

      this.loaderService.requestEnded();

    }
  }

  async btnEdit_OnClick(id: number) {

    this.isSubmitted = false;

    try {

      this.loaderService.requestStarted();

      await this.HiringRoleMasterService.GetAnnouncementTypeByID(id)
        .then((data: any) => {

          this.request.ID = data.Data.ID;
          this.request.Name = data.Data.Name;
          this.request.IsActive = data.Data.IsActive;
          this.request.CreatedBy = data.Data.CreatedBy;
          this.request.UpdatedBy = this.UserID;

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

        });

    }
    catch (ex) {

      console.log(ex);

    }
    finally {

      this.loaderService.requestEnded();

    }

  }

  async btnDelete_OnClick(id: number) {

    this.Swal2.Confirmation(
      "Are you sure you want to delete this ?",

      async (result: any) => {

        if (result.isConfirmed) {

          try {

            this.loaderService.requestStarted();

            await this.HiringRoleMasterService.DeleteAnnouncementTypeByID(id, this.UserID)
              .then((data: any) => {

                this.State = data.State;
                this.Message = data.Message;
                this.ErrorMessage = data.ErrorMessage;

                if (this.State == EnumStatus.Success) {

                  this.toastr.success(this.Message);

                  this.GetAnnouncementTypeList();

                }
                else {

                  this.toastr.error(this.ErrorMessage);

                }

              });

          }
          catch (ex) {

            console.log(ex);

          }
          finally {

            this.loaderService.requestEnded();

          }

        }

      });

  }


  ResetControl() {

    this.isSubmitted = false;

    this.request.ID = 0;
    this.request.Name = '';
    this.request.IsActive = true;

    this.AnnouncementTypeFormGroup.reset({
      Name: '',
      IsActive: true
    });

    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.innerHTML = "Save";

    const btnReset = document.getElementById('btnReset');
    if (btnReset) btnReset.innerHTML = "Reset";
  }

}
