import { Component, OnInit } from '@angular/core';
import { CommonSubjectMasterSearchModel } from '../../../Models/CommonSubjectMasterSearchModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSubjectService } from '../../../Services/CommonSubjects/common-subjects.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EnumConfigurationType, EnumDepartment, EnumRole, EnumStatus } from '../../../Common/GlobalConstants';


@Component({
  selector: 'app-common-subjects',
  templateUrl: './common-subjects.component.html',
  styleUrls: ['./common-subjects.component.css'],
  standalone: false
})
export class CommonSubjectsComponent implements OnInit {

  public SemestarMasterDDLList: any = [];
  public SubjectMasterDDLList: any = [];
  public CommonSubjectList: any = [];
  public MenuAllowedRoleList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new CommonSubjectMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public IsCommonSubjectMasterDateOpen: number = 0;
  _EnumRole = EnumRole;
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: 'asc' | 'desc' = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(private commonMasterService: CommonFunctionService,
    private commonSubjectService: CommonSubjectService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMenuPermission();

    await this.GetMasterDateConfigData();
    await this.GetSemestarMatserDDL();
    await this.GetAllData(1);

  }

  // get semestar ddl
  async GetSemestarMatserDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SemestarMasterDDLList = data['Data'];
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

  async ddlSemester_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_SemesterIDWise(this.searchRequest.SemesterID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
          console.log("SubjectMasterDDLList", this.SubjectMasterDDLList)
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

  // get all data
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

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.PageNumber = this.pageNo;
    this.searchRequest.PageSize = this.pageSize; 
    try {
      this.loaderService.requestStarted();
      await this.commonSubjectService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CommonSubjectList = data['Data'];
          this.totalRecord = this.CommonSubjectList[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
          console.log("CommonSubjectList", this.CommonSubjectList)
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

  // get all data
  async ClearSearchData() {
    this.searchRequest.CommonSubjectName = '';
    this.searchRequest.SemesterID = 0;
    this.searchRequest.SubjectID = 0;
    await this.GetAllData(1);
    this.SubjectMasterDDLList = [];
  }

  // delete by id
  async DeleteById(commonSubjectId: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.commonSubjectService.DeleteById(commonSubjectId, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  await this.GetAllData(1);
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

  async GetMasterDateConfigData() {
    var data = {
      DepartmentID: EnumDepartment.BTER,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: EnumConfigurationType.Common_Subject_Master,
      SSOID: this.sSOLoginDataModel.SSOID
    }
    await this.commonMasterService.GetDateConfigSetting(data)
      .then((resp: any) => {
        let data = JSON.parse(JSON.stringify(resp));
        this.IsCommonSubjectMasterDateOpen = data['Data'][0][EnumConfigurationType.Common_Subject_Master];
      }, (error: any) => console.error(error)
      );
  }

  async GetMenuPermission() {
 
    const baseRoute = this.routers.url.split('?')[0].split('/').filter(Boolean)[0] ?? '';
 
    var request: any = {
      FilterBy: baseRoute,
      MasterCode: "GetAllowedRoleForMenu"
    }
 
    await this.commonMasterService.CommonMasterDataByAction(request).then((data: any) => {
      data =  JSON.parse(JSON.stringify(data));
      if(data.State == EnumStatus.Success){
        this.MenuAllowedRoleList=data.Data
 
        if (!this.MenuAllowedRoleList.some(
          (item: any) => Number(item.RoleID) == Number(this.sSOLoginDataModel.RoleID)
        )) {
          // Navigate to dashboard if RoleID is not allowed
          this.routers.navigate(['/dashboard']);
        }
      }      
    })
  }


  sortColumn: string = '';
  sortDirection: boolean = true;


  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection === 'asc' ? '&uarr;' : '&darr;';
  }

  sortData_OLD(column: string): void {
    if (this.sortInTableColumn === column) {
      this.sortInTableDirection =
        this.sortInTableDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortInTableColumn = column;
      this.sortInTableDirection = 'asc';
    }

    const direction = this.sortInTableDirection === 'asc' ? 1 : -1;

    this.CommonSubjectList.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA == null) return 1;
      if (valueB == null) return -1;

      let result: number;

      if (column === 'CreatedDate' || column === 'ModifyDate') {
        const dateA = new Date(valueA).getTime();
        const dateB = new Date(valueB).getTime();

        result = dateA - dateB;
      } else {
        result = String(valueA).localeCompare(
          String(valueB),
          undefined,
          {
            numeric: true,
            sensitivity: 'base'
          }
        );
      }

      return result * direction;
    });
  }

  sortData(column: string): void
  {
    if (this.sortInTableColumn === column)
    {
      this.sortInTableDirection =
        this.sortInTableDirection === 'asc' ? 'desc' : 'asc';
    } else
    {
      this.sortInTableColumn = column;
      this.sortInTableDirection = 'asc';
    }

    const direction = this.sortInTableDirection === 'asc' ? 1 : -1;
    const dateColumns = ['CreatedDate', 'ModifyDate'];
    const parseDate = (value: any): number | null =>
    {
      if (value == null || value === '') {
        return null;
      }

      if (value instanceof Date)
      {
        const timestamp = value.getTime();
        return Number.isFinite(timestamp) ? timestamp : null;
      }

      if (typeof value === 'number')
      {
        return Number.isFinite(value) ? value : null;
      }

      const str = String(value).trim();

      // DD-MM-YYYY or DD-MM-YYYY HH:mm:ss
      // Also supports DD/MM/YYYY and optional seconds
      const match = str.match( /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/ );

      if (match)
      {
        const [,day,month,year,hours = '00',minutes = '00', seconds = '00'] = match;
        const d = Number(day);
        const m = Number(month);
        const y = Number(year);
        const h = Number(hours);
        const min = Number(minutes);
        const s = Number(seconds);

        // Validate date and time components
        if (m < 1 || m > 12 || d < 1 || d > 31 || h > 23 || min > 59 || s > 59)
        {
          return null;
        }

        const date = new Date(y, m - 1, d, h, min, s);

        // Reject invalid calendar dates such as 31-02-2025
        if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d)
        {
          return null;
        }
        return date.getTime();
      }

      // Fallback for ISO formats, e.g. 2025-12-22T14:29:50
      const timestamp = Date.parse(str);
      return Number.isFinite(timestamp) ? timestamp : null;
    };

    this.CommonSubjectList.sort((a: any, b: any) =>
    {
      const valueA = a?.[column];
      const valueB = b?.[column];
      const emptyA = valueA == null || valueA === '';
      const emptyB = valueB == null || valueB === '';

      // Keep empty values at the bottom in both directions
      if (emptyA && emptyB) return 0;
      if (emptyA) return 1;
      if (emptyB) return -1;

      let result = 0;

      if (dateColumns.includes(column))
      {
        const dateA = parseDate(valueA);
        const dateB = parseDate(valueB);

        // Invalid dates go to the bottom
        if (dateA === null && dateB === null) return 0;
        if (dateA === null) return 1;
        if (dateB === null) return -1;

        result = dateA - dateB;
      } else if (typeof valueA === 'number' && typeof valueB === 'number')
      {
        result = valueA - valueB;
      }
      else
      {
        result = String(valueA).localeCompare( String(valueB), undefined,  {
            numeric: true,
            sensitivity: 'base'
          }
        );
      }

      return result * direction;
    });
  }

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetAllData(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.CommonSubjectList[0]?.TotalRecords)) {
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
    this.totalInTableRecord = this.CommonSubjectList.length;
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
    this.paginatedInTableData = [...this.CommonSubjectList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }


}
