import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { ReportService } from '../../Services/Report/report.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, EligibleStudentListMasterSearchModel, ICompanyMasterDataModel, InternalMarksReportCollegeWiseSearchModel } from '../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
// import { EnumRole } from '../../Common/GlobalConstants';
import { StreamMasterService } from '../../Services/BranchesMaster/branches-master.service';
import { EnumStatus, EnumRole } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'InternalMarksReportCollegeWise',
  templateUrl: './InternalMarksReportCollegeWise.component.html',
  styleUrls: ['./InternalMarksReportCollegeWise.component.css'],
  standalone: false
})
export class InternalMarksReportCollegeWiseComponent implements OnInit {
  public StudentList: any = [];
  public SessionYearList: any = [];
  public InstituteMasterDDLList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new InternalMarksReportCollegeWiseSearchModel();
  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  _EnumRole = EnumRole;

  public BranchList: any[] = [];
  public CampusPostID: number = 0;

  // pagination
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  sortColumn: string = "";
  sortOrder: string = "";


  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public SemesterMasterList: any = [];


  constructor(
    private commonMasterService: CommonFunctionService,
    private ReportService: ReportService,
    private ReportData: ReportService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private Router: Router,
    private branchservice: StreamMasterService,
    private router: ActivatedRoute,
    private http: HttpClient,
    private appsettingConfig: AppsettingService

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // set college
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;

    await this.GetSessionYear();
    await this.GetInstituteList();
    await this.GetBranchList();
    // this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID

    // await this.GetEligibleStudentListData(1);
  }



  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID', 'MobileNo', 'Email'
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

  //   async GetStreamMasterList(CampusPostID: number) {
  //   debugger;
  //   try {
  //     this.loaderService.requestStarted();

  //     await this.commonMasterService.StreamMasterByCampus(this.CampusPostID, this.sSOLoginDataModel.DepartmentID)
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.StreamMasterList = data['Data'];
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }


  async GetBranchList() {
    //debugger;
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.Stream_InstituteIdWise(
        this.sSOLoginDataModel.DepartmentID,
        this.sSOLoginDataModel.Eng_NonEng,
        this.sSOLoginDataModel.EndTermID,
        this.sSOLoginDataModel.InstituteID,
        this.sSOLoginDataModel.FinancialYearID
      ).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchList = data.Data;
      });

      await this.commonMasterService.SemesterMaster(1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetEligibleStudentListData(i: any) {
    //debugger
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
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      if (this.sSOLoginDataModel.RoleID === EnumRole.TPO) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      }
      this.loaderService.requestStarted();
      await this.ReportService.GetInternalAssessmentStudentReport(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
        }
        else if (data.State == EnumStatus.Warning) {
          this.toastr.error(data.Message);
        }
        else {
          this.toastr.error(data.ErrorMessage);
        }
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



  async ClearSearchData() {
    this.searchRequest.StreamID = 0;
    this.searchRequest.InstituteID = 0;
    this.searchRequest.PageNumber = this.pageNo;
    this.searchRequest.PageSize = this.pageSize;
    await this.GetEligibleStudentListData(1);
  }




  // async DeleteById(ID: number) {
  //   this.Swal2.Confirmation("Do you want to delete?",
  //     async (result: any) => {
  //       //confirmed
  //       if (result.isConfirmed) {
  //         try {
  //           //Show Loading
  //           this.loaderService.requestStarted();

  //           await this.companyMasterService.DeleteById(ID, this.sSOLoginDataModel.UserID)
  //             .then(async (data: any) => {
  //               data = JSON.parse(JSON.stringify(data));
  //               console.log(data);

  //               if (!data.State) {
  //                 this.toastr.success(data.Message)
  //                 await this.GetEligibleStudentListData(1);
  //               }
  //               else {
  //                 this.toastr.error(data.ErrorMessage)
  //               }

  //             }, (error: any) => console.error(error)
  //             );
  //         }
  //         catch (ex) {
  //           console.log(ex);
  //         }
  //         finally {
  //           setTimeout(() => {
  //             this.loaderService.requestEnded();
  //           }, 200);
  //         }
  //       }
  //     });
  // }



  // pagination start

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetEligibleStudentListData(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetEligibleStudentListData(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {

      // this.GetEligibleStudentListData(3)
    }
  }

  async GetSessionYear() {
    try {
      await this.commonMasterService.GetFinancialYear().then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SessionYearList = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  async GetInstituteList() {
    try {
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, 0, 0).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  // sortData(sortColumn: string) {
  //   this.sortColumn = sortColumn;
  //   this.sortOrder = this.sortOrder == "" ? "ASC" : (this.sortOrder == "ASC" ? "DESC" : "ASC");
  //   // this.GetEligibleStudentListData(1);
  // }


  async downloadIAStudentReport() {
    //debugger
    // validation
    if (this.searchRequest.InstituteID == 0
      || this.searchRequest.SemesterID == 0
      || this.searchRequest.TypeID == 0) {
      this.toastr.warning("Please choose the required field!")
      return;
    }

    //debugger
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.TermPart = this.sSOLoginDataModel.TermPart;

    // strteamids
    if (this.searchRequest.StreamID == 0) {
      this.searchRequest.StreamIDs = this.BranchList.map(x => x.StreamID).join(',');
    }

    await this.ReportData.IAStudentReportDownload(this.searchRequest)
      .then((res: any) => {
        //debugger
        if (res.State == EnumStatus.Success) {
          var pdfname = "report";
          if (this.searchRequest.TypeID == 1) {
            pdfname = "Practical_Report.pdf";
          }
          else if (this.searchRequest.TypeID == 2) {
            pdfname = "Internal_Assessment_Report.pdf";
          }
          else if (this.searchRequest.TypeID == 3) {
            pdfname = "SCA_Report.pdf";
          }
          this.downloadBase64PDF(res.Data, pdfname);
        }
        else if (res.State == EnumStatus.Warning) {
          this.toastr.warning(res.Message);
        }
        else {
          this.toastr.error(res.Message);
        }
      }, (error: any) => console.error(error));
  }

  downloadBase64PDF(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

}
