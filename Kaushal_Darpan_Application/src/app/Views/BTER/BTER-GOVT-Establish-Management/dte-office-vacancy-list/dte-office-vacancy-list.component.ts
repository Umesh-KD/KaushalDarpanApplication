import { Component } from '@angular/core';
import { OfficeVacancyModel, OfficeVacancySearchModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dte-office-vacancy-list',
  standalone: false,
  templateUrl: './dte-office-vacancy-list.component.html',
  styleUrl: './dte-office-vacancy-list.component.css'
})
export class DTEOfficeVacancyListComponent {
  public SearchData = new OfficeVacancySearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public formData = new OfficeVacancyModel();
  public deleteRequest = new OfficeVacancyModel();

  public OfficeList: any[] = [];
  public OfficeVacancyList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public StaffTypeList: any[] = [];
  public PostList: any[] = [];
  OfficeVacancy: OfficeVacancyModel[] = [];
  public StreamMasterDDLList: any[] = [];
  public BugetHeadList: any = [];
  public totalSanctionedPost: number = 0;
  public totalVacantPost: number = 0;
  public totalWorkingPost: number = 0;

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
    private BTER_EstablishManagementService: BTEREstablishManagementService, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadBasicData();
    await this.OfficeVacancyDataList();
  }

  async LoadBasicData(){

    await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
    .then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.OfficeList = data['Data'];
    }, error => console.error(error));

    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDLList = data.Data;
    })


    await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
      debugger;
      data = JSON.parse(JSON.stringify(data));
      this.StaffTypeList = data.Data;
    });


    await this.commonMasterService.GetDesignationAndPostMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.PostList = data['Data'];
    });

    await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StreamMasterDDLList = data.Data;
    })

    await this.commonMasterService.BTER_BGT_BudgetType(this.sSOLoginDataModel.DepartmentID, 1,0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BugetHeadList = data['Data'];
        }, error => console.error(error));
  }

  async OfficeVacancyDataList() {
    try {
      this.loaderService.requestStarted();
      this.SearchData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchData.EndTermID = this.sSOLoginDataModel.EndTermID;
      console.log(this.SearchData.StaffTypeID);
      console.log(this.SearchData.OfficeID);
      await this.BTER_EstablishManagementService.OfficeVacancyList(this.SearchData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeVacancyList = data['Data'];

          this.totalSanctionedPost = this.OfficeVacancyList.reduce((acc, cur) => acc + cur.TotalSeatID, 0);
          this.totalVacantPost = this.OfficeVacancyList.reduce((acc, cur) => acc + cur.RemainingSeatID, 0);
          this.totalWorkingPost = this.OfficeVacancyList.reduce((acc, cur) => acc + cur.PostedSeat, 0);

          this.loadInTable();
         
        }, error => console.error(error));

      console.log(this.OfficeVacancyList, "leaves data")
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

  async ClearSearchData(){
    this.SearchData = new OfficeVacancySearchModel();
    await this.OfficeVacancyDataList();
  }

  async OfficeVacancyActiveDeActive(ID: number, IsActive: boolean) {
    if (ID != 0) {
      this.formData.ID = ID;
      this.formData.ActiveStatus = IsActive;
      this.formData.ModifyBy = this.sSOLoginDataModel.UserID;
      await this.BTER_EstablishManagementService.OfficeVacancyActiveDeActive(this.formData).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.OfficeVacancyDataList();
          this.formData = new OfficeVacancyModel();
          // Clear array after successful save
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });
    }
  }

  async removeVacancy(ID: number) {
    try {
      this.deleteRequest.ID = ID;
      this.deleteRequest.ModifyBy = this.sSOLoginDataModel.UserID;
      await this.BTER_EstablishManagementService.DeleteOfficeVacancy(this.deleteRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.OfficeVacancyDataList();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }    
  }

  // exportToExcel(): void {
  //   if (!this.OfficeVacancyList || this.OfficeVacancyList.length === 0) {
  //     this.toastr.warning("No data available to export.");
  //     return;
  //   }
  //   const unwantedColumns = ['ID'];

  //   const columnOrder = [
  //     'OfficeName', 'InstituteName', 'StaffTypeName' ,'DesignationName' ,'BranchName' ,'BudgetTypeName'
  //     ,'TotalSeatID' ,'PostedSeat' ,'RemainingSeatID' ,'OrderNumber' ,'OrderDate' ,'Comments' ,'ActiveStatus'
  //   ];

  //   const filteredData = this.OfficeVacancyList.map((item: any) => {
  //     const row: any = {};
  //     columnOrder.forEach(col => {
  //       if (!unwantedColumns.includes(col)) {
  //         row[col] = item[col] ?? ''; // fallback if value missing
  //       }
  //     });

  //     return row;
  //   });

  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');

  //   const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
  //   XLSX.writeFile(wb, `office_vacancy_list_${timestamp}.xlsx`);
  // }

  exportToExcel() {
    if (!this.OfficeVacancyList || this.OfficeVacancyList.length === 0) {
      this.toastr.warning("No data available to export."); // or console.warn if toastr isn't available
      return;
    }
    const excelData = this.OfficeVacancyList.map((item: any, index: number) => ({
      'S.No': index + 1,
      'Office': item.OfficeName,
      'Institute': item.InstituteName,
      'Staff Type': item.StaffTypeName,
      'Designation': item.DesignationName,
      'Branch': item.BranchName,
      'Budget Head': item.BudgetTypeName,
      'Sanctioned Post': Number(item.TotalSeatID || 0),
      'Working Post': Number(item.PostedSeat || 0), 
      'Vacant Post': Number(item.RemainingSeatID || 0),
      'Order Number': item.OrderNumber,
      'Order Date': item.OrderDate,
      'Comments': item.Comments,
      'Active': item.ActiveStatus,
    }));

    const totalSanctioned = excelData.reduce((sum, item) => sum + item['Sanctioned Post'], 0);
    const totalWorking = excelData.reduce((sum, item) => sum + item['Working Post'], 0);
    const totalVacant = excelData.reduce((sum, item) => sum + item['Vacant Post'], 0);

    excelData.push({
      'S.No': 0,
      'Office': 'Total',
      'Institute': '',
      'Staff Type': '',
      'Designation': '',
      'Branch': '',
      'Budget Head': '',
      'Sanctioned Post': totalSanctioned,
      'Working Post': totalWorking,
      'Vacant Post': totalVacant,
      'Order Number': '',
      'Order Date': '',
      'Comments': '',
      'Active': '',
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Office Vacancy');
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(workbook, `office_vacancy_list_${timestamp}.xlsx`);
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
    this.paginatedInTableData = [...this.OfficeVacancyList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.OfficeVacancyList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.OfficeVacancyList.length;
  }
  // (replace org. list here)
  
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  
  // end table feature
}
