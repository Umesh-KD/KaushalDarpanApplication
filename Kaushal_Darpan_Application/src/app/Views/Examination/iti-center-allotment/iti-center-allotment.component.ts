import { Component, ElementRef, ViewChild } from '@angular/core';
import { CenterAllocationSearchModel, CenterAllocationtDataModels } from '../../../Models/CenterAllocationDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CenterAllocationService } from '../../../Services/Center_Allocation/center-allocation.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { ITIcenterAllocationSearchModel, ITICenterAllocationtDataModels } from '../../../Models/ITI/ITICenterAllocationDataModel';
import { ItiCenterMasterDataModels } from '../../../Models/ItiCenterMasterDataModels';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
@Component({
  selector: 'app-iti-center-allotment',
  standalone: false,
  
  templateUrl: './iti-center-allotment.component.html',
  styleUrl: './iti-center-allotment.component.css'
})
export class ItiCenterAllotmentComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public CenterMasterList: ITICenterAllocationtDataModels[] = [];
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
  public searchRequest = new ITIcenterAllocationSearchModel();
  public IsShowDropdown: boolean = false
  public InstituteListTemp: any = [];
  SelectedCenterID: number | null = null;
  public FilteredInstituteList: any[] = [];


  request = new ITICenterAllocationtDataModels();
  sSOLoginDataModel = new SSOLoginDataModel();
  public InstituteID: any[] = [];
  public SelectedInstituteList: any[] = [];
  public SelectedIndex: number = 0;
  constructor(
    private commonMasterService: CommonFunctionService,
    private router: Router,
    private centerAllocationService: ITICenterAllocationService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2
  ) { }

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
    this.UserID = this.sSOLoginDataModel.UserID;
    this.ddlInstitute_Change()

  }

  async ddlInstitute_Change() {
    try {
      this.loaderService.requestStarted();
      /*this.searchRequest.CenterID = this.sSOLoginDataModel.CenterID;*/
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      //Center ID
      await this.centerAllocationService.GetInstituteByCenterID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.FilteredInstituteList = data.Data;

          console.log("InstituteList in function", this.InstituteList);
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
    this.searchRequest.centerCode = ''
    this.searchRequest.Name = ''
    this.CenterMasterList = [];
    this.request = new ITICenterAllocationtDataModels();
    this.GetCenterMasterList();


  }




  async GetCenterMasterList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    try {
      this.loaderService.requestStarted();
      await this.centerAllocationService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CenterMasterList = data['Data'];

          console.log(this.CenterMasterList, "dddddd");
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
      // //Call service to save data
      await this.centerAllocationService.savedata(centersData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.ResetControl();
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

  async openModal(content: any, row: any, indexNum: number) {
    try {

      this.searchRequest.CenterID = row.CenterID;
      this.searchRequest.DepartmentID = EnumDepartment.ITI;
      await this.ddlInstitute_Change();

      const assignedInstitutes = this.CenterMasterList
        .filter(center => center.CenterID !== row.CenterID && center.InstituteIDs)
        .flatMap((center: any) =>
          center.InstituteIDs.split('|').map((institute: string) => Number(institute.trim()))
        );


      this.FilteredInstituteList = this.FilteredInstituteList.filter((institute: any) =>
        !assignedInstitutes.includes(institute.InstituteID)
      );

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


        this.CenterMasterList[this.SelectedIndex].InstituteNames = commaSeparatedNames;
        this.CenterMasterList[this.SelectedIndex].InstituteIDs = commaIds;
        this.CenterMasterList[this.SelectedIndex].SelectedInstituteList = this.SelectedInstituteList;
        this.CenterMasterList[this.SelectedIndex].Marked = 1;

        // Close the modal
        this.CloseModal();
      } else {
        this.toastr.warning('Please select at least one institute.');
      }
    } catch (error) {
      console.error("Error mapping institutes:", error);
      this.toastr.error("Failed to map institutes. Please try again.");
    }
  }

}
