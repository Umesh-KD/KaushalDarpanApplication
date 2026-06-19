import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { EnumRole } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { PlacementReportSearchModels } from '../../../Models/PlacementDashReportModel';
import { ItiCampusPostService } from '../../../Services/ITI/ITICampusPost/iticampus-post.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApprenticeReportServiceService } from '../../../Services/ITI/ApprenticeReport/apprentice-report-service.service';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';

@Component({
  selector: 'app-student-allotment-report',
  templateUrl: './student-allotment-report.component.html',
  styleUrls: ['./student-allotment-report.component.css'],
  standalone: false
})
export class ITIStudentAllotmentReportComponent implements OnInit {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  viewStudentAllotmentList: any[] = [];
  filteredData: any[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<StudentExamDetails> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel: any;
  id: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  public isInstituteDisabled: boolean = false;
  public settingsMultiselect: object = {};
  public settingsMultiselect1: object = {};
  public settingsMultiselect3: object = {};
  public Searchform!:FormGroup;
  public institueList: any = [];
  public StreamMasterList:any =[];
  public CompanyMasterList:any=[];
  public request =new PlacementReportSearchModels();
  public SelectedTradeID:any=[];
  public SelectedCollegeID:any=[];
  public SelectedCompanyID:any=[];
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  constructor(
    private ApprenticeReportServiceService: ApprenticeReportServiceService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private CampusPostService: ItiCampusPostService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {

    this.Searchform = this.formBuilder.group({
      InstituteID: [''] , // ✅ disabled here
      StudentName: [''],
      ddlBranch: [''],
      ddlCompanyID: ['']
    });

 this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.settingsMultiselect1 = {
      singleSelection: false,
      idField: 'InstituteID',
      textField: 'InstituteName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.settingsMultiselect3 = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };


    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id')
    });
    //if(this.id==10){
      this.displayedColumns = ['SrNo', 'Distirct_Name', 'DGT_Code', 'Inst_Code', 'ITI_Name', 'State_Reg_Num', 'Trainee_Name', 'Father_Guardian_Name', 'DOB', 'Gender'];
    //}
    //else{
    //  this.displayedColumns= ['SrNo', 'StudentName', 'EnrollmentNo', 'InstituteName', 'InstitutionManagementType', 'Email', 'FatherName', 'DOB', 'Age', 'GenderName'];
    //}
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    debugger;

    //await this.GetLoadData();

    //if(this.sSOLoginDataModel.RoleID==this._EnumRole.ITI_Placement_TPO)
    //{
    //  this.isInstituteDisabled=true;
    //  this.request.CollegeID=this.sSOLoginDataModel.InstituteID;
    //  this.request.InstituteID=this.sSOLoginDataModel.InstituteID;
    //  const selected = this.institueList.find((x:any) => x.InstituteID == this.request.CollegeID);

    //  this.Searchform.patchValue({
    //    InstituteID: [selected]
    //  });
      
    //  // 👉 change settings to single select
    //  this.settingsMultiselect1 = {
    //    ...this.settingsMultiselect1,
    //    singleSelection: true,
    //    enableCheckAll: false
    //  };
    //    // 👉 disable dropdown
    //  setTimeout(() => {
    //    this.Searchform.get('InstituteID')?.disable();
    //  });

    //}
    //else
    //{
    //      this.isInstituteDisabled=false;
    //      this.settingsMultiselect1 = {
    //      ...this.settingsMultiselect1,
    //      singleSelection: false,
    //      enableCheckAll: true
    //    };
    //  this.Searchform.get('InstituteID')?.enable();
    //}
  
    this.GetAllData();

  }

  //async GetLoadData(){
  //  this.request.StudentName
  //  try{
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
  //    .then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.InstituteMasterList = data['Data'];
  //    }, (error: any) => console.error(error));

  //    await this.CampusPostService.Iticollege(this.sSOLoginDataModel.DepartmentID,this.sSOLoginDataModel.EndTermID)
  //        .then((data: any) => {
  //          data = JSON.parse(JSON.stringify(data));
  //          this.institueList = data['Data'];
  //          // this.copyOfinstitueList=data['Data'];
  //        }, error => console.error(error));

  //    await this.commonMasterService.SemesterMaster()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.SemesterMasterList = data['Data'];
  //      }, (error: any) => console.error(error));

  //    await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID,0,0,this.sSOLoginDataModel.InstituteID,0,0)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.StreamMasterList = data['Data'];
  //      }, error => console.error(error));

  //    await this.commonMasterService.ITIPlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data['Data']);
  //        this.CompanyMasterList = data['Data'];
  //      }, error => console.error(error));

  //    }
  //    catch (Ex) {
  //      console.log(Ex);
  //    }
  //    finally {
  //      setTimeout(() => {
  //        this.loaderService.requestEnded();
  //      }, 200);
  //    }
  //}


  // exportToExcel(): void {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.viewStudentAllotmentList);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  // }


    //exportToExcel(): void {
    //  const unwantedColumns = [
    //    'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
    //    'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID','MobileNo','Email'
    //  ];
    //  const filteredData = this.viewStudentAllotmentList.map((item: any) => {
    //    const filteredItem: any = {};
    //    Object.keys(item).forEach(key => {
    //      if (!unwantedColumns.includes(key)) {
    //        filteredItem[key] = item[key];
    //      }
    //    });
    //    return filteredItem;
    //  });
    //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //  XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  //}

  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus',
      'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType',
      'AcademicYearID', 'EndTermID', 'MobileNo', 'Email'
    ];
    const filteredData = this.viewStudentAllotmentList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    // Auto column width
    const colWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...filteredData.map((row: any) =>
          row[key] ? row[key].toString().length : 0
        )
      ) + 5
    }));

    ws['!cols'] = colWidths;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }
  

  async GetAllData() {
    debugger
    console.log(this.request.CollegeID);
     console.log("selected trade ===> ",this.SelectedTradeID);
     console.log("selected institute ===> ",this.SelectedCollegeID);
     console.log("selected institute ===> ",this.SelectedCompanyID);
      this.request.TradeID=this.SelectedTradeID.length>0?this.SelectedTradeID.map((item:any)=>item.ID).join(','):'0';
      this.request.InstituteID=this.SelectedCollegeID.length>0?this.SelectedCollegeID.map((item:any)=>item.InstituteID).join(','):'0';
      this.request.CompanyID=this.SelectedCompanyID.length>0?this.SelectedCompanyID.map((item:any)=>item.ID).join(','):'0';
      console.log("selected search ==>",this.request.TradeID);
      console.log("selected search ==>",this.request.InstituteID);
      console
    let requestData: RequestBaseModel = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,     
      RoleID: this.sSOLoginDataModel.RoleID,
      EndTermID: this.sSOLoginDataModel.EndTermID
    }
    await this.ApprenticeReportServiceService.GetITIStudentAllotmentReport(requestData)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.viewStudentAllotmentList = data['Data'];
        this.filteredData = [...this.viewStudentAllotmentList]; // Copy full dataset
        this.dataSource = new MatTableDataSource(this.filteredData);
        this.dataSource.sort = this.sort;
        this.totalRecords = this.filteredData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();
      }, (error: any) => console.error(error)
      );
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();

    if (filterValue === "all" || filterValue === "") {
      this.filteredData = [...this.viewStudentAllotmentList]; // Reset to full dataset
    } else {
      this.filteredData = this.viewStudentAllotmentList.filter(item =>
        Object.values(item).some(value =>
          value != null && value.toString().toLowerCase().includes(filterValue)
        )
      );
    }

    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1; // Reset to first page after filtering
    this.updateTable();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    this.dataSource.data = this.filteredData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }


    async ClearSearchData() {
    //  debugger
      if(this.sSOLoginDataModel.RoleID!=this._EnumRole.ITI_Placement_TPO)
      {
        this.request.CollegeID = 0;
        this.SelectedCollegeID = [];
      }
      // else{
      //   this.request.CollegeID = this.sSOLoginDataModel.InstituteID;
      // }
      this.request.TradeID = '';
      this.SelectedTradeID = [];
      this.request.CompanyID='';

      this.request.CompanyID='';
      this.SelectedCompanyID = [];
    this.request.StudentName = '';
    await this.GetAllData();
  }

  

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  onSelectAll(event:any){
    console.log(event);
  }

  onItemSelect(evet:any) {
    debugger
    console.log("on select", evet);
    if (this.isInstituteDisabled) return;
  }

onDeSelect(event:any) {
}

// onSelectAll(items: any[], centerID: number) {
// }

onDeSelectAll(event:any) {
}



}


