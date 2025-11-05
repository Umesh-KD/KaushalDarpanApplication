import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CounsellingMasterService } from '../../../Services/CounsellingMaster/counselling-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ITI_ApprenticeshipSearchModel } from '../../../Models/ITI/ITI_ApprenticeshipDataModel';
import { ITIApprenticeshipService } from '../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { CounsellingVacancySearchModel, EditVacancyDataModel } from '../../../Models/CounsellingApplicationFormDataModel';

@Component({
  selector: 'app-import-counselling-vacancies',
  standalone: false,
  templateUrl: './import-counselling-vacancies.component.html',
  styleUrl: './import-counselling-vacancies.component.css'
})
export class ImportCounsellingVacanciesComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  EditDataFormGroup!: FormGroup;

  public StudentOptionListToExport: any = [];
  public VacancyDataList: any = [];
  public InstitutelistDDL: any = [];
  public TradeListDDL: any = [];
  public searchRequest = new CounsellingVacancySearchModel();
  public request = new EditVacancyDataModel();

  public importFile: any;
  public ImportExcelList: any = [];
  public selectedFile: File | null = null;

  modalRef1: NgbModalRef | null=null;
  closeResult: string | undefined;
  @ViewChild('MyModel_ViewDetails') MyModel_ViewDetails: any;

  isSubmitted: boolean = false;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

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
    private apprenticeshipService: ITIApprenticeshipService
  ) { }

  async ngOnInit() {
    this.EditDataFormGroup = this.fb.group({
      TradeID: [{value:'', disabled: true}, [DropdownValidators]],
      InstituteID: [{value:'', disabled: true}, [DropdownValidators]],
      Designation: [{value:'', disabled: true}, Validators.required],
      VacantSeats: ['', Validators.required],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetInstituteMaster();
    await this.GetTradeList();
    await this.GetCounsellingVacancyData();
  }

  get formEditData() { return this.EditDataFormGroup.controls; }

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


  async SaveDataInDB() {
    if(this.ImportExcelList?.length == 0){
      this.toastr.error("there is no data to save");
      return;
    }
    try {
      this.ImportExcelList.forEach((x: any) => {
        x.UserID = this.sSOLoginDataModel.UserID
        x.RoleID = this.sSOLoginDataModel.RoleID
      })
      await this.CounsellingMasterService.SaveExcelData_CounsellingVacant(this.ImportExcelList).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.CloseModalPopupimport();
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetCounsellingVacancyData() {
    try {
      await this.CounsellingMasterService.GetCounsellingVacancyData(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.VacancyDataList = data.Data;

          this.loadInTable();
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async ResetControl() {
    this.searchRequest.InstituteID = 0;
  }

  async GetInstituteMaster() {
    try {
      
      const request: any = {};
      request.action = "GetITIGovtInstituteDDL";
      await this.apprenticeshipService.GetITI_InstituteList_Apprenticeship(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstitutelistDDL = data['Data'];
      })
    } catch (error) {
      console.log(error);
    }
  }

  async GetTradeList() {
    try {
      const request: any = {};
      request.action = "_getAllData";
      await this.commonMasterService.TradeListGetAllData(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeListDDL = data['Data'];
      })
    } catch (error) {
      console.log(error);
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
  }

  async OpenEditPopup(content: any, rowData?: any) {
    await this.GetVacancyDetailsById_Counselling(rowData.TradeInstituteID);
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async GetVacancyDetailsById_Counselling(TradeInstituteID: number) {
    try {
      await this.CounsellingMasterService.GetVacancyDetailsById_Counselling(TradeInstituteID).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.request = data.Data;
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async SaveData_EditDetails() {
    this.isSubmitted = true;
    if(this.EditDataFormGroup.invalid){
      this.toastr.error("Please fill all the required fields");
      return;
    }

    this.request.UserID = this.sSOLoginDataModel.UserID

    try {
      await this.CounsellingMasterService.EditVacancyData_Counselling(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.CloseModal();
          await this.GetCounsellingVacancyData();
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.VacancyDataList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.VacancyDataList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.VacancyDataList.length;
  }
  // end table feature
}
