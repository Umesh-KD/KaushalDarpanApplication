import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Renderer2, signal, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../../Common/appsetting.service";
import { EnumDepartment, EnumRole, EnumStatus, EnumStatusOfStaff, GlobalConstants, ITIGovtEM_EnumStaffLevel, ITIGovtEM_EnumStaffLevelChild, ITIGovtEM_EnumStaffType } from "../../../../Common/GlobalConstants";
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentDetailsModel } from "../../../../Models/DocumentDetailsModel";
import { PreviewApplicationModel } from "../../../../Models/PreviewApplicationformModel";
import { ItiApplicationFormService } from "../../../../Services/ItiApplicationForm/iti-application-form.service";
import { LoaderService } from "../../../../Services/Loader/loader.service";
import { ReportService } from "../../../../Services/Report/report.service";
import { CommonFunctionService } from "../../../../Services/CommonFunction/common-function.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ItiApplicationSearchmodel } from "../../../../Models/ItiApplicationPreviewDataModel";
import { DropdownValidators } from "../../../../Services/CustomValidators/custom-validators.service";
import { ITIStateTradeCertificateSearchModel } from "../../../../Models/TheoryMarksDataModels";
import { ITICollegeStudentMarksheetSearchModel } from "../../../../Models/ITI/ITICollegeStudentMarksheetSearchModel";
import { StudentMarksheetSearchModel } from "../../../../Models/OnlineMarkingReportDataModel";

import { FontsService } from "../../../../Services/FontService/fonts.service";
import { ITI_InstructorService } from "../../../../Services/ITI/ITI_Instructor/ITI_Instructor.Service";
import { ITI_InstructorDataSearchModel, ITI_InstructorGridDataSearchModel, ITI_InstructorDataBindSearchModel } from "../../../../Models/ITI/ItiInstructorDataModel";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ITIGovtEMAddStaffBasicDetailDataModel, ITIGovtEMStaffMasterSearchModel } from "../../../../Models/ITIGovtEMStaffMasterDataModel";
import { ITIGovtEMStaffMaster } from "../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service";
import { CommonVerifierApiDataModel } from "../../../../Models/PublicInfoDataModel";
import { ITICollegeTradeSearchModel } from "../../../../Models/ITI/SeatIntakeDataModel";
import { ItiSeatIntakeService } from "../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service";
@Component({
  selector: 'app-marksheet',
  standalone: false,
  templateUrl: './iti-instructor.component.html',
  styleUrl: './iti-instructor.component.css'
})
export class ItiInstructorComponent{
  

  public searchrequest = new ItiApplicationSearchmodel();
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();
  public searchRequest = new ITIGovtEMStaffMasterSearchModel();
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
  public ListITICollegeByManagement: any = [];
  public StaffTypeList: any[] = []
  shiftddl: any[] = [];
  SubjectMasterDDL: any[] = [];

