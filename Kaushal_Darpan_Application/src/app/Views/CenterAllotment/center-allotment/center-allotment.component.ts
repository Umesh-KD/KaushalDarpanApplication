import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CenterAllotmentDataModel, CenterAllotmentSearchModel, UpdateCCCodeDataModel, } from '../../../Models/CenterAllotmentSearchModel';
import { CenterAllotmentService } from '../../../Services/CenterAllotment/CenterAllotment.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ItiCenterService } from '../../../Services/ItiCenters/iti-centers.service';

@Component({
  selector: 'app-center-allotment',
  templateUrl: './center-allotment.component.html',
  styleUrls: ['./center-allotment.component.css'],
  standalone: false
})
export class CenterAllotmentComponent implements OnInit {
  public isUpdate: boolean = false;
  public InstituteID: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictMasterList: any = [];
  public State: number = -1;
  public CategoryList: any = []
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public CollegeMasterList: any = []
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public TehsilList: any = []
  public filteredTehsils: any = []
  public Table_SearchText: string = "";
  public searchRequest = new CenterAllotmentSearchModel();
  public CenterAllotList: CenterAllotmentDataModel[] = []
  public SelectedCount: number = 0
  public AllInTableSelect: boolean = false;
  public IsCheck: boolean = false;

  public StartValue: number = 0;
  public UpdateCCcodeForm!: FormGroup;
  public request = new UpdateCCCodeDataModel();
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  constructor(private commonMasterService: CommonFunctionService,
    private Router: Router,
    private centerAllotmentService: CenterAllotmentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private ItiCenterService: ItiCenterService,
  ) {
  }

  async ngOnInit() {

    this.UpdateCCcodeForm = this.fb.group({
      Institutename: [{ value: '', disabled: true }, Validators.required],
      MobileNumber: [{ value: '', disabled: true }, Validators.required],
      Email: [{ value: '', disabled: true }, Validators.required],
      SSOID: [{ value: '', disabled: true }, Validators.required],
      CCCode: ['', Validators.required],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetCategory()
    await this.GetDistrictMasterList()
    await this.GetAllData()
    await this.GetDateConfig();

  }

  validateIDLength(control: any) {
    const value = control.value; // Input value
    if (!value) return null; // If empty, no validation error

    if (value.length > 5) {
      return { invalidLength: true }; // Error if length exceeds 5
    }

    return null; // Validation passed
  }

  async GetAllData() {

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    try {
      this.loaderService.requestStarted();
      await this.centerAllotmentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AllInTableSelect = false;
          this.CenterAllotList = data['Data'];
          console.log(this.CenterAllotList)

          // this.CenterAllotList.forEach(x => {
          //   x.Marked = true
          // })
       
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

  //async GetTehsil() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetTehsilMaster()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.TehsilList = data['Data'];

  //        //console.log(this.categoryList)
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

  onDistrictChange() {
    try {
      this.searchRequest.TehsilID = 0;//all
      this.filteredTehsils = [];
      if (this.searchRequest.DistrictID == 0) {
        return;
      }
      this.loaderService.requestStarted();
      this.commonMasterService.TehsilMaster_DistrictIDWise(this.searchRequest.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.filteredTehsils = data['Data'];
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

  async GetCategory() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CategoryList = data['Data'];

          //console.log(this.categoryList)
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

  async GetDistrictMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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

  async ClearSearchData() {
    this.searchRequest.InstitutionManagementTypeID = 0;
    this.searchRequest.DistrictID = 0;
    this.searchRequest.TehsilID = 0
    await this.GetAllData()
  }


  async GetDateConfig() {
    
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "CenterCreate",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.CenterCreate;
      }, (error: any) => console.error(error)
      );
  }

  async OnSubmit() {
    try {
      this.isSubmitted = true;
      this.IsCheck = this.CenterAllotList.some(x => x.Marked && x.Capacity == 0 || x.Marked && x.Capacity == null)

      if (this.IsCheck) {
        this.toastr.error('Please Fill Capacity Value')
        return
      }
      
      
      this.Swal2.Confirmation("Are you sure You want to create Selected Centers ?.",
        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            //get selected and set session
            var filteredCenterCreations = this.CenterAllotList.filter(x => x.Marked == true);
            filteredCenterCreations.forEach(x => {
              x.ModifyBy = this.sSOLoginDataModel.UserID;
              x.DepartmentID = this.sSOLoginDataModel.DepartmentID;
              x.EndTermID = this.sSOLoginDataModel.EndTermID;
              x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
            });
            //save
            await this.centerAllotmentService.SaveData(filteredCenterCreations, this.StartValue)
              .then(async (data: any) => {
               
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(data.ErrorMessage)
                }
              })
              .catch((error: any) => {
                console.error(error);
                this.toastr.error('Failed to save!');
              });
          }
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  get totalInTableSelected(): number {
    return this.CenterAllotList.filter(x => x.Marked)?.length;
  }

  selectInTableAllCheckbox() {
    this.CenterAllotList.forEach(x => {
      x.Marked = this.AllInTableSelect;
    });
  }

  //selectInTableSingleCheckbox(isSelected: boolean, item: any) {
  //  const data = this.CenterAllotList.filter(x => x.InstituteID == item.InstituteID);
  //  data.forEach(x => {
  //    x.Marked = isSelected;
  //  });
  //  //select all(toggle)
  //  this.AllInTableSelect = this.CenterAllotList.every(r => r.Marked);
  //}


  selectInTableSingleCheckbox(isSelected: boolean, item: any,idx:number=0) {
    this.CenterAllotList.forEach((x: any) => {
      if (x.index === idx) {
        x.Marked = isSelected;

        // Example logic based on index
        if (x.index === 1) {
          console.log("Item with index 1 is selected:", x);
        }
      }
    });

    // Update the overall `AllInTableSelect` state
    this.AllInTableSelect = this.CenterAllotList.every(r => r.Marked);
  }



  async onRemove() {
    try {
      this.isSubmitted = true;
      this.Swal2.Confirmation("Are you sure You want to Remove Selected Centers?.",
        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            //get selected and set session
            var filteredCenterCreations = this.CenterAllotList.filter(x => x.Marked == true);
            filteredCenterCreations.forEach(x => {
              x.ModifyBy = this.sSOLoginDataModel.UserID;
              x.DepartmentID = this.sSOLoginDataModel.DepartmentID;
              x.EndTermID = this.sSOLoginDataModel.EndTermID;
              x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
            });
            //save
            await this.centerAllotmentService.RemoveCenter(filteredCenterCreations)
              .then(async (data: any) => {
               
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(data.ErrorMessage)
                }
              })
              .catch((error: any) => {
                console.error(error);
                this.toastr.error('Failed to save!');
              });
          }
        });
    }
    catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }


}
