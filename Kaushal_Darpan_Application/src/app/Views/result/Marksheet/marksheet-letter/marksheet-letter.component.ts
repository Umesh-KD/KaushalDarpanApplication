import { Component } from '@angular/core';
import { MarksheetLetterService } from '../../../../Services/MarksheetLetter/marksheet-letter.service';
import { FormBuilder } from '@angular/forms';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { MarksheetLetterDataModel, MarksheetLetterSearchModel } from '../../../../Models/MarksheetLetterDataModel';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { MarksheetDownloadService } from '../../../../Services/MarksheetDownload/marksheet-download.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-marksheet-letter',
    templateUrl: './marksheet-letter.component.html',
    styleUrls: ['./marksheet-letter.component.css'],
    standalone: false
})
export class MarksheetLetterComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new MarksheetLetterDataModel()
  public searchRequest = new MarksheetLetterSearchModel();
  //public ApplicationList: any = [];
  public InstituteList: any = [];
  public SemesterMasterList: any = [];
  public ExamTypeList: any = [];
  public EndTermList: any = [];

  constructor(
    private commonMasterService: CommonFunctionService, 
    private marksheetLetterService: MarksheetLetterService,
    private marksheetDownloadService: MarksheetDownloadService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
  ) { }


  async ngOnInit() {
    // this.searchRequest.DepartmentID = 2;
    //this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //console.log(this.sSOLoginDataModel);
    //await this.GetAllData();
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng

   await this.GetInstituteListDDL();
   await this.GetSemesterMasterDDL();
   await this.GetExamTypeMasterDDL();
   await this.GetEndTermDLL();

  }

  async GetInstituteListDDL() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = EnumDepartment.BTER;
      await this.commonMasterService.InstituteMaster(this.searchRequest.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteList = data.Data;
          console.log(this.InstituteList)
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

  async GetSemesterMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data.Data;
          console.log(this.SemesterMasterList)
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

  async GetExamTypeMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ResultType_New')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamTypeList = data.Data;
          console.log(this.ExamTypeList)
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


  async GetEndTermDLL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('EndTerm')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.EndTermList = data.Data.filter((x: any) => x.ID == this.sSOLoginDataModel.EndTermID);
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

  async DownloadMarksheetLetter() {
    this.loaderService.requestStarted();
    this.isSubmitted = true;
    try {
      await this.marksheetDownloadService.DownloadMarksheetLetter(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.DownloadFile(data.Data, 'file download');
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  DownloadFile(FileName: string, DownloadfileName: any): void {
    debugger

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
}
