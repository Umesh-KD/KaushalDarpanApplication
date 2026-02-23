import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Renderer2, signal, ViewChild, TemplateRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../Common/appsetting.service";
import { EnumDepartment, EnumRole, EnumStatus, EnumStatusOfStaff, GlobalConstants, ITIGovtEM_EnumStaffLevel, ITIGovtEM_EnumStaffLevelChild, ITIGovtEM_EnumStaffType } from "../../../Common/GlobalConstants";
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentDetailsModel } from "../../../Models/DocumentDetailsModel";
import { PreviewApplicationModel } from "../../../Models/PreviewApplicationformModel";
import { ItiApplicationFormService } from "../../../Services/ItiApplicationForm/iti-application-form.service";
import { LoaderService } from "../../../Services/Loader/loader.service";
import { ReportService } from "../../../Services/Report/report.service";
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ItiApplicationSearchmodel } from "../../../Models/ItiApplicationPreviewDataModel";
import { DropdownValidators } from "../../../Services/CustomValidators/custom-validators.service";
import { ITIStateTradeCertificateSearchModel } from "../../../Models/TheoryMarksDataModels";
import { ITICollegeStudentMarksheetSearchModel } from "../../../Models/ITI/ITICollegeStudentMarksheetSearchModel";
import { StudentMarksheetSearchModel } from "../../../Models/OnlineMarkingReportDataModel";

import { FontsService } from "../../../Services/FontService/fonts.service";
import { ITI_InstructorService } from "../../../Services/ITI/ITI_Instructor/ITI_Instructor.Service";
import {
  ITI_InstructorDataSearchModel, ITI_InstructorGridDataSearchModel, ITI_InstructorDataBindSearchModel,
  ITI_InstructorDataAssignSearchModel
} from "../../../Models/ITI/ItiInstructorDataModel";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterSearchModel } from "../../../Models/ITIGovtEMStaffMasterDataModel";
import { ITIGovtEMStaffMaster } from "../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service";
import { CommonVerifierApiDataModel } from "../../../Models/PublicInfoDataModel";
import { ITICollegeTradeSearchModel } from "../../../Models/ITI/SeatIntakeDataModel";
import { ItiSeatIntakeService } from "../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service";
import { SweetAlert2 } from "../../../Common/SweetAlert2";
import { OTPModalComponent } from "../../otpmodal/otpmodal.component";

@Component({
  selector: 'app-instructor-status-list',
  standalone: false,
  templateUrl: './instructor-status-list.component.html',
  styleUrl: './instructor-status-list.component.css'
})
export class InstructorStatusListComponent {

  public instructorRequest = new ITI_InstructorDataAssignSearchModel();
  public showpage:boolean=false
  public showView:boolean=false
  public showOption:boolean=false
  public showselect:boolean=false
  public searchrequest = new ITI_InstructorGridDataSearchModel();
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();
  public searchRequest = new ITI_InstructorDataBindSearchModel();
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new ITIGovtEMAddStaffBasicDetailDataModel();
  public StaffLevelList: any = [];
  public StaffLevelChildList: any = [];
  public searchRequestITi = new ITICollegeTradeSearchModel();
  sSOLoginDataModel: any;
  searchForm!: FormGroup;
  public _EnumRole = EnumRole
  public InstructorSearch = new ITI_InstructorDataSearchModel();
  public InstructorBindSearch = new ITI_InstructorDataBindSearchModel();
  selectedInstructor: any;
  public isLoading: boolean = false;
  assignStatus: string = '';
  public _ITIGovtEM_EnumStaffType = ITIGovtEM_EnumStaffType
  public _ITIGovtEM_EnumStaffLevel = ITIGovtEM_EnumStaffLevel
  public _ITIGovtEM_EnumStaffLevelChild = ITIGovtEM_EnumStaffLevelChild
  public HostelList: any = [];
  public BranchesMasterList: any = [];
  public TechnicianList: any = [];
  public HOD_DDlList: any = [];
  public StaffParentID: number = 0;
  public settingsMultiselect: object = {};
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public GetRoleID: number = 0
  public requestSSoApi = new CommonVerifierApiDataModel();
  public isSSOVisible: boolean = false;
  public GetDesignationID: number = 0
  public PostList: any = [];
  public selectedUid:string=''
  public ListITICollegeByManagement: any = [];
  public StaffTypeList: any[] = []
  shiftddl: any[] = [];
  SubjectMasterDDL: any[] = [];
  public SSOID: string = ''
  tooltipText = signal('');
  StudentExamsPapersList: any = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  // public MarksheetSearch1 = new StudentMarksheetSearchModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public GetInstructorDataList: any[] = [];
  public InstructorDetailsModelList: any[] = [];
  public isSubmitted: boolean = false;
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
  public Table_SearchText: string = "";
  public request = new ITI_InstructorGridDataSearchModel();
  public requests = new ITI_InstructorDataBindSearchModel();
  public isShowGrid: boolean = false;
  public ApplicationList:any=[]
  //public _ITIGovtEM_EnumStaffType = ITIGovtEM_EnumStaffType
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  collegeDropDown: any = [];
  closeResult: string | undefined;
  districtDropDown: any = [];

