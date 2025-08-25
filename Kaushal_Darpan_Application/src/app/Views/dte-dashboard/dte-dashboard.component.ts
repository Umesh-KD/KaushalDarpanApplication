import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants, EnumStatus ,EnumDepartment} from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { AppsettingService } from '../../Common/appsetting.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { DTEDashboardServiceService } from '../../Services/DTE_Dashboard/dte-dashboard-service.service';
import { DTEApplicationDashboardDataModel, DTEDashboardModel } from '../../Models/DTEApplicationDashboardDataModel';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { MenuService } from '../../Services/Menu/menu.service';

@Component({
    selector: 'app-dte-dashboard',
    templateUrl: './dte-dashboard.component.html',
    styleUrls: ['./dte-dashboard.component.css'],
    standalone: false
})
export class DTEDashboardComponent {

  public _GlobalConstants: any = GlobalConstants;

  public Message: string = '';
  public zippath: any;
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new DTEApplicationDashboardDataModel();
  public DTEApplicationDashboardList: DTEDashboardModel[] = [];
  public lstAcedmicYear: any;
  public ApplicationList: any = []
  public _EnumDepartment = EnumDepartment;
  public IsShowDashboard: boolean = false;
  //Profile View Variables Pawan
  public ProfileLists: any = {};
  //Profile View Variables Pawan

  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  private userDataSubscription!: Subscription;
  constructor(private commonMasterService: CommonFunctionService,
    private dteDashboardService: DTEDashboardServiceService,
    private menuService: MenuService,
    private http: HttpClient,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: ActivatedRoute, private commonFunctionService: CommonFunctionService, private modalService: NgbModal,
    public appsettingConfig: AppsettingService, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {
    this.userDataSubscription = this.commonFunctionService.sSOLoginDataModel$.subscribe(
      async (data) => {
        this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
        await this.GetDTEDashboard();
        //this.GetAllApplication();
      }
    );
    this.GetAcedmicYearList();
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  async exportToExcel() {
    await this.GetAllApplication();
    const unwantedColumns = [
       'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
       'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.ApplicationList.map((item: any) => {
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
    XLSX.writeFile(wb, 'DTEApplicationData.xlsx');
  }

  async GetAcedmicYearList() {
    try {
      this.loaderService.requestStarted();

      await this.menuService.GetAcedmicYearList(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.DepartmentID)
        .then((AcedmicYear: any) => {
          AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
          this.lstAcedmicYear = AcedmicYear['Data'][0];
          //this.loaderService.requestEnded();
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);

    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 10);
    }
  }

  //async exportDocumentsToExcel() {
  //  try {
  //    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.searchRequest.FinancialYearID = this.lstAcedmicYear.YearName;
  //    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

  //    this.loaderService.requestStarted();
  //    await this.dteDashboardService.DownloadZipFolder(this.searchRequest);
  //  } catch (ex) {
  //    console.error('Error exporting zip file:', ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async exportDocumentsToExcel() {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.FinancialYearID = this.lstAcedmicYear.YearName;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      this.loaderService.requestStarted();
      await this.dteDashboardService.DownloadZipFolder(this.searchRequest)
        .then((response: any) => {
          debugger;
          const contentType = response?.headers.get('Content-Type');
          //
          if (contentType === 'application/zip') {//1.
            // Extract filename from header
            const contentDisposition = response?.headers.get('Content-Disposition');
            let fileName = 'Students.zip';
            if (contentDisposition) {
              const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (match && match[1]) {
                fileName = match[1].replace(/['"]/g, '');
              }
            }
            // Download PDF
            const blob = response?.body as Blob;
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(objectUrl);

          } else if (contentType?.includes('text/plain')) {//2.
            // Handle plain text (like errors or "No data")
            const reader = new FileReader();
            reader.onload = () => {
              //load text
              const message = reader.result as string;
              this.toastr.error(message);
            };
            //read text
            reader.readAsText(response?.body as Blob);
          } else {
            //
            this.toastr.error('Unexpected content type received.');
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `Documents_${timestamp}.${extension}`;
  }

  async GetAllApplication() {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.loaderService.requestStarted();
      await this.dteDashboardService.GetAllApplication(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApplicationList = data.Data;
        console.log(this.ApplicationList)
      }, (error: any) => console.error(error))
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

  async GetDTEDashboard()
  {
    
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
/*    (this.searchRequest as any).InstituteID = this.sSOLoginDataModel.InstituteID;*/
    this.DTEApplicationDashboardList = [];
    try {
      this.loaderService.requestStarted();
      await this.dteDashboardService.GetDTEDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DTEApplicationDashboardList = data['Data'];
            console.log(this.DTEApplicationDashboardList,"DTEApplicationDashboardList")
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


}
