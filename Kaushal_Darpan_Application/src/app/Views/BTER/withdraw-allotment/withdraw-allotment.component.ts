import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants, EnumCourseType, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { BterStudentsJoinStatusMarksMedel, BterStudentsJoinStatusMarksSearchModel } from '../../../Models/BterStudentJoinStatusDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentsJoiningStatusMarksDataMedels } from '../../../Models/StudentsJoiningStatusMarksDataMedels';
import { BterStudentsJoinStatusMarksService } from '../../../Services/BterStudentJoinStatus/Student-join-status-mark.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-withdraw-allotment',
  standalone: false,
  templateUrl: './withdraw-allotment.component.html',
  styleUrl: './withdraw-allotment.component.css'
})
export class WithdrawAllotmentComponent {
  public State: number = -1;
  RemarkFormGroup!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  request = new BterStudentsJoinStatusMarksMedel()
  public searchRequest = new BterStudentsJoinStatusMarksSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';  
  public AllotmentId: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudentsJoiningStatusMarksList: any[] = [];
  public StudentsJoiningStatusMarksDetails: any[] = [];
  public StreamList: any[] = [];
  public AllotmentTypeList: any[] = [];
  public courseTypeList: any[] = [];
  public IsStatusMark: boolean = false;
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  public StreamType: string = ''
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any;
  public Remark: string = '';

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;


  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private StudentsJoiningStatusMarksService: BterStudentsJoinStatusMarksService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService,
    private route: ActivatedRoute,
    private Swal2: SweetAlert2) {
  }


  async ngOnInit() {

    this.RemarkFormGroup = this.fb.group(
      {
        Remark: ['', Validators.required]
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.loadDropdownData('AllotmentType')


    this.searchRequest.CourseTypeId = Number(this.route.snapshot.paramMap.get('id') ?? 0);

    this.courseTypeList = this.commonMasterService.ConvertEnumToList(EnumCourseType);
    if (this.searchRequest.CourseTypeId > 0) {
      this.StreamType = this.courseTypeList.find((e: any) => e.value == this.searchRequest.CourseTypeId)?.key || null;

    }
  }
  get _groupForm() { return this.RemarkFormGroup.controls; }


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

  async getStudentsJoiningStatusMarksList(i: any) {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.CollegeId = this.sSOLoginDataModel.InstituteID;
      await this.StudentsJoiningStatusMarksService.GetWithdrawAllotmentData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentsJoiningStatusMarksList = data['Data'];

          this.totalRecord = this.StudentsJoiningStatusMarksList[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

          console.log(this.StudentsJoiningStatusMarksList, "StudentsJoiningStatusMarksList")
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


  onCancel(): void {
    this.searchRequest.StreamId = 0;
    this.searchRequest.ApplicationID = 0;
    this.searchRequest.CourseTypeId = 0
    this.searchRequest.AllotmentMasterId = 0
    this.StudentsJoiningStatusMarksList = [];
  }

  async addStatusMark(content: any, ID: number) {
    this.IsStatusMark = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
    });

  }

  CloseAddStatusMark() {
    this.modalService.dismissAll();
  }

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
    const filteredData = this.StudentsJoiningStatusMarksList.map((item: any) => {
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
    XLSX.writeFile(wb, 'StudentsJoiningStatusMarksList.xlsx');
  }



  async saveData() {
    
    this.isSubmitted = true;
    console.log(this.Remark, 'Remark');
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      this.isSubmitted = true;
      if (this.RemarkFormGroup.invalid) {
        return
      }
      this.request.AllotmentId = this.StudentsJoiningStatusMarksList[0].AllotmentId;
      await this.StudentsJoiningStatusMarksService.SaveWithdrawData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            setTimeout(() => {
              this.toastr.success(this.Message)
              this.searchRequest.AllotmentId = 0;
              this.CloseAddStatusMark();
              this.ResetControl();
              this.getStudentsJoiningStatusMarksList(1);
            }, 200);
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message);
            this.searchRequest.AllotmentId = 0;
            this.CloseAddStatusMark();
            this.ResetControl();
            this.getStudentsJoiningStatusMarksList(1);
          }
          else {
            this.toastr.error(this.ErrorMessage);
            this.CloseAddStatusMark();
            this.searchRequest.AllotmentId = 0;
            this.ResetControl();
            this.getStudentsJoiningStatusMarksList(1);
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

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new StudentsJoiningStatusMarksDataMedels();
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.RemarkFormGroup.reset();
    this.RemarkFormGroup.patchValue({

      code: '',

    });
  }


  CloseModal() {

    this.modalService.dismissAll();
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.getStudentsJoiningStatusMarksList(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentsJoiningStatusMarksList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.getStudentsJoiningStatusMarksList(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.getStudentsJoiningStatusMarksList(3)
    }
  }


}
