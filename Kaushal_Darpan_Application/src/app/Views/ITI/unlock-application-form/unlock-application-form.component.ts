import { Component } from '@angular/core';
import { ItiApplicationService } from '../../../Services/ItiApplication/iti-application.service';
import { FormBuilder } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ItiApplicationDataModel, ItiDashApplicationSearchModel } from '../../../Models/ItiApplicationDataModel';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ReportService } from '../../../Services/Report/report.service';
import { ItiApplicationSearchmodel, ItiApplicationUnlockDataModel } from '../../../Models/ItiApplicationPreviewDataModel';
import { HttpClient } from '@angular/common/http';
import { ItiApplicationFormService } from '../../../Services/ItiApplicationForm/iti-application-form.service';

@Component({
  selector: 'app-unlock-application-form',
  templateUrl: './unlock-application-form.component.html',
  styleUrl: './unlock-application-form.component.css',
  standalone: false
})
export class UnlockApplicationFormComponent {
  //public ItiApplication: ItiApplicationDataModel[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new ItiApplicationUnlockDataModel()
  public searchRequest = new ItiDashApplicationSearchModel();
  public ApplicationList: any = [];
  public GenderList: any = [];
  public InstituteList: any = [];
  public DistrictList: any = [];
  public UrlStatus: number = 0; 
  public searchrequest = new ItiApplicationSearchmodel()
  public _GlobalConstants: any = GlobalConstants;
  public CategoryBlist: any = [];
  public category_CList: any = [];
  public CategoryAlist: any = [];

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

  constructor(
    private commonMasterService: CommonFunctionService, 
    private itiApplicationService: ItiApplicationService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2,  
    private route: ActivatedRoute,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private ItiApplicationFormService: ItiApplicationFormService,
  ) {}


  async ngOnInit() {
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.GetMasterData();
    // this.UrlStatus = Number(this.route.snapshot.paramMap.get('id'));
    // if (this.UrlStatus) {
    //   await this.GetAllData()
    // }
    this.GetAllData(1)
    
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

    this.searchRequest.PageNumber = this.pageNo
    this.searchRequest.PageSize = this.pageSize

    try {
      this.loaderService.requestStarted();
      this.searchRequest.UrlStatus = this.UrlStatus;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng,
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
        this.searchRequest.DepartmentID= EnumDepartment.ITI
      console.log("searchrequest",this.searchRequest)
      await this.ItiApplicationFormService.GetItiApplicationData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApplicationList = data.Data;
        console.log("ApplicationList",this.ApplicationList)

        this.totalRecord = this.ApplicationList[0]?.TotalRecords;

        this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
        
        // this.loadInTable();
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
    this.searchRequest = new ItiDashApplicationSearchModel();
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.searchRequest.UrlStatus = this.UrlStatus;
    await this.GetAllData(1);
  }

  async DownloadApplicationForm(ApplicationID: number) {
    try {
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.ITI;
      this.searchrequest.ApplicationID = ApplicationID;
      console.log("searchrequest",this.searchrequest)
      await this.reportService.GetITIApplicationFormPreview(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
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

  DownloadFile(FileName: string, DownloadfileName: any): void
  {
 
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

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

  async unlockApplication(row: any) {
    this.Swal2.Confirmation("Are you sure you want to Unlock Application?", async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.request.ApplicationID = row.ApplicationID
            this.request.UserID = this.sSOLoginDataModel.UserID
            await this.ItiApplicationFormService.UnlockApplication(this.request).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.GetAllData(1)
              this.toastr.success(data.Message)
            })
          } catch (error) {
            console.log(error);
          }
        }})
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
}


