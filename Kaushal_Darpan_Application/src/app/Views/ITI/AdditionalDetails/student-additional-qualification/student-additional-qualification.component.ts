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
import { StudentAdditionalQualificationModel } from '../../../../Models/ApplicationFormDataModel';
@Component({
    selector: 'student-additional-qualification',
    templateUrl: './student-additional-qualification.component.html',
    styleUrls: ['./student-additional-qualification.component.css'],
    standalone: false
})
export class StudentAdditionalQualiComponent implements OnInit {
  public StudAdditionalQualificationList: StudentEmploymentDetailsModel[] = [];
  public Table_SearchText: string = "";
  public request = new StudentAdditionalQualificationModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";

  public _EnumRole = EnumRole;

  constructor(private commonMasterService: CommonFunctionService, private companyMasterService: CompanyMasterService,
    private StudentdetailUpdateService:StudentdetailUpdateService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetStudentAdditionalQualiData();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.StudAdditionalQualificationList.map((item: any) => {
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

  async GetStudentAdditionalQualiData() {
    debugger
    try {
      // this.request.ModifyBy = this.sSOLoginDataModel.UserID
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        if(this._EnumRole.Student== this.sSOLoginDataModel.RoleID){
            this.request.StudentID = this.sSOLoginDataModel.StudentID;
        }
        this.request.InstituteID=this.sSOLoginDataModel.InstituteID;
        // this.request.StudentID=this.sSOLoginDataModel.UserID;

      this.loaderService.requestStarted();
      await this.StudentdetailUpdateService.GetStudentAdditionalQualiData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudAdditionalQualificationList = data.Data;
        console.log(this.StudAdditionalQualificationList)
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
    // this.request.CompanyName = '';
this.request.EnrollmentNo='';
    await this.GetStudentAdditionalQualiData();
  }




  async DeleteById(ID: number) {
    debugger
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.StudentdetailUpdateService.Delete_StudentAdditionalQualiData(ID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State) {
                  this.toastr.success(data.Message)
                  await this.GetStudentAdditionalQualiData();
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
