import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../../../Services/CompanyMaster/company-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, ICompanyMasterDataModel, StudentEmploymentDetailsModel } from '../../../../Models/CompanyMasterDataModel';
import {StudentdetailUpdateService} from '../../../../Services/StudentDetailUpdate/studentdetail-update.service'
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumRole } from '../../../../Common/GlobalConstants';
@Component({
    selector: 'employement-history',
    templateUrl: './employement-history.component.html',
    styleUrls: ['./employement-history.component.css'],
    standalone: false
})
export class StudentEmployementHistoryComponent implements OnInit {
  public StudEmployementList: StudentEmploymentDetailsModel[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new StudentEmploymentDetailsModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";

  public _EnumRole = EnumRole;

  constructor(private commonMasterService: CommonFunctionService, private companyMasterService: CompanyMasterService,
    private StudentdetailUpdateService:StudentdetailUpdateService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetStudentEmployementData();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.StudEmployementList.map((item: any) => {
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
    XLSX.writeFile(wb, 'StudEmployementListData.xlsx');
  }

  async GetStudentEmployementData() {
    debugger
    try {
      // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
        this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        if(this._EnumRole.Student== this.sSOLoginDataModel.RoleID){
            this.searchRequest.StudentID = this.sSOLoginDataModel.StudentID;
        }
        this.searchRequest.InstituteID=this.sSOLoginDataModel.InstituteID;
        // this.searchRequest.StudentID=this.sSOLoginDataModel.UserID;

      this.loaderService.requestStarted();
      await this.StudentdetailUpdateService.GetStudentEmployementData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudEmployementList = data.Data;
        console.log(this.StudEmployementList)
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
    this.searchRequest.CompanyName = '';

    await this.GetStudentEmployementData();
  }




  async DeleteById(ID: number) {
    debugger
    this.searchRequest.CompanyName
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.StudentdetailUpdateService.Delete_StudEmployementByID(ID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State) {
                  this.toastr.success(data.Message)
                  await this.GetStudentEmployementData();
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
      });
  }
}
