import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { RoomsMasterService } from '../../../Services/RoomsMaster/rooms-master.service';
import { AllotmentCounterDataModel, AllotmentdataModel, SearchModel, SeatMetrixdataModel, StudentSeatAllotmentdataModel } from '../../../Models/ITIAllotmentDataModel';
import { ITIAllotmentService } from '../../../Services/ITI/ITIAllotment/itiallotment.service';
import { ItiCollegesSearchModel } from '../../../Models/CommonMasterDataModel';
import { Observable, interval, Subscription } from 'rxjs';
import { OptionsDetailsDataModel } from '../../../Models/ITIFormDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-itiallotment',
  standalone: false,  
  templateUrl: './itiallotment.component.html',
  styleUrl: './itiallotment.component.css'
})

export class ITIAllotmentComponent implements OnInit {
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  public Table_Heading: string[] = [];
  ITIAllotmentFormGroup!: FormGroup;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public request = new AllotmentdataModel();
  public searchRequest = new SearchModel();
  public AllotmentTypeList: any = [];
  public AllotmentCounterList: AllotmentCounterDataModel[] = [];
  public ItiCollegesList: any = [];
  public ItiTradeList: any = [];
  public GenerateAllotmentList: any = [];
  public AddedChoices: OptionsDetailsDataModel[] = []
  public ShowSeatMetrixList: SeatMetrixdataModel[] = [];
  public StudentSeatAllotmentList: StudentSeatAllotmentdataModel[] = [];
  public AddedChoices8: OptionsDetailsDataModel[] = []
  public AddedChoices10: OptionsDetailsDataModel[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  numbers: Observable<number> = interval(2000);
  subscription!: Subscription;
  dynamicCondition: boolean = false;
  Generatebtn: boolean = false;

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public transactionData: any = [];
 
  public transactionDatacoloumn: any;

  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private AllotmentService: ITIAllotmentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.searchRequest.TradeLevel = Number(this.route.snapshot.paramMap.get('id'));
    this.request.TradeLevel = this.searchRequest.TradeLevel;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ITIAllotmentFormGroup = this.fb.group(
      {
        AllotmentId: ['']
       /* C*//*lassId: ['']*/
      })
    this.loadDropdownData('AllotmentType');
    //this.ShowSeatMetrix();
    this.GetInstituteListDDL();
  }

  exportToExcel(): void {
    
    //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('data-table')!);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.transactionData);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'ITIAllotment.xlsx');
  }

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'AllotmentType':
          this.AllotmentTypeList = data['Data'];
          console.log(this.AllotmentTypeList,"datatatata")
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
        console.log(this.ItiCollegesList,"collegename")
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
    
    /*if (this.request.TradeLevel != null && this.request.AllotmentId != null && this.request.TradeLevel > 0 && this.request.AllotmentId > 0) {*/
    if (this.request.AllotmentId != null && this.request.AllotmentId > 0) {
      this.Generatebtn = true;
      this.startSubscription();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      try {
        await this.AllotmentService.GetGenerateAllotment(this.request)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.GenerateAllotmentList = data['Data'];
            } else {
              this.toastr.error(data.ErrorMessage || 'Error fetching data.');
            }
          }, error => console.error(error));
      } catch (Ex) {
        console.log(Ex);
      }
    }
    else
    {
      this.toastr.warning('Valid Trade Lavel And Allotment Type');
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
    
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.StreamTypeID = this.searchRequest.TradeLevel;
    this.searchRequest.AllotmentMasterId = this.request.AllotmentId;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID_Session

    this.searchRequest.PageNumber = this.pageNo
    this.searchRequest.PageSize = this.pageSize

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



  async AllotmentCounter() {

    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.AllotmentId = this.request.AllotmentId;
      await this.AllotmentService.AllotmentCounter(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.AllotmentCounterList = data['Data'];
            console.log(this.AllotmentCounterList,"AllotmentData")
            for (let i = 0; i < this.AllotmentCounterList.length; i++) {
              if (this.AllotmentCounterList[i].Type == "END") {
                
                this.stopSubscription();
                this.Generatebtn = false;
              }
            }
            console.log(this.AllotmentCounterList,"AllotmentCounter")
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

  async ShowSeatMetrix() {
    ;
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
    this.AddedChoices8 =[];
    this.AddedChoices10 =[];
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
}
