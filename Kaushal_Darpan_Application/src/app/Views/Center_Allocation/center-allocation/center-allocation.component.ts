import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../Services/Center_Allocation/center-allocation.service';
import { CenterAllocationSearchModel, CenterAllocationtDataModels, InstituteList } from '../../../Models/CenterAllocationDataModels';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TableSearchFilterPipe } from '../../../Pipes/table-search-filter.pipe';
import { CommonModule } from '@angular/common';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-center-allocation',
  templateUrl: './center-allocation.component.html',
  styleUrls: ['./center-allocation.component.css'],
  standalone: false
})
export class CenterAllocationComponent implements OnInit {
  private commonMasterService = inject(CommonFunctionService);
  private router = inject(Router);
  private centerAllocationService = inject(CenterAllocationService);
  private toastr = inject(ToastrService);
  private loaderService = inject(LoaderService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private _fb = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private Swal2 = inject(SweetAlert2);
  public appsettingConfig = inject(AppsettingService);
  public http = inject(HttpClient);

  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public CenterMasterList: any[] = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  searchByCenterCode: string = '';
  searchByCenterName: string = '';
  public Table_SearchText: string = '';
  public InstituteList: any = [];
  public ManagmentTypeList: any = [];
  public settingsMultiselect: object = {};
  public searchRequest = new CenterAllocationSearchModel();
  public IsShowDropdown: boolean = false
  public InstituteListTemp: any = [];
  SelectedCenterID: number = 0;
  SelectedInstituteID: number = 0;
  searchByDistrict: number = 0;
  public FilteredInstituteList: any[] = [];
  assignedInstitutes: any = []

  request = new CenterAllocationtDataModels();
  sSOLoginDataModel = new SSOLoginDataModel();
  public InstituteID: any[] = [];
  public SelectedInstituteList: any[] = [];
  public SelectedIndex: number = 0;
  public DistrictMasterList: any = []
  public InstituteMasterList: any = []
  BackupCenterMasterList: any[] = [];
  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() { }

  async ngOnInit() {


    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'InstituteID',
      textField: 'InstituteName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;



    await this.GetCenterMasterList();
    this.BackupCenterMasterList = [...this.CenterMasterList];
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetDistrictMasterList();
    await this.ddlInstitute_Change()
  }

  async ddlInstitute_Change() {
    
    try {
      this.loaderService.requestStarted();
      /*this.searchRequest.CenterID = this.sSOLoginDataModel.CenterID;*/
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      
      console.log(this.searchRequest, 'RequestData')

      //Center ID
      await this.centerAllocationService.GetInstituteByCenterID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.FilteredInstituteList = data.Data;
          this.checkCentersIfExists()
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  onCheckboxChange(row: any) {
  }

  // You can also check for 'InstituteNames' condition
  checkInstituteNames(row: any) {
    if (row.InstituteNames && row.InstituteNames.length > 0) {
      this.IsShowDropdown = false; // Hide dropdown if InstituteNames are present
    } else {
      this.IsShowDropdown = true; // Show dropdown if no InstituteNames are available
      this.ddlInstitute_Change()
    }
  }

  // Method to handle the cancel button click
  ResetControl() {
    // Reset all filter fields
    this.searchByCenterCode = '';
    this.searchByCenterName = '';
    this.GetCenterMasterList();
    this.request = new CenterAllocationtDataModels();
    this.CenterMasterList = [];
  }

  async onSearchClick() {
    await this.GetCenterMasterList();
  }

  async resetList() {
    this.CenterMasterList = [];
    this.searchByCenterCode = '';
    this.searchByCenterName = '';
    await this.GetCenterMasterList();
  }

  async GetCenterMasterList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.CenterCode = this.searchByCenterCode;
    try {
      this.loaderService.requestStarted();
      await this.centerAllocationService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterMasterList = data['Data'];
          console.log(this.CenterMasterList,'CenterMasterList')
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.CenterMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, "CollegMaster.xlsx");
      } catch (Ex) {
        console.log(Ex);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    } else {
      this.toastr.warning("No Record Found!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }


   
  }

  async saveData() {
    try {
      debugger
      this.loaderService.requestStarted();
      // Collect data from the CenterMasterList and flatten it to process the institutes
      const centersData = this.CenterMasterList.filter(f => f.Marked == 1).flatMap((center: any) => {
        // Check if InstituteList exists and is an array before proceeding
        return (center.InstituteIDs) ?
          center.InstituteIDs.split('|').map((institute: any) => {
            return {
              CenterID: center.CenterID,
              InstituteID: institute,
              ModifyBy: this.sSOLoginDataModel.UserID,
              DepartmentID: this.sSOLoginDataModel.DepartmentID,
              EndtermID: this.sSOLoginDataModel.EndTermID,
              CourseTypeID: this.sSOLoginDataModel.Eng_NonEng
            };
          }) : []; // If InstituteList is undefined or not an array, return an empty array
      });
      if (centersData?.length <= 0) {
        this.toastr.error("Please select valid data!");
        return;
      }
      // //Call service to save data
      await this.centerAllocationService.savedata(centersData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
  /*          this.ResetControl();*/
            setTimeout(() => {
              window.location.reload();
            }, 500); 
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error("An error occurred while saving the data.");
        });


    } catch (ex) {
      console.log(ex);
      this.toastr.error("An unexpected error occurred.");
    } finally {
      this.loaderService.requestEnded();
    }

  }

  async btnDelete_OnClick(InstituteID: number) {
    this.Swal2.Confirmation("Are you sure you want to delete this?", async (result: any) => {
      if (result.isConfirmed) {
        try {
          this.loaderService.requestStarted();
          await this.centerAllocationService.DeleteDataByID(InstituteID, this.UserID)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State === 0) {
                this.toastr.success(this.Message);
                this.GetCenterMasterList();
              } else {
                this.toastr.error(this.ErrorMessage);
              }
            });
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onItemSelect(item: any, centerID: number) {

    if (!this.SelectedInstituteList.includes(item)) {
      this.SelectedInstituteList.push(item);
    }

  }

  onDeSelect(item: any, centerID: number) {

    this.SelectedInstituteList = this.SelectedInstituteList.filter((i: any) => i.InstituteID !== item.InstituteID);

  }

  onSelectAll(items: any[], centerID: number) {

    this.SelectedInstituteList = [...items];

  }

  onDeSelectAll(centerID: number) {

    this.SelectedInstituteList = [];

  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }


  @ViewChild('content') content: ElementRef | any;

  checkCentersIfExists() {
    this.FilteredInstituteList = this.FilteredInstituteList.filter((institute: any) =>
      !this.assignedInstitutes.includes(institute.InstituteID)
    );

    this.FilteredInstituteList = Array.from(
      new Map(this.FilteredInstituteList.map(item => [item.InstituteID, item])).values()
    );
  }

  async openModal(content: any, row: any, indexNum: number) {
    console.log(row, 'RowData')
    try {

      this.SelectedInstituteID = row.InstituteID
   
      //this.searchRequest.CenterID = row.CenterID;
      this.searchRequest.DistrictID = row.DistrictID
      await this.ddlInstitute_Change();
      //if (this.DistrictMasterList > 0) {
      //  await this.GetInstituteMaster_ByDistrictWise(this.DistrictMasterList[0].ID)
      //} else {
      //  await this.ddlInstitute_Change();
      //}



      this.assignedInstitutes = this.CenterMasterList
        .filter(center => center.CenterID !== row.CenterID && center.InstituteIDs)
        .flatMap((center: any) =>
          center.InstituteIDs.split('|').map((institute: string) => Number(institute.trim()))
        );

      this.FilteredInstituteList = this.FilteredInstituteList.filter((institute: any) =>
        !this.assignedInstitutes.includes(institute.InstituteID)
      );

      console.log("FilteredInstituteList after", this.FilteredInstituteList)

      this.FilteredInstituteList = Array.from(
        new Map(this.FilteredInstituteList.map(item => [item.InstituteID, item])).values()
      );

      this.SelectedIndex = indexNum;
      this.SelectedInstituteList = [];
      this.SelectedCenterID = row.CenterID;


      if (row.InstituteIDs) {
        const selectedIds = row.InstituteIDs.split('|').map((id: string) => Number(id.trim()));
        this.SelectedInstituteList = this.FilteredInstituteList.filter((item: any) =>
          selectedIds.includes(item.InstituteID)
        );


        this.SelectedInstituteList = Array.from(
          new Map(this.SelectedInstituteList.map(item => [item.InstituteID, item])).values()
        );
      }

      // Open the modal
      await this.modalService
        .open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } catch (error) {
      console.error("Error opening modal:", error);
      this.toastr.error("Failed to open modal. Please try again.");
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
  }

  MapInsitute() {
    

    try {
      if (this.SelectedInstituteList.length > 0) {
        const commaSeparatedNames = Array.from(
          new Set(this.SelectedInstituteList.map(itm => itm.InstituteName))
        ).join('|');

        const commaIds = Array.from(
          new Set(this.SelectedInstituteList.map(itm => itm.InstituteID))
        ).join('|');

        console.log(commaSeparatedNames);

        // Find the object based on InstituteID
        const center = this.CenterMasterList.find(
          (center) => center.InstituteID === this.SelectedInstituteID
        );

        if (center) {
          center.InstituteNames = commaSeparatedNames;
          center.InstituteIDs = commaIds;
          center.SelectedInstituteList = this.SelectedInstituteList;
          center.Marked = 1;

          // Close the modal
          this.CloseModal();
        } else {
          this.toastr.warning('Invalid Institute ID.');
        }
      } else {
        this.toastr.warning('Please select at least one institute.');
      }
    } catch (error) {
      console.error('Error mapping institutes:', error);
      this.toastr.error('Failed to map institutes. Please try again.');
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
          console.log(this.DistrictMasterList, 'DATAAA')
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

  ChangeInstituteNames(ID: any) {
    if (ID) {
      console.log(ID, 'ID')
      this.IsShowDropdown = false;
      this.searchRequest.CenterID = this.DistrictMasterList[0].ID;
      this.ddlInstitute_Change();
    } else {
      this.IsShowDropdown = true;
      this.FilteredInstituteList = [];
    }
  }



  exportToExcel(): void {
    const unwantedColumns = [
      'EndTermID', 'InstituteID', 'InstituteIDs', 'CenterID', 'DistrictID', 'InstituteNames', 'UserID'
    ];
    const filteredData = this.CenterMasterList.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CenterMasterList' + '.xlsx');
  }

  DownloadFile(fileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${fileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = this.generateFileName('pdf');
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }
}








