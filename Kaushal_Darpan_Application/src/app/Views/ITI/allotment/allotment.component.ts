import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { RoomsMasterService } from '../../../Services/RoomsMaster/rooms-master.service';
import { AllotmentCounterDataModel, AllotmentdataModel, SearchModel, SeatMetrixdataModel, StudentSeatAllotmentdataModel } from '../../../Models/ITIAllotmentDataModel';
import { BTERAllotmentService } from '../../../Services/BTER/Allotment/allotment.service';
import { ItiCollegesSearchModel } from '../../../Models/CommonMasterDataModel';
import { Observable, interval, Subscription, map, of } from 'rxjs';
import { OptionsDetailsDataModel } from '../../../Models/ITIFormDataModel';
import { BTERAllotmentdataModel, BTERSearchModel } from '../../../Models/BTER/BTERAllotmentDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ITIAllotmentService } from '../../../Services/ITI/ITIAllotment/itiallotment.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
@Component({
  selector: 'app-allotment',
  standalone: false,
  templateUrl: './allotment.component.html',
  styleUrl: './allotment.component.css'
})

export class AllotmentComponent implements OnInit {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_Heading: string[] = [];
  public Table_SearchText: string = "";
  public FilterType: string = "";
  public SearchText: string = "";
  ITIAllotmentFormGroup!: FormGroup;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public request = new BTERAllotmentdataModel();
  public searchRequest = new BTERSearchModel();
  public searchRequestData = new ITICollegeTradeSearchModel();
  public AllotmentTypeList: any = [];
  public AllotmentCounterList: AllotmentCounterDataModel[] = [];
  public ItiCollegesList: any = [];
  public ItiTradeList: any = [];
  public GenerateAllotmentList: any = [];
  public AddedChoices: OptionsDetailsDataModel[] = []
  public ShowSeatMetrixList: SeatMetrixdataModel[] = [];
  public StudentSeatAllotmentList: StudentSeatAllotmentdataModel[] = [];
  public ShowAllotmentList: StudentSeatAllotmentdataModel[] = [];
  public AddedChoices8: OptionsDetailsDataModel[] = []
  public AddedChoices10: OptionsDetailsDataModel[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  numbers: Observable<number> = interval(2000);
  subscription!: Subscription;
  dynamicCondition: boolean = false;
  Generatebtn: boolean = false;
  public ListITICollegeByManagement: any = [];
  AllotmentGenerateKey: string = "";
  AllotmentPublishKey: string = "";

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  showResendButton: boolean = false;
  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  private interval: any;
  public ListITITrade: any = [];
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public DateConfigSetting: any = [];
  public TestData: any;
  public ListITITradeScheme: any = [];
  public transactionData: any = [];
  //public transactionData$: any;

  public transactionDatacoloumn: any;

  getKeys() {

  }




  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private AllotmentService: ITIAllotmentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private route: ActivatedRoute,
    private ITICollegeTradeService: ItiSeatIntakeService,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.searchRequest.TradeLevel = parseInt(this.route.snapshot.paramMap.get('id') ?? "0");
    this.request.TradeLevel = this.searchRequest.TradeLevel;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.EndTermId = this.sSOLoginDataModel.EndTermID;

    this.request.AllotmentId = 0;

    this.ITIAllotmentFormGroup = this.fb.group(
      {
        AllotmentId: ['']
      })

    this.GetDateConfig();
    this.getTradeScheme();
    this.getITICollege();
    this.getITITrade()
    this.loadDropdownData('AllotmentType');
    //this.ShowSeatMetrix();
    //this.GetInstituteListDDL();
    this.request.AllotmentId = 0;
  }

