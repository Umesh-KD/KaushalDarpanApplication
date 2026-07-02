import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportService } from '../../../Services/Report/report.service';
import { MarksheetCorrectionHistoryModel } from '../../../Models/CollegesWiseReportsModel';

@Component({
  selector: 'marksheet-correction-history-report',
  standalone: false,
  templateUrl: './marksheet-correction-history-report.component.html',
  styleUrls: ['./marksheet-correction-history-report.component.css']
})
export class MarksheetCorrectionHistoryReportComponent implements OnInit {

  marksheetCorrectionHistoryList:any[] = [];

  isLoading: boolean = false;

  searchRequest = {
    enrollmentNo: '',
    marksheetType: 0
  };

  constructor(
    private reportService: ReportService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getMarksheetCorrectionHistory();
  }

 
  async getMarksheetCorrectionHistory(): Promise<void> {
    this.isLoading = true;
    debugger
    try {
      await this.reportService.GetMarksheetCorrectionHistoryReport(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
            this.marksheetCorrectionHistoryList = data['Data'];
        }, (error: any) => console.error(error));
    } catch (error) {
      this.marksheetCorrectionHistoryList = [];
      console.error('Error:', error);
      this.toastr.error('Something went wrong.');
    } finally {
      this.isLoading = false;
    }
  }
  exportToExcel(): void {

    if (!this.marksheetCorrectionHistoryList?.length) {
      this.toastr.warning('No data available to export.');
      return;
    }

    const exportData = this.marksheetCorrectionHistoryList.map((item: any, index: number) => ({
      'Sr. No.': index + 1,
      'Enrollment No': item.EnrollMentNo,
      'Student Name': item.StudentName,
      'Father Name': item.FatherName,
      'Mother Name': item.MotherName,
      'DOB': item.DOB ? new Date(item.DOB).toLocaleDateString('en-GB') : '',
      'End Term': item.SelectedEndTermID,
      'Marksheet Type': item.MarksheetType == 1 ? 'Revised' : item.MarksheetType == 2 ? 'Duplicate' : '',
      'Created By': item.CreatedSsoID,
      'Created Date': item.CreatedDate
        ? new Date(item.CreatedDate).toLocaleString('en-GB')
        : ''
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Marksheet Correction History');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Marksheet_Correction_History_${timestamp}.xlsx`);
  }
  exportToPdf(): void {

    if (!this.marksheetCorrectionHistoryList?.length) {
      this.toastr.warning('No data available to export.');
      return;
    }

    const doc = new jsPDF('landscape');

    doc.setFontSize(14);
    doc.text('Marksheet Correction History', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        'Sr. No.',
        'Enrollment No',
        'Student Name',
        'Father Name',
        'Mother Name',
        'DOB',
        'End Term',
        'Marksheet Type',
        'Created By',
        'Created Date'
      ]],

      body: this.marksheetCorrectionHistoryList.map((item: any, index: number) => [
        index + 1,
        item.EnrollMentNo,
        item.StudentName,
        item.FatherName,
        item.MotherName,
        item.DOB ? new Date(item.DOB).toLocaleDateString('en-GB') : '',
        item.SelectedEndTermID,
        item.MarksheetType == 1 ? 'Revised' : item.MarksheetType == 2 ? 'Duplicate' : '',
        item.CreatedSsoID,
        item.CreatedDate
          ? new Date(item.CreatedDate).toLocaleString('en-GB')
          : ''
      ]),

      theme: 'grid',
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: 255
      }
    });

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    doc.save(`Marksheet_Correction_History_${timestamp}.pdf`);
  }
}
