import { Component, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { BterMeritSearchModel } from '../../../Models/BterMeritDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { BterMeritService } from '../../../Services/BterMerit/bter-merit.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { BterSeatIntakeService } from '../../../Services/BTER/ItiSeatIntake/iti-seat-intake.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { AllotmentConfigurationModel } from '../../../Models/AllotmentConfigurationDataModel';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { UnPublishModel } from '../../../Models/DateConfigurationDataModels';
import { UploadFileModel } from '../../../Models/UploadFileModel';

@Component({
  selector: 'app-bter-merit',
  templateUrl: './bter-merit.component.html',
  styleUrl: './bter-merit.component.css',
  standalone: false
})

export class BterMeritComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  @ViewChild('otpModal1') childComponent1!: OTPModalComponent;
  @ViewChild('otpModal2') childComponent2!: OTPModalComponent;
  isSearchClicked: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new BterMeritSearchModel()
  public GenderList: any = [];
  public CategoryAlist: any = [];
  public MaritMasterList: any = [];
  public MeritData: any = [];
  public Table_SearchText: string = '';
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public MeritDataExcel: any = [];
  public CourseTypeList: any = [];
  public IsNull: boolean = false;
  MeritGenerateKey: string = "";
  MeritPublishKey: string = "";

  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];

  public otpFor: number = 0;

  public selectedFile: File | null = null;  // Store the selected file
  public importFile: any;
  public DataExcel: any = [];
  public DataExcel1: any = [];
  public DataExcel2: any = [];
  public DataExcel3: any = [];
  public DataExcel4: any = [];

  closeResult: string | undefined;

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  public UnPublishRemark: string = '';
  public UnPubishAttachment: string = '';

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  public isSubmitted: boolean = false;

  public DateConfigSetting: any = [];
  /* public MeritMaster = [
     { Id: 1, Name: "First Allotment Provisional Merit ", GenerateKey: "GENERATE FIRST PROVISIONAL MERIT", PublishKey: "PUBLISH FIRST PROVISIONAL MERIT" },
     { Id: 2, Name: "First Allotment Final Merit", GenerateKey: "GENERATE FIRST FINAL MERIT", PublishKey: "PUBLISH FIRST FINAL MERIT" }, 
     { Id: 4, Name: "Second Allotment Final Merit", GenerateKey: "GENERATE SECOND FINAL MERIT", PublishKey: "PUBLISH SECOND FINAL MERIT" }
   ]*/

  public MeritMaster = [
    { Id: 1, Name: "GENERATE PROVISIONAL MERIT ", GenerateKey: "GENERATE PROVISIONAL MERIT", PublishKey: "PUBLISH PROVISIONAL MERIT" },
    { Id: 2, Name: "GENERATE FINAL MERIT", GenerateKey: "GENERATE FINAL MERIT", PublishKey: "PUBLISH FINAL MERIT" },
    { Id: 3, Name: "UPWARD MERIT", GenerateKey: "UPWARD MERIT", PublishKey: "PUBLISH UPWARD MERIT" },
    { Id: 4, Name: "SECOND MERIT", GenerateKey: "SECOND MERIT", PublishKey: "PUBLISH SECOND MERIT" }
  ]

  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private route: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private bterMeritService: BterMeritService,
    private BTERCollegeTradeService: BterSeatIntakeService,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService
  ) { }

  async ngOnInit() {
    this.searchRequest.CourseType = parseInt(this.route.snapshot.paramMap.get('id'));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetMasterData();
    this.searchRequest.DepartmentId = EnumDepartment.BTER;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.EndTermId = this.sSOLoginDataModel.EndTermID;
  }

  AllotmentChange() {


    var th = this;
    this.MeritGenerateKey = this.MeritMaster.filter(function (x) { return x.Id == th.searchRequest.MeritMasterId })[0].GenerateKey;
    this.MeritPublishKey = this.MeritMaster.filter(function (x) { return x.Id == th.searchRequest.MeritMasterId })[0].PublishKey;

  }

   

  openOTPUploadExcel() {

    this.otpFor = 1;

    this.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.CloseModal();
    this.childComponent.MobileNo = this.MobileNo
    this.childComponent.OpenOTPPopup();
    var th = this;
    this.childComponent.onVerified.subscribe(() => {     
      th.UploadMeritdata();
      th.OpenUploadMeritModel(this.uploadModel);
      th.CloseModal();     
      //console.log("otp verified on the page")
    })
  }

  openOTPPublish() {
    this.otpFor = 2;
    this.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent1.MobileNo = this.MobileNo
    this.childComponent1.OpenOTPPopup();
    var th = this;
    this.childComponent1.onVerified.subscribe(() => {     
        th.publishMerit();     
    })
  }

  openOTPUnPublish() {


    if (this.UnPublishRemark == "" || this.UnPublishRemark.replaceAll(" ", "") == "" || this.UnPublishRemark.replace(/[^a-zA-Z0-9 ]/g, "")=="") {
      this.toastr.error("Please enter reason for unpublish Merit.");
      return
    }


    this.otpFor = 2;
    this.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent2.MobileNo = this.MobileNo
    this.CloseModal();
    this.childComponent2.OpenOTPPopup();
    var th = this;
    this.childComponent2.onVerified.subscribe(() => {
      th.unPublishMerit();
    })
  }


  openUnPublish(content: any) {

    if (this.searchRequest.MeritMasterId === 0 || this.searchRequest.CourseType === 0) {
      this.toastr.error("Please select Merit.");
      return
    }
    this.UnPublishRemark = "";
    this.UnPubishAttachment = "";   
    this.uploadModel = content;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      var GenerateKey = this.MeritMaster.map(x => x.GenerateKey).join(',');
      var PublishKey = this.MeritMaster.map(x => x.PublishKey).join(',');

      var data = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeId: this.searchRequest.CourseType,
        AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
        Key: GenerateKey + "," + PublishKey,
        EndTermId: this.sSOLoginDataModel.EndTermID,
        SSOID: this.sSOLoginDataModel.SSOID
      }

      await this.commonMasterService.GetDateConfigSetting(data)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DateConfigSetting = data['Data'];

          console.log(this.DateConfigSetting[0]['GENERATE MERIT']);

        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterDDLByType('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterData("ITIMerit").
        then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MaritMasterList = data.Data;
        })

      await this.commonMasterService.GetStreamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseTypeList = data['Data'];
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

  async onSearch(i: any) {
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

    if (this.searchRequest.MeritMasterId === 0 || this.searchRequest.CourseType === 0) {
      this.toastr.error("Please select Merit Master and Class.");
      return
    }
    try {
      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize

      this.loaderService.requestStarted();
      await this.bterMeritService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MeritData = data.Data;
          this.totalRecord = this.MeritData[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
          if (this.MeritData[0].IsPublished != true) {
            this.isSearchClicked = true;
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

  async ResetSearch() {
    this.searchRequest = new BterMeritSearchModel();
    this.searchRequest.DepartmentId = EnumDepartment.BTER;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.onSearch(1);
  }

  async generateMerit() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = 'GENERATE';
      await this.bterMeritService.GenerateMerit(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {

            if (data.Data[0].Status == 1) {
              this.onSearch(1);
              this.toastr.success(data.Data[0].MSG);
            } else {
              this.toastr.error(data.Data[0].MSG);
            }

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

  async publishMerit() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.Action = 'PUBLISH';
      await this.bterMeritService.PublishMerit(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
            } else {
              this.toastr.error(data.Data[0].MSG);
            }
            this.onSearch(1);
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

  async unPublishMerit() {
    try {
      this.loaderService.requestStarted();
      

      const request = new UnPublishModel();

      request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID_Session;
      request.Action = "MERIT";
      request.AllotmentMasterId = this.searchRequest.MeritMasterId;
      request.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;
      request.UnPubishAttachment = this.UnPubishAttachment;
      request.UnPubishBy = this.sSOLoginDataModel.UserID;
      request.UnPublishIPAddress = "";
      request.UnPublishReason = this.UnPublishRemark


      await this.commonMasterService.UnPublishData(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.onSearch(1);
              this.UnPublishRemark = "";
              this.UnPubishAttachment = "";
            } else {
              this.toastr.error(data.Data[0].MSG);
            }
           
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

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.onSearch(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.MeritData[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.onSearch(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.onSearch(3)
    }
  }


  async exportExcelData() {
   
    try {
      console.log("searchRequest", this.searchRequest);
      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.bterMeritService.DowanloadMeritDataExcel(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.MeritDataExcel = data.Data;

            const unwantedColumns = [
              'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
              'Id', 'Status', 'RemarkForStatus', 'FeePdf', 'RTS', 'TotalRecords', 'MeritMasterId', 'AcademicYearID',
              'DepartmentId', 'PublishBy', 'PublishIP', 'Class', 'IsPublished', 'IsRajDOMICILE','Heading','CourseType','MeritNo'
            ];
            const filteredData = this.MeritDataExcel.map((item: { [x: string]: any; }) => {
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
            XLSX.writeFile(wb, 'BterMeritList.xlsx');

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



  async DownloadPDF() {

    try {

      console.log("searchRequest", this.searchRequest);
      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.bterMeritService.DowanloadMeritDataPDF(this.searchRequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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
            link.download = 'Merit' + this.sSOLoginDataModel.Eng_NonEngName + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async SampleexportExcelData() {

    try {
      var searchRequest2 = {
        MeritMasterId: 0,
        SearchText: 0,
        Category: 0,
        Gender: 0,
        CourseType: 0,
        AcademicYearID: 0,
        EndTermId: 0,
        DepartmentId: 1,
        PageNumber: 1,
        PageSize: 100,
        CreatedBy: 1,
        Action: "ImportFormate"
      }
      this.loaderService.requestStarted();
      await this.bterMeritService.GetMeritUploadExeclFormate(searchRequest2)
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
            XLSX.writeFile(wb, 'MeritFormat.xlsx');

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

  async formatExcelData() {

    try {
      var searchRequest2 = {
        MeritMasterId: 0,
        SearchText: 0,
        Category: 0,
        Gender: 0,
        CourseType: 0,
        AcademicYearID: 0,
        EndTermId: 0,
        DepartmentId: 1,
        PageNumber: 1,
        PageSize: 100,
        CreatedBy: 1,
        Action: "ImportFormate"
      }
      this.loaderService.requestStarted();
      await this.bterMeritService.GetMeritUploadExeclFormate(searchRequest2)
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

  async UploadMeritdata() {
    try {
      debugger;
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      //this.DataExcel.forEach((x: any) => {
      //  // x.StreamTypeId = this.searchRequest.StreamTypeId,
      //    x.FinancialYearID = this.SSOLoginDataModel.FinancialYearID,
      //    x.EndTermID = this.SSOLoginDataModel.EndTermID,
      //    x.CreatedBy = this.sSOLoginDataModel.UserID,
      //    x.IPAddress = ""

      //})

      var data = {
        CourseType: this.sSOLoginDataModel.Eng_NonEng,
        AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
        AllotmentMasterId: this.searchRequest.MeritMasterId,
        CreatedBy: this.sSOLoginDataModel.UserID,
        IPAddress: "",
        MeritData: this.DataExcel
      }

      console.log(this.DataExcel, "GeatDistribution")
      await this.bterMeritService.UploadMeritdata(data)
        .then(async (data: any) => {
          debugger;
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            //this.toastr.success(this.Message);          
            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
              this.CloseModal();
              this.onSearch(1);
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

  ResetData() {
    this.DataExcel = [];
    this.selectedFile = null;
    this.importFile = null;
  }
  CloseModal() {
    this.modalService.dismissAll();
  }
  public uploadModel: any;
  async OpenUploadMeritModel(content: any) {

    if (this.searchRequest.MeritMasterId === 0 || this.searchRequest.CourseType === 0) {
      this.toastr.error("Please select Merit Master.");
      return
    }


    this.ResetData();
    this.uploadModel = content;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
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



  async openModalGenerateOTP(content: any) {
    debugger
    this.CloseModal();
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.sSOLoginDataModel.Mobileno;
    //this.request = item;
    this.SendOTP();
  }


  async SendOTP(isResend?: boolean) {



    try {
      this.GeneratedOTP = "";
      //if (this.sSOLoginDataModel.RoleID == EnumRole.Admin) {
      //  this.sSOLoginDataModel.Mobileno = "7568622727";

      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
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
    // }
    catch (Ex) {
      console.log(Ex);
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  //



  //async VerifyOTP() {
  //  if (this.OTP.length > 0) {
  //    if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
  //      try {
  //        this.UploadMeritdata();
  //        this.OpenUploadMeritModel(this.uploadModel);           
  //        this.CloseModal();
  //      }
  //      catch (ex) {
  //        console.log(ex);
  //      }
  //    }
  //    else {
  //      this.toastr.warning('Invalid OTP Please Try Again');
  //    }
  //  }
  //  else {
  //    this.toastr.warning('Please Enter OTP');
  //  }
  //}


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


  public file!: File;
  async onFileChangeUnPublish(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('error this file ?')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();
        const uploadModel = new UploadFileModel();

        uploadModel.FolderName = "UnPublish";

        await this.commonMasterService.UploadSignatureDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {

              this.UnPubishAttachment = uploadModel.FolderName + "/" + data['Data'][0]["Dis_FileName"];
              this.UnPubishAttachment = uploadModel.FolderName + "/" + data['Data'][0]["FileName"];


              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }



}

