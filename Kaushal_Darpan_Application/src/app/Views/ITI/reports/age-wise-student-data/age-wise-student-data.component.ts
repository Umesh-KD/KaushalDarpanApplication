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
import { VacantSeatRequestModel, StudentDataAgeBetween15And29RequestModel } from '../../../../Models/TheoryMarksDataModels';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-age-wise-student-data',
  standalone: false,
  templateUrl: './age-wise-student-data.component.html',
  styleUrl: './age-wise-student-data.component.css'
})
export class AgeStudentDataComponent {
  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public requestModel = new StudentDataAgeBetween15And29RequestModel();
  public AllListConfiguration: ListAllotmentConfigurationModel[] = [];
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ageStudentList: any[] = [];
  public backupFinalList: any[] = [];
  ReportService = inject(ReportService);
  public Districtlist: any = [];
  public Divisionlist: any = [];
  public Division: any = [];
  public divisionList: string[] = [];
  public districtList: string[] = [];
  public selectedDivision: number = 0;
  public selectedDistrict: number = 0;
  public id: number = 0;
  public ItiCollegesListAll: any[] = [];
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
  public selectedITIGcode: string = "";
  public selectedCollegeId: number = 0;
  public collegeSearchRequest: any = {};

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
    this.id = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    await this.GetAgeStudentDataList();

  }

  async GetAgeStudentDataList() {

    this.requestModel = {
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      TradeLevelID: this.id
    };

    try {
      this.loaderService.requestStarted();
      await this.ReportService.GetStudentDataAgeBetween15And29(this.requestModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ageStudentList = data?.Data?.Table || [];
          this.totalInTableRecord = this.ageStudentList.length;
          this.loadInTable();
          console.log(this.ageStudentList);
        }, error => console.error(error));
    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  GetAgeStudentDataExportToExcel() {

    let className = '';

    if (this.id === 8) {
      className = '8th';
    } else if (this.id === 10) {
      className = '10th';
    } else {
      this.toastr.warning('Only 8th or 10th class reports can be downloaded.');
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ageStudentList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const fileName = `AgeStudentDataList_${className}_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
 
  updateInTablePaginatedData() {

    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ageStudentList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.ageStudentList.length;
  }

}
