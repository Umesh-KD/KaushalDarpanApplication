import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { BterMeritSearchModel } from '../../../Models/BterMeritDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { BterMeritService } from '../../../Services/BterMerit/bter-merit.service';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bter-merit',
  templateUrl: './bter-merit.component.html',
  styleUrl: './bter-merit.component.css',
  standalone: false
})

export class BterMeritComponent implements OnInit {
  isSearchClicked: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new BterMeritSearchModel()
  public GenderList: any = [];
  public CategoryAlist: any = [];
  public MaritMasterList: any = [];
  public MeritData: any = [];
  public Table_SearchText: string = '';
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public MeritDataExcel: any = [];
  public CourseTypeList: any = []

  constructor(
    private commonMasterService: CommonFunctionService, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2,  
    private route: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private bterMeritService: BterMeritService,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetMasterData();
    this.searchRequest.DepartmentId = EnumDepartment.BTER;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];
        }, (error: any) => console.error(error)
      );

      await this.commonMasterService.GetCommonMasterData("ITIMerit").
        then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MaritMasterList = data.Data;
      })

      await this.commonMasterService.GetStreamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseTypeList = data['Data'];
        }, error => console.error(error));
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

  async onSearch(i: any) {
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

    if(this.searchRequest.MeritMasterId === 0 || this.searchRequest.CourseType === 0){
      this.toastr.error("Please select Merit Master and Class.");
      return
    }
    try {
      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize

      this.loaderService.requestStarted();
      await this.bterMeritService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MeritData = data.Data;
          this.totalRecord = this.MeritData[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
          if (this.MeritData[0].IsPublished != true) {
            this.isSearchClicked = true;
          }
          
      }, (error: any) => console.error(error))
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

  async ResetSearch() {
    this.searchRequest = new BterMeritSearchModel();
    this.searchRequest.DepartmentId = EnumDepartment.BTER;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.onSearch(1);
  }

  async generateMerit () {
    try {
      this.loaderService.requestStarted();
      await this.bterMeritService.GenerateMerit(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State == EnumStatus.Success){
            this.toastr.success(data.Data[0].Column2);
            this.onSearch(1);
          } else {
            this.toastr.error(data.ErrorMessage);
          }
      }, (error: any) => console.error(error))
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

  async publishMerit () {
    try {
      this.loaderService.requestStarted();
      await this.bterMeritService.PublishMerit(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State == EnumStatus.Success){
            this.toastr.success(data.Data[0].Column2);
            this.onSearch(1);
          } else {
            this.toastr.error(data.ErrorMessage);
          }
      }, (error: any) => console.error(error))
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

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.onSearch(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.MeritData[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.onSearch(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.onSearch(3)
    }
  }


  async exportExcelData() {
    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return
    }
    try {
      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.bterMeritService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success){
            this.MeritDataExcel = data.Data;

            const unwantedColumns = [
              'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 
              'Id', 'Status', 'RemarkForStatus', 'FeePdf', 'RTS', 'TotalRecords', 'MeritMasterId', 'AcademicYearID',
              'DepartmentId', 'PublishBy', 'PublishIP', 'Class'
            ];
            const filteredData = this.MeritDataExcel.map((item: { [x: string]: any; }) => {
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
            XLSX.writeFile(wb, 'BterMeritList.xlsx');

            this.searchRequest = new BterMeritSearchModel()
          } else {
            this.toastr.error(data.ErrorMessage);
          }
      }, (error: any) => console.error(error))
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
}
