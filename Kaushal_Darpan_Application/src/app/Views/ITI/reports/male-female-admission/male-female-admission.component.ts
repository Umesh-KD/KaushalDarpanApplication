import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../../Services/Center_Allocation/center-allocation.service';
import { CenterExamAllocationSearchModel, CenterAllocationtDataModels, InstituteList, ITIAssignPracticaLExaminer } from '../../../../Models/CenterAllocationDataModels';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { AllotmentConfigurationModel, ListAllotmentConfigurationModel } from '../../../../Models/AllotmentConfigurationDataModel';
import { AllotmentConfigurationService } from '../../../../Services/Allotment-Configuration/allotment-configuration.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { UserMasterService } from '../../../../Services/UserMaster/user-master.service';
import { FinalAdmissionListRequestModel, ZoneDistrictSeatUtilizationRequestModel, ZoneDistrictSeatUtilizationByGenderRequestModel } from '../../../../Models/TheoryMarksDataModels';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-male-female-admission',
  standalone: false,
  templateUrl: './male-female-admission.component.html',
  styleUrl: './male-female-admission.component.css'
})
export class MaleFemaleAdmissionComponent {
  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public requestModel = new ZoneDistrictSeatUtilizationByGenderRequestModel();
  public AllListConfiguration: ListAllotmentConfigurationModel[] = [];
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  public finalList: any[] = [];
  public backupFinalList: any[] = [];
  ReportService = inject(ReportService);
  public Districtlist: any = [];
  public Divisionlist: any = [];
  public Division: any = [];
  public divisionList: string[] = [];
  public districtList: string[] = [];
  public selectedDivision: number = 0;
  public selectedDistrict: number = 0;
  public Id: number = 0;
  //table feature default
  public paginatedInTableData: any[] = [];
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public filteredStatusList: any[] = [];
  public Table_SearchText: string = "";
  public isSubmitted: boolean = false;
  public isVisibleList: boolean = false;

  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private allotmentConfigurationService: AllotmentConfigurationService,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private userMasterService: UserMasterService
  ) { }



  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.Id = +params['Id'] || 0;
      await this.GetDistrictMaster();
      await this.GetDivisionMaster();
      await this.GetAdmissionByGenderList();
    });
  }

  async GetAdmissionByGenderList() { 
    this.requestModel = {
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      DistrictID: this.selectedDistrict,
      DivisionID: this.selectedDivision,
      Id: this.Id
    };

    try {
      this.loaderService.requestStarted();
      await this.ReportService.getZoneFinalAdmissionByGenderList(this.requestModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.finalList = data?.Data?.Table || [];
          this.totalInTableRecord = this.finalList.length;
          this.loadInTable();
        }, error => console.error(error));
    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        this.Districtlist = data.Data;
        console.log(this.Districtlist)
      });
    } catch(ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDivisionMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster().then((data: any) => {
        this.Divisionlist = data.Data;
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async SearchFinalList() {  

    this.finalList = this.backupFinalList.filter(item =>
      (!this.selectedDivision || item.Zone === this.selectedDivision) &&
      (!this.selectedDistrict || item.District === this.selectedDistrict)
    );
    this.GetAdmissionByGenderList();
  }


  public Reset() {
    this.selectedDivision = 0;
    this.selectedDistrict = 0;
    this.GetAdmissionByGenderList();
  }

  exportToExcel() {

    let classname = '';

    if (this.Id === 8) {
      classname = '8th';
    } else if (this.Id === 10) {
      classname = '10th';
    } else {
      this.toastr.warning('only for download 8 class and 10 class');
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.finalList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const fileName = `AdmissionByGenderList_${classname}_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }


  loadInTable() {
    debugger;
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }


  updateInTablePaginatedData() {
    debugger;
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.finalList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.finalList.length;
  }

}
