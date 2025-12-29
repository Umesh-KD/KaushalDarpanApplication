import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ITIPaperUploadSearchModel } from '../../../Models/DocumentDetailsModel';
import { InvigilatorSSOIDList } from '../../../Models/InvigilatorAppointmentDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';

import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-iit-paper-upload-report',
  standalone: false,
  templateUrl: './iit-paper-upload-report.component.html',
  styleUrl: './iit-paper-upload-report.component.css'
})
export class IitPaperUploadReportComponent {


  public State: number = -1;
  public Message: any = [];
  showDownloadOptions = false;
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Status: number = 0
  public ITIPaperUploadReportsList: any = [];
  public InstituteMasterDDLList: any = [];
  public CenterDDLlist: any = [];
  public TimeTableList: any = [];


  public UserID: number = 0;
  searchText: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = '';
  public SearchTimeTableList: any = []
  serchrequest = new InvigilatorSSOIDList();
  searchRequest = new ITIPaperUploadSearchModel();
  
  
  sSOLoginDataModel = new SSOLoginDataModel();
  public tablerequest: any =[];
  constructor(
    private streamService: StreamMasterService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private centerAllocationService: ITICenterAllocationService,

    private apiService: ItiTradeService,
  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetITIPaperUpload_Reports();
    await this.Centerlist();
    await this.loadDropdownData("TimeTableList");
  }

  async GetITIPaperUpload_Reports() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.apiService.GetITIPaperUpload_Reports(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITIPaperUploadReportsList = data['Data'];          
          console.log("Paper Upload Reports List ===>", this.ITIPaperUploadReportsList)
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


  exportToExcelCenterDetail() {
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy',
      'ModifyDate', 'IPAddress', 'CenterID', 'DownloadDate', 'Password','FileName'
    ];

    const filteredData = this.ITIPaperUploadReportsList.map(
      (item: { [key: string]: any }, index: number) => {
        const filteredItem: any = {
          SNo: index + 1
        };

        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            if (key === 'IsDownload') {
              filteredItem[key] = item[key] ? 'Yes' : 'No';
            } else {
              filteredItem[key] = item[key];
            }
          }
        });

        return filteredItem;
      }
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const colWidths = Object.keys(filteredData[0]).map(key => {
      let maxLength = key.length;

      filteredData.forEach((row: { [x: string]: any; }) => {
        const cellValue = row[key];
        if (cellValue !== null && cellValue !== undefined) {
          maxLength = Math.max(maxLength, cellValue.toString().length);
        }
      });

      return { wch: maxLength + 2 };
    });

    ws['!cols'] = colWidths;

    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (ws[cellAddress]) {
        ws[cellAddress].s = { font: { bold: true } };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB').split('/').join('-');
    XLSX.writeFile(wb, `Center_Paper_download_Report_${dateStr}.xlsx`);
  }




  async Centerlist() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('IticenterList', this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CenterDDLlist = data.Data;
        console.log("CenterDDLlist", this.CenterDDLlist);
      })
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

  ResetControl() {
    this.searchRequest = new ITIPaperUploadSearchModel();
    this.GetITIPaperUpload_Reports();
  }


  async loadDropdownData(MasterCode: string): Promise<void>
  {
    await this.commonMasterService.GetCommonMasterData(MasterCode, 0, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      switch (MasterCode) {
        case 'TimeTableList':
          this.TimeTableList = data['Data'];
          break;
        default:
          break;
      }
    });

  }
}
