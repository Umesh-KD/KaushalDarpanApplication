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
  public BudgetUtilizationsListSave: any[] = [];
  public ColegeAmount: string = '';
  public CollegeName: string = '';
  public Remarks: string = '';
  public SelectedCollegeName: string = '';
  public TotalUtilizedBudget: number = 0;
  public TotalCollegeTrainee: number = 0;
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
       ;
      this.searchRequest.CollegeID
      this.loaderService.requestStarted();
      this.searchRequest.FinYearID = this.sSOLoginDataModel.FinancialYearID;
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
    const unwantedColumns = ['CollegeId','DistributedID'];
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
      this.searchRequest.FinYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.ActionName = "GetCollegeUCHeadUtilization";

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
  async GetBudgetUtilizationsList_Save() {
    try {
      this.searchRequest.FinYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.ActionName = "GetCollegeUtilizationbyID";

      this.loaderService.requestStarted();
      // this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.budgetDistributedService.GetBudgetUtilizationsData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BudgetUtilizationsListSave = data.Data;

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

  async GetBudget_HeadWise(collegeID: number) {
    try {
      this.searchRequest.FinYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.AcademicYearID = 9; 
      this.searchRequest.ActionName = "GetHeadWiseBudget";
      this.searchRequest.BudgetTypeID = 2;
      this.searchRequest.InstituteId = collegeID;

      this.loaderService.requestStarted();
      // this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.budgetDistributedService.GetBudget_HeadWise(this.searchRequest)
        .then((data: any) => {
          debugger
          data = JSON.parse(JSON.stringify(data));
          this.BudgetUtilizationsListSave = data.Data;
          this.calculateAllEstimated();
          this.BudgetUtilizationsListSave.map((item: any) => {
            if(item.HeadID == 1) {
              item.UnitValue === this.BudgetUtilizationsListSave[0].TotalTrainee
            }
          })
          this.Remarks = this.BudgetUtilizationsListSave[0].Remarks;

          console.log(this.BudgetUtilizationsListSave, "BudgetUtilizationsList")
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

  calculateEstimatedAmount(item: any) {
    if (item.IsUnitWise) {
      // multiply Amount * UnitValue
      item.EstimatedAmount = (Number(item.Amount) || 0) * (Number(item.UnitValue) || 0);
    } else {
      // just take Amount as Estimated
      item.EstimatedAmount = Number(item.Amount) || 0;
    }
  }

  calculateAllEstimated() {
    this.BudgetUtilizationsListSave.forEach(item => this.calculateEstimatedAmount(item));
  }

  getTotalUtilizationAmount(): number {
    return this.BudgetUtilizationsList?.reduce((sum, item) => sum + (item.UtilizationAmount || 0), 0) || 0;
  }

  getTotalEstimatedAmount_Save(): number {
    return this.BudgetUtilizationsListSave?.reduce((sum, item) => sum + (item.EstimatedAmount || 0), 0) || 0;
  }

  getTotalAllottedAmount_Save(): number {
    return this.BudgetUtilizationsListSave?.reduce((sum, item) => sum + (item.AllotAmount || 0), 0) || 0;
  }

  async Utilize(content: any, row: any, indexNum: number) {
    this.CollegeName = row.CollegeName
    this.ColegeAmount = row.Amount
    console.log(row, 'RowData');
    try {
       ;
      this.searchRequest.DistributedID = row.DistributedID
      await this.GetBudgetUtilizationsList();
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
       ;
      this.Request.CollegeID = row.CollegeId
      // await this.GetBudgetUtilizationsList_Save();
      await this.GetBudget_HeadWise(row.CollegeId);
      await this.modalService
        .open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' })
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

  private getDismissReason(reason: any): string {
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


  async BudgetUtilize() {
    try {
      this.loaderService.requestStarted();
      const remarkValue = this.Remarks;
      if (!this.Remarks || this.Remarks.trim() === '') {
        this.toastr.warning("Please fill in the remark before submitting.");
        return;
      }

      this.BudgetUtilizationsListSave.forEach(item => {
        item.Remarks = remarkValue;
        item.CreatedBy = this.sSOLoginDataModel.UserID;
        item.CollegeID = this.Request.CollegeID
      });

      this.TotalUtilizedBudget = this.BudgetUtilizationsListSave?.reduce((sum, item) => sum + (item.AllotAmount || 0), 0) || 0

      if (this.TotalUtilizedBudget <= 0) {
        this.toastr.warning("Please add Budget")
        return;
      }

      this.Request.CollegeBudgetUtilizationModel = this.BudgetUtilizationsListSave
      this.Request.DistributedAmount = this.TotalUtilizedBudget
      this.Request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.Request.FinYearID = this.sSOLoginDataModel.FinancialYearID
      this.Request.DistributedType = 1
      this.Request.ActionType = 'INSERT'
      this.Request.BodgetTypeID = 2

      await this.budgetDistributedService.SaveBudgetUtilization_Admin(this.Request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.GetList();
            this.ResetControls();
            this.CloseModal();
          } else if (data.State = EnumStatus.Warning) {
            this.toastr.warning(data.Message)
          } else {
            this.toastr.error(data.ErrorMessage)
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
}
