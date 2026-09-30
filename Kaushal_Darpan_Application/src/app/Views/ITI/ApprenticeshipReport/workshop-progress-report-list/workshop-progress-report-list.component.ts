import { Component } from '@angular/core';

import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ReturnDteItemDataModel } from '../../../../Models/DTEInventory/DTEIssuedItemDataModel';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service'
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { HttpClient } from '@angular/common/http';
import { ITIApprenticeshipWorkshopModel } from '../../../../Models/ITI/ITIApprenticeshipWorkshopDataModel';
import { ReportService } from '../../../../Services/Report/report.service';

@Component({
  selector: 'app-workshop-progress-report-list',
  standalone: false,
  templateUrl: './workshop-progress-report-list.component.html',
  styleUrl: './workshop-progress-report-list.component.css'
})
export class WorkshopProgressReportListComponent {


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private routers: Router,
    private ApprenticeShipRPTService: ApprenticeReportServiceService,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    private http: HttpClient

  ) { }

  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public SSOLoginDataModel = new SSOLoginDataModel();
  RowAddedList: any = [];
  DistrictLisrt: any = [];
  public Table_SearchText: string = '';
  pageInTableSize: string = '50';
  startInTableIndex: number = 0;
  DistrictID: number = 0;
  FinancialYearID: number = 0;
  ZoneID: number = 0;
  _Userid: number = 0;
  public FinYearList: any = [];
  public ZoneList: any = [];
  public BeforeMonth: number = 0;
  public searchRequest = new ITIApprenticeshipWorkshopModel();

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SSOLoginDataModel.RoleID != 97) {
      this._Userid = 0;
    }
    else {
      this._Userid = this.SSOLoginDataModel.UserID
    }

    await this.GetDivisMatserDDL()
    await this.GetzonalID()
    this.GetDistrictMatserDDL();

    this.GetReportAllData();
    this.YearDropdownData('FinancialYear_IIP');
  }



  async GetDivisMatserDDL() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ZoneHindi')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ZoneList = data['Data'];
          console.log(this.ZoneList)
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


  async GetzonalID() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetZonalID(this.SSOLoginDataModel.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.SSOLoginDataModel.RoleID == 100) {

            // Get all ZoneIDs instead of just first one
            const zoneIDs = data['Data'].map((item: any) => item.DivisionID);

            // Set first one as default selected (optional)
            this.ZoneID = zoneIDs[0];

            // Filter ZoneList for ALL matching zone IDs
            this.ZoneList = this.ZoneList.filter((e: any) => zoneIDs.includes(e.ID));

            this.GetDistrictMatserDDL();
          }
          console.log(this.ZoneList);
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



  async GetReportAllData() {
 
    try {
      // this.loaderService.requestStarted();

      if (this.SSOLoginDataModel.RoleID == 97) {
        this.DistrictID = this.SSOLoginDataModel.DistrictID
      }

      let obj = {
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        RoleID: this.SSOLoginDataModel.RoleID,
        Createdby: this._Userid,
        SearchDistrictID: this.DistrictID,
        FinancialYearID: this.FinancialYearID,
        BeforeMonth: this.BeforeMonth || 0,
        ZoneID: this.ZoneID,
   
        UserID: this.SSOLoginDataModel.UserID
      };


      await this.ApprenticeShipRPTService.Get_WorkshopProgressReportAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.RowAddedList = data.Data;
            this.loadInTable();
          }
          else {
            this.RowAddedList = [];
          }
        }, (error: any) => console.error(error)
        );

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  EditData(id: number,Flag:number=0) {

    sessionStorage.setItem('WorkshopProgressReportPKID', id.toString());
    sessionStorage.setItem('Flag', Flag.toString());
    this.routers.navigate(['/Workshop-progressReport']);
    console.log(sessionStorage);
  }

  GoToReportEntryPage() {
    sessionStorage.setItem('WorkshopProgressReportPKID', '0');
    sessionStorage.setItem('Flag', '0');
    this.routers.navigate(['/Workshop-progressReport']);
  }

  async DeleteByID(id: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {


            this.loaderService.requestStarted();
            await this.ApprenticeShipRPTService.WorkshopProgressRPTDelete_byID(id).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.Data.length > 0) {
                this.toastr.success("Data has been Successfully deleted");
                this.GetReportAllData();
              }


            })
          } catch (error) {
            console.error(error)
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }

  // Paginatoin Set
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.RowAddedList.length;
  }
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.RowAddedList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.RowAddedList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }

  async GetDistrictMatserDDL() {
    try {
      if (this.SSOLoginDataModel.RoleID != 97) {


        this.loaderService.requestStarted();
        await this.commonMasterService.GetCommonMasterData('DistrictHindi', this.ZoneID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictLisrt = data['Data'];
      
          }, (error: any) => console.error(error)
          );

      } else {
        await this.commonMasterService.GetCommonMasterData('NodalDistrict', this.SSOLoginDataModel.DistrictID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictLisrt = data['Data'];
     
          }, (error: any) => console.error(error)
          );
      }
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

  ClearField()
  {
    this.DistrictID = 0;
    this.FinancialYearID = 0;
    this.BeforeMonth = 0;
    this.ZoneID = 0;
    this.GetReportAllData();

  }

  async DownloadWorkshopProgressReport() {
    try {

      if (this.SSOLoginDataModel.RoleID == 97) {
        this.DistrictID = this.SSOLoginDataModel.DistrictID
      }

      let obj = {
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        RoleID: this.SSOLoginDataModel.RoleID,
        Createdby: this._Userid,
        SearchDistrictID: this.DistrictID,
        FinancialYearID: this.FinancialYearID,
        BeforeMonth: this.BeforeMonth || 0,
        ZoneID: this.ZoneID,

        UserID: this.SSOLoginDataModel.UserID
      };




      this.loaderService.requestStarted();
      await this.reportService.GetWorkshopProgress(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("DownloadWorkshopProgressReport", data)
          if (data.State === EnumStatus.Success) {
            // this.toastr.success(data.Message);
            this.DownloadFile(data.Data)
          } else {
            this.toastr.error(data.ErrorMessage);
          }
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

  DownloadFile(FileName: string): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }
  YearDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      this.FinYearList = data['Data'] || [];
      console.log('Fin Year List:', this.FinYearList);
    });
  }
  trackByFinancialYear(index: number, item: any): number {
    return item.FinancialYearID;
  }

  // Add these properties to your component class
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sortTable(column: string, type: 'string' | 'number' | 'date' = 'string') {
    // Toggle direction if same column clicked again, else default to ascending
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const dir = this.sortDirection === 'asc' ? 1 : -1;

    this.RowAddedList.sort((a: any, b: any) => {
      let valA = a[column];
      let valB = b[column];

      if (type === 'number') {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
        return (valA - valB) * dir;
      }

      if (type === 'date') {
        // Handles dd/mm/yyyy or dd-mm-yyyy formats commonly used in Hindi/Indian date fields
        const parseDate = (val: string) => {
          if (!val) return 0;
          const parts = val.split(/[\/\-]/);
          if (parts.length === 3) {
            // assuming dd/mm/yyyy
            return new Date(+parts[2], +parts[1] - 1, +parts[0]).getTime();
          }
          return new Date(val).getTime();
        };
        valA = parseDate(valA);
        valB = parseDate(valB);
        return (valA - valB) * dir;
      }

      // default string compare
      valA = (valA || '').toString().toLowerCase();
      valB = (valB || '').toString().toLowerCase();
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }
}
