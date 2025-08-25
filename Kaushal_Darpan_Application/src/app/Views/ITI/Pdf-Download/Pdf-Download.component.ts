import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, ITI_Govt_EM_PersonalDetailByUserIDSearchModel, RequestUpdateStatus, JoiningLetterSearchModel, RelievingLetterSearchModel } from '../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumProfileStatus, EnumEMProfileStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { RequestSearchModel } from '../../../Models/ITI/UserRequestModel';
import { UserRequestService } from '../../../Services/UserRequest/user-request.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ReportService } from '../../../Services/Report/report.service';
import { ITIStateTradeCertificateSearchModel } from '../../../Models/TheoryMarksDataModels';

@Component({
  selector: 'app-Pdf-Download',
  standalone: false,
  
  templateUrl: './Pdf-Download.component.html',
  styleUrl: './Pdf-Download.component.css'
})
export class PdfDownloadComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel();
  public isSubmitted: boolean = false;
  groupForm!: FormGroup;
  public searchRequest = new ITIStateTradeCertificateSearchModel();
  public searchRequestJoining = new JoiningLetterSearchModel();
  public searchRequestRelieving = new RelievingLetterSearchModel();
  public searchRequestUpdateSSOIDByPricipleModel = new UpdateSSOIDByPricipleModel();
  staffDetailsFormData = new ITIGovtEMStaffMasterDataModel();
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public UserRequestList: any[] = [];
  public filteredStatusList: any[] = [];
  public DesignationMasterList: any[] = [];
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public ITIGovtEMOFFICERSList: any[] = [];
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;
  public StaffLevelList: any = [];
  public StaffLevelChildList: any = [];
  public OfficeList: any = [];
  public LevelList: any = [];
  public HostelList: any = [];
  public BranchesMasterList: any = [];
  public TechnicianList: any = [];
  public HOD_DDlList: any = [];
  public StaffParentID: number = 0;
  public settingsMultiselect: object = {};
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public ExamOfLevelList: any = [];
  public ExamTypeList: any = [];
  public QueryReqFormGroup!: FormGroup;
  public _EnumRole = EnumRole
  public GetRoleID: number=0
  public DdlType: string=''
  AddedEducationList: ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel[] = [];
  public educationDetailsRequest = new ITI_Govt_EM_PersonalDetailByUserIDSearchModel();
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;
  public CheckUserID: number = 0
  public _EnumProfileStatus = EnumProfileStatus;
  public type: string=''
  public RequestUpdateStatus = new RequestUpdateStatus();
  public RowlistData = new RequestUpdateStatus;
  public UserRequestHistoryList: any[] = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public PostList: any = [];
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

  constructor(private commonMasterService: CommonFunctionService, private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    private ITICollegeTradeService: ItiSeatIntakeService,
    private userRequestService: UserRequestService, private fb: FormBuilder, public appsettingConfig: AppsettingService, public ReportServices: ReportService


  ) {

  }



  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      
      //ddlPost: ['', [DropdownValidators]],
      //txtSSOID: ['', Validators.required],
      ddlLevelOfExamId: [''],
      ddlExamTypeID: [''],
      txtNameOfTheExam: [''],
      txtNameOfTheBoard: [''],
      txtStateOfTheBoard: [''], 
      txtDateOfPassing: [''],
      txtYearOfPassing: [''],
      txtSubject_Occupation_Branch: [''],
      txtNameOfTheInstituteFromWherePassed: [''],

    })

    this.groupForm = this.fb.group({
      ddlStatus: [0, [DropdownValidators]],
      txtRemark: ['', Validators.required]
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;    

    this.QueryReqFormGroup = this.formBuilder.group({
      txtSSOID: ['',[Validators.required]]
    });

 
    //this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID
   



    this.formData.LevelOfExamID = 0;
    this.formData.ExamTypeID = 0;
  
    
    this.CheckUserID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    console.log(this.CheckUserID)


    
 
    
    
    console.log(this.sSOLoginDataModel);
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  async PdfDownload() {
    
    try {
      
      this.loaderService.requestStarted();

      this.searchRequest.RollNo = "10017";

      await this.ReportServices.ITIStateTradeCertificateReport(this.searchRequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));

          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'JoiningLetter.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
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
    this.paginatedInTableData = [...this.UserRequestList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.UserRequestList.length;
  }


}
