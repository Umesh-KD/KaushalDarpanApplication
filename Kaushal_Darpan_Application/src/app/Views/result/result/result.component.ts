// result.component.ts

import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { StudentExamDetails } from '../../../Models/DashboardCardModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { ResultService } from '../../../Services/Results/result.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { DownloadMarksheetSearchModel, Publish_Unpublish_BTER_ResultDataModel, ResultGenerationListDataModel } from '../../../Models/DownloadMarksheetDataModel';
import { MenuService } from '../../../Services/Menu/menu.service';
import { MarksheetDownloadService } from '../../../Services/MarksheetDownload/marksheet-download.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

@Component({ 
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  standalone: false
})
export class ResultComponent implements OnInit {
  State: boolean = false;
  public DateConfigSetting: any = [];
  MapKeyEng: number = 0;
  isGenerateResult: boolean = true; 
  isSubmitted: boolean = false; 
  isWithOTP: boolean = false; 
  viewAdminDashboardList: StudentExamDetails[] = [];
  public searchReq = new ResultGenerationListDataModel();
  public publishReq = new Publish_Unpublish_BTER_ResultDataModel();
  sSOLoginDataModel: any;
  url: any;
  instituteId: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  lstAcedmicYear: any = [];
  SemesterMasterList: any = [];
  SemesterReMasterList: any = [];
  public ResultTypeList: any = [];
  public FinancialYear: any = [];
  public GeneratedResultDetailsList: any = [];
  Table_SearchText: string = '';
  modalReference: NgbModalRef | undefined;
  public searchRequest = new DownloadMarksheetSearchModel();

  // @ViewChild(MatSort) sort!: MatSort;
  filterForm!: FormGroup;
  resultGenerateForm!: FormGroup;
  resultReGenerateForm!: FormGroup;

  @ViewChild('otpModal_publishResult') childComponent_publish!: OTPModalComponent;
  @ViewChild('otpModal_unpublishResult') childComponent_unpublish!: OTPModalComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private resultService: ResultService,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private toastrService: ToastrService,

