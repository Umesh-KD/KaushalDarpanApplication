import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CounsellingAllotmentListModel, CounsellingAllottedListSearchModel, EditInstituteDataModel_Counselling } from '../../../Models/CounsellingMasterModel';
import { Counselling_DropdownDataModel } from '../../../Models/CounsellingApplicationFormDataModel';
import { CounsellingApplicationFormService } from '../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { CounsellingMasterService } from '../../../Services/CounsellingMaster/counselling-master.service';
import {ItiDataMasterService}from '../../../Services/ITI/ITIDataMaster/iti-datamaster.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { UploadTrainee_LogsModel } from '../../../Models/RevaluationModel';
import { from } from 'rxjs';

@Component({
  selector: 'upload-trainee-logs-list',
  standalone: false,
  templateUrl: './upload-trainee-logs-list.component.html',
  styleUrl: './upload-trainee-logs-list.component.css'
})
export class UploadTraineeLogsListComponent {
       designations = GlobalConstants.designationList; // Access the designations constant

  sSOLoginDataModel = new SSOLoginDataModel();
  request = new UploadTrainee_LogsModel();
  public tradeRequest = new Counselling_DropdownDataModel();
  public editInstituteReq = new EditInstituteDataModel_Counselling();
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  // public searchRequest = new UploadTrainee_LogsModel();

  public TraineeLogsList: any[] = [];
  public TradeDDLList: any = [];
  public InstituteList: any = [];

  public isSubmitted: boolean = false
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

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
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
    private counsellingMasterService: CounsellingMasterService,
    private ItiDataMasterService:ItiDataMasterService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetUploadedTraineeLogsData();
    // await this.GetTradeList();
  }



  async ClearSearchData() {
    this.request.log_id = '';
    this.request.RequestID = '';
    await this.GetUploadedTraineeLogsData();
  }

  async btn_SearchClick() {
    await this.GetUploadedTraineeLogsData();
  }

  async GetUploadedTraineeLogsData() {
    debugger;
    try {
      let obj = new UploadTrainee_LogsModel();
      obj.log_id = this.request.log_id;
      await this.ItiDataMasterService.GetTraineeLogsList(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success) {
            this.TraineeLogsList = data.Data;
            this.loadInTable();
          } else if(data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message);
            this.TraineeLogsList = data.Data;
            this.loadInTable();
          } else {
            this.toastr.error(data.ErrorMessage);
            this.TraineeLogsList = data.Data;
            this.loadInTable();
          }
          
      })
    } catch (error) {
      console.error(error)
    }
  }


  async CheckStatus() {
    
    let anySelected = this.TraineeLogsList.some((x: any) => x.Selected == true);
    if(!anySelected) {
      this.toastr.error("Please select at least one candidate.");
      return;
    }

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
    this.paginatedInTableData = [...this.TraineeLogsList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.TraineeLogsList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.TraineeLogsList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.TraineeLogsList.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.TraineeLogsList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    debugger
 
    this.TraineeLogsList.forEach(x => x.Selected = false);
    const data = this.TraineeLogsList.filter(x => x.LogID == item.LogID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.TraineeLogsList.every(r => r.Selected);
  }
  // end table feature

}
