import {
  Component, inject, OnInit, ViewChild
} from '@angular/core';
import {
  FormGroup, FormBuilder, Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../../../Common/GlobalConstants';
import { VerifierService } from '../../../../../Services/DTE_Verifier/verifier.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { TotalStudentReportedListModel } from '../../../../../Models/VerifierDataModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-total-student-reported-list',
  templateUrl: './total-student-reported-list.component.html',
  styleUrls: ['./total-student-reported-list.component.css'],
  standalone: false
})
export class TotalStudentReportedListComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public SearchVerifierFormGroup!: FormGroup;
  public searchRequest = new TotalStudentReportedListModel();
  public isSubmitted = false;
  public filterData: any = [];
  public Table_SearchText: string = '';
  public displayedColumns: string[] = [
    'SrNo', 'ApplicationNo', 'StudentName', 'DOB', 'MobileNo', 'ReportingStatus', 'InstituteNameEnglish', 'Branchname',
    'AllotedPriority', 'VerifyBy', 'VerifyBySSO', 'AllotmentType'
  ];
  public totalRecords: number = 0;
  public pageSize: number = 50;
  public currentPage: number = 1;
  public totalPages: number = 0;
  public startInTableIndex: number = 1;
  public endInTableIndex: number = 10;
  public dataSource = new MatTableDataSource<any>([]);

  id!: string;
  anotherParam!: string;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _liveAnnouncer = inject(LiveAnnouncer);

  constructor(
    private verifierService: VerifierService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
      this.anotherParam = params.get('anotherParam') || '';
    });

    this.SearchVerifierFormGroup = this.formBuilder.group({
      Name: ['', Validators.required],
      SSOID: ['', Validators.required],
      MobileNo: ['', Validators.required],
    });

    const loginData = localStorage.getItem('SSOLoginUser');
    if (loginData) {
      this.SSOLoginDataModel = JSON.parse(loginData);
      this.searchRequest.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      await this.onSearch();
    }
  }

  async onSearch() {
    this.isSubmitted = true;
    try {
      this.loaderService.requestStarted();
      this.searchRequest.CourseType = this.SSOLoginDataModel.Eng_NonEng;
      this.searchRequest.RoleID = this.SSOLoginDataModel.RoleID;
      this.searchRequest.Userid = this.SSOLoginDataModel.UserID;
      this.searchRequest.EndTermID = this.SSOLoginDataModel.EndTermID;
      this.searchRequest.Status = Number(this.anotherParam);

      const data: any = await this.verifierService.GetTotalStudentReportedList(this.searchRequest);
      const parsedData = JSON.parse(JSON.stringify(data));

      if (parsedData.State === EnumStatus.Success) {
        this.filterData = parsedData.Data;
        this.dataSource = new MatTableDataSource(this.filterData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRecords = this.filterData.length;
        this.updatePaginationIndexes();
      } else {
        this.toastr.error(parsedData.ErrorMessage || 'Failed to fetch data');
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
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
  async ResetControl() {
    this.searchRequest.Name = '';
    this.searchRequest.SSOID = '';
    this.searchRequest.MobileNo = '';
    this.onSearch()
  }
}
