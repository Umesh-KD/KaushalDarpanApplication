import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, EligibleStudentListMasterSearchModel, ICompanyMasterDataModel } from '../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'eligible-student-list-master',
    templateUrl: './eligible-student-list-master.component.html',
    styleUrls: ['./eligible-student-list-master.component.css'],
    standalone: false
})
export class EligibleStudentListMasterComponent implements OnInit {
  public StudentList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new EligibleStudentListMasterSearchModel();
  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";

  constructor(private commonMasterService: CommonFunctionService, private companyMasterService: CompanyMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetEligibleStudentListData();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
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

  async GetEligibleStudentListData() {
    debugger
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
        this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
        this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.loaderService.requestStarted();
      await this.companyMasterService.GetEligibleStudentListData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudentList = data.Data;
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
    this.searchRequest.Status = '';

    await this.GetEligibleStudentListData();
  }




  async DeleteById(ID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.companyMasterService.DeleteById(ID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (!data.State) {
                  this.toastr.success(data.Message)
                  await this.GetEligibleStudentListData();
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
