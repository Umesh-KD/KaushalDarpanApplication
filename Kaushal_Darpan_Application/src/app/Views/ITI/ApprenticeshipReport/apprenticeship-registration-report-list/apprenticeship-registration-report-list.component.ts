import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ApprenticeshipEntry } from '../../../../Models/ITI/ApprenticeshipReportModel';
import { MatSelectChange } from '@angular/material/select';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ReportService } from '../../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { ITIApprenticeshipModule } from '../../ITI-Apprenticeship/iti-apprenticeship/iti-Apprenticeship.module';

@Component({
  selector: 'app-apprenticeship-registration-report-list',
  standalone: false,
  templateUrl: './apprenticeship-registration-report-list.component.html',
  styleUrl: './apprenticeship-registration-report-list.component.css'
})
export class ApprenticeshipRegistrationReportList {
  public TradeList: any = [];
  public DataList: any = [];
  public FinYearList: any = [];
  public DistrictLisrt: any = [];
  public ZoneList: any = [];
  public Table_SearchText: string = '';
  isAllSelected = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public ssoLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITIApprenticeshipModule();
  _Userid: number = 0
  startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public totalInTableRecord: number = 0;
  public currentInTablePage: number = 1;
  public paginatedInTableData: any[] = [];
  pageInTableSize: string = '50';
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public totals: any = [];
  public totalInTablePage: number = 0;
  public FinancialYearID:number=0
  public MonthID:number=0
  public ZoneID:number=0
  public DistrictID:number=0
  public TypeID:number=0
  includedKeys: string[] = [
    'NumberofTrainees',
    '__SKIP_Nameofapprentices__',
    'Numberofapprentices',
  

  ];
  Object = Object;
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
    private reportService: ReportService,
    private http: HttpClient,
    private CommonService: CommonFunctionService,
    private Swal2: SweetAlert2,
  ) { }

  
  async ngOnInit() {
   
    this.ssoLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    

    if (this.ssoLoginDataModel.RoleID != 97) {
      this._Userid = 0;
    }
    else {
      this._Userid = this.ssoLoginDataModel.UserID
    }
    await this.GetDivisMatserDDL()
    await this.GetzonalID()
    this.GetDistrictMatserDDL();
 await   this.GetReportAllData();
    this.YearDropdownData('FinancialYear_IIP');
    await this.calculateDynamicTotals(this.DataList);
  }

  async calculateDynamicTotals(data: any[]) {
    this.totals = {};

    // Initialize totals in SAME SEQUENCE
    this.includedKeys.forEach(key => {
      this.totals[key] = '';
    });

    // Sum values
    data.forEach(row => {
      this.includedKeys.forEach(key => {

        // Skip placeholder column
        if (key.startsWith('__SKIP__')) return;

        const value = row[key];
        if (value !== null && value !== '' && !isNaN(value)) {
          this.totals[key] = (this.totals[key] || 0) + Number(value);
        }
      });
    });
  }


  async GetReportAllData() {
    debugger;
    try {
      // this.loaderService.requestStarted();
      if (this.ssoLoginDataModel.RoleID == 97) {
        this.DistrictID = this.ssoLoginDataModel.DistrictID
      }

      let obj = {
        EndTermID: this.ssoLoginDataModel.EndTermID,
        DepartmentID: this.ssoLoginDataModel.DepartmentID,
        RoleID: this.ssoLoginDataModel.RoleID,
        Createdby: this._Userid,
        FinancialYearID: this.FinancialYearID,
        MonthID: this.MonthID,
        TypeID: this.TypeID,
        ZoneID: this.ZoneID,
        DistrictID: this.DistrictID,


      };


      await this.ApprenticeShipRPTService.Get_ApprenticeshipRegistrationReportAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.DataList = data.Data;
            //this.loadInTable();
             this.calculateDynamicTotals(this.DataList);
          }
          else {
            this.DataList = [];
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

    sessionStorage.setItem('ApprenticeshipRegistrationReportPKID', id.toString());
    sessionStorage.setItem('Flag', Flag.toString());
    this.routers.navigate(['/ApprenticeshipRegistrationReport']);
    console.log(sessionStorage);
  }

  GoToReportEntryPage() {
    sessionStorage.setItem('ApprenticeshipRegistrationReportPKID', '0');
    sessionStorage.setItem('Flag', '0');
    this.routers.navigate(['/ApprenticeshipRegistrationReport']);
  }


  async DeleteByID(id: number) {
    debugger;
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {


            this.loaderService.requestStarted();
            await this.ApprenticeShipRPTService.ApprenticeshipRegistrationRPTDelete_byID(id).then((data: any) => {
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

  async DownloadApprenticeshipReport() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetApprenticeship(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("DownloadApprenticeshipReport", data)
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
    this.CommonService.GetCommonMasterData(MasterCode).then((data: any) => {
      this.FinYearList = data['Data'] || [];
      console.log('Fin Year List:', this.FinYearList);
    });
  }
  trackByFinancialYear(index: number, item: any): number {
    return item.FinancialYearID;
  }

  async Reset() {

  }

  async GetDistrictMatserDDL() {
    try {
      if (this.ssoLoginDataModel.RoleID != 97) {


        this.loaderService.requestStarted();
        await this.CommonService.GetCommonMasterData('DistrictHindi', this.ZoneID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictLisrt = data['Data'];

          }, (error: any) => console.error(error)
          );

      } else {
        await this.CommonService.GetCommonMasterData('NodalDistrict', this.ssoLoginDataModel.DistrictID)
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



  async GetDivisMatserDDL() {
    try {

      this.loaderService.requestStarted();
      await this.CommonService.GetCommonMasterData('ZoneHindi')
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
      await this.CommonService.GetZonalID(this.ssoLoginDataModel.UserID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.ssoLoginDataModel.RoleID == 100) {
            this.ZoneID = data['Data'][0]['DivisionID'];
            this.ZoneList = this.ZoneList.filter((e: any) => e.ID == this.ZoneID)
            this.GetDistrictMatserDDL()
          }
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
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.DataList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }

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
}
