import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { SubjectWiseDataModels, TeacherWiseDataModels } from '../../Models/TeacherWiseReportDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ReportService } from '../../Services/Report/report.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-subject-wise-report',
  standalone: false,
  templateUrl: './subject-wise-report.component.html',
  styleUrl: './subject-wise-report.component.css'
})

export class SubjectWiseReportComponent implements OnInit {
  public SubjectList: SubjectWiseDataModels[] = [];
  public Table_SearchText: string = "";
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService, private reportservice: ReportService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.SubjectList.map((item: any) => {
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
    XLSX.writeFile(wb, 'SubjectWiseReport.xlsx');
  }

  async GetAllData() {
    try {
      
      this.loaderService.requestStarted();
      await this.reportservice.GetSubjectWiseReportsData().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectList = data.Data;
        console.log(this.SubjectList, "teacher")
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
}
