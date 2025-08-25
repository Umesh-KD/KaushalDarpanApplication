import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumRole, GlobalConstants, EnumStatus } from '../../../../Common/GlobalConstants';
import { StudentExamDetails } from '../../../../Models/DashboardCardModel';
import { DownloadMarksheetSearchModel } from '../../../../Models/DownloadMarksheetDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { ResultService } from '../../../../Services/Results/result.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { RequestUpdateStatus } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { ITIAddmissionReportSearchModel, ITIAddmissionWomenReportSearchModel } from '../../../../Models/TheoryMarksDataModels';
import { ItiCollegesSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BudgetDistributeModel, BudgetHeadSearchFilter } from '../../../../Models/ITI/BudgetDistributeDataModel';
import { BudgetDistributedService } from '../../../../Services/BudgetDistributed/budget-distributed.service';

@Component({
  selector: 'app-budget-distribute',
  standalone: false,
  templateUrl: './budget-distribute.component.html',
  styleUrl: './budget-distribute.component.css'
})
export class BudgetDistributeComponent {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  /*public searchRequest = new ITIAddmissionWomenReportSearchModel();*/
  public searchRequest = new BudgetHeadSearchFilter();
  public collegeRequest = new ItiCollegesSearchModel();
  public Request = new BudgetDistributeModel();
  sSOLoginDataModel: any;
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public AddmissionList: any[] = [];
  modalService = inject(NgbModal);
  closeResult: string | undefined;
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
  public filteredStatusList: any[] = [];
  public Table_SearchText: string = "";
  public isSubmitted: boolean = false;
  public isVisibleList: boolean = false;
  public isVisibleDownload: boolean = false;
  public DivisionMasterList: any = [];
  public DistrictMasterList: any = [];
  public CollegeMasterList: any = [];
  public TradeMasterList: any = [];

  public BudgetUtilizationsList: any[] = [];
  public ColegeAmount: string = '';
  public CollegeName: string = '';
  public Remarks: string = '';
  public SelectedCollegeName: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private resultService: ResultService,
    private budgetDistributedService: BudgetDistributedService,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private menuService: MenuService,
    public ReportServices: ReportService,
    private formBuilder: FormBuilder

  ) {
    // Get user data from localStorage
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      Amount: ['', Validators.required],
      Remark: ['', Validators.required],

    })

    await this.GetList();
    await this.ddlITITrade();
    await this.ddlITIColleges();
  }


  get _BudgetFormGroup() { return this.AddStaffBasicDetailFromGroup.controls; }

  async ddlITIColleges() {
    try {

      this.loaderService.requestStarted();
      this.collegeRequest.action = "_getDataITIcollege";
      this.collegeRequest.DistrictID = 0;
      this.collegeRequest.ManagementTypeID = 0;
      await this.commonMasterService.ItiCollegesGetAllData(this.collegeRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CollegeMasterList = data['Data'];
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



  async ddlITITrade() {
    try {

      this.loaderService.requestStarted();
      this.collegeRequest.action = "_getDataITITrade";
      this.collegeRequest.DistrictID = 0;
      this.collegeRequest.ManagementTypeID = 0;
      await this.commonMasterService.ItiCollegesGetAllData(this.collegeRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TradeMasterList = data['Data'];
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


  async GetList() {
    try {
      debugger;
      this.searchRequest.CollegeID 
      this.loaderService.requestStarted();
      await this.budgetDistributedService.GetAllBudgetManagementData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AddmissionList = data.Data;
          this.isVisibleList = true;
          this.isVisibleDownload = true;
          this.loadInTable();
         /* this.AddmissionList = data.Data;*/
          console.log(this.AddmissionList, "AddmissionList")
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


  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


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
    this.paginatedInTableData = [...this.AddmissionList].slice(this.startInTableIndex, this.endInTableIndex);
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
    //this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.AddmissionList.length;
  }


  onResetClick() {
    this.searchRequest.CollegeID = 0;
    this.searchRequest.DistributedID
      = 0;
    this.AddmissionList = [];
    this.paginatedInTableData = [];
    this.GetList();
  }


  exportToExcel(): void {
    const unwantedColumns = [''];
    const filteredData = this.AddmissionList.map(item => {
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
    XLSX.writeFile(wb, 'BudgetDistributedDetailReport.xlsx');
  }

  ResetControls() {
    this.Request = new BudgetDistributeModel();

  }


  async AssignBudget() {
    try {
      debugger;
      this.isSubmitted = true;
      if (this.AddStaffBasicDetailFromGroup.invalid) {
        console.log("errro")
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.Request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.Request.FinYearID = this.sSOLoginDataModel.FinancialYearID
      this.Request.DistributedType = 1

      this.Request.ActionType = this.Request.DistributedID == 0 ? "INSERT" : "UPDATE";

      //save
      await this.budgetDistributedService.SaveData(this.Request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.GetList();
            this.ResetControls();
            this.CloseModal();
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

  async GetBudgetUtilizationsList() {
    try {
      debugger;
      this.searchRequest.FinYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.ActionName = "GetCollegeUtilizationbyID";

      this.loaderService.requestStarted();
      // this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.budgetDistributedService.GetBudgetUtilizationsData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BudgetUtilizationsList = data.Data;

          this.Remarks = this.BudgetUtilizationsList[0].Remarks;

          console.log(this.BudgetUtilizationsList, "BudgetUtilizationsList")
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

  getTotalUtilizationAmount(): number {
    return this.BudgetUtilizationsList?.reduce((sum, item) => sum + (item.UtilizationAmount || 0), 0) || 0;
  }

  async Utilize(content: any, row: any, indexNum: number) {
    debugger;
    this.CollegeName = row.CollegeName
    this.ColegeAmount = row.Amount
    console.log(row, 'RowData');
    try {
      debugger;
      this.searchRequest.DistributedID = row.DistributedID
      this.GetBudgetUtilizationsList();
      await this.modalService
        .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } catch (error) {
      console.error('Error opening modal:', error);
      this.toastr.error('Failed to open modal. Please try again.');
    }
  }


  async openModal(content: any, row: any, indexNum: number) {
    console.log(row, 'RowData');
    try {
      debugger;
      this.Request.CollegeID = row.CollegeId
      await this.modalService
        .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } catch (error) {
      console.error('Error opening modal:', error);
      this.toastr.error('Failed to open modal. Please try again.');
    }
  }

  private getDismissReason(reason: any): string
  {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  CloseModal() {

    this.modalService.dismissAll();
    // Reset dropdown ready flag

  }


}
