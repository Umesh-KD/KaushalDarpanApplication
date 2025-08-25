import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';  // Import MatSort
import { CollegesWiseReportsModel } from '../../../../Models/CollegesWiseReportsModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { DTEApplicationDashboardDataModel } from '../../../../Models/DTEApplicationDashboardDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-staff-management-reports',
  templateUrl: './staff-management-reports.component.html',
  styleUrls: ['./staff-management-reports.component.css'],
    standalone: false
})
export class StaffManagementReportsComponent implements OnInit {

  // Columns to be displayed in the table
  displayedColumns: string[] = [];
  columnSchema: Array<{ key: string, label: string, isAction?: boolean, isDate?: boolean }> = [];
  // Data source for the table
  dataSource = new MatTableDataSource<any>();
  sSOLoginDataModel: any;
  InstituteMasterList: any;
  SemesterMasterList: any;
  filterForm: FormGroup | undefined;
  // Pagination Properties
  totalRecords: number = 0;
  pageSize: number = 50;
  currentPage: number = 1;
  totalPages: number = 0;
  ReportTypelist: any;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  ssoLoginUser = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  // Search text for table filter
  Table_SearchText: string = '';
  StaffManagementList:any;
  // Store child data
  childDataMap: { [key: number]: any[] } = {};
  childDataMapZ: { [key: number]: any[] } = {};
  childDataMapP: { [key: number]: any[] } = {};
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  Ischildz: boolean = false;

  constructor(private loaderService: LoaderService, private reportService: ReportService, private commonMasterService: CommonFunctionService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));  
    
    this.filterForm = this.fb.group({
      StaffType:[0],
      SSOID: [''],
      Name: [''],     
      RoleID: [0]
     
    });
    this.GetAllData();
    this.Ischildz = false;
  }

 
  exportToExcel(): void {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.StaffManagementList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  resetForm(): void {
    this.filterForm?.reset({
      StaffType: 0,
      Name: '',
      SSOID: '',     
      RoleID: 0   
    });
    this.GetAllData();
  }
  filterFormSubmit() {
    this.GetAllData();
  }
  // Fetching the data from the service and updating the table
  async GetAllData() {
    let requestData: any = {
      UserID: this.sSOLoginDataModel.UserID || 0,
      DepartmentID: this.sSOLoginDataModel.DepartmentID || 0,
      StaffUserID: 0,
      StaffType: this.filterForm?.value.StaffType || 0, 
      RoleID: this.filterForm?.value.RoleID || 0,
      SSOID: this.filterForm?.value.SSOID || '',
      Name: this.filterForm?.value.Name || '',
      Action: 'ViewDataUser'
    }
    this.StaffManagementList = [];
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIEstablishManagementStaffReport(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.StaffManagementList = data['Data'];
            this.buildDynamicColumns();
            this.dataSource = new MatTableDataSource(this.StaffManagementList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.StaffManagementList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          } else if (data.State === 3) {
            this.StaffManagementList = [];
            this.dataSource = new MatTableDataSource(this.StaffManagementList);
            this.dataSource.sort = this.sort;  // Apply sorting
            this.totalRecords = this.StaffManagementList.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.updateTable();
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  buildDynamicColumns(): void {
    if (!this.StaffManagementList.length) return;

    const sampleItem = this.StaffManagementList[0];
    const columnKeys = Object.keys(sampleItem); 

    // List of columns you want to exclude
    const excludedColumns = ['ProfileStatusID', 'UserID', 'CreatedBy'];

    this.columnSchema = columnKeys
      .filter(key => !excludedColumns.includes(key))
      .map(key => ({
        key,
        label: this.formatColumnLabel(key),
        isDate: key.toLowerCase().includes('date')
      }));

    this.columnSchema.push({ key: 'Action', label: 'Action', isAction: true });
    this.displayedColumns = this.columnSchema.map(col => col.key);
  }


  formatColumnLabel(key: string): string {
    // Convert camelCase or PascalCase to words
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  // Handle page change event for pagination
  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  // Apply the filter for College Name
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (startIndex >= this.totalRecords) {
      this.currentPage = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
    }
    const adjustedEndIndex = Math.min(endIndex, this.totalRecords);
    this.dataSource.data = this.StaffManagementList.slice(startIndex, adjustedEndIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  expandedElement: any | null = null;
  expandedChild: any | null = null;
  expandedChildP: any | null = null;

  Toggle(userID: number) {
    debugger
    this.expandedElement = this.expandedElement === userID ? null : userID;

    if (this.expandedElement === userID) {
      // Call your API to fetch child data if needed
      this.fetchChildData(userID);
    }
  }

  async fetchChildData(userID: number) {  
      let requestData: any = {
        UserID: this.sSOLoginDataModel.UserID || 0,
        DepartmentID: this.sSOLoginDataModel.DepartmentID || 0,
        StaffUserID: userID,
        StaffType: this.filterForm?.value.StaffType || 0,
        RoleID: this.filterForm?.value.RoleID || 0,
        SSOID: this.filterForm?.value.SSOID || '',
        Name: this.filterForm?.value.Name || '',
        Action: 'ViewUserHierarchy'
      }
     
      try {
        this.loaderService.requestStarted();
        await this.reportService.GetITIEstablishManagementStaffReport(requestData)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.childDataMap[userID] = data['Data'] // store in a map if multiple users
            }
          }, (error: any) => console.error(error));
      } catch (ex) {
        console.log(ex);
      } finally {
        this.loaderService.requestEnded();
      }
   


  }



  ToggleZ(userID: number) {
    debugger
    this.expandedChild = this.expandedChild === userID ? null : userID;

    if (this.expandedChild === userID) {
      // Call your API to fetch child data if needed
      this.fetchChildDataZ(userID);
     
    }
  }

  async fetchChildDataZ(userID: number) {
    let requestData: any = {
      UserID: this.sSOLoginDataModel.UserID || 0,
      DepartmentID: this.sSOLoginDataModel.DepartmentID || 0,
      StaffUserID: userID,
      StaffType: this.filterForm?.value.StaffType || 0,
      RoleID: this.filterForm?.value.RoleID || 0,
      SSOID: this.filterForm?.value.SSOID || '',
      Name: this.filterForm?.value.Name || '',
      Action: 'ViewUserHierarchy'
    }

    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIEstablishManagementStaffReport(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.childDataMapZ[userID] = data['Data'] // store in a map if multiple users

            this.childDataMapZ = Object.values(this.childDataMapZ).flat();
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }



  }

  ToggleP(userIDP: number) {
    debugger
    this.expandedChildP = this.expandedChildP === userIDP ? null : userIDP;

    if (this.expandedChildP === userIDP) {
      // Call your API to fetch child data if needed
      this.fetchChildDataP(userIDP);
      this.Ischildz = true;
    }
  }

  async fetchChildDataP(userIDP: number) {
    let requestData: any = {
      UserID: this.sSOLoginDataModel.UserID || 0,
      DepartmentID: this.sSOLoginDataModel.DepartmentID || 0,
      StaffUserID: userIDP,
      StaffType: this.filterForm?.value.StaffType || 0,
      RoleID: this.filterForm?.value.RoleID || 0,
      SSOID: this.filterForm?.value.SSOID || '',
      Name: this.filterForm?.value.Name || '',
      Action: 'ViewUserHierarchy'
    }

    try {
      this.loaderService.requestStarted();
      await this.reportService.GetITIEstablishManagementStaffReport(requestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.childDataMapP = data['Data'] // store in a map if multiple users

            this.childDataMapP = Object.values(this.childDataMapP).flat();
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      this.loaderService.requestEnded();
    }



  }
}

