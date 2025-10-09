import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeatIntakeDataModel, SeatIntakePopUpSearchModel, SeatIntakeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ItiDataMasterService } from '../../../../Services/ITI/ITIDataMaster/iti-datamaster.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { SeatIntakesDataListSearchModel } from '../../../../Models/ITI/IITIDataMasterDataModel';

@Component({
    selector: 'seat-datalist',
    templateUrl: './seat-datalist.component.html',
    styleUrls: ['./seat-datalist.component.css'],
    standalone: false
})
export class SeatDataListComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public SeatIntakeSearchFormGroup!: FormGroup;
  public searchRequest = new SeatIntakesDataListSearchModel()



  public SeatIntakeDataList: any = [];
  public Table_SearchText: string = '';
  public SeatIntakeIDnew: number=0;

  State: any;
  Message: any;
  ErrorMessage: any;

   //table feature default
   public paginatedInTableData: any[] = [];//copy of main data
   public SessionYearList: any = [];
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
    private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private ItiDataMasterService: ItiDataMasterService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private commonMasterService: CommonFunctionService, 
  ) { }

  async ngOnInit() {
    this.SeatIntakeSearchFormGroup = this.formBuilder.group(
      {
        CollegeCode: [''],
        RequestType: [''],
        AcademicYearID: [''],

      });


    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.SSOLoginDataModel,"SSOLoginDataModel")
   
    await this.GetDropdownData();
    // await this.GetTradeAndColleges()
    this.onSearch();
  }
  get _SeatIntakeSearchFormGroup() { return this.SeatIntakeSearchFormGroup.controls; }

  
 

  async GetDropdownData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetFinancialYear().then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SessionYearList = data.Data;
        if(this.SessionYearList && this.SessionYearList.length>0){
          this.searchRequest.AcademicYearID=this.SessionYearList[0].FinancialYearID;
        }
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // async GetTradeAndColleges() {
  //   this.tradeSearchRequest.action = '_getAllData'
  //   try {
  //     this.loaderService.requestStarted();

  //     const selectedCollegeTypeID = this.SeatIntakeSearchFormGroup.get('ddlCollegeType')?.value;
     
  //     this.collegeSearchRequest.action = '_getAllData'
  //     this.collegeSearchRequest.ManagementTypeID = selectedCollegeTypeID;
  //     await this.commonFunctionService.ItiCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
  //       data = JSON.parse(JSON.stringify(data));
  //       this.ItiCollegesListAll = data.Data
  //       console.log(this.ItiCollegesListAll, "ItiCollegesListAll")
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  async onSearch() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AcademicYearID = this.SSOLoginDataModel.FinancialYearID;
      this.searchRequest.action = 'college';
      await this.ItiDataMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.SeatIntakeDataList = data.Data
            console.log(this.SeatIntakeDataList, "SeatIntakeDataList")
            //table feature load
            this.loadInTable();
            //end table feature load
          }
          else {
            this.toastr.error(data.ErrorMessage)
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
  
  async onReset() {
    this.searchRequest = new SeatIntakesDataListSearchModel()
    this.onSearch()
  }


  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.SeatIntakeDataList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.SeatIntakeDataList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.SeatIntakeDataList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.SeatIntakeDataList.filter((x: { Selected: any; }) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.SeatIntakeDataList.forEach((x: { Selected: boolean; }) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.SeatIntakeDataList.filter((x: { StudentID: any; }) => x.StudentID == item.StudentID);
    data.forEach((x: { Selected: boolean; }) => {
      x.Selected = isSelected;
    });
  }
  // end table feature.

  // exportToExcel(): void {
  //   const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
  //   const filteredData = this.SeatIntakeDataList.map((item: any) => {
  //     const filteredItem: any = {};
  //     Object.keys(item).forEach(key => {
  //       if (!unwantedColumns.includes(key)) {
  //         filteredItem[key] = item[key];
  //       }
  //     });
  //     return filteredItem;
  //   });
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, 'SeatIntakeDetails.xlsx');
  // }

  // @ViewChild('ModalStatusActiveInactive') ModalStatusActiveInactive!: TemplateRef<any>;

  // async openModal(content: any, SeatIntakeID: number, ModifyBy: number) {
    
  //   this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    
  // }

  //new
  // onToggleChange(event: MouseEvent, seatIntakeID: number, ModifyBy: number) {
  //   event.preventDefault();
    
  //   this.Swal2.Confirmation("Are you sure you want to change status?", async (result: any) => {
  //     if (result.isConfirmed) {
  //       this.SeatIntakeIDnew = seatIntakeID;
  //       this.popUpsearchRequest.SeatIntakeID = seatIntakeID;
  //       await this.openModal(this.ModalStatusActiveInactive, seatIntakeID, ModifyBy);
  //     }
  //   });
  // }


  // CloseModal() {
  //   this.modalService.dismissAll();
  // }

}
