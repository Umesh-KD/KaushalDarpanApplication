import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CustomizeReportDataModels, CustomizeReportCoulmnSearchModel, CustomizeReportSearchModel } from '../../../../Models/CustomizeReport';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-customize-report',
  standalone: false,

  templateUrl: './customize-report.component.html',
  styleUrl: './customize-report.component.css'

})
export class CustomizeReportComponent implements OnInit {

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
    private reportService: ReportService
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

  StreamMasterList: any[] = [];
  CategaryCastList: any[] = [];
  StateList: any[] = [];
  DistrictList: any[] = [];
  StudentTypeList: any[] = [];

  GenderList: any[] = [];
  BlockList: any[] = [];
  CourseTypeList: any[] = [];
  InstituteList: any[] = [];
  EndTermList: any[] = [];


  async ngOnInit() {

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
      Type:['']

    });
    await this.GetStudentCustomizetReportsColumns();


    await this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));


    await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StreamMasterList = data['Data'];
    }, (error: any) => console.error(error));

    await this.commonMasterService.GetCastCategory().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.CategaryCastList = data['Data'];

    }, (error: any) => console.error(error));

    await this.commonMasterService.GetStateMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StateList = data['Data'];
    }, (error: any) => console.error(error));

    await this.commonMasterService.StudentType().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StudentTypeList = data['Data'];
    }, (error: any) => console.error(error));


    await this.reportService.GetGender().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.GenderList = data['Data'];
    }, (error: any) => console.error(error));


    await this.reportService.GetBlock().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.BlockList = data['Data'];
    }, (error: any) => console.error(error));

    await this.reportService.GetCourseType().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.CourseTypeList = data['Data'];
    }, (error: any) => console.error(error));


    await this.reportService.GetInstitute().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteList = data['Data'];
    }, (error: any) => console.error(error));

    await this.reportService.GetEndTerm().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.EndTermList = data['Data'];
    }, (error: any) => console.error(error));

  }
  async GetStudentCustomizetReportsColumns() {
    

    try {
      await this.reportService.GetStudentCustomizetReportsColumns()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.displayedColumns = data["Data"];
            //for (var i = 0; i < data.Data.length; i++) {
            //  this.displayedColumns.push(data.Data[i]);
            //}
          }
        }, (error: any) => console.error(error));
    }
    catch (ex) {
      console.log(ex);
    }
  }


  async ddlState_Change() {
    
    try {
      if (this.filter.StateID === "all" || this.filter.StateID === "0") {
        this.filter.DistrictID = 0;
      }


      await this.commonMasterService.DistrictMaster_StateIDWise(this.filter.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }

  }

  exportToExcel(): void {
    const selectedNames: string[] = this.displayedColumns
      .filter(column => column.selected)
      .map(column => column.name);
    const filteredData = this.CustomizeReportCoulmnDataPush.map((item: any) => {
      const filteredItem: any = {};
      selectedNames.forEach((key) => {
        if (item[key] !== undefined) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'student-customize-report.xlsx');
  }






  get form() { return this.groupForm.controls; }

  cities: string[] = [];
  filtersApplied = false;
  get isColumnSelected() {
    return this.displayedColumns.some(column => column.selected);
  }
  toggleColumnSelection(column: any) {
    column.selected = !column.selected;
  }
  async SubmitData() {

    

    if (this.filter.StateID === "all") {
      this.filter.District = "0";
    } else {

      this.filter.District = this.filter.District;
    }


    let requestData: CustomizeReportCoulmnSearchModel = {
        StateID: !isNaN(Number(this.filter.StateID)) ? Number(this.filter.StateID) : 0,
        StudentTypeID: !isNaN(Number(this.filter.StudentType)) ? Number(this.filter.StudentType) : 0,
        SemesterID: !isNaN(Number(this.filter.SemesterID)) ? Number(this.filter.SemesterID) : 0,
        StreamID: !isNaN(Number(this.filter.StreamID)) ? Number(this.filter.StreamID) : 0,
        DistrictID: this.filter.StateID === 0 ? 0 : (!isNaN(Number(this.filter.District)) ? Number(this.filter.District) : 0),
        GenderID: this.GenderList.filter(column => column.selected).map(x => x.ID).join(',') || '',
        BlockID: !isNaN(Number(this.filter.Block)) ? Number(this.filter.Block) : 0,
        CourseTypeID: !isNaN(Number(this.filter.CourseType)) ? Number(this.filter.CourseType) : 0,
        InstituteID: !isNaN(Number(this.filter.Institute)) ? Number(this.filter.Institute) : 0,
        EndTermID: !isNaN(Number(this.filter.EndTerm)) ? Number(this.filter.EndTerm) : 0,
        CategaryCast: this.CategaryCastList.filter(column => column.selected).map(x => x.ID).join(',') || '',
        DepartmentID: 0,
        AcademicYearID: 0,
        CasteCategoryID: 0,
        Type: 0,
      ReportFlagID: 0,
        action:''
       
        
    };


    const selectedColumns = this.displayedColumns.filter(column => column.selected);




    console.log('Selected Columns:', selectedColumns);
    this.CustomizeReportCoulmnDataPush = [];
    try {

      await this.reportService.GetCustomizeStudentDetails(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State === EnumStatus.Success) {
            this.CustomizeReportCoulmnDataPush = data['Data'];

          }
        }, (error: any) => console.error(error));

      console.log('main data', this.CustomizeReportCoulmnDataPush);
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
}