  tooltipText = signal(''); 
  StudentExamsPapersList: any = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  // public MarksheetSearch1 = new StudentMarksheetSearchModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public GetInstructorDataList: any[] = [];
  public InstructorDetailsModelList : any[] = [];
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
    private fontsService : FontsService,
    private ItiInstructorService: ITI_InstructorService,
    private router: Router,
    private modalService: NgbModal,
    private Staffservice: ITIGovtEMStaffMaster,
    private ITICollegeTradeService: ItiSeatIntakeService
  ) 
  {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
  }

  async ngOnInit() {
    this.searchForm = this.fb.group({
      Name: [''],
      Uid: [''],
      //ApplicationNo:['']
    });
    this.InstructorBindSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.InstructorBindSearch.Uid = '';
    this.InstructorBindSearch.Name = '';
    //this.InstructorBindSearch.ApplicationNo = '';

    this.AddStaffBasicDetailFromGroup = this.fb.group({
      ddlStaffType: [{ value: 30, disabled: true }, [DropdownValidators]],
      ddlStaffLevel: [''],
      ddlStaffLevelChild: [''],
      ddlTrade: [''],
      ddlTechnician: [''],
      ddlITICollegeTrade: [{ value: this.formData.InstituteID, disabled: true }, [DropdownValidators]],
      txtSSOID: [{ value: this.formData.SSOID, disabled: true }, [Validators.required]],
      txtName: [{ value: '', disabled: true }],
      txtMobileNo: [{ value: '', disabled: true }],
      txtEmailID: [{ value :'', disabled: true } ],
      ddlHostel: [''],
      Shift: ['']
    })
  
    await this.GetItiInstructorDatas();
    await this.StaffLevelType();
    await this.GetTechnicianDll();
    await this.StaffLevelChild();
    await this.getITICollege();
    await this.GetStaffTypeData();
    await this.GetBranchesMasterData();
    //await this.ItiShiftUnitDDL(ID: number);

  }

  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }

  async onSubmit() {  
    this.isSubmitted = true;
    if (this.searchForm.invalid) {
      console.log(this.searchForm.value)
      return
    }
  }

  onResetClick() {
    this.searchForm.reset();
    this.InstructorBindSearch = {
      Uid: '',
      Name: ''
    };
    this.GetItiInstructorDatas();
  }

  onViewDetail(Uid: any): void {
    debugger;
    console.log("item", Uid);
    this.router.navigate(
      ['/ItiInstructorFormView'],  
      { queryParams: { Uid: Uid } }
    );
  }

  //using this function
  async GetItiInstructorDatas() {

    try {
      this.loaderService.requestStarted();
      const searchValues = this.searchForm.value;

      this.InstructorBindSearch.Name = searchValues.Name;
      this.InstructorBindSearch.Uid = searchValues.Uid;
      this.InstructorBindSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      await this.ItiInstructorService.GetGridBindInstructorData(this.InstructorBindSearch)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.InstructorDetailsModelList = data.Data;
          if (data && data.Data) {
            this.InstructorDetailsModelList = data.Data;
            console.log(this.InstructorDetailsModelList)
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


   async deleteInstructorDataByID( id:number) {
    try {

      this.loaderService.requestStarted(); 
     
      await this.ItiInstructorService.deleteInstructorDataByID(id)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));

          if (data && data.Data) {
              this.ngOnInit();
              if(Object.keys(data).includes('Data')){
                this.GetInstructorDataList = data['Data'];
              }
              else{
                this.GetInstructorDataList = [data];
              }
          
            console.log(data);
            
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


  

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  async GetChange() {
    this.AddValidationStaffLevelNon();
    this.ItiShiftUnitDDL();
    //this.onTradeChange();

    try {
      this.formData
      await this.StaffLevelChild();

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


  async StaffLevelChild() {

    this.formData.StaffLevelChildID = 0;
    this.AddValidationStaffLevelNon();
    this.formData.Show_StaffLevelChild = true;
    this.searchRequest.StaffLevelID = this.formData.StaffLevelID;
    /* alert(this.searchRequest.StaffLevelID);*/


    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.Staffservice.StaffLevelChild(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffLevelChildList = data['Data'];
          this.StaffLevelChildList = this.StaffLevelChildList.filter((item: any) => item.ID != 15 );
          //if (this.formData.BranchID != 0) {

          //} 
          console.log(this.StaffLevelChildList, "StaffLevelChildList")
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

  async GetTechnicianDll() {

    try {
      this.loaderService.requestStarted();
      this.StaffParentID = 12;
      await this.commonMasterService.GetTechnicianDDL(this.StaffParentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TechnicianList = data['Data'];
          console.log('TechnicianList', this.TechnicianList)
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


  async AddValidationStaffLevelNon() {
    if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.NonTeaching) {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].setValidators([DropdownValidators]);
    }
    else if(this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching) {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].setValidators([DropdownValidators]);
    }
    else {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevelChild'].updateValueAndValidity();
  }

  async GetChangeTechcian() {
    if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching && this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
      this.AddStaffBasicDetailFromGroup.controls['ddlTechnician'].setValidators([DropdownValidators]);
    } else {
      this.AddStaffBasicDetailFromGroup.controls['ddlTechnician'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['ddlTechnician'].updateValueAndValidity();

    this.formData.multiHostelIDs = "";
    if (this.formData.StaffLevelID == this._ITIGovtEM_EnumStaffLevel.HostelWarden) {
      await this.GetHostelData();

      this.AddStaffBasicDetailFromGroup.controls['ddlHostel'].setValidators([Validators.required]);
    }
    else {
      this.AddStaffBasicDetailFromGroup.controls['ddlHostel'].clearValidators();
    }

    this.AddStaffBasicDetailFromGroup.controls['ddlHostel'].updateValueAndValidity();
  }

  async GetHostelData() {
    try {
      this.loaderService.requestStarted();
      this.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.commonMasterService.GetHostelDDL(this.DepartmentID, this.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.HostelList = data.Data;
        console.log("HostelList", this.HostelList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  getSubjectMasterDDL(ID: any, SemesterID: any) {

    this.AddStaffBasicDetailFromGroup.patchValue({
      SubjectID: 0,
      ShiftId: 0
    });

    this.ItiShiftUnitDDL(ID);

    if (ID && SemesterID != "" && SemesterID != null) {
      this.commonMasterService.SubjectMaster_StreamIDWise(
        ID,
        this.sSOLoginDataModel.DepartmentID,
        SemesterID
      ).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      });
    } else {
      console.error('Event or value is undefined');
    }
  }


  async DuplicateCheck(SSOID: string) {

    // console.log('id test ', this.searchRequest.DivisionID);
    try {
      this.loaderService.requestStarted();
      await this.Staffservice.ITIGovtEM_SSOIDCheck(SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


          }
          else if (data.State == EnumStatus.Warning) {

            const msg = `SSOID ${SSOID} is already mapped.To assign a new role, please use the Additional Role Mapping section.`;
            this.toastr.warning(msg);
            this.formData.SSOID = '';
            this.isSSOVisible = false;
            this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
          }
          else {
            this.toastr.error(data.ErrorMessage);
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


  async getITICollege() {
    try {
      this.searchRequestITi.Action = "_ITICollegeByManagementType";
      this.searchRequestITi.FinancialYearID = 9;
      this.searchRequestITi.ManagementTypeId = 0;

      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.getITICollegeByManagement(this.searchRequestITi)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITICollegeByManagement = data['Data'];

          this.ListITICollegeByManagement = this.ListITICollegeByManagement.filter((item: any) => item.ID == this.sSOLoginDataModel.InstituteID)

          console.log(this.ListITICollegeByManagement, "ListITICollegeByManagement")
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

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {
    debugger;

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
          console.log("parsedData", parsedData);
          if (parsedData != null) {
            /*this.DuplicateCheck(this.requestSSoApi.SSOID);*/
            //this.formData.Displayname = parsedData.displayName
            this.isSSOVisible = true;
            this.formData.Displayname = parsedData.displayName;
            this.formData.MobileNo = parsedData.mobile;
            this.formData.Mailpersonal = parsedData.Mailpersonal;
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

  async AddValidationStaffWiseNon() {

    if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.NonTeaching) {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevel'].setValidators([DropdownValidators]);

    } else {
      this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevel'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['ddlStaffLevel'].updateValueAndValidity();

  }

  async AddValidationStaffWise() {

    if (this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching) {
      this.AddStaffBasicDetailFromGroup.controls['ddlTrade'].setValidators([DropdownValidators]);

    } else {
      this.AddStaffBasicDetailFromGroup.controls['ddlTrade'].clearValidators();

    }
    this.AddStaffBasicDetailFromGroup.controls['ddlTrade'].updateValueAndValidity();

  }

  async GetBranchesMasterData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchesMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async StaffLevelType() {

    this.formData.StaffLevelID = 0;
    this.formData.StaffTypeID = 30;
    this.AddValidationStaffWiseNon();
    this.AddValidationStaffWise();

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.StaffTypeID = this.formData.StaffTypeID;
    //Teaching=30
    if (this.searchRequest.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching) {
      this.formData.StaffLevelID = this._ITIGovtEM_EnumStaffLevel.TeachingRole;
      this.formData.BranchID = 0;
      await this.GetBranchesMasterData();
      this.formData.HostelID = 0;
      await this.StaffLevelChild();


    }
    //Non Teaching=31
    if (this.searchRequest.StaffTypeID == this._ITIGovtEM_EnumStaffType.NonTeaching) {
      this.HOD_DDlList = [];
      this.formData.HODsId = 0;
      this.formData.BranchID = 0;
      this.formData.TechnicianID = 0;

      await this.StaffLevelChild();
    }

    this.formData.Show_StaffLevelChild = false;

    try {
      this.loaderService.requestStarted();
      await this.Staffservice.StaffLevelType(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "sss");
          this.StaffLevelList = data['Data'];
          this.StaffLevelList = this.StaffLevelList.filter((item: any) => item.ID == 30 || item.ID == 30 || item.ID == 30);
          console.log(this.StaffLevelList, "StaffLevelList")
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


  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = this.StaffTypeList.filter((x: any) => x.ID === 30);
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      })
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


  async OnFormSubmit() {

    debugger;

    try {
      this.loaderService.requestStarted();
      this.isSubmitted = true;
      if (!this.AddStaffBasicDetailFromGroup.invalid) {
        return
      }

      this.isLoading = true;

      this.formData.ModifyBy = this.sSOLoginDataModel.UserID;
      this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.formData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;


      //if (this.formData.StaffLevelID != this._ITIGovtEM_EnumStaffLevel.HostelWarden) {
      //  this.formData.HostelID = 0;
      //}

      //if (this.formData.StaffID == 0 && this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.NonTeaching) {
      //  this.formData.StatusOfStaff = EnumStatusOfStaff.Draft;
      //}

      if (this.formData.StaffID == 0 && this.formData.StaffTypeID == this._ITIGovtEM_EnumStaffType.Teaching) {
        this.formData.StatusOfStaff = EnumStatusOfStaff.Draft;
      }

      //if (this.formData.StaffLevelChildID != this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
      //  this.formData.TechnicianID = 0;
      //}

      //if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.HostelWarden) {
      //  if (this.sSOLoginDataModel.DepartmentID == 1) {
      //    this.formData.RoleID = 0;
      //  }
      //  else {
      //    if (this.sSOLoginDataModel.DepartmentID == 2 && this.sSOLoginDataModel.Eng_NonEng == 1) {
      //      this.formData.RoleID = 0;
      //    }
      //    else if (this.sSOLoginDataModel.DepartmentID == 2 && this.sSOLoginDataModel.Eng_NonEng == 2) {
      //      this.formData.RoleID = 0;
      //    }

      //  }

      //}
      //else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.TPO) {
      //  this.formData.RoleID = 0;
      //}
      //else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.GuestRoomWarden) {
      //  this.formData.RoleID = 0;
      //}


      //else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.Lecturer) {
      //  this.formData.RoleID = 0;
      //}

      //else if (this.formData.StaffLevelChildID == this._ITIGovtEM_EnumStaffLevelChild.LabIncharge) {
      //  this.formData.RoleID = 0;
      //}
      //else {
      //  this.formData.RoleID = 0;
      //}
      this.formData.EMTypeID = 1;

      //if (this.formData.HostelIDs.length > 0) {
      //  this.formData.multiHostelIDs = this.formData.HostelIDs.map((item: any) => item.ID).join(',');
      //} else {
      //  this.formData.multiHostelIDs = "";
      //}
      //this.formData.RoleID = 222;
      this.formData.IsInstructor = true;
      this.formData.OfficeID = this.sSOLoginDataModel.OfficeID;
      //save
      await this.Staffservice.SaveStaffBasicInstructorDetails(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.CloseModalPopup();
      
            this.ResetControls();
            //this.GetAllData();

            //const btnSave = document.getElementById('btnSave');
            //if (btnSave) btnSave.innerHTML = "Submit";
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
            this.CloseModalPopup();
            //this.ResetControls();
          }
          else {

            this.toastr.error(this.ErrorMessage)
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


  async ItiShiftUnitDDL(ID: number=0) {

    debugger;

    try {
      debugger
      await this.commonMasterService.ItiShiftUnitDDL(this.formData.BranchID, this.sSOLoginDataModel.FinancialYearID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.shiftddl = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
  }



  async onAssign(content: any, ID: string) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.GetById(ID);
  }




  async GetById(ID: string) {
    debugger;
    try {
      this.loaderService.requestStarted();

      //if (!ID || ID.trim() === "") {
      //  this.toastr.error("Please Enter SSOID");
      //  return;
      //}

      let data: any = await this.ItiInstructorService.GetInstructorDataBySsoid(ID);
      data = JSON.parse(JSON.stringify(data));  

      if (data?.Data?.Table && data.Data.Table.length > 0) {
        
        const instructor = data.Data.Table[0];
  
        this.formData.SSOID = instructor.Uid;
        this.formData.Displayname = instructor.Name;
        this.formData.MobileNo = instructor.Mobile;
        this.formData.Mailpersonal = instructor.Email;
        this.formData.InstituteID = this.sSOLoginDataModel.InstituteID;
        //this.formData.InstituteName = instructor.
       // console.log(instructor);
        //instructor.Email = this.formData.Mailpersonal
        this.AddStaffBasicDetailFromGroup.patchValue({
          txtSSOID: instructor.Uid,
          txtName: instructor.Name,
          txtMobileNo: instructor.Mobile,
          txtEmailID: instructor.Email,  
          ddlITICollegeTrade: instructor.InstituteID
        });
        this.getITICollege()

      } else {
        await this.SSOIDGetSomeDetails(ID);
      }

      console.log('Request Datas:', this.request);

    } catch (ex) {
      console.error('Error in GetById:', ex);
      this.toastr.error("Something went wrong while fetching details.");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  

}

