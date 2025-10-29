import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  public selectedDataList: any[] = [];
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
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
    private router: Router,
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


  // CloseModal_EditAllottedInstitute() {
  //   this.modalService.dismissAll();
  //   this.editInstituteReq = new EditInstituteDataModel_Counselling()
  // }

  // async OpenOTPModal_EditInstitute() {
  //   this.Swal2.Confirmation(`Are you sure you want to Change Allotted Institute!`,
  //     async (result: any) => {
  //       if (result.isConfirmed) {
  //         this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

  //         // await for open model
  //         await this.childComponent.OpenOTPPopup();

  //         // await OTP verification
  //         await this.childComponent.waitForVerification();

  //         // do work
  //         await this.SaveData_EditAllottedInstitute();
  //       }
  //     }
  //   );
  // }

  // async SaveData_EditAllottedInstitute() {
  //   try {
  //     this.editInstituteReq.ModifyBy = this.sSOLoginDataModel.UserID
  //     await this.counsellingMasterService.SaveFinalInstituteAllotment_Counselling(this.editInstituteReq).then(async (data: any) => {
  //       data = JSON.parse(JSON.stringify(data));
  //       if(data.State === EnumStatus.Success) {
  //         this.toastr.success(data.Message);
  //         await this.GetUploadedTraineeLogsData();
  //         this.CloseModal_EditAllottedInstitute();
  //       } else if(data.State === EnumStatus.Warning) {
  //         this.toastr.warning(data.Message);
  //       } else {
  //         this.toastr.error(data.ErrorMessage);
  //       }
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async OpenOTPModal_GenerateAllotmentOrder_old() {
    
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
  
  selectInTableAllCheckbox() {
    this.TraineeLogsList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    debugger
    const data = this.TraineeLogsList.filter(x => x.LogID == item.LogID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
   
    this.AllInTableSelect = this.TraineeLogsList.every(r => r.Selected);
  }
  

  
  selectedRows: any[] = [];

  async OpenOTPModal_GenerateAllotmentOrder() {
    debugger;
    this.selectedRows = this.paginatedInTableData.filter((x: any) => x.Selected);

    if (this.selectedRows.length === 0) {
      this.toastr.warning('Please select at least one record.', 'No Selection');
      return;
    }

    console.log('Selected Records ==>', this.selectedRows);

    this.selectedDataList = this.selectedRows.map((item: any) => ({
      log_id: item.LogID,              
      response: item.Response || null, 
      isSelected: true,                
    }));

    console.log('Selected Data List (For API) ==>', this.selectedDataList);

    try {
      this.loaderService.requestStarted();
      this.isLoading = true;

      
      await this.ItiDataMasterService.UploadStatusCheckNew(this.selectedDataList)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            this.toastr.success("Items issued successfully", "", {
              toastClass: "ngx-toastr my-update-toast"
            });
            this.router.navigate(['/Upload-Status-Check']);
            
          } else if (this.State === EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage || "Something went wrong.");
          }
        });

      this.modalService.dismissAll();
    } catch (ex) {
      console.error('Error in OpenOTPModal_GenerateAllotmentOrder:', ex);
      this.toastr.error('Something went wrong. Please try again.');
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  
  
}
