import { Component } from '@angular/core';
import { TheoryMarksSearchModel } from '../../../Models/TheoryMarksDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { TheoryMarksService } from '../../../Services/TheoryMarks/theory-marks.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumRole } from '../../../Common/GlobalConstants';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ItiTheoryMarksService } from '../../../Services/ITI/ItiTheoryMarks/Iti-theory-marks.service';
import { CenterStudentSearchModel } from '../../../Models/ITITheoryMarksDataModel';
import { ITIAssignPracticaLExaminer } from '../../../Models/CenterAllocationDataModels';
import { ItiAssignExaminerService } from '../../../Services/ITIAssignExaminer/iti-assign-examiner.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { SeatMatrixService } from '../../../Services/ITISeatMatrix/seat-matrix.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
@Component({
  selector: 'app-ncvt-practicalexam-attendence',
  standalone: false,
  templateUrl: './ncvt-practicalexam-attendence.component.html',
  styleUrl: './ncvt-practicalexam-attendence.component.css'
})
export class NcvtPracticalexamAttendenceComponent {
  public searchRequest = new CenterStudentSearchModel();
  _EnumRole = EnumRole
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  public Message: string = '';
  public isLocked: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public TheoryMarksRptDataList: any = [];
  public SemesterMasterList: any = [];
  public Branchlist: any = [];
  public InstituteMasterDDLList: any = [];

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  constructor(
    private TheoryMarksService: ItiTheoryMarksService,
    private practicalservice: ItiAssignExaminerService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    public activeroute: ActivatedRoute,
    public toastr: ToastrService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private http: HttpClient) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // if(this.sSOLoginDataModel.RoleID == EnumRole.Examiner) {
    this.searchRequest.SemesterID = Number(this.activeroute.snapshot.paramMap.get("id") ?? 0);
    //   this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
    // }
    this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID

    await this.GetMasterData();
    await this.GetItiTrade()
    await this.GetTheoryMarksDetailList();
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();



      await this.commonMasterService.IticenterColleges(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID
        , this.sSOLoginDataModel.InstituteID).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterDDLList = data.Data;
          console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
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

  async GetItiTrade() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.searchRequest.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Branchlist = data['Data'];
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


  async GetTheoryMarksDetailList() {
    try {
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.CenterID = this.sSOLoginDataModel.InstituteID
     

      // this.searchRequest.IsConfirmed = this.IsConfirmed = true;

      // //group code id
      // if (this.IsCountShow == false) {
      //   this.searchRequest.ExaminerCode = this.examinerCodeLoginModel.ExaminerCode
      // } else {
      //   this.searchRequest.ExaminerCode = this.ExaminerCode
      // }
      // this.searchRequest.GroupCodeID = this.TheoryMarksDashBoardCount[0].GroupCodeID;
      // //call
      this.loaderService.requestStarted();

      await this.TheoryMarksService.GetNcvtPracticalstudent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));  

