import { Component, ViewChild } from '@angular/core';
import { ItiApplicationService } from '../../../Services/ItiApplication/iti-application.service';
import { FormBuilder } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ItiApplicationDataModel, ItiDashApplicationSearchModel } from '../../../Models/ItiApplicationDataModel';
import { EnumDepartment, EnumMessageType, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ReportService } from '../../../Services/Report/report.service';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { HttpClient } from '@angular/common/http';
//import { ViewApplicationComponent } from '../../BTER/bter-application/bter-application.component';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { DTEDashApplicationSearchModel } from '../../../Models/ApplicationFormDataModel';
import { DTEDashboardServiceService } from '../../../Services/DTE_Dashboard/dte-dashboard-service.service';
import { NotifyStudentModel } from '../../../Models/DashboardCardModel';
import { StudentVerificationListService } from '../../../Services/StudentVerificationList/student-verification-list.service';
import { ViewApplicationComponent } from '../../BTER/application-view/application-view.component';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { ApplicationMessageDataModel } from '../../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';


@Component({
  selector: 'app-deficiency-application',
  templateUrl: './deficiency-application.component.html',
  styleUrls: ['./deficiency-application.component.css'],
  standalone: false
})
export class DeficiencyApplicationComponent {
  //public ItiApplication: ItiApplicationDataModel[] = [];
  public messageModel = new ApplicationMessageDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  Requestdata = new NotifyStudentModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new ItiApplicationDataModel()
  public searchRequest = new DTEDashApplicationSearchModel();
  public ApplicationList: any = [];
  public GenderList: any = [];
  public InstituteList: any = [];
  public AppID: number = 0;
  public DistrictList: any = [];
  public UrlStatus: string = '';
  public searchrequest = new ItiApplicationSearchmodel()
  public _GlobalConstants: any = GlobalConstants;
  public CategoryBlist: any = [];
  public category_CList: any = [];
  public CategoryAlist: any = [];
  public AllSelect: boolean = false;

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
  //end table feature default

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  sortColumn: string = "";
  sortOrder: string = "";
  @ViewChild('ViewAppModal') childComponent!: ViewApplicationComponent;

  constructor(
    private commonMasterService: CommonFunctionService,
    private itiApplicationService: ItiApplicationService,
    private ApplicationService: DTEDashboardServiceService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private route: ActivatedRoute,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private smsMailService: SMSMailService,
    private studentVerificationListService: StudentVerificationListService,
    private encryptionService: EncryptionService,
    private routers: Router
  ) { }


