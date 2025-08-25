import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { BTERIMCAllocationDataModel, BTERIMCAllocationSearchModel } from '../../../../Models/BTERIMCAllocationDataModel';
import { IMCManagementAllotmentService } from '../../../../Services/BTER/IMC-Management-Allotment/imc-management-allotment.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { IMCAllocationService } from '../../../../Services/ITI/IMC-Allocation/imc-allocation.service';
import { ITIAdminDashboardServiceService } from '../../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';

@Component({
  selector: 'app-imc-allocation-list',
  standalone: false,

  templateUrl: './imc-allocation-list.component.html',
  styleUrl: './imc-allocation-list.component.css'
})
export class IMCAllocationListComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  request = new BTERIMCAllocationDataModel()
  public searchRequest = new BTERIMCAllocationSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public IMCAllotedList: any[] = [];
  public IsAddNewAllotment: boolean = false;
  modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  closeResult: string | undefined;
  public isprofile: number = 0;

  public DateConfigSetting: any = [];
  AllotmentKey: string = "";
  constructor(
    private commonMasterService: CommonFunctionService,
    private ReportService: ReportService,
    private Router: Router,
    private IMCManagementAllotmentService: IMCAllocationService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private appsettingConfig: AppsettingService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private ITIAdminDashboardService: ITIAdminDashboardServiceService,
    private sweetAlert2: SweetAlert2

  ) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if ((this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || EnumRole.Principal_NCVT)) {
    await  this.CheckProfileStatus();
      if (this.isprofile == 0) {
        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
          window.open("/ITIUpdateCollegeProfile?id=" + this.sSOLoginDataModel.InstituteID, "_Self")
        }, 'OK', false);

      }
    }

    this.searchRequest.TradeLevel = parseInt(this.route.snapshot.paramMap.get('id'));

    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;

    //alert(this.searchRequest.TradeLevel);
    await this.getIMCAllotedList();
    await this.GetDateConfig();
    //this.AllotmentKey = 'IMC ALLOTMENT REPORTING';
  }

  async GetDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      //CourseTypeId: this.searchRequest.CourseTypeId,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      Key: "IMC ALLOTMENT,IMC ALLOTMENT CATEGORY,IMC ALLOTMENT ALL",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
        if (this.DateConfigSetting[0]['IMC ALLOTMENT CATEGORY'] == 1) {
          this.AllotmentKey = 'IMC ALLOTMENT CATEGORY';
        }
        else if (this.DateConfigSetting[0]['IMC ALLOTMENT ALL'] == 1) {
          this.AllotmentKey = 'IMC ALLOTMENT ALL';
        }


        console.log(this.DateConfigSetting[0]['GENERATE MERIT']);

      }, (error: any) => console.error(error)
      );
  }

  async getIMCAllotedList() {
    try { 
      this.loaderService.requestStarted();
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      await this.IMCManagementAllotmentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.IMCAllotedList = data['Data'];
          console.log(this.IMCAllotedList, "IMCAllotedList")
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

  onResetCancel(): void {
    this.searchRequest.ApplicationID = 0;
    //this.getIMCAllotedList();
  }

  async AddNewAllotment(content: any) {
    //alert(ID)
    this.IsAddNewAllotment = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
    });

  }


  CloseAddNewAllotment() {
    this.modalService.dismissAll();
  }

  async RevertAllotment(ApplicationID: number, CollegeTradeId: number, AllotedCategory: string) {
    //alert(ApplicationID);
    this.request.ApplicationID = ApplicationID;
    this.request.CollegeTradeID = CollegeTradeId;
    // this.request.AllotedCategory = AllotedCategory;
    //alert(this.request.ApplicationID);
    //alert(this.request.CollegeTradeID);

    if (AllotedCategory.includes(' ')) {
      this.request.SeatMetrixColumn = AllotedCategory.replace(/ /g, '_');
    }
    else {
      this.request.SeatMetrixColumn = AllotedCategory;
    }

    //alert(this.request.AllotedCategory);
    const confirmationMessage = 'Are you sure you want to revert this application ?'

    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {

        try {
          this.loaderService.requestStarted();
          this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
          this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
          this.request.OpenCategory = '';
          await this.IMCManagementAllotmentService.RevertAllotments(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              // this.IMCAllotedList = data['Data'];
              this.getIMCAllotedList();
              console.log(this.IMCAllotedList, "IMCAllotedList")
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

    })
  }



  async GetAllotmentReceipt(AllotmentId: any) {
    ;
    try {
      this.loaderService.requestStarted();
      await this.IMCManagementAllotmentService.GetAllotmentReceipt(AllotmentId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'IMCReportingReceipt' + AllotmentId + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
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
  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.AllotmentReceipt + "/" + FileName; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
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

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      await this.ITIAdminDashboardService.GetProfileStatus(this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.isprofile = data['Data'][0]['IsProfile'];

          
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

  // Generates the router link array for IMC Allocation page
  // based on the selected TradeLevel (e.g., "8th", "10th", "12th")

  getIMCLink() {
    return ['/ITIIMCAllocationList' + this.searchRequest.TradeLevel + 'th', this.searchRequest.TradeLevel];
  }

}

