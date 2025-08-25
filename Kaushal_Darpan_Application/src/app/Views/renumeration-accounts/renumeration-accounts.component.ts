import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { GlobalConstants, EnumRenumerationExaminer, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { RenumerationJDRequestModel, RenumerationJDModel, RenumerationJDSaveModel } from '../../Models/RenumerationJDModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { RenumerationJdService } from '../../Services/renumeration-jd/renumeration-jd.service';
import { RenumerationAccountsModel, RenumerationAccountsRequestModel, RenumerationAccountsSaveModel } from '../../Models/RenumerationAccountsModel';
import { RenumerationAccountsService } from '../../Services/renumeration-accounts/renumeration-accounts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../Services/Loader/loader.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { ReportService } from '../../Services/Report/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-renumeration-accounts',
  standalone: false,
  templateUrl: './renumeration-accounts.component.html',
  styleUrl: './renumeration-accounts.component.css'
})

export class RenumerationAccountsComponent implements OnInit {
  public Message: any = [];
  public State: number = -1;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public AllInTableSelect: boolean = false;

  public RenumerationAccountsRequest = new RenumerationAccountsRequestModel();
  public RenumerationAccountsList: RenumerationAccountsModel[] = [];
  public RenumerationAccountsSave: RenumerationAccountsSaveModel[] = [];
  public AccountsSave = new RenumerationAccountsSaveModel();
  public requestAddMore = new RenumerationAccountsSaveModel();
  public minDate: string = '';
  public _GlobalConstants = GlobalConstants;
  public _EnumRenumerationExaminer = EnumRenumerationExaminer;
  AddMoreFormGroup!: FormGroup;
  AccountsFormGroup!: FormGroup;
  closeResult: string | undefined;
  public pdfUrl: SafeResourceUrl | null = null;
  public showPdfModal = false;
  showBillGeneratedDate: boolean = false;



  constructor(private commonMasterService: CommonFunctionService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRouter: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private renumerationAccountsService: RenumerationAccountsService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private sanitizer: DomSanitizer,
  ) {
  }

  async ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    this.AddMoreFormGroup = this.formBuilder.group(
      {
        TVNo: ['',],
        // VoucherNo: [''],
        ClearDate: [''],
        Remarks: ['',],
        BillStatus: ['',]
      });

    this.AccountsFormGroup = this.formBuilder.group({
        
        IsBillGenerated: [''],
        BillGeneratedDate: [''],

      });

    // login session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.GetAllData();
  }

  get _AccountsFormGroup() { return this.AccountsFormGroup.controls; }
  get _AddMoreFormGroup() { return this.AddMoreFormGroup.controls; }


  async EditAccountsData(content: any, RenumerationExaminerID: number) {
    //
    ////this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.AccountsSave.RenumerationExaminerID = RenumerationExaminerID
  }

  async AddMoreAccountsData(content: any, RenumerationExaminerID: number) {
    //
    ////this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.requestAddMore.RenumerationExaminerID = RenumerationExaminerID
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

  async CloseViewAccountsDetails() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.isSubmitted = false;
      this.modalService.dismissAll();
      this.AccountsFormGroup.reset();
      this.AccountsSave.BillStatus = 0;
      this.loaderService.requestEnded();
      //window.location.reload();
    }, 200);
  }

  async CloseViewAddMore() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.isSubmitted = false;
      this.modalService.dismissAll();
      this.AddMoreFormGroup.reset();
      this.requestAddMore.BillStatus = 0;
      this.loaderService.requestEnded();
      //window.location.reload();
    }, 200);
  }

  async CancelAccountsDetails() {
    this.AccountsFormGroup.reset();
    this.CloseViewAccountsDetails();
  }

  async CancelAddMoreDetails() {
    this.AddMoreFormGroup.reset();
    this.CloseViewAddMore();
  }


  async GetAllData() {
    try {
      if (this.RenumerationAccountsRequest.RenumerationExaminerStatusID == 0) {
        this.RenumerationAccountsRequest.RenumerationExaminerStatusID = this._EnumRenumerationExaminer.ApprovedAndSendtoAccounts;
      }
      //
      this.RenumerationAccountsRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.RenumerationAccountsRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.RenumerationAccountsRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.RenumerationAccountsRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RenumerationAccountsRequest.RoleID = this.sSOLoginDataModel.RoleID;
      //call
      await this.renumerationAccountsService.GetAllData(this.RenumerationAccountsRequest)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
          else {
            this.AllInTableSelect = false;
            this.RenumerationAccountsList = data.Data;
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async SaveDataApprovedFromAccounts() {
    //
    try {
      
      this.isSubmitted = true;
      if (this.AddMoreFormGroup.invalid) {
        console.log(this.AddMoreFormGroup.value);
        return;
      }
      this.requestAddMore.SSOID = this.sSOLoginDataModel.SSOID;
      this.requestAddMore.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestAddMore.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.requestAddMore.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestAddMore.RoleID = this.sSOLoginDataModel.RoleID;
      this.requestAddMore.UserId = this.sSOLoginDataModel.UserID;
      await this.renumerationAccountsService.SaveDataApprovedFromAccounts(this.requestAddMore)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
            this.isSubmitted = false;
            this.AccountsSave.BillStatus = 0;
          }
          else {
            this.toastr.success("Save successfully.");
            this.CancelAddMoreDetails();
            await this.GetAllData();
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async UpdateDataApprovedFromAccounts() {
    //
    try {
      //
      this.isSubmitted = true;
      
      if(this.AccountsSave.IsBillGenerated==1) {
        if (this.AccountsFormGroup.invalid) {
          console.log(this.AccountsFormGroup.value);
          return;
        }
      }

      this.AccountsSave.SSOID = this.sSOLoginDataModel.SSOID;
      this.AccountsSave.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.AccountsSave.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.AccountsSave.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.AccountsSave.RoleID = this.sSOLoginDataModel.RoleID;
      this.AccountsSave.UserId = this.sSOLoginDataModel.UserID;

      await this.renumerationAccountsService.UpdateDataApprovedFromAccounts(this.AccountsSave)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
            this.isSubmitted = false;
            this.AccountsSave.BillStatus = 0;
          }
          else {
            this.toastr.success("Save successfully.");
            this.CancelAccountsDetails();
            await this.GetAllData();
            window.location.reload();
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }
  
}
