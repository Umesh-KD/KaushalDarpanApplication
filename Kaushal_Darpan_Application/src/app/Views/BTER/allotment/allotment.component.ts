import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { EnumStatus } from '../../../Common/GlobalConstants';
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
import { BterSeatIntakeService } from '../../../Services/BTER/ItiSeatIntake/iti-seat-intake.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { UnPublishModel } from '../../../Models/DateConfigurationDataModels';
import { UploadFileModel } from '../../../Models/UploadFileModel';
@Component({
  selector: 'app-allotment',
  standalone: false,
  templateUrl: './allotment.component.html',
  styleUrl: './allotment.component.css'
})

export class AllotmentComponent implements OnInit {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  @ViewChild('otpModal1') childComponent1!: OTPModalComponent;
  @ViewChild('otpModal2') childComponent2!: OTPModalComponent;
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
  public IsNull: boolean = false;
  public selectedFile: File | null = null;  // Store the selected file
  public importFile: any;
  public DataExcel: any = [];
  public DataExcel1: any = [];
  public DataExcel2: any = [];
  public DataExcel3: any = [];
  public DataExcel4: any = [];

  AllotmentGenerateKey: string = "";
  AllotmentPublishKey: string = "";

  public UnPublishRemark: string = '';
  public UnPubishAttachment: string = '';

  IsGenerateSecondAllotment: boolean = false;

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public DateConfigSetting: any = [];
  public TestData: any;

  public transactionData: any = [];
  //public transactionData$: any;

  public transactionDatacoloumn: any;

  getKeys() {

  }




  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private AllotmentService: BTERAllotmentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private BTERCollegeTradeService: BterSeatIntakeService,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.searchRequest.TradeLevel = parseInt(this.route.snapshot.paramMap.get('id') ?? "0");
    this.request.TradeLevel = this.searchRequest.TradeLevel;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.EndTermId = this.sSOLoginDataModel.EndTermID;
    this.ITIAllotmentFormGroup = this.fb.group(
      {
        AllotmentId: ['']
      })

    this.GetDateConfig();

