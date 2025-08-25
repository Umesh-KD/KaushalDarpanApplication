import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ItiCenterMasterDataModels } from '../../../../Models/ItiCenterMasterDataModels';
import { ItiCenterService } from '../../../../Services/ItiCenters/iti-centers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-add-center-iti',
  standalone: false,
  
  templateUrl: './add-center-iti.component.html',
  styleUrl: './add-center-iti.component.css'
})


export class AddCenterITIComponent {
  centerForm!: FormGroup;
  public isUpdate: boolean = false;
  public CenterId: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TehsilMasterList: any = [];
  public DivisionMasterList: any = [];
  public State: number = -1;
  public LevelMasterList: any = [];
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public DistrictMasterList: any = []
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new ItiCenterMasterDataModels()
  public filteredDistricts: any[] = [];
  public filteredTehsils: any[] = [];


  constructor(
    private fb: FormBuilder,
    private ItiCenterService: ItiCenterService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.centerForm = this.fb.group({
      ssoid: ['', Validators.required],
      IndentNumber: ['', Validators.required],
      centerCode: ['', Validators.required],
      centerName: ['', Validators.required],
      MobileNumber: ['', Validators.required],
      divisionID: ['', [DropdownValidators]],
      districtID: ['', [DropdownValidators]],
      tehsilID: ['', [DropdownValidators]],
      address: ['', Validators.required],
      pinCode: ['', Validators.required]
    });
    await this.GetDivisionMasterList()
    // await this.GetTehsilMasterList()
    // await this.GetDistrictMasterList()

    this.CenterId = Number(this.route.snapshot.queryParamMap.get('id')?.toString());

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;

    //await this.loadInstituteDetails();
    if (this.CenterId) {
      await this.GetByID(this.CenterId)
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

  // async GetTehsilMasterList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetTehsilMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.TehsilMasterList = data['Data'];

  //         console.log(this.TehsilMasterList)
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

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
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.request.DistrictID)
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

  // async GetDistrictMasterList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetDistrictMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.DistrictMasterList = data['Data'];
  //         console.log(this.DistrictMasterList)
  //         // console.log(this.DivisionMasterList)
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }
  onDivisionChange() {

    const selectedDivisionID = this.request.DivisionID;

    this.filteredDistricts = this.DistrictMasterList.filter((district: any) => district.DivisionID == selectedDivisionID);

  }

  onDistrictChange() {
    const selectedDistrictID = this.request.DistrictID;
    this.filteredTehsils = this.TehsilMasterList.filter((tehsil: any) => tehsil.ID == selectedDistrictID);

  }


  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.ItiCenterService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.SSOID = data['Data']["SSOID"];
          this.request.Address = data['Data']["Address"];
          this.request.DivisionID = data['Data']["DivisionID"];
          this.ddlDivision_Change();
          this.request.DistrictID = data['Data']["DistrictID"];
          this.ddlDistrict_Change();
          this.request.TehsilID = data['Data']["TehsilID"];
          this.request.CenterName = data['Data']["CenterName"];
          this.request.CenterCode = data['Data']["CenterCode"];
          this.request.MobileNumber = data['Data']['MobileNumber']
          this.request.PinCode = data['Data']["PinCode"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
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

  get form() { return this.centerForm.controls; }
  async saveData() {
    this.isSubmitted = true;
    if (this.centerForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.CenterId) {
        this.request.CenterID = this.CenterId
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = EnumDepartment.ITI;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.ItiCenterService.SaveData(this.request)
        .then((data: any) => { 
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.router.navigate(['/CenterCreateITI']);
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


  async ResetControl() {
    this.isSubmitted = false;

    this.request = new ItiCenterMasterDataModels();
    this.centerForm.reset();
    // Reset form values if necessary
    this.centerForm.patchValue({
      ssoid: '',
      indentNumber: '',
      centerName: '',
      centerCode: '',
      divisionID: 0,
      districtID: 0,
      tehsilID: 0,
      address: '',
      pinCode: '',
      MobileNumber: ''
    });

  }

  onCancel(): void {
    this.router.navigate(['/centers']);
  }


}
