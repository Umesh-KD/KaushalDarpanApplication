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
  selector: 'app-prod-data',
  standalone: false,
  templateUrl: './prod-data.component.html',
  styleUrl: './prod-data.component.css'
})


export class ProdDataComponent implements OnInit {
  //public ITIDetailReportList: ITIDetailListReportModel[] = [];
  public TableList: any[] = [];
  public Table_SearchText: string = "";
  public selectTable: string = "";
  public searchRequest = new ITISearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService, private reportService: ReportService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetTables();
  }


  async GetTables() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTables()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TableList = data['Data'];
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

  async UpdateData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.AddTableRecords(this.selectTable)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //this.TableList = data['Data'];
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

  //async ViewandUpdate(content: any, id: number) {
  //  this.TimeTableID = id
  //  await this.GetTimeTableByID(id)
  //  if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
  //    await this.GetInvigilatorByID(id)
  //  }
  //  this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });


  //}


  async ClearSearchData() {
    this.searchRequest.Code = '';
   
  }

}
