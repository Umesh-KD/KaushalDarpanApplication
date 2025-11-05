import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CounsellingMasterService } from '../../../Services/CounsellingMaster/counselling-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-counselling-vacancies',
  standalone: false,
  templateUrl: './import-counselling-vacancies.component.html',
  styleUrl: './import-counselling-vacancies.component.css'
})
export class ImportCounsellingVacanciesComponent {

  public StudentOptionListToExport: any = [];

  public importFile: any;
  public ImportExcelList: any = [];
  public selectedFile: File | null = null;

  modalRef1: NgbModalRef | null=null;
  closeResult: string | undefined;
  @ViewChild('MyModel_ViewDetails') MyModel_ViewDetails: any;

  constructor(
    private commonMasterService: CommonFunctionService,
    private CounsellingMasterService: CounsellingMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private Router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }

  DownloadExcelSample() {
    this.CounsellingMasterService.GetSampleExcelFile_CounsellingVacant().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      console.log("ExportExcelData data", data);

      if (data.State === EnumStatus.Success) {
        let dataExcel = data.Data;
        console.log('dataExcel check', dataExcel);

        const unwantedColumns = [
          "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "TradeId"
        ];

        // Step 1: Convert objects into only their values
        const filteredData = dataExcel.map((item: any) => {
          const values = Object.keys(item)
            .filter(key => !unwantedColumns.includes(key))
            .map(key => {
              let val = item[key];

              // ✅ If value is a number with decimals, remove the decimal part
              if (typeof val === 'number') {
                val = Math.trunc(val); // removes decimal
              }

              // ✅ If value is a string containing a decimal number, strip the decimal part
              if (typeof val === 'string' && val.includes('.')) {
                val = val.split('.')[0];
                val = parseInt(val);
              }

              return val;
            });

          return values;
        });

        // Step 2: Create worksheet from array of arrays (no header row)
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(filteredData);

        // Step 3: Auto-fit column widths
        const autoFitColumns = (ws: XLSX.WorkSheet, data: any[][]) => {
          const colWidths = data.reduce((widths, row) => {
            row.forEach((val: any, colIndex: number) => {
              const value = val ? val.toString() : "";
              const currentWidth = widths[colIndex] || 0;
              widths[colIndex] = Math.max(currentWidth, value.length);
            });
            return widths;
          }, [] as number[]);

          ws['!cols'] = colWidths.map(width => ({
            wch: width + 2 // Add padding
          }));
        };

        autoFitColumns(ws, filteredData);

        // Step 4: Create workbook and save file
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, this.generateFileNameYearly('xlsx'));

      } else {
        this.toastr.error(data.ErrorMessage);
      }
    });
  }

  generateFileNameYearly(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `Import Candidate List Sample ${timestamp}.${extension}`;
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.ImportExcelFile(file);
    }
    this.selectedFile = null;
    // Reset file input so selecting the same file again triggers change
    event.target.value = null;
  }

  ImportExcelFile(file: File): void {
    let mesg = '';
    this.CounsellingMasterService.ImportExcelFile_CounsellingVacant(file)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {

          // Assign data to model
          this.ImportExcelList = data['Data'].map((item: any) => {
            const processedItem: any = {};

            Object.keys(item).forEach((key) => {
              let val = item[key];

              if (typeof val === 'string' && !isNaN(Number(val))) {
                val = Number(val);
              }
              processedItem[key] = val;
            });

            return processedItem;
          });

          console.log(this.ImportExcelList, "data in excel");

          if (this.ImportExcelList.length > 0) {
            this.GetImportExcelDataPopup(this.MyModel_ViewDetails);
          }
        }
      });
  }

  async GetImportExcelDataPopup(content: any) {

    this.modalRef1 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        this.modalRef1 = null; // important
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.modalRef1 = null; // important
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  CloseModalPopupimport() {
    if (this.modalRef1) {
      this.modalRef1.close();  // use close() or dismiss(), not dismissAll()
      this.modalRef1 = null;
    }
    this.ImportExcelList = []; 
    this.selectedFile = null;
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'Instituteid', 'CandidateID'
      
    ];
    const filteredData = this.StudentOptionListToExport.map((item: any) => {
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
    XLSX.writeFile(wb, 'StudentListData.xlsx');
  }

  async SaveDataInDB() {}
}
