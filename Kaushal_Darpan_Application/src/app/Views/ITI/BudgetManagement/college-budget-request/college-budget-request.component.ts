import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { BudgetRequestModel } from '../../../../Models/ITI/BudgetDistributeDataModel';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { BudgetDistributedService } from '../../../../Services/BudgetDistributed/budget-distributed.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../../../Common/appsetting.service';

@Component({
  selector: 'app-college-budget-request',
  templateUrl: './college-budget-request.component.html',
  styleUrl: './college-budget-request.component.css',
  standalone: false,
})
export class CollegeBudgetRequestComponent implements OnInit {
  public BudgetRequestForm!: FormGroup;
  public BudgetModel = new BudgetRequestModel();
  public ssoLoginDataModel = new SSOLoginDataModel();
  modalService = inject(NgbModal);
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public file!: File;
  public Uploadfile: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private loaderService: LoaderService,
    private budgetDistributedService: BudgetDistributedService,
    private commonFunctionService: CommonFunctionService,
    private appsettingConfig: AppsettingService,
       ) { }

  ngOnInit() {
    // ✅ Initialize the form BEFORE it's used
    this.BudgetRequestForm = this.formBuilder.group({
      Amount: ['', Validators.required],
      Remark: ['', Validators.required],
      DocFileName: ['', Validators.required]
    });

    const storedData = localStorage.getItem('SSOLoginUser');
    if (storedData) {
      this.ssoLoginDataModel = JSON.parse(storedData);
    }
  }

  get _BudgetRequestForm() { return this.BudgetRequestForm.controls; }

  async SaveData() {
    debugger
    this.isSubmitted = true;

    if (!this.BudgetModel.DocFileName || this.BudgetModel.DocFileName.trim() === '') {
      this.toastr.error('Please fill all required fields.');
      return;
    }

    if (this.BudgetRequestForm.invalid) {
      return console.log("error");
    }

    try {
      this.BudgetModel.UserID = this.ssoLoginDataModel.UserID;
      this.BudgetModel.FinYearID = this.ssoLoginDataModel.FinancialYearID;
      this.BudgetModel.RoleId = this.ssoLoginDataModel.EndTermID;
      this.BudgetModel.DepartmentID = this.ssoLoginDataModel.DepartmentID;
      this.BudgetModel.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
      this.BudgetModel.CollegeId = this.ssoLoginDataModel.InstituteID;
      this.BudgetModel.Action = "Insert";
      console.log("request at saveData", this.BudgetModel)
      await this.budgetDistributedService.SaveBudgetRequest(this.BudgetModel)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            setTimeout(() => {
              this.router.navigate(['/budgetrequeststatus']);
            }, 1300);
            this.ResetControl();
          } else {
            this.toastr.error(data.ErrorMessage)
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

  async onFilechange(event: any) {
    debugger;
    try {


      this.file = event.target.files[0];
      if (this.file) {

        // Type validation
        if (['application/pdf'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select Only pdf file');
          //const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          //if (fileInput) {
          // fileInput.value = '';  // clear FileInput
          //}
          this.Uploadfile = '';
          this.BudgetModel.RequestFileName = '';
          event.target.value = null;
          return;
        }

        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITI/BudgetRequest";

        //Upload to server folder
        await this.commonFunctionService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {

              const fileName = data['Data'][0]["Dis_FileName"];
              const actualFile = data['Data'][0]["FileName"];

              this.Uploadfile = data['Data'][0]["FileName"];
              this.BudgetModel.RequestFileName = this.Uploadfile;
              this.BudgetModel.DocFileName = this.Uploadfile;
            }

            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async ResetControl() {
    debugger;
    this.isSubmitted = false;
    this.BudgetModel.Remarks = '';
    this.BudgetModel.RequestAmount = 0;
    this.BudgetModel.RequestFileName = '';
    this.BudgetModel.Dis_FilePath = '';
    this.BudgetRequestForm.reset()
  }
  onDecimalInput(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9.]/g, '');

    // Optional: prevent multiple dots
    const parts = input.value.split('.');
    if (parts.length > 2) {
      input.value = parts[0] + '.' + parts.slice(1).join('');
    }
  }
}
