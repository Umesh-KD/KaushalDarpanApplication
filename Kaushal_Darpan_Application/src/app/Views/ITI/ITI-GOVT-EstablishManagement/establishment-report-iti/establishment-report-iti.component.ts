import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ITI_Govt_EM_ZonalOFFICERSSearchDataModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-establishment-report-iti',
  standalone: false,
  templateUrl: './establishment-report-iti.component.html',
  styleUrl: './establishment-report-iti.component.css'
})
export class EstablishmentReportITIComponent {
  public searchRequest = new ITI_Govt_EM_ZonalOFFICERSSearchDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  public ZonalList: any = [];
  public OfficeWorkList: any = [];
  public OfficeList: any = [];
  public Districtlist: any = [];
  public LevelList: any = [];
  public ITICollegeList: any = [];
  public StaffTypeList: any = [];
  public StaffProfileStatusList: any = [];

  public Table_SearchText: string = "";

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

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async GetStaffList() {
    
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID
    this.searchRequest.RoleId = this.sSOLoginDataModel.RoleID
    
    if (this.searchRequest.OfficeID != 11) {
      this.searchRequest.InstituteID = 0
      this.searchRequest.DistrictID=0
    }
    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_Govt_AdminT2Zonal_GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ZonalList = data['Data'];
          this.loadInTable()
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetOfficeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.searchRequest.LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          this.OfficeWorkList = data['Data'];
          console.log(this.OfficeList, "OfficeList")
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetLevelList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LevelList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        this.Districtlist = data.Data;
      });
    } catch (error) {
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async getItiNameAndCode() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('GovtIti',0, this.searchRequest.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITICollegeList = data['Data'];   // full list
        }, error => console.error(error));

    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ITI_StaffType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStaffProfileStatusList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ITIvtARRStauts').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffProfileStatusList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl() {
    this.searchRequest.LevelID = 0;
    this.searchRequest.OfficeID = 0;
    this.searchRequest.StaffTypeID = 0;
    this.searchRequest.SSOID = "";
    this.searchRequest.Name = "";    
    await this.GetStaffList();
  }

  exportToExcel(): void {

    const exportData = this.ZonalList.map((row: any, index: number) => ({
      'Sr. No.': index + 1,

      'Employee ID / Name':
        `${row.Name || ''} (${row.SSOID || ''})`,

      'Service Category':
        row.ServiceName || '',

      'Mobile / Email':
        `${row.MobileNo || ''} (${row.EmailID || ''})`,

      'Designation':
        `${row.StaffTypeName || ''}${row.PostName ? ' / ' + row.PostName : ''}`,

      'Level Name or Office Name':
        `${row.LevelName || ''}${row.OfficeName ? ' / ' + row.OfficeName : ''}`,

      'Post Deployed':
        row.PostName || '',

      'Profile Status (Remark)':
        `${row.ProfileStatus === 'Approve' ? 'Approved' : (row.ProfileStatus || '')}` +
        `${row.Remark ? ' (' + row.Remark + ')' : ''}`,

      'Is HOD':
        row.IsHod || ''
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Auto column width
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...exportData.map((r: any) => (r[key] ? r[key].toString().length : 0))
      ) + 2
    }));

    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ITI Govt Office List');

    XLSX.writeFile(wb, 'ITI_Govt_Office_Employee_List.xlsx');
  }

  exportToPDF() {

    const doc = new jsPDF('l', 'mm', 'a4');

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'ITI Govt Office Employee List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    const body = this.ZonalList.map((row: any, index: number) => [
      index + 1,
      `${row.Name || ''} (${row.SSOID || ''})`,
      row.ServiceName || '',
      `${row.MobileNo || ''} (${row.EmailID || ''})`,
      `${row.StaffTypeName || ''}${row.PostName ? ' / ' + row.PostName : ''}`,
      `${row.LevelName || ''}${row.OfficeName ? ' / ' + row.OfficeName : ''}`,
      row.PostName || '',
      `${row.ProfileStatus === 'Approve' ? 'Approved' : (row.ProfileStatus || '')}${row.Remark ? ' (' + row.Remark + ')' : ''
      }`,
      row.IsHod || ''
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr. No.',
        'Employee ID / Name',
        'Service Category',
        'Mobile / Email',
        'Designation',
        'Level Name / Office Name',
        'Post Deployed',
        'Profile Status (Remark)',
        'Is HOD'
      ]],

      body,

      theme: 'grid',

      styles: {
        fontSize: 7,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });

    doc.save('ITI_Govt_Office_Employee_List.pdf');
  }










  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ZonalList].slice(this.startInTableIndex, this.endInTableIndex);
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

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.ZonalList.length;
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  //table features end
}
