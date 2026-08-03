import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumOffice } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { BTER_EM_StaffListSearchModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ViewStaffProfileModalComponent } from '../view-staff-profile-modal/view-staff-profile-modal.component';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-establishment-report-bter',
  standalone: false,
  templateUrl: './establishment-report-bter.component.html',
  styleUrl: './establishment-report-bter.component.css'
})
export class EstablishmentReportBTERComponent {
  public searchRequest = new BTER_EM_StaffListSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  @ViewChild('Modal_StaffDetailsViewModal') childComponentViewStaffProfile!: ViewStaffProfileModalComponent;

  _EnumRole = EnumRole;
  _EnumOffice = EnumOffice;

  public StaffList: any = [];
  public OfficeList: any = [];
  public BugetHeadList: any = [];
  public StaffTypeList: any = [];
  public InstituteMasterList: any = [];
  public StaffProfileStatusList: any = [];
  public DesignationMasterDDLList: any = [];
  public StreamMasterDDLList: any[] = [];
  public EmployeeQualificationDDLList:any=[];
  public PayLevelDDLList:any=[];

  public Table_SearchText: string = '';
  public act: string = '';
  public status: number = 0;

  //table feature default
  modalReference: NgbModalRef | undefined;
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
    private loaderService: LoaderService,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.act = this.activatedRoute.snapshot.queryParamMap.get("act")?.toString() || '';
    this.status = Number(this.activatedRoute.snapshot.queryParamMap.get("status")?.toString()) || 0;

    await this.GetDDLMasterData();
    await this.GetStaffProfileStatusList();
    await this.getInstituteDataList();
    await this.GetDesignationData();
    await this.getStreamMasterList();
    await this.GetQualificationMasterData();
    await this.GetPayLevelDDL();
    await this.BTER_EM_GetStaffList();

  }

  async BTER_EM_GetStaffList() {
    this.searchRequest.act = this.act;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    this.searchRequest.status=this.searchRequest.status
    this.searchRequest.Eng_NonEng=this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.GuestHouseID = this.sSOLoginDataModel.GuestHouseID;
    this.searchRequest.InstitutionManagementTypeID = this.searchRequest.InstitutionManagementTypeID
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID

    if(this.status>0) {
      this.searchRequest.OfficeID = this.status;
    }

    try {
      this.loaderService.requestStarted();
      await this.bterEstablishManagementService.GetEstablishmentReportData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
        
          this.StaffList = data['Data'];

          this.loadInTable()
          console.log(this.StaffList, "ZonalList")
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

  async ResetControl() {
    this.searchRequest = new BTER_EM_StaffListSearchModel();
    await this.BTER_EM_GetStaffList();
  }

  async GetDDLMasterData() {
     ;  
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
        }, error => console.error(error));

        await this.commonMasterService.BTER_BGT_BudgetType(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BugetHeadList = data['Data'];
        }, error => console.error(error));

        await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StaffTypeList = data.Data;
        })
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

  async getInstituteDataList() {
    try {
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
            this.InstituteMasterList = data['Data'];
            this.InstituteMasterList = this.InstituteMasterList.filter((x: any) => { return x.InstituteID == this.sSOLoginDataModel.InstituteID });
            //console.log(this.sSOLoginDataModel.InstituteID,'ss1')
            //console.log(this.InstituteMasterList,'ss2')
          } else {
            this.InstituteMasterList = data['Data'];
            //this.request.InstituteID = 0
          }
        }, (error: any) => console.error(error));
    } catch (error) {
      console.error(error);
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

  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID','MobileNo','LevelName'
      ,'OfficeName','PostName','UserID','IsNodal','ProfileStatusID',
      'StaffID','StaffUserID','DistrictName','uod_InstituteID','RoleID'
    ];
    const filteredData = this.StaffList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StaffListData.xlsx');
  }

  async OpenStaffProfileViewModal(StaffID: number, UserID: number) {
    // 
    this.childComponentViewStaffProfile.StaffID = StaffID;
    this.childComponentViewStaffProfile.UserID = UserID;
    await this.childComponentViewStaffProfile.OpenStaffProfileViewModal();
  }

  exportToPDF() {

    const doc = new jsPDF('l', 'mm', 'a4');

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'Employee List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );
    
    const body = this.StaffList.map((row: any, index: number) => [
      index + 1,
      row.SSOID ?? '',
      row.Name ?? '',
      row.MobileNo ?? '',
      row.EmailID ?? '',
      row.InstituteName ?? '',
      row.StaffTypeName ?? '',
      row.RoleName ?? '',
      row.ProfileStatus ?? '',
      row.Remark ?? '',
      row.IsNodal ?? ''
    ]);

    autoTable(doc, {
      startY: 18,

      head: [[
        'Sr. No.',
        'SSOID',
        'Name',
        'Mobile No',
        'Email ID',
        'Department/ Institute',
        'Staff Type',
        'Role',
        'Profile Status',
        'Remark',
        'Is Nodal',
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

    doc.save('Employee_List.pdf');
  }

  async GetDesignationData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterDDLList = data.Data;
        if(this.searchRequest.StaffTypeID>0) {
          this.DesignationMasterDDLList = this.DesignationMasterDDLList.filter((x: any) => x.TypeID == this.searchRequest.StaffTypeID);
        } else {
          this.DesignationMasterDDLList = data.Data;
        }
      }, error => console.error(error))
    } catch (error) {
      console.error(error);
    }
  }

  async onChange_StaffType() {
    await this.GetDesignationData();
  }

  async getStreamMasterList() {
    try {
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, 0).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      })
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetQualificationMasterData() {
    try {
      await this.commonMasterService.GetEmployeeQualificationDDL().then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EmployeeQualificationDDLList = data.Data;
        }, error => console.error(error))
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetPayLevelDDL() {
    try {
        const request: any = {};
        request.RoleID = this.sSOLoginDataModel.RoleID;
        request.UserID = this.sSOLoginDataModel.UserID;
        request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
        request.EndTermId = this.sSOLoginDataModel.EndTermID;
        request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        request.Action = "GetPayLevelDDL";
        await this.bterEstablishManagementService.Bter_EM_GetCommonDropdownData(request).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PayLevelDDLList = data['Data'];
        })
      } catch (error) {
        console.error(error);
      }
  }



  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.StaffList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.StaffList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StaffList.length;
  }
  // end table feature
}
