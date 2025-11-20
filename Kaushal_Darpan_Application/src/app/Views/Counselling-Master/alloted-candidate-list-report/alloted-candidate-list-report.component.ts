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
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ITIApprenticeshipService } from '../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { ITI_ApprenticeshipSearchModel } from '../../../Models/ITI/ITI_ApprenticeshipDataModel';
import * as XLSX from 'xlsx'; 
@Component({
  selector: 'app-alloted-candidate-list-report',
  standalone: false,
  templateUrl: './alloted-candidate-list-report.component.html',
  styleUrl: './alloted-candidate-list-report.component.css'
})
export class AllotedCandidateListReportComponent {
       //designations = GlobalConstants.designationList; // Access the designations constant

  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CounsellingAllottedListSearchModel();
  public tradeRequest = new Counselling_DropdownDataModel();
  public editInstituteReq = new EditInstituteDataModel_Counselling();
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public searchRequest = new CounsellingAllotmentListModel();

  public AllottedCandidateList: any[] = [];
  public TradeDDLList: any = [];
  public InstituteList: any = [];
  public designations: any = [];
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
  public InstitutelistDDL: any = [];
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
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
     private apprenticeshipService: ITIApprenticeshipService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    await this.commonFunctionService.GetDDLCounselling_Qualification()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.designations = data['Data'];
      }, (error: any) => console.error(error)
      );
      await this.GetInstituteMaster();
    // await this.GetTradeList();
     await this.GetAllottedCandidateList_Counselling();
  }

    async getTradeByDegree(designationId: number) {
    debugger;
    console.log('Designation ID:', designationId);

    try {
      this.loaderService.requestStarted();

      await this.commonFunctionService.DDL_CounsellingTradelist(designationId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TradeDDLList = data['Data'];
        }, (error: any) => console.error(error)
        );
    } catch (ex) {
      console.error('Exception:', ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  } 
  async GetTradeList() {
    try {
      this.tradeRequest.Action = 'GetTradeList'
      await this.counsellingApplicationFormService.Counselling_GetDropdownByAction(this.tradeRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeDDLList = data.Data;
      })
    } catch (error) {
      console.error(error)
    }
  }

  async GetInstituteMaster() {
    try {
      
      const request: any = {};
      request.action = "GetITIGovtInstituteDDL";
      await this.counsellingMasterService.GetAllottedCandidateList_CounsellingReport(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstitutelistDDL = data['Data'];
      })
    } catch (error) {
      console.log(error);
    }
  }
  async OnchangeTrade() {
     await this.GetInstituteMaster();  
     await this.GetAllottedCandidateList_Counselling();
  }
  async ClearSearchData() {
    this.request.TradeID = 0;
    this.request.InstituteID = 0;
    this.searchRequest.DesignationID=0;
  }

  async btn_SearchClick() {
    await this.GetAllottedCandidateList_Counselling();
  }

  async GetAllottedCandidateList_Counselling() {
    try {
      this.request.action="GetAllottedCandidate";
      await this.counsellingMasterService.GetAllottedCandidateList_CounsellingReport(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success) {
            this.AllottedCandidateList = data.Data;
            this.loadInTable();
          } else if(data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message);
            this.AllottedCandidateList = data.Data;
            this.loadInTable();
          } else {
            this.toastr.error(data.ErrorMessage);
            this.AllottedCandidateList = data.Data;
            this.loadInTable();
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
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.AllottedCandidateList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.AllottedCandidateList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.AllottedCandidateList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.AllottedCandidateList.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.AllottedCandidateList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.AllottedCandidateList.filter(x => x.AllotmentID == item.AllotmentID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.AllottedCandidateList.every(r => r.Selected);
  }
  // end table feature
  exportToExcel(): void {
      const unwantedColumns = [
       'AllotmentID','CandidateID','TradeID'	,'AllottedInstituteID'	,'AllotmentStatus',	'OptionID'	,'FinalAllottedInstituteID'  
      ];
      const filteredData = this.AllottedCandidateList.map((item: any) => {
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
      XLSX.writeFile(wb, 'CounsellingStudents_List.xlsx');
    }
}
