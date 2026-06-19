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
import { ITIApprenticeshipWorkshopModel } from '../../../../Models/ITI/ITIApprenticeshipWorkshopDataModel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../../../Services/Report/report.service';

@Component({
  selector: 'app-quater-workshop-report',
  standalone: false,
  templateUrl: './quater-workshop-report.component.html',
  styleUrl: './quater-workshop-report.component.css'
})
export class QuaterWorkshopReportComponent {
  public DataList: any = []
  public DistrictLisrt: any = []
  public ZoneList: any = []
  public Table_SearchText: string = '';
  public request = new ITIApprenticeshipWorkshopModel()
  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  public searchRequest = new ITIApprenticeshipWorkshopModel();
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  isError: boolean = false;
  imageSrc: string | null = null;
  public FinYearList: any = [];
  public totals: any = [];
  public _enumrole = EnumRole
  includedKeys: string[] = [
    'BeforeEstablishmentNo',
    'BeforeEstablishmentSeat',
    'BeforeStudentCount',
    'AfterEstablishmentNo',
    'AfterEstablishmentSeat',
    'AfterStudentCount',
    'QuaterIncreaseEstablishment',
    'QuaterIncreaseSeat',
    'QuaterIncreaseStudent'
  ];
  public excludedKeys = ['ID', 'CenterID', 'SemesterID', 'DistrictID', 'EndTermID', 'QuaterID', 'FinancialYearID', 'ModifyBy','CreatedBy'];
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
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    private commonMasterService: CommonFunctionService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,



  ) { }

  public SSOLoginDataModel = new SSOLoginDataModel()

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    
    await this.GetDivisMatserDDL()
    await this.GetzonalID()
    await this.GetDistrictMatserDDL()
   await this.GetReportAllData();
    this.YearDropdownData('FinancialYear_IIP');
   /* await this.calculateDynamicTotals(this.DataList);*/

  }


  async calculateDynamicTotals(data: any[]) {
    this.totals = {};

    // Initialize totals in SAME SEQUENCE
    this.includedKeys.forEach(key => {
      this.totals[key] = 0;
    });

    
    // Sum values
    data.forEach(row => {
      this.includedKeys.forEach(key => {
        const value = row[key];
        if (value !== null && value !== '' && !isNaN(value)) {
          this.totals[key] += Number(value);
        }
      });
    });
  }


  async GetReportAllData() {

    try {
      this.DataList = [];
      // this.loaderService.requestStarted();
      var UserID: number = 0
      var DistrictID: number = 0
      if (this.SSOLoginDataModel.RoleID != 97) {
        UserID = 0
        DistrictID = this.request.DistrictID

      } else {
        UserID = 0
        DistrictID = this.SSOLoginDataModel.DistrictID

      }
      let obj = {
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        RoleID: this.SSOLoginDataModel.RoleID,
        ZoneID: this.request.ZoneID,
        Createdby: UserID,
        DistrictID: DistrictID,
        QuaterID: this.request.QuaterID,
        FinancialYearID: this.request.FinancialYearID
      };



      await this.ApprenticeShipRPTService.GetQuaterProgressList(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.DataList = data.Data
             this.calculateDynamicTotals(this.DataList);
          }
          else {
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

  EditData(id: number,flag:number=0) {
      
    sessionStorage.setItem('WorkshopID', id.toString());
    sessionStorage.setItem('flag', flag.toString());
    this.routers.navigate(['/NodalWorkshopReport']);
    console.log(sessionStorage);
  }


  async DeleteByID(id: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {


            this.loaderService.requestStarted();
            await this.ApprenticeShipRPTService.QuaterListDelete(id).then((data: any) => {
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

  async DownloadQuarterlyProgressReport() {
    try {

      var UserID: number = 0
      var DistrictID: number = 0
      if (this.SSOLoginDataModel.RoleID != 97) {
        UserID = 0
        DistrictID = this.request.DistrictID

      } else {
        UserID = 0
        DistrictID = this.SSOLoginDataModel.DistrictID

      }
      let obj = {
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        RoleID: this.SSOLoginDataModel.RoleID,
        ZoneID: this.request.ZoneID,
        Createdby: UserID,
        DistrictID: DistrictID,
        QuaterID: this.request.QuaterID,
        FinancialYearID: this.request.FinancialYearID
      };


      this.loaderService.requestStarted();
      await this.reportService.GetQuarterlyProgress(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("DownloadQuarterlyProgressReport", data);
          if (data.State === EnumStatus.Success) {
            // this.toastr.success(data.Message);
            this.DownloadFile(data.Data);
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


  GoToReportEntryPage() {
    sessionStorage.setItem('WorkshopID', '0');
    sessionStorage.setItem('flag', '0');
    this.routers.navigate(['/NodalWorkshopReport']);
  }


  async GetDistrictMatserDDL() {
    try {
      if (this.SSOLoginDataModel.RoleID != 97) {


        this.loaderService.requestStarted();
        await this.commonMasterService.GetCommonMasterData('DistrictHindi', this.request.ZoneID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictLisrt = data['Data'];
            console.log(this.DistrictLisrt)
          }, (error: any) => console.error(error)
          );

      } else {
        await this.commonMasterService.GetCommonMasterData('NodalDistrict', this.SSOLoginDataModel.DistrictID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictLisrt = data['Data'];
            console.log(this.DistrictLisrt)
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
            this.request.ZoneID = data['Data'][0]['DivisionID'];
            this.ZoneList = this.ZoneList.filter((e: any) => e.ID == this.request.ZoneID)
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


  async openPdfModal(url: string): Promise<void> {
    const ext = url.split('.').pop()?.toLowerCase() || '';
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      if (this.isPdf) {
        // Fetch PDF as Blob
        const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
        if (!blob) throw new Error('Blob is undefined');
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      } else if (this.isImage) {
        // For images, no need to fetch blob — use URL directly
        this.imageSrc = url;
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }


  //openPdfModal(url: string): void {

  //  const ext = url.split('.').pop()?.toLowerCase();
  //  this.isPdf = ext === 'pdf';
  //  this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');
  //  let url1: string = '';
  //  this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
  //    url1 = window.URL.createObjectURL(blob);
  //  });
  //   
  //  this.pdfUrl = url;
  //  this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url1);  // <-- Sanitize here
  //  this.showPdfModal = true;
  //}



  ClosePopupAndGenerateAndViewPdf(): void {
    this.showPdfModal = false;
    this.safePdfUrl = null;
    this.pdfUrl = null;
    this.imageSrc = null;
    this.isPdf = false;
    this.isImage = false;
    this.isError = false;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/dummyImg.jpg';
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

  ClearField() {
    this.request.QuaterID = 0;
    this.request.DistrictID = 0;
    this.request.FinancialYearID = 0;
    this.request.ZoneID = 0;    this.request.ZoneID = 0;

    this.GetReportAllData();

  }



}
