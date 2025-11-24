import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { ItiCollegesSearchModel } from '../../../../Models/CommonMasterDataModel';
import { BudgetDistributeModel, BudgetHeadSearchFilter, BudgetHeadUtilizeList } from '../../../../Models/ITI/BudgetDistributeDataModel';
import { ITIAddmissionWomenReportSearchModel } from '../../../../Models/TheoryMarksDataModels';
import { BudgetDistributedService } from '../../../../Services/BudgetDistributed/budget-distributed.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { ResultService } from '../../../../Services/Results/result.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';

@Component({
  selector: 'app-college-budget-list',
  standalone: false,
  templateUrl: './college-budget-list.component.html',
  styleUrl: './college-budget-list.component.css'
})
export class CollegeBudgetListComponent {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public searchRequest = new BudgetHeadSearchFilter();
  public collegeRequest = new ItiCollegesSearchModel();
  public Request = new BudgetHeadUtilizeList();
  sSOLoginDataModel: any;
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public AddmissionList: any[] = [];
  public BudgetUtilizationsList: any[] = [];
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
  public ColegeAmount: number = 0;
  public Remarks: string = '';
  public TotalUtilizedBudget: number = 0;
  public CommonFile: any;
  public CommonFileName: any;

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
  }


  get _BudgetFormGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  async GetList() {
    try {
        ;
      this.searchRequest.FinYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.CollegeID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;

      if (this.sSOLoginDataModel.RoleID == 20 || this.sSOLoginDataModel.RoleID == 43) {
        this.searchRequest.CollegeID = this.sSOLoginDataModel.InstituteID;
        this.searchRequest.ActionName = "GetDataByCollegeID";
      } else if(this.sSOLoginDataModel.RoleID == 97) {
        this.searchRequest.DivisionID = this.sSOLoginDataModel.DistrictID;
        this.searchRequest.ActionName = "GetZonelList";
        this.searchRequest.FinYearID = 9;
      } else {
        this.searchRequest.ActionName = "GetList";
      }

      this.loaderService.requestStarted();
      // this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.budgetDistributedService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AddmissionList = data.Data;

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



  async GetBudgetUtilizationsList() {
    try {
        ;
      this.searchRequest.FinYearID = this.sSOLoginDataModel.FinancialYearID;
      if(this.sSOLoginDataModel.RoleID == 97) {
        this.searchRequest.FinYearID = 9;
      }
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
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.AddmissionList.length;
  }


  //onResetClick() {
  //  this.searchRequest.DistrictID = 0;
  //  this.searchRequest.DivisionID = 0;
  //  this.searchRequest.CourseTypeID = 0;
  //  this.searchRequest.ITICollegeID = 0;
  //  this.searchRequest.ITITradeID = 0;
  //  this.searchRequest.ITICode = '';
  //  this.searchRequest.TradeCode = '';
  //  this.searchRequest.StatusID = 0;
  //  this.AddmissionList = [];
  //  this.paginatedInTableData = [];
  //  this.GetList();
  //}


  //exportToExcel(): void {
  //  const unwantedColumns = [''];
  //  const filteredData = this.AddmissionList.map(item => {
  //    const filteredItem: any = {};
  //    Object.keys(item).forEach(key => {
  //      if (!unwantedColumns.includes(key)) {
  //        filteredItem[key] = item[key];
  //      }
  //    });
  //    return filteredItem;
  //  });
  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //  XLSX.writeFile(wb, 'PlanningDetailsReport.xlsx');
  //}

  ResetControls() {
    this.BudgetUtilizationsList = [];
    this.Remarks = '';
  }

  //onFileSelected(event: any, index: number) {
  //  const file: File = event.target.files[0];
  //  if (file) {
  //    this.BudgetUtilizationsList[index].UploadedFile = file;
  //    this.BudgetUtilizationsList[index].UploadedFileName = file.name;
  //  }
  //}



  async onFileSelected(event: any, index: number) {
    try {
        ;
      const file: File = event.target.files[0];
      if (file)
      {
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (file) {
                this.BudgetUtilizationsList[index].UploadedFile = data['Data'][0]["Dis_FileName"];
                this.BudgetUtilizationsList[index].UploadedFileName = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async onFilechange(event: any, name: string) {
    debugger;
    try {
      const file: File = event.target.files[0];
      if (file) {

        // Type validation
        if (['application/pdf'].includes(file.type)) {
          // Size validation
          if (file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select Only pdf file');
          this.CommonFile = '';
          this.CommonFileName = '';
          event.target.value = null;
          return;
        }

        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITI/BudgetRequest";

        //Upload to server folder
        await this.commonMasterService.UploadDocument(file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {

              if(name == "commonFile") {
                this.BudgetUtilizationsList.forEach((item:any) => {
                  item.CommonFile = data['Data'][0]["FileName"];
                  item.CommonFileName = data['Data'][0]["Dis_FileName"];
                })
              }
            }

            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  isFileMissing(item: any): boolean {
    return (item.UtilizationAmount || 0) > 0 && !item.UploadedFileName;
  }

  validateUtilizationList(): boolean {
    return !(this.BudgetUtilizationsList || []).some(
      item => (item.UtilizationAmount || 0) > 0 && !item.UploadedFileName
    );
  }

  async BudgetUtilize() {
    try {
      this.loaderService.requestStarted();
      debugger
      if (!this.validateUtilizationList()) {
        this.toastr.error('Please upload a file for all items with Utilization Amount greater than 0.');
        return; // stop submission
      }

      const remarkValue = this.Remarks;
      if (!this.Remarks || this.Remarks.trim() === '') {
        this.toastr.warning("Please fill in the remark before submitting.");
        return; // stop execution
      }

      // or any string you want to apply to all
      this.BudgetUtilizationsList.forEach(item => {
        item.Remarks = remarkValue;
        item.CreatedBy = this.sSOLoginDataModel.UserID;
        item.DistributedID = this.searchRequest.DistributedID;
      });

      this.TotalUtilizedBudget = this.BudgetUtilizationsList?.reduce((sum, item) => sum + (item.UtilizationAmount || 0), 0) || 0

      if (this.TotalUtilizedBudget > this.ColegeAmount)
      {
        this.toastr.warning("Utilized budget cannot exceed the college amount.");
        return;
      }
      await this.budgetDistributedService.BudgetUtilizeSave(this.BudgetUtilizationsList)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success)
          {
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


  async openModal(content: any, row: any, indexNum: number)
  {
    this.ColegeAmount = row.Amount
    console.log(row, 'RowData');
    debugger
    try {
      this.searchRequest.DistributedID = row.DistributedID
      this.searchRequest.BudgetForID = row.BudgetFor
      this.searchRequest.BudgetTypeID = row.BudgetTypeID
      await this.GetBudgetUtilizationsList();
      if(this.BudgetUtilizationsList.length == 0) {
        this.toastr.warning("UC Data Not found");
        return
      }
      await this.modalService.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then(
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

  getTotalUtilizationAmount(): number  {
    return this.BudgetUtilizationsList?.reduce((sum, item) => sum + (item.UtilizationAmount || 0), 0) || 0;
  }

  getRemainingAmount(): number {
    const totalUtilized = this.BudgetUtilizationsList?.reduce((sum, item) => sum + (item.UtilizationAmount || 0),0) || 0;
    return (this.ColegeAmount || 0) - totalUtilized;
  }
}
