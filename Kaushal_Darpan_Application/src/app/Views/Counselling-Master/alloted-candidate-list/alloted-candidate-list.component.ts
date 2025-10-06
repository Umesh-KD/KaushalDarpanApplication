import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CounsellingAllottedListSearchModel, EditInstituteDataModel_Counselling } from '../../../Models/CounsellingMasterModel';
import { Counselling_DropdownDataModel } from '../../../Models/CounsellingApplicationFormDataModel';
import { CounsellingApplicationFormService } from '../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { CounsellingMasterService } from '../../../Services/CounsellingMaster/counselling-master.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-alloted-candidate-list',
  standalone: false,
  templateUrl: './alloted-candidate-list.component.html',
  styleUrl: './alloted-candidate-list.component.css'
})
export class AllotedCandidateListComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CounsellingAllottedListSearchModel();
  public tradeRequest = new Counselling_DropdownDataModel();
  public editInstituteReq = new EditInstituteDataModel_Counselling();
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public AllottedCandidateList: any[] = [];
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
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
    private counsellingMasterService: CounsellingMasterService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetTradeList();
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

  async GetInstituteOptionList() {
    try {
      this.tradeRequest.Action = 'ChangeInstituteDDLList'
      this.tradeRequest.TradeID = this.request.TradeID
      await this.counsellingApplicationFormService.Counselling_GetDropdownByAction(this.tradeRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteList = data.Data;
      })
    } catch (error) {
      console.error(error)
    }
  }

  async ClearSearchData() {
    this.request.TradeID = 0;
  }

  async btn_SearchClick() {
    await this.GetAllottedCandidateList_Counselling();
  }

  async GetAllottedCandidateList_Counselling() {
    try {
      await this.counsellingMasterService.GetAllottedCandidateList_Counselling(this.request)
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

  async editAllottedInstitute(content: any, row: any) {
    await this.GetInstituteOptionList();
    this.editInstituteReq.CandidateID = row.CandidateID
    this.editInstituteReq.OptionID = row.OptionID
    this.editInstituteReq.AllotmentID = row.AllotmentID
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });
  }

  CloseModal_EditAllottedInstitute() {
    this.modalService.dismissAll();
    this.editInstituteReq = new EditInstituteDataModel_Counselling()
  }

  async OpenOTPModal_EditInstitute() {
    this.Swal2.Confirmation(`Are you sure you want to Change Allotted Institute!`,
      async (result: any) => {
        if (result.isConfirmed) {
          this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

          // await for open model
          await this.childComponent.OpenOTPPopup();

          // await OTP verification
          await this.childComponent.waitForVerification();

          // do work
          await this.SaveData_EditAllottedInstitute();
        }
      }
    );
  }

  async SaveData_EditAllottedInstitute() {
    try {
      this.editInstituteReq.ModifyBy = this.sSOLoginDataModel.UserID
      await this.counsellingMasterService.SaveFinalInstituteAllotment_Counselling(this.editInstituteReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.GetAllottedCandidateList_Counselling();
          this.CloseModal_EditAllottedInstitute();
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async OpenOTPModal_GenerateAllotmentOrder() {
    
    let anySelected = this.AllottedCandidateList.some((x: any) => x.Selected == true);
    if(!anySelected) {
      this.toastr.error("Please select at least one candidate.");
      return;
    }

    this.Swal2.Confirmation(`Are you sure you want to Generate Allotment Order for Selected Candidates!`,
      async (result: any) => {
        if (result.isConfirmed) {
          this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

          // await for open model
          await this.childComponent.OpenOTPPopup();

          // await OTP verification
          await this.childComponent.waitForVerification();

          // do work
          await this.GenerateAllotmentOrder_Counselling();
        }
      }
    );
  }

  async GenerateAllotmentOrder_Counselling() {
    debugger
    let selected = this.AllottedCandidateList.filter((x: any) => x.Selected == true);

    if(selected.length == 0) {
      this.toastr.error("Please select at least one candidate.");
      return;
    }
    try {
      await this.counsellingMasterService.GenerateAllotmentOrder_Counselling(selected).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
        } else if(data.State === EnumStatus.Warning) {
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

}
