import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ITIPlanningBankGuarantee } from '../../../../Models/ItiPlanningDataModel';
import { ITIsService } from '../../../../Services/ITIs/itis.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-ITI-BankGuarantee',
  standalone: false,
  templateUrl: './ITI-BankGuarantee.component.html',
  styleUrl: './ITI-BankGuarantee.component.css'
})


export class ITIBankGuaranteeComponent implements OnInit {
  bankGuarantee!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = -1;
  public UserID: number = 0;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new ITIPlanningBankGuarantee();
  public CollegeId: number = 0;
  UploadFileModel = new UploadFileModel();
  public CollageId: number = 0;
  public InstituteID: number = 0;
  public BankGuaranteeId: number = 0;
  public status: string = '';
  public isAction: string = '';
  public BankList: any = [];
  public BankGuranteeAmount: any = [];

  public CollegeID: number = 0;
  public CampusValidationListData: any = [];
  public ITItypeID: number = 0;
  public ApprovedStatus: number = 0;
  public AllCompanyMasterList: any[] = [];
  public CompanyMasterList: any = [];
  public cal: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private campusPostService: ITIsService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private http: HttpClient,
    private documentDetailsService: DocumentDetailsService
  ) { }

  async ngOnInit() {

    this.bankGuarantee = this.formBuilder.group({
      BankName: [''],
      BankGuaranteeNumber: ['', Validators.required],
      dateOfIssue: ['', Validators.required],
      maturityDate: ['', Validators.required],
      //duration: ['', Validators.required],
      duration: [{ value: '', disabled: true }],
      amount: [{ value: '', disabled: true }],
      BankAgreementDocument: [''],
      Remarks: [''],
      CollageId: ['0', DropdownValidators],
      BankID: ['0', DropdownValidators]
    });

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetPrivateITICollege();
    await this.bankGuaranteeList('BankDetailsList');
    await this.bankGuaranteeAmount();
    await this.calculateDuration();
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.BankGuaranteeId = +id;
        this.getBankGuaranteeById(this.BankGuaranteeId);
      }
    });

    // For ReNew
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.BankGuaranteeId = +id;
        this.getBankGuaranteeById(this.BankGuaranteeId);
      }
    });
    // query param (status)
    this.activatedRoute.queryParams.subscribe(params => {
      this.status = params['status'];  
    });
    
  }

  calculateDuration() {
    const issueDate = this.bankGuarantee.get('dateOfIssue')?.value;
    const maturityDate = this.bankGuarantee.get('maturityDate')?.value;

    console.log('From date====>', issueDate)
    console.log('TO date====>',maturityDate)

    if (issueDate && maturityDate) {
      const d1 = new Date(issueDate);
      const d2 = new Date(maturityDate);

      const diffTime = d2.getTime() - d1.getTime();

      if (diffTime < 0) {
        alert('Maturity date should be greater than Date of Issue');
        this.bankGuarantee.patchValue({ duration: '' });
        return;
      }

      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      this.bankGuarantee.patchValue({
        duration: diffDays + ' Days'
      });
    }
  }


  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.split('T')[0]; 
  }


  async getBankGuaranteeById(BankGuaranteeID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();

      await this.campusPostService.ITIPlanningBankGuaranteeGetByID(BankGuaranteeID)   
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          const record = data.Data[0];
          this.request = record;
          console.log('main data ===>',this.request)
          this.bankGuarantee.patchValue({
            BankName: record.BankName,
            BankGuaranteeNumber: record.BankGuaranteeNumber,
            dateOfIssue: this.formatDate(record.DateOfIssue),
            maturityDate: this.formatDate(record.Maturitydate),
            duration: record.Duration,
            amount: record.Amount,
            BankAgreementDocument: record.BankAgreementDocument,
            Remarks: record.Remarks,
            CollageId: record.CollageId
          });
        });

    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  get form() { return this.bankGuarantee.controls; }

  async saveData() {
    debugger;
    this.isSubmitted = true;
    if (this.bankGuarantee.invalid) {
      return;
    }

    this.isLoading = true;
    this.loaderService.requestStarted();

    this.request.CollageId = this.request.CollageId;
    this.request.FinYearId = this.sSOLoginDataModel.FinancialYearID;

    if (this.status == 'ReNew')
    {
      this.request.ActionType = 'ReNew';
    }
    else {
      this.request.ActionType = '';
    }

   
    const isUpdate = this.request.BankGuaranteeID && this.request.BankGuaranteeID > 0;

    try {
      const data: any = await this.campusPostService.SaveBankGuaranteeData(this.request);

      this.State = data.State;
      this.Message = data.Message;
      this.ErrorMessage = data.ErrorMessage;

      if (this.State === EnumStatus.Success) {

        const successMsg = isUpdate
          ? 'Bank Guarantee updated successfully'
          : 'Bank Guarantee saved successfully';

        this.toastr.success(successMsg);
        this.routers.navigate(['/iti-bank-guarantee-list']);
      }
      else {
        this.toastr.error(this.ErrorMessage);
      }

    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  


  public file!: File;
  async onFilechange(event: any, Type: string) {
    
    try {
      this.UploadFileModel.FolderName = '/ITI/Planing/BankGuarantee'
      this.file = event.target.files[0];
      if (this.file) {
        this.loaderService.requestStarted();
        
        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "bankDocument") {
                this.request.BankAgreementDocument = data['Data'][0]["FileName"];
              }
              
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


  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ResetControl() {

    this.isSubmitted = false;
    this.bankGuarantee.reset();
  }

  openDatePicker(event: any) {
    event.target.showPicker();
  }


  

  trackById(index: number, item: any): number {
    return item.ID;
  }

  async GetPrivateITICollege() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService
        .GetCommonMasterData('PrivateITICollege', 5)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.AllCompanyMasterList = data['Data'];
          this.CompanyMasterList = this.AllCompanyMasterList;

          this.CollegeID = 0; //  default select
          this.request.CollageId = 0;
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  
  async bankGuaranteeList(MasterCode: string): Promise<void> {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'BankDetailsList':
          this.BankList = data['Data'];
          console.log(this.BankList, "datatatata")
          break;
        default:
          break;
      }
    });
  }

  async bankGuaranteeAmount() {
    this.commonMasterService.GetCommonMasterData('BankGurantee', this.request.CollageId).then((data: any) => {
      debugger
      this.request.amount = data['Data'][0]['Name'];
    });
  }

  

}
