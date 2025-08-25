import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ITICollegeTradeSearchModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SeatSearchModel } from '../../../../Models/SeatMatrixDataModel';
import { SeatMatrixService } from '../../../../Services/ITISeatMatrix/seat-matrix.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-list-seat-metrix',
  templateUrl: './list-seat-metrix.component.html',
  styleUrl: './list-seat-metrix.component.css',
  standalone: false
})
export class ListSeatMetrixComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  public searchRequest = new ITICollegeTradeSearchModel();
  public imcRequest = new SeatSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public ITITspAreasId: number | null = null;
  //sSOLoginDataModel = new SSOLoginDataModel();
  public ActiveStatusModel: number = 1;
  public IDS: number = 0;

  public SSOLoginDataModel = new SSOLoginDataModel();
  public SeatIntakeSearchFormGroup!: FormGroup;
  public IsNull: boolean = false;
  public ListITICollegeTrade: any = [];
  public ListViewSeatDetails: any = [];
  public ListITIManagementType: any = [];
  public ListITITradeScheme: any = [];
  public ListITICollegeByManagement: any = [];
  public ListITITrade: any = [];
  public AllotmentTypeList: any = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public CollegeNamePop: string = '';
  public TradeNamePop: string = '';
  public TradeSchemeNamePop: string = '';

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  showResendButton: boolean = false;
  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  private interval: any;


  public DataExcel: any = [];

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  MeritGenerateKey: string = "";
  MeritPublishKey: string = "";

  //public importFile: any;

  public DateConfigSetting: any = [];
  public selectedFile: File | null = null;  // Store the selected file
  public importFile: any;


  public DataExcel1: any = [];
  public DataExcel2: any = [];
  public DataExcel3: any = [];
  public DataExcel4: any = [];

  //selectedTradeLevel
  selectedTradeLevel: string | null = null;
  isPublishing: boolean = false;
  showTradeLevelError: boolean = false;



  constructor(
    private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private ITICollegeTradeService: ItiSeatIntakeService,
    private Swal2: SweetAlert2,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private seatMatrixService: SeatMatrixService,
  ) { }



  async ngOnInit() {


    if (this.route.snapshot.paramMap.get('id') == null || this.route.snapshot.paramMap.get('id') == '' || this.route.snapshot.paramMap.get('id') == undefined) {
      this.searchRequest.TradeLevelId = "0";
    } else {
      this.searchRequest.TradeLevelId = String(this.route.snapshot.paramMap.get('id')?.toString());
    }


    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
    console.log(this.SSOLoginDataModel, "SSOLoginDataModel")
    await this.GetAllotmentMaster();
    await this.GetdateConfigSetting();
    await this.GetTradeAndColleges(1)
    await this.MasterFilterList();
    this.getITICollege();
    this.getITITrade();
    this.AllotmentChange();
    this.imcRequest.AllotmentId = 0;

    this.searchRequest.AllotmentMasterId = 0

  }
  async GetdateConfigSetting() {
    this.loaderService.requestStarted();
    var data = {
      DepartmentID: this.SSOLoginDataModel.DepartmentID,
      CourseTypeId: 1,
      AcademicYearID: this.SSOLoginDataModel.FinancialYearID,
      EndTermId: this.SSOLoginDataModel.EndTermID,
      Key: 'PUBLISH IMC ALLOTMENT SEAT MATRIX,PUBLISH FIRST ALLOTMENT SEAT MATRIX,CREATE SEAT MATRIX,CALCULATE SECOND ALLOTMENT SEAT MATRIX,PUBLISH SECOND ALLOTMENT SEAT MATRIX,CALCULATE INTERNAL SLIDING SEAT MATRIX,PUBLISH INTERNAL SLIDING SEAT MATRIX'
    }

    await this.commonFunctionService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];

        console.log(this.DateConfigSetting[0]['GENERATE MERIT']);

      }, (error: any) => console.error(error)
      );
  }
  AllotmentChange() {


    if (this.searchRequest.AllotmentMasterId == 1) {
      this.MeritGenerateKey = "CREATE SEAT MATRIX";
      this.MeritPublishKey = "PUBLISH IMC ALLOTMENT SEAT MATRIX";
    } else if (this.searchRequest.AllotmentMasterId == 2) {
      this.MeritGenerateKey = "CREATE SEAT MATRIX1";
      this.MeritPublishKey = "PUBLISH FIRST ALLOTMENT SEAT MATRIX";
    } else if (this.searchRequest.AllotmentMasterId == 4) {
      this.MeritGenerateKey = "CALCULATE SECOND ALLOTMENT SEAT MATRIX";
      this.MeritPublishKey = "PUBLISH SECOND ALLOTMENT SEAT MATRIX";
    } else if (this.searchRequest.AllotmentMasterId == 4) {
      this.MeritGenerateKey = "CALCULATE INTERNAL SLIDING SEAT MATRIX";
      this.MeritPublishKey = "PUBLISH INTERNAL SLIDING SEAT MATRIX";
    }
    this.ListITICollegeTrade = [];
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

  ////validateAndGenerateMatrix
  //validateAndGenerateMatrix(type: 'internal' | 'second') {
  //  if (!this.searchRequest.TradeLevelId || this.searchRequest.TradeLevelId == '0') {
  //    alert('Please select the trade level first.');
  //    return;
  //  }

  //  if (type === 'internal') {
  //    this.SeatMatixInternalSliding();
  //  } else if (type === 'second') {
  //    this.SeatMatixSecondAllotment();
  //  }
  //}

  //validateAndPublishMatrix(allotmentId: number) {
  //  if (!this.searchRequest.TradeLevelId || this.searchRequest.TradeLevelId == '0') {
  //    alert('Please select the trade level first.');
  //    return;
  //  }

  //  this.PublishSeatMatrix(allotmentId);
  //}




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

  async GetAllotmentMaster() {

    try {

      this.loaderService.requestStarted();
      const req = {
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        FinancialYearID: this.SSOLoginDataModel.FinancialYearID
      }
      await this.commonFunctionService.GetAllotmentMaster(req)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AllotmentTypeList = data['Data'];       
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

    if (this.searchRequest.AllotmentMasterId == 0) {
      this.toastr.error("Select Allotment Type")
      return;
    }

    this.showTradeLevelError = false;

    //if (!this.searchRequest.TradeLevelId || this.searchRequest.TradeLevelId === '0') {
    //  this.showTradeLevelError = true;
    //  return;
    //}


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

  async exportPDFData() {

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
      await this.ITICollegeTradeService.DownloadSeatMatrix(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'SeatMetrix.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
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
    this.searchRequest.AllotmentMasterId = 0
    this.searchRequest.TradeLevelId = "0";
    this.searchRequest.PageSize = 10;
    this.searchRequest.CollegeCode = '';
    this.searchRequest.TradeCode = '';
    this.searchRequest.ManagementTypeId = 0;
    this.searchRequest.CollegeID = 0;
    this.searchRequest.TradeID = 0;
    this.searchRequest.TradeSchemeId = 0;
    this.ListITICollegeTrade = [];
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
      this.searchRequest.FinancialYearID = this.SSOLoginDataModel.FinancialYearID
      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = this.totalRecord
      // this.searchRequest.StreamTypeId=

      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.GetSampleTradeAndColleges(this.searchRequest)
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
      this.searchRequest.FinancialYearID = this.SSOLoginDataModel.FinancialYearID
      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = 1
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.GetSampleTradeAndColleges(this.searchRequest)
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

    await this.ITICollegeTradeService.SampleImportExcelFile(file)
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
  async BTERSaveSeatsMatrixlist() {

    try {

      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.DataExcel.forEach((x: any) => {
        x.FinancialYearID = this.SSOLoginDataModel.FinancialYearID, x.UserId = this.SSOLoginDataModel.UserID,
          x.EndTermID = this.SSOLoginDataModel.EndTermID,
          x.UserId = this.SSOLoginDataModel.UserID
      })

      console.log(this.DataExcel, "GeatDistribution")
      await this.ITICollegeTradeService.ITISaveSeatsMatrixlist(this.DataExcel)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {

            //this.toastr.success(this.Message)
            this.CloseModal();
            this.GetTradeAndColleges(1)
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


  async VerifyOTP() {

    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
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
                  x.TradeLevelId = this.searchRequest.TradeLevelId,
                    x.FinancialYearID = this.SSOLoginDataModel.FinancialYearID, x.UserId = this.SSOLoginDataModel.UserID
                })

                var requestData = new ITICollegeTradeSearchModel();

                requestData.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
                requestData.AllotmentMasterId = this.IDS;
                requestData.TradeLevelId = this.searchRequest.TradeLevelId;
                requestData.DepartmentID = this.SSOLoginDataModel.DepartmentID;
                requestData.CreateBy = this.SSOLoginDataModel.UserID;
                requestData.EndTermId = this.SSOLoginDataModel.EndTermID;
                requestData.IPAddress = "";

                await this.ITICollegeTradeService.PublishSeatMatrix(requestData)
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
                this.CloseModal()
              }

              catch (ex) {
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
      else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }

  async SendOTP(isResend?: boolean) {
    try {

      this.GeneratedOTP = "";
      if (this.SSOLoginDataModel.RoleID == EnumRole.Admin) {
        this.SSOLoginDataModel.Mobileno = "7568622727";

        await this.sMSMailService.SendMessage(this.SSOLoginDataModel.Mobileno, "OTP")
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.startTimer();
              this.GeneratedOTP = data['Data'];
              if (isResend) {
                this.toastr.success('OTP resent successfully');
              }
            }
            else {
              this.toastr.warning('Something went wrong');
            }
          }, error => console.error(error));
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;


    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true; // Show the button when time is up
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  @ViewChild('content') content: ElementRef | any;

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  async openModalGenerateOTP(content: any, Id: any) {

    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.MobileNo;
    this.IDS = Id
    this.SendOTP();
  }

  //private getDismissReason(reason: any): string {
  //  if (reason === ModalDismissReasons.ESC) {
  //    return 'by pressing ESC';
  //  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //    return 'by clicking on a backdrop';
  //  } else {
  //    return `with: ${reason}`;
  //  }
  //}
  //CloseModal() {

  //  this.modalService.dismissAll();
  //}



  // save PublishSeatMatrix
  //async PublishSeatMatrix(Id: any) {
  //  if (!this.searchRequest.TradeLevelId || this.searchRequest.TradeLevelId === '0') {
  //    this.showTradeLevelError = true;
  //    return;
  //  }
  //  this.showTradeLevelError = false;
  //  this.isPublishing = true;

  //  this.Swal2.Confirmation("Are you sure you want to Publish Seat Matrix? <br> " +
  //    "<b> #Note: Once You Publish The Seat Matrix, No Changes Would Be Possible After. <br> </b>" +
  //    "<b> #टिप्पणी : एक बार जब आप सीट मैट्रिक्स प्रकाशित कर देंगे, तो उसके बाद कोई बदलाव संभव नहीं होगा। </b>",
  //    async (result: any) => {
  //      //confirmed
  //      if (result.isConfirmed) {
  //        try {

  //          this.isSubmitted = true;
  //          this.loaderService.requestStarted();
  //          this.DataExcel1.forEach((x: any) => {
  //            x.TradeLevelId = this.searchRequest.TradeLevelId,
  //              x.FinancialYearID = this.SSOLoginDataModel.FinancialYearID, x.UserId = this.SSOLoginDataModel.UserID
  //          })

  //          var requestData = new ITICollegeTradeSearchModel();

  //          requestData.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
  //          requestData.AllotmentMasterId = Id;
  //          requestData.TradeLevelId = this.searchRequest.TradeLevelId;
  //          requestData.DepartmentID = this.SSOLoginDataModel.DepartmentID;
  //          requestData.CreateBy = this.SSOLoginDataModel.UserID;
  //          requestData.EndTermId = this.SSOLoginDataModel.EndTermID;
  //          requestData.IPAddress = "";





  //          await this.ITICollegeTradeService.PublishSeatMatrix(requestData)
  //            .then(async (data: any) => {

  //              this.State = data['State'];
  //              this.Message = data['Message'];
  //              this.ErrorMessage = data['ErrorMessage'];

  //              if (this.State == EnumStatus.Success) {

  //                if (data.Data[0].Status == 1) {
  //                  this.toastr.success(data.Data[0].MSG);
  //                  this.isPublishing = false;
  //                } else {
  //                  this.toastr.error(data.Data[0].MSG);
  //                }
  //              }
  //              else if (this.State == EnumStatus.Warning) {
  //                this.toastr.warning(this.Message)
  //              }
  //              else {
  //                this.toastr.error(this.ErrorMessage)
  //              }
  //            })
  //        }

  //        catch (ex) {
  //          console.log(ex);
  //        } finally {
  //          setTimeout(() => {
  //            this.loaderService.requestEnded();
  //            this.isSubmitted = false;
  //            this.isPublishing = false;
  //          }, 200);
  //        }



  //      }
  //    });

  //}

  async PublishSeatMatrix(Id: any) {
    //if (!this.searchRequest.TradeLevelId || this.searchRequest.TradeLevelId === '0') {
    //  this.showTradeLevelError = true;
    //  return;
    //}

    this.showTradeLevelError = false;



    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();

      this.DataExcel1.forEach((x: any) => {
        x.TradeLevelId = this.searchRequest.TradeLevelId;
        x.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
        x.UserId = this.SSOLoginDataModel.UserID;
      });

      const requestData = new ITICollegeTradeSearchModel();
      requestData.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      requestData.AllotmentMasterId = Id;
      requestData.TradeLevelId = this.searchRequest.TradeLevelId;
      requestData.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      requestData.CreateBy = this.SSOLoginDataModel.UserID;
      requestData.EndTermId = this.SSOLoginDataModel.EndTermID;
      requestData.IPAddress = "";

      await this.ITICollegeTradeService.PublishSeatMatrix(requestData).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == EnumStatus.Success) {
          if (data.Data[0].Status == 1) {
            this.toastr.success(data.Data[0].MSG);

            // ✅ Hide the button after success by setting IsPublish = 1
            if (this.ListITICollegeTrade.length > 0) {
              this.ListITICollegeTrade[0].IsPublish = 1;
            }
            this.GetAllotmentMaster();
            this.GetTradeAndColleges(1);
          } else {
            this.toastr.error(data.Data[0].MSG);
          }
        } else if (this.State == EnumStatus.Warning) {
          this.toastr.warning(this.Message);
        } else {
          this.toastr.error(this.ErrorMessage);
        }
      });

    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
        this.isPublishing = false;
      }, 200);
    }


  }



  async SeatMatixSecondAllotment() {

    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.DataExcel1.forEach((x: any) => {
        x.TradeLevelId = this.searchRequest.TradeLevelId,
          x.FinancialYearID = this.SSOLoginDataModel.FinancialYearID, x.UserId = this.SSOLoginDataModel.UserID
      });

      var requestData = new ITICollegeTradeSearchModel();

      requestData.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      requestData.AllotmentMasterId = 1;
      requestData.TradeLevelId = this.searchRequest.TradeLevelId;
      requestData.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      requestData.CreateBy = this.SSOLoginDataModel.UserID;
      requestData.EndTermId = this.SSOLoginDataModel.EndTermID;
      requestData.IPAddress = "";

      await this.ITICollegeTradeService.SeatMatixSecondAllotment(requestData)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {

            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.searchRequest.AllotmentMasterId = 4
              await this.GetTradeAndColleges(1);
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
      if (!this.searchRequest.TradeLevelId || this.searchRequest.TradeLevelId === '0') {
        this.showTradeLevelError = true;
        return;
      }
      this.showTradeLevelError = false;
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.DataExcel1.forEach((x: any) => {
        x.TradeLevelId = this.searchRequest.TradeLevelId,
          x.FinancialYearID = this.SSOLoginDataModel.FinancialYearID, x.UserId = this.SSOLoginDataModel.UserID
      });

      var requestData = new ITICollegeTradeSearchModel();

      requestData.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      requestData.AllotmentMasterId = 1;
      requestData.TradeLevelId = this.searchRequest.TradeLevelId;
      requestData.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      requestData.CreateBy = this.SSOLoginDataModel.UserID;
      requestData.EndTermId = this.SSOLoginDataModel.EndTermID;
      requestData.IPAddress = "";

      await this.ITICollegeTradeService.SeatMatixInternalSliding(requestData)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {

            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.searchRequest.AllotmentMasterId = 6
              await this.GetTradeAndColleges(1);
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

  async OpenIMCSeatMatrixmarge(content: any) {
    this.imcRequest.AllotmentId = 0
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async saveData() {


    if (this.imcRequest.AllotmentId == 0) {
      this.toastr.error("Please select Allotment Type");
    } else if (this.imcRequest.IMC_SC == '' || this.imcRequest.IMC_ST == '' || this.imcRequest.IMC_OBC == '' || this.imcRequest.IMC_GEN == '') {
      this.toastr.error("Please select IMC Type");
    } else {
      this.imcRequest.UserId = this.SSOLoginDataModel.UserID;
      this.imcRequest.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      this.isSubmitted = true;
      //Show Loading
      this.loaderService.requestStarted();
      this.isLoading = true;

      try {
        await this.seatMatrixService.SaveData(this.imcRequest)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State = EnumStatus.Success) {

              if (data.Data[0].STATUS == 1) {
                this.toastr.success(data.Data[0].MSG);
                this.CloseModalPopup();
                this.GetTradeAndColleges(1)
              } else {
                this.toastr.error(data.Data[0].MSG);
              }

              //this.toastr.success(this.Message)

            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
      catch (ex) { console.log(ex) }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoading = false;
        }, 200);
      }
    }
  }

  openOTPLockAndSubmit(Id: number) {
    //if (!this.searchRequest.TradeLevelId || this.searchRequest.TradeLevelId === '0') {
    //  this.showTradeLevelError = true;
    //  return;
    //}

    this.Swal2.Confirmation(
      "Are you sure you want to Publish Seat Matrix? <br>" +
      "<b>#Note: Once You Final lock and submit The Seat Matrix, No Changes Would Be Possible After.<br></b>" +
      "<b>#टिप्पणी : एक बार जब आप सीट मैट्रिक्स अंतिम रूप से लॉक और सबमिट कर देंगे, तो उसके बाद कोई बदलाव संभव नहीं होगा।</b>",
      async (result: any) => {
        if (result.isConfirmed) {
          this.childComponent.MobileNo = this.SSOLoginDataModel.Mobileno;
          this.CloseModal();
          this.childComponent.OpenOTPPopup();
          var th = this;
          this.childComponent.onVerified.subscribe(() => {
            th.PublishSeatMatrix(Id);
          })
        } else {
          this.isPublishing = false;
        }
      });
  }
}
