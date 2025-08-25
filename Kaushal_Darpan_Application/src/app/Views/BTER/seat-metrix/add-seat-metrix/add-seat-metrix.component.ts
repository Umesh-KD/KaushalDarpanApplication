import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { BTERCollegeBranchModel, BTERSeatMetrixModel, BTERSeatsDistributionsDataModels, BTERSeatsDistributionsSearchModel } from '../../../../Models/BTER/BTERSeatsDistributions';
import { ITISeatsDistributionsService } from '../../../../Services/ITI-Seats-Distributions/iti-seats-distributions.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ItiCollegesSearchModel } from '../../../../Models/CommonMasterDataModel';
import { OptionsDetailsDataModel } from '../../../../Models/ITIFormDataModel'
import { BTERSeatsDistributionsService } from '../../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-add-seat-metrix',
  templateUrl: './add-seat-metrix.component.html',
  styleUrl: './add-seat-metrix.component.css',
  standalone: false
})

export class AddSeatMetrixComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public RemarkMasterList: any[] = [];
  searchText: string = '';
  request = new BTERSeatsDistributionsDataModels()
  public searchRequest = new BTERSeatsDistributionsDataModels();
  public GetSearchRequest = new BTERCollegeBranchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public SeatsDistributionsList: any[] = [];
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ManagmentTypeList: any = []
  public ItiCollegesList: any = []
  public seatMetrix: BTERSeatMetrixModel[] = []
  public ItiCollegesTradeList: any = []
  public formData = new OptionsDetailsDataModel()
  public transactionData$: any;
  public seatMetrixHeader = new BTERSeatMetrixModel();
  public ITITradeSchemeList: any = [];
  public DataExcel: any = [];
  public IsNull: boolean = false;
  public CollegesId: any = [];

  public TradeSchemeId: any = [];

  public previousSelection: any = [];
  public selectedFile: File | null = null;  // Store the selected file

  public importFile: any;
  totalRecord: any = 0;

  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private SeatsDistributionsService: BTERSeatsDistributionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private Swal2: SweetAlert2) {
  }



  async ngOnInit() {

    this.searchRequest.StreamTypeId = String(this.route.snapshot.paramMap.get('id')?.toString());

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

    this.seatMetrixHeader.Total_M_H = "0";
    this.seatMetrixHeader.Total_F_H = "0";
    this.seatMetrixHeader.SC_H = "0";
    this.seatMetrixHeader.ST_H = "0";
    this.seatMetrixHeader.OBC_H = "0";
    this.seatMetrixHeader.MBC_H = "0";
    this.seatMetrixHeader.EWS_H = "0";
    this.seatMetrixHeader.TSP_H = "0";
    this.seatMetrixHeader.PH_H = "0";

    this.seatMetrixHeader.KM_H = "0";

    this.seatMetrixHeader.SMD_H = "0";


    this.seatMetrixHeader.EX_H = "0";
    this.seatMetrixHeader.WID_H = "0";

    this.seatMetrixHeader.MGM = "0";
    this.seatMetrixHeader.TFWS = "0";


    this.GetManagmentType();
    this.getSeatsDistributionsList();
    await this.GetRemarkMasterListDDL();
    await this.GetIITTradeScheme();
  }

  //exportToExcel(): void {
  //  //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('data-table')!);
  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.SeatsDistributionsList);
  //  // Create a new Excel workbook this.PreExamStudentData
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //  // Export the Excel file
  //  XLSX.writeFile(wb, 'SeatsDistributionsList.xlsx');
  //}


  exportToExcel(): void {
    // Check if seatMetrix has data
    if (!this.seatMetrix || this.seatMetrix.length === 0) {
      this.toastr.error("Please Fill Data then Download ");
      return;  // Exit the function if no data is present
    }

    // If data is available, proceed with the export
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.seatMetrix);

    // Create a new Excel workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'BTERseatMetrixDistributions.xlsx');
  }



  //DownloadSample(): void {
  //  
  //  const headers = ['CollegeName', 'TradeName', 'StreamTypeName', 'TotalSeats', 'TotalM', 'TotalF', 'OBC_M', 'OBC_F', 'MBC_M', 'MBC_F', 'EWS_M', 'EWS_F', 'SC_M'
  //    , 'SC_F', 'ST_M', 'ST_F', 'KM', 'PH', 'EX', 'WID', 'SMD', 'MGM', 'TFWS', 'TSP_M', 'TSP_F', 'GEN_M', 'GEN_F'];
  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.seatMetrix, { header: headers });
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'BTERSeatMetrixFormate');

  //  // Export the Excel file
  //  XLSX.writeFile(wb, 'BTERSeatMetrixFormate.xlsx');
  //}


  async SampleexportExcelData() {
    
    try {
      this.GetSearchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.GetSearchRequest.PageNumber = 1
      this.GetSearchRequest.PageSize = this.totalRecord
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetSampleSeatmatrixAndColleges(this.GetSearchRequest)
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
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'BTERSampleSeatsDistributionsList.xlsx');

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




  //exportToExcel(): void {
  //  const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
  //  const filteredData = this.SeatsDistributionsList.map(item => {
  //    const filteredItem: any = {};
  //    Object.keys(item).forEach(key => {
  //      if (!unwantedColumns.includes(key)) {
  //        filteredItem[key] = item[key];
  //      }
  //    });
  //    return filteredItem;
  //  });
  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //  XLSX.writeFile(wb, 'SeatsDistributionsList.xlsx');
  //}

  onFileChange(event: any): void {
    // Get the file from the input element
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.ImportExcelFile(file);
      this.importFile = null;
    }
  }


  ImportExcelFile(file: File): void {
    
    let mesg = '';
    this.SeatsDistributionsService.SampleImportExcelFile(file)
      .then((data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (data.State === EnumStatus.Success) {

          this.DataExcel = data.Data;
          this.transactionData$ = [];
          this.transactionData$ = of(this.DataExcel);
          this.transactionData$.pipe(
            map((data: any[]) => {
              // Assuming each item in the array is an object and you want to get key-value pairs
              return data.map((item: any) => {
                const keys = Object.keys(item);      //Extract keys
                const values = Object.values(item);  //Extract values

                keys.forEach((key) => {
                  if (item[key] === null || item[key] === undefined) {
                    this.ErrorMessage.push(`${key} value is null`);
                  }
                  console.log(this.ErrorMessage, "error")
                });

                //Check for null or undefined values in values
                values.forEach((value, index) => {

                  if (value === "null" || value === "") {
                    

                    mesg += `${keys[index]} value is null</br>`;

                    this.IsNull = true;
                  }

                });

                values.forEach((value, index) => {
                  if (Number(value) < 0) {
                    

                    mesg += `${keys[index]} value is invalid (negative) </br>`;

                    this.IsNull = true;
                  }

                });
                if (mesg != '') {
                  this.Swal2.Info(mesg);
                  //this.CloseModalPopup();
                  this.selectedFile = null;
                  // this.seatMetrix = []
                } else {
                  this.seatMetrix = this.DataExcel;
                }


                return { keys, values };  // Return an object with separate keys and values arrays
              });
            })
          ).subscribe((result: any) => {
            this.DataExcel = result;
            console.log('Processed Data:', result);
            // `result` will be an array of objects with `keys` and `values` arrays
          });
          if (this.IsNull == true) {
            this.DataExcel = [];
          }
        }
      });
  }


  async Back() {
    
    if (this.searchRequest.StreamTypeId == "1") {
      this.router.navigate(['BTERSeatMetrixENG/1'])
    }
    else if (this.searchRequest.StreamTypeId == "3") {
      this.router.navigate(['/BTERSeatMetrixLit/3'])
    }
  }

  async getSeatsDistributionsList() {

    try {
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.Type = this.CollegesId.join(',');//this.CollegesId; //this.CollegesId[this.CollegesId.length - 1];
      this.searchRequest.StreamTypeId = this.searchRequest.StreamTypeId;
      this.searchRequest.Action = 'COLLEGE_TRADE_LIST';
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetSeatMetrixData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.seatMetrix = data['Data'];
          this.Calculate(0);
          this.CalculateFooterTotal();
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



  async GetRemarkMasterListDDL() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterData("ITIRemark").then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.RemarkMasterList = parsedData.Data;
        console.log(this.RemarkMasterList, "ITIRemarkList")
      }, error => console.error(error));

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

  onReset() {
    this.searchRequest = new BTERSeatsDistributionsDataModels();
    this.getSeatsDistributionsList();
  }


  async GetInstituteListDDL() {


    try {
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.Type = this.formData.ManagementTypeID.toString();
      this.searchRequest.Action = 'COLLEGE_LIST';
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetSeatMetrixData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ItiCollegesList = data['Data'];
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



  async GetManagmentType() {
    try {
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.Type = '0';
      this.searchRequest.Action = 'COLLAGE_TYPE_LIST';
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetSeatMetrixData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ManagmentTypeList = data['Data'];
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

  async GetCollegeTradeList(ev: MatSelectChange) {

    console.log(ev.source.selected);

    var id = this.CollegesId;

    try {
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.Type = this.CollegesId.join(',');//this.CollegesId; //this.CollegesId[this.CollegesId.length - 1];
      this.searchRequest.StreamTypeId = this.searchRequest.StreamTypeId;
      this.searchRequest.Action = 'COLLEGE_TRADE_LIST';
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetSeatMetrixData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.seatMetrix = data['Data'];
          this.Calculate(0);
          this.CalculateFooterTotal();
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




  async CalculateFooterTotal() {
    var TotalSeats = 0;
    var TotalM = 0;
    var TotalF = 0;
    var TotalSC_M = 0;
    var TotalSC_F = 0;
    var TotalST_M = 0;
    var TotalST_F = 0;
    var TotalOBC_M = 0;
    var TotalOBC_F = 0;
    var TotalMBC_M = 0;
    var TotalMBC_F = 0;
    var TotalEWS_M = 0;
    var TotalEWS_F = 0;
    var TotalTSP_M = 0;
    var TotalTSP_F = 0;
    var TotalGEN_M = 0;
    var TotalGEN_F = 0;

    var TotalTFWS = 0;


    var TotalKM = 0;

    var TotalPH = 0;
    var TotalEX = 0;
    var TotalWID = 0;
    var TotalSMD = 0;

    var TotalMGM = 0;



    for (var i = 0; i < this.seatMetrix.length; i++) {
      TotalSeats = TotalSeats + parseInt(this.seatMetrix[i].TotalSeats);
      TotalM = TotalM + parseInt(this.seatMetrix[i].TotalM)
      TotalF = TotalF + parseInt(this.seatMetrix[i].TotalF)
      TotalSC_M = TotalSC_M + parseInt(this.seatMetrix[i].SC_M)
      TotalSC_F = TotalSC_F + parseInt(this.seatMetrix[i].SC_F)
      TotalST_M = TotalST_M + parseInt(this.seatMetrix[i].ST_M)
      TotalST_F = TotalST_F + parseInt(this.seatMetrix[i].ST_F)
      TotalOBC_M = TotalOBC_M + parseInt(this.seatMetrix[i].OBC_M);
      TotalOBC_F = TotalOBC_F + parseInt(this.seatMetrix[i].OBC_F);
      TotalMBC_M = TotalMBC_M + parseInt(this.seatMetrix[i].MBC_M);
      TotalMBC_F = TotalMBC_F + parseInt(this.seatMetrix[i].MBC_F);
      TotalEWS_M = TotalEWS_M + parseInt(this.seatMetrix[i].EWS_M);
      TotalEWS_F = TotalEWS_F + parseInt(this.seatMetrix[i].EWS_F);
      TotalTSP_M = TotalTSP_M + parseInt(this.seatMetrix[i].TSP_M);
      TotalTSP_F = TotalTSP_F + parseInt(this.seatMetrix[i].TSP_F);
      TotalGEN_M = TotalGEN_M + parseInt(this.seatMetrix[i].GEN_M);
      TotalGEN_F = TotalGEN_F + parseInt(this.seatMetrix[i].GEN_F);

      TotalKM = TotalKM + parseInt(this.seatMetrix[i].KM);

      TotalPH = TotalPH + parseInt(this.seatMetrix[i].PH);
      TotalEX = TotalEX + parseInt(this.seatMetrix[i].EX);
      TotalWID = TotalWID + parseInt(this.seatMetrix[i].WID);

      TotalSMD = TotalSMD + parseInt(this.seatMetrix[i].SMD);

      TotalMGM = TotalMGM + parseInt(this.seatMetrix[i].MGM);

      TotalTFWS = TotalTFWS + parseInt(this.seatMetrix[i].TFWS);

    }
    this.seatMetrixHeader.TotalSeats = TotalSeats.toString();
    this.seatMetrixHeader.TotalM = TotalM.toString();
    this.seatMetrixHeader.TotalF = TotalF.toString();
    this.seatMetrixHeader.SC_M = TotalSC_M.toString();
    this.seatMetrixHeader.SC_F = TotalSC_F.toString();
    this.seatMetrixHeader.ST_M = TotalST_M.toString();
    this.seatMetrixHeader.ST_F = TotalST_F.toString();
    this.seatMetrixHeader.OBC_M = TotalOBC_M.toString();
    this.seatMetrixHeader.OBC_F = TotalOBC_F.toString();
    this.seatMetrixHeader.MBC_M = TotalMBC_M.toString();
    this.seatMetrixHeader.MBC_F = TotalMBC_F.toString();
    this.seatMetrixHeader.EWS_M = TotalEWS_M.toString();
    this.seatMetrixHeader.EWS_F = TotalEWS_F.toString();
    this.seatMetrixHeader.TSP_M = TotalTSP_M.toString();
    this.seatMetrixHeader.TSP_F = TotalTSP_F.toString();
    this.seatMetrixHeader.GEN_M = TotalGEN_M.toString();
    this.seatMetrixHeader.GEN_F = TotalGEN_F.toString();

    this.seatMetrixHeader.KM = TotalKM.toString();

    this.seatMetrixHeader.PH = TotalPH.toString();
    this.seatMetrixHeader.EX = TotalEX.toString();
    this.seatMetrixHeader.WID = TotalWID.toString();

    this.seatMetrixHeader.SMD = TotalSMD.toString();

    this.seatMetrixHeader.MGM = TotalMGM.toString();
    this.seatMetrixHeader.TFWS = TotalTFWS.toString();

  }






  async GetIITTradeScheme() {
    try {
      await this.commonMasterService.GetCommonMasterData("IITTradeScheme").then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
        console.log(this.ITITradeSchemeList, "ITITradeSchemeList")
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



  async Calculate(item: any) {
    var th = this;
    this.seatMetrix.forEach(function (itm, index) {
      th.Calculate_C1(index, itm);
      th.CalculateFooterTotal();
    });

  }

  async Calculate_C1(index: number, item: BTERSeatMetrixModel) {


    var C1 = 1;
    if (index == 0) {
      C1 = parseInt(this.seatMetrix[0].TotalSeats);
    } else {
      C1 = parseInt(item.TotalSeats) + parseInt(this.seatMetrix[index - 1].TotalSeatCumulative);
    }

    //this.seatMetrix[index].TotalSeatCumulative = C1;
    item.TotalSeatCumulative = C1.toString();


    var perM = (C1 * parseFloat(this.seatMetrixHeader.Total_M_H) / 100).toFixed(2);
    var perF = (C1 * parseFloat(this.seatMetrixHeader.Total_F_H) / 100).toFixed(2);

    item.TotalSeatMCumulative = Math.round(parseFloat(perM)).toString();
    item.TotalSeatFCumulative = Math.round(parseFloat(perF)).toString();

    if (index == 0) {
      item.TotalM = Math.round(parseFloat(perM)).toString();
      item.TotalF = Math.round(parseFloat(perF)).toString();

    } else {
      var cal1 = Math.round(parseFloat(perM));
      var cal2 = parseInt(this.seatMetrix[index - 1].TotalSeatMCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
      item.TotalM = (cal1 - cal2).toString();

      var cal1F = Math.round(parseFloat(perF));
      var cal2F = parseInt(this.seatMetrix[index - 1].TotalSeatFCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
      item.TotalF = (cal1F - cal2F).toString();
    }




    if (1 == 1)/*SC*/ {
      var perSC_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.SC_H) / 100).toFixed(2);
      var perSC_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.SC_H) / 100).toFixed(2);

      item.SC_MCumulative = Math.round(parseFloat(perSC_M)).toString();
      item.SC_FCumulative = Math.round(parseFloat(perSC_F)).toString();

      if (index == 0) {
        item.SC_M = Math.round(parseFloat(perSC_M)).toString();
        item.SC_F = Math.round(parseFloat(perSC_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perSC_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].SC_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.SC_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perSC_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].SC_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.SC_F = (cal1F - cal2F).toString();
      }

    }

    if (1 == 1)/*ST*/ {
      var perST_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.ST_H) / 100).toFixed(2);
      var perST_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.ST_H) / 100).toFixed(2);

      item.ST_MCumulative = Math.round(parseFloat(perST_M)).toString();
      item.ST_FCumulative = Math.round(parseFloat(perST_F)).toString();

      if (index == 0) {
        item.ST_M = Math.round(parseFloat(perST_M)).toString();
        item.ST_F = Math.round(parseFloat(perST_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perST_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].ST_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.ST_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perST_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].ST_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.ST_F = (cal1F - cal2F).toString();
      }
    }

    if (1 == 1)/*OBC*/ {
      var perOBC_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.OBC_H) / 100).toFixed(2);
      var perOBC_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.OBC_H) / 100).toFixed(2);

      item.OBC_MCumulative = Math.round(parseFloat(perOBC_M)).toString();
      item.OBC_FCumulative = Math.round(parseFloat(perOBC_F)).toString();

      if (index == 0) {
        item.OBC_M = Math.round(parseFloat(perOBC_M)).toString();
        item.OBC_F = Math.round(parseFloat(perOBC_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perOBC_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].OBC_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.OBC_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perOBC_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].OBC_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.OBC_F = (cal1F - cal2F).toString();
      }
    }

    if (1 == 1)/*MBC*/ {
      var perMBC_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.MBC_H) / 100).toFixed(2);
      var perMBC_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.MBC_H) / 100).toFixed(2);

      item.MBC_MCumulative = Math.round(parseFloat(perMBC_M)).toString();
      item.MBC_FCumulative = Math.round(parseFloat(perMBC_F)).toString();

      if (index == 0) {
        item.MBC_M = Math.round(parseFloat(perMBC_M)).toString();
        item.MBC_F = Math.round(parseFloat(perMBC_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perMBC_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].MBC_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.MBC_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perMBC_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].MBC_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.MBC_F = (cal1F - cal2F).toString();
      }
    }

    if (1 == 1)/*EWS*/ {
      var perEWS_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.EWS_H) / 100).toFixed(2);
      var perEWS_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.EWS_H) / 100).toFixed(2);

      item.EWS_MCumulative = Math.round(parseFloat(perEWS_M)).toString();
      item.EWS_FCumulative = Math.round(parseFloat(perEWS_F)).toString();

      if (index == 0) {
        item.EWS_M = Math.round(parseFloat(perEWS_M)).toString();
        item.EWS_F = Math.round(parseFloat(perEWS_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perEWS_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].EWS_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.EWS_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perEWS_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].EWS_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.EWS_F = (cal1F - cal2F).toString();
      }
    }

    if (1 == 1)/*TSP*/ {
      var perTSP_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.TSP_H) / 100).toFixed(2);
      var perTSP_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.TSP_H) / 100).toFixed(2);

      item.TSP_MCumulative = Math.round(parseFloat(perTSP_M)).toString();
      item.TSP_FCumulative = Math.round(parseFloat(perTSP_F)).toString();

      if (index == 0) {
        item.TSP_M = Math.round(parseFloat(perTSP_M)).toString();
        item.TSP_F = Math.round(parseFloat(perTSP_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perTSP_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].TSP_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.TSP_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perTSP_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].TSP_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.TSP_F = (cal1F - cal2F).toString();
      }
    }

    //if (1 == 1)/*SAHARIYA*/ {
    //  var perSAHARIYA_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.SAHARIYA_H) / 100).toFixed(2);
    //  var perSAHARIYA_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.SAHARIYA_H) / 100).toFixed(2);

    //  item.SAHARIYA_MCumulative = Math.round(parseFloat(perSAHARIYA_M)).toString();
    //  item.SAHARIYA_FCumulative = Math.round(parseFloat(perSAHARIYA_F)).toString();

    //  if (index == 0) {
    //    item.SAHARIYA_M = Math.round(parseFloat(perSAHARIYA_M)).toString();
    //    item.SAHARIYA_F = Math.round(parseFloat(perSAHARIYA_F)).toString();

    //  } else {
    //    var cal1 = Math.round(parseFloat(perSAHARIYA_M));
    //    var cal2 = parseInt(this.seatMetrix[index - 1].SAHARIYA_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
    //    item.SAHARIYA_M = (cal1 - cal2).toString();

    //    var cal1F = Math.round(parseFloat(perSAHARIYA_F));
    //    var cal2F = parseInt(this.seatMetrix[index - 1].SAHARIYA_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
    //    item.SAHARIYA_F = (cal1F - cal2F).toString();
    //  }
    //}

    //if (1 == 1)/*DEVNARAYAN*/ {
    //  var perDEV_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.DEV_H) / 100).toFixed(2);
    //  var perDEV_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.DEV_H) / 100).toFixed(2);

    //  item.DEV_MCumulative = Math.round(parseFloat(perDEV_M)).toString();
    //  item.DEV_FCumulative = Math.round(parseFloat(perDEV_F)).toString();

    //  if (index == 0) {
    //    item.DEV_M = Math.round(parseFloat(perDEV_M)).toString();
    //    item.DEV_F = Math.round(parseFloat(perDEV_F)).toString();

    //  } else {
    //    var cal1 = Math.round(parseFloat(perDEV_M));
    //    var cal2 = parseInt(this.seatMetrix[index - 1].DEV_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
    //    item.DEV_M = (cal1 - cal2).toString();

    //    var cal1F = Math.round(parseFloat(perDEV_F));
    //    var cal2F = parseInt(this.seatMetrix[index - 1].DEV_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
    //    item.DEV_F = (cal1F - cal2F).toString();
    //  }
    //}

    //if (1 == 1)/*MINORITY*/ {
    //  var perMIN_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.MIN_H) / 100).toFixed(2);
    //  var perMIN_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.MIN_H) / 100).toFixed(2);

    //  item.MIN_MCumulative = Math.round(parseFloat(perMIN_M)).toString();
    //  item.MIN_FCumulative = Math.round(parseFloat(perMIN_F)).toString();

    //  if (index == 0) {
    //    item.MIN_M = Math.round(parseFloat(perMIN_M)).toString();
    //    item.MIN_F = Math.round(parseFloat(perMIN_F)).toString();

    //  } else {
    //    var cal1 = Math.round(parseFloat(perMIN_M));
    //    var cal2 = parseInt(this.seatMetrix[index - 1].MIN_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
    //    item.MIN_M = (cal1 - cal2).toString();

    //    var cal1F = Math.round(parseFloat(perMIN_F));
    //    var cal2F = parseInt(this.seatMetrix[index - 1].MIN_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
    //    item.MIN_F = (cal1F - cal2F).toString();
    //  }
    //}

    item.GEN_M = (parseInt(item.TotalM) - (parseInt(item.SC_M) + parseInt(item.ST_M) + parseInt(item.OBC_M) + parseInt(item.MBC_M) + parseInt(item.EWS_M) + parseInt(item.TSP_M))).toString();
    item.GEN_F = (parseInt(item.TotalF) - (parseInt(item.SC_F) + parseInt(item.ST_F) + parseInt(item.OBC_F) + parseInt(item.MBC_F) + parseInt(item.EWS_F) + parseInt(item.TSP_F))).toString()


    if (1 == 1)/*Kashmiri Migrant(KM)*/ {
      var perKM = (parseFloat(item.TotalSeatCumulative) * parseFloat(this.seatMetrixHeader.KM_H) / 100).toFixed(2);

      item.KM_Cumulative = Math.round(parseFloat(perKM)).toString();

      if (index == 0) {
        item.KM = Math.round(parseFloat(perKM)).toString();
      } else {
        var cal1 = Math.round(parseFloat(perKM));
        var cal2 = parseInt(this.seatMetrix[index - 1].KM_Cumulative);
        item.KM = (cal1 - cal2).toString();
      }
    }


    if (1 == 1)/*PH*/ {
      var perPH = (parseFloat(item.TotalSeatCumulative) * parseFloat(this.seatMetrixHeader.PH_H) / 100).toFixed(2);

      item.PH_Cumulative = Math.round(parseFloat(perPH)).toString();

      if (index == 0) {
        item.PH = Math.round(parseFloat(perPH)).toString();
      } else {
        var cal1 = Math.round(parseFloat(perPH));
        var cal2 = parseInt(this.seatMetrix[index - 1].PH_Cumulative);
        item.PH = (cal1 - cal2).toString();
      }
    }

    if (1 == 1)/*EX*/ {
      var perEX = (parseFloat(item.TotalSeatCumulative) * parseFloat(this.seatMetrixHeader.EX_H) / 100).toFixed(2);

      item.EX_Cumulative = Math.round(parseFloat(perEX)).toString();

      if (index == 0) {
        item.EX = Math.round(parseFloat(perEX)).toString();
      } else {
        var cal1 = Math.round(parseFloat(perEX));
        var cal2 = parseInt(this.seatMetrix[index - 1].EX_Cumulative);
        item.EX = (cal1 - cal2).toString();
      }
    }

    if (1 == 1)/*WIDOW DEVORCEE*/ {
      var perWID = (parseFloat(item.TotalSeatCumulative) * parseFloat(this.seatMetrixHeader.WID_H) / 100).toFixed(2);

      item.WID_Cumulative = Math.round(parseFloat(perWID)).toString();

      if (index == 0) {
        item.WID = Math.round(parseFloat(perWID)).toString();
      } else {
        var cal1 = Math.round(parseFloat(perWID));
        var cal2 = parseInt(this.seatMetrix[index - 1].WID_Cumulative);
        item.WID = (cal1 - cal2).toString();
      }
    }



    if (1 == 1)/*Single Mother Dependent(SMD)*/ {
      var perSMD = (parseFloat(item.TotalSeatCumulative) * parseFloat(this.seatMetrixHeader.SMD_H) / 100).toFixed(2);

      item.SMD_Cumulative = Math.round(parseFloat(perSMD)).toString();

      if (index == 0) {
        item.SMD = Math.round(parseFloat(perSMD)).toString();
      } else {
        var cal1 = Math.round(parseFloat(perSMD));
        var cal2 = parseInt(this.seatMetrix[index - 1].SMD_Cumulative);
        item.SMD = (cal1 - cal2).toString();
      }
    }


    if (item.Remark == "Devnarayan") {

      item.SC_M = "0";
      item.SC_F = "0";
      item.ST_M = "0";
      item.ST_F = "0";

      item.OBC_M = "0";
      item.OBC_F = "0";

      item.MBC_M = "0";
      item.MBC_F = "0";

      item.EWS_M = "0";
      item.EWS_F = "0";

      item.TSP_M = "0";
      item.TSP_F = "0";



      item.GEN_M = "0";
      item.GEN_F = "0";
    }

    if (item.Remark == "Saharia") {


      item.SC_M = "0";
      item.SC_F = "0";
      item.ST_M = "0";
      item.ST_F = "0";

      item.OBC_M = "0";
      item.OBC_F = "0";

      item.MBC_M = "0";
      item.MBC_F = "0";

      item.EWS_M = "0";
      item.EWS_F = "0";

      item.TSP_M = "0";
      item.TSP_F = "0";



      item.GEN_M = "0";
      item.GEN_F = "0";
    }

    if (item.Remark == "TSP") {


      item.TSP_M = item.TotalM;
      item.TSP_F = item.TotalF;


      item.SC_M = "0";
      item.SC_F = "0";
      item.ST_M = "0";
      item.ST_F = "0";

      item.OBC_M = "0";
      item.OBC_F = "0";

      item.MBC_M = "0";
      item.MBC_F = "0";

      item.EWS_M = "0";
      item.EWS_F = "0";




      item.GEN_M = "0";
      item.GEN_F = "0";
    }

    if (item.Remark == "Minority") {



      item.TSP_M = "0";
      item.TSP_F = "0";





      item.SC_M = "0";
      item.SC_F = "0";
      item.ST_M = "0";
      item.ST_F = "0";

      item.OBC_M = "0";
      item.OBC_F = "0";

      item.MBC_M = "0";
      item.MBC_F = "0";

      item.EWS_M = "0";
      item.EWS_F = "0";

      item.GEN_M = "0";
      item.GEN_F = "0";
    }

    if (item.Remark == "TSP Women") {


      item.TSP_M = "0";
      item.TSP_F = item.TotalSeats;


      item.TotalF = item.TotalSeats;
      item.TotalM = "0";



      item.SC_M = "0";
      item.SC_F = "0";
      item.ST_M = "0";
      item.ST_F = "0";

      item.OBC_M = "0";
      item.OBC_F = "0";

      item.MBC_M = "0";
      item.MBC_F = "0";

      item.EWS_M = "0";
      item.EWS_F = "0";

      item.GEN_M = "0";
      item.GEN_F = "0";
    }

    if (item.Remark == "Women Wing" || item.Remark == "Women") {


      item.TotalF = (parseInt(item.TotalF) + parseInt(item.TotalM)).toString();
      item.TotalM = "0";


      item.TSP_F = (parseInt(item.TSP_F) + parseInt(item.TSP_M)).toString();
      item.TSP_M = "0";


      item.SC_F = (parseInt(item.SC_F) + parseInt(item.SC_M)).toString();
      item.SC_M = "0";


      item.ST_F = (parseInt(item.ST_F) + parseInt(item.ST_M)).toString();
      item.ST_M = "0";


      item.OBC_F = (parseInt(item.OBC_F) + parseInt(item.OBC_M)).toString();
      item.OBC_M = "0";


      item.MBC_F = (parseInt(item.MBC_F) + parseInt(item.MBC_M)).toString();
      item.MBC_M = "0";


      item.EWS_F = (parseInt(item.EWS_F) + parseInt(item.EWS_M)).toString();
      item.EWS_M = "0";

      item.GEN_F = (parseInt(item.GEN_F) + parseInt(item.GEN_M)).toString();
      item.GEN_M = "0";
    }


  }

  checkNumber(num: any) {

    let number = num;
    let parsedValue = parseInt(number)

    if (parsedValue < 0) {
      return false;
    } else {
      return true;
    }
  }

  // save SeatsDistributions
  async SaveSeatsDistributions() {
    //confirmed
    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      var mesg = "";
      this.seatMetrix.forEach((x) => {

        x.FinancialYearID = this.sSOLoginDataModel.FinancialYearID, x.UserId = this.sSOLoginDataModel.UserID,
          x.EndTermID = this.sSOLoginDataModel.EndTermID

        if (Number(x.SC_M) < 0) {
          mesg += ` SC_M value is negative. Please currect it.</br>`;
        }
        if (Number(x.SC_F) < 0) {
          mesg += ` SC_F value is negative. Please currect it.</br>`;
        }
        if (Number(x.ST_M) < 0) {
          mesg += ` ST_M value is negative. Please currect it.</br>`;
        }
        if (Number(x.ST_F) < 0) {
          mesg += ` ST_F value is negative. Please currect it.</br>`;
        }
        if (Number(x.OBC_M) < 0) {
          mesg += ` OBC_M value is negative. Please currect it.</br>`;
        }
        if (Number(x.OBC_F) < 0) {
          mesg += ` OBC_F value is negative. Please currect it.</br>`;
        }
        if (Number(x.MBC_M) < 0) {
          mesg += ` MBC_M value is negative. Please currect it.</br>`;
        }
        if (Number(x.MBC_F) < 0) {
          mesg += ` MBC_F value is negative. Please currect it.</br>`;
        }
        if (Number(x.EWS_M) < 0) {
          mesg += ` EWS_M value is negative. Please currect it.</br>`;
        }
        if (Number(x.EWS_F) < 0) {
          mesg += ` EWS_F value is negative. Please currect it.</br>`;
        }
        if (Number(x.TSP_M) < 0) {
          mesg += ` TSP_M value is negative. Please currect it.</br>`;
        }
        if (Number(x.TSP_F) < 0) {
          mesg += ` TSP_F value is negative. Please currect it.</br>`;
        }
        if (Number(x.PH) < 0) {
          mesg += ` PH value is negative. Please currect it.</br>`;
        }
        if (Number(x.KM) < 0) {
          mesg += ` KM value is negative. Please currect it.</br>`;
        }
        if (Number(x.EX) < 0) {
          mesg += ` EX value is negative. Please currect it.</br>`;
        }
        if (Number(x.SMD) < 0) {
          mesg += ` SMD value is negative. Please currect it.</br>`;
        }
        if (Number(x.WID) < 0) {
          mesg += ` WID value is negative. Please currect it.</br>`;
        }
        if (Number(x.TFWS) < 0) {
          mesg += ` TFWS value is negative. Please currect it.</br>`;
        }
        if (Number(x.MGM) < 0) {
          mesg += ` MGM value is negative. Please currect it.</br>`;
        }

        if (Number(x.GEN_M) < 0) {
          mesg += ` GEN_M value is negative. Please currect it.</br>`;
        }
        if (Number(x.GEN_F) < 0) {
          mesg += ` GEN_F value is negative. Please currect it.</br>`;
        }



      });
      

      if (mesg == "") {
        console.log(this.seatMetrix, "GeatDistribution")
        await this.SeatsDistributionsService.SaveSeatsDistributions(this.seatMetrix)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            //
            if (this.State == EnumStatus.Success) {
              this.toastr.success(this.Message)
              //this.seatMetrix = [];
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.Message)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })

      } else {
        this.toastr.warning(mesg);
      }
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