    private marksheetDownloadService: MarksheetDownloadService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
  ) {
    // Get user data from localStorage
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async ngOnInit() {
    // Get URL parameter
    this.activatedRoute.paramMap.subscribe((params) => {
      this.url = params.get('url');
      // Load master data required for dropdowns or other UI elements
      this.loadMasterData();
      this.GetDateConfig();
    });
    // Initialize forms
    this.filterForm = this.fb.group({
      searchTerm: [''],
    });
    this.resultGenerateForm = this.fb.group({
      selectedSemester: ['0',[DropdownValidators]],
      SchemeID: ['0',[DropdownValidators]],
      ResultTypeID: ['0',[DropdownValidators]],
      EndTermID: ['0',[DropdownValidators]],
    });
    this.resultReGenerateForm = this.fb.group({
      selectedSemester: ['all'],
    });

    await this.GetDateConfig();
    await this.GetResultTypeList();
    await this.GetResultEndTermDDLList();
    // Optionally, you can call GetAllData() here if you want data loaded on init.
    // this.GetAllData();
  }

  get _resultGenerateForm() { return this.resultGenerateForm.controls; }

  async GetResultTypeList() {
    try {
      await this.commonMasterService.GetExamResultType()
        .then((data: any) => {
          this.ResultTypeList = data['Data'] || [];
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
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

  //date Setting

  async GetDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "Result",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.Result;
      }, (error: any) => console.error(error));
  }

  async generateStudentResult() {

    this.isSubmitted = true;
    if(this.resultGenerateForm.invalid){
      this.toastr.error("Please select all mandatory fields.");
      return;
    }
    try {
      const requestData: any = {
        EndTermID: this.resultGenerateForm.value.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        UserID: this.sSOLoginDataModel.UserID,
        RoleID: this.sSOLoginDataModel.RoleID,
        SemesterID: this.resultGenerateForm.value.selectedSemester,
        ResultType: this.url,
        SchemeID: this.resultGenerateForm.value.SchemeID,
        ResultTypeID: this.resultGenerateForm.value.ResultTypeID
      };

      await this.resultService.GetStudentResults(requestData)
        .then(async (data: any) => {
          if (data.State === EnumStatus.Success) {          


            
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.ErrorMessage);
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    } catch (error) {
      console.error(error);
    }
    
  }


  loadMasterData(): void {
    // Load Semester master data for generate   
    this.commonMasterService.SemesterGenerateMaster()
      .then((data: any) => {
        let SemesterMaster: any = data['Data'];
        this.SemesterMasterList = SemesterMaster;

        setTimeout(() => {
          if (SemesterMaster && this.lstAcedmicYear[0]?.TermName == "Nov") {
            this.SemesterMasterList = SemesterMaster.filter((x: { SemesterID: number }) => {
              return x.SemesterID % 2 !== 0 || x.SemesterID == 6; // Filter out odd SemesterIDs
            });
          } else {
            if (SemesterMaster) {
              this.SemesterMasterList = SemesterMaster.filter((x: { SemesterID: number }) => {
                return x.SemesterID % 2 === 0; // Filter out even SemesterIDs
              });
            }
          }
        },.500)
        
      }, (error: any) => console.error(error));
  }

  async GetGeneratedResultDetails() {
    try {
      this.searchReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      await this.resultService.GetGeneratedResultDetails(this.searchReq).then(async(data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GeneratedResultDetailsList = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  async openPublishResultModal(content: any, row: any, isWithOTP: boolean = false) {

    this.publishReq.SchemeID = row.SchemeId;
    this.publishReq.ResultTypeID = row.ResultTypeID;
    this.publishReq.EndTermID = row.EndTermID;
    this.publishReq.Eng_NonEng = row.Eng_NonEng;
    this.publishReq.SemesterID = row.SemesterID;

    this.isWithOTP = isWithOTP;
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });
  }

  CloseModalPopup_PublishResult() {
    this.modalService.dismissAll();
    this.publishReq = new Publish_Unpublish_BTER_ResultDataModel();
  }

  async onPublishResult() {
    if(
      this.publishReq.ResultDeclarationDate == null 
      || this.publishReq.ResultPublishDate == null 
      || this.publishReq.ResultDeclarationDate == "" 
      || this.publishReq.ResultPublishDate == ""
    ){
      this.toastr.error("Please select all mandatory fields.");
      return;
    }

    if(this.isWithOTP){
      this.childComponent_publish.MobileNo = this.sSOLoginDataModel.Mobileno

      // await for open model
      await this.childComponent_publish.OpenOTPPopup();

      // await OTP verification
      await this.childComponent_publish.waitForVerification();
      
      await this.Publish_BTER_Result();
    } 
    
    else {
      await this.Publish_BTER_Result();
    }
  }

  async Publish_BTER_Result() {
    try {
      this.publishReq.Key = "P";
      this.publishReq.ModifyBy = this.sSOLoginDataModel.UserID

      await this.resultService.Publish_Unpublish_BTER_Result(this.publishReq).then(async(data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async onUnpublishResult(row: any) {
    this.Swal2.Confirmation(`Are you sure you want to unpublish result !`,
    async (result: any) => {
      
      if (result.isConfirmed) {
        this.childComponent_unpublish.MobileNo = this.sSOLoginDataModel.Mobileno

        // await for open model
        await this.childComponent_unpublish.OpenOTPPopup();

        // await OTP verification
        await this.childComponent_unpublish.waitForVerification();
        
        await this.Unpublish_BTER_Result(row);
      }
    })
  }

  async Unpublish_BTER_Result(row: any) {
    try {
      const request: any = {} 
      request.Key = "U";
      request.ModifyBy = this.sSOLoginDataModel.UserID

      request.SchemeID = row.SchemeId;
      request.ResultTypeID = row.ResultTypeID;
      request.EndTermID = row.EndTermID;
      request.Eng_NonEng = row.Eng_NonEng;
      request.SemesterID = row.SemesterID;

      await this.resultService.Publish_Unpublish_BTER_Result(request).then(async(data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }
}