          this.TheoryMarksRptDataList = data['Data'];
          this.isLocked = this.TheoryMarksRptDataList.some((e:any)=>e.IsFinalSubmit==true)
          //table feature load
          this.loadInTable();
          //end table feature load
        }, (error: any) => console.error(error));
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



  async PDFDownload() {
    try {
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      // this.searchRequest.IsConfirmed = this.IsConfirmed = true;

      // //group code id
      // if (this.IsCountShow == false) {
      //   this.searchRequest.ExaminerCode = this.examinerCodeLoginModel.ExaminerCode
      // } else {
      //   this.searchRequest.ExaminerCode = this.ExaminerCode
      // }
      // this.searchRequest.GroupCodeID = this.TheoryMarksDashBoardCount[0].GroupCodeID;
      // //call


      this.loaderService.requestStarted();

      await this.reportService.TheorymarksReportPdf(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          //this.TheoryMarksRptDataList = data['Data'];
          this.DownloadFile(data.Data, '')



        }, (error: any) => console.error(error));
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


  ResetControl() {
    this.searchRequest = new CenterStudentSearchModel();
    this.GetTheoryMarksDetailList();
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.TheoryMarksRptDataList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.TheoryMarksRptDataList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.TheoryMarksRptDataList.length;
  }

  //end table feature

  //exportToExcel(): void {
  //  const unwantedColumns = [
  //    'StudentID', 'StudentExamID', 'StudentExamPaperMarksID', 'StudentExamPaperID', 'rowclass'
  //  ];
  //  const filteredData = this.TheoryMarksRptDataList.map((item: any) => {
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
  //  XLSX.writeFile(wb, 'Theory-Marks-Report-Data.xlsx');
  //}
  exportToExcel(): void {
    const unwantedColumns = [
      'StudentID', 'StudentExamID', 'StudentExamPaperMarksID', 'StudentExamPaperID', 'rowclass'
    ];

    const filteredData = this.TheoryMarksRptDataList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Calculate auto width
    const columnWidths = Object.keys(filteredData[0] || {}).map(key => {
      const maxLength = Math.max(
        key.length,
        ...filteredData.map((row: any) => (row[key] ? row[key].toString().length : 0))
      );
      return { wch: maxLength + 2 }; // +2 for padding
    });

    ws['!cols'] = columnWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Theory-Marks-Report-Data.xlsx');
  }



  DownloadFile(FileName: string, DownloadfileName: any = ''): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ITIReportsFolder + GlobalConstants.ITIAdmitCardFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `Admitcard_${timestamp}.${extension}`;
  }

  async SaveData() {
    this.loaderService.requestStarted();
    try {

      this.loaderService.requestStarted();

     const Data= this.TheoryMarksRptDataList.filter((x:any)=>x.Marked==true)
      if (Data.length < 1) {
        this.toastr.warning("Please Select Atleast One Student")
        return
        
      }
      this.TheoryMarksRptDataList.forEach((x:any) => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
  
        x.isFinalSubmit = false
      });



      await this.practicalservice.NcvtUpdateStudentExamMarksData(Data)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.GetTheoryMarksDetailList()


          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        //this.isSubmitted = false;
      }, 200);
    }
  }


  async FinalSaveData() {
    this.loaderService.requestStarted();
    try {

      this.loaderService.requestStarted();

      this.TheoryMarksRptDataList.forEach((x: any) => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;

        x.isFinalSubmit = true
      });

     
      await this.practicalservice.NcvtUpdateStudentExamMarksData(this.TheoryMarksRptDataList)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.CloseModal()
            this.GetTheoryMarksDetailList()

          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        //this.isSubmitted = false;
      }, 200);
    }
  }



  //Start Section Model
  async openModalGenerateOTP(content: any) {


   



    this.Swal2.Confirmation("Are you sure you want to Final Submit? You cannot update or revert after final submitting", async (result: any) => {
      // Check if the user confirmed the action
      if (result.isConfirmed) {
       
        // Any additional logic or actions can be placed here if needed

        this.OTP = '';
        this.MobileNo = '';
        this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });


        this.SendOTP();

      }
    });
  }
  async SendOTP(isResend?: boolean) {
    try {
      debugger
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
/*      this.sSOLoginDataModel.Mobileno = "8905268611";*/
      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            //open modal popup
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

  resetOTPControls() {
    this.OTP = "";
    this.GeneratedOTP = "";

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


  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.FinalSaveData()
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
      else {
        this.toastr.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }



  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  selectInTableAllCheckbox() {
    this.TheoryMarksRptDataList.forEach((x:any) => {
      x.Marked = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.TheoryMarksRptDataList.filter((x:any) => x.StudentID == item.StudentID);
    data.forEach((x:any) => {
      x.Marked = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.TheoryMarksRptDataList.every((r:any) => r.Marked);
  }


}
