import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CenterAllotmentDataModel, CenterAllotmentSearchModel } from '../../../../Models/CenterAllotmentSearchModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CenterAllotmentService } from '../../../../Services/CenterAllotment/CenterAllotment.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { ItiCenterService } from '../../../../Services/ItiCenters/iti-centers.service';
import { CenterAllocationSearchModel } from '../../../../Models/CenterAllocationDataModels';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-center-create-iti',
  standalone: false,
  
  templateUrl: './center-create-iti.component.html',
  styleUrl: './center-create-iti.component.css'
})


export class CenterCreateITIComponent implements OnInit {
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
  public Request = new CenterAllocationSearchModel();
  public CenterAllotList: CenterAllotmentDataModel[] = []

  public CreateCenterForm!: FormGroup;
  public StartValue: number = 0;

  constructor(private commonMasterService: CommonFunctionService,
    private Router: Router, private centerAllotmentService: CenterAllotmentService,
    private ItiCenterService: ItiCenterService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {

    this.CreateCenterForm = this.fb.group({
      StartValue: ['', [DropdownValidators, this.validateIDLength]],

    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetCategory()
    await this.GetDistrictMasterList()
    await this.GetAllData()


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
    this.Request.DepartmentID = EnumDepartment.ITI;
    this.Request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.Request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.Request.DistrictID = this.searchRequest.DistrictID
    this.Request.TehsilID = this.searchRequest.TehsilID
    try {
      this.loaderService.requestStarted();
      await this.ItiCenterService.GetAllData(this.Request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.CenterAllotList = data['Data'];
          console.log(this.CenterAllotList, 'CenterAllotList');
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
          console.log(this.DistrictMasterList)
          // console.log(this.DivisionMasterList)
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
      if (this.CreateCenterForm.invalid) {
        return;
      }

      this.loaderService.requestStarted();

      //get selected and set session
      var filteredCenterCreations = this.CenterAllotList.filter(x => x.Marked == true);
      filteredCenterCreations.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
        x.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        x.EndTermID = this.sSOLoginDataModel.EndTermID;
        x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      });
      console.log("filteredCenterCreations", filteredCenterCreations);
      //save
      await this.ItiCenterService.SaveCenterData(filteredCenterCreations, this.StartValue)
        .then(async (data: any) => {
          //
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          console.log("data on save", data)
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            await this.GetAllData();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to save!');
        });
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      this.loaderService.requestEnded();
    }
  }

  async ClearSearchData() {
    this.searchRequest.DistrictID = 0;
    this.searchRequest.InstitutionManagementTypeID = 0;
    this.searchRequest.TehsilID = 0
    await this.GetAllData()
  }

  exportToExcel(): void {
    const wantedColumnsOrder = ['SSOID', 'InstituteCode', 'Institutename', 'DistrictNameEnglish', 'Address'];

    const unwantedColumns = [
      'CenterID', 'DistrictID', 'DivisionID', 'EndTermID', 'Id', 'ManagementTypeId', 'Marked', 'MobileNumber', 'OrderBy_CCCodeFlag', 'OrderBy_ManagementType', 'PinCode',
      'TehsilID', 'TehsilNameEnglish'
    ];

    // Filter rows where Marked === true
    const filteredMarkedList = this.CenterAllotList.filter((item: any) => item.Marked === true);

    // Prepare data in wanted order
    const filteredData = filteredMarkedList.map((item: any) => {
      const filteredItem: any = {};

      // Add columns in the specific order first
      wantedColumnsOrder.forEach(key => {
        if (item.hasOwnProperty(key)) {
          filteredItem[key] = item[key];
        }
      });

      // Add remaining columns except unwanted ones
      Object.keys(item).forEach(key => {
        if (!wantedColumnsOrder.includes(key) && !unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });

      return filteredItem;
    });

    if (filteredData.length === 0) {
      alert('No data with Marked = true to export.');
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Calculate auto width
    const columnWidths = Object.keys(filteredData[0] || {}).map(key => {
      const maxLength = Math.max(
        key.length,
        ...filteredData.map((row: any) => (row[key] ? row[key].toString().length : 0))
      );
      return { wch: maxLength + 2 }; // +2 for padding
    });

    ws['!cols'] = columnWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Center-Report-Data.xlsx');
  }

}
