import { Component } from '@angular/core';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ExamMasterService } from '../../Services/ExamMaster/exam-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { BlankReportModel, ExamMasterDataModel } from '../../Models/ExamMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { ReportService } from '../../Services/Report/report.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-blank-report',
  standalone: false,
  templateUrl: './blank-report.component.html',
  styleUrl: './blank-report.component.css'
})
export class BlankReportComponent {


  ParentMenuDDLList: any;
  isParentMenuVisible: boolean = false;
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  isAddMenuModalVisible: boolean = false;
  isDropdownVisible: boolean = false; // Checkbox state
  ParentId: number | null = null;
  public request = new BlankReportModel();
  public BranchList: any = []
  public SemesterMasterList: any = []
  public StreamMasterList: any = []
  public ExamTypeList: any = []
  public sSOLoginDataModel = new SSOLoginDataModel(); 
  public SubjectMasterList: any[] = [];
  public ExamShiftList: any = []
  public BlankReportList: any = []
  public StreamTypeList: any = []
  public ExamCategoryList: any = []      
  public ExamMasterID: number | null = null;
  public ExamFormGroup!: FormGroup;
  filteredSemesterList = [...this.SemesterMasterList];
  public BranchDDLList: any = [];
  
  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private examMasterService: ExamMasterService,
    private toastr: ToastrService,
    private reportService: ReportService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
  ) {

  }
  get _ExamFormGroup() { return this.ExamFormGroup.controls; }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ExamFormGroup = this.fb.group(
      {
        ddlBranch: ['', [DropdownValidators]],
        DateID: [''],
        StudentExamYear: ['', [DropdownValidators]],
        TimetableTime: ['', [DropdownValidators]],
        ddlSubject: ['', [DropdownValidators]],
        ddlExamCategoryID: ['', [DropdownValidators]]

      })
    this.GetExamShift();
    this.GetMasterData();
    this.loadDropdownData('Branch');
    this.loadDropdownData('Semester');
    this.loadDropdownData('ResultExamType');
    this.GetTradeDDL();
  
  }




  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
      //await this.commonFunctionService.StreamMaster()
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BranchDDLList = data['Data'];
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

  async GetExamShift() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamShift()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamShiftList = data['Data'];
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

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'ResultExamType':
          this.ExamCategoryList = data['Data'];
          this.ExamCategoryList =this.ExamCategoryList.filter((item: any) => item.ID == 77 || item.ID == 78);
          break;
        default:
          break;
      }
    });
  }
  async GetMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
          this.SemesterMasterList = this.SemesterMasterList.filter((item: any) => ![7, 8, 9].includes(item.SemesterID));
        }, (error: any) => console.error(error));

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



  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.request.BranchID, this.sSOLoginDataModel.DepartmentID, this.request.SemesterID,)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterList = data.Data;
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

  async DownloadDataList() {
    
    //if (this._ExamFormGroup.invalid)
    //{
    //  return;
    //}
    this.isSubmitted = true;
    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.loaderService.requestStarted();
      
      await this.reportService.BlankReport(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          } else if (data.State == 3) {
            this.toastr.warning("Data Not found");
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, (error: any) => {
          console.error(error);
        });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ResetControls() {
    this.isSubmitted = false;
    this.request = new BlankReportModel()
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
}
