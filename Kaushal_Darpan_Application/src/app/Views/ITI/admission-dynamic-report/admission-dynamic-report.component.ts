import { Component } from '@angular/core';
import { ItiRptAdmissionSeatOfferedService } from '../../../Services/iti-rpt-admission-seat-offered/iti-rpt-admission-seat-offered.service';
import { ReportService } from '../../../Services/Report/report.service';
import * as XLSX from 'xlsx';
import { TableConfig } from '../../../Common/data-table/DatatableModels/table-config.model';
import { TableColumn } from '../../../Common/data-table/DatatableModels/table-column.model';
interface ReportFilters {
  AcedemicYearID: number;
  ShowTradeDuration: boolean;
  ShowTradeLevel: boolean;
  ShowTradeScheme: boolean;
  ShowManagementType: boolean;
  FilterByAllotmentType: boolean;
}

@Component({
  selector: 'app-admission-dynamic-report',
  standalone: false,
  templateUrl: './admission-dynamic-report.component.html',
  styleUrl: './admission-dynamic-report.component.css'
})
export class AdmissionDynamicReportComponent {
  data: any[] = [];
  columns: string[] = [];
  isLoading = false;
  excludedColumns: string[] = [];
  filters: ReportFilters = {
    AcedemicYearID: 30,
    ShowTradeDuration: false,
    ShowTradeLevel: false,
    ShowTradeScheme: false,
    ShowManagementType: false,
    FilterByAllotmentType: false
  };




  private metaColumns = ['ShowManagementType', 'FilterByAllotmentType'];

  private customColumnDefs: Partial<TableColumn>[] = [
    {
      dataField: 'Level',
      type: 'badge'
    }
    // add more custom column configs here as needed, e.g.:
    // { dataField: 'Trade Scheme', type: 'text', align: 'center' },
  ];
  // Columns that should always appear first, in this order, if present in the response.
  // Everything else discovered on the response row is appended after these, in the order the SP returns them.
  private pinnedColumnOrder = ['Level', 'Trade Duration', 'Trade Scheme'];

  constructor(private itiRptAdmissionSeatOfferedService: ReportService) { }


  tableConfig: TableConfig = {
    unwantedColumns: [],
    columns: [],
    badgeConfig: [
      {
        value: 'All Levels',
        cssClass: 'approved',
        icon: 'ti ti-circle-check',
        text: 'All Levels'
      },
      {
        value: '8th Level',
        cssClass: 'approved',
        icon: 'ti ti-circle-check',
        text: '8th Level'
      },
      {
        value: '10th Level',
        cssClass: 'rejected',
        icon: 'ti ti-circle-check',
        text: '10th Level'
      },
      {
        value: '12th Level',
        cssClass: 'pending',
        icon: 'ti ti-clock',
        text: '12th Level'
      }
    ]
  };

  async ngOnInit() {
    await this.loadData();
  }

  // Called by each toggle/select in the template
  async onFilterChange() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res: any = await this.itiRptAdmissionSeatOfferedService.getITIDynamicReport(this.filters);

      if (res && res.State === 1 && Array.isArray(res.Data)) {
        this.data = res.Data;
        this.columns = this.buildColumnList(this.data);
      } else {
        console.error('Report load failed:', res?.ErrorMessage || res?.Message);
        this.data = [];
        this.columns = [];
      }
    } catch (error) {
      console.error(error);
      this.data = [];
      this.columns = [];
    } finally {
      this.isLoading = false;
    }
  }

  // Derives the column list straight from the response so new SP columns
  // show up automatically without a frontend change.


  async downloadPDF() {
    //try {
    //  const blob: any = await this.itiRptAdmissionSeatOfferedService.downloadPDF(this.filters);
    //  this.triggerDownload(blob, this.buildFileName('pdf'));
    //} catch (error) {
    //  console.error(error);
    //}
  }

  downloadExcel(): void {

    if (!this.columns || this.columns.length === 0 || !this.data || this.data.length === 0) {
      return;
    }

    const filteredData = this.data.map((row: any, index: number) => {

      const excelRow: any = {};

      // Serial Number
      excelRow['Sr. No'] = index + 1;

      // Add columns in the same order as displayed in table
      this.columns.forEach((col: string) => {
        excelRow[col] = row[col] ?? '';
      });

      return excelRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.-]/g, '_');

    XLSX.writeFile(
      wb,
      `AdmissionReport_${timestamp}.xlsx`
    );
  }

  private buildFileName(ext: string): string {
    const now = new Date();
    const timestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') + '-' +
      String(now.getMinutes()).padStart(2, '0') + '-' +
      String(now.getSeconds()).padStart(2, '0');
    return `ITI_Report_Seatoffered_${timestamp}.${ext}`;
  }

  private triggerDownload(blob: Blob, fileName: string) {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }


  //private buildColumnList(rows: any[]): string[] {
  //  if (!rows || rows.length === 0) return [];

  //  const allKeys = Object.keys(rows[0]);

  //  // Drop metadata/flag columns entirely
  //  const dataKeys = allKeys.filter(k => !this.metaColumns.includes(k));

  //  // Drop columns that are null/undefined across every row (SQL returns them
  //  // as placeholders when the corresponding flag mode isn't active)
  //  const populatedKeys = dataKeys.filter(key =>
  //    rows.some(row => row[key] !== null && row[key] !== undefined)
  //  );

  //  const pinned = this.pinnedColumnOrder.filter(c => populatedKeys.includes(c));
  //  const rest = populatedKeys.filter(c => !this.pinnedColumnOrder.includes(c));

  //  return [...pinned, ...rest];
  //}


  private buildColumnList(rows: any[]): string[] {
    if (!rows || rows.length === 0) {
      this.tableConfig = {
        ...this.tableConfig,
        unwantedColumns: [],
        columns: []
      };
      return [];
    }

    const allKeys = Object.keys(rows[0]);

    const metaExcluded = allKeys.filter(k => this.metaColumns.includes(k));
    const dataKeys = allKeys.filter(k => !this.metaColumns.includes(k));

    const emptyExcluded = dataKeys.filter(key =>
      !rows.some(row => row[key] !== null && row[key] !== undefined)
    );

    const populatedKeys = dataKeys.filter(key =>
      rows.some(row => row[key] !== null && row[key] !== undefined)
    );

    const pinned = this.pinnedColumnOrder.filter(c => populatedKeys.includes(c));
    const rest = populatedKeys.filter(c => !this.pinnedColumnOrder.includes(c));

    const orderedKeys = [...pinned, ...rest];

    const excludedColumns = [...new Set([...metaExcluded, ...emptyExcluded])];

    // Merge: use the custom column def if one exists for this field,
    // otherwise fall back to a plain default column
    const mergedColumns = orderedKeys.map(key => {
      const custom = this.customColumnDefs.find(c => c.dataField === key);
      return custom
        ? { ...custom, dataField: key }
        : { dataField: key };
    });

    this.tableConfig = {
      ...this.tableConfig,
      unwantedColumns: excludedColumns,
      columns: mergedColumns
    };

    return orderedKeys;
  }



}
