import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CustomizeReportDataModels, CustomizeReportCoulmnSearchModel, CustomizeReportSearchModel } from '../../../Models/CustomizeReport';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ReportService } from '../../../Services/Report/report.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { PageEvent } from '@angular/material/paginator';
import { MiscellaneousModel } from '../../../Models/MiscellaneousModel';

@Component({
  selector: 'app-Miscellaneous-Report',
  standalone: false,
  templateUrl: './Miscellaneous-Report.component.html',
  styleUrl: './Miscellaneous-Report.component.css'
})
export class MiscellaneousReportComponent implements OnInit {
  public State: number = -1;
  public groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  request = new CustomizeReportDataModels()
  public searchRequest = new CustomizeReportSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public CustomizeReportCoulmnDataRequest = new CustomizeReportCoulmnSearchModel();
  public CustomizeReportDataModels = new CustomizeReportDataModels();
  CustomizeReportCoulmnData = new CustomizeReportCoulmnSearchModel();
  public CustomizeReportCoulmnDataPush: CustomizeReportCoulmnSearchModel[] = [];
  public filter: any = {};
  public repType: number = 0;
  public sem: number = 0;
  public IsSNo: boolean = false;

  //public requestData = new CustomizeReportCoulmnSearchModel();
  public requestData = new MiscellaneousModel();
  public GetfilteredList: any[] = [];
  public GetfilteredColumnlist: any[] = [];
  public selectedNames: string[] = [];
  public SetfileName: string = '';
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private reportService: ReportService
  ) {

    this.repType = parseInt(this.routers.snapshot.paramMap.get('repType') ?? "0");
    this.sem = parseInt(this.routers.snapshot.paramMap.get('sem') ?? "0");
  }
  dataSource: MatTableDataSource<CustomizeReportCoulmnSearchModel> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  filteredData: any[] = [];
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  displayedColumns: any[] = [];
  UniqueKeys: any[] = [];
  StreamMasterList: any[] = [];
  StudentTypeList: any[] = [];
  CourseTypeList: any[] = [];
  InstituteList: any[] = [];
  EndTermList: any[] = [];
  ReportFlaglist: any[] = [];
  ReportTypelist: any[] = [];


  async ngOnInit() {
    const controls = this.UniqueKeys.map(column => {
      return this.fb.control(column.selected);
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.groupForm = this.fb.group({
      displayColumns: [''],
      StateId: [''],
      StudentType: [''],
      SemesterID: [this.sem],
      StreamID: [''],
      District: [''],
      gender: [''],
      Block: [''],
      CourseType: [''],
      Institute: [''],
      EndTerm: [this.ssoLoginUser.EndTermID],
      CategaryCast: [''],
      UniqueCol: [''],
      ReportFlagID: [''],
      Type: [this.repType],
      SchemeID: ['0'],
    });

    await this.loadReportType();

    await this.commonMasterService.SemesterMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SemesterMasterList = data['Data'];
    }, (error: any) => console.error(error));

    await this.reportService.GetEndTerm().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.EndTermList = data['Data'];
    }, (error: any) => console.error(error));

  }

  async loadReportType() {
    this.ReportTypelist = [
      { ID: 0, DisplayOrder: 1, Name: 'Download Single Absent Report' },
      { ID: 1, DisplayOrder: 2, Name: 'Download Single Present Report' },
      { ID: 2, DisplayOrder: 3, Name: 'Download UFM Report' },
      { ID: 3, DisplayOrder: 4, Name: 'Download Consolidated Detain Student List Report' },
      { ID: 4, DisplayOrder: 5, Name: 'Download Examiners With Group Code And Marking Report' },
      { ID: 5, DisplayOrder: 6, Name: 'Download Grace Marks Student Report' },
      { ID: 6, DisplayOrder: 7, Name: 'Download Detain Marks Student Report' },
      { ID: 7, DisplayOrder: 8, Name: '(Reval) Download Examiners With Group Code And Marking Report' },
      { ID: 8, DisplayOrder: 9, Name: '90 And Above Sessional Marks Institute Wise, Semester Wise Report IA' },
      { ID: 14, DisplayOrder: 10, Name: '90 And Above Sessional Marks Institute Wise, Semester Wise Report Practical' },
      { ID: 9, DisplayOrder: 11, Name: 'Download Student Digilocker Report' },
      { ID: 10, DisplayOrder: 12, Name: 'Zero Marks IA Record' },
      { ID: 11, DisplayOrder: 13, Name: 'Zero Marks Practical Record' },
      { ID: 12, DisplayOrder: 14, Name: 'Minimum & Maximum Marks Report IA' },
      { ID: 13, DisplayOrder: 15, Name: 'Minimum & Maximum Marks Practical Report' }
    ];

    this.ReportTypelist.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
  }
  get form() { return this.groupForm.controls; }

  async SubmitData() {
    //debugger;
    this.CustomizeReportCoulmnDataPush = [];
    try {


      this.requestData.SemesterID = !isNaN(Number(this.groupForm.value.SemesterID)) ? Number(this.groupForm.value.SemesterID) : 0;
      this.requestData.InstituteID = !isNaN(Number(this.filter.Institute)) ? Number(this.filter.Institute) : 0;
      this.requestData.EndTermID = !isNaN(Number(this.groupForm.value.EndTerm)) ? Number(this.groupForm.value.EndTerm) : 0;
      this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.requestData.Type = !isNaN(Number(this.groupForm.value.Type)) ? Number(this.groupForm.value.Type) : 0;
      this.requestData.Action = '_get_UFM_data'
      this.requestData.PresentStatus = this.requestData.Type;
      this.requestData.SchemeID = !isNaN(Number(this.groupForm.value.SchemeID)) ? Number(this.groupForm.value.SchemeID) : 0;


      if ([5, 6, 9].includes(this.requestData.Type)) {
        this.requestData.CourseType = this.sSOLoginDataModel.Eng_NonEng;
      } else {
        this.requestData.CourseType = 0;
      }
      try {
        debugger
        if (this.requestData.Type == 8) {

          this.requestData.Action = 'ViewData';

          await this.reportService.GetMiscellaneousReport(this.requestData)
            .then((data: any) => {

              if (data.State == EnumStatus.Warning) {
                this.toastr.warning(data.Message);
              }
              else if (data.State == EnumStatus.Success) {
                //debugger
                this.GetfilteredList = data["Data"];// list
                this.exportToExcelstaticType90();
              }
              else {
                this.toastr.error(data.Message);
                console.log(data.ErrorMessage);
              }

            }, (error: any) => console.error(error));
        }
        else {
          debugger
          await this.reportService.GetMiscellaneousReport(this.requestData)
            .then((data: any) => {
              // message
              if (data.State == EnumStatus.Warning) {
                this.toastr.warning(data.Message);
              }
              else if (data.State == EnumStatus.Success) {
                this.GetfilteredList = data["Data"];// list
                if (this.requestData.Type == 4 || this.requestData.Type == 7) {
                  this.exportToExcelstaticType();
                }
                else if (this.requestData.Type == 5) {
                  this.exportToExcelTpye5();
                }
                else if (this.requestData.Type == 6) {
                  this.exportToExcelTpye6();
                }
                else if (this.requestData.Type == 9) {
                  this.exportToExcelType9();
                }
                else if (this.requestData.Type == 10) {
                  this.exportToExcelGetZero_Marks_IA_Or_Practical_Record();
                }
                else if (this.requestData.Type == 11) {
                  this.exportToExcelGetZero_Marks_IA_Or_Practical_Record();
                }
                else if (this.requestData.Type == 12 || this.requestData.Type == 13) {
                  this.exportToExcelMinimumMaximumMarksIA_Or_PracticalReport();
                }
                else {
                  this.exportToExcelTpye2();
                }
              }
              else {
                this.toastr.error(data.Message);
                console.log(data.ErrorMessage);
              }
            }, (error: any) => console.error(error));
        }


      } catch (ex) {
        console.log(ex);
      }
    }
    catch (ex) {
      console.log(ex);
    }
  }

  applyFilter(filterValue: string): void {
    if (filterValue === "all") {

      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.CustomizeReportCoulmnDataPush.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  ResetReport() {
    this.filter = {};
    this.displayedColumns = [];
    this.UniqueKeys = [];
    this.CustomizeReportCoulmnDataPush = [];
    this.requestData = new MiscellaneousModel();
  }

  exportToExcelstaticType(): void {
    //debugger
    const wantedColumns =
      ['SrNo', 'GroupCode', 'ExaminerName', 'SubjectCode', 'AllotedStudentTotal', 'MarksSubmittedTotal', 'PresentTotal', 'AbsentTotal',
        'MarksPendingTotal', 'StaffInatituteName', 'MobileNumber', 'ExaminerCode'];

    const exportData = this.GetfilteredList.map((row: any, index: number) => {
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

    const fileName = `Download_Examiners_With_Group_Code_And_Marking_report_${todayDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  exportToExcelTpye2(): void {
    const excludeColumns = [''];
    const fixedColumns = ['SrNo', 'RollNo', 'StudentName', 'EnrollmentNo', 'BranchName', 'CenterInstituteCode', 'StudentType', 'GroupCode'];

    const filteredData = this.GetfilteredList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!excludeColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    const allHeaders = Object.keys(filteredData[0]);
    const otherColumns = allHeaders.filter(col => !fixedColumns.includes(col));
    const headers = [...fixedColumns, ...otherColumns];

    // create empty worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Add title rows
    XLSX.utils.sheet_add_aoa(ws, [
      ['Engineering Semester Examination, Nov 2025']
    ], { origin: 0 });

    XLSX.utils.sheet_add_aoa(ws, [
      ['Branch and Subject wise Student Report Nov 2025 (The report has been generated based on the online attendance marked by the Examination Center Superintendent at the respective examination centers)']
    ], { origin: 1 });

    // Merge title rows across all columns
    const totalColumns = headers.length;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalColumns - 1 } }
    ];

    // Add headers at row 3 (index 2)
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 2 });

    // Add data rows starting from row 4
    const rows = filteredData.map(row => headers.map(h => row[h]));
    XLSX.utils.sheet_add_aoa(ws, rows, { origin: 3 });

    // create workbook and write file
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    let fileName = '';
    if (this.groupForm.value.Type == 2) fileName = 'Download_UFM_Report.xlsx';
    else if (this.groupForm.value.Type == 0) fileName = 'Download_Single_Absent_Report.xlsx';
    else if (this.groupForm.value.Type == 1) fileName = 'Download_Single_Present_Report.xlsx';
    else fileName = 'Download_Consolated_Detain_Student_List_report.xlsx';

    XLSX.writeFile(wb, fileName);
  }

  exportToExcelTpye5(): void {

    const wantedColumns =
      ['SrNo', 'StudentName', 'FatherName', 'MotherName', 'EnrollmentNo', 'RollNo', 'SemesterID', 'StudentType',
        'SubjectCode', 'MaxTheory', 'MaxPractical', 'MaxInternalAssisment', 'ObtainedTheory', 'ObtainedPractical',
        'ObtainedInternalAssisment', 'ATM', 'GraceMarks', 'Result'];

    const exportData = this.GetfilteredList.map((row: any, index: number) => {
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

    const fileName = `Download_Grace_Marks_Student_report_${todayDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  exportToExcelTpye6(): void {

    const wantedColumns =
      ['SrNo', 'StudentName', 'FatherName', 'MotherName', 'EnrollmentNo', 'RollNo', 'SemesterID', 'StudentType',
        'SubjectCode'];

    const exportData = this.GetfilteredList.map((row: any, index: number) => {
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

    const fileName = `Download_Detain_Marks_Student_reportreport_${todayDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  exportToExcelstaticType90(): void {
    debugger
    if (!this.GetfilteredList || this.GetfilteredList.length === 0) {
      return;
    }

    // Get column names
    const keys = Object.keys(this.GetfilteredList[0]);

    // Non-numeric columns first
    const nonNumeric = keys.filter(k => isNaN(Number(k)));

    // Numeric columns next
    const numeric = keys.filter(k => !isNaN(Number(k)));

    const wantedColumns = [...nonNumeric, ...numeric];

    // Create header + data without using forEach
    const excelData = [
      wantedColumns,
      ...this.GetfilteredList.map((row: any) =>
        Object.entries(row)
          .filter(([key]) => wantedColumns.includes(key))
          .sort((a, b) => wantedColumns.indexOf(a[0]) - wantedColumns.indexOf(b[0]))
          .map(([, value]) => value ?? '')
      )
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);

    ws['!cols'] = wantedColumns.map(col => ({
      wch: Math.max(
        col.length,
        ...this.GetfilteredList.map((r: any) =>
          String(r[col] ?? '').length
        )
      ) + 2
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(
      wb,
      `90AndAboveSessionalMarksInstituteWiseSemesterWiseReport_${new Date().toISOString().split('T')[0]}.xlsx`
    );
  }

  exportToExcelType9(): void {

    if (!this.GetfilteredList || this.GetfilteredList.length === 0) {
      return;
    }

    // Get column names dynamically
    const wantedColumns = Object.keys(this.GetfilteredList[0]);

    const excelData: any[][] = [];

    // Header
    excelData.push(wantedColumns);

    // Data
    this.GetfilteredList.forEach((row: any) => {
      excelData.push(
        wantedColumns.map(col => row[col] ?? '')
      );
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const todayDate = new Date().toISOString().split('T')[0];

    XLSX.writeFile(
      wb,
      `StudentDigilockerReport_${todayDate}.xlsx`
    );
  }
  exportToExcelGetZero_Marks_IA_Or_Practical_Record(): void {
    debugger
    if (!this.GetfilteredList || this.GetfilteredList.length === 0) {
      return;
    }

    const wantedColumns = [
      'SrNo',
      'StudentName',
      'RollNo',
      'SPN',
      'InstituteName',
      'SubjectName',
      'ObtainedMarks'
    ];

    const exportData = this.GetfilteredList.map((row: any, index: number) =>
      wantedColumns.reduce((obj: any, col: string) => {
        obj[col] = col === 'SrNo' ? index + 1 : (row[col] ?? '');
        return obj;
      }, {})
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    ws['!cols'] = wantedColumns.map(col => ({
      wch: Math.max(
        col.length,
        ...exportData.map((row: any) => String(row[col] ?? '').length)
      ) + 2
    }));

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const todayDate = new Date().toISOString().split('T')[0];

    if (this.requestData.Type === 10) {
      this.SetfileName = 'Download_GetZero_Marks_IA_Record_Report';
    } else if (this.requestData.Type === 11) {
      this.SetfileName = 'Download_GetZero_Marks_Practical_Record_Report';
    } else {
      this.SetfileName = 'Download_Report';
    }
    XLSX.writeFile(wb, `${this.SetfileName}.xlsx`);
  }

  exportToExcelMinimumMaximumMarksIA_Or_PracticalReport(): void {
    debugger
    if (!this.GetfilteredList || this.GetfilteredList.length === 0) {
      return;
    }

    const wantedColumns = [
      'S.No',
      'InstituteName',
      'Branch',
      'SubjectCode',
      'Below45',
      'Above85',
      'Remark'
    ];

    const exportData = this.GetfilteredList.map((row: any, index: number) => ({
      'S.No': index + 1,
      'InstituteName': row['InstituteName'] ?? '',
      'Branch': row['Branch'] ?? '',
      'SubjectCode': row['SubjectCode'] ?? '',
      'Below45': row['Below45'] ?? '',
      'Above85': row['Above85'] ?? '',
      'Remark': row['Remark'] ?? ''
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    ws['!cols'] = wantedColumns.map(col => ({
      wch: Math.max(
        col.length,
        ...exportData.map((r: any) => String(r[col] ?? '').length)
      ) + 2
    }));

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    if (this.requestData.Type === 12) {
      this.SetfileName = 'Minimum_Maximum_Marks_IA_Report';
    }
    else if (this.requestData.Type === 13) {
      this.SetfileName = 'Minimum_Maximum_Marks_Practical_Report';
    }

    XLSX.writeFile(wb, `${this.SetfileName}.xlsx`);
  }

}
