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
import { ReportService } from '../../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIApprenticeshipWorkshopModel } from '../../../../Models/ITI/ITIApprenticeshipWorkshopDataModel';

@Component({
  selector: 'app-pmnam-mela-report-before-after-list',
  standalone: false,
  templateUrl: './pmnam-mela-report-before-after-list.component.html',
  styleUrl: './pmnam-mela-report-before-after-list.component.css'
})
export class PMNAMMelaReportBeforeAfterListComponent {

  public DataList: any = []
  public Table_SearchText: string = '';
  public DistrictList: any = []
  public paginatedInTableData: any[] = [];
  public currentInTablePage: number = 1;
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  pageInTableSize: string = '50';
  startInTableIndex: number = 0;
  _Userid: number = 0;
  public FinYearList: any = [];
  formData: any = {
    FinancialYearID: 0  
  };
  public request = new ITIApprenticeshipWorkshopModel()

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
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    private http: HttpClient


  ) { }

  public SSOLoginDataModel = new SSOLoginDataModel()

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    if (this.SSOLoginDataModel.RoleID != 97) {
      this._Userid = 0;
    }
    else {
      this._Userid = this.SSOLoginDataModel.UserID
    }
    await this.GetDistrictMatserDDL()
    await this.YearDropdownData('FinancialYear_IIP');

    this.GetReportAllData();
  }


  async GetReportAllData() {
    debugger;
    try {
     // this.loaderService.requestStarted();
      let obj = {
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        RoleID: this.SSOLoginDataModel.RoleID,
        Createdby: this._Userid,
        DistrictID: this.request.DistrictID,
        FinancialYearID: this.request.FinancialYearID,
        BeforeMonth: this.request.BeforeMonth || 0
      };
      await this.ApprenticeShipRPTService.GetPMNAM_BeforeAfterAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.DataList = data.Data;
            this.loadInTable();
          }
          else
          {
            this.DataList = [];
          }
        
          console.log(this.DataList)
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
    
  async GetDistrictMatserDDL() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DistrictHindi')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
          console.log('District List',this.DistrictList)
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

  EditData(id: number) {

    sessionStorage.setItem('PMNAM_BeforeAfterRPTEditId', id.toString());
    this.routers.navigate(['/PMNAM-MelaReportBeforeAfter']);
    console.log(sessionStorage);
  }


  async DeleteByID(id: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {


            this.loaderService.requestStarted();
            await this.ApprenticeShipRPTService.PMNAM_report_DeletebyID(id).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.Data.length > 0)
              {
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

  GoToReportEntryPage() {
    sessionStorage.setItem('PMNAM_BeforeAfterRPTEditId', '0');
    this.routers.navigate(['/PMNAM-MelaReportBeforeAfter']);
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
    this.totalInTableRecord = this.DataList.length;
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
    this.paginatedInTableData = [...this.DataList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.DataList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  

  async DownloadPmnamMelaReport() {
    try {
      debugger;
      let obj = {
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        RoleID: this.SSOLoginDataModel.RoleID,
        Createdby: this._Userid,
      };
      this.loaderService.requestStarted();
      await this.reportService.GetPmnamMela(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("DownloadPmnamMelaReport", data)
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

  // trackBy for better performance
  trackByFinancialYear(index: number, item: any): number {
    return item.FinancialYearID;
  }



}
