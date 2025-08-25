import { Component, TemplateRef, ViewChild } from '@angular/core';
import { inject } from '@angular/core/testing';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ApprenticeshipReportEntity } from '../../../../Models/ITI/ApprenticeshipReportModel';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pmnam-mela-report',
  standalone: false,
  templateUrl: './pmnam-mela-report.component.html',
  styleUrl: './pmnam-mela-report.component.css'
})
export class PmnamMelaReportComponent {
  //modalService = NgbModal;
  //loaderService = LoaderService;
  public searchRequest: any = []; 
  public closeResult: string | undefined;
  public InspectExaminationCentersList: any = [];
  public DistrictLisrt: any = [];
  public ssoLoginDataModel = new SSOLoginDataModel();
  public obj = new ApprenticeshipReportEntity();
  public DistrictID: number = 0;
  public id: number = 0;
 
  public DataList: any = [];
  public Table_SearchText: string = '';
  @ViewChild('MyModel_ViewDetails') MyModel_ViewDetails!: TemplateRef<any>;

  constructor(
    private modalService: NgbModal,
    private ApprenticeReportServiceService: ApprenticeReportServiceService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private routers: Router,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient

  ) { }

  async ngOnInit() {
    this.ssoLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    const Editid = sessionStorage.getItem('PMNAM_BeforeAfterRPTEditId');
    if (Editid != undefined && parseInt(Editid) > 0) {
      this.GetReportDatabyID(parseInt(Editid));
      console.log(Editid);
    }
    this.GetAllData();
    this.GetDistrictMatserDDL();
  }


  OpenModalPopup(content: any) {
    debugger;
    this.modalService.open(content, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult);
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult);
      }
    );
  }

  async GetDistrictMatserDDL() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('NodalDistrict', this.ssoLoginDataModel.InstituteID)
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



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on the backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  CloseModalPopup(isNavigate: boolean) {
    this.modalService.dismissAll();
      this.obj = new ApprenticeshipReportEntity();
  }
  async SaveData() {
    if (this.obj.PoliticalEstablishmentscontactedNo == '' || this.obj.PrivateEstablishmentscontactedNo == '' ||
      this.obj.PoliticalEstablishmentspartNo == '' || this.obj.PrivateEstablishmentspartNo == '' ||
      this.obj.CandidatespresentMaleNo == '' || this.obj.CandidatespresentFemaleNo == '' ||
      this.obj.CandidatessselectedFemaleNo == '' || this.obj.CandidatessselectedMaleNo == '') {
      this.toastr.warning("Please Enter All Required Fields !")
      return;
    }
    debugger;
    this.obj.EndTermID = this.ssoLoginDataModel.EndTermID;
    this.obj.DepartmentID = this.ssoLoginDataModel.DepartmentID;
    this.obj.RoleID = this.ssoLoginDataModel.RoleID;
    this.obj.Createdby = this.ssoLoginDataModel.UserID;
    this.obj.InstituteID = this.ssoLoginDataModel.InstituteID
    try {
      this.loaderService.requestStarted();
      await this.ApprenticeReportServiceService.Save_PMNUM_Mela_Report(this.obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0) {
          this.toastr.success(data.Data['0'].msg);
          //setTimeout(() => {
          //  this.routers.navigate(['/PMNAM-MelaReport']);
          //}, 1300);
          this.GetAllData();
          this.CloseModalPopup(false);
          this.ClearAll();
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
  async GetReportDatabyID(ReportID: number) {

    try {
      this.loaderService.requestStarted();

      await this.ApprenticeReportServiceService.GetReportDatabyID(ReportID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            //this.DataList = data.Data
            //this.EstablishmentsRegisterNoBefore = data.Data['0'].EstablishmentsRegisterNoBefore;
            //this.NumberofSeatBefore = data.Data['0'].NumberofSeatBefore;
            //this.NumberofEmployedStudentBefore = data.Data['0'].NumberofEmployedStudentBefore;

            //this.EstablishmentsRegisterNoAfter = data.Data['0'].EstablishmentsRegisterNoAfter;
            //this.NumberofSeatAfter = data.Data['0'].NumberofSeatAfter;
            //this.NumberofEmployedStudentAfter = data.Data['0'].NumberofEmployedStudentAfter;
            this.id = data.Data['0'].ID;
          }
          else {
            // this.DataList = [];
          }

          //console.log(this.DataList)
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

  async ClearAll() {
    this.obj.PoliticalEstablishmentspartNo = '';
    this.obj.PrivateEstablishmentspartNo= '';
    this.obj.PoliticalEstablishmentscontactedNo = '';
    this.obj.PrivateEstablishmentscontactedNo = '';
    this.obj.CandidatespresentMaleNo = '';
    this.obj.CandidatespresentFemaleNo = '';
    this.obj.CandidatessselectedMaleNo = '';
    this.obj.CandidatessselectedFemaleNo = '';
    this.obj.ID = 0;
  }

  async GetAllData() {
    debugger;
    try {
      var UserID: number = 0
      if (this.ssoLoginDataModel.RoleID != 97) {
        UserID = 0
      } else {
        UserID = this.ssoLoginDataModel.UserID
      }
      this.loaderService.requestStarted();
      await this.ApprenticeReportServiceService.GetAllData(UserID, this.DistrictID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data) {
          this.DataList = data.Data;
          console.log(this.DataList);
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
  async EditData(row : any) {
 
    this.obj.PoliticalEstablishmentscontactedNo = row.PoliticalEstablishmentscontactedNo;
    this.obj.PrivateEstablishmentscontactedNo = row.PrivateEstablishmentscontactedNo;
    this.obj.PoliticalEstablishmentspartNo = row.PoliticalEstablishmentspartNo;
    this.obj.PrivateEstablishmentspartNo = row.PrivateEstablishmentspartNo;
    this.obj.CandidatespresentMaleNo = row.CandidatespresentMaleNo;
    this.obj.CandidatespresentFemaleNo = row.CandidatespresentFemaleNo;
    this.obj.CandidatessselectedMaleNo = row.CandidatessselectedMaleNo;
    this.obj.CandidatessselectedFemaleNo = row.CandidatessselectedFemaleNo;
    this.obj.ID = row.Id;
    if (this.obj.ID > 0) {
      this.OpenModalPopup(this.MyModel_ViewDetails);
    }

  }
  async DeleteData(row: any) {
    debugger;
     this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          this.obj.ID = row.Id;
          this.obj.IsActive = row.ActiveStatus == 1 ? 0 : 1;
          try {
            this.loaderService.requestStarted();
            await this.ApprenticeReportServiceService.DeleteData_Pmnam_mela_Report(this.obj).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.Data.length > 0) {
                this.toastr.success(data.Data['0'].msg);
                this.GetAllData();
                this.ClearAll();
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

  async Reset() {
    this.DistrictID = 0
    this.GetAllData()
  }

  async DownloadPMNAMReport() {
    try {
      debugger;
      var UserID: number = 0
      if (this.ssoLoginDataModel.RoleID != 97) {
        UserID = 0
      } else {
        UserID = this.ssoLoginDataModel.UserID
      }

      let obj = {
        EndTermID: this.ssoLoginDataModel.EndTermID,
        DepartmentID: this.ssoLoginDataModel.DepartmentID,
        RoleID: this.ssoLoginDataModel.RoleID,
        Createdby: UserID,
      };

      this.loaderService.requestStarted();
      await this.reportService.GetPmnam(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("DownloadPMNAMReport", data)
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
