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

@Component({
  selector: 'app-Paper-Count-Report-New',
  standalone: false,
  templateUrl: './Paper-Count-Report-New.component.html',
  styleUrl: './Paper-Count-Report-New.component.css'
})
export class PaperCountReportNewComponent implements OnInit {
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
  public IsSNo: boolean = false;

  public requestData = new CustomizeReportCoulmnSearchModel();
  public GetfilteredList: any = [];
  public selectedNames: string[] = [];


  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private reportService: ReportService,

  ) {
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
      SemesterID: [''],
      StreamID: [''],
      District: [''],
      gender: [''],
      Block: [''],
      CourseType: [''],
      Institute: [''],
      EndTerm: [''],
      CategaryCast: [''],
      UniqueCol: [''],
      ReportFlagID: [''],
      Type: [''],
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
      { ID: 2, Name: 'Download Branch and Subject Wise Student Report (Reg,Ex)' },
      { ID: 1, Name: 'Download Institute and Subject Wise Student Report  (Reg,Ex)' },
      { ID: 0, Name: 'Download Institute Subject Branch Wise Student Report  (Reg,Ex)' },
      { ID: 5, Name: 'Download Institute Subject Branch Wise Student Report Reg' },
      { ID: 6, Name: 'Download Institute Subject Branch Wise Student Report Ex' },
    ];
  }
  getUniqueKeys(objects: any[]): { name: string; key: string }[] {
    const keySet = new Set<string>();

    objects.forEach(obj => {
      Object.keys(obj).forEach(key => {
        keySet.add(key);
      });
    });
    return Array.from(keySet).map(key => ({
      name: key,
      key: key
    }));
  }


  exportToExcel(): void {

    this.selectedNames = this.UniqueKeys.map(column => column.name);
    this.selectedNames.sort((a, b) => {

      const specialColumns = ["SCA", "Total"];

      const aIsSpecial = specialColumns.includes(a);
      const bIsSpecial = specialColumns.includes(b);


      if (aIsSpecial && bIsSpecial) return 0;


      if (aIsSpecial) return 1;
      if (bIsSpecial) return -1;


      const isANumber = !isNaN(Number(a));
      const isBNumber = !isNaN(Number(b));

      if (isANumber && !isBNumber) return 1;
      if (!isANumber && isBNumber) return -1;

      return a.localeCompare(b);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.GetfilteredList, { header: ['S.No', ...this.selectedNames] });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* XLSX.writeFile(wb, 'Paper-Count-Report.xlsx');*/

    if (this.filter.Type == 2) {
      XLSX.writeFile(wb, 'Download-Branch-And-Subject-Wise-Student-Report.xlsx');
    }
    else if (this.filter.Type == 1) {
      XLSX.writeFile(wb, 'Download-Institute-And-Subject-Wise-Student-Report.xlsx');
    } else if (this.filter.Type == 0) {
      XLSX.writeFile(wb, 'Download-Institute-Subject-Branch-Wise-Student-Report.xlsx');
    }
    else if (this.filter.Type == 5) {
      XLSX.writeFile(wb, 'Download-Institute-Subject-Branch-Wise-Student-Reg-Report.xlsx');
    }
    else if (this.filter.Type == 6) {
      XLSX.writeFile(wb, 'Download-Institute-Subject-Branch-Wise-Student-Ex-Report.xlsx');
    }
    else {
      XLSX.writeFile(wb, 'Paper-Count-Report.xlsx');
    }

  }


  get form() { return this.groupForm.controls; }

  cities: string[] = [];
  filtersApplied = false;

  async SubmitData() {


    this.CustomizeReportCoulmnDataPush = [];
    try {

      this.requestData.ReportFlagID = !isNaN(Number(this.filter.ReportFlagID)) ? Number(this.filter.ReportFlagID) : 0;
      this.requestData.StudentTypeID = !isNaN(Number(this.filter.StudentType)) ? Number(this.filter.StudentType) : 0;
      this.requestData.SemesterID = !isNaN(Number(this.filter.SemesterID)) ? Number(this.filter.SemesterID) : 0;
      this.requestData.StreamID = !isNaN(Number(this.filter.StreamID)) ? Number(this.filter.StreamID) : 0;
      this.requestData.CourseTypeID = !isNaN(Number(this.filter.CourseType)) ? Number(this.filter.CourseType) : 0;
      this.requestData.InstituteID = !isNaN(Number(this.filter.Institute)) ? Number(this.filter.Institute) : 0;
      this.requestData.EndTermID = !isNaN(Number(this.filter.EndTerm)) ? Number(this.filter.EndTerm) : 0;
      this.requestData.CategaryCast = '';
      this.requestData.StateID = 0;
      this.requestData.DistrictID = 0;
      this.requestData.GenderID = '';
      this.requestData.BlockID = 0;
      this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestData.AcademicYearID = 0;
      this.requestData.CasteCategoryID = 0;
      this.requestData.Type = !isNaN(Number(this.filter.Type)) ? Number(this.filter.Type) : 0;


      this.requestData.action = '_InsituteWiseCountReport'






      try {
        await this.reportService.GetPaperCountCustomizeReportColumnsAndList(this.requestData)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {

              this.displayedColumns = data["Data"];
              this.CustomizeReportCoulmnDataPush = data["Data"];
              this.UniqueKeys = this.getUniqueKeys(this.displayedColumns);

              this.selectedNames = this.UniqueKeys.map(column => column.name);
              this.selectedNames.sort((a, b) => {

                const specialColumns = ["SCA", "Total"];

                const aIsSpecial = specialColumns.includes(a);
                const bIsSpecial = specialColumns.includes(b);

                if (aIsSpecial && bIsSpecial) return 0;


                if (aIsSpecial) return 1;
                if (bIsSpecial) return -1;

                const isANumber = !isNaN(Number(a));
                const isBNumber = !isNaN(Number(b));

                if (isANumber && !isBNumber) return 1;
                if (!isANumber && isBNumber) return -1;

                return a.localeCompare(b);
              });
              this.GetfilteredList = this.CustomizeReportCoulmnDataPush.map((item: any, index: number) => {
                const filteredItem: any = { 'S.No': index + 1 };
                this.selectedNames.forEach((key) => {
                  if (item[key] !== undefined) {
                    filteredItem[key] = item[key];
                  }
                });

                return filteredItem;
              });
            }
          }, (error: any) => console.error(error));
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
    this.requestData = new CustomizeReportCoulmnSearchModel();
  }




}
