import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SanctionOrderDataModel } from '../../../Models/HiringRoleMasterDataModel';
import { SanctionOrderModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { ItiSanctionOrderList } from '../../../Models/ITI/ItiReportDataModel';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ScholarshipService } from '../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ReportService } from '../../../Services/Report/report.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { HiringRoleMasterService } from '../../../Services/HiringRoleMaster/hiring-role-master.service';
@Component({
  selector: 'app-sanction-order-list',
  standalone: false,
  templateUrl: './sanction-order-list.component.html',
  styleUrl: './sanction-order-list.component.css'
})
export class SanctionOrderListComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ItiSanctionOrderList();
  public UserID: number = 0;
  public StaffID: number = 0

  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  constructor(
    private commonMasterService: CommonFunctionService,
    private ScholarshipService: HiringRoleMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;


    console.log(this.sSOLoginDataModel);
    this.GetOrderList();
 
    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.isInstituteDisabled = true;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    }
    //this.getExaminerData();
    //this.getExamMasterList();//grid data
    this.getExaminerData()
  }


  async GetOrderList() {
    try {


      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("OrderList")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.InstituteMasterDDLList = data['Data'];

          // console.log(this.DivisionMasterList)
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
  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
        console.log("SemesterMasterDDLList", this.SemesterMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }







  async getExaminerData() {

    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
    try {
      await this.ScholarshipService.GetsanctionOrder(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminersList = data.Data;
        console.log("this.ExaminersList", this.ExaminersList)
      })
    } catch (error) {
      console.error(error);
    }
  }

  async btnDelete_OnClick(ScholarshipID: number) {
    this.UserID = this.sSOLoginDataModel.UserID
    this.Swal2.Confirmation("Are you sure you want to Remove this ?",

      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.ScholarshipService.DeleteSanctionOrder(ScholarshipID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  //reload
                  this.getExaminerData();
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

  async ResetControl() {
    this.isSubmitted = false;
    /*    this.SubjectMasterDDLList = [];*/
    this.ExaminersList = [];

    this.searchRequest.OrderNo = '';
    this.searchRequest.OrderType = 0
    this.searchRequest.ParentID = 0
   
    await this.getExaminerData();
  }

  //async onCancle() {
  //  this.isSubmitted = false;
  //  this.searchRequest = new ExaminerSearchModel();
  //  this.SubjectMasterDDLList = [];
  //  this.ExaminersList = [];
  //}

  //async DownloadExaminerForm(ExaminerID: number) {
  //  try {
  //    this.loaderService.requestStarted();
  //    this.StaffID = this.AppointExaminer.ExaminerID;
  //    await this.reportService.GetExaminersDetails(ExaminerID, this.sSOLoginDataModel.DepartmentID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          this.DownloadFile(data.Data, 'file download');
  //        }
  //        else {
  //          this.toastr.error(data.ErrorMessage)
  //        }
  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  //DownloadFile(FileName: string, DownloadfileName: any): void {

  //  const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

  //  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
  //    const downloadLink = document.createElement('a');
  //    const url = window.URL.createObjectURL(blob);
  //    downloadLink.href = url;
  //    downloadLink.download = this.generateFileName('pdf');
  //    downloadLink.click();
  //    window.URL.revokeObjectURL(url);
  //  });
  //}
  //generateFileName(extension: string): string {
  //  const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
  //  return `file_${timestamp}.${extension}`;
  //}

  //async GetCommonSubjectDDL() {
  //  try {
  //    if (this.CommonSubjectYesNo == 1 || this.searchRequest.SemesterID == 0) {//no
  //      this.CommonSubjectDDLList = [];
  //      return;
  //    }
  //    this.commonDDLCommonSubjectModel.SemesterID = this.searchRequest.SemesterID;
  //    this.commonDDLCommonSubjectModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.commonDDLCommonSubjectModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //    this.commonDDLCommonSubjectModel.EndTermID = this.sSOLoginDataModel.EndTermID;
  //    //get
  //    await this.commonMasterService.GetCommonSubjectDDL(this.commonDDLCommonSubjectModel)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);
  //        this.CommonSubjectDDLList = data['Data'];
  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //}
}
