import { Component } from '@angular/core';
import { ScholarshipSearchModel } from '../../Models/ScholarshipDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ScholarshipService } from '../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../Services/Report/report.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { EnumRole, EnumStatus } from '../../Common/GlobalConstants';

@Component({
  selector: 'app-scholarship-list',
  standalone: false,
  templateUrl: './scholarship-list.component.html',
  styleUrl: './scholarship-list.component.css'
})
export class ScholarshipListComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ScholarshipSearchModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  constructor(
    private commonMasterService: CommonFunctionService,
    private ScholarshipService: ScholarshipService,
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
    this.getSemesterMasterList();
    this.getStreamMasterList();
    this.getExamMasterList();
    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.isInstituteDisabled = true;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    }
    //this.getExaminerData();
    //this.getExamMasterList();//grid data
    this.getExaminerData()
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

  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("ExamList", this.ExamList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
        console.log("StreamMasterDDLList", this.StreamMasterDDLList);
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
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;

    try {
      await this.ScholarshipService.GetAllData(this.searchRequest).then((data: any) => {
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
            await this.ScholarshipService.DeleteById(ScholarshipID, this.UserID)
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
    
    this.searchRequest.StreamID = 0;
    this.searchRequest.SemesterID = 0
    if (this.sSOLoginDataModel.RoleID != EnumRole.Principal && this.sSOLoginDataModel.RoleID != EnumRole.PrincipalNon) {
      this.searchRequest.InstituteID=0
    }
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
