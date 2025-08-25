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
  public Table_SearchText: string = '';
  isAllSelected = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public ssoLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITIApprenticeshipModule();
  _Userid :number =0
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

    this.GetReportAllData();
  }


  async GetReportAllData() {
    debugger;
    try {
      // this.loaderService.requestStarted();

      let obj = {
        EndTermID: this.ssoLoginDataModel.EndTermID,
        DepartmentID: this.ssoLoginDataModel.DepartmentID,
        RoleID: this.ssoLoginDataModel.RoleID,
        Createdby: this._Userid
      };


      await this.ApprenticeShipRPTService.Get_ApprenticeshipRegistrationReportAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.DataList = data.Data;
            //this.loadInTable();
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

  EditData(id: number) {

    sessionStorage.setItem('ApprenticeshipRegistrationReportPKID', id.toString());
    this.routers.navigate(['/ApprenticeshipRegistrationReport']);
    console.log(sessionStorage);
  }

  GoToReportEntryPage() {
    sessionStorage.setItem('ApprenticeshipRegistrationReportPKID', '0');
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

}