  async getITICollege() {
    try {
      this.searchRequestData.Action = "_ITICollegeByManagementType";
      this.searchRequestData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.getITICollegeByManagement(this.searchRequestData)
        .then((data: any) => {
          //data = JSON.parse(JSON.stringify(data));
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
      this.searchRequestData.Action = "_ITITrade";
      this.searchRequestData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.getITITrade(this.searchRequestData)
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

  async getTradeScheme() {

    try {
      this.loaderService.requestStarted();

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



  async GetDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: 1,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      Key: "FIRST ALLOTMENT GENERATE,FIRST ALLOTMENT PUBLISH,FIRST UPWARD GENERATE,FIRST UPWARD PUBLISH,SECOND ALLOTMENT GENERATE,SECOND ALLOTMENT PUBLISH"
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
        console.log(this.DateConfigSetting[0]['GENERATE MERIT']);

      }, (error: any) => console.error(error)
      );
  }


  exportToExcel12345(): void {
    //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('data-table')!);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.transactionData);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'BTERAllotment.xlsx');
  }

  async exportToExcel() {
    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return
    }
    try {
      console.log("searchRequest", this.searchRequest);
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.StreamTypeID = this.searchRequest.TradeLevel;
      this.searchRequest.AllotmentMasterId = this.request.AllotmentId;
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.CollegeID = this.searchRequestData.CollegeID;
      this.searchRequest.TradeID = this.searchRequestData.TradeID;
      this.searchRequest.StreamTypeID = this.searchRequestData.TradeSchemeId;
      this.searchRequest.FilterType = this.FilterType
      this.searchRequest.SearchText = this.FilterType
      this.searchRequest.ReportingStatus = this.searchRequest.ReportingStatus;

      this.searchRequest.PageNumber = 1;
      this.searchRequest.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.AllotmentService.ShowAllotmentDataList(this.searchRequest)
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


  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'AllotmentType':
          this.AllotmentTypeList = data['Data'];
          console.log(this.AllotmentTypeList, "datatatata")
          break;
        default:
          break;
      }
    });
  }

