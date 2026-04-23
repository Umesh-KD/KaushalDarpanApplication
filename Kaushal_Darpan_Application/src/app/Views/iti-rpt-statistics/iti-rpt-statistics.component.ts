import { Component } from '@angular/core';
import { ItiRptAdmissionSeatOfferedService } from '../../Services/iti-rpt-admission-seat-offered/iti-rpt-admission-seat-offered.service';

@Component({
  selector: 'app-iti-rpt-statistics',
  standalone:false,
  templateUrl: './iti-rpt-statistics.component.html',
  styleUrl: './iti-rpt-statistics.component.css'
})
export class ItiRptStatisticsComponent {

  data: any[] = [];

constructor(private itiService: ItiRptAdmissionSeatOfferedService) {}

async ngOnInit() {
  await this.loadData();
}
  async loadData() {
  try {
    let res: any = await this.itiService.getITIStatisticsList();
    this.data = res;
  } catch (error) {
    console.error(error);
  }
}

async downloadPDF() {
  try {
    const blob: any = await this.itiService.downloadITIStatisticsPDF();

    const now = new Date();
    const timestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') + '-' +
      String(now.getMinutes()).padStart(2, '0') + '-' +
      String(now.getSeconds()).padStart(2, '0');

    const fileName = `ITI_Last5Year_Statistics_${timestamp}.pdf`;

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error(error);
  }
}

// ✅ Download Excel
  async downloadExcel() {
    try {
      const blob: any = await this.itiService.downloadITIStatisticsExcel();
      // 👉 Generate timestamp (YYYY-MM-DD_HH-mm-ss)
    const now = new Date();
    const timestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') + '-' +
      String(now.getMinutes()).padStart(2, '0') + '-' +
      String(now.getSeconds()).padStart(2, '0');

    const fileName = `ITI_Last5Year_Statistics_${timestamp}.xlsx`;

      
             
              const blobUrl = URL.createObjectURL(blob);
  
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl);
      saveAs(blob, 'ITI_Report.xlsx');
    } catch (error) {
      console.error(error);
    }
  }

}
function saveAs(blob: any, arg1: string) {
  throw new Error('Function not implemented.');
}