  async ngOnInit() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.GetMasterData();
    this.UrlStatus = "total-deficiency";
    if (this.UrlStatus) {
      await this.GetAllData(1)
    }
  }



  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.ApplicationList) {
      item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }

  openViewApplicationPopup(ApplicationID: number, SSOID: string) {
    
    this.childComponent.ApplicationID = ApplicationID;
    this.childComponent.SSOID = SSOID;
    this.childComponent.OpenViewApplicationPopup();
   
  }

  async DownloadApplicationForm(ApplicationID: number, FolderName: string) {
    try {
      debugger
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.BTER;
      this.searchrequest.ApplicationId = ApplicationID;
      console.log("searchrequest", this.searchrequest)
      await this.reportService.GetApplicationFormPreview1(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download', FolderName);
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

 

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList);
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.InstituteMaster(this.searchRequest.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteList = data.Data;
          console.log(this.InstituteList)
        }, (error: any) => console.error(error))

      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data.Data;
          console.log(this.DistrictList)
        }, (error: any) => console.error(error))

      await this.commonMasterService.GetCommonMasterDDLByType('CategoryB')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryBlist = data['Data'];
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterDDLByType('Category_C')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.category_CList = data['Data'];
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
  async GetAllData(i: any) {

    console.log("i", i);
    if (i == 1) {
      this.pageNo = 1;
    } else if (i == 2) {
      this.pageNo++;
    } else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    } else {
      this.pageNo = i;
    }

    try {

      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize

      this.searchRequest.SortColumn = this.sortColumn;
      this.searchRequest.SortOrder = this.sortOrder;

      this.loaderService.requestStarted();
      this.searchRequest.UrlStatus = this.UrlStatus;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng,
        this.searchRequest.DepartmentID = EnumDepartment.BTER;
      console.log("searchrequest", this.searchRequest)
      await this.ApplicationService.GetDashApplicationData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApplicationList = data.Data;

        this.totalRecord = this.ApplicationList[0]?.TotalRecords;

        this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        console.log("ApplicationList", this.ApplicationList)
        this.loadInTable();
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

  async ResetData() {
    this.searchRequest = new DTEDashApplicationSearchModel();
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.searchRequest.UrlStatus = this.UrlStatus;
    await this.GetAllData(0);
  }

  async DownloadApplicationForm111(ApplicationID: number, FolderName: string) {
    try {
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.ITI;
      this.searchrequest.ApplicationID = ApplicationID;
      console.log("searchrequest", this.searchrequest)
      await this.reportService.GetITIApplicationForm(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download', FolderName);
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

 
  DownloadFile(FileName: string, DownloadfileName: any, FolderName: string): void {

    //const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + FolderName + "/" + FileName;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ApplicationList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.ApplicationList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.ApplicationList.length;
  }
  // (replace org. list here)
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  // end table feature

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetAllData(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.ApplicationList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetAllData(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetAllData(3)
    }
  }

  sortData(sortColumn: string) {
    this.sortColumn = sortColumn;
    this.sortOrder = this.sortOrder == "" ? "ASC" : (this.sortOrder == "ASC" ? "DESC" : "ASC");
    this.GetAllData(1);
  }



  async NotifyCandidate() {
    this.Requestdata.List = this.ApplicationList.filter((e: any) => e.Selected == true)
    debugger

    if (this.Requestdata.List.length > 0) {
      // this.Requestdata.AcademicYear = this.sSOLoginDataModel.DepartmentID;
      this.Requestdata.AcademicYear = this.sSOLoginDataModel.FinancialYearID;
      this.Requestdata.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Requestdata.UserID = this.sSOLoginDataModel.UserID;
   
      console.log("this.RequestData", this.Requestdata)
      this.Swal2.Confirmation("Do You want To Notify ?",
        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            // Save Reaquest
            await this.studentVerificationListService.NotifyStudent(this.Requestdata)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.toastr.success('Applicant Notified Successfully');
                  debugger
                  let ApplicationList = this.Requestdata.List.map(item => item.ApplicationID);
                  ApplicationList.forEach(appId => {
                    this.messageModel.ApplicationDetails?.push({ ApplicationID: appId });
                  });
                  this.messageModel.MessageType = EnumMessageType.Bter_NotifyCandidateDeficiency;
                  // Get the mat-select element by ID or class
                  const matSelect = document.querySelector('#mat-select-0');
                  
                  // Get the selected value text from within the span
                  const selectedValue = matSelect?.querySelector('.mat-mdc-select-value-text span')?.textContent;
                  this.messageModel.Scheme = selectedValue??"";
                  this.smsMailService.SendApplicationMessage(this.messageModel)
                    .then((data: any) => {
                      data = JSON.parse(JSON.stringify(data));
                      if (data.State == EnumStatus.Success) {
                        this.toastr.success('Message sent successfully');
                      } else {
                        this.toastr.warning('Something went wrong');
                      }
                    }, error => console.error(error));
                  this.GetAllData(1);
                  this.AllSelect = false
                  this.Requestdata.List = [];
                }
                else {
                  this.toastr.error('Something went wrong');
                  console.log(data.Message);
                }
              },
                (error: any) => {
                  console.error(error)
                });
          }
        });
    }
    else {
      this.toastr.error('Please Select Student For Notify');
    }
  }
  async Onrouting(ApplicationID: number) {

    if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER) {
      this.AppID = ApplicationID
      await this.routers.navigate(['/documentationscrutiny'],
        { queryParams: { ApplicationID: this.encryptionService.encryptData(this.AppID) ,key:1} }
      );


    } else {
      this.routers.navigate(['/ItiDocumentScrutiny'], {
        queryParams: { AppID: ApplicationID }
      });
    }
  }
}

