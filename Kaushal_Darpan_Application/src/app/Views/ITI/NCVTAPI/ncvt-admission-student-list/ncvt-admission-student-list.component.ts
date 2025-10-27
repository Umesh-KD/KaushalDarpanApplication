import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

import { ToastrService } from 'ngx-toastr';

import { CompanyMasterSearchModel, EligibleStudentListMasterSearchModel, ICompanyMasterDataModel } from '../../../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumRole } from '../../../../Common/GlobalConstants';
import { ITIStudentEnrollmentService } from '../../../../Services/ITI/ITIstudentenrollment/itistudent-enrollment.service';
import { ItiDataMasterService } from '../../../../Services/ITI/ITIDataMaster/iti-datamaster.service';
import { ITIStudentCorrectionMasterSearchModel } from '../../../../Models/StudentMasterModels';
import { LoaderService } from '../../../../Services/Loader/loader.service';



@Component({
  selector: 'app-ncvt-admission-student-list',
  standalone: false,
  templateUrl: './ncvt-admission-student-list.component.html',
  styleUrl: './ncvt-admission-student-list.component.css'
})
export class NcvtAdmissionStudentListComponent implements OnInit {
  public StudentList: any = [];
  public SessionYearList: any = [];
  public InstituteMasterDDLList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new ITIStudentCorrectionMasterSearchModel();
  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  _EnumRole = EnumRole;

  // pagination
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  sortColumn: string = "";
  sortOrder: string = "";

  constructor(
    private commonMasterService: CommonFunctionService,
    private ItiDataMasterService: ItiDataMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private Router: Router,
    private router: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
    await this.GetStudentCorrectionListData(1);
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID', 'ErrorDescription', 'RecordStatus', 'createddate', 'CollegeID', 'AcedmicYearID',
    ];

 


    const filteredData = this.StudentList.map((item: any) => {
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
    XLSX.writeFile(wb, 'StudentListData.xlsx');
  }

  async GetStudentCorrectionListData(i: any) {
    debugger
    console.log(i);
    if (i == 1) {
      this.pageNo = 1;
    }
    else if (i == 2) {
      // if (this.totalRecord > (this.pageNo * this.pageSize)) {
      this.pageNo++;
      // }
    }
    else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    }
    else {
      this.pageNo = i > 0 ? i : 1;
    }

    try {

      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize
      this.searchRequest.SortColumn = this.sortColumn
      this.searchRequest.SortOrder = this.sortOrder
      // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      // this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      // if(this.sSOLoginDataModel.RoleID === EnumRole.Principal_SCVT) {
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      this.searchRequest.action = "NcvtAdmissionStudentList";
      // }
      this.loaderService.requestStarted();
      await this.ItiDataMasterService.GetStudentCorrectionListData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudentList = data.Data;

        this.totalRecord = this.StudentList[0]?.TotalRecords;
        this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        console.log(this.StudentList)
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

  // get all data
  async ClearSearchData() {
    this.searchRequest.Name = '';
    // this.searchRequest.Status = '';
    this.searchRequest.InstituteID = 0;
    // this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.PageNumber = this.pageNo;
    this.searchRequest.PageSize = this.pageSize;
    await this.GetStudentCorrectionListData(1);
  }






  // pagination start

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetStudentCorrectionListData(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetStudentCorrectionListData(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetStudentCorrectionListData(3)
    }
  }




  // sortData(sortColumn: string) {
  //   this.sortColumn = sortColumn;
  //   this.sortOrder = this.sortOrder == "" ? "ASC" : (this.sortOrder == "ASC" ? "DESC" : "ASC");
  //   // this.GetStudentCorrectionListData(1);
  // }

}
