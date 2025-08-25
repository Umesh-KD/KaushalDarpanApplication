import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITISeatMetrixModel, ITISeatsDistributionsDataModels, ITISeatsDistributionsSearchModel } from '../../../../Models/ITISeatsDistributions';
import { ITISeatsDistributionsService } from '../../../../Services/ITI-Seats-Distributions/iti-seats-distributions.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ItiCollegesSearchModel } from '../../../../Models/CommonMasterDataModel';
import { OptionsDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { MatSelect, MatSelectChange } from '@angular/material/select';

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
  request = new ITISeatsDistributionsDataModels()
  public searchRequest = new ITISeatsDistributionsDataModels();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public SeatsDistributionsList: any[] = [];
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ManagmentTypeList: any = []
  public ItiCollegesList: any = []
  public seatMetrix: ITISeatMetrixModel[] = []
  public ItiCollegesTradeList: any = []
  public formData = new OptionsDetailsDataModel()

  public seatMetrixHeader = new ITISeatMetrixModel();
  public ITITradeSchemeList: any = [];

  public CollegesId: any = [];

  public TradeSchemeId: any = [];

  public excelData: any[] = [];

  public selectedFile: File | null = null;  // Store the selected file

  public previousSelection: any = [];
  constructor(
    private commonMasterService: CommonFunctionService,
    private SeatsDistributionsService: ITISeatsDistributionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private Swal2: SweetAlert2) {
  }



  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.TradeLevelId = String(this.route.snapshot.paramMap.get('id')?.toString());
    this.seatMetrixHeader.Total_M_H = "0";
    this.seatMetrixHeader.Total_F_H = "0";
    this.seatMetrixHeader.SC_H = "0";
    this.seatMetrixHeader.ST_H = "0";
    this.seatMetrixHeader.OBC_H = "0";
    this.seatMetrixHeader.MBC_H = "0";
    this.seatMetrixHeader.EWS_H = "0";
    this.seatMetrixHeader.TSP_H = "0";
    this.seatMetrixHeader.SAHARIYA_H = "0";
    this.seatMetrixHeader.DEV_H = "0";
    this.seatMetrixHeader.MIN_H = "0";
    this.seatMetrixHeader.PH_H = "0";
    this.seatMetrixHeader.EX_H = "0";
    this.seatMetrixHeader.WID_H = "0";


    this.GetManagmentType();
    this.getSeatsDistributionsList();
    await this.GetRemarkMasterListDDL();
    await this.GetIITTradeScheme();
  }

  exportToExcel(): void {
    
    //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('data-table')!);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.seatMetrix);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'seatMetrix.xlsx');
  }

  DownloadSample(): void {
    
    const headers = ['CollegeName', 'TradeName', 'StreamTypeName', 'TotalSeats', 'TotalM', 'TotalF'
      , 'TotalSeatCumulative', 'TotalSeatMCumulative', 'TotalSeatFCumulative'
      , 'OBC_M', 'OBC_MCumulative', 'OBC_F', 'OBC_FCumulative', 'MBC_M', 'MBC_MCumulative', 'MBC_F'
      , 'MBC_FCumulative', 'EWS_M', 'EWS_MCumulative', 'EWS_F', 'EWS_FCumulative', 'SC_M'
      , 'SC_MCumulative', 'SC_F', 'SC_FCumulative', 'ST_M', 'ST_MCumulative', 'ST_F'
      , 'ST_FCumulative', 'KM', 'KM_Cumulative', 'PH', 'PH_Cumulative', 'EX', 'EX_Cumulative'
      , 'WID', 'WID_Cumulative', 'SMD', 'SMD_Cumulative', 'Remark', 'MGM', 'TFWS', 'TSP_MCumulative'
      , 'TSP_FCumulative', 'TSP_M', 'TSP_F', 'GEN_M', 'GEN_F'];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.seatMetrix, { header: headers });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ITISeatMetrixFormate');

    // Export the Excel file
    XLSX.writeFile(wb, 'BTERSeatMetrixFormate.xlsx');
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
    }
  }

  ImportExcelFile(file: File): void {
    

    this.SeatsDistributionsService.ImportExcelFile(file)
      .then((data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == EnumStatus.Success) {

          this.seatMetrix = data['Data']
          console.log(this.seatMetrix,"execldata")
        }
        if (this.State == EnumStatus.Error) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == EnumStatus.Warning) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
  }

  async Back() {
    
    if (this.searchRequest.TradeLevelId == "8") {
      this.router.navigate(['/ITICollegeTrade8th/8'])
    }
    else if (this.searchRequest.TradeLevelId == "10") {
      this.router.navigate(['/ITICollegeTrade10th/10'])
    }
  }


  async getSeatsDistributionsList() {
    console.log(this.searchRequest);
    try {
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SeatsDistributionsList = data['Data'];
          console.log(this.SeatsDistributionsList, "SeatsDistributionsList")
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
    this.searchRequest = new ITISeatsDistributionsDataModels();
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
      this.searchRequest.TradeSchemeId = this.TradeSchemeId.join(',');
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
    var TotalSAH_M = 0;
    var TotalSAH_F = 0;
    var TotalDEV_M = 0;
    var TotalDEV_F = 0;
    var TotalMIN_M = 0;
    var TotalMIN_F = 0;
    var TotalGEN_M = 0;
    var TotalGEN_F = 0;
    var TotalPH = 0;
    var TotalEX = 0;
    var TotalWID = 0;

    var TotalIMC_SC = 0;
    var TotalIMC_ST = 0;
    var TotalIMC_OBC = 0;
    var TotalIMC_GEN = 0;


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
      TotalSAH_M = TotalSAH_M + parseInt(this.seatMetrix[i].SAHARIYA_M);
      TotalSAH_F = TotalSAH_F + parseInt(this.seatMetrix[i].SAHARIYA_F);
      TotalDEV_M = TotalDEV_M + parseInt(this.seatMetrix[i].DEV_M);
      TotalDEV_F = TotalDEV_F + parseInt(this.seatMetrix[i].DEV_F);
      TotalMIN_M = TotalMIN_M + parseInt(this.seatMetrix[i].MIN_M);
      TotalMIN_F = TotalMIN_F + parseInt(this.seatMetrix[i].MIN_F);
      TotalGEN_M = TotalGEN_M + parseInt(this.seatMetrix[i].GEN_M);
      TotalGEN_F = TotalGEN_F + parseInt(this.seatMetrix[i].GEN_F);
      TotalPH = TotalPH + parseInt(this.seatMetrix[i].PH);
      TotalEX = TotalEX + parseInt(this.seatMetrix[i].EX);
      TotalWID = TotalWID + parseInt(this.seatMetrix[i].WID);

      TotalIMC_SC = TotalIMC_SC + parseInt(this.seatMetrix[i].IMC_SC);
      TotalIMC_ST = TotalIMC_ST + parseInt(this.seatMetrix[i].IMC_ST);
      TotalIMC_OBC = TotalIMC_OBC + parseInt(this.seatMetrix[i].IMC_OBC);
      TotalIMC_GEN = TotalIMC_GEN + parseInt(this.seatMetrix[i].IMC_GEN);

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
    this.seatMetrixHeader.SAHARIYA_M = TotalSAH_M.toString();
    this.seatMetrixHeader.SAHARIYA_F = TotalSAH_F.toString();
    this.seatMetrixHeader.DEV_M = TotalDEV_M.toString();
    this.seatMetrixHeader.DEV_F = TotalDEV_F.toString();
    this.seatMetrixHeader.MIN_M = TotalMIN_M.toString();
    this.seatMetrixHeader.MIN_F = TotalMIN_F.toString();
    this.seatMetrixHeader.GEN_M = TotalGEN_M.toString();
    this.seatMetrixHeader.GEN_F = TotalGEN_F.toString();
    this.seatMetrixHeader.PH = TotalPH.toString();
    this.seatMetrixHeader.EX = TotalEX.toString();
    this.seatMetrixHeader.WID = TotalWID.toString();

    this.seatMetrixHeader.IMC_SC = TotalIMC_SC.toString();
    this.seatMetrixHeader.IMC_ST = TotalIMC_ST.toString();
    this.seatMetrixHeader.IMC_OBC = TotalIMC_OBC.toString();
    this.seatMetrixHeader.IMC_GEN = TotalIMC_GEN.toString();


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

  async Calculate_C1(index: number, item: ITISeatMetrixModel) {


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

    if (1 == 1)/*SAHARIYA*/ {
      var perSAHARIYA_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.SAHARIYA_H) / 100).toFixed(2);
      var perSAHARIYA_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.SAHARIYA_H) / 100).toFixed(2);

      item.SAHARIYA_MCumulative = Math.round(parseFloat(perSAHARIYA_M)).toString();
      item.SAHARIYA_FCumulative = Math.round(parseFloat(perSAHARIYA_F)).toString();

      if (index == 0) {
        item.SAHARIYA_M = Math.round(parseFloat(perSAHARIYA_M)).toString();
        item.SAHARIYA_F = Math.round(parseFloat(perSAHARIYA_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perSAHARIYA_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].SAHARIYA_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.SAHARIYA_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perSAHARIYA_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].SAHARIYA_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.SAHARIYA_F = (cal1F - cal2F).toString();
      }
    }

    if (1 == 1)/*DEVNARAYAN*/ {
      var perDEV_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.DEV_H) / 100).toFixed(2);
      var perDEV_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.DEV_H) / 100).toFixed(2);

      item.DEV_MCumulative = Math.round(parseFloat(perDEV_M)).toString();
      item.DEV_FCumulative = Math.round(parseFloat(perDEV_F)).toString();

      if (index == 0) {
        item.DEV_M = Math.round(parseFloat(perDEV_M)).toString();
        item.DEV_F = Math.round(parseFloat(perDEV_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perDEV_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].DEV_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.DEV_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perDEV_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].DEV_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.DEV_F = (cal1F - cal2F).toString();
      }
    }

    if (1 == 1)/*MINORITY*/ {
      var perMIN_M = (parseFloat(item.TotalSeatMCumulative) * parseFloat(this.seatMetrixHeader.MIN_H) / 100).toFixed(2);
      var perMIN_F = (parseFloat(item.TotalSeatFCumulative) * parseFloat(this.seatMetrixHeader.MIN_H) / 100).toFixed(2);

      item.MIN_MCumulative = Math.round(parseFloat(perMIN_M)).toString();
      item.MIN_FCumulative = Math.round(parseFloat(perMIN_F)).toString();

      if (index == 0) {
        item.MIN_M = Math.round(parseFloat(perMIN_M)).toString();
        item.MIN_F = Math.round(parseFloat(perMIN_F)).toString();

      } else {
        var cal1 = Math.round(parseFloat(perMIN_M));
        var cal2 = parseInt(this.seatMetrix[index - 1].MIN_MCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.MIN_M = (cal1 - cal2).toString();

        var cal1F = Math.round(parseFloat(perMIN_F));
        var cal2F = parseInt(this.seatMetrix[index - 1].MIN_FCumulative);//  parseInt($("#DivCumulative_" + (index - 2) + "_" + indexTr).find("input").val());
        item.MIN_F = (cal1F - cal2F).toString();
      }
    }

    item.GEN_M = (parseInt(item.TotalM) - (parseInt(item.SC_M) + parseInt(item.ST_M) + parseInt(item.OBC_M) + parseInt(item.MBC_M) + parseInt(item.EWS_M) + parseInt(item.TSP_M) + parseInt(item.SAHARIYA_M) + parseInt(item.DEV_M) + parseInt(item.MIN_M))).toString();
    item.GEN_F = (parseInt(item.TotalF) - (parseInt(item.SC_F) + parseInt(item.ST_F) + parseInt(item.OBC_F) + parseInt(item.MBC_F) + parseInt(item.EWS_F) + parseInt(item.TSP_F) + parseInt(item.SAHARIYA_F) + parseInt(item.DEV_F) + parseInt(item.MIN_F))).toString()


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


    if (item.Remark == "Devnarayan") {
      item.DEV_M = item.TotalM;
      item.DEV_F = item.TotalF;

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

      item.MIN_M = "0";
      item.MIN_F = "0";

      item.SAHARIYA_M = "0";
      item.SAHARIYA_F = "0";

      item.GEN_M = "0";
      item.GEN_F = "0";
    }

    if (item.Remark == "Saharia") {

      item.SAHARIYA_M = item.TotalM;
      item.SAHARIYA_F = item.TotalF;

      item.DEV_M = "0";
      item.DEV_F = "0";

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

      item.MIN_M = "0";
      item.MIN_F = "0";

      item.GEN_M = "0";
      item.GEN_F = "0";
    }

    if (item.Remark == "TSP") {


      item.TSP_M = item.TotalM;
      item.TSP_F = item.TotalF;

      item.SAHARIYA_M = "0";
      item.SAHARIYA_F = "0";

      item.DEV_M = "0";
      item.DEV_F = "0";

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


      item.MIN_M = "0";
      item.MIN_F = "0";

      item.GEN_M = "0";
      item.GEN_F = "0";
    }

    if (item.Remark == "Minority") {

      item.MIN_M = item.TotalM;
      item.MIN_F = item.TotalF;

      item.TSP_M = "0";
      item.TSP_F = "0";

      item.SAHARIYA_M = "0";
      item.SAHARIYA_F = "0";

      item.DEV_M = "0";
      item.DEV_F = "0";

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

      item.MIN_M = "0";
      item.MIN_F = "0";

      item.TSP_M = "0";
      item.TSP_F = item.TotalSeats;


      item.TotalF = item.TotalSeats;
      item.TotalM = "0";

      item.SAHARIYA_M = "0";
      item.SAHARIYA_F = "0";

      item.DEV_M = "0";
      item.DEV_F = "0";

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


      item.MIN_F = (parseInt(item.MIN_F) + parseInt(item.MIN_M)).toString();
      item.MIN_M = "0";


      item.TSP_F = (parseInt(item.TSP_F) + parseInt(item.TSP_M)).toString();
      item.TSP_M = "0";


      item.SAHARIYA_F = (parseInt(item.SAHARIYA_F) + parseInt(item.SAHARIYA_M)).toString();
      item.SAHARIYA_M = "0";


      item.DEV_F = (parseInt(item.DEV_F) + parseInt(item.DEV_M)).toString();
      item.DEV_M = "0";



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

      this.seatMetrix.forEach((x) => { x.FinancialYearID = this.sSOLoginDataModel.FinancialYearID, x.UserId = this.sSOLoginDataModel.UserID })

      console.log(this.seatMetrix, "GeatDistribution")
      await this.SeatsDistributionsService.SaveSeatsDistributions(this.seatMetrix)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.seatMetrix = [];
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
