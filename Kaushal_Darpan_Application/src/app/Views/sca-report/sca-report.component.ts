import { ChangeDetectorRef, Component } from '@angular/core';
import { StudentCenteredActivitesModels, StudentCenteredActivitesSearchModel } from '../../Models/StudentCenteredActivitesModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { StudentCenteredActivitesService } from '../../Services/Student Centered Activites/student-centered-activites.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../Services/Loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentDetailsService } from '../../Common/document-details';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { StreamMasterService } from '../../Services/BranchesMaster/branches-master.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { DocumentDetailsModel } from '../../Models/DocumentDetailsModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import * as XLSX from 'xlsx';
import { ReportService } from '../../Services/Report/report.service';
import { EnumRole } from '../../Common/GlobalConstants';
@Component({
  selector: 'app-sca-report',
  standalone: false,
  templateUrl: './sca-report.component.html',
  styleUrl: './sca-report.component.css'
})
export class ScaReportComponent { 
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public SemesterMasterList: any = [];
  public Branchlist: any[] = [];
  /*public TheoryMarksList: any = [];*/
  public UserID: number = 0;
  searchText: string = '';
  allSelected = false;
  public Table_SearchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public tbl_txtSearch: string = '';
  /*request = new TheoryMarksDataModels()*/
  public searchRequest = new StudentCenteredActivitesSearchModel();
  public request = new StudentCenteredActivitesModels();
  sSOLoginDataModel = new SSOLoginDataModel();
  public GradeList: StudentCenteredActivitesModels[] = []
  public InstituteMasterDDLList: any = []
  public _EnumRole = EnumRole;

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
  public isAnyUFMSelected: boolean = false;
  public totalInTableRecord: number = 0;
  public DocumentList: DocumentDetailsModel[] = []
  //end table feature default

  constructor(private commonMasterService: CommonFunctionService,
    private SCAService: StudentCenteredActivitesService, private toastr: ToastrService,
    private loaderService: LoaderService, private router: ActivatedRoute,
    private modalService: NgbModal, private Swal2: SweetAlert2, private streamMasterService: StreamMasterService, private appsettingConfig: AppsettingService,
    private ReportService: ReportService,
    private documentDetailsService: DocumentDetailsService, private cdr: ChangeDetectorRef) {
  }

    
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    /*this.UserID = this.sSOLoginDataModel.UserID;*/
    await this.GetMasterData();
    // await this.GetGradeList();

  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Branchlist = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
      })
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





  async GetGradeList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
/*      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;//principle*/
      //session
      if(this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon || this.sSOLoginDataModel.RoleID == EnumRole.HOD_Eng || this.sSOLoginDataModel.RoleID == EnumRole.HOD_NonEng){
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      }
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //
      this.loaderService.requestStarted();
      await this.ReportService.ScaReportAdmin(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GradeList = data['Data'];
          console.log(this.GradeList, "TheoryMarks")
          this.GradeList.forEach((x: any) => {
            if (x.IsSCAChecked == false) {
              x.IsPresentStudentCenteredActivity = 1
            }
          })

          //table feature load
          this.loadInTable();
          //end table feature load
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

  

  ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new StudentCenteredActivitesSearchModel();
    // this.GetGradeList();
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.paginatedInTableData = []
    this.GradeList = []
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'StudentID', 'StudentExamID', 'StudentExamPaperMarksID', 'GroupCode', 'InstituteID'
    ];
    const filteredData = this.GradeList.map((item: any) => {
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
    XLSX.writeFile(wb, 'StudentsData.xlsx');
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
    this.paginatedInTableData = [...this.GradeList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.GradeList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
    this.cdr.detectChanges();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.GradeList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.GradeList.filter(x => x.Marked)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.GradeList.forEach(x => {
      x.Marked = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    // Find the row in the GradeList and update only that row
    const rowIndex = this.GradeList.findIndex(x => x === item);
    if (rowIndex !== -1) {
      this.GradeList[rowIndex].Marked = isSelected;
    }


    // Update "Select All" checkbox state
    this.AllInTableSelect = this.GradeList.every(r => r.Marked);
  }


 

 

}
