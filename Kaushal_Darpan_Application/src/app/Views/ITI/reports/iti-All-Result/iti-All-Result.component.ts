import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ITITimeTableService } from '../../../../Services/ITI/ITITimeTable/ititime-table.service';
import { StreamMasterService } from '../../../../Services/BranchesMaster/branches-master.service';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ITITimeTableDataModels, TimeTableInvigilatorModel, ITITimeTableSearchModel } from '../../../../Models/ITI/ITITimeTableModels';
import { InvigilatorSSOIDList } from '../../../../Models/InvigilatorAppointmentDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { DDL_InvigilatorSSOID_DataModel } from '../../../../Models/CommonMasterDataModel';
import { ReportBasedModel } from '../../../../Models/ReportBasedDataModel';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { HttpClient } from '@angular/common/http';
import { CenterAllocationService } from '../../../../Services/Center_Allocation/center-allocation.service';
import { ITICenterAllocationService } from '../../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-iti-All-Result',
  standalone: false,
  
  templateUrl: './iti-All-Result.component.html',
  styleUrl: './iti-All-Result.component.css'
})
export class itiAllResultComponent {

  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = "";
  public allExcelDataList: any = []

  public searchRequest = new ITITimeTableSearchModel();

  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(
  
    private loaderService: LoaderService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient
    
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetITIAllDataExcelReport()
  }

  


  async GetITIAllDataExcelReport() {
    try
    {
      
      this.loaderService.requestStarted();
      await this.reportService.GetITIAllDataExcelReport(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.allExcelDataList = data.Data;
        console.log("CourseMasterDDL", this.allExcelDataList);
      })

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



   exportToExcel(): void {
    const wantedColumns =
      ['SrNo', 'Name'];

    const exportData = this.allExcelDataList.map((row: any, index: number) => {
      const filteredRow: any = {};
      wantedColumns.forEach(col => {
        filteredRow[col] = col === 'SrNo' ? index + 1 : row[col];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const colWidths = wantedColumns.map(col => {
      const maxLength = Math.max(
        col.length,
        ...exportData.map((row: { [x: string]: { toString: () => { (): any; new(): any; length: any; }; }; }) =>
          row[col] ? row[col].toString().length : 0
        )
      );
      return { wch: maxLength + 2 };
    });
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const todayDate = new Date().toISOString().split('T')[0];

    const fileName = `All_Result_data_Report_${todayDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  


  



 
}
