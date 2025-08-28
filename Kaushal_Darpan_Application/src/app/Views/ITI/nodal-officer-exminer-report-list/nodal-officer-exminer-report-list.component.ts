import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, RequestUpdateStatus } from '../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITINodalOfficerExminerReportService } from '../../../Services/ITI/ITINodalOfficerExminerReport/ITINodalOfficerExminerReport.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { UserMasterService } from '../../../Services/UserMaster/user-master.service';
import { AssignRoleRightsService } from '../../../Services/AssignRoleRights/assign-role-rights.service';
import { AssignRoleRightsDataModel, UserMasterModel } from '../../../Models/UserMasterDataModel';
import { ITINodalOfficerExminerSearch } from '../../../Models/ITI/ITINodalOfficerExminerReportModel';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
@Component({
  selector: 'app-nodal-officer-exminer-report-list',
  standalone: false,
  
  templateUrl: './nodal-officer-exminer-report-list.component.html',
  styleUrl: './nodal-officer-exminer-report-list.component.css'
})
export class NodalOfficerExminerReportListComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITI_Govt_EM_ZonalOFFICERSDataModel();
  public isSubmitted: boolean = false;

  public searchRequest = new ITINodalOfficerExminerSearch();

 
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';



  
  public ITIGovtEMOFFICERSList: any[] = [];
  
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;
  
  
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole 
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public filteredStatusList: any[] =[];
  public RequestUpdateStatus = new RequestUpdateStatus();
  groupForm!: FormGroup;
  public type: string = ''
  public Govt_EM_GetUserLevelDetails: any = [];
  public SuccessMessage: any = [];
  request = new UserMasterModel();
  public RoleMasterList: AssignRoleRightsDataModel[] = [];
  public ITINodalOfficerExminerReportList: any = [];
  public ITINodalOfficerExminerReportListDetails: any = [];
  //end table feature default
  allSelected = false;
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  totalRecord: any = 0;
  TotalPages: any = 0;
  pageSize: any = 50;
  constructor(private commonMasterService: CommonFunctionService, private ITINodalOfficerExminerReportService: ITINodalOfficerExminerReportService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2, private appsettingConfig: AppsettingService, private http: HttpClient,
    private ITICollegeTradeService: ItiSeatIntakeService, private UserMasterService: UserMasterService, private fb: FormBuilder, private assignRoleRightsService: AssignRoleRightsService
  ) {

  }



  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({     

    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   


    await this.GetZonalList()
   

  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  

 

 


  async GetZonalList() {
    
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    //this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID
    try {
      this.loaderService.requestStarted();
      await this.ITINodalOfficerExminerReportService.ITINodalOfficerExminerReport_GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ITINodalOfficerExminerReportList = data['Data'];
          this.loadInTable()
          console.log(this.ITINodalOfficerExminerReportList, "ITINodalOfficerExminerReportList")
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




  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ITINodalOfficerExminerReportList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.ITINodalOfficerExminerReportList.length;
  }



 

  ResetControl() {
    this.isSubmitted = false;
    this.formData = new ITI_Govt_EM_ZonalOFFICERSDataModel();
    this.ITINodalOfficerExminerReportList = [];
    //const btnSave = document.getElementById('btnSave');
    //if (btnSave) btnSave.innerHTML = "Submit";
  }

  
  async onUserRequestHistorylist(model: any, ID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequest.ID = ID;
      await this.ITINodalOfficerExminerReportService.ITINodalOfficerExminerReport_GetAllDataByID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITINodalOfficerExminerReportListDetails = data.Data;
          this.totalRecord = this.ITINodalOfficerExminerReportListDetails[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        }, (error: any) => console.error(error))

      console.log(ID, "modal");
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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

  CloseModalRequestHistorylist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }






  downloadPDF(id: number, ExamDateTime:string) {


    //this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    //this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    //this.searchRequest.Eng_NonEng = this.CourseType;
    try {
      this.ITINodalOfficerExminerReportService.Generate_ITINodalOfficerExminerReport_ByID(id, this.sSOLoginDataModel.DistrictID, ExamDateTime)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.PDFURL, 'UndertakingExaminerDetails');
            //this.GetAssignexaminer();
            /*this.GenerateCenterSuperintendentOrder(FileName, DownloadfileName, type)*/
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
          }
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }

  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    debugger;
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = 'Generate_ITINodalOfficerExminerReport_ByID'; // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

 

}
