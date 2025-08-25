import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ReportService } from '../../Services/Report/report.service';
import { ITIDetailListReportModel, ITISearchModel } from '../../Models/ITI-SearchDataModel';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-iti-search',
  standalone: false,
  templateUrl: './iti-search.component.html',
  styleUrl: './iti-search.component.css'
})


export class ITISearchComponent implements OnInit {
  //public ITIDetailReportList: ITIDetailListReportModel[] = [];
  public ITIDetailReportList: any[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new ITISearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService, private reportService: ReportService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'GroupCodeID', 'ExaminerID'
    ];
    const filteredData = this.ITIDetailReportList.map((item: any) => {
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
    XLSX.writeFile(wb, 'ITISearchReportData.xlsx');
  }

  //async ViewandUpdate(content: any, id: number) {
  //  this.TimeTableID = id
  //  await this.GetTimeTableByID(id)
  //  if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
  //    await this.GetInvigilatorByID(id)
  //  }
  //  this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });


  //}

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITISearchRepot(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ITIDetailReportList = data.Data;
        console.log(this.ITIDetailReportList, "ITIDetailReport")
      }, (error: any) => console.error(error))
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

  async ClearSearchData() {
    this.searchRequest.Code = '';
    await this.GetAllData();
  }

}
