import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { BTERCollegeTradeSearchModel, BTERSeatIntakeDataModel } from '../../../../Models/BTER/BTERSeatIntakeDataModel';

import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { BterSeatIntakeService } from '../../../../Services/BTER/ItiSeatIntake/iti-seat-intake.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { ITI_NCVTService } from '../../../../Services/ITI-NVCT/iti-nvct.service';
import { ITINCVTDataModel } from '../../../../Models/ITI/NCVTDataModels';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.css'],
    standalone: false
})
export class ImportDataComponent implements OnInit {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsNull: boolean = false;
  searchText: string = '';
  public searchRequest1 = new BTERCollegeTradeSearchModel();
  public searchRequest = new ITICollegeTradeSearchModel();
  public searchRequest2 = new ITINCVTDataModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public BTERTspAreasId: number | null = null;
  public ActiveStatusModel: number = 1;

  public SSOLoginDataModel = new SSOLoginDataModel();
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
  public ListITICollegeByManagement: any = [];
  public ListITITrade: any = [];
  public NCVTData: any = [];
  public ListITIManagementType: any = [];
  public ListITITradeScheme: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private BTERCollegeTradeService: BterSeatIntakeService,
    private ITICollegeTradeService: ItiSeatIntakeService,
    private Swal2: SweetAlert2,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private ncvtService: ITI_NCVTService,

  ) { }



  async ngOnInit() {

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
    console.log(this.SSOLoginDataModel, "SSOLoginDataModel")

    await this.GetNCVTUPLOADED(1)
    await this.MasterFilterList();
    this.getITICollege();
    this.getITITrade();
    this.AllotmentChange();
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







  async RecordPerPage() {
    this.searchRequest.PageSize;
    this.GetNCVTUPLOADED(1);
  }

  onReset() {
    this.searchRequest.ManagementTypeId = 0;
    this.searchRequest.CollegeID = 0;
    this.searchRequest.CollegeCode = "";
    this.searchRequest.TradeID = 0;
    this.searchRequest.TradeCode = "";
    this.GetNCVTUPLOADED(1);
  }

  async GetNCVTUPLOADED(i: any) {


    if (this.searchRequest.AllotmentMasterId == 0) {
      return;
    }

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

      this.searchRequest2.FinancialYearID = this.SSOLoginDataModel.FinancialYearID_Session;
      this.searchRequest2.EndTermID = this.SSOLoginDataModel.EndTermID_Session;
      this.searchRequest2.PageNumber = this.pageNo
      this.searchRequest2.PageSize = this.pageSize
      this.searchRequest2.Action = "ImportedData";

      this.searchRequest2.CollegeType = this.searchRequest.ManagementTypeId;
      this.searchRequest2.CollegeId = this.searchRequest.CollegeID;
      this.searchRequest2.CollegeCode = this.searchRequest.CollegeCode;
      this.searchRequest2.TradeId = this.searchRequest.TradeID;
      this.searchRequest2.TradeCode = this.searchRequest.TradeCode;


      this.loaderService.requestStarted();
      await this.ncvtService.GetNCVTExamDataFormat(this.searchRequest2)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.NCVTData = data['Data'];

          this.totalRecord = this.NCVTData[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

          console.log(this.NCVTData, "NCVTData")
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
      this.searchRequest.Action = 'LIST'



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


  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetNCVTUPLOADED(1)
  }

  nextData() {
    debugger
    if (this.totalShowData < Number(this.NCVTData[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetNCVTUPLOADED(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetNCVTUPLOADED(3)
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

  async GetViewSeatDetails(ID: any, CollegeNamePop: string, TradeNamePop: string, TradeSchemeNamePop: string) {
    try {

      this.CollegeNamePop = CollegeNamePop;
      this.TradeNamePop = TradeNamePop;
      this.TradeSchemeNamePop = TradeSchemeNamePop;


      this.searchRequest.PageSize = 100;
      this.searchRequest.PageNumber = 1;
      this.searchRequest.Action = 'DETAILS'
      this.searchRequest.CollegeTradeId = ID;
      this.searchRequest.FinancialYearID = 8;//this.sSOLoginDataModel.FinancialYearID;
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

  async SampleexportExcelData() {

    try {
      this.searchRequest2.Action = "ExcelFormat";
      this.searchRequest2.PageNumber = 1
      this.searchRequest2.PageSize = 5
      this.loaderService.requestStarted();
      await this.ncvtService.GetNCVTExamDataFormat(this.searchRequest2)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data", data);
          if (data.State === EnumStatus.Success) {
            let dataExcel = data.Data;


            const unwantedColumns = [
              "TradeSchemeId1", "SeatNotAvailable1", "TotalRecords1", "CollegeTradeId1", "TradeId1"
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
            const streamIdColumnIndex = columnNames.indexOf("TradeLevelId");
            const tradeSchemelIdColumnIndex = columnNames.indexOf("TradeSchemeId");
            const CollegeStreamIdColumnIndex = columnNames.indexOf("CollegeTradeId");
            const CollegeIdColumnIndex = columnNames.indexOf("CollegeId");
            const TradeIdColumnIndex = columnNames.indexOf("TradeId");

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

            // Hide "StreamTypeId" column if it exists
            if (TradeIdColumnIndex !== -1) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][TradeIdColumnIndex] = { hidden: true };
            }

            // Hide "StreamTypeId" column if it exists
            if (streamIdColumnIndex !== -1) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][streamIdColumnIndex] = { hidden: true };
            }

            // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'ITISampleCollageTradeList.xlsx');

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
      this.searchRequest2.Action = "ExcelFormat";
      this.searchRequest2.PageNumber = 1
      this.searchRequest2.PageSize = 5
      this.loaderService.requestStarted();
      await this.ncvtService.GetNCVTExamDataFormat(this.searchRequest2)
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
        debugger;
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

          //this.DataExcel3.forEach(function (itm: any, indx: number) {

          //  keysHeader.forEach(function (x, index) {
          //    let dat = excelHeader.filter(function (y) { return y == x });
          //    if (dat.length == 0) {
          //      if (indx == 0) {
          //        mesgHeader += (mesgHeader != '' ? ', ' : ' ') + x;
          //      }
          //    } else if (th.DataExcel3[indx][dat[0]] == "") {
          //      mesg += 'Row number ' + (indx + 1) + ' column ' + dat[0] + ' value is empty. <br/>';
          //    }
          //  });

          //})

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



          //this.Swal2.Info(mesgHeader);



          //this.transactionData$ = of(this.DataExcel1);
          //this.transactionData$.pipe(
          //  map((data: any[]) => {
          //    // Assuming each item in the array is an object and you want to get key-value pairs
          //    return data.map((item: any) => {
          //      const keys = Object.keys(item);  // Extract keys
          //      const values = Object.values(item);  // Extract values

          //      keys.forEach((key) => {
          //        if (item[key] === null || item[key] === undefined) {
          //          this.ErrorMessage.push(`${key} value is null`);
          //        }
          //        console.log(this.ErrorMessage,"error")
          //      });

          //       //Check for null or undefined values in values
          //      values.forEach((value, index) => {

          //        if (value === "null" || value === "") {
          //          

          //          mesg += `${keys[index]} value is null</br>`;

          //          this.IsNull = true;
          //        }

          //      });

          //      values.forEach((value, index) => {
          //        if (Number(value) < 0) {
          //          

          //          mesg += `${keys[index]} value is invalid (negative) </br>`;

          //          this.IsNull = true;
          //        }

          //      });
          //      if (mesg != '') {
          //        this.Swal2.Info(mesg);
          //        //this.CloseModalPopup();
          //        this.selectedFile = null;
          //      }


          //      return { keys, values };  // Return an object with separate keys and values arrays
          //    });
          // })
          //).subscribe((result: any) => {
          //  this.DataExcel = result;
          //  console.log('Processed Data:', result);
          //  // `result` will be an array of objects with `keys` and `values` arrays
          //});
          if (this.IsNull == true) {
            this.DataExcel = [];
          }
        }
      });
  }


  // save SeatsDistributions
  async SaveExamData() {

    try {

      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.DataExcel.forEach((x: any) => {
         // x.StreamTypeId = this.searchRequest.StreamTypeId,
        x.FinancialYearID = this.SSOLoginDataModel.FinancialYearID,
        x.EndTermID =      this.SSOLoginDataModel.EndTermID,
        x.CreatedBy =      this.SSOLoginDataModel.UserID,
        x.IPAddress=""

      })

      console.log(this.DataExcel, "GeatDistribution")
      await this.ncvtService.SaveExamData(this.DataExcel)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.CloseModal();
              this.GetNCVTUPLOADED(1)
            } else {
              this.toastr.error(data.Data[0].MSG);
            }
            //this.toastr.success(this.Message)

            //this.ListBTERCollegeTrade = this.DataExcel
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

  ResetData() {
    this.DataExcel = [];
    this.selectedFile = null;
    this.importFile = null;
  }

}
