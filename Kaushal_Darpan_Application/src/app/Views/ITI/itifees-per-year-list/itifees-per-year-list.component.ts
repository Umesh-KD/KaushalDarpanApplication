import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ITITradeDataModels, ITITradeSearchModel } from '../../../Models/ITITradeDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { ITIFeesPerYearListSearchModel } from '../../../Models/ITI/ITIFeesPerYearList';
import { ItiFeesPerYearserviceService } from '../../../Services/ITI/ITIFeesPerYearList/iti-fees-per-yearservice.service';
import { ApplicationConfig } from '@angular/platform-browser';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../../Services/Report/report.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ITIAdminDashboardServiceService } from '../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
@Component({
  selector: 'app-itifees-per-year-list',
  templateUrl: './itifees-per-year-list.component.html',
  styleUrl: './itifees-per-year-list.component.css',
  standalone: false
})
export class ITIFeesPerYearListComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public ITITradeList: any = [];
  public CollegeID: number = 0
  searchText: string = '';
  public CollegeTypeList: any[] = [];
  public TradetblList: any[] = [];
  public TradeTypesList: any = [];
  public ITITradeSchemeList: any = [];
  public TradeData: ITITradeSearchModel[] = [];
  request = new ITITradeDataModels()
  public searchRequest = new ITIFeesPerYearListSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public IsShowGenerate: boolean = false
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  
  //end table feature default

  public isprofile: number = 0;

  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ItiFeesPerYearListService: ItiFeesPerYearserviceService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private Swal2: SweetAlert2,
    private ITIAdminDashboardService: ITIAdminDashboardServiceService,
    private sweetAlert2: SweetAlert2,
  ) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if ((this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || EnumRole.Principal_NCVT)) {
      await this.CheckProfileStatus();
      if (this.isprofile == 0) {
        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
          window.open("/ITIUpdateCollegeProfile?id=" + this.sSOLoginDataModel.InstituteID, "_Self")
        }, 'OK', false);

      }
    }
    
    this.GetTradeTypesList();
    this.GetTradeSchemeDDL();
    await this.GetAll();
  }

  async GetTradeTypesList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTradeTypesList().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeTypesList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetTradeSchemeDDL() {
    const MasterCode = "IITTradeScheme";
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAll() {
    try {
      this.loaderService.requestStarted();
      //this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      await this.ItiFeesPerYearListService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TradetblList = data['Data'];
          this.IsShowGenerate = this.TradetblList.every((e: any) => e.FeePdf == 1)


          console.log(this.TradetblList, 'TradetblList')
          this.loadInTable();
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

  onCancel(): void {
    this.searchRequest.TradeName = '';
    this.searchRequest.TradeCode = '';
  }

  onResetCancel(): void {
    this.onCancel();
  }

  onEdit(Id: number): void {

    // Navigate to the edit page with the institute ID
    this.Router.navigate(['/ititradeUpdate', Id]);
  }



  async btnDeleteOnClick(TradeId: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
            await this.ItiFeesPerYearListService.DeleteDataByID(TradeId, this.request.ModifyBy)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
      });
  }

  exportToExcel(): void {
    try {
      this.loaderService.requestStarted();
      //this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.ItiFeesPerYearListService.ItiFeesPerYearListDownload(this.searchRequest)
        .then((data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          debugger
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
            link.download = 'StudentMarksheet.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.pdf`;
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
    this.paginatedInTableData = [...this.TradetblList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.TradetblList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.TradetblList.length;
  }



  async GenerateOTP_lockfee() {


    /*   const isvalid = this.TradetblList.every*/


    if (this.TradetblList.filter(function (x: any) { return x.FeeStatus == 'Not Entered' }).length == this.TradetblList.length) {
      this.toastr.error("Please enter at least one Trade fee");
      return;
    }

    if (this.TradetblList.filter(function (x: any) { return x.ImcfeeStatus == 'Not Entered' && x.IsImc==1}).length == this.TradetblList.length) {
      this.toastr.error("Please enter at least one IMC Trade fee");
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to Lock ? <br/> After Lock you cannot edit fee.",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
            this.openOTP()
        }
      });
  }

  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.lockfee()
    })
  }

  async lockfee() {
    try {
            //Show Loading
            this.CollegeID = this.TradetblList[0].CollegeId
            this.loaderService.requestStarted();
            await this.ItiFeesPerYearListService.unlockfee(this.CollegeID, this.request.ModifyBy, 1)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.GetAll()
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
}
