import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { GlobalConstants, EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { CollegeMasterSearchModel, CollegeMasterDataModels } from '../../Models/CollegeMasterDataModels';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CollegeMasterService } from '../../Services/CollegeMaster/college-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { PolytechnicReportSearchModel } from '../../Models/PolytechnicReportModel/PolytechnicReportDataModel';
import { PloytechnicReoprtService } from '../../Services/Polytechnic-Report/ploytechnic-reoprt.service';

@Component({
  selector: 'app-polytechnic-report',
  standalone: false,
  templateUrl: './polytechnic-report.component.html',
  styleUrl: './polytechnic-report.component.css'
})

export class PolytechnicReportComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public CollegeMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public DivisionMasterList: any = [];
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  searchByInstituteCode: string = '';
  searchByInstituteName: string = '';
  searchByInstituteEmail: string = '';
  searchByManagementType: string = '';
  searchByDistrict: string = '';
  searchBySSOID: string = '';
  searchByStatus: number = 2;
  public filteredTehsils: any[] = [];
  public filteredDistricts: any[] = [];
  public DistrictMasterList: any = []
  public DistrictMasterLists: any = []
  public Table_SearchText: string = '';
  public _GlobalConstants = GlobalConstants
  public ManagmentTypeList: any = []
  public Type1List: any = []
  public Type2List: any = []
  public ExamTypeList: any = [];
  public originalCollegeMasterList: any = []
  public StreamMasterDDLList: any[] = [];
  public TehsilMasterList: any = [];
  public TehsilMasterLists: any = [];
  public ExamSystemList: any = [];
  public categoryList: any = []
  public CollegeTypeList: any = []
  public searchRequest = new PolytechnicReportSearchModel();
  public statusID: number = 0
  //table feature default
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
  //end table feature default
  public IsCollegeType: boolean = false
  request = new CollegeMasterDataModels();
  sSOLoginDataModel = new SSOLoginDataModel();
  MapKeyEng: number = 1;
  public DateConfigSetting: any = [];
  public _EnumRole = EnumRole
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  collegesemrequest = new PolytechnicReportSearchModel();


  public SemesterDetails: any[] = [];//copy of main data

  constructor(private commonMasterService: CommonFunctionService, private Router: Router,
    private collegeService: CollegeMasterService, private ploytechnicReoprtService: PloytechnicReoprtService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private modalService: NgbModal, private Swal2: SweetAlert2, private appsettingConfig: AppsettingService) {
  }

  async ngOnInit() {




    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.statusID = Number(this.router.snapshot.paramMap.get('id'));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;

    //this.loadDropdownData('ResultExamType');
    await this.GetDivisionMasterList()
    await this.GetDistrictMasterList();
    await this.GetManagmentType();
    await this.GetCollegeType();
    await this.getStreamMasterList();
    await this.GetTehsilMasterList();
    await this.GetMasterData();
    await this.GetCategory();
    await this.ChangeCollegeType();
    //if (this.statusID > 0) {
    //  this.searchRequest.Status = this.statusID
    //}
    await this.GetCollegeMasterList(1);

   // await this.GetPrintRollAdmitCardSetting();
  }

  // Method to handle the cancel button click
  ResetControl() {
    // Reset all filter fields
    this.searchByInstituteCode = '';
    this.searchByInstituteName = '';
    this.searchByInstituteEmail = '';
    this.searchByManagementType = '';
    this.searchByDistrict = '';
    this.searchBySSOID = '';
    this.GetCollegeMasterList(1);
  }


  ChangeCollegeType() {
    if (this.request.CollegeTypeID == 22) {
      this.IsCollegeType = true
    }
    else {
      this.IsCollegeType = false
    }
  }

  async GetMasterData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.ExamSystemList = data['Data'];
          console.log(this.ExamSystemList, "ExamSystemList");
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

  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

   async GetTehsilMasterList() {
     try {
       this.loaderService.requestStarted();
       await this.commonMasterService.GetTehsilMaster()
         .then((data: any) => {
           data = JSON.parse(JSON.stringify(data));
           this.State = data['State'];
           this.Message = data['Message'];
           this.ErrorMessage = data['ErrorMessage'];
           this.TehsilMasterList = data['Data'];
           console.log(this.TehsilMasterList)
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

  async GetCollegeType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CollegeType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeTypeList = data['Data'];
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


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.CollegeMasterList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'PolytechnicReportData.xlsx');
  }

  onSearchClick() {

    const searchCriteria: any = {
      InstituteCode: this.searchByInstituteCode.trim().toLowerCase(),
      InstituteNameEnglish: this.searchByInstituteName.trim().toLowerCase(),
      Email: this.searchByInstituteEmail.trim().toLowerCase(),
      ManagementType: this.searchByManagementType.trim().toLowerCase(),
      DistrictID: Number(this.searchByDistrict),
      SSOID: this.searchBySSOID.trim().toLowerCase()
    };



    this.CollegeMasterList = this.originalCollegeMasterList.filter((college: any) => {
      return Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }
        const collegeValue = college[key];
        if (typeof collegeValue === 'string') {
          return collegeValue.toLowerCase().includes(searchValue);
        }
        return collegeValue === searchValue;
      });
    });
    this.updateInTablePaginatedData();
  }

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ManagmentTypeList = data['Data'];

          //console.log(this.DivisionMasterList)
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

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }

  loadInTable() {
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  filteredItems() {
    this.CollegeMasterList = this.originalCollegeMasterList.filter((college: any) => {
      return Object.keys(college).some(key => {
        const collegeValue = college[key];
        if (typeof collegeValue === 'string' && collegeValue.toLowerCase().includes(this.Table_SearchText.toLowerCase())) {
          return true;
        }
        return false;
      });
    });
    this.updateInTablePaginatedData();
  }

  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.CollegeMasterList].slice(this.startInTableIndex, this.endInTableIndex);
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

  async GetDistrictMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictMasterList = data['Data'];
          console.log(this.DistrictMasterList)
          // console.log(this.DivisionMasterList)
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

  async GetDivisionMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];
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

  async GetCollegeMasterList(i: any) {

    

    console.log("i", i);
    if (i == 1) {
      this.pageNo = 1;
    } else if (i == 2) {
      this.pageNo++;
    } else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    } else {
      this.pageNo = i;
    }
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;

    this.searchRequest.InstituteCode = this.searchByInstituteCode;
    this.searchRequest.InstituteName = this.searchByInstituteName;
    this.searchRequest.Email = this.searchByInstituteEmail;

    this.searchRequest.SSOID = this.searchBySSOID;

    this.searchRequest.PageNumber = this.pageNo
    this.searchRequest.PageSize = this.pageSize
    try {
      this.loaderService.requestStarted();
      await this.ploytechnicReoprtService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeMasterList = data['Data'];

          this.totalRecord = this.CollegeMasterList[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

          this.originalCollegeMasterList = [...data['Data']]; // Keep a copy of original data
          this.totalInTableRecord = this.CollegeMasterList.length;
          this.loadInTable();
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


  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

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


  async ViewandUpdate(content: any, InstituteID: number) {
    
    const initialState = {
      InstituteID: InstituteID,
    };

    try {
      this.loaderService.requestStarted();
      await this.ploytechnicReoprtService.GetByID(InstituteID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.request.SSOID = data['Data']["SSOID"];
          this.request.Address = data['Data']["Address"];

          this.request.CollegeTypeID = data['Data']["CollegeTypeID"];
          this.request.CourseTypeID = data['Data']["CourseTypeID"];
          this.GetCollegeType();
          this.request.DivisionID = data['Data']["DivisionID"];
          this.ddlDivision_Change();
          this.request.DistrictID = data['Data']["DistrictID"];
          this.ddlDistrict_Change();
          this.request.TehsilID = data['Data']["TehsilID"];
          this.request.Email = data['Data']["Email"];
          this.request.FaxNumber = data['Data']["FaxNumber"];
          this.request.MobileNumber = data['Data']["MobileNumber"];
          this.request.InstituteCode = data['Data']["InstituteCode"];
          this.request.InstitutionManagementTypeID = data['Data']["InstitutionManagementTypeID"];
          this.request.InstitutionCategoryID = data['Data']["InstitutionCategoryID"];
          this.request.LandlineStd = data['Data']["LandlineStd"];
          this.request.LandNumber = data['Data']["LandNumber"];
          this.request.Website = data['Data']["Website"];
          this.request.InstituteNameEnglish = data['Data']["InstituteNameEnglish"];
          this.request.InstituteNameHindi = data['Data']["InstituteNameHindi"];
          this.request.PinCode = data['Data']["PinCode"];
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
          this.request.InstitutionDGTCode = data['Data']['InstitutionDGTCode']
          this.request.InstituteID = data['Data']['InstituteID']
          this.request.CreatedBy = data['Data']['CreatedBy'];
          /*const btnSave = document.getElementById('btnSave');*/
          //if (btnSave) btnSave.innerHTML = "Update";

          //const btnReset = document.getElementById('btnReset');
          //if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    // this.modalReference.componentInstance.initialState = initialState;

    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
  }
  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async ddlDivision_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterLists = data['Data'];
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

  async ddlDistrict_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.request.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterLists = data['Data'];
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

  onDivisionChange() {

    const selectedDivisionID = this.request.DivisionID;

    this.filteredDistricts = this.DistrictMasterLists.filter((district: any) => district.ID == selectedDivisionID);

  }

  async GetCategory() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.categoryList = data['Data'];
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


  onDistrictChange() {
    const selectedDistrictID = this.request.DistrictID;
    this.filteredTehsils = this.TehsilMasterList.filter((tehsil: any) => tehsil.ID == selectedDistrictID);
  }


  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetCollegeMasterList(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.CollegeMasterList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetCollegeMasterList(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetCollegeMasterList(3)
    }
  }


}
