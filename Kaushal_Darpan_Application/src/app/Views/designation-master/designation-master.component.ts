import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { DesignationMasterDataModel, DesignationMasterSearchModel } from '../../Models/DesignationMasterDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DesignationMasterService } from '../../Services/DesignationMaster/Designation-master.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { EnumStatus } from '../../Common/GlobalConstants';

@Component({
    selector: 'app-designation-master',
    templateUrl: './designation-master.component.html',
    styleUrls: ['./designation-master.component.css'],
    standalone: false
})
export class DesignationMasterComponent implements OnInit {
  DesignationMasterFormGroup!: FormGroup;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DesignationMasterList: any = [];
  public StaffTypeList: any = [];
  public UserID: number = 0;
  searchText: string = ''; // This is for search input
  Table_SearchText: string = ''; // Add this property
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  request = new DesignationMasterDataModel();
  searchRequest = new DesignationMasterSearchModel();
  activeRequest = new DesignationMasterSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private designationMasterService: DesignationMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.DesignationMasterFormGroup = this.formBuilder.group({
      txtDesignationName: ['', Validators.required],
      txtDesignationNameHindi: ['', Validators.required],
      txtDesignationNameShort: ['', Validators.required],
      IsActive: ['true'],
      StaffTypeID: ['', [DropdownValidators]],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    await this.GetStaffTypeData();
    await this.GetDesignationMasterList();
  }

  get form() {
    return this.DesignationMasterFormGroup.controls;
  }

  async GetDesignationMasterList() {

    try {
      this.loaderService.requestStarted();
      await this.designationMasterService.GetAllDesignations(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DesignationMasterList = data['Data'];
          this.loadInTable();
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async SaveData() {
    this.isSubmitted = true;
    if (this.DesignationMasterFormGroup.invalid) {
      this.toastr.error('Form is invalid');
      return
    }
    this.request.UserID = this.sSOLoginDataModel.UserID;
    try {
      await this.designationMasterService.SaveData(this.request)
      
        .then((data: any) => {
          if (data.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetDesignationMasterList()
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
  }

  async btnEdit_OnClick(DesignationID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.designationMasterService.GetByID(DesignationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];

          // Patch the form group with the fetched data
          this.DesignationMasterFormGroup.patchValue({
            txtDesignationName: this.request.DesignationNameEnglish,
            txtDesignationNameHindi: this.request.DesignationNameHindi,
            txtDesignationNameShort: this.request.DesignationNameShort,
            ActiveStatus: this.request.ActiveStatus,
          });

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async btnDelete_OnClick(DesignationID: number) {
    this.isSubmitted = false;
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.designationMasterService.DeleteDataByID(DesignationID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message);
                  await this.GetDesignationMasterList();
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

  async ResetControl() {
    this.isSubmitted = false;
    // Reset the request object
    this.request = new DesignationMasterDataModel();

    // Reset the form group
    this.DesignationMasterFormGroup.reset({
      txtDesignationName: '',
      txtDesignationNameHindi: '',
      txtDesignationNameShort: '',
      ActiveStatus: 'true', // Assuming true is the default active status
    });

    await this.CloseModalPopup();
  }

  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ViewandUpdate(content: any, id : number = 0) {
    if(id > 0) {
      await this.btnEdit_OnClick(id);
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });    
  }

  async CloseModalPopup() {
    this.request = new DesignationMasterDataModel();
    this.modalService.dismissAll();
  }

  async ResetSearch() {
    this.searchRequest = new DesignationMasterSearchModel();
    await this.GetDesignationMasterList();
  }

  async DesignationActiveDeActive(ID: number, IsActive: boolean) {
    if (ID != 0) {
      this.activeRequest.DesignationID = ID;
      this.activeRequest.IsActive = IsActive;
      this.activeRequest.UserID = this.sSOLoginDataModel.UserID;
      await this.designationMasterService.DesignationActiveDeActive(this.activeRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.GetDesignationMasterList();
          this.activeRequest = new DesignationMasterSearchModel();
          // Clear array after successful save
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });
    }
  }

  exportToExcel(): void {
    if (!this.DesignationMasterList || this.DesignationMasterList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }
    const unwantedColumns = ['DesignationID'];

    const columnOrder = [
      'StaffType_str', 'DesignationNameEnglish', 'DesignationNameHindi' ,'DesignationNameShort' ,'Status' 
    ];

    const filteredData = this.DesignationMasterList.map((item: any) => {
      const row: any = {};
      columnOrder.forEach(col => {
        if (!unwantedColumns.includes(col)) {
          row[col] = item[col] ?? ''; // fallback if value missing
        }
      });

      return row;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `designation_master_${timestamp}.xlsx`);
  }

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.DesignationMasterList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.DesignationMasterList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.DesignationMasterList.length;
  }
  // (replace org. list here)
  
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  
  // end table feature
}
