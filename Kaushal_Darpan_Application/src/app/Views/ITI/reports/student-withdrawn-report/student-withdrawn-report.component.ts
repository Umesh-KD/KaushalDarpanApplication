import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../../Services/Center_Allocation/center-allocation.service';
import { CenterExamAllocationSearchModel, CenterAllocationtDataModels, InstituteList, ITIAssignPracticaLExaminer } from '../../../../Models/CenterAllocationDataModels';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { AllotmentConfigurationModel, ListAllotmentConfigurationModel } from '../../../../Models/AllotmentConfigurationDataModel';
import { AllotmentConfigurationService } from '../../../../Services/Allotment-Configuration/allotment-configuration.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { UserMasterService } from '../../../../Services/UserMaster/user-master.service';
import { VacantSeatRequestModel, AllotmentReportCollegeRequestModel } from '../../../../Models/TheoryMarksDataModels';
import * as XLSX from 'xlsx';
import { ItiTradeSearchModel, StudentthdranSeat1Model } from '../../../../Models/CommonMasterDataModel';
import { ReportCollegeModel } from '../../../../Models/StudentsJoiningStatusMarksDataMedels';
import { ITIAllotmentService } from '../../../../Services/ITI/ITIAllotment/itiallotment.service';
import { ITIPapperSetterDataModel } from '../../../../Models/ITIPapperSetterDataModel';
import { UploadFileModel } from '../../../../Models/UploadFileModel';

@Component({
  selector: 'app-student-withdrawn-report',
  standalone: false,
  templateUrl: './student-withdrawn-report.component.html',
  styleUrl: './student-withdrawn-report.component.css'
})
export class studentwithdrawnreportComponent {
  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public searchRequest = new AllotmentReportCollegeRequestModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  public AllotedSeatList: any[] = [];
  public backupFinalList: any[] = [];
  ReportService = inject(ReportService);
  public id: number = 0;
  public ItiTradeList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel();
  //table feature default
  public paginatedInTableData: any[] = [];
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public filteredStatusList: any[] = [];
  public Table_SearchText: string = "";
  public isSubmitted: boolean = false;
  public isVisibleList: boolean = false;
  public selectedITIGcode: string = "";
  public selectedCollegeId: number = 0;
  public collegeSearchRequest: any = {};
  public request = new ITIPapperSetterDataModel()
  closeResult: string | undefined;
  private modalRef!: NgbModalRef;
  public withdrawnFormGroup!: FormGroup;
  public studentWithdrawnRequest = new StudentthdranSeat1Model();
  
  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private allotmentConfigurationService: AllotmentConfigurationService,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private userMasterService: UserMasterService,
    private appsettingConfig: AppsettingService,
    private itiallotmentStatusService: ITIAllotmentService
    
  ) { }


  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllotedSeatByCollegeList();
    await this.GetTradeListDDL();


    this.withdrawnFormGroup = this.formBuilder.group({
      Remarks: ['', Validators.required]
    });

    this.studentWithdrawnRequest = new StudentthdranSeat1Model();
  }

  async GetAllotedSeatByCollegeList() {

    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;

    try {
      this.loaderService.requestStarted();
      const response = await this.ReportService.AllotmentReportCollege(this.searchRequest);
      const result = JSON.parse(JSON.stringify(response));
      this.AllotedSeatList = result?.Data?.Table || [];
      this.totalInTableRecord = this.AllotedSeatList.length;
      this.loadInTable();
      this.isVisibleList = true;
    } catch (error) {
      console.error(error);
      this.toastr.error("Failed to load data.");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeListDDL() {
    try {
      this.loaderService.requestStarted();
      this.tradeSearchRequest.action = "_getAllData"

      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ItiTradeList = parsedData.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  AllotedSeatByCollegeExportToExcel() {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.AllotedSeatList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const fileName = `AllotedSeatByCollegeList_Class.xlsx`;
    XLSX.writeFile(wb, fileName);
  }



  async downloadAllotedCollegePDF() {

    try {

      var _searchRequest = new ReportCollegeModel();
      this.loaderService.requestStarted();
      _searchRequest = this.searchRequest;

      this.loaderService.requestStarted();
      await this.itiallotmentStatusService.DownloadForCollegeData(this.searchRequest)
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
            link.download = 'AllotmentCollege.pdf';
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





  Reset() {
    this.searchRequest.TradeId = 0;
    this.searchRequest.TradeLevelID = 0;
    this.searchRequest.TradeTypeID = 0;
    this.GetAllotedSeatByCollegeList();
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
 
  updateInTablePaginatedData() {

    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.AllotedSeatList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.AllotedSeatList.length;
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


  

  CloseModalPopup() {
    this.isSubmitted = false;
    this.studentWithdrawnRequest = new StudentthdranSeat1Model();
    this.withdrawnFormGroup.reset();

    this.modalService.dismissAll();
  }


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        
        if (this.file.size > 2000000) {
          this.toastr.error('Select less then 2MB File');
          return;
        }
        this.loaderService.requestStarted();

        let uploadModel = new UploadFileModel();
      
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITI/StudentWithdrawn";


        await this.commonMasterService
          .UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == 'Photo') {

                this.studentWithdrawnRequest.DoucmentName =
                  data['Data'][0]['FileName'];
              }
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage);
            } else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  SavestudentWithdrawnRequest(content: any, item:any) {
    debugger
    this.withdrawnFormGroup.reset();
    this.isSubmitted = false;
    // You can also use the collegeId if needed
    this.studentWithdrawnRequest.CollegeID = item.CollegeId;
    this.studentWithdrawnRequest.ApplicationID = item.ApplicationID;
    this.studentWithdrawnRequest.AllotmentId = item.AllotmentId;
    this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static', centered: true });
  }

  async SavestudentWithdrawnRequestData() {

    debugger
    this.isSubmitted = true;
        
    //if (this.withdrawnFormGroup.invalid) {
    //  this.toastr.error('Please fill all required fields.');
    //  return;
    //}

    if (!this.studentWithdrawnRequest.DoucmentName || this.studentWithdrawnRequest.DoucmentName === '') {
      this.toastr.error('Please upload the required document.');
      return;
    }

    this.studentWithdrawnRequest.UserID = this.sSOLoginDataModel.UserID;
    this.studentWithdrawnRequest.Remarks = this.withdrawnFormGroup.get('Remarks')?.value;

    try {
      this.isSubmitted = true;
      if (this.withdrawnFormGroup.invalid) {
        console.log('Form is invalid');
        return;
      }

      this.loaderService.requestStarted();
      await this.itiallotmentStatusService.StudentSeatWithdrawRequest(this.studentWithdrawnRequest)
        .then((data: any) => {
        /*data = JSON.parse(JSON.stringify(data));*/
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.CloseModalPopup();
          this.GetAllotedSeatByCollegeList();
          this.studentWithdrawnRequest = new StudentthdranSeat1Model();
        } else {
          this.toastr.error(this.ErrorMessage);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


}
