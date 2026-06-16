import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { StaffDashService } from '../../../../Services/StaffDashboard/staff-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffDashboardSearchModel } from '../../../../Models/StaffDashboardDataModel';
import { CollegeMasterService } from '../../../../Services/CollegeMaster/college-master.service';
import { EnumEMProfileStatus, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { StaffMasterSearchModel } from '../../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../../Services/StaffMaster/staff-master.service';
import { AdminDashboardSearchModel, EM_JDTEDashboardSearchModel, EM_TransferRelievingDashSearchModel } from '../../../../Models/AdminDashboardDataModel';
import { AdminDashboardDataService } from '../../../../Services/AdminDashboard/admin-dashboard-data.service';
import { DteItemUnitMasterService } from '../../../../Services/DTEInventory/DTEItemUnitMaster/DTEItemunit-master.service';
import { DashboardRequestModel } from '../../../../Models/DTEInventory/DTEItemUnitModel';
import { DteTradeEquipmentsMappingService } from '../../../../Services/DTEInventory/DTETradeEquipmentsMapping/dtetrade-equipments-mapping.service';
import { DTEEquipmentsMasterService } from '../../../../Services/DTEInventory/DTEEquipmentsMaster/dteequipments-master.service';
import { DTEItemCategoriesMasterService } from '../../../../Services/DTEInventory/DTEItemCategoriesMaster/dteItemcategories-master.service';
import { DTEItemsSearchModel, itemStatusRevertModel } from '../../../../Models/DTEInventory/DTEItemsDataModels';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { ItemsDataModel } from '../../../../Models/DTEInventory/DTETradeEquipmentsMappingData';

@Component({
  selector: 'app-InventoryDashboard',
  templateUrl: './InventoryDashboard.component.html',
  styleUrls: ['./InventoryDashboard.component.css'],
  standalone: false
})
export class InventoryDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public InventoryList: any = [];
  public Table_SearchText: string = "";
  public viewDashboard: any[] = [];
  public viewTransferDashboard: any[] = [];
  public viewRelievingDashboard: any[] = [];
  public StaffMasterList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public searchRequest = new DashboardRequestModel();
  //public Searchrequest = new DTESearchTradeEquipmentsMapping()
  public staffSearchRequest = new StaffMasterSearchModel();
  public Searchrequest = new ItemsDataModel();

  isProfileComplete: boolean = false;
  RowBoxlength: number = 0
  public DynamicColumns: string[] = [];
  public DynamicRows: any[] = [];
  public MappingList: any = [];
  EnumRole = EnumRole;
  public isSubmitted: boolean = false;
  public EquipmentsDDLList: any = [];
  public CategoryDDLList: any = [];
  public SearchItemReq = new DTEItemsSearchModel()
  constructor(
    private StaffDashService: StaffDashService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private collegeMasterService: CollegeMasterService,
    private sweetAlert2: SweetAlert2,
    private staffMasterService: StaffMasterService,
    private router: Router,
    private AdminDashDataService: AdminDashboardDataService,
    private dteItemUnitMasterService: DteItemUnitMasterService,
    private tradeEquipmentsMappingService: DteTradeEquipmentsMappingService,
   
    private equipmentsService: DTEEquipmentsMasterService,
    private itemCategoriesService: DTEItemCategoriesMasterService,

  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDashboardData();
    await this.LoadDynamicReport('CategoryLIST');
    await this.GetEquipmentDDL();
    await this.GetCategoryDDL();
  }

 
  async GetDashboardData() {
   
    this.searchRequest.Action = "";
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.UserID=this.sSOLoginDataModel.UserID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.Status = 0;
    try {
      this.loaderService.requestStarted();
      await this.dteItemUnitMasterService.GetBter_InventoryDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
         
          this.viewDashboard = data['Data'];
          if (this.viewDashboard && this.viewDashboard.length > 0) {
            this.RowBoxlength = this.viewDashboard.length;
          } else {
            this.RowBoxlength = 0;
          }
          //this.viewTransferDashboard = this.viewDashboard.filter(s => s.ListType === 'Transfer');
          //this.viewRelievingDashboard = this.viewDashboard.filter(s => s.ListType === 'Relieving');
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async ResetControl() {
    this.isSubmitted = false;
    //this.Searchrequest = new DTESearchTradeEquipmentsMapping
    this.Searchrequest = new ItemsDataModel();
    // await this.GetAllData();
    await this.LoadDynamicReport();
    
  }

  async GetEquipmentDDL() {
    try {
      this.loaderService.requestStarted();
      this.SearchItemReq.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.SearchItemReq.CollegeId = this.sSOLoginDataModel.InstituteID;
      this.SearchItemReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.SearchItemReq.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.SearchItemReq.RoleID = this.sSOLoginDataModel.RoleID;
      await this.equipmentsService.GetAllData(this.SearchItemReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EquipmentsDDLList = data['Data'];
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


  async GetCategoryDDL() {
    try {
      this.loaderService.requestStarted();
      await this.itemCategoriesService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryDDLList = data['Data'];
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



  async LoadDynamicReport(action: string = 'CategoryLIST') {
    try {
      this.loaderService.requestStarted();

      const request = new ItemsDataModel();

      request.Action = action || 'CategoryLIST';
      request.CategoryId = this.Searchrequest.CategoryId;
      request.EquipmentId = this.Searchrequest.EquipmentId;
      request.RoleId = this.sSOLoginDataModel.RoleID;
      request.InstituteId = this.sSOLoginDataModel.InstituteID;

      const response: any =
        await this.tradeEquipmentsMappingService.GetDynamicReportData(request);

      console.log('API Response:', response);

      this.State = response.State;

      if (this.State === EnumStatus.Success) {

        switch (request.Action) {
          case 'CategoryLIST':
            this.MappingList = response?.Data?.CategoryList || [];
            break;

          case 'ItemEquipmentsLIST':
            this.MappingList = response?.Data?.EquipmentList || [];
            break;

          default:
            this.MappingList = [];
            break;
        }

        this.DynamicColumns =
          this.MappingList.length > 0
            ? Object.keys(this.MappingList[0])
            : [];

        console.log('MappingList:', this.MappingList);
        console.log('DynamicColumns:', this.DynamicColumns);
      } else {
        this.MappingList = [];
        this.DynamicColumns = [];
      }
    } catch (error) {
      console.error(error);
      this.MappingList = [];
      this.DynamicColumns = [];
    } finally {
      this.loaderService.requestEnded();
    }
  }

  exportToExcel(): void {

    if (!this.MappingList || this.MappingList.length === 0) {
      this.toastr.warning('No data available for export');
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.MappingList);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      'Inventory Dashboard Report'
    );

    XLSX.writeFile(
      wb,
      'InventoryDashBoard_Report.xlsx'
    );
  }


  exportToPDF(): void {

    const doc = new jsPDF('l', 'mm', 'a4');

    const headers = [['Sr. No.', ...this.DynamicColumns]];

    const body = this.MappingList.map((row: any, index: number) => [
      index + 1,
      ...this.DynamicColumns.map(col => row[col] ?? '')
    ]);

    autoTable(doc, {
      head: headers,
      body: body,
      startY: 20,
      theme: 'grid'
    });

    doc.save('InventoryDashBoard_Report.pdf');
  }

}
