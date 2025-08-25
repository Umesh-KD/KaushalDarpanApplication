import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITIGenerateRollSearchModel } from '../../../../Models/ITI/ITIGenerateRollDataModels';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { CenterMasterDDLDataModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { GenerateRollNumberITIService } from '../../../../Services/ITI/ITIGenerateRoll/generate-roll-number-iti.service';
import { EnumRollNoStatus, EnumStatus } from '../../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-published-roll-no-iti',
  standalone: false,
  templateUrl: './published-roll-no-iti.component.html',
  styleUrl: './published-roll-no-iti.component.css'
})
export class PublishedRollNoITIComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public PageNameTitile: string = '';
  public currentTab: number = 0;
  public selectedEndTermID: number = 0;
  public currentStatus: number = 0;
  public SearchForm!: FormGroup;
  public searchRequest = new ITIGenerateRollSearchModel();
  requestTrade = new ItiTradeSearchModel()
  public TradeListDDL: any = [];
  public DistrictMasterDDL : any = [];
  requestCenter = new CenterMasterDDLDataModel();
  public InstituteMasterDDL: any = [];
  public Table_SearchText: any = '';
  public StudentList: any = [];
  public _RollListStatus= EnumRollNoStatus; 
  public StudentTypeList: any = [];

  //table feature default
  public paginatedInTableData: any[] = []; //copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = '50';
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public Isverified:boolean=false
  //end table feature default

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private itiInspectionService: ITIInspectionService,
    private loaderService: LoaderService,
    private generateRollNumberITIService: GenerateRollNumberITIService
  ) {}

  async ngOnInit() {

     this.sSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );

    this.SearchForm = this.formBuilder.group({
      InstituteID: [''],
      DistrictID: [''],
      TradeID: [''],
      StudentTypeID: [''],
    });

    this.selectedEndTermID = Number(this.route.snapshot.queryParamMap.get("EndTermID") ?? 0);
    this.currentStatus = Number(this.route.snapshot.queryParamMap.get("Status") ?? 0);
    this.currentTab = Number(this.route.snapshot.queryParamMap.get("tab") ?? 0);
    this.getMasterData()
    this.GetAllData();
  }

  async getMasterData() {
    try {
      this.requestTrade.action='_getAllData'
      await this.commonMasterService.TradeListGetAllData(this.requestTrade).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeListDDL = data.Data;
      })
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
      })

      await this.commonMasterService.StudentType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentTypeList = data['Data'];
        }, (error: any) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  }

  GetInstituteMaster_ByDistrictWise(ID: any) {
    this.requestCenter.action = 'GetInstituteMaster_ByDistrictWise'
    this.requestCenter.DistrictID = ID;
    this.itiInspectionService.GetITIInspectionDropdown(this.requestCenter).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL", this.InstituteMasterDDL)
    })
  }

  async GetAllData() {
    try {
      this.StudentList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.ShowAll = this.selectedEndTermID > 0 ? 1 : 0;
      this.searchRequest.Status = this.currentStatus;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;

 
      //call
      await this.generateRollNumberITIService.GetPublishedRollDataITI(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
           
            this.loadInTable();
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async ResetControl() {
    this.searchRequest = new ITIGenerateRollSearchModel()
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.GetAllData();
  }
  async exportToExcel() {
    // Define the columns in the exact order you want for the export
    const columnOrder = [
      'SrNo', 'StudentName', 'FatherName', 'DOB', 'InstituteName', 'StreamName', 'SemesterName', 'EnrollmentNo', 'RollNumber',
    ];

    // Define the list of columns to exclude from the export
    const unwantedColumns = [
      'StudentID', 'dob_org', 'StreamID', 'SemesterID', 'InstituteID', 'InstituteCode', 'streamCode', 'MobileNo', 'EndTermID',
    ];

    // Filter the data based on unwanted columns and map it to the correct order
    const filteredData = this.StudentList.map((item: any, index: number) => {
      const filteredItem: any = {};

      // Manually order the columns based on the columnOrder array
      columnOrder.forEach((column, idx) => {
        // Add 'SrNo' as the first column (index + 1 for numbering)
        if (column === 'SrNo') {
          filteredItem[column] = index + 1;
        } else if (item[column] && !unwantedColumns.includes(column)) {
          filteredItem[column] = item[column];
        }
      });

      return filteredItem;
    });

    // Create worksheet from filtered data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Calculate column widths based on max length of content in each column
    const columnWidths = columnOrder.map((column) => ({
      wch:
        Math.max(
          column.length, // Header length
          ...filteredData.map((item: any) =>
            item[column] ? item[column].toString().length : 0
          ) // Max content length
        ) + 2, // Add extra padding
    }));

    // Apply column widths
    ws['!cols'] = columnWidths;

    // Apply header styling (bold + background color)
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1'; // First row (headers)
        if (!ws[cellAddress]) continue;

        // Bold the header text and apply a background color
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } }, // Bold text, white color
          fill: { fgColor: { rgb: '#f3f3f3' } }, // Light background color
          alignment: { horizontal: 'center', vertical: 'center' }, // Center-align text
        };
      }
    }

    // Create a new workbook and append the sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the file as "GeneratedRollNumber.xlsx"
    XLSX.writeFile(wb, 'PublishedRollNumberData.xlsx');
  }

  
  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(
      this.totalInTableRecord / parseInt(this.pageInTableSize)
    );
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex =
      (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex =
      this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex =
      this.endInTableIndex > this.totalInTableRecord
        ? this.totalInTableRecord
        : this.endInTableIndex;
    this.paginatedInTableData = [...this.StudentList].slice(
      this.startInTableIndex,
      this.endInTableIndex
    );
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
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
    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (
      this.currentInTablePage <= 0 ||
      this.currentInTablePage > this.totalInTablePage
    ) {
      this.currentInTablePage = 1;
    }
    if (
      this.currentInTablePage > 0 &&
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = []; //copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StudentList.length;
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  // get totalInTableSelected(): number {
  //   return this.StudentList.filter((x) => x.Selected)?.length;
  // }

  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  // end table feature

}