  constructor(
    private loaderService: LoaderService,
    private ApplicationService: ItiApplicationFormService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private fb: FormBuilder,
    private reportService: ReportService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private fontsService: FontsService,
    private ItiInstructorService: ITI_InstructorService,
    private router: Router,
    private modalService: NgbModal,
    private Staffservice: ITIGovtEMStaffMaster,
    private ITICollegeTradeService: ItiSeatIntakeService,
    private Swal2: SweetAlert2
  ) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
  }

  async ngOnInit() {
    this.searchForm = this.fb.group({
      Name: [''],
      Uid: [''],
      //ApplicationNo:['']
    });

    //this.InstructorBindSearch.ApplicationNo = '';


/*    await this.GetItiInstructorAssignData();*/
    //await this.StaffLevelType();
    //await this.GetTechnicianDll();
    //await this.StaffLevelChild();
    //await this.getITICollege();
    //await this.GetStaffTypeData();
    //await this.GetBranchesMasterData();
    //await this.ItiShiftUnitDDL(ID: number);

  }

  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }



  onResetClick() {
    this.searchForm.reset();
    this.InstructorBindSearch = {
      Uid: '',
      Name: '',
      RoleID:0
    };
    this.GetItiInstructorAssignData();
  }
  onViewDetail(Uid: any): void {
    debugger;
    this.selectedUid = Uid;
    this.showpage = true;
    this.showView = false;
    this.showOption = false;
    this.showselect = false;
  }
  onViewApp(Uid: any): void {
    debugger;
    this.selectedUid = Uid;
    this.showView = true;
    this.showpage = false
    this.showOption = false
    this.showselect = false
      ;
  }

  onViewOption(Uid: any): void {
    debugger;
    this.selectedUid = Uid;
    this.showOption = true;
    this.showpage = false
    this.showView = false;
    this.showselect = false;
  }
  onViewSelect(Uid: any): void {
    debugger;
    this.selectedUid = Uid;
    this.showOption = false;
    this.showpage = false
    this.showView = false;
    this.showselect = true;
  }

  //using this function
  async GetItiInstructorAssignData() {
    debugger;

    try {
      this.loaderService.requestStarted();
      const searchValues = this.searchForm.value;

      this.instructorRequest.DepartmentID = "2"
      this.instructorRequest.CollegeId = this.sSOLoginDataModel.InstituteID;

      await this.ItiInstructorService.GetInstructorListIsAssign(this.instructorRequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.InstructorDetailsModelList = data.Data;
          if (data && data.Data) {
            this.InstructorDetailsModelList = data.Data;
            this.totalInTableRecord = this.InstructorDetailsModelList.length;
            this.loadInTable();
          } else {
            this.toastr.error(this.Message);
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage);
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

  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.InstructorDetailsModelList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = [];
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.InstructorDetailsModelList.length;
  }

  async searchbtn_click() {
    this.InstructorBindSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.InstructorBindSearch.Uid = this.searchForm.value.Uid;
    this.InstructorBindSearch.Name = this.searchForm.value.Name;
  }


  CloseModalPopup() {
    this.modalService.dismissAll();
  }


  async onAssign(content: any, ID: string) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.SSOIDGetSomeDetails(ID);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }









  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {

    //if (SSOID == "") {
    //  this.toastr.error("Please Enter SSOID");
    //  return;
    //}

    const username = SSOID;
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;


    try {

      this.loaderService.requestStarted();
      this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            /*            this.DuplicateCheck(this.requestSSoApi.SSOID);*/
            //this.formData.Displayname = parsedData.displayName
            this.isSSOVisible = true;
            this.formData.Displayname = parsedData.displayName;
            this.formData.MobileNo = parsedData.mobile;
            this.formData.Mailpersonal = parsedData.mailPersonal;
            this.formData.SSOID = parsedData.SSOID;
            //this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.disable();
            if (parsedData.designation != null) {
              this.GetDesignationID = this.PostList.find((item: any) =>
                item.Name?.toLowerCase().trim() === parsedData.designation?.toLowerCase().trim()
              )?.ID ?? 0;

              this.formData.DesignationID = this.GetDesignationID;
            }
            else {
              this.formData.DesignationID = 0;
            }
          }
          else {
            this.toastr.error("Record Not Found");
            this.formData.SSOID = "";
            this.isSSOVisible = false;
            return;
          }
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  ResetControls() {
    this.isSubmitted = false;
    this.formData = new ITIGovtEMAddStaffBasicDetailDataModel();

    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.innerHTML = "Submit";
    this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
    this.isSSOVisible = false;
  }

  async openModalGenerateOTP() {

    if (this.SSOID == "") {
      this.Swal2.Error("Fill Valid SSOID")
      return
    }

    this.Swal2.Info("OTP Will send On Mobile Number Fill in Form")

    this.InstructorBindSearch.Uid = this.SSOID
//    try {
    /*    this.loaderService.requestStarted();*/

    await this.ItiInstructorService.GetGridBindInstructorData(this.InstructorBindSearch).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));

      this.childComponent.MobileNo = data['Data'][0]['Mobile']


    });
//  } catch(error) {
//    console.error(error);
//  } finally {
//    setTimeout(() => {
//      this.loaderService.requestEnded();
//    }, 200);
    //  }
    debugger

    // await for open model
    await this.childComponent.OpenOTPPopup();
    // await OTP verification
    await this.childComponent.waitForVerification();


    await this.ItiInstructorService.GetGridBindInstructorData(this.InstructorBindSearch).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));

      this.ApplicationList=data['Data']


    });

  }

  onOptionSaved(event: boolean) {
    if (event) {
      this.showOption = false;   // hide form
      this.showpage = false;   // hide form
      this.showView = false;   // hide form
      this.showselect = false;   // hide form

       this.ItiInstructorService.GetGridBindInstructorData(this.InstructorBindSearch).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.ApplicationList = data['Data']


      });
    }
  }

}
