import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { TspAreaDataModels, TspAreaSearchModel } from '../../../../Models/TspAreaDataModels';
import { TspAreasService } from '../../../../Services/Tsp-Areas/Tsp-Areas.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';

@Component({
    selector: 'app-add-tsp-areas',
    templateUrl: './add-tsp-areas.component.html',
    styleUrls: ['./add-tsp-areas.component.css'],
    standalone: false
})
export class AddTspAreasComponent {
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  public ITITspAreasId: number | null = null;
  public DistrictMasterList: any = [];
  public UserID: number = 0;
  public TehsilMasterList: any = [];
  request = new TspAreaDataModels()
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  constructor(
    private fb: FormBuilder,

    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private TspAreasService: TspAreasService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) { }

  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlDistrictId: ['', [DropdownValidators]],
      ddlTehshilId: ['', [DropdownValidators]],
      //txtVillageName: ['', Validators.required]
    });

    this.ddlStateChange();


    this.ITITspAreasId = Number(this.routers.snapshot.queryParamMap.get("ITITspAreasId") ?? 0);

    if (this.ITITspAreasId) {
      await this.GetByID(this.ITITspAreasId)
      this.isUpdate = true
    }


  }

  async saveData() {
    this.isSubmitted = true;

    if (this.groupForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.ITITspAreasId) {
        this.request.ITITspAreasId = this.ITITspAreasId
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }



      await this.TspAreasService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.ResetControl();
            setTimeout(() => {
              this.toastr.success(this.Message)
              window.location.href = '/TspAreasList'
            }, 200);
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
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


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new TspAreaDataModels
    this.groupForm.reset();
    this.groupForm.patchValue({

      code: '',

    });
  }


  async ddlStateChange() {
    this.request.StateId = 6;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.request.StateId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
          if (this.request.DistrictId != 0) {
            this.ddlDistrictChange();
          }
          
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

  async ddlDistrictChange() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];
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

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();
      ;
      await this.TspAreasService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.VillageName = data['Data']["VillageName"];
          this.request.DistrictId = data['Data']["DistrictId"];
          this.ddlDistrictChange();
          this.request.TehsilId = data['Data']["TehsilId"];
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
