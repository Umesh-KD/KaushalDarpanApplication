import { Component, ViewChild } from '@angular/core';
import {  CreditLeaveModel, LeaveMasterSearchModel } from '../../Models/LeaveMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LeaveMasterService } from '../../Services/LeaveMaster/leave-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { EnumStatus } from '../../Common/GlobalConstants';
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
  public CalenderYearList:any=[];
  public StaffIDList:CreditLeaveModel[]=[];

  public Table_SearchText: string = "";
  public searchRequest = new LeaveMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ApprovedStatus: string = "0";
  public status: number = 0;

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

    // this.searchRequest.CalenderYearID=this.sSOLoginDataModel.CalenderYearID;

    await this.GetCalenderYearList();

    await this.GetAllData();


    this.searchRequest.CalenderYearID=15;
  }

  async GetCalenderYearList() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCalenderYearList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CalenderYearList = data['Data'];

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


  async onCalenderYearChange(){

  }

  async Save_CreditStaffLeave() {
    debugger
    let dyMsg = 'Credit';
    // if (this.status == 1345) {
    //   dyMsg = "Approve";
    // } else {
    //   dyMsg = "Reject";
    // }
    this.Swal2.Confirmation(`Are you sure you want to ${dyMsg}?`,
    async (result: any) => {
      
      if (result.isConfirmed) {
        try {
          // this.StaffIDList = this.StaffLeaveTrnList.map((x:any) => ({
          //   StaffID: x.StaffID,
          //   StaffTypeID:x.StaffTypeID,
          //   ModifyBy: this.sSOLoginDataModel.UserID,
          //   DepartmentID:this.sSOLoginDataModel.DepartmentID
          // }));
          this.StaffIDList = Array.from(
            new Map(
              this.StaffLeaveTrnList.map((x: any) => [
                x.StaffID,
                {
                  StaffID: x.StaffID,
                  StaffTypeID: x.StaffTypeID,
                  ModifyBy: this.sSOLoginDataModel.UserID,
                  DepartmentID: this.sSOLoginDataModel.DepartmentID,
                  FinancialYearID:this.sSOLoginDataModel.FinancialYearID,
                  RoleID:this.sSOLoginDataModel.RoleID
                } as CreditLeaveModel
              ])
            ).values()
          ) as CreditLeaveModel[];

          await this.LeaveMasterService.CreditStaffLeave(this.StaffIDList)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if(data.State === EnumStatus.Success) {
                this.toastr.success(data.Message); 
                await this.GetAllData();       
              }
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
    })
    
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
    debugger
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
      this.searchRequest.Action='_getLeaveCreditStaffData';
      this.loaderService.requestStarted();
      await this.LeaveMasterService.GetLeaveCreditStaffData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffLeaveTrnList = data['Data'];
          this.loadInTable();
          console.log(this.StaffLeaveTrnList, "lisssssttt")
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

  // get all data
  async ClearSearchData() {
    this.searchRequest.Name = '';
    this.searchRequest.Status = '';

    // await this.GetAllData();
  }

  // delete by id
  async DeleteById(PlacementCompanyID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.LeaveMasterService.DeleteById(PlacementCompanyID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  await this.GetAllData();
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
      });
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
    return this.StaffLeaveTrnList.filter((x:any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.StaffLeaveTrnList.forEach((x:any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.StaffLeaveTrnList.filter((x:any) => x.AllotmentID == item.AllotmentID);
    data.forEach((x:any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.StaffLeaveTrnList.every((r:any) => r.Selected);
  }
  // end table feature
}