    this.loadDropdownData('AllotmentType');
    //this.ShowSeatMetrix();
    this.GetInstituteListDDL();

  }

  async GetDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.searchRequest.TradeLevel,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      SSOID: this.sSOLoginDataModel.SSOID,
      Key: "FIRST ALLOTMENT GENERATE,FIRST ALLOTMENT PUBLISH,UPWARD ALLOTMENT PUBLISH,SECOND ALLOTMENT GENERATE,SECOND ALLOTMENT PUBLISH"
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
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
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.StreamTypeID = this.searchRequest.TradeLevel;
      this.searchRequest.AllotmentMasterId = this.request.AllotmentId;
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID

      this.searchRequest.FilterType = this.FilterType
      this.searchRequest.SearchText = this.FilterType

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
        this.ItiCollegesList = data.Data;
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
      this.request.IsGenerateSecondAllotment = this.IsGenerateSecondAllotment;



      try {






        await this.AllotmentService.GetGenerateAllotment(this.request)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {

              if (data.Data[0].Status == 1) {
                this.toastr.success(data.Data[0].MSG);
              } else {

                //if (data.Data[0].Status == 2 && this.request.AllotmentId == 4) {

                //  this.Swal2.Confirmation("Do you want to generate second allotment without generating and publishing second merit? <br> " +                    
                //    "<b> #टिप्पणी : क्या आप दूसरी मेरिट तैयार किए और प्रकाशित किए बिना दूसरा आवंटन तैयार करना चाहते हैं? </b>",
                //    async (result: any) => {

                //      var reult111 = result;
                //      if (result.isConfirmed) {
                //        this.IsGenerateSecondAllotment = true;
                //        this.GenerateAllotment();
                //      }                      
                //    });

                //} else {
                this.toastr.error(data.Data[0].MSG);
                this.IsGenerateSecondAllotment = false;
                // }
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

  async PublishAllotment() {
    console.log(this.searchRequest, 'List')
    this.Swal2.Confirmation("Are you sure you want to Publish Seat Allotment? <br> " +
      "<b> #Note: Once You Publish The Seat Allotment, No Changes Would Be Possible After. <br> </b>" +
      "<b> #टिप्पणी : एक बार जब आप सीट आवंटन प्रकाशित कर देंगे, तो उसके बाद कोई बदलाव संभव नहीं होगा। </b>",
      async (result: any) => {
        if (this.searchRequest.TradeLevel != null && this.request.AllotmentId != null && this.searchRequest.TradeLevel > 0 && this.request.AllotmentId > 0) {


          this.childComponent1.MobileNo = this.sSOLoginDataModel.Mobileno
          this.childComponent1.OpenOTPPopup();
          var th = this;
          this.childComponent1.onVerified.subscribe(() => {
            this.Generatebtn = true;
            this.request.TradeLevel = this.searchRequest.TradeLevel;
            this.startSubscription();
            this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
            try {
              this.AllotmentService.GetPublishAllotment(this.request)
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

          });



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
      this.searchRequest.StreamTypeID = this.sSOLoginDataModel.Eng_NonEng;
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
            var d = Object.keys(this.transactionData);
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
          this.AddedChoices = data['Data']
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
      }
    }
  }
  startSubscription() {
    if (this.request.AllotmentId == 2) {
      this.AllotmentGenerateKey = "FIRST ALLOTMENT GENERATE";
      this.AllotmentPublishKey = "FIRST ALLOTMENT PUBLISH";
    } else if (this.request.AllotmentId == 3) {
      this.AllotmentGenerateKey = "FIRST UPWARD GENERATE";
      this.AllotmentPublishKey = "UPWARD ALLOTMENT PUBLISH";
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

  ResetData() {
    this.DataExcel = [];
    this.selectedFile = null;
    this.importFile = null;
  }

  CloseModal() {
    this.modalService.dismissAll();
  }
  public uploadModel: any;
  async OpenUploadAllotmnetModel(content: any) {

    if (this.request.AllotmentId === 0) {
      this.toastr.error("Please select Allotment Type.");
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

  async SampleexportExcelData() {

    try {
      var searchRequest2 = {
        MeritMasterId: 0,
        SearchText: 0,
        Category: 0,
        Gender: 0,
        CourseType: this.sSOLoginDataModel.Eng_NonEng,
        AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
        EndTermId: 0,
        DepartmentId: 1,
        PageNumber: 1,
        PageSize: 100,
        CreatedBy: 1,
        Action: "ImportFormate"
      }
      this.loaderService.requestStarted();
      await this.AllotmentService.AllotmnetFormateData(searchRequest2)
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
            XLSX.writeFile(wb, 'AllotmentData.xlsx');

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

  async ExportExcelBranchmappingData() {

    try {
      var searchRequest2 = {
        MeritMasterId: 0,
        SearchText: 0,
        Category: 0,
        Gender: 0,
        CourseType: this.sSOLoginDataModel.Eng_NonEng,
        AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
        EndTermId: 0,
        DepartmentId: 1,
        PageNumber: 1,
        PageSize: 100,
        CreatedBy: 1,
        Action: "CollegeBranch"
      }
      this.loaderService.requestStarted();
      await this.AllotmentService.AllotmnetCollegeBranchData(searchRequest2)
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
            XLSX.writeFile(wb, 'CollegeBranchMapping.xlsx');

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

  async ExportExcelOptionFormData() {
    try {
      var searchRequest2 = {
        AllotmentMasterId: this.request.AllotmentId,
        SearchText: 0,
        Category: 0,
        Gender: 0,
        CourseType: this.sSOLoginDataModel.Eng_NonEng,
        AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
        EndTermId: 0,
        DepartmentId: 1,
        PageNumber: 1,
        PageSize: 100,
        CreatedBy: 1,
        Action: "OptionForm"
      }
      this.loaderService.requestStarted();
      await this.AllotmentService.AllotmnetCollegeBranchData(searchRequest2)
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
            XLSX.writeFile(wb, 'OptionFormData.xlsx');

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
      await this.AllotmentService.AllotmnetFormateData(searchRequest2)
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

  async UploadAllotmentData1() {
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
        AllotmentMasterId: this.request.AllotmentId,
        CreatedBy: this.sSOLoginDataModel.UserID,
        IPAddress: "",
        AllotmentData: this.DataExcel
      }

      console.log(this.DataExcel, "GeatDistribution")
      await this.AllotmentService.UploadAllotmentdata(data)
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
            } else {
              this.toastr.error(data.Data[0].MSG);
            }


            // this.CloseModal();
            //this.onSearch(1);
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


  openOTPUploadExcel() {
    this.CloseModal();
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();
    var th = this;
    this.childComponent.onVerified.subscribe(() => {
      th.UploadAllotmentData1();
      th.OpenUploadAllotmnetModel(this.uploadModel);
      // this.CloseModal();
      //console.log("otp verified on the page")
    });
  }

  openOTPUnPublish() {


    if (this.UnPublishRemark == "" || this.UnPublishRemark.replaceAll(" ", "") == "" || this.UnPublishRemark.replace(/[^a-zA-Z0-9 ]/g, "") == "") {
      this.toastr.error("Please enter reason for unpublish Merit.");
      return
    }

    this.childComponent2.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.CloseModal();
    this.childComponent2.OpenOTPPopup();
    var th = this;
    this.childComponent2.onVerified.subscribe(() => {
      th.openUnAllotmnet();
    });
    
  }

  openUnPublish(content: any) {

    if (this.request.AllotmentId === 0) {
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

  async openUnAllotmnet() {
    try {
      this.loaderService.requestStarted();


      const request = new UnPublishModel();

      request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID_Session;
      request.Action = "ALLOTMENT";
      request.AllotmentMasterId = this.request.AllotmentId;
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
              //this.onSearch(1);
              this.UnPublishRemark = "";
              this.UnPubishAttachment = "";
              this.childComponent2.onVerified.unsubscribe();
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
