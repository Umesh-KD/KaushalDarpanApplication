import { Component, OnInit } from '@angular/core';
import { ItiRptAdmissionSeatOfferedService } from '../../Services/iti-rpt-admission-seat-offered/iti-rpt-admission-seat-offered.service';

@Component({
  selector: 'app-iti-rpt-admission-seat-offered',
  standalone:false,
  templateUrl: './iti-rpt-admission-seat-offered.component.html',
  styleUrl: './iti-rpt-admission-seat-offered.component.css'
})
export class ITIRPTAdmissionSeatOfferedComponent implements OnInit{

    data: any[] = [];

  constructor(private itiRptAdmissionSeatOfferedService: ItiRptAdmissionSeatOfferedService) {}

  async ngOnInit() {
    await this.loadData();
  }

  // ✅ Load Table Data
  async loadData() {
    try {
      let res: any = await this.itiRptAdmissionSeatOfferedService.getITISeatOfferedList();
      debugger
      this.data = res;
    } catch (error) {
      console.error(error);
    }
  }

  // ✅ Download PDF
  async downloadPDF() {
    try {
      const blob: any = await this.itiRptAdmissionSeatOfferedService.downloadPDF();


// 👉 Generate timestamp (YYYY-MM-DD_HH-mm-ss)
    const now = new Date();
    const timestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') + '-' +
      String(now.getMinutes()).padStart(2, '0') + '-' +
      String(now.getSeconds()).padStart(2, '0');

    const fileName = `ITI_Report_Seatoffered_${timestamp}.pdf`;

      
             
              const blobUrl = URL.createObjectURL(blob);
  
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
      saveAs(blob, 'ITI_Report_Seatoffered.pdf');
    } catch (error) {
      console.error(error);
    }
  }




  
    
  

  // ✅ Download Excel
  async downloadExcel() {
    try {
      const blob: any = await this.itiRptAdmissionSeatOfferedService.downloadExcel();
      saveAs(blob, 'ITI_Report.xlsx');
    } catch (error) {
      console.error(error);
    }
  }
}
function saveAs(blob: any, arg1: string) {
  throw new Error('Function not implemented.');
}

