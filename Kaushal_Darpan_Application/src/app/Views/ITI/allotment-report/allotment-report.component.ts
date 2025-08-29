import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { BTERCollegeTradeSearchModel, BTERSeatIntakeDataModel } from '../../../Models/BTER/BTERSeatIntakeDataModel';

import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { BterSeatIntakeService } from '../../../Services/BTER/ItiSeatIntake/iti-seat-intake.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { BTERAllotmentService } from '../../../Services/BTER/Allotment/allotment.service';
import { BTERSearchModel } from '../../../Models/BTER/BTERAllotmentDataModel';
import { ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { SearchModel } from '../../../Models/ITIAllotmentDataModel';
import { ITIAllotmentService } from '../../../Services/ITI/ITIAllotment/itiallotment.service';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
@Component({
  selector: 'app-allotment-report',
  standalone: false,

  templateUrl: './allotment-report.component.html',
  styleUrl: './allotment-report.component.css'
})
export class AllotmentReportComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsNull: boolean = false;
  searchText: string = '';
  public searchRequest = new ITICollegeTradeSearchModel();
  public searchRequestData = new SearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public ITITspAreasId: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  public ActiveStatusModel: number = 1;

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
  public selectedFile: File | null = null;  // Store the selected file
  public DataExcel: any = [];
  public DataExcel1: any = [];
  public DataExcel2: any = [];
  public DataExcel3: any = [];
  public DataExcel4: any = [];
  public transactionData$: any;
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  MeritGenerateKey: string = "";
  MeritPublishKey: string = "";

  public importFile: any;

  public DateConfigSetting: any = [];
  public transactionData: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,   
    private Swal2: SweetAlert2,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private AllotmentService: ITIAllotmentService,
    private ITICollegeTradeService: ItiSeatIntakeService,
    private activatedRoute: ActivatedRoute,
  ) { }



  async ngOnInit() {
    //this.searchRequest.TradeLevelId = String(this.route.snapshot.paramMap.get('id')?.toString());

    this.searchRequest.ReportingStatus = Number(this.activatedRoute.snapshot.paramMap.get('id') ?? 0)
    this.searchRequest.TradeLevelId = this.activatedRoute.snapshot.paramMap.get('iid') ?? "0";
    this.searchRequest.AllotmentMasterId = Number(this.activatedRoute.snapshot.paramMap.get('idd') ?? 0);
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermId = this.SSOLoginDataModel.EndTermID;
    this.searchRequest.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
    console.log(this.SSOLoginDataModel, "SSOLoginDataModel")
    //await this.GetdateConfigSetting();
    //await this.GetTradeAndColleges(1)
    //this.searchRequest.AllotmentMasterId = 0;
    await this.MasterFilterList();
    this.getITICollege();
    this.getITITrade();

    this.ShowAllotmentDataList(1)

   
    

  }


  async ShowAllotmentDataList(i: any) {

    debugger;

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

    this.searchRequestData.TradeLevel = parseInt(this.searchRequest.TradeLevelId);
    this.searchRequestData.AllotmentMasterId = this.searchRequest.AllotmentMasterId;
    this.searchRequestData.AcademicYearID = this.SSOLoginDataModel.FinancialYearID

    this.searchRequestData.InstituteID = this.searchRequest.CollegeID;
    this.searchRequestData.TradeID = this.searchRequest.TradeID;
    this.searchRequestData.FeePaid = this.searchRequest.FeePaid;
    this.searchRequestData.TradeSchemeId = this.searchRequest.TradeSchemeId;
    this.searchRequestData.CollegeCode = this.searchRequest.CollegeCode;
    this.searchRequestData.TradeCode = this.searchRequest.TradeCode;
    this.searchRequestData.ManagementTypeID = this.searchRequest.ManagementTypeId;
    this.searchRequestData.ReportingStatus = this.searchRequest.ReportingStatus;


    this.searchRequestData.PageNumber = this.pageNo
    this.searchRequestData.PageSize = this.pageSize
    this.transactionData = [];
    try {
      this.loaderService.requestStarted();
      await this.AllotmentService.ShowAlGetAllotmentReport(this.searchRequestData)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.transactionData = data.Data;

            this.totalRecord = this.transactionData[0]?.TotalRecords;
            this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

            //console.log(this.Table_Heading, "this.Table_Heading");
            console.log(this.transactionData, "dataAllMultipal")
            var d = Object.keys(this.transactionData);
            console.log("transactionDatacoloumn" + d);

          } else {
            // this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async exportToExcel() {
    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return
    }
    try {

      this.searchRequestData.TradeLevel = parseInt(this.searchRequest.TradeLevelId);
      this.searchRequestData.AllotmentMasterId = this.searchRequest.AllotmentMasterId;
      this.searchRequestData.AcademicYearID = this.SSOLoginDataModel.FinancialYearID

      this.searchRequestData.InstituteID = this.searchRequest.CollegeID;
      this.searchRequestData.TradeID = this.searchRequest.TradeID;
      this.searchRequestData.FeePaid = this.searchRequest.FeePaid;
      this.searchRequestData.TradeSchemeId = this.searchRequest.TradeSchemeId;
      this.searchRequestData.CollegeCode = this.searchRequest.CollegeCode;
      this.searchRequestData.TradeCode = this.searchRequest.TradeCode;


      this.searchRequestData.PageNumber = 1
      this.searchRequestData.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.AllotmentService.ShowAlGetAllotmentReport(this.searchRequestData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.transactionData = data.Data;

            const unwantedColumns = [
              'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
              'Id', 'Status', 'RemarkForStatus', 'FeePdf', 'RTS', 'TotalRecords', 'MeritMasterId', 'AcademicYearID',
              'DepartmentId', 'PublishBy', 'PublishIP', 'Class'
            ];
            const filteredData = this.transactionData.map((item: { [x: string]: any; }) => {
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
            XLSX.writeFile(wb, 'AllotmentData.xlsx');

            //this.searchRequest = new BterMeritSearchModel()
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


  AllotmentChange() {


    
    if (this.searchRequest.AllotmentMasterId == 1) {
      this.MeritGenerateKey = "CREATE SEAT MATRIX";
      this.MeritPublishKey = "PUBLISH SEAT MATRIX";
    } else if (this.searchRequest.AllotmentMasterId == 4) {
      this.MeritGenerateKey = "CALCULATE SECOND ALLOTMENT SEAT MATRIX";
      this.MeritPublishKey = "PUBLISH SECOND ALLOTMENT SEAT MATRIX";
    } else if (this.searchRequest.AllotmentMasterId == 4) {
      this.MeritGenerateKey = "CALCULATE INTERNAL SLIDING SEAT MATRIX";
      this.MeritPublishKey = "PUBLISH INTERNAL SLIDING SEAT MATRIX";
    }
    this.ListITICollegeTrade = [];
  }

  async GetdateConfigSetting() {
    this.loaderService.requestStarted();
    var data = {
      DepartmentID: this.SSOLoginDataModel.DepartmentID,
      CourseTypeId: 1,
      AcademicYearID: this.SSOLoginDataModel.FinancialYearID,
      EndTermId: this.SSOLoginDataModel.EndTermID,
      Key: 'PUBLISH SEAT MATRIX,CREATE SEAT MATRIX,CALCULATE SECOND ALLOTMENT SEAT MATRIX,PUBLISH SECOND ALLOTMENT SEAT MATRIX,CALCULATE INTERNAL SLIDING SEAT MATRIX,PUBLISH INTERNAL SLIDING SEAT MATRIX',
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonFunctionService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];

        console.log(this.DateConfigSetting[0]['GENERATE MERIT']);

      }, (error: any) => console.error(error)
      );
  }



  async MasterFilterList() {

    try {
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.ITIManagementType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITIManagementType = data['Data'];
          console.log(this.ListITIManagementType, "ListBTERManagementType")
        }, error => console.error(error));

      await this.ITICollegeTradeService.ITITradeScheme()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITITradeScheme = data['Data'];
          console.log(this.ListITITradeScheme, "ListBTERTradeScheme")
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
          console.log(this.ListITICollegeByManagement, "ListBTERCollegeByManagement")
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
          console.log(this.ListITITrade, "ListBTERTrade")
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
    this.ShowAllotmentDataList(1);
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

      console.log(this.DataExcel, "datasave")

      //this.searchRequest.PageSize = 100;
      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'LIST'

      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize
      this.searchRequest.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;

   
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

          console.log(this.ListITICollegeTrade, "ListBTERCollegeTrade")
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

  async exportExcelDataOld() {
    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return
    }
    try {


      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'LIST'



      //if (this.ActiveStatusModel === 1) {
      //  this.searchRequest.ActiveStatus = 1;
      //}
      //else {
      //  this.searchRequest.ActiveStatus = 0;
      //}



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
              "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "CollegeId", "TradeId"
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
            XLSX.writeFile(wb, 'BTERCollageTradeList.xlsx');

            //this.searchRequest = new BTERMeritSearchModel()
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

  async exportExcelData() {
    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return;
    }

    try {
      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'LIST';

      //if (this.ActiveStatusModel === 1) {
      //  this.searchRequest.ActiveStatus = 1;
      //} else {
      //  this.searchRequest.ActiveStatus = 0;
      //}

      this.searchRequest.PageNumber = 1;
      this.searchRequest.PageSize = this.totalRecord;

      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.GetTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data", data);

          if (data.State === EnumStatus.Success) {
            this.DataExcel = data.Data;
            console.log("MeritDataExcel", this.DataExcel);

            const unwantedColumns = [             
               "ApplicationNo", "MeritNo", "Name", "Gender", "DOB"           
              , "StudentCategory", "MobileNo", "AadharNo", "CollegeCode"    
              , "Collegename", "TradeCode", "TradeName", "TradeSchemeName"
              , "AllotedPriority", "AllotedCategory", "IsPH", "IsExServicemen" 
              , "IsWID", "IsTSP", "IsRajDOMICILE", "JoiningStatus",  "PreCategory", "ExCategory"
            ];

            // Filter out unwanted columns
            const filteredData = this.DataExcel.map((item: { [x: string]: any; }) => {
              const filteredItem: any = {};
              Object.keys(item).forEach(key => {
                if (!unwantedColumns.includes(key)) {
                  filteredItem[key] = item[key];
                }
              });
              return filteredItem;
            });

            // Convert filtered data to Excel worksheet
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

            // Get the column names (first row) from filtered data
            const columnNames = Object.keys(filteredData[0]);

            // Find the index of "StreamID" and "StreamTypeId" columns
            const streamIdColumnIndex = columnNames.indexOf("StreamID");
            const streamTypeIdColumnIndex = columnNames.indexOf("StreamTypeId");

            // Hide "StreamID" column if it exists
            if (streamIdColumnIndex !== -1) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][streamIdColumnIndex] = { hidden: true };
            }

            // Hide "StreamTypeId" column if it exists
            if (streamTypeIdColumnIndex !== -1) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][streamTypeIdColumnIndex] = { hidden: true };
            }

            // Create a new workbook and append the worksheet
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Export the Excel file
            XLSX.writeFile(wb, 'BTERCollageTradeList.xlsx');
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
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
    this.searchRequest.TradeCode ='';
    this.searchRequest.ManagementTypeId = 0;
    this.searchRequest.CollegeID = 0;
    this.searchRequest.TradeID = 0;
    this.searchRequest.TradeLevelId = '0';
    this.searchRequest.TradeSchemeId = 0;
    this.searchRequest.AllotmentMasterId = 0;
    //this.searchRequest.StreamTypeId = 0;
    this.ShowAllotmentDataList(1);
  }



  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.ShowAllotmentDataList(1);
  }

  nextData() {
    if (this.totalShowData < Number(this.ListITICollegeTrade[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.ShowAllotmentDataList(1);
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.ShowAllotmentDataList(1);
    }
  }

  private CloseModalPopup() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
      //window.location.reload();
    }, 200);
  }


}
