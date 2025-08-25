import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ITIAdminDashboardServiceService } from '../../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIAdminDashboardSearchModel } from '../../../../Models/ITIAdminDashboardDataModel';

@Component({
    selector: 'app-iti-forms-priority-list',
    templateUrl: './iti-forms-priority-list.component.html',
    styleUrls: ['./iti-forms-priority-list.component.css'],
    standalone: false
})
export class ItiFormsPriorityListComponent implements OnInit {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITIAdminDashboardSearchModel();
  public ITIsWithNumberOfFormsPriorityList: any = [];

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
    private ITIAdminDashboardServiceService: ITIAdminDashboardServiceService,
    private loaderService: LoaderService, 
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.ITIsWithNumberOfFormsPriority();
  }

  async ITIsWithNumberOfFormsPriority() {

    
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    try {

      this.loaderService.requestStarted();
      await this.ITIAdminDashboardServiceService.ITIsWithNumberOfFormsPriorityList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITIsWithNumberOfFormsPriorityList = data['Data'];
          //table feature load
          this.loadInTable();
          //end table feature load
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
    this.paginatedInTableData = [...this.ITIsWithNumberOfFormsPriorityList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.ITIsWithNumberOfFormsPriorityList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.ITIsWithNumberOfFormsPriorityList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.ITIsWithNumberOfFormsPriorityList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.ITIsWithNumberOfFormsPriorityList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.ITIsWithNumberOfFormsPriorityList.filter((x: any) => x.StudentID == item.StudentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.ITIsWithNumberOfFormsPriorityList.every((r: any) => r.Selected);
  }
  // end table feature

}
