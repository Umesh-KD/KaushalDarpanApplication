import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Common/common';
import { IndustryInstitutePartnershipMasterService } from '../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CompanyEventSearchModel, IndustryInstitutePartnershipMasterDataModels, IndustryInstitutePartnershipMasterSearchModel } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-approve-company-event',
  standalone: false,
  templateUrl: './approve-company-event.component.html',
  styleUrl: './approve-company-event.component.css'
})
export class ApproveCompanyEventComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new IndustryInstitutePartnershipMasterSearchModel();
  public companyEventSearch = new CompanyEventSearchModel(); 

  public IndustryInstitutePartnershipMasterList: IndustryInstitutePartnershipMasterDataModels[] = [];
  public CompanyEventsList: any = []

  public Table_SearchText: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public CompanyStatus: number = 0;

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
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private appsettingConfig: AppsettingService
  ) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CompanyStatus = Number(this.activatedRoute.snapshot.queryParamMap.get('status')?.toString());
    await this.GetAllData();
  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.CompanyStatus = this.CompanyStatus;
      this.loaderService.requestStarted();
      await this.industryInstitutePartnershipMasterService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.IndustryInstitutePartnershipMasterList = data.Data;
        //table feature load
        this.loadInTable();
        //end table feature load
        console.log(this.IndustryInstitutePartnershipMasterList)
      }, (error: any) => console.error(error))
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

  async ClearSearchData() {
    this.searchRequest.Name = '';

    await this.GetAllData();
  }

  async ViewCompanyEvents(content: any, CompanyID: number) {
    await this.GetCompanyEvents(CompanyID)
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }

  async GetCompanyEvents(CompanyID: number) {
    try {
      
      this.companyEventSearch.CompanyID = CompanyID;
      await this.industryInstitutePartnershipMasterService.GetCompanyEvents(this.companyEventSearch)
        .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.CompanyEventsList = data.Data
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning("Event not found")
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  CloseEventModal() {
    this.modalService.dismissAll();
    this.companyEventSearch = new CompanyEventSearchModel()
  }

  async ApproveCompanyEvents() {
    const anySelected = this.IndustryInstitutePartnershipMasterList.some((item: any) => item.Selected);
    if(!anySelected) {
      this.toastr.error('Please select at least one Company to approve.');
      return;
    }

    const Selected = this.IndustryInstitutePartnershipMasterList.filter((item: any) => item.Selected);
    Selected.forEach((item: any) => {
      item.ModifyBy = this.sSOLoginDataModel.UserID;
    });

    try {
      await this.industryInstitutePartnershipMasterService.ApproveCompanyEvents(Selected).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AllInTableSelect = false;
          await this.GetAllData();
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData()
  {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.IndustryInstitutePartnershipMasterList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.IndustryInstitutePartnershipMasterList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.IndustryInstitutePartnershipMasterList.length;
  }
  // (replace org. list here)
  get totalInTableSelected(): number {
    return this.IndustryInstitutePartnershipMasterList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.IndustryInstitutePartnershipMasterList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.IndustryInstitutePartnershipMasterList.filter((x: any) => x.CompanyID == item.CompanyID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.IndustryInstitutePartnershipMasterList.every((r: any) => r.Selected);
  }
  // end table feature
}
