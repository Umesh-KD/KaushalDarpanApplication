import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeatIntakeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { EnumCourseType, EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { BTERSeatsDistributionsService } from '../../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { BTERCollegeBranchModel, BTERSeatsDistributionsDataModels } from '../../../../Models/BTER/BTERSeatsDistributions';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-seat-intakes-list',
  templateUrl: './seat-intakes-list.component.html',
  styleUrls: ['./seat-intakes-list.component.css'],
  standalone: false
})
export class SeatIntakesListComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public SeatIntakeSearchFormGroup!: FormGroup;
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
  public request = new BTERCollegeBranchModel()
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



  public CollegeBranchesList: any = []

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

  ) { }

  async ngOnInit() {
    this.SeatIntakeSearchFormGroup = this.formBuilder.group(
      {
        BranchType: [''],
        StreamID: [''],
        Shift: [''],
        CollegeType: [''],
        College: [''],
        Status: [''],
        CollegeCode: [''],
        StreamCode: [''],
      });

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.SSOLoginDataModel.Eng_NonEng == EnumCourseType.Lateral) {
      this.request.StreamTypeId = EnumCourseType.Engineering
    } else {
      this.request.StreamTypeId = this.SSOLoginDataModel.Eng_NonEng
    }

    this.request.EndTermId = this.SSOLoginDataModel.EndTermID;
    this.searchRequestType.EndTermID = this.SSOLoginDataModel.EndTermID;

    this.GetDateConfigSetting();
    this.GetManagmentType();
    this.GetColleges();
    this.GetBranches()
    this.onSearch(1);
  }
  get _SeatIntakeSearchFormGroup() { return this.SeatIntakeSearchFormGroup.controls; }

  async GetManagmentType() {
    try {
      this.searchRequestType.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      this.searchRequestType.Type = '0';
      this.searchRequestType.Action = 'COLLAGE_TYPE_LIST';
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetSeatMetrixData(this.searchRequestType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ManagmentTypeList = data['Data'];
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

  async GetDateConfigSetting() {
    this.loaderService.requestStarted();
    var data = {
      DepartmentID: this.SSOLoginDataModel.DepartmentID,
      CourseTypeId: 1,
      AcademicYearID: this.SSOLoginDataModel.FinancialYearID,
      EndTermId: this.SSOLoginDataModel.EndTermID,
      Key: "COLLEGE BRANCH MAPPING",
      SSOID: this.SSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
        

      }, (error: any) => console.error(error)
      );
  }



  async GetColleges() {
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      this.request.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      this.request.CreatedBy = this.SSOLoginDataModel.UserID;
      this.request.Action = "COLLEGE_LIST"
      await this.SeatsDistributionsService.CollegeBranches(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CollegesListAll = data.Data;
      });
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetInstituteListDDL() {
    try {
      this.searchRequestType.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      //this.searchRequestType.Type = this.searchRequestType.Type.toString();
      this.searchRequestType.Action = 'COLLEGE_LIST';
      this.searchRequestType.Type = this.request.ManagementTypeId.toString();
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetSeatMetrixData(this.searchRequestType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegesListAll = data['Data'];
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

  async GetBranches() {
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      this.request.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      this.request.CreatedBy = this.SSOLoginDataModel.UserID;
      this.request.Action = "BRANCH_LIST"
      await this.SeatsDistributionsService.CollegeBranches(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchList = data.Data;
      });
    } catch (error) {
      console.error(error)
    } finally {
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
    try {
      this.loaderService.requestStarted();

      debugger;
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      this.request.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      this.request.CreatedBy = this.SSOLoginDataModel.UserID;
      this.request.Action = 'LIST';
      this.request.PageNumber = this.pageNo;
      this.request.PageSize = this.pageSize;
      //this.request.CollegeStreamId = this.SSOLoginDataModel.Eng_NonEng;
      this.request.StreamTypeId = this.SSOLoginDataModel.Eng_NonEng;
      this.request.StreamFor = this.SSOLoginDataModel.RoleID == 17 || this.SSOLoginDataModel.RoleID == 18 || this.SSOLoginDataModel.RoleID == 33 || this.SSOLoginDataModel.RoleID == 80 || this.SSOLoginDataModel.RoleID == 81 ? 1 : 2;
      await this.SeatsDistributionsService.CollegeBranches(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.AllInTableSelect = false;
            this.CollegeBranchesList = data.Data;
            this.totalRecord = this.CollegeBranchesList[0]?.TotalRecords;
            this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
            //table feature load
            this.loadInTable();
            //end table feature load
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
    this.request = new BTERCollegeBranchModel()
    this.onSearch(1)
  }

  async DeleteById(BranchID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.SeatsDistributionsService.DeleteCollegeBrancheByID(BranchID, this.SSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.onSearch(1);
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

  onToggleChange(BranchID: number, Status: boolean) {
    this.Swal2.Confirmation("Are you sure you want to change status?", async (result: any) => {
      if (result.isConfirmed) {
        try {
          
          var ActiveStatus: number = 0
          Status = !Status
          if (Status == true) {
            ActiveStatus = 1
          } else {
            ActiveStatus = 0
          }
          this.loaderService.requestStarted();
          await this.SeatsDistributionsService.StatusChangeByID(BranchID, ActiveStatus, this.SSOLoginDataModel.UserID)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));

              if (data.State = EnumStatus.Success) {
                this.toastr.success(data.Message);
                this.onSearch(1);
              } else {
                this.toastr.error(data.ErrorMessage);
              }

            }, (error: any) => console.error(error));
        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    });
  }

  async exportExcelData() {
    if (this.totalRecord == 0) {
      this.toastr.error("No Record Found");
      return
    }
    try {
      this.request.PageNumber = 1
      this.request.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.CollegeBranches(this.request)
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

            this.request = new BTERCollegeBranchModel()
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

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.SeatIntakeDataList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.SeatIntakeDataList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.SeatIntakeDataList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.SeatIntakeDataList.filter((x: { Selected: any; }) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.SeatIntakeDataList.forEach((x: { Selected: boolean; }) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.SeatIntakeDataList.filter((x: { StudentID: any; }) => x.StudentID == item.StudentID);
    data.forEach((x: { Selected: boolean; }) => {
      x.Selected = isSelected;
    });
  }
  // end table feature.

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
    const filteredData = this.SeatIntakeDataList.map((item: any) => {
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
    XLSX.writeFile(wb, 'SeatIntakeDetails.xlsx');
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
    if (this.totalShowData < Number(this.CollegeBranchesList[0]?.TotalRecords)) {
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
