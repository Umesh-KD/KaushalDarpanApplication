import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITITradeDataModels, ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { ItiTradeService } from '../../../../Services/iti-trade/iti-trade.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIPlanningBankGuarantee } from '../../../../Models/ItiPlanningDataModel';
import { ITIsService } from '../../../../Services/ITIs/itis.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
@Component({
  selector: 'app-report-iti-bankguarantee',
  templateUrl: './report-iti-bankguarantee.component.html',
  styleUrls: ['./report-iti-bankguarantee.component.css'],
    standalone: false
})
export class reportitibankguaranteeComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public ITITradeList: any = [];
  searchText: string = '';
  public CollegeTypeList: any[] = [];
  public BankGuaranteeList: any[] = [];
  public TradeTypesList: any = [];
  public TradeData: ITITradeSearchModel[] = [];
  request = new ITITradeDataModels()
  public searchRequest = new ITIPlanningBankGuarantee();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public paginatedInTableData: any[] = [];
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  constructor(
    private commonMasterService: CommonFunctionService,
    private campusPostService: ITIsService,
    private Router: Router,
    private ItiTradeService: ItiTradeService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService,

    private Swal2: SweetAlert2) {
  }

  async ngOnInit()
  {
    this.sSOLoginDataModel.RoleID;

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.getTradetblListList()
  }

  async GetTradeTypesList()
  {
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTradeTypesList().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeTypesList = data.Data; 
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getTradetblListList() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.searchRequest.BankGuaranteeID = 0;

      await this.campusPostService.ITIPlanningBankGuaranteeReport(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BankGuaranteeList = data['Data'];

          this.loadInTable();

          console.log('Bank Gaurentee ===>', this.BankGuaranteeList)
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


  onCancel(): void {
    
    
  }

  onResetCancel(): void
  {
    this.onCancel();
    this.getTradetblListList();
  }

  onEdit(Id: number): void {

    this.Router.navigate(['/ititradeUpdate', Id]);
  }



  async btnDeleteOnClick(TradeId: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.ItiTradeService.DeleteDataByID(TradeId, this.request.ModifyBy)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.getTradetblListList();
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

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
    const filteredData = this.BankGuaranteeList.map(item => {
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

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB').split('/').join('-');

    const fileName = `Bank_Guarantee_List_${dateStr}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }


  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.BankGuaranteeList].slice(this.startInTableIndex, this.endInTableIndex);
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
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.BankGuaranteeList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  resetInTableValiable() {
    this.paginatedInTableData = [];
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.BankGuaranteeList.length;
  }


  async EditInfo(BankGuaranteeID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.router.navigate(['/iti-bank-guarantee', BankGuaranteeID]);

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  onBankNameChange(value: string) {
    this.searchRequest.BankName = value;
    this.searchRequest.BankGuaranteeNumber = value;
    this.getTradetblListList();
  }

}
