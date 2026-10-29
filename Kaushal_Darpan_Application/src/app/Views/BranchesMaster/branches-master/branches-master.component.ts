import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StreamMasterDataModels } from '../../../Models/StreamMasterDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
    selector: 'app-branches-master',
    templateUrl: './branches-master.component.html',
    styleUrls: ['./branches-master.component.css'],
    standalone: false
})
export class BranchesMasterComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false
  public StreamMasterList: any = [];
  public MenuAllowedRoleList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public searchByBranchType: string = ''
  public searchByBranchName: string = ''
  public searchByBranchCode: string = ''
  public StreamTypeList: any = []
  public Table_SearchText: string = '';
  public FromDate: string = '';
  public ToDate: string = '';
  public originalStreamMasterList: any = []


  public tbl_txtSearch: string = '';


  request = new StreamMasterDataModels();
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService, private Router: Router,
    private streamService: StreamMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {
  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // debugger
     await this.GetMenuPermission();
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetStreamMasterList();
    await this.GetStreamType()

    //wait this.StreamMasterList

  }

  async GetMenuPermission() {
 
    const baseRoute = this.routers.url.split('?')[0].split('/').filter(Boolean)[0] ?? '';
 
    var request: any = {
      FilterBy: baseRoute,
      MasterCode: "GetAllowedRoleForMenu"
    }
 
    await this.commonMasterService.CommonMasterDataByAction(request).then((data: any) => {
      data =  JSON.parse(JSON.stringify(data));
      if(data.State == EnumStatus.Success){
        this.MenuAllowedRoleList=data.Data
 
        if (!this.MenuAllowedRoleList.some(
          (item: any) => Number(item.RoleID) == Number(this.sSOLoginDataModel.RoleID)
        )) {
          // Navigate to dashboard if RoleID is not allowed
          this.routers.navigate(['/dashboard']);
        }
      }      
    })
  }

  async GetStreamMasterList() {
    
    try {
      const StreamTypeId = this.sSOLoginDataModel.Eng_NonEng;
      this.loaderService.requestStarted();
      await this.streamService.GetAllData(StreamTypeId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StreamMasterList = data['Data'];
          this.originalStreamMasterList = [...data['Data']]; // Keep a copy of original data
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetStreamType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStreamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StreamTypeList = data['Data'];
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






  // Method to handle the cancel button click
  ResetControl() {
    // Reset all filter fields
    this.searchByBranchCode = '';
    this.searchByBranchName = '';
    this.searchByBranchType = '';
    this.FromDate = '';
    this.ToDate = '';

    //    this.searchByDistrict = 0;

    this.GetStreamMasterList()
  }

  onSearchClick() {
    const searchCriteria: any = {
      Code: this.searchByBranchCode.trim().toLowerCase(),
      Name: this.searchByBranchName.trim().toLowerCase(),
      StreamTypeID: Number(this.searchByBranchType)
    };

    // Date range: From = start of day, To = end of day (inclusive)
    const from = this.FromDate ? new Date(this.FromDate + 'T00:00:00').getTime() : null;
    const to = this.ToDate ? new Date(this.ToDate + 'T23:59:59.999').getTime() : null;

    if (from !== null && to !== null && from > to) {
      alert('From Date cannot be greater than To Date');   // replace with your toast
      return;
    }

    // Filter originalStreamMasterList instead of StreamMasterList
    this.StreamMasterList = this.originalStreamMasterList.filter((college: any) => {

      // existing text / type filters
      const matchCriteria = Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }
        const collegeValue = college[key];
        if (typeof collegeValue === 'string') {
          return collegeValue.toLowerCase().includes(searchValue);
        }
        return collegeValue === searchValue;
      });

      // new: Created OR Modified date must fall in the range
      const matchDate =
        this.isInDateRange(college.CreatedDate, from, to) ||
        this.isInDateRange(college.ModifyDate, from, to);

      return matchCriteria && matchDate;
    });
  }

  // True if the date string falls inside [from, to]. Blank dates never match a range.
  private isInDateRange(value: string, from: number | null, to: number | null): boolean {
    if (from === null && to === null) return true;   // no date filter applied

    const time = this.parseDateOrNull(value);
    if (time === null) return false;                 // blank/invalid date

    if (from !== null && time < from) return false;
    if (to !== null && time > to) return false;
    return true;
  }

  // Parses 'dd-MM-yyyy hh:mm:ss tt' (the format returned by the proc)
  private parseDateOrNull(value: string): number | null {
    if (!value) return null;
    const m = value.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)$/i);
    if (!m) return null;
    let hours = parseInt(m[4], 10) % 12;
    if (m[7].toUpperCase() === 'PM') hours += 12;
    return new Date(+m[3], +m[2] - 1, +m[1], hours, +m[5], +m[6]).getTime();
  }

  exportToExcel(): void {
    if (!this.StreamMasterList || this.StreamMasterList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }
    const unwantedColumns = ['StreamID'];

    const columnOrder = [
      'Code', 'Name', 'StreamType', 'Duration', 'CreatedBy', 'CreatedDate', 'ModifyBy', 'ModifyDate'
    ];

    const filteredData = this.StreamMasterList.map((item: any) => {
      const row: any = {};
      columnOrder.forEach(col => {
        if (!unwantedColumns.includes(col)) {
          row[col] = item[col] ?? ''; // fallback if value missing
        }
      });

      return row;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `Branch_master_${timestamp}.xlsx`);
  }




  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.StreamMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "CollegMaster.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }
  //async btnDelete_OnClick(StreamID: number) {

  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      await this.streamService.DeleteDataByID(StreamID, this.UserID)
  //        .then((data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.Message)
  //            this.GetStreamMasterList()
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        })
  //    }
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async btnDelete_OnClick(StreamID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.streamService.DeleteDataByID(StreamID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetStreamMasterList()
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

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onEdit(id: number): void {

    // Navigate to the edit page with the institute ID
    this.Router.navigate(['/updatebranchesmaster', id]);
    console.log(id)
  }
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const dir = this.sortDirection === 'asc' ? 1 : -1;
    const isDateCol = column === 'CreatedDate' || column === 'ModifyDate';

    this.StreamMasterList = [...this.StreamMasterList].sort((a: any, b: any) => {
      let x = a[column];
      let y = b[column];

      if (isDateCol) {
        x = this.parseDate(x);
        y = this.parseDate(y);
      } else if (typeof x === 'string' || typeof y === 'string') {
        x = (x ?? '').toString().toLowerCase();
        y = (y ?? '').toString().toLowerCase();
      }

      if (x < y) return -1 * dir;
      if (x > y) return 1 * dir;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'ti ti-arrows-sort';
    return this.sortDirection === 'asc' ? 'ti ti-sort-ascending' : 'ti ti-sort-descending';
  }

  // Parses 'dd-MM-yyyy hh:mm:ss tt' coming from the proc's FORMAT()
  private parseDate(value: string): number {
    if (!value) return 0;
    const m = value.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)$/i);
    if (!m) return 0;
    let hours = parseInt(m[4], 10) % 12;
    if (m[7].toUpperCase() === 'PM') hours += 12;
    return new Date(+m[3], +m[2] - 1, +m[1], hours, +m[5], +m[6]).getTime();
  }
  // end table feature

}




