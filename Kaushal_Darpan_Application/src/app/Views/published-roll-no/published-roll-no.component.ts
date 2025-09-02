import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { enumExamStudentStatus, EnumRole, EnumRollNoStatus, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import {
  GenerateRollData,
  GenerateRollSearchModel,
} from '../../Models/GenerateRollDataModels';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { GetRollService } from '../../Services/GenerateRoll/generate-roll.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import {  ToastrService } from 'ngx-toastr';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-published-roll-no',
  templateUrl: './published-roll-no.component.html',
  styleUrl: './published-roll-no.component.css',
  standalone: false,
})
export class PublishedRollNoComponent {
  public SearchForm!: FormGroup;
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StudentTypeList: any[] = [];
  public ExamList: any[] = [];
  public Table_SearchText: any = '';
  public StudentList: GenerateRollData[] = [];
  public InstituteMasterList: any = [];
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new GenerateRollSearchModel();
  public UserID: number = 0;
  public ddlRollListStatus: number = 0;
  public _RollListStatus= EnumRollNoStatus; 
  //table feature default
  public paginatedInTableData: any[] = []; //copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = '50';
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public selectedEndTermID: number = 0;
  public currentStatus: number = 0;
  public currentTab: number = 0;
  public PageNameTitile: string = '';
  public RollStatusList: GenerateRollData[] = []
  public Isverified:boolean=false
  //end table feature default
  closeResult: string | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';

  public _EnumRole = EnumRole;

  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  constructor(
    private commonMasterService: CommonFunctionService,
    private GetRollService: GetRollService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private swal2: SweetAlert2,
    private toastr: ToastrService,
    private sMSMailService: SMSMailService,
    private modalService: NgbModal,
    private routers: Router
  ) {}

  async ngOnInit() {
    this.SearchForm = this.formBuilder.group({
      ddlInstitute: [''],
      ddlSemester: [''],
      ddlStream: [''],
      ddlStudentTypeID: [''],
    });

    this.sSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );

    this.selectedEndTermID = Number(this.route.snapshot.queryParamMap.get("EndTermID") ?? 0);
    this.currentStatus = Number(this.route.snapshot.queryParamMap.get("Status") ?? 0);
    this.currentTab = Number(this.route.snapshot.queryParamMap.get("tab") ?? 0);


    this.MobileNo = Number(this.sSOLoginDataModel.Mobileno ?? 0);
    this.UserID = this.sSOLoginDataModel.UserID;

    this.GetPageName(this.currentTab);

      this.GetAllData();
    this.getSemesterMasterList();
    this.getStreamMasterList();
    this.ddlStream_Change();
  
