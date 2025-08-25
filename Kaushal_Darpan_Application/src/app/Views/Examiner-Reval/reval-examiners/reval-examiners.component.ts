import { Component, OnInit } from '@angular/core';
import { ExaminerDataModel, ExaminerSearchModel } from '../../../Models/ExaminerDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ExaminerService } from '../../../Services/Examiner/examiner.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus, GlobalConstants ,EnumDepartment} from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { CommonDDLCommonSubjectModel } from '../../../Models/CommonDDLCommonSubjectModel';
import { CommonDDLSubjectMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';

@Component({
  selector: 'app-reval-examiners',
  templateUrl: './reval-examiners.component.html',
  styleUrls: ['./reval-examiners.component.css'],
  standalone: false
})
export class RevalExaminersComponent implements OnInit {
  public SemesterMasterDDLList: any[] = [];
  public filteredSemesterList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';
  public AppointExaminer = new ExaminerDataModel();
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ExaminerSearchModel();
  public UserID: number = 0;
  public StaffID: number = 0

  public commonDDLCommonSubjectModel = new CommonDDLCommonSubjectModel();
  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];

  constructor(
    private commonMasterService: CommonFunctionService,
    private examinerservice: ExaminerService,
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
    await this.ExaminationSchemeChange()
    this.getStreamMasterList();
    this.getGroupCodeMasterList();
    //this.getExaminerData();
    //this.getExamMasterList();//grid data
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
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
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

  async getGroupCodeMasterList() {
    try {
      let model = new CommonDDLSubjectMasterModel();
      model.SubjectID = this.searchRequest.SemesterID;
      model.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      model.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      model.EndTermID = this.sSOLoginDataModel.EndTermID;
      //
      await this.commonMasterService.GetGroupCode(model)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GroupMasterDDLList = data.Data;
          console.log("GroupMasterDDLList", this.GroupMasterDDLList);
        })
    } catch (error) {
      console.error(error);
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



  ExaminationSchemeChange() {
    this.searchRequest.SemesterID = 0
    if (this.searchRequest.IsYearly == 0) {
      this.filteredSemesterList = this.SemesterMasterDDLList.filter((item: any) => item.SemesterID <= 6);
    } else if (this.searchRequest.IsYearly == 1) {
      this.filteredSemesterList = this.SemesterMasterDDLList.filter((item: any) => item.SemesterID >= 7);
    } else {
      this.filteredSemesterList = this.SemesterMasterDDLList
    }
  }




  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.searchRequest.StreamID, this.sSOLoginDataModel.DepartmentID, this.searchRequest.SemesterID)
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

  async getExaminerData() {
    console.log("searchRequest", this.searchRequest);
    this.searchRequest.CommonSubjectYesNo = this.CommonSubjectYesNo;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    try {
      await this.examinerservice.GetExaminerData_Reval(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminersList = data.Data;
        console.log("this.ExaminersList", this.ExaminersList)
      })
    } catch (error) {
      console.error(error);
    } 
  }

  async btnDelete_OnClick(ExaminerID: number) {
    this.Swal2.Confirmation("Are you sure you want to Remove this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.examinerservice.DeleteByID_Reval(ExaminerID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  //reload
                 await this.getExaminerData();
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
    this.SubjectMasterDDLList = [];
    this.ExaminersList = [];

    this.searchRequest.StreamID = 0;
    this.searchRequest.SubjectID = 0;
    this.searchRequest.Name = '';
    this.searchRequest.GroupCodeID = 0;
    this.searchRequest.ExamID = 0;
    this.searchRequest.CommonSubjectID = 0;

  }

  async onCancle() {
    this.isSubmitted = false;
    this.searchRequest = new ExaminerSearchModel();
    this.SubjectMasterDDLList = [];
    this.ExaminersList = [];
  }

  async DownloadExaminerForm(ExaminerID: number) {
    try {
      this.loaderService.requestStarted();
      this.StaffID = this.AppointExaminer.ExaminerID;
      await this.reportService.GetExaminersDetails(ExaminerID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
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
  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  async GetCommonSubjectDDL() {
    try {
      if (this.CommonSubjectYesNo == 1 || this.searchRequest.SemesterID == 0) {//no
        this.CommonSubjectDDLList = [];
        return;
      }
      this.commonDDLCommonSubjectModel.SemesterID = this.searchRequest.SemesterID;
      this.commonDDLCommonSubjectModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.commonDDLCommonSubjectModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.commonDDLCommonSubjectModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      //get
      await this.commonMasterService.GetCommonSubjectDDL(this.commonDDLCommonSubjectModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CommonSubjectDDLList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }
}
