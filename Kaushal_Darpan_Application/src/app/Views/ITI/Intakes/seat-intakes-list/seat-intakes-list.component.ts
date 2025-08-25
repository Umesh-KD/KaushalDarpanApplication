import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeatIntakeDataModel, SeatIntakePopUpSearchModel, SeatIntakeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-seat-intakes-list',
    templateUrl: './seat-intakes-list.component.html',
    styleUrls: ['./seat-intakes-list.component.css'],
    standalone: false
})
export class SeatIntakesListComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public SeatIntakeSearchFormGroup!: FormGroup;
  public SeatIntakeSearchFormGroupPopUp!: FormGroup;
  public searchRequest = new SeatIntakeSearchModel()
  public popUpsearchRequest = new SeatIntakePopUpSearchModel();
  public DistrictList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel()
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ItiTradeListAll: any = []
  public ItiCollegesListAll: any = []
  public ManagmentTypeList: any = [];
  public InstituteCategoryList: any = [];
  public ITITradeSchemeList: any = [];
  public ITIRemarkList: any = [];
  public SanctionedList: any = [];
  public SeatIntakeDataList: any = [];
  public Table_SearchText: string = '';
  public SeatIntakeIDnew: number=0;

  State: any;
  Message: any;
  ErrorMessage: any;

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
    private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private ItiSeatIntakeService: ItiSeatIntakeService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.SeatIntakeSearchFormGroup = this.formBuilder.group(
      {
        ddlCollege: [''],
        ddlDistrict: [''],
        ddlCollegeType: [''],
        ddlInstitutionCategory: [''],
        ddlTrade: [''],
        txtShift: [''],
        ddlLastSession: [''],
        ddlRemark: [''],
        ddlTradeScheme: [''],
        txtUnitNo: [''],
        ddlSanctioned: [''],
        ddlStatus: [''],
        CollegeCode: [''],
        TradeCode:['']

      });

    this.SeatIntakeSearchFormGroupPopUp = this.formBuilder.group(
      {
       
        OrderDate: [''],
        OrderNo: ['']
       
      });



    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.SSOLoginDataModel,"SSOLoginDataModel")
    await this.GetDropdownData()
    await this.GetTradeAndColleges()
    this.onSearch();
  }
  get _SeatIntakeSearchFormGroup() { return this.SeatIntakeSearchFormGroup.controls; }
  get _SeatIntakeSearchFormGroupPopUp() { return this.SeatIntakeSearchFormGroupPopUp.controls; }

  async GetDropdownData() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetDistrictMaster().then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.DistrictList = parsedData.Data;
        console.log(this.DistrictList, "DistrictList")
      }, error => console.error(error));

      await this.commonFunctionService.GetManagType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ManagmentTypeList = data['Data'];
          console.log(this.ManagmentTypeList, "ManagmentTypeList")
        }, error => console.error(error));

      await this.commonFunctionService.GetCollegeCategory()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteCategoryList = data['Data'];
        console.log(this.InstituteCategoryList, "InstituteCategoryList")
      }, error => console.error(error));

      await this.commonFunctionService.GetCommonMasterData("IITTradeScheme").then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
        console.log(this.ITITradeSchemeList, "ITITradeSchemeList")
      }, error => console.error(error));

      await this.commonFunctionService.GetCommonMasterDDLByType('Sanctioned').then((data: any) => {
        this.SanctionedList = data.Data;
        console.log(this.SanctionedList, "SanctionedList")
      }, error => console.error(error));

      await this.commonFunctionService.GetCommonMasterData("ItiRemark").then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITIRemarkList = parsedData.Data;
        console.log(this.ITIRemarkList, "ITIRemarkList")
      }, error => console.error(error));

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeAndColleges() {
    this.tradeSearchRequest.action = '_getAllData'
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeListAll = data.Data
        console.log(this.ItiTradeListAll, "ItiTradeListAll")
      })

      const selectedCollegeTypeID = this.SeatIntakeSearchFormGroup.get('ddlCollegeType')?.value;
      //console.log("selectedCollegeTypeID", selectedCollegeTypeID);
      this.collegeSearchRequest.action = '_getAllData'
      this.collegeSearchRequest.ManagementTypeID = selectedCollegeTypeID;
      await this.commonFunctionService.ItiCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiCollegesListAll = data.Data
        console.log(this.ItiCollegesListAll, "ItiCollegesListAll")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  ExportActiveSeatIntake(): void {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AcademicYearID = this.SSOLoginDataModel.FinancialYearID;
       this.ItiSeatIntakeService.GetActiveSeatIntake(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
          const filteredData = data.Data.map((item: any) => {
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
          XLSX.writeFile(wb, 'SeatIntakeDetails.xlsx');


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

  async onSearch() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AcademicYearID = this.SSOLoginDataModel.FinancialYearID;
      await this.ItiSeatIntakeService.GetAllData(this.searchRequest)
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
    this.searchRequest = new SeatIntakeSearchModel()
    this.onSearch()
  }

  async DeleteById(ID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.ItiSeatIntakeService.DeleteById(ID, this.SSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.onSearch();
                } else {
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
      });
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

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
    const filteredData = this.SeatIntakeDataList.map((item: any) => {
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
    XLSX.writeFile(wb, 'SeatIntakeDetails.xlsx');
  }

  @ViewChild('ModalStatusActiveInactive') ModalStatusActiveInactive!: TemplateRef<any>;

  async openModal(content: any, SeatIntakeID: number, ModifyBy: number) {
    
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    
  }

  //new
  onToggleChange(event: MouseEvent, seatIntakeID: number, ModifyBy: number) {
    event.preventDefault();
    
    this.Swal2.Confirmation("Are you sure you want to change status?", async (result: any) => {
      if (result.isConfirmed) {
        this.SeatIntakeIDnew = seatIntakeID;
        this.popUpsearchRequest.SeatIntakeID = seatIntakeID;
        await this.openModal(this.ModalStatusActiveInactive, seatIntakeID, ModifyBy);
      }
    });
  }


  //old
  //onToggleChange(SeatIntakeID: number, ModifyBy: number) {
  //  this.SeatIntakeIDnew = SeatIntakeID;
  //  // Confirm the status change
  //  this.Swal2.Confirmation("Are you sure you want to change status?", async (result: any) => {
  //    if (result.isConfirmed) {
  //      //await this.openModalGenerateOTP('#ModalStatusActiveInactive',SeatIntakeID, ModifyBy);
  //      this.popUpsearchRequest.SeatIntakeID = SeatIntakeID;
  //      await this.openModal(this.ModalStatusActiveInactive, SeatIntakeID, ModifyBy);
        
  //    }
  //  });
  //}
  CloseModal() {
    this.modalService.dismissAll();
  }


  async UpdateIntakeStatus() {
    debugger;
    try {

      // Show loading indicator

      this.loaderService.requestStarted();
     
      // Call the service to update the status
      //const IsActive = !IsActive; // Toggle the current state
      let searchRequest = new SeatIntakeDataModel();
      searchRequest.SeatIntakeID = this.popUpsearchRequest.SeatIntakeID;
      searchRequest.OrderNo = this.popUpsearchRequest.OrderNo;
      searchRequest.OrderDate = this.popUpsearchRequest.OrderDate;
      searchRequest.ModifyBy = this.SSOLoginDataModel.UserID;
      await this.ItiSeatIntakeService.ActiveStatusByID(searchRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            // Reload data after successful update
            this.onSearch();
            this.CloseModal();

          } else {
            this.toastr.error(this.ErrorMessage);
          }

        }, (error: any) => console.error(error));

    } catch (ex) {

      console.log(ex);

    } finally {

      setTimeout(() => {

        this.loaderService.requestEnded();

      }, 200);

    }

  }

  async SaveDataModal() {
    debugger;
    //alert(this.SeatIntakeIDnew);
    //console.log('testdata', this.popUpsearchRequest)
    try {
      this.UpdateIntakeStatus();
      //await this.ItiSeatIntakeService.UpdateDataorder(this.popUpsearchRequest.OrderNo, this.popUpsearchRequest.OrderDate, this.SeatIntakeIDnew)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    console.log(data);
      //    this.State = data['State'];
      //    this.Message = data['Message'];
      //    this.ErrorMessage = data['ErrorMessage'];
      //    if (this.State === EnumStatus.Success) {
      //      this.toastr.success(this.Message)    
      //    }
      //    else {
      //      this.toastr.error(this.ErrorMessage)
      //    }
      //  })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();

      }, 200);
    }
  }


}