    this.getInstituteMasterList();

  
   
  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllData() {
    try {
      this.isSubmitted = true;
      if (this.SearchForm.invalid)
      {
        return;
      }
      this.StudentList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.ShowAll = this.selectedEndTermID > 0 ? 1 : 0;
      this.searchRequest.Status = this.currentStatus;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;

 
      //call
      await this.GetRollService.GetPublishedRollData(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
           
            this.loadInTable();
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
     
    }
  }

  async getInstituteMasterList() {
    try {
    
      await this.commonMasterService
        .InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data.Data;
        });
    } catch (error) {
      console.error(error);
    } finally {
      
    }
  }

  async ddlStream_Change() {
    try {
      
      await this.commonMasterService
        .SubjectMaster_StreamIDWise(
          this.searchRequest.StreamID,
          this.sSOLoginDataModel.DepartmentID,
          this.searchRequest.SemesterID
        )
        .then(
          (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.SubjectMasterDDLList = data.Data;
          },
          (error) => console.error(error)
        );
    } catch (Ex) {
      console.log(Ex);
    } finally {
     
    }
  }

  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
      });

      await this.commonMasterService.StudentType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentTypeList = data['Data'];
          console.log("StudentTypeList", this.StudentTypeList)
        }, (error: any) => console.error(error));

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new GenerateRollSearchModel();

    this.SubjectMasterDDLList = [];
    this.GetAllData()
  }
  
  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(
      this.totalInTableRecord / parseInt(this.pageInTableSize)
    );
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex =
      (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex =
      this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex =
      this.endInTableIndex > this.totalInTableRecord
        ? this.totalInTableRecord
        : this.endInTableIndex;
    this.paginatedInTableData = [...this.StudentList].slice(
      this.startInTableIndex,
      this.endInTableIndex
    );
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
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
    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (
      this.currentInTablePage <= 0 ||
      this.currentInTablePage > this.totalInTablePage
    ) {
      this.currentInTablePage = 1;
    }
    if (
      this.currentInTablePage > 0 &&
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = []; //copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StudentList.length;
  }

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  get totalInTableSelected(): number {
    return this.StudentList.filter((x) => x.Selected)?.length;
  }

  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  // end table feature

  exportToExcel(): void {
    // Define the columns in the exact order you want for the export
    const columnOrder = [
      'SrNo', 'StudentName', 'FatherName', 'DOB', 'InstituteName', 'StreamName', 'SemesterName', 'EnrollmentNo', 'RollNumber',
    ];

    // Define the list of columns to exclude from the export
    const unwantedColumns = [
      'StudentID', 'dob_org', 'StreamID', 'SemesterID', 'InstituteID', 'InstituteCode', 'streamCode', 'MobileNo', 'EndTermID',
    ];

    // Filter the data based on unwanted columns and map it to the correct order
    const filteredData = this.StudentList.map((item: any, index: number) => {
      const filteredItem: any = {};

      // Manually order the columns based on the columnOrder array
      columnOrder.forEach((column, idx) => {
        // Add 'SrNo' as the first column (index + 1 for numbering)
        if (column === 'SrNo') {
          filteredItem[column] = index + 1;
        } else if (item[column] && !unwantedColumns.includes(column)) {
          filteredItem[column] = item[column];
        }
      });

      return filteredItem;
    });

    // Create worksheet from filtered data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Calculate column widths based on max length of content in each column
    const columnWidths = columnOrder.map((column) => ({
      wch:
        Math.max(
          column.length, // Header length
          ...filteredData.map((item: any) =>
            item[column] ? item[column].toString().length : 0
          ) // Max content length
        ) + 2, // Add extra padding
    }));

    // Apply column widths
    ws['!cols'] = columnWidths;

    // Apply header styling (bold + background color)
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1'; // First row (headers)
        if (!ws[cellAddress]) continue;

        // Bold the header text and apply a background color
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } }, // Bold text, white color
          fill: { fgColor: { rgb: '#f3f3f3' } }, // Light background color
          alignment: { horizontal: 'center', vertical: 'center' }, // Center-align text
        };
      }
    }

    // Create a new workbook and append the sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the file as "GeneratedRollNumber.xlsx"
    XLSX.writeFile(wb, 'PublishedRollNumberData.xlsx');
  }


  VerifyRollNumber()
  {
    if (this.paginatedInTableData?.length > 0) {

      if (this.ddlRollListStatus > 0) {
        //if (this.ddlRollListStatus == EnumRollNoStatus.Reverted) {
        //  this.swal2.Confirmation("Are you sure you want to revert roll no list?", async (result: any) => {
        //    // Check if the user confirmed the action
        //    if (result.isConfirmed) {
        //      this.ChangeRollNoStatus("_RevertVerify", EnumRollNoStatus.Reverted);
        //    }
        //  });
        //}

        if (this.ddlRollListStatus == EnumRollNoStatus.Reverted) {
          Swal.fire({
            title: 'Revert Roll No List',
            input: 'textarea',
            inputLabel: 'Remark',
            inputPlaceholder: 'Enter your remark here...',
            inputAttributes: {
              'aria-label': 'Type your remark here'
            },
            showCancelButton: true,
            confirmButtonText: 'Save Remark',
            cancelButtonText: 'Cancel'
          }).then(async (result: any) => {
            if (result.isConfirmed && result.value?.trim()) {
              const remark = result.value.trim();
              await this.ChangeRollNoStatus("_RevertVerify", EnumRollNoStatus.Reverted, remark);
            } else if (result.isConfirmed && !result.value?.trim()) {
              this.toastr.warning('Remark is required.');
            }
          });
        }



        if (this.ddlRollListStatus == EnumRollNoStatus.Verified) {

          if (this.currentStatus == EnumRollNoStatus.Published) {

            this.swal2.Info('The roll number has already been published and cannot be verified again.');

          }
          else {
            this.swal2.Confirmation("Are you sure you want to verified roll no?", async (result: any) => {
              // Check if the user confirmed the action
              if (result.isConfirmed) {

                this.openModalGenerateOTP(this.modal_GenrateOTP);
              }
            });
          }
          //this.ChangeRollNoStatus("_UpdateStatusVerify", EnumRollNoStatus.Verified);
        }

      }
      else
      {
        this.toastr.error('please select status')
      }
    }
    else
    {
      this.toastr.warning('No Record Found');
    }
  }

  async ChangeRollNoStatus(action: string, Status: number, remark: string) {
    
    try {
      this.StudentList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.Status = Status;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.action = action;
      this.searchRequest.Remark = remark;
      this.loaderService.requestStarted();
      //call
      await this.GetRollService.ChangeRollNoStatus(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.CloseOTPModal();
            this.toastr.success('Status Changed Successfully');


            setTimeout(() =>
            {
              this.routers.navigate(['/dashboard']);
            }, 200);
           

          }
          else {
            this.toastr.error(data.Message);
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
          //Call Function
          this.ChangeRollNoStatus("_UpdateStatusVerify", EnumRollNoStatus.Verified, this.searchRequest.Remark);
        
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

  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      //this.sSOLoginDataModel.Mobileno = "7737348604";
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



  //Start Section Model
  async openModalGenerateOTP(content: any) {
    this.resetOTPControls();
/*    console.log(this.sSOLoginDataModel.Mobileno, "MobileNo")*/
 
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

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


  CloseOTPModal() {

    this.modalService.dismissAll();
  }

  async GetVerifyRollData() {
    try {
      this.RollStatusList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.action = "_GenerateRollNumbers"
      this.searchRequest.Status = EnumRollNoStatus.Forwarded;
      this.searchRequest.StatusID = EnumRollNoStatus.Generated;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.loaderService.requestStarted();
      //call
      await this.GetRollService.GetVerifyRollData(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.RollStatusList = data['Data'];

            if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge) {
              this.Isverified = data['Data']['IsExaminationVerified']
            } else if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar) {
              this.Isverified = data['Data']['IsRegistrarVerified']
            }


            console.log(this.RollStatusList,"RollList")
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  GetPageName(tabno: number)
  {
    if (tabno == 1) {
      this.PageNameTitile='Pending For Verification'
    }
    else if (tabno == 2)
    {
      this.PageNameTitile = 'Verified Roll Number List'
    }
    else if (tabno == 3)
    {
      this.PageNameTitile = 'Reverted Roll Number List'
    }
    else if (tabno == 4)
    {
      this.PageNameTitile = 'Published Roll Number List'
    }
    else
    {
      this.PageNameTitile = 'Roll Number List'
    }
  }

}
