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
      BankName: ['', Validators.required],
      BankGuaranteeNumber: ['', Validators.required],
      dateOfIssue: ['', Validators.required],
      maturityDate: ['', Validators.required],
      duration: ['', Validators.required],
      amount: [0, Validators.required],
      BankAgreementDocument: [''],
      Remarks: ['']
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.BankGuaranteeId = +id;
        this.getBankGuaranteeById(this.BankGuaranteeId);
      }
    });
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
            Remarks: record.Remarks
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

    this.request.CollageId = this.sSOLoginDataModel.InstituteID;
    this.request.FinYearId = this.sSOLoginDataModel.FinancialYearID;

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

}