  async GetInstituteListDDL() {
    try {
      this.loaderService.requestStarted();
      this.collegeSearchRequest.action = '_getAllData'
      await this.commonFunctionService.ItiCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiCollegesList = data.Data
        console.log(this.ItiCollegesList, "collegename")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeListDDL() {
    ;
    try {
      this.searchRequest.CollegeID = this.searchRequest.StInstituteID
      this.searchRequest.TradeLevel = this.request.TradeLevel
      this.searchRequest.action = '_getDatabyCollege'
      this.loaderService.requestStarted();
      await this.commonFunctionService.TradeListGetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeList = data.Data
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GenerateAllotment() {
    //this.Swal2.Confirmation("Are you sure you want to Publish Seat Allotment? <br> " +
    //  "<b> #Note: Once You Publish The Seat Allotment, No Changes Would Be Possible After. <br> </b>" +
    //  "<b> #टिप्पणी : एक बार जब आप सीट आवंटन प्रकाशित कर देंगे, तो उसके बाद कोई बदलाव संभव नहीं होगा। </b>",
    //  async (result: any) => {

    if (this.searchRequest.TradeLevel != null && this.request.AllotmentId != null && this.searchRequest.TradeLevel > 0 && this.request.AllotmentId > 0) {
      this.Generatebtn = true;
      this.request.TradeLevel = this.searchRequest.TradeLevel;
      this.startSubscription();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.request.StreamTypeID = this.searchRequest.TradeLevel;
      this.request.CreatedBy = this.searchRequest.TradeLevel;
      this.request.IPAddress = "";




      try {
        await this.AllotmentService.GetGenerateAllotment(this.request)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {

              if (data.Data[0].Status == 1) {
                this.toastr.success(data.Data[0].MSG);
              } else {
                this.toastr.error(data.Data[0].MSG);
              }

              this.GenerateAllotmentList = data['Data'];
            } else {
              //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
            }
          }, error => console.error(error));
      } catch (Ex) {
        console.log(Ex);
      }
    }
    else {
      this.toastr.warning('Valid Trade Lavel And Allotment Type');
    }
    //});
  }


  async VerifyOTP() {

    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        this.Swal2.Confirmation("Are you sure you want to Publish Seat Allotment? <br> " +
          "<b> #Note: Once You Publish The Seat Allotment, No Changes Would Be Possible After. <br> </b>" +
          "<b> #टिप्पणी : एक बार जब आप सीट आवंटन प्रकाशित कर देंगे, तो उसके बाद कोई बदलाव संभव नहीं होगा। </b>",
          async (result: any) => {
            if (this.searchRequest.TradeLevel != null && this.request.AllotmentId != null && this.searchRequest.TradeLevel > 0 && this.request.AllotmentId > 0) {
              this.Generatebtn = true;
              this.request.TradeLevel = this.searchRequest.TradeLevel;
              this.startSubscription();
              this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
              this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
              try {
                await this.AllotmentService.GetPublishAllotment(this.request)
                  .then((data: any) => {
                    data = JSON.parse(JSON.stringify(data));
                    if (data.State === EnumStatus.Success) {

                      if (data.Data[0].Status == 1) {
                        this.toastr.success(data.Data[0].MSG);
                      } else {
                        this.toastr.error(data.Data[0].MSG);
                      }

                      this.GenerateAllotmentList = data['Data'];
                    } else {
                      //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
                    }
                  }, error => console.error(error));
                this.CloseModal()
              }
              catch (Ex) {
                console.log(Ex);
              }
            }
            else {
              this.toastr.warning('Valid Trade Lavel And Allotment Type');
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
      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin) {
        this.sSOLoginDataModel.Mobileno = "7568622727";

        await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
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


  async openModalGenerateOTP(content: any, item: BTERSearchModel) {

    this.searchRequest = item
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.MobileNo;
    this.searchRequest = item;
    this.SendOTP();
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


  async PublishAllotment() {
    console.log(this.searchRequest, 'List')
    this.Swal2.Confirmation("Are you sure you want to Publish Seat Allotment? <br> " +
      "<b> #Note: Once You Publish The Seat Allotment, No Changes Would Be Possible After. <br> </b>" +
      "<b> #टिप्पणी : एक बार जब आप सीट आवंटन प्रकाशित कर देंगे, तो उसके बाद कोई बदलाव संभव नहीं होगा। </b>",
      async (result: any) => {
        if (this.searchRequest.TradeLevel != null && this.request.AllotmentId != null && this.searchRequest.TradeLevel > 0 && this.request.AllotmentId > 0) {
          this.Generatebtn = true;
          this.request.TradeLevel = this.searchRequest.TradeLevel;
          this.startSubscription();
          this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
          try {
            await this.AllotmentService.GetPublishAllotment(this.request)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State === EnumStatus.Success) {

                  if (data.Data[0].Status == 1) {
                    this.toastr.success(data.Data[0].MSG);
                  } else {
                    this.toastr.error(data.Data[0].MSG);
                  }

                  this.GenerateAllotmentList = data['Data'];
                } else {
                  //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
                }
              }, error => console.error(error));
          }
          catch (Ex) {
            console.log(Ex);
          }
        }
        else {
          this.toastr.warning('Valid Trade Lavel And Allotment Type');
        }
      });
  }

  async AllotmentCounter() {

    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      //this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.AllotmentId = this.request.AllotmentId;
      await this.AllotmentService.AllotmentCounter(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.AllotmentCounterList = data['Data'];
            for (let i = 0; i < this.AllotmentCounterList.length; i++) {
              if (this.AllotmentCounterList[i].Type == "END") {
                this.stopSubscription();
                this.Generatebtn = false;
              }
            }
            console.log(this.AllotmentCounterList, "AllotmentCounter")
          } else {
            //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
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


  async ShowAllotmentDataList(i: any) {

    if (!this.searchRequest.action || this.searchRequest.action === '') {
      this.toastr.warning('Please select the Allotment type.');
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

    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.StreamTypeID = this.searchRequest.TradeLevel;
    this.searchRequest.AllotmentMasterId = this.request.AllotmentId;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
    this.searchRequest.CollegeId = this.searchRequestData.CollegeID;
    this.searchRequest.TradeID = this.searchRequestData.TradeID;
    this.searchRequest.StreamTypeID = this.searchRequestData.TradeSchemeId;


    this.searchRequest.FilterType = this.FilterType
    this.searchRequest.SearchText = this.FilterType

    this.searchRequest.PageNumber = this.pageNo
    this.searchRequest.PageSize = this.pageSize
    this.transactionData = [];
    try {
      this.loaderService.requestStarted();
      await this.AllotmentService.ShowAllotmentDataList(this.searchRequest)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.transactionData = data.Data;

            this.totalRecord = this.transactionData[0]?.TotalRecords;
            this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

            console.log(this.Table_Heading, "this.Table_Heading");
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


  filteredItems() {
    this.transactionData.filter((college: any) => {
      return Object.keys(college).some(key => {
        const collegeValue = college[key];
        if (typeof collegeValue === 'string' && collegeValue.toLowerCase().includes(this.Table_SearchText.toLowerCase())) {
          return true;
        }
        return false;
      });
    });
  }

  changeListType() {
    this.transactionData = [];
  }


  async ShowSeatMetrix() {
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.AllotmentService.ShowSeatMetrix(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.ShowSeatMetrixList = data['Data'];
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
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

  async GetById() {
    ;
    this.isSubmitted = false;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.TradeLevel = this.request.TradeLevel
    this.AddedChoices8 = [];
    this.AddedChoices10 = [];
    try {
      this.loaderService.requestStarted();
      await this.AllotmentService.GetOptionDetailsbyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("AddedChoices on getby id", data.Data)
          this.AddedChoices = data['Data']
          console.log(this.AddedChoices, "addeddata")
          //this.formData.ApplicationID = data['Data'][0].ApplicationID;

          this.AddedChoices.map((choice: any) => {
            if (choice.TradeLevel == 8) {
              this.AddedChoices8.push(choice)
            } else if (choice.TradeLevel == 10) {
              this.AddedChoices10.push(choice)
            }
          })
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ShowStudentSeatAllotment() {
    ;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.TradeLevel = this.request.TradeLevel;
    this.searchRequest.AllotmentId = this.request.AllotmentId;
    try {
      this.loaderService.requestStarted();
      await this.AllotmentService.ShowStudentSeatAllotment(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.StudentSeatAllotmentList = data['Data'];
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
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


  setTakeCondition() {
    if (this.dynamicCondition) {
      this.subscription = this.numbers.subscribe({
        next: (x) => {
          this.AllotmentCounter();
          console.log('Next: ', x);
        },
        complete: () => {
          console.log('Completed!');
        }
      });
    } else {
      if (this.subscription) {
        this.subscription.unsubscribe();
        console.log('Unsubscribed and stopped!');
      }
    }
  }
  startSubscription() {

    if (this.request.AllotmentId == 2) {
      this.AllotmentGenerateKey = "FIRST ALLOTMENT GENERATE";
      this.AllotmentPublishKey = "FIRST ALLOTMENT PUBLISH";
    } else if (this.request.AllotmentId == 3) {
      this.AllotmentGenerateKey = "FIRST UPWARD GENERATE";
      this.AllotmentPublishKey = "FIRST UPWARD PUBLISH";
    } else if (this.request.AllotmentId == 4) {
      this.AllotmentGenerateKey = "SECOND ALLOTMENT GENERATE";
      this.AllotmentPublishKey = "SECOND ALLOTMENT PUBLISH";
    }
    this.dynamicCondition = true;
    this.setTakeCondition();
  }
  stopSubscription() {
    this.dynamicCondition = false;
    this.setTakeCondition();
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
    if (this.totalShowData < Number(this.transactionData[0]?.TotalRecords)) {
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


  async SavePublish() {
    this.Generatebtn = true;
    this.request.TradeLevel = this.searchRequest.TradeLevel;
    this.startSubscription();
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    try {
      await this.AllotmentService.GetPublishAllotment(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {

            if (data.Data[0].Status == 1) {
              this.toastr.success(data.Data[0].MSG);
            } else {
              this.toastr.error(data.Data[0].MSG);
            }

            this.GenerateAllotmentList = data['Data'];
          } else {
            //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, error => console.error(error));
      this.CloseModal()
    }
    catch (Ex) {
      console.log(Ex);
    }

  }


  openOTPForPublish(Id: number) {
    if (this.searchRequest.TradeLevel != null && this.request.AllotmentId != null && this.searchRequest.TradeLevel > 0 && this.request.AllotmentId > 0) {
      this.Swal2.Confirmation("Are you sure you want to Publish Seat Allotment? <br> " +
        "<b> #Note: Once You Publish The Seat Allotment, No Changes Would Be Possible After. <br> </b>" +
        "<b> #टिप्पणी : एक बार जब आप सीट आवंटन प्रकाशित कर देंगे, तो उसके बाद कोई बदलाव संभव नहीं होगा। </b>",
        async (result: any) => {
          if (result.isConfirmed) {
            this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
            this.CloseModal();
            this.childComponent.OpenOTPPopup();
            var th = this;
            //this.toastr.success('OTP sent successfully to student mobile no');
            this.childComponent.onVerified.subscribe(() => {
              th.SavePublish();
            });
          }
        });
    }
    else {
      this.toastr.warning('Valid Trade Lavel And Allotment Type');
    }

  }
}
