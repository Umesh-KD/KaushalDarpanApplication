import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { BTERCollegeTradeSearchModel, BTERSeatIntakeDataModel } from '../../../Models/BTER/BTERSeatIntakeDataModel';

import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { BterSeatIntakeService } from '../../../Services/BTER/ItiSeatIntake/iti-seat-intake.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { BTERAllotmentService } from '../../../Services/BTER/Allotment/allotment.service';
import { BTERSearchModel } from '../../../Models/BTER/BTERAllotmentDataModel';
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
  public searchRequest = new BTERCollegeTradeSearchModel();
  public searchRequestData = new BTERSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public BTERTspAreasId: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  public ActiveStatusModel: number = 1;

  public SeatIntakeSearchFormGroup!: FormGroup;

  public ListBTERCollegeTrade: any = [];
  public ListViewSeatDetails: any = [];
  public ListBTERManagementType: any = [];
  public ListBTERTradeScheme: any = [];
  public ListBTERCollegeByManagement: any = [];
  public ListBTERTrade: any = [];
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

  public isCollegeDisabled = false;
  constructor(
    private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private BTERCollegeTradeService: BterSeatIntakeService,
    private Swal2: SweetAlert2,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private AllotmentService: BTERAllotmentService,
  ) { }



  async ngOnInit() {
    this.searchRequest.StreamTypeId = String(this.route.snapshot.paramMap.get('id')?.toString());


    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermId = this.sSOLoginDataModel.EndTermID;
    await this.GetdateConfigSetting();
    //await this.GetTradeAndColleges(1)
    await this.MasterFilterList();
    await this.getBTERCollege();
    await this.getBTERTrade();

    debugger
    // principal
    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon
        || this.sSOLoginDataModel.RoleID == EnumRole.Principle_NonEng_Degree1Year || this.sSOLoginDataModel.RoleID == EnumRole.Principle_NonEng_Degree2YearLateral
    ) {
      this.searchRequest.CollegeID = this.sSOLoginDataModel.InstituteID;
      this.isCollegeDisabled = true;
    }

    await this.ShowAllotmentDataList(1)

    this.searchRequest.AllotmentMasterId = 0;


    let _studentFilterStatusId = Number(this.route.snapshot.paramMap.get('AllotmentStatus')?.toString());
    if (_studentFilterStatusId > 0) {
      
      this.searchRequest.AllotmentStatus = _studentFilterStatusId;
      await this.ShowAllotmentDataList(1);
    }

  }


  async ShowAllotmentDataList(i: any) {

    

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

    this.searchRequestData.StreamTypeID = parseInt(this.searchRequest.StreamTypeId);
    this.searchRequestData.AllotmentMasterId = this.searchRequest.AllotmentMasterId;
    this.searchRequestData.AcademicYearID = this.sSOLoginDataModel.FinancialYearID

    this.searchRequestData.CollegeId = this.searchRequest.CollegeID;
    this.searchRequestData.StreamID = this.searchRequest.StreamID;
    this.searchRequestData.FeePaid = this.searchRequest.FeePaid;
    this.searchRequestData.ShiftId = this.searchRequest.ShiftID;
    this.searchRequestData.CollegeCode = this.searchRequest.CollegeCode;
    this.searchRequestData.StreamCode = this.searchRequest.StreamCode;
    this.searchRequestData.AllotmentStatus = this.searchRequest.AllotmentStatus;
    this.searchRequestData.RoleID = this.sSOLoginDataModel.RoleID


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
            console.log(this.transactionData,"transactionData")
            this.totalRecord = this.transactionData[0]?.TotalRecords;
            this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
            var d = Object.keys(this.transactionData);
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
      this.searchRequestData.StreamTypeID = parseInt(this.searchRequest.StreamTypeId);
      this.searchRequestData.AllotmentMasterId = this.searchRequest.AllotmentMasterId;
      this.searchRequestData.AcademicYearID = this.sSOLoginDataModel.FinancialYearID

      this.searchRequestData.CollegeId = this.searchRequest.CollegeID;
      this.searchRequestData.StreamID = this.searchRequest.StreamID;
      this.searchRequestData.FeePaid = this.searchRequest.FeePaid;
      this.searchRequestData.ShiftId = this.searchRequest.ShiftID;
      this.searchRequestData.CollegeCode = this.searchRequest.CollegeCode;
      this.searchRequestData.StreamCode = this.searchRequest.StreamCode;
      this.searchRequestData.AllotmentStatus = this.searchRequest.AllotmentStatus;

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

  async exportToPdf() {
    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return
    }
    try {
      this.searchRequestData.StreamTypeID = parseInt(this.searchRequest.StreamTypeId);
      this.searchRequestData.AllotmentMasterId = this.searchRequest.AllotmentMasterId;
      this.searchRequestData.AcademicYearID = this.sSOLoginDataModel.FinancialYearID

      this.searchRequestData.CollegeId = this.searchRequest.CollegeID;
      this.searchRequestData.StreamID = this.searchRequest.StreamID;
      this.searchRequestData.FeePaid = this.searchRequest.FeePaid;
      this.searchRequestData.ShiftId = this.searchRequest.ShiftID;
      this.searchRequestData.CollegeCode = this.searchRequest.CollegeCode;
      this.searchRequestData.StreamCode = this.searchRequest.StreamCode;
      this.searchRequestData.AllotmentStatus = this.searchRequest.AllotmentStatus;

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
            //const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
            //const wb: XLSX.WorkBook = XLSX.utils.book_new();
            //XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            //XLSX.writeFile(wb, 'AllotmentData.xlsx');

            const doc = new jsPDF({
              orientation: 'landscape',
              unit: 'pt',
              format: 'a4'
            });

            doc.setFontSize(18);
            doc.text('Allotment Report', 20, 20);

            const tableHeaders = [Object.keys(filteredData[0])];
            const tableData = filteredData.map((item: any) => Object.values(item));

            autoTable(doc, {
              head: tableHeaders,
              body: tableData,
              startY: 30,
              theme: 'grid',
              margin: { top: 30 },
              styles: {
                fontSize: 8,
                cellWidth: 'wrap'
              },
              columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 80 }
                // add more or remove based on your data
              }
            });

            doc.save('AllotmentData.pdf');

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
    this.ListBTERCollegeTrade = [];
  }

  async GetdateConfigSetting() {
    this.loaderService.requestStarted();
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.searchRequest.StreamTypeId,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      SSOID: this.sSOLoginDataModel.SSOID,
      Key: 'PUBLISH SEAT MATRIX,CREATE SEAT MATRIX,CALCULATE SECOND ALLOTMENT SEAT MATRIX,PUBLISH SECOND ALLOTMENT SEAT MATRIX,CALCULATE INTERNAL SLIDING SEAT MATRIX,PUBLISH INTERNAL SLIDING SEAT MATRIX'
    }

    await this.commonFunctionService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
      }, (error: any) => console.error(error)
      );
  }



  async MasterFilterList() {

    try {
      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.BTERManagementType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListBTERManagementType = data['Data'];
        }, error => console.error(error));

      await this.BTERCollegeTradeService.BTERTradeScheme()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListBTERTradeScheme = data['Data'];
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

  async getBTERCollege() {
    try {
      this.searchRequest.Action = "_BTERCollegeByManagementType";
      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.getBTERCollegeByManagement(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListBTERCollegeByManagement = data['Data'];
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
  async getBTERTrade() {

    try {
      this.searchRequest.Action = "_BTERTrade";
      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.getBTERTrade(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListBTERTrade = data['Data'];
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
    try {
      //this.searchRequest.PageSize = 100;
      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'LIST'

      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

      if (this.ActiveStatusModel === 1) {
        this.searchRequest.ActiveStatus = 1;
      }
      else {
        this.searchRequest.ActiveStatus = 0;
      }
      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.GetTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ListBTERCollegeTrade = data['Data'];
          this.totalRecord = this.ListBTERCollegeTrade[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
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



      if (this.ActiveStatusModel === 1) {
        this.searchRequest.ActiveStatus = 1;
      }
      else {
        this.searchRequest.ActiveStatus = 0;
      }



      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.GetTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.DataExcel = data.Data;
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

      if (this.ActiveStatusModel === 1) {
        this.searchRequest.ActiveStatus = 1;
      } else {
        this.searchRequest.ActiveStatus = 0;
      }

      this.searchRequest.PageNumber = 1;
      this.searchRequest.PageSize = this.totalRecord;

      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.GetTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data", data);

          if (data.State === EnumStatus.Success) {
            this.DataExcel = data.Data;
            console.log("MeritDataExcel", this.DataExcel);

            const unwantedColumns = [
              "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "CollegeId", "TradeId"
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


  async GetViewSeatDetails(ID: any, CollegeNamePop: string, TradeNamePop: string, TradeSchemeNamePop: string) {
    try {

      this.CollegeNamePop = CollegeNamePop;
      this.TradeNamePop = TradeNamePop;
      this.TradeSchemeNamePop = TradeSchemeNamePop;


      this.searchRequest.PageSize = 100;
      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'DETAILS'
      this.searchRequest.CollegeStreamId = ID;
      this.searchRequest.FinancialYearID = 8;//this.sSOLoginDataModel.FinancialYearID;
      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.GetTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ListViewSeatDetails = data['Data'];
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
    this.searchRequest.TradeCode = 0;
    this.searchRequest.ManagementTypeId = 0;
    this.searchRequest.CollegeID = 0;
    this.searchRequest.StreamID = 0;
    this.searchRequest.AllotmentMasterId = 0;
    this.searchRequest.AllotmentStatus = 0;
    //this.searchRequest.StreamTypeId = 0;
    this.ShowAllotmentDataList(1);
  }



  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.ShowAllotmentDataList(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.ListBTERCollegeTrade[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.ShowAllotmentDataList(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.ShowAllotmentDataList(3)
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

  async OpenSeatMatrix(content: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  async SampleexportExcelData() {

    try {
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = this.totalRecord
      // this.searchRequest.StreamTypeId=

      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.GetSampleTradeAndColleges(this.searchRequest)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data", data);
          if (data.State === EnumStatus.Success) {
            let dataExcel = data.Data;


            const unwantedColumns = [
              "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "TradeId"
            ];
            const filteredData = dataExcel.map((item: { [x: string]: any; }) => {
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
            const CollegeStreamIdColumnIndex = columnNames.indexOf("CollegeStreamId");
            const CollegeIdColumnIndex = columnNames.indexOf("CollegeId");

            // Hide "StreamID" column if it exists
            if (streamIdColumnIndex !== -1) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][streamIdColumnIndex] = { hidden: true };
            }

            // Hide "StreamTypeId" column if it exists
            if (CollegeStreamIdColumnIndex !== -1) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][CollegeStreamIdColumnIndex] = { hidden: true };
            }

            // Hide "StreamTypeId" column if it exists
            if (CollegeIdColumnIndex !== -1) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][CollegeIdColumnIndex] = { hidden: true };
            }


            // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'BTERSampleCollageTradeList.xlsx');

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

  onFileChange(event: any): void {

    // Get the file from the input element
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.ImportExcelFile(file);
      this.importFile = null;
    }
  }

  async formatExcelData() {
    
    try {
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = 1
      this.loaderService.requestStarted();
      await this.BTERCollegeTradeService.GetSampleTradeAndColleges(this.searchRequest)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));

          if (data.State === EnumStatus.Success) {
            this.DataExcel2 = data.Data;
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

  objectKeys() {
    
    return Object.keys(this.DataExcel[0]);
  }



  async ImportExcelFile(file: File) {
    
    let mesg = '';
    let mesgHeader = '';

    await this.formatExcelData();
    
    await this.BTERCollegeTradeService.SampleImportExcelFile(file)
      .then((data: any) => {

        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (data.State === EnumStatus.Success) {
          this.DataExcel3 = data.Data;
          //this.DataExcel = data.Data;
          
          const excelHeader = Object.keys(this.DataExcel3[0]);
          const keysHeader = Object.keys(this.DataExcel2[0]);
          var th = this;
          //keysHeader.forEach(function (x,index) {
          //  let dat = excelHeader.filter(function (y) { return y == x });
          //  if (dat.length == 0) {
          //    mesgHeader += (mesgHeader != '' ? ', ' : ' ') + x;
          //  } else if (th.DataExcel3[index][dat[0]] == "") {
          //    mesg += (mesg != '' ? ', ' : ' ') + dat[0]+' value is can not blank';
          //  }
          //});

          this.DataExcel3.forEach(function (itm: any, indx: number) {

            keysHeader.forEach(function (x, index) {
              let dat = excelHeader.filter(function (y) { return y == x });
              if (dat.length == 0) {
                if (indx == 0) {
                  mesgHeader += (mesgHeader != '' ? ', ' : ' ') + x;
                }
              } else if (th.DataExcel3[indx][dat[0]] == "") {
                mesg += 'Row number ' + (indx + 1) + ' column ' + dat[0] + ' value is empty. <br/>';
              }
            });

          })

          //keysHeader.forEach(function (x, index) {
          //  let dat = excelHeader.filter(function (y) { return y == x });
          //  if (dat.length == 0) {
          //    mesgHeader += (mesgHeader != '' ? ', ' : ' ') + x;
          //  } else if (th.DataExcel3[index][dat[0]] == "") {
          //    mesg += (mesg != '' ? ', ' : ' ') + dat[0] + ' value is can not blank';
          //  }
          //});


          if (mesgHeader != '') {

            mesgHeader += ` column is not exist in excel. Please download format and upload data in format</br>`;
            this.toastr.error(mesgHeader)
          } else {
            this.DataExcel4 = Object.keys(this.DataExcel3[0]);
            this.DataExcel = this.DataExcel3;
          }

          if (mesg != '') {
            this.DataExcel = [];
            this.toastr.error(mesg)
          }
          if (this.IsNull == true) {
            this.DataExcel = [];
          }
        }
      });
  }

  // save SeatsDistributions
  async BTERSaveSeatsMatrixlist() {

    try {

      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.DataExcel.forEach((x: any) => {
        x.StreamTypeId = this.searchRequest.StreamTypeId,
          x.FinancialYearID = this.sSOLoginDataModel.FinancialYearID, x.UserId = this.sSOLoginDataModel.UserID,
          x.EndTermID = this.sSOLoginDataModel.EndTermID
      })

      await this.BTERCollegeTradeService.BTERSaveSeatsMatrixlist(this.DataExcel)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.CloseModal();
            this.ShowAllotmentDataList(1)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }
  }


  // save PublishSeatMatrix
  async PublishSeatMatrix(Id: any) {
    this.Swal2.Confirmation("Are you sure you want to Publish Seat Matrix? <br> " +
      "<b> #Note: Once You Publish The Seat Matrix, No Changes Would Be Possible After. <br> </b>" +
      "<b> #टिप्पणी : एक बार जब आप सीट मैट्रिक्स प्रकाशित कर देंगे, तो उसके बाद कोई बदलाव संभव नहीं होगा। </b>",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {

            this.isSubmitted = true;
            this.loaderService.requestStarted();
            this.DataExcel1.forEach((x: any) => {
              x.StreamTypeId = this.searchRequest.StreamTypeId,
                x.FinancialYearID = this.sSOLoginDataModel.FinancialYearID, x.UserId = this.sSOLoginDataModel.UserID
            })

            var requestData = new BTERCollegeTradeSearchModel();

            requestData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
            requestData.AllotmentMasterId = Id;
            requestData.StreamTypeId = this.searchRequest.StreamTypeId;
            requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            requestData.CreateBy = this.sSOLoginDataModel.UserID;
            requestData.EndTermId = this.sSOLoginDataModel.EndTermID;
            requestData.IPAddress = "";

            await this.BTERCollegeTradeService.PublishSeatMatrix(requestData)
              .then(async (data: any) => {

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {

                  if (data.Data[0].Status == 1) {
                    this.toastr.success(data.Data[0].MSG);
                  } else {
                    this.toastr.error(data.Data[0].MSG);
                  }

                }
                else if (this.State == EnumStatus.Warning) {
                  this.toastr.warning(this.Message)
                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
              })
          } catch (ex) {
            console.log(ex);
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
              this.isSubmitted = false;
            }, 200);
          }

        }
      });

  }

  async SeatMatixSecondAllotment() {

    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.DataExcel1.forEach((x: any) => {
        x.StreamTypeId = this.searchRequest.StreamTypeId,
          x.FinancialYearID = this.sSOLoginDataModel.FinancialYearID, x.UserId = this.sSOLoginDataModel.UserID
      });

      var requestData = new BTERCollegeTradeSearchModel();

      requestData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      requestData.AllotmentMasterId = 1;
      requestData.StreamTypeId = this.searchRequest.StreamTypeId;
      requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      requestData.CreateBy = this.sSOLoginDataModel.UserID;
      requestData.EndTermId = this.sSOLoginDataModel.EndTermID;
      requestData.IPAddress = "";

      await this.BTERCollegeTradeService.SeatMatixSecondAllotment(requestData)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {

            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.searchRequest.AllotmentMasterId = 4
              await this.ShowAllotmentDataList(1);
            } else {
              this.toastr.error(data.Data[0].MSG);
            }

          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }

  }

  async SeatMatixInternalSliding() {

    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.DataExcel1.forEach((x: any) => {
        x.StreamTypeId = this.searchRequest.StreamTypeId,
          x.FinancialYearID = this.sSOLoginDataModel.FinancialYearID, x.UserId = this.sSOLoginDataModel.UserID
      });

      var requestData = new BTERCollegeTradeSearchModel();

      requestData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      requestData.AllotmentMasterId = 1;
      requestData.StreamTypeId = this.searchRequest.StreamTypeId;
      requestData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      requestData.CreateBy = this.sSOLoginDataModel.UserID;
      requestData.EndTermId = this.sSOLoginDataModel.EndTermID;
      requestData.IPAddress = "";

      await this.BTERCollegeTradeService.SeatMatixInternalSliding(requestData)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {

            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.searchRequest.AllotmentMasterId = 6
              await this.ShowAllotmentDataList(1);
            } else {
              this.toastr.error(data.Data[0].MSG);
            }

          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }

  }


}
