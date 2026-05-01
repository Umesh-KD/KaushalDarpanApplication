import { Component } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { FormGroup } from '@angular/forms';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { AddMinRequiredItemDataModel, ItemsDataModels, ItemsSearchModel, MinRequiredItemSearchModel } from '../../../../Models/ItemsDataModels';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DTEItemsSearchModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ToastrService } from 'ngx-toastr';
import { ITIInventoryService } from '../../../../Services/ITI/ITIInventory/iti-inventory.service';

@Component({
  selector: 'app-required-trade-items-report',
  standalone: false,
  templateUrl: './required-trade-items-report.component.html',
  styleUrl: './required-trade-items-report.component.css'
})
export class RequiredTradeItemsReportComponent {
  public searchTradeRequest = new ITITradeSearchModel();
  public Searchrequest = new DTEItemsSearchModel()
  public searchReq = new MinRequiredItemSearchModel();
  public deleteReq = new AddMinRequiredItemDataModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public ID: number = 0;

  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public ItemId: number = 0;
  public Table_SearchText: string = "";
  public ItemMasterList: any = [];
  public EquipmentsDDLList: any = [];
  public TradeDDLList: any = [];
  public CollegeDDLList: any = [];
  public ItemtypeList:any[]=[];
  public ItemList:any[]=[];
  EnumRole = EnumRole;
  public request = new ItemsDataModels();
  public RequiredItemSum:number=0;

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private itiInventoryService: ITIInventoryService) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;    
    console.log('Role:'+this.sSOLoginDataModel.RoleID)
    this.searchReq.CollegeId = this.sSOLoginDataModel.InstituteID;
    // await this.GetEquipmentDDL();
    await this.GetTradeDDL();
    await this.GetCollegeDDL();
    await this.GetEquipmentDDL();
    await this.GetMinRequiredItem_ITI_INV_Report();
  }

  async GetTradeDDL() {    
    try {
      this.loaderService.requestStarted();
      let Searchrequest: any = {}
      Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      Searchrequest.TypeName = 'TradeList';

      const data: any = await this.itiInventoryService.GetAll_INV_GetCommonIssueDDL(Searchrequest);

      if (data && data.State === EnumStatus.Success) {
        this.TradeDDLList = data.Data
      } 
    } catch (Ex) {
      console.log('Error in GetTradeDDL:', Ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  //   async GetEquipmentItemDDL() {    
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.itiInventoryService.GetEquipment_Branch_Wise_CategoryWise()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
          
  //         const selectOption = { EquipmentsId: 0, Name: '--Select--' };
  //         this.EquipmentsDDLList = [selectOption, ...data['Data']];
  //         console.log(this.EquipmentsDDLList);
  //       }, error => console.error(error));
  // }

  async GetEquipmentDDL() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      // this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      // this.Searchrequest.RoleID = this.sSOLoginDataModel.RoleID;

      await this.itiInventoryService.GetAllEquipmentsMaster(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EquipmentsDDLList = data['Data'];
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

  async GetCollegeDDL() {
    //
    this.ID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.InstituteMaster(this.ID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeDDLList = data['Data'];
          this.CollegeDDLList = this.CollegeDDLList.filter((x: any) => x.ManagementTypeId == 1);
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

  async GetMinRequiredItem_ITI_INV_Report() {
    try {
      this.searchReq.Action = 'GetAllData';
      // this.searchReq.CollegeId = this.sSOLoginDataModel.InstituteID;
      await this.itiInventoryService.GetMinRequiredItem_ITI_INV_Report(this.searchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.ItemMasterList = data.Data;
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  navigateToEdit(id: number) {
    this.routers.navigate(['/iti-edit-item-master'], { queryParams: { id } });
  }

  async ResetControl() {
    this.searchReq = new MinRequiredItemSearchModel();
    await this.GetMinRequiredItem_ITI_INV_Report();
  }

  async btnDelete_OnClick(Id: number) {
    this.Swal2.Confirmation("Are you sure You want to delete ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
            this.deleteReq.RequiredItemId = Id;
            this.deleteReq.ModifyBy = this.sSOLoginDataModel.UserID;

            await this.itiInventoryService.DeleteMinRequiredItem_ITI_INV(this.deleteReq)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  //reload
                  this.GetMinRequiredItem_ITI_INV_Report();
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
      });
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  exportToExcel(): void {
    const unwantedColumns = ['RequiredItemId', 'EquipmentsId', 'IsConsumable'];

    const columnOrder = ['TradeName', 'DGTSNo', 'DGT_SyllabusYear', 'ItemCategoryName', 'ItemType', 'ItemName',
      'RequiredQuantity', 'AvailableQty', 'Dificiency'
    ];

    const filteredData = this.ItemMasterList.map((item: any) => {
      const row: any = {};

      columnOrder.forEach(col => {
        if (!unwantedColumns.includes(col)) {
          row[col] = item[col] ?? ''; // fallback if value missing
        }
      });

      return row;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData, {
      header: columnOrder
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `MinRequiredItemsList_${timestamp}.xlsx`);
  }
  get totalRequiredQty(): number {
  return (this.ItemMasterList || []).reduce(
    (sum:any, item:any) => sum + (Number(item.RequiredQuantity) || 0),
    0
  );
}

get totalAvailableQty(): number {
  return (this.ItemMasterList || []).reduce(
    (sum:any, item:any) => sum + (Number(item.AvailableQty) || 0),
    0
  );
}

get totalDeficiency(): number {
  return this.totalRequiredQty - this.totalAvailableQty;
}


// exportToExcel1(): void {
//   const table = document.getElementById('reportTable');

//   if (!table) {
//     console.error('Table not found!');
//     return;
//   }

//   // Convert full table (thead + tbody + tfoot) to worksheet
//   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Report');

//   XLSX.writeFile(wb, 'Item_Report.xlsx');
// }
exportToExcel1(): void {

  const unwantedColumns = ['RequiredItemId', 'EquipmentsId', 'IsConsumable'];

  let columnOrder = [
    'TradeName',
    'ItemCategoryName',
    'ItemName',
    'RequiredQuantity',
    'AvailableQty',
    'Dificiency'
  ];

  // 👉 Add Institute column ONLY if filtered
  if (this.searchReq.CollegeId && this.searchReq.CollegeId != 0) {
    columnOrder = ['InstituteName', ...columnOrder];
  }

  const selectedInstitute = this.CollegeDDLList.find(
    (x: any) => x.InstituteID == this.searchReq.CollegeId
  );

  const instituteName = selectedInstitute?.InstituteName || '';

  const filteredData = this.ItemMasterList.map((item: any) => {
    const row: any = {};

    columnOrder.forEach(col => {
      if (col === 'InstituteName') {
        row[col] = instituteName; // same for all rows
      } else {
        row[col] = item[col] ?? '';
      }
    });

    return row;
  });

  // ✅ Add total row
  const totalRequired = this.ItemMasterList.reduce((s:any, x:any) => s + (+x.RequiredQuantity || 0), 0);
  const totalAvailable = this.ItemMasterList.reduce((s:any, x:any) => s + (+x.AvailableQty || 0), 0);

  const totalRow: any = {};
  columnOrder.forEach(col => {
    if (col === 'TradeName') totalRow[col] = 'TOTAL';
    else if (col === 'RequiredQuantity') totalRow[col] = totalRequired;
    else if (col === 'AvailableQty') totalRow[col] = totalAvailable;
    else if (col === 'Dificiency') totalRow[col] = totalRequired - totalAvailable;
    else if (col === 'InstituteName') totalRow[col] = '';
    else totalRow[col] = '';
  });

  filteredData.push(totalRow);

  // Export
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  XLSX.writeFile(wb, 'Item_Report.xlsx');
}
}
