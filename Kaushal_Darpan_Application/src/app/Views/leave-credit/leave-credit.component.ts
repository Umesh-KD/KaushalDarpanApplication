import { Component, ViewChild } from '@angular/core';
import { CreditLeaveModel, LeaveMasterSearchModel } from '../../Models/LeaveMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LeaveMasterService } from '../../Services/LeaveMaster/leave-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { EnumRole, EnumStatus, SessionType } from '../../Common/GlobalConstants';
import Swal from 'sweetalert2';
import { OTPModalComponent } from '../otpmodal/otpmodal.component';
@Component({
  selector: 'app-leave-credit',
  standalone: false,
  templateUrl: './leave-credit.component.html',
  styleUrl: './leave-credit.component.css'
})
export class LeaveCreditComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public StaffLeaveTrnList: any = [];
  public CalenderYearList: any = [];
  public StaffIDList: CreditLeaveModel[] = [];
  public SessionYearList: any = [];

  public Table_SearchText: string = "";
  public searchRequest = new LeaveMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ApprovedStatus: string = "0";
  public status: number = 0;
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
  public totalInTableRecord: number = 0;
  //end table feature default

  public _SessionType = SessionType;

  // properties you do NOT want to show
  excludedColumns = [
    'StaffID',
    'StaffTypeID',
    'SessionTypeID',
    'CalenderYearID',
    'FinancialYearID'
  ];

  constructor(
    private commonMasterService: CommonFunctionService,
    private LeaveMasterService: LeaveMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
  ) { }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID_Session;

    await this.GetCalenderYearList();
    await this.GetSessionYear();
  }

  async GetCalenderYearList() {
    // debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCalenderYearList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CalenderYearList = data['Data'];
          this.searchRequest.CalenderYearID = this.CalenderYearList.find((x: any) => x.IsCurrentCalenderYear == 1).CalenderYearID;
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


  async GetSessionYear() {
    try {
      await this.commonMasterService.GetFinancialYear().then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SessionYearList = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  async onCalenderYearChange() {

  }

  async Save_CreditStaffLeave() {
    // debugger
    let dyMsg = 'Credit';
    this.Swal2.Confirmation(`Are you sure you want to ${dyMsg}?`,
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.StaffIDList = Array.from(
              new Map(
                this.StaffLeaveTrnList.map((x: any) => [
                  x.StaffID,
                  {
                    StaffID: x.StaffID,
                    StaffTypeID: x.StaffTypeID,
                    ModifyBy: this.sSOLoginDataModel.UserID,
                    DepartmentID: this.sSOLoginDataModel.DepartmentID,
                    RoleID: this.sSOLoginDataModel.RoleID,
                    SessionTypeID: this.searchRequest.SessionTypeID,
                    CalenderYearID: this.searchRequest.CalenderYearID,
                    FinancialYearID: this.searchRequest.FinancialYearID
                  } as CreditLeaveModel
                ])
              ).values()
            ) as CreditLeaveModel[];
            if(this.sSOLoginDataModel.RoleID==this._EnumRole.EM_JD_BTER || this.sSOLoginDataModel.RoleID==this._EnumRole.EM_Secretary_BTER)
            {
              await this.LeaveMasterService.CreditStaffLeave_NonGazetted(this.StaffIDList)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(data.Message);
                  await this.GetAllData();
                }
              })
            }
            else if(this.sSOLoginDataModel.RoleID==this._EnumRole.EM_ADTE_NON_GAZETTED_STAFF)
            {
              await this.LeaveMasterService.CreditStaffLeave_ADTE_NonGazetted(this.StaffIDList)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(data.Message);
                  await this.GetAllData();
                }
              })
            }
            else
            {
              await this.LeaveMasterService.CreditStaffLeave(this.StaffIDList)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(data.Message);
                  await this.GetAllData();
                }
              })
            }

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
      })

  }

  onSessionTypeChange() {
    this.StaffLeaveTrnList = [];
    this.loadInTable();
  }


  maskMobileNumber(mobile: string): string {
    if (mobile && mobile.length > 4) {
      // Mask all but the last 4 digits
      const masked = mobile.slice(0, -4).replace(/\d/g, '*');
      return `${masked}${mobile.slice(-4)}`;
    }
    return mobile; // Return original if length is less than or equal to 4
  }


  async GetAllData() {
    // debugger
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
      this.searchRequest.RoleID=this.sSOLoginDataModel.RoleID;
      // this.searchRequest.Action='_getLeaveCreditStaffData';
      await this.LeaveMasterService.GetLeaveCreditStaffData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffLeaveTrnList = data['Data'];
          this.loadInTable();
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  // get all data
  async ClearSearchData() {
    this.searchRequest.Name = '';
    this.searchRequest.Status = '';

    // await this.GetAllData();
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
    this.paginatedInTableData = [...this.StaffLeaveTrnList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.StaffLeaveTrnList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.StaffLeaveTrnList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.StaffLeaveTrnList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.StaffLeaveTrnList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.StaffLeaveTrnList.filter((x: any) => x.AllotmentID == item.AllotmentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.StaffLeaveTrnList.every((r: any) => r.Selected);
  }
  // end table feature


  // for keep org. list order
  originalOrder = (
    a: { key: string },
    b: { key: string }
  ): number => {
    return 0; // keeps insertion order
  };

  // helper function
  isVisibleColumn(key: string): boolean {
    return !this.excludedColumns.includes(key);
  }
}
