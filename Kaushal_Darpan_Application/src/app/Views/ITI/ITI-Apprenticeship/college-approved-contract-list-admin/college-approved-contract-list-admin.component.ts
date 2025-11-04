import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIApprenticeshipService } from '../../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumRole, MONTH_LIST } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-college-approved-contract-list-admin',
  standalone: false,
  templateUrl: './college-approved-contract-list-admin.component.html',
  styleUrl: './college-approved-contract-list-admin.component.css'
})
export class CollegeApprovedContractListAdminComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest: any = {};

  _enumRole = EnumRole;
  months = MONTH_LIST;

  public ApprovedContractDataList: any = [];

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
  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apprenticeshipService: ITIApprenticeshipService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // await this.GetApprovedContractData();
  }

  async GetApprovedContractData() {
    try {
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID

      await this.apprenticeshipService.GetCollegeApprovedContract_Appr(this.searchRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApprovedContractDataList = data['Data'];

        this.loadInTable();

      })
    } catch (error) {
      console.error(error);
    }
  }

  async ResetControl() {
    this.searchRequest = {};
    await this.GetApprovedContractData();
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ApprovedContractDataList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.ApprovedContractDataList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.ApprovedContractDataList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.ApprovedContractDataList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.ApprovedContractDataList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.ApprovedContractDataList.filter((x: any) => x.AllotmentID == item.AllotmentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.ApprovedContractDataList.every((r: any) => r.Selected);
  }
  // end table feature
}
