import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeatIntakeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../Models/CommonMasterDataModel';
import { EnumCourseType, EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { BTERSeatsDistributionsService } from '../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { BTERCollegeBranchModel, BTERSeatsDistributionsDataModels } from '../../../Models/BTER/BTERSeatsDistributions';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { PublicInfoDataModel } from '../../../Models/PublicInfoDataModel';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-list-public-info',
  templateUrl: './list-public-info.component.html',
  styleUrls: ['./list-public-info.component.css'],
  standalone: false
})
export class ListPublicInfoComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public PublicInfoFormGroup!: FormGroup;
  public searchRequest = new SeatIntakeSearchModel()
  public DistrictList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel()
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ItiTradeListAll: any = []
  public ItiCollegesListAll: any = []
  public ManagmentTypeList: any = [];
  public InstituteCategoryList: any = [];
  public ITITradeSchemeList: any = [];
  public ITIRemarkList: any = [];
  public SanctionedList: any = [];
  public SeatIntakeDataList: any = [];
  public Table_SearchText: string = '';
  public request = new PublicInfoDataModel()
  public CollegesListAll: any = [];
  public BranchList: any = [];
  public SeatIntakeDataExcel: any = [];

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  BranchMapKeyEng: string = "COLLEGE BRANCH MAPPING";
  BranchMapKeyNonEng: string = "";
  BranchMapKeyLatEng: string = "";


  public DateConfigSetting: any = [];



  public PublicInfoList: any = []

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
  public searchRequestType = new BTERSeatsDistributionsDataModels();
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private SeatsDistributionsService: BTERSeatsDistributionsService,
    private commonMasterService: CommonFunctionService,
    private routers: ActivatedRoute,
    public appsettingConfig: AppsettingService,  

  ) { }

  async ngOnInit() {

    this.PublicInfoFormGroup = this.formBuilder.group(
      {
        PublicInfoType: [''],
        DescriptionEn: [''],
        DescriptionHi: [''],
        LinkUrl: ['']
      });

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng
    this.request.CreatedBy = this.SSOLoginDataModel.UserID;
    this.request.IPAddress = "";
    this.request.AcademicYearId = this.SSOLoginDataModel.FinancialYearID;
    this.request.DepartmentId = this.SSOLoginDataModel.DepartmentID;
    this.onSearch(1);
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
    try {
      this.loaderService.requestStarted();
      this.request.Actoin = 'LIST';
      this.request.PageNumber = this.pageNo
      this.request.PageSize = this.pageSize
      await this.commonMasterService.PublicInfo(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.PublicInfoList = data.Data;
            this.totalRecord = this.PublicInfoList[0]?.TotalRecords;
            this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
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

  async onReset() {
    
    this.onSearch(1)
    
  }

  async DeleteById(PublicInfoId: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.request.Actoin = "DELETE";
            this.request.PublicInfoId = PublicInfoId;
            this.loaderService.requestStarted();
            await this.commonMasterService.PublicInfo(this.request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.request.PublicInfoId = 0;
                  this.onSearch(1);
                } else {
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
      });
  }

  async ActiveById(PublicInfoId: number, Status: boolean) {

    try {
      this.request.Actoin = "ACTIVE";
      this.request.PublicInfoId = PublicInfoId;
      this.request.ActiveStatus = Status ? false : true;
      this.loaderService.requestStarted();
      await this.commonMasterService.PublicInfo(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.request.PublicInfoId = 0;
            this.onSearch(1);
          } else {
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

  async exportExcelData() {
    if (this.totalRecord == 0) {
      this.toastr.error("No Record Found");
      return
    }
    try {
      this.request.PageNumber = 1
      this.request.PageSize = this.totalRecord
      this.request.Actoin = "LIST";
      this.loaderService.requestStarted();
      await this.commonMasterService.PublicInfo(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.SeatIntakeDataExcel = data.Data;
            const unwantedColumns = [
              "ActiveStatus", "TotalRecords", "ShiftID", "InstituteID", "StreamID", "StreamTypeID", "CollegeStreamId"
            ];
            const filteredData = this.SeatIntakeDataExcel.map((item: { [x: string]: any; }) => {
              const filteredItem: any = {};
              Object.keys(item).forEach(key => {
                if (!unwantedColumns.includes(key)) {
                  filteredItem[key] = item[key];
                }
              });
              return filteredItem;
            });
            // Convert filtered data to worksheet
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

            // Auto-adjust column widths based on content length
            const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
              wch: Math.max(
                key.length, // Header length
                ...filteredData.map((item: any) => (item[key] ? item[key].toString().length : 0)) // Max content length
              ) + 2 // Extra padding
            }));

            ws['!cols'] = columnWidths; // Apply column widths

            // Apply header styling (bold + background color)
            const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
            if (range.s && range.e) {
              for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_col(col) + '1'; // First row (headers)
                if (!ws[cellAddress]) continue;

                ws[cellAddress].s = {
                  font: { bold: true, color: { rgb: "FFFFFF" } }, // Bold text, white color
                  fill: { fgColor: { rgb: "#f3f3f3" } }, // Light blue background
                  alignment: { horizontal: "center", vertical: "center" } // Center align
                };
              }
            }

            // Create workbook and append sheet
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            // Export file
            XLSX.writeFile(wb, "BTERSeatIntakeExcel.xlsx");
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
    if (this.totalShowData < Number(this.PublicInfoList[0]?.TotalRecords)) {
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

}
