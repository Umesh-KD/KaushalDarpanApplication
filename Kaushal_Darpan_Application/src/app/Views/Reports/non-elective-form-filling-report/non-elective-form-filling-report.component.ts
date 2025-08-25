import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NonElectiveFormFillingReportSearchModel } from '../../../Models/BTER/NonElectiveFormFillingReportDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-non-elective-form-filling-report',
  templateUrl: './non-elective-form-filling-report.component.html',
  styleUrl: './non-elective-form-filling-report.component.css',
  standalone: false
})
export class NonElectiveFormFillingReportComponent {
  public ssoLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new NonElectiveFormFillingReportSearchModel();
  public NonElectiveFormFillingReportData: NonElectiveFormFillingReportSearchModel[] = [];

    //table feature default
  public paginatedInTableData: any[] = [];
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
    private loaderService: LoaderService,
    private reportService: ReportService,
    private toastr: ToastrService,
  ) { }
  async ngOnInit() {
    this.ssoLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID;
    this.searchRequest.DepartmentID = this.ssoLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
    this.GetAllData();
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetNonElectiveFormFillingReportData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.NonElectiveFormFillingReportData = data.Data;
          console.log(this.NonElectiveFormFillingReportData);
          this.loadInTable();
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
          this.NonElectiveFormFillingReportData = data.Data;
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
     setTimeout(() => {
       this.loaderService.requestEnded();
     }, 200); 
    }
  }

  async exportToExcel() {
    const unwantedColumns = [''];
    const filteredData = this.NonElectiveFormFillingReportData.map((item: any) => {
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
    XLSX.writeFile(wb, 'NonElectiveFormFillingReportData.xlsx');
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
    this.paginatedInTableData = [...this.NonElectiveFormFillingReportData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.NonElectiveFormFillingReportData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.NonElectiveFormFillingReportData.length;
  }
  // (replace org.list here)
  // get totalInTableSelected(): number {
  //   return this.OptionalFormatReportData.filter(x => x.Selected)?.length;
  // }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  // selectInTableAllCheckbox() {
  //   this.OptionalFormatReportData.forEach(x => {
  //     x.Selected = this.AllInTableSelect;
  //   });
  // }
  //checked single (replace org. list here)
  // selectInTableSingleCheckbox(isSelected: boolean, item: any) {
  //   const data = this.OptionalFormatReportData.filter(x => x.StudentID == item.StudentID);
  //   data.forEach(x => {
  //     x.Selected = isSelected;
  //   });
  //   //select all(toggle)
  //   this.AllInTableSelect = this.OptionalFormatReportData.every(r => r.Selected);
  // }
  // end table feature

}
