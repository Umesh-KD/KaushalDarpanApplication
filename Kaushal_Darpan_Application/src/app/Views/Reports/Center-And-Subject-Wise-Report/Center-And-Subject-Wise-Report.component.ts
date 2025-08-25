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
  selector: 'app-Center-And-Subject-Wise-Report',
  standalone: false,
  templateUrl: './Center-And-Subject-Wise-Report.component.html',
  styleUrl: './Center-And-Subject-Wise-Report.component.css'
})
export class CenterAndSubjectWiseReportComponent implements OnInit {
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
  public sum: number = 0;

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
      ReportFlagID:[''],
      Type:[''],
    });




    await this.loadReportType();

    await this.commonMasterService.SemesterMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SemesterMasterList = data['Data'];
    }, (error: any) => console.error(error));

  }


 

  async loadReportType() {
    this.ReportTypelist = [
      { ID: 78, Name: 'center-and-subject-wise-report-main' },
      { ID: 77, Name: 'center and subject wise report-special' },
     
    ];
  }
  //getUniqueKeys(objects: any[]): { name: string; key: string }[] {
  //  const keySet = new Set<string>();

  //  objects.forEach(obj => {
  //    Object.keys(obj).forEach(key => {
  //      keySet.add(key);
  //    });
  //  });
  //  return Array.from(keySet).map(key => ({
  //    name: key,
  //    key: key
  //  }));
  //}
   getUniqueKeys(objects: any[]): { name: string; key: string }[] {
  const keySet = new Set<string>();

  // Iterate over all objects and add keys to the set
  objects.forEach(obj => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        // Add all keys, but we will handle 'Total' separately
        if (key !== 'Total') {
          keySet.add(key);
        }
      });
    }
  });

  // Add 'Total' key as a new column (if it's not already present)
  keySet.add('Total');

  // Convert the set to an array and return the unique keys
  return Array.from(keySet).map(key => ({ name: key, key }));
}

  exportToCSV(): void {

    // Sort the selected names as per your previous logic
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

    // Prepare the header row
    const header = ['S.No', ...this.selectedNames];

    // Prepare the rows of data
    const rows = this.GetfilteredList.map((item: any, index: number) => {
      const row: string[] = [String(index + 1)]; // Adding Serial Number

      // Loop through each selected column to add its value to the row
      this.selectedNames.forEach((key) => {
        if (item[key] !== undefined) {
          row.push(item[key].toString()); // Convert to string for CSV
        } else {
          row.push('');
        }
      });

      return row;
    });

    // Add the header to the rows
    rows.unshift(header);

    // Convert the rows to CSV format
    const csvContent = rows.map((row:any) => row.join(',')).join('\n');

    // Create a Blob from the CSV string and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const filename = this.filter.Type === 1
      ? 'Download-Center-Wise-Subject-Count-Main-Report.csv'
      : this.filter.Type === 2
        ? 'Download-Center-Wise-Subject-Count-Special-Report.csv'
        : 'Center-Wise-Subject-Count-Report.csv';

    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
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

    if (this.filter.Type == 1) {
      XLSX.writeFile(wb, 'Download-Center-Wise-Subject-Count-Main-Report.xlsx');
    }
    else if (this.filter.Type == 2) {
      XLSX.writeFile(wb, 'Download-Center-Wise-Subject-Coun-Special-Report.xlsx');
    }
    else {
      XLSX.writeFile(wb, 'Center-Wise-Subject-Coun-Report.xlsx');
    }
   
  }

  
  get form() { return this.groupForm.controls; }

  cities: string[] = [];
  filtersApplied = false;
  
  async SubmitData() {
    

    this.CustomizeReportCoulmnDataPush = [];
    try {
      this.requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestData.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestData.ReportFlagID = this.sSOLoginDataModel.Eng_NonEng;

      this.requestData.Type = !isNaN(Number(this.filter.Type)) ? Number(this.filter.Type) : 0;
      this.requestData.SemesterID = !isNaN(Number(this.filter.SemesterID)) ? Number(this.filter.SemesterID) : 0;

      try {
       
        const data = await this.reportService.GetCenterWiseSubjectCountReportColumnsAndList(this.requestData);
        const clonedData = JSON.parse(JSON.stringify(data)); 

       
        if (clonedData.State === EnumStatus.Success) {
         
          this.displayedColumns = clonedData["Data"];
          this.CustomizeReportCoulmnDataPush = clonedData["Data"];

        
          this.UniqueKeys = this.getUniqueKeys(this.displayedColumns);

          
          this.selectedNames = this.UniqueKeys.map(column => column.name);

          
          this.selectedNames.sort((a, b) => {
            const specialColumns = ["Total"];

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
 
          let result: any[] = [];

         
          this.CustomizeReportCoulmnDataPush.forEach((item: any, index: number) => {
            const filteredItem: any = { 'S.No': index + 1 };  

            
            this.selectedNames.forEach((key) => {
              if (item[key] !== undefined) {
                filteredItem[key] = item[key];
              }
            });

           
            filteredItem["Total"] = Object.keys(filteredItem)
              .filter(key => key !== 'S.No' && key !== 'CenterCode' && !isNaN(Number(filteredItem[key])))
              .reduce((sum, key) => sum + Number(filteredItem[key]), 0);

          
            result.push(filteredItem);
          });

         
          const totalRowData: any = { 'S.No': 'Total', 'CenterCode': '' };

         
          this.selectedNames.forEach((key) => {
            if (key !== 'S.No' && key !== 'CenterCode') {
              totalRowData[key] = result.reduce((sum, row) => sum + (row[key] || 0), 0); 
            }
          });

         
          totalRowData["Total"] = result.reduce((sum, row) => sum + (row["Total"] || 0), 0); 

         
          result.push(totalRowData);

         
          this.GetfilteredList = result;

        } else {
          console.error("Failed to fetch data, state not success");
        }
      } catch (error) {
       
        console.error(error);
      }

    }

    catch (error) {
      // Catch any errors and log them
      console.error(error);
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
