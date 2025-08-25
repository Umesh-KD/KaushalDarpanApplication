import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ItiMeritSearchModel } from '../../../../Models/ITI/ItiMerit';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiMeritService } from '../../../../Services/ITI/ItiMerit/iti-merit.service';
import { EnumDepartment, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-iti-merit',
  templateUrl: './iti-merit.component.html',
  styleUrl: './iti-merit.component.css',
  standalone: false
})
export class ItiMeritComponent implements OnInit {

  sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ItiMeritSearchModel()
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
  isSearchClicked: boolean = false
  ShowGenerateButton: boolean = false
  ShowPublishButton: boolean = false
  public OTP: string = '';
  public GeneratedOTP: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  private interval: any;
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; 
  MeritGenerateKey: string = "";
  MeritPublishKey: string = "";
  public MobileNo: string = '';
  public DateConfigSetting: any = [];
  public MeritMaster = [
/*    { Id: 1, Name: "First Allotment Provisional Merit ", GenerateKey: "GENERATE FIRST PROVISIONAL MERIT", PublishKey: "PUBLISH FIRST PROVISIONAL MERIT" },*/
    { Id: 2, Name: "First Allotment Final Merit", GenerateKey: "GENERATE FIRST FINAL MERIT", PublishKey: "PUBLISH FINAL MERIT" },
    /* { Id: 3, Name: "Second Allotment Provisional Merit", GenerateKey: "GENERATE SECOND PROVISIONAL MERIT", PublishKey: "PUBLISH SECOND PROVISIONAL MERIT" },*/
    /* { Id: 4, Name: "Second Allotment Final Merit", GenerateKey: "GENERATE SECOND FINAL MERIT", PublishKey: "PUBLISH SECOND FINAL MERIT" }*/
  ]


  constructor(
    private commonMasterService: CommonFunctionService, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2,  
    private route: ActivatedRoute,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private itiMeritService: ItiMeritService
  ) {}


  AllotmentChange() {

    
    var th = this;
    this.MeritGenerateKey = this.MeritMaster.filter(function (x) { return x.Id == th.searchRequest.MeritMasterId })[0].GenerateKey;
    this.MeritPublishKey = this.MeritMaster.filter(function (x) { return x.Id == th.searchRequest.MeritMasterId })[0].PublishKey;

  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.Class = this.route.snapshot.paramMap.get('id')?.toString();

    await this.GetDataConfigData(); 

    console.log("sSOLoginDataModel",this.sSOLoginDataModel);
    this.GetMasterData();
    this.searchRequest.DepartmentId = EnumDepartment.ITI;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;




  }


  async GetDataConfigData() {
    try {
      this.loaderService.requestStarted();
      var GenerateKey = this.MeritMaster.map(x => x.GenerateKey).join(',');
      var PublishKey = this.MeritMaster.map(x => x.PublishKey).join(',');

      var data = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeId: 1,
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




  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList);
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
          console.log("MaritMasterList", this.MaritMasterList);
      })
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

    if(this.searchRequest.MeritMasterId === 0 || this.searchRequest.Class === ""){
      this.toastr.error("Please select Merit Master and Class.");
      return
    }
    try {
      
      console.log("searchRequest", this.searchRequest);
      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize

      this.loaderService.requestStarted();
      await this.itiMeritService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.MeritData = data.Data;
          this.totalRecord = this.MeritData[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
          console.log("MeritData", this.MeritData);

          if(this.MeritData.length < 1) {
            this.ShowGenerateButton = true
          } else if (this.MeritData[0].IsPublished != true) {
            this.ShowGenerateButton = true
            this.ShowPublishButton = true
          } else if (this.MeritData[0].IsPublished == true) {
            this.ShowGenerateButton = false
            this.ShowPublishButton = false
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
    this.searchRequest = new ItiMeritSearchModel();
    this.searchRequest.DepartmentId = EnumDepartment.ITI;
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.onSearch(1);
  }


  async VerifyOTP() {
    
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          console.log("searchRequest", this.searchRequest);
          this.loaderService.requestStarted();
          this.searchRequest.Action = 'PUBLISH';
          await this.itiMeritService.PublishMerit(this.searchRequest)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log("published data", data);
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
            }, (error: any) => console.error(error)
            );
          this.CloseModal()
        }
        catch (ex) {
          console.log(ex);
        }
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


  async openModalGenerateOTP(content: any, item: ItiMeritSearchModel) {
    
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

  async generateMerit () {
    try {
      console.log("searchRequest", this.searchRequest);
      this.loaderService.requestStarted();
      this.searchRequest.Action = 'GENERATE';
      await this.itiMeritService.GenerateMerit(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("GenerateMerit data",data);
          if(data.State == EnumStatus.Success){
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

  async publishMerit () {
    try {
      console.log("searchRequest", this.searchRequest);
      this.loaderService.requestStarted();
      this.searchRequest.Action = 'PUBLISH';
      await this.itiMeritService.PublishMerit(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("published data",data);
          if(data.State == EnumStatus.Success){
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
    if (this.totalRecord == 0) {
      this.toastr.error("Please search data first.");
      return
    }
    try {
      console.log("searchRequest", this.searchRequest);
      this.searchRequest.PageNumber = 1
      this.searchRequest.PageSize = this.totalRecord

      this.loaderService.requestStarted();
      await this.itiMeritService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data",data);
          if(data.State === EnumStatus.Success){
            this.MeritDataExcel = data.Data;
            console.log("MeritDataExcel", this.MeritDataExcel);

            if (this.searchRequest.Class == "8") {
              const unwantedColumns = [
                'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
                'Id', 'Status', 'RemarkForStatus', 'FeePdf', 'RTS', 'TotalRecords', 'MeritMasterId', 'AcademicYearID',
                'DepartmentId', 'PublishBy', 'PublishIP', 'IsPublished', 'Class','TenthMathsPer','TenthSciencePer',
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
              XLSX.writeFile(wb, 'ItiMeritList.xlsx');
            } else if (this.searchRequest.Class=="10") {
              const unwantedColumns = [
                'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
                'Id', 'Status', 'RemarkForStatus', 'FeePdf', 'RTS', 'TotalRecords', 'MeritMasterId', 'AcademicYearID',
                'DepartmentId', 'PublishBy', 'PublishIP', 'Class','IsPublished'
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
              XLSX.writeFile(wb, 'ItiMeritList.xlsx');
            }
        

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
}
