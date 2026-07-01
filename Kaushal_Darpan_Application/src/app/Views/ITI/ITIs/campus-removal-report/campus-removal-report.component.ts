import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampusRemovalReport } from '../../../../Models/ITI/ItiReportDataModel';
import { ITIsService } from '../../../../Services/ITIs/itis.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppsettingService } from '../../../../Common/appsetting.service';

@Component({
  selector: 'app-campus-removal-report',
  standalone: false,
 
  templateUrl: './campus-removal-report.component.html',
  styleUrl: './campus-removal-report.component.css'
})
export class CampusRemovalReportComponent {

  campusRemovalReport = new CampusRemovalReport();
  campusRemovalReportList: CampusRemovalReport[] = [];

  constructor(
    private itiService: ITIsService,
    private appsettingConfig: AppsettingService
  ) { }
  async ngOnInit() {
    this.GetCampusRemovalReport();
  }
  async GetCampusRemovalReport() {
    debugger
    try {

      const data: any = await this.itiService.ITICollegeCampusRemovalReport(this.campusRemovalReport);

      if (data && data.Data) {
        this.campusRemovalReportList = data.Data;
      }
      else {
        this.campusRemovalReportList = [];
      }

    } catch (error) {
      console.error(error);
      this.campusRemovalReportList = [];
    }

  }

  exportToExcel(): void {
    debugger
    const exportData = this.campusRemovalReportList.map((item: any) => ({
      "College Name": item.CollegeName,
      "Campus Year": item.CampYear,
      //"Removed Order No": item.CampusRemovedOrderNo,
      //"Removed Order Date": item.CampusRemovedOrderDate
      //  ? new Date(item.CampusRemovedOrderDate).toLocaleDateString('en-GB')
      //  : '',
      "Campus Details": item.CampusDetails,
      "Remark": item.CampusRemovedRemark
     
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Campus Removal Report');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Campus_Removal_Report_${timestamp}.xlsx`);
  }
  exportToPdf(): void {

    const doc = new jsPDF('landscape');

    doc.setFontSize(14);
    doc.text('Campus Removal Report', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        'Sr. No.',
        'College Name',
        'Campus Year',
        //'Removed Order No',
        //'Removed Order Date',
        'Campus Details',
        'Remark'
        
      ]],
      body: this.campusRemovalReportList.map((item: any, index: number) => [
        index + 1,
        item.CollegeName,
        item.CampYear,
        //item.CampusRemovedOrderNo,
        //item.CampusRemovedOrderDate
        //  ? new Date(item.CampusRemovedOrderDate).toLocaleDateString('en-GB')
        //  : '',
        item.CampusDetails,
        item.CampusRemovedRemark
       
      ]),
      theme: 'grid',
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [13, 110, 253] // Bootstrap primary blue
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    doc.save(`Campus_Removal_Report_${timestamp}.pdf`);
  }

}
