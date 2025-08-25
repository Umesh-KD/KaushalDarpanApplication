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

@Component({
  selector: 'app-quater-workshop-report',
  standalone: false,
  templateUrl: './quater-workshop-report.component.html',
  styleUrl: './quater-workshop-report.component.css'
})
export class QuaterWorkshopReportComponent {
  public DataList: any = []
  public DistrictLisrt: any = []
  public Table_SearchText: string = '';
  public request = new ITIApprenticeshipWorkshopModel()
  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  isError: boolean = false;
  imageSrc: string | null = null;
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
    private sanitizer: DomSanitizer,
    private http: HttpClient,



  ) { }

  public SSOLoginDataModel = new SSOLoginDataModel()

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDistrictMatserDDL()
    this.GetReportAllData();
  }


  async GetReportAllData() {

    try {
      // this.loaderService.requestStarted();
      var UserID: number = 0
      if (this.SSOLoginDataModel.RoleID != 97) {
        UserID = 0
      } else {
        UserID = this.SSOLoginDataModel.UserID
      }
      let obj = {
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        RoleID: this.SSOLoginDataModel.RoleID,

        Createdby: UserID,
        DistrictID: this.request.DistrictID,
        QuaterID: this.request.QuaterID
      };



      await this.ApprenticeShipRPTService.GetQuaterProgressList(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.DataList = data.Data
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

  EditData(id: number) {
      
    sessionStorage.setItem('WorkshopID', id.toString());
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

  GoToReportEntryPage() {
    sessionStorage.setItem('WorkshopID', '0');
    this.routers.navigate(['/NodalWorkshopReport']);
  }


  async GetDistrictMatserDDL() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DistrictHindi')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictLisrt = data['Data'];
          console.log(this.DistrictLisrt)
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


}
