import { Component, ElementRef, inject, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FlyingSquadService } from '../../../Services/FlyingSquad/flying-squad.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import { AppsettingService } from '../../../Common/appsetting.service';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-team-flying-squad-attendance',
  standalone: false,
  templateUrl: './team-flying-squad-attendance.component.html',
  styleUrls: ['./team-flying-squad-attendance.component.css']
})
export class AddTeamFlyingSquadAttendanceComponent implements OnInit {
  FlyingSquadForm!: FormGroup;
  displayedColumns: string[] = ['SrNo', 'StaffName', 'TeamName', 'SSOID', 'Institute', 'DeploymentDate', 'IsPresent','ExamShift', 'Remark','Incharge','Action'];
  dataSource = new MatTableDataSource<any>([]);
  filterData: any[] = [];
  originalData: any[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();

  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  DeploymentID: number = 0;

  private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private flyingSquadService: FlyingSquadService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.DeploymentID = parseInt(this.activatedRoute.snapshot.paramMap.get('id') ?? "0");
    const userData = localStorage.getItem('SSOLoginUser');
    if (userData) {
      this.sSOLoginDataModel = JSON.parse(userData);
    }
  }

  ngOnInit(): void {
    this.getFlyingSquad();
  }

  async getFlyingSquad() {
    try {
      const obj = {
        DeploymentID: this.DeploymentID,
        EndTermId: this.sSOLoginDataModel.EndTermID ?? 0,
        DepartmentID: this.sSOLoginDataModel.DepartmentID ?? 0,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng ?? 0
      };
      await this.flyingSquadService.GetFlyingSquad_Attendance(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.originalData = data;
          this.filterData = [...this.originalData];
          this.totalRecords = this.filterData.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updateTable();
        }, error => console.error(error));
    } catch (error) {
      console.error(error);
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updateTable();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    this.dataSource.data = this.filterData.slice(startIndex, endIndex);
    this.dataSource.sort = this.sort;
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.filterData = this.originalData.filter(item =>
      Object.values(item).some(val =>
        val != null && val.toString().toLowerCase().includes(filterValue)
      )
    );
    this.totalRecords = this.filterData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1;
    this.updateTable();
  }

  exportToExcel(): void {
    const unwantedColumns = ["ID", "TeamID"];
    const filteredData = this.filterData.map(item => {
      const cleanItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          cleanItem[key] = item[key];
        }
      });
      return cleanItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Reports.xlsx');
  }

  public downloadPDF() {
    const margin = 10;
    const pageWidth = 210 - 2 * margin;
    const pdfTable = this.pdfTable.nativeElement;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    doc.html(pdfTable, {
      callback: (doc) => doc.save('Report.pdf'),
      x: margin,
      y: margin,
      width: pageWidth,
      windowWidth: pdfTable.scrollWidth
    });
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe(blob => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName);
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  openModalMap(latitude: string, longitude: string) {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
  }
  openModalPhoto(photo: string) {
    const mapUrl = `${this.appsettingConfig.StaticFileRootPathURL}${photo}`;
    window.open(mapUrl, '_blank');
  }
}
