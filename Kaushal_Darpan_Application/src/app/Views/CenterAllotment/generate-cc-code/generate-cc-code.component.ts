import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CenterAllotmentDataModel, CenterAllotmentSearchModel, UpdateCCCodeDataModel } from '../../../Models/CenterAllotmentSearchModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CenterAllotmentService } from '../../../Services/CenterAllotment/CenterAllotment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-generate-cc-code',
  templateUrl: './generate-cc-code.component.html',
  styleUrl: './generate-cc-code.component.css',
  standalone: false
})
export class GenerateCcCodeComponent {
  public isSubmitted: boolean = false;
  public DistrictMasterList: any = [];
  public CategoryList: any = []
  public modalReference: NgbModalRef | undefined;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public filteredTehsils: any = []
  public Table_SearchText: string = "";
  public searchRequest = new CenterAllotmentSearchModel();
  public CenterAllotList: any = []

  public CreateCenterForm!: FormGroup;
  public StartValue: number = 0;
  public UpdateCCcodeForm!: FormGroup;
  public request = new UpdateCCCodeDataModel();
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  constructor(
    private commonMasterService: CommonFunctionService,
    private centerAllotmentService: CenterAllotmentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
  ) {}

  async ngOnInit() {

    this.CreateCenterForm = this.fb.group({
      StartValue: ['', [DropdownValidators, this.validateIDLength]],

    });

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

  validateNumber(event: KeyboardEvent) {
    let input = event.target as HTMLInputElement;
    if (input.value.length >= 5) {
      event.preventDefault(); // Prevent entering more than 5 digits
    }
  }

  validateIDLength(control: any) {
    const value = control.value; // Input value
    if (!value) return null; // If empty, no validation error

    if (value.length > 5) {
      return { invalidLength: true }; // Error if length exceeds 5
    }

    return null; // Validation passed
  }


  get form() { return this.CreateCenterForm.controls; }

  async GetAllData() {

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    try {
      this.loaderService.requestStarted();
      await this.centerAllotmentService.GetCenterForCcCode(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          this.CenterAllotList = data['Data'];
          console.log(this.CenterAllotList)
          this.CenterAllotList.forEach((x: any) => {
            x.Marked = true
          })
       
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

  onDistrictChange() {
    try {
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

  async OnSubmit() {
    try {
      this.isSubmitted = true;
      // if (this.CreateCenterForm.invalid) {
      //   return;
      // }
      this.Swal2.Confirmation("Are you sure?,<br/>'CC Code Generation' is the one time process, Please do all things then proceed.",
        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            //get selected and set session
            var filteredCenterCreations = this.CenterAllotList.filter((x: any) => x.Marked == true);

            // filteredCenterCreations.forEach((x: any) => {
            //   x.ModifyBy = this.sSOLoginDataModel.UserID;
            //   x.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            //   x.EndTermID = this.sSOLoginDataModel.EndTermID;
            //   x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
            // });

            filteredCenterCreations = filteredCenterCreations.map((x: any) => {
              x.ModifyBy = this.sSOLoginDataModel.UserID;
              x.DepartmentID = this.sSOLoginDataModel.DepartmentID;
              x.EndTermID = this.sSOLoginDataModel.EndTermID;
              x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

              return {
                CenterID: x.CenterID,
                ModifyBy: x.ModifyBy,
                DepartmentID: x.DepartmentID,
                EndTermID: x.EndTermID,
                Eng_NonEng: x.Eng_NonEng,
                CCCode: x.CCCode
              };
            });
            //save
            await this.centerAllotmentService.GenerateCCCode(filteredCenterCreations, this.StartValue)
              .then(async (data: any) => {
                //
               
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.GetAllData();
                } else if (data.State == EnumStatus.Warning) {
                  this.toastr.warning(data.Message)
                } else {
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


  async ClearSearchData() {
    this.searchRequest.DistrictID = 0;
    this.searchRequest.InstitutionManagementTypeID = 0;
    this.searchRequest.TehsilID = 0
    await this.GetAllData()
  }

  onEdit(content: any, row: any) {
    this.searchRequest = new CenterAllotmentSearchModel();
    this.searchRequest.CenterID = row.CenterID;
    this.searchRequest.EndTermID = row.EndTermID;
    this.searchRequest.DepartmentID = EnumDepartment.BTER;
    this.GetCenterByID();
    this.modalReference = this.modalService.open(content, { size: 'sm', backdrop: 'static' });
  }
  closeModal() {
    this.modalReference?.close();
  }

  async GetCenterByID() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      await this.centerAllotmentService.GetCenterByID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];
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

  async UpdateCCCode() {
    try {
      this.Swal2.Confirmation("Are you sure?,<br/>'You want to update CC Code'",
        async (result: any) => {
          if (result.isConfirmed) {

            this.request.ModifyBy = this.sSOLoginDataModel.UserID;
            this.request.EndTerm = this.sSOLoginDataModel.EndTermID;
            await this.centerAllotmentService.UpdateCCCode(this.request)
              .then(async (data: any) => {
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.closeModal();
                  await this.GetAllData();
                } else {
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

  exportToExcel(): void {
    const unwantedColumns = [
      'InstituteID','DistrictNameEnglish','TehsilNameEnglish','AdmissionCategory','InstituteNameHindi','DistrictID',
      'TehsilID','DivisionID','PinCode','CenterID','InstituteCode','Marked','Address','EndTermID'
    ];
    const filteredData = this.CenterAllotList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach((key) => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CenterList.xlsx');
  }
}
