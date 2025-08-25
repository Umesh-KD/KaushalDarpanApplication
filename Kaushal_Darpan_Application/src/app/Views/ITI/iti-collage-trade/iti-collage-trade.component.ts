import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';

@Component({
  selector: 'app-iti-collage-trade',
  standalone: false,
  
  templateUrl: './iti-collage-trade.component.html',
  styleUrl: './iti-collage-trade.component.css'
})
export class ITICollageTradeComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  public searchRequest = new ITICollegeTradeSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public ITITspAreasId: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  public ActiveStatusModel: number =1;

  public SSOLoginDataModel = new SSOLoginDataModel();
  public SeatIntakeSearchFormGroup!: FormGroup;
  
  public ListITICollegeTrade: any = [];
  public ListViewSeatDetails: any = [];
  public ListITIManagementType: any = [];
  public ListITITradeScheme: any = [];
  public ListITICollegeByManagement: any = [];
  public ListITITrade: any = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public CollegeNamePop: string = '';
  public TradeNamePop: string = '';
  public TradeSchemeNamePop: string = '';

  public DataExcel: any = [];

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private ITICollegeTradeService: ItiSeatIntakeService,
    private Swal2: SweetAlert2,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) { }



  async ngOnInit() {
    
    //this.searchRequest.TradeLevelId = String(this.route.snapshot.paramMap.get('id')?.toString());
    this.searchRequest.TradeLevelId = "0";
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
    console.log(this.SSOLoginDataModel, "SSOLoginDataModel")
    await this.GetTradeAndColleges(1)
    await this.MasterFilterList();
    this.getITICollege();
    this.getITITrade();
  }

  async MasterFilterList() {
    
    try {
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.ITIManagementType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITIManagementType = data['Data'];
          console.log(this.ListITIManagementType, "ListITIManagementType")
        }, error => console.error(error));

      await this.ITICollegeTradeService.ITITradeScheme()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITITradeScheme = data['Data'];
          console.log(this.ListITITradeScheme, "ListITITradeScheme")
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

  async getITICollege() {
    try {
      this.searchRequest.Action = "_ITICollegeByManagementType";
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.getITICollegeByManagement(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITICollegeByManagement = data['Data'];
          console.log(this.ListITICollegeByManagement, "ListITICollegeByManagement")
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
  async getITITrade() {

    try {
      this.searchRequest.Action = "_ITITrade";
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.getITITrade(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITITrade = data['Data'];
          console.log(this.ListITITrade, "ListITITrade")
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


  async RecordPerPage() {
    this.searchRequest.PageSize;
    this.GetTradeAndColleges(1);
  }

  async GetTradeAndColleges(i: any) {

    console.log("i", i);
    if (i == 1) {
      this.pageNo = 1;
    } else if (i == 2) {
      this.pageNo++;
    } else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    } else {
      this.pageNo = i;
    }
    try {
      
      //this.searchRequest.PageSize = 100;
      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'LIST'

      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize

      if (this.ActiveStatusModel === 1) {
        this.searchRequest.ActiveStatus = true;
      }
      else {
        this.searchRequest.ActiveStatus = false;
      }
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.GetTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ListITICollegeTrade = data['Data'];

          this.totalRecord = this.ListITICollegeTrade[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

          console.log(this.ListITICollegeTrade, "ListITICollegeTrade")
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

  async exportExcelData() {
    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return
    }
    try {


      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'LIST_DOWNLOAD'



      if (this.ActiveStatusModel === 1) {
        this.searchRequest.ActiveStatus = true;
      }
      else {
        this.searchRequest.ActiveStatus = false;
      }



      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.GetTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data", data);
          if (data.State === EnumStatus.Success) {
            this.DataExcel = data.Data;
            console.log("MeritDataExcel", this.DataExcel);

            const unwantedColumns = [
              "TradeSchemeId", "SeatNotAvailable", "TotalRecords",	"CollegeTradeId","CollegeId",	"TradeId"
            ];
            const filteredData = this.DataExcel.map((item: { [x: string]: any; }) => {
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
            XLSX.writeFile(wb, 'ItiCollageTradeList.xlsx');

            //this.searchRequest = new ItiMeritSearchModel()
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error))
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




  async GetViewSeatDetails(ID: any, CollegeNamePop: string, TradeNamePop: string, TradeSchemeNamePop: string) {
    try {

      this.CollegeNamePop = CollegeNamePop;
      this.TradeNamePop = TradeNamePop;
      this.TradeSchemeNamePop = TradeSchemeNamePop;


      this.searchRequest.PageSize = 100;
      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'DETAILS'
      this.searchRequest.CollegeTradeId = ID;
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.GetTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ListViewSeatDetails = data['Data'];
          console.log(this.ListViewSeatDetails, "ListViewSeatDetails")
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


  async openViewSeatDetails(content: any, ID: any, CollegeNamePop: string, TradeNamePop: string, TradeSchemeNamePop: string) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.GetViewSeatDetails(ID, CollegeNamePop, TradeNamePop, TradeSchemeNamePop);

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
  CloseModal() {

    this.modalService.dismissAll();
  }

  onCancel(): void {
    this.searchRequest.PageSize = 10;
    this.searchRequest.CollegeCode = '';
    this.searchRequest.TradeCode = '';
    this.searchRequest.ManagementTypeId = 0;
    this.searchRequest.CollegeID = 0;
    this.searchRequest.TradeID = 0;
    this.searchRequest.TradeSchemeId = 0;
    this.searchRequest.TradeLevelId = '0'; 
    this.GetTradeAndColleges(1);
  }



  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetTradeAndColleges(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.ListITICollegeTrade[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetTradeAndColleges(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetTradeAndColleges(3)
    }
  }




}
