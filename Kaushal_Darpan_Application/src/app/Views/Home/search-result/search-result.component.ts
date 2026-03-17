import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusDetailsWebSearchModel } from '../../../Models/CampusDetailsWebDataModel';
import { StudentResultSearchModel } from '../../../Models/DownloadMarksheetDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { MarksheetDownloadService } from '../../../Services/MarksheetDownload/marksheet-download.service';


@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.css'],
    standalone: false
})
export class SearchResultComponent implements OnInit {
  public resultSearchReq = new StudentResultSearchModel();
  public searchRequest = new CampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public SemesterList: any = [];
  public FinancialYear: any = [];
  public StudentData: any = [];
  public SubjectDetailsData: any = [];
  public FinalResultData: any = [];

  public StudentResultData: any;
  public showResult: boolean = false;

  minEndDate: string = '';

  searchModel = {
    startDate: '',
    endDate: ''
  };
  FilteredCampusPostList: any[] = [];
  CampusFromDate: string = '';
  CampusToDate: string = '';
  FinancialYearID: number = 0;
  InstituteID: number = 0;
  OriginalCampusPostList: any[] = []; // Store unfiltered data
  public BranchMasterList: any[] = [];
  StreamID: number = 0; 

  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private marksheetDownloadService: MarksheetDownloadService,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.resultSearchReq = new StudentResultSearchModel();
    await this.GetSemesterList();
    await this.GetResultEndTermDDLList();   
  }

  async GetSemesterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterList = data['Data'];
          this.SemesterList = this.SemesterList.filter((x: any) => x.SemesterID !== 7 && x.SemesterID !== 8 && x.SemesterID !== 9);
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetResultEndTermDDLList() {
    this.loaderService.requestStarted();

    try {
      const data: any = await this.marksheetDownloadService.GetResultEndTermDDLList();
      const parsedData = JSON.parse(JSON.stringify(data)); // Not ideal, see note below
      this.FinancialYear = parsedData['Data'];

    } catch (error) {
      console.error('Error in GetFinancialYear:', error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStudentResult_public() {
    try {
      await this.marksheetDownloadService.GetStudentResult_public(this.resultSearchReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.StudentResultData = data['Data'];
          this.StudentData = data.Data['Table'][0];
          this.SubjectDetailsData = data.Data['Table1'];
          this.FinalResultData = data.Data['Table2'];

          if(this.SubjectDetailsData?.length > 0) {
            this.showResult = true;
          }
        } else if(data.State === EnumStatus.Warning) {
          this.showResult = false;
          this.toastr.warning(data.Message);
          this.StudentResultData = [];
          this.StudentData = [];
          this.SubjectDetailsData = [];
          this.FinalResultData = [];
        } else {
          this.showResult = false;
          this.toastr.error(data.ErrorMessage);
          this.StudentResultData = [];
          this.StudentData = [];
          this.SubjectDetailsData = [];
          this.FinalResultData = [];
        }
        
      })
    } catch (error) {
      console.error(error);
    }
  }

  onendtermchange(event: any) {
    this.resultSearchReq.EndTermID = event.target.value;
  }

  onsemesterchange(event: any) {
    this.resultSearchReq.SemesterID = event.target.value;
  }
}
