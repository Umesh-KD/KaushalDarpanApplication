import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewPlacedStudentService } from '../../../Services/ViewPlacedStudent/View-placed-student.service';
import { ViewPlacedStudentSearchModel } from '../../../Models/ViewPlacedStudentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumDepartment } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-view-placed-student',
    templateUrl: './view-placed-student.component.html',
    styleUrls: ['./view-placed-student.component.css'],
    standalone: false
})
export class ViewPlacedStudentComponent implements OnInit {
  public Id: number = 0
  public PlacedStudentList: any[] = [];
  public PlacementCompanyList: any[] = [];
  public key: number = 0
  public searchRequest = new ViewPlacedStudentSearchModel()
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService, private ViewPlacedStudentService: ViewPlacedStudentService, private toastr: ToastrService, private loaderService: LoaderService, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Id = Number(this.activatedRoute.snapshot.queryParamMap.get('post')?.toString());
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());

    //edit
    if (this.Id > 0 && this.key > 0) {
      await this.GetAllData();
    }

  }

  // get detail by id
  async GetAllData() {
    this.searchRequest.Pk_Id = this.Id
    this.searchRequest.key = this.key
    this.searchRequest.DepartmentID = EnumDepartment.BTER
/*    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng*/

    try {
      this.loaderService.requestStarted();

      await this.ViewPlacedStudentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.PlacedStudentList = data['Data'];
          console.log(this.PlacedStudentList)
          /* console.log(this.viewPlacementDashboardList);*/
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
  printDiv(id: string) {
    var divToPrint = document.getElementById(id);
    var newWin = window.open('', 'Print-Window');
    newWin?.document.open();
    newWin?.document.write('<html><body onload="window.print()">' + divToPrint?.innerHTML + '</body></html>');
    newWin?.document.close();
    setTimeout(function () {
      newWin?.close();
    }, 10);
  }



  exportToExcel(): void {
    const wantedColumns =
        ['SrNo', 'StudentName', 'EnrollmentNo', 'InstituteName', 'InstitutionManagementType', 'FatherName', 'Age',   'Dis_Gender'];

    const exportData = this.PlacedStudentList.map((row: any, index: number) => {
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
        ...exportData.map(row =>
          row[col] ? row[col].toString().length : 0
        )
      );
      return { wch: maxLength + 2 };
    });
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const todayDate = new Date().toISOString().split('T')[0];

    const fileName = `Campus_Details_Report_${todayDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }






}



