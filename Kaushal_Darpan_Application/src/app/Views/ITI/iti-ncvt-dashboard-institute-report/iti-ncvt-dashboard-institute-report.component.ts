import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ITISeatIntakesModel, ITIsDataModels, ITIsSearchModel } from '../../../Models/ITIsDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ItiTradeSearchModel } from '../../../Models/CommonMasterDataModel';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { CollegeMasterDataModels, CollegeMasterSearchModel } from '../../../Models/CollegeMasterDataModels';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-iti-ncvt-dashboard-institute-report',
  standalone: false,
  templateUrl: './iti-ncvt-dashboard-institute-report.component.html',
  styleUrl: './iti-ncvt-dashboard-institute-report.component.css'
})
export class ITINcvtDashboardInstituteReportComponent {
  groupForm!: FormGroup;
  public isSubmitted: boolean = false;
  public State: number = -1;
  public Message: any = [];

  _EnumRole = EnumRole;

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public InstituteCategoryList: any = [];
  public ItiTradeList: any = [];
  public ITITradeSchemeList: any = [];
  public ManagmentTypeList: any = [];
  public ITIRemarkList: any = [];
  public Districtlist: any = [];
  public Tehsillist: any = [];
  public CourseTypeList: any = [];
  public itiList: any = [];
  public rows: ITISeatIntakesModel[] = []
  request = new ITIsSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchrequest = new ITIsSearchModel()
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public CollegeTradeList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel()
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  public Table_SearchText: string = "";
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
  collegesemrequest = new CollegeMasterSearchModel();
  public Type1List: any = []
  public Type2List: any = []
  _GlobalConstants = GlobalConstants;

  public SemesterDetails: any[] = [];//copy of main data
  //end table feature default

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private ITIsService: ITIsService,
    private addITIsService: ITIsService,
    private router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2, private renderer: Renderer2,
    private appsettingConfig: AppsettingService,
  ) { }


  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlInstituteCategoryId: ['', [DropdownValidators]],
      txtSSOID: ['', Validators.required],
      txtName: ['', Validators.required],
      txtEmailAddress: ['', Validators.required],
      txtFaxNumber: ['', Validators.required],
      ddlManagementType: ['', [DropdownValidators]],
      txtCollegeCode: ['', Validators.required],
      txtDGTCode: ['', Validators.required],
      txtMobileNumber: ['', Validators.required],
      txtPincode: ['', Validators.required],
      check8th: [false],
      check10th: [false],
      check12th: [false]
    });


    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchrequest.FeeStatus = -1;
    this.searchrequest.Status = -1;
    this.GetInstituteCategoryList();
    this.GetManagmentType();
    this.GetTradeListDDL();
    this.GetTradeSchemeDDL();
    this.GetDistrictMaster();
    this.GettehsilMaster();
    this.GetStreamType();
    this.GetRemark();
    this.GetNCVTInstituteList();

    //await this.GetPrintRollAdmitCardSetting();

  }

  async GetInstituteCategoryList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory().then((data: any) => {
        this.InstituteCategoryList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType().then((data: any) => {
        this.ManagmentTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetRemark() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Remark').then((data: any) => {
        this.ITIRemarkList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        this.Districtlist = data.Data;
      });
    } catch (error) {
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GettehsilMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTehsilMaster().then((data: any) => {
        this.Tehsillist = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetStreamType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStreamType().then((data: any) => {
        this.CourseTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetTradeListDDL() {
    try {
      this.loaderService.requestStarted();
      this.tradeSearchRequest.action = "_getAllData"

      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ItiTradeList = parsedData.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeSchemeDDL() {
    const MasterCode = "IITTradeScheme";
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetSearch() {
    this.searchrequest = new ITIsSearchModel();
    this.searchrequest.FeeStatus = -1;
    this.searchrequest.Status = -1;
    this.GetNCVTInstituteList();
  }

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'Id', 'Status', 'RemarkForStatus', 'FeePdf', 'RTS'
    ];
    const filteredData = this.itiList.map((item: { [x: string]: any; }) => {
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
    XLSX.writeFile(wb, 'Iti_NCVT_Institute_List.xlsx');
  }

 

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.itiList.length;
  }
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.itiList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }


  async GetNCVTInstituteList() {
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    try {
      this.loaderService.requestStarted();
      await this.ITIsService.ITIAllInstituteList_NCVT(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.itiList = data['Data'];

          this.loadInTable();
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.itiList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }

}
