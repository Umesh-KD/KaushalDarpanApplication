/// <reference path="iti-add-consent.module.ts" />
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CenterMasterDDLDataModel, ITI_InspectionSearchModel, ConsentModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { EnumInspectionDeploymentType, EnumStatus } from '../../../../Common/GlobalConstants';
import { Router } from '@angular/router';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-iti-add-consent',
  standalone: false,
  templateUrl: './iti-add-consent.component.html',
  styleUrl: './iti-add-consent.component.css'
})
export class ITIAddConsentComponent {

  public sSOLoginDataModel = new SSOLoginDataModel();
  StreamMasterDDL: any = [];
  SemesterMasterDDL: any = [];
  DistrictMasterDDL: any = [];
  ZoneMasterDDL: any = [];
  InstituteMasterDDL: any = [];
  ExaminerDDL: any = [];
  consentDeployList: ConsentModel[] = [];
  consentRequest: ConsentModel[] = [];
  public consentDeploy = new ConsentModel();
  searchRequest = new ITI_InspectionSearchModel();
  consentFromGroup!: FormGroup;
  isSubmitted: boolean = false;
  isFormSubmitted: boolean = false;
  requestCenter = new CenterMasterDDLDataModel();
  _EnumInspectionDeploymentType = EnumInspectionDeploymentType;
  DeploymentTypeList: any = []
  showRemark: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private itiInspectionService: ITIInspectionService,
    private router: Router,
    private commonMasterService: CommonFunctionService,
  ){}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.consentFromGroup = this.fb.group({
      DistrictID: ['', [DropdownValidators]],
      InstituteID: ['', [DropdownValidators]],
      TentativeDate: [''],
      consentTypeID: ['', [DropdownValidators]],
      txtAmount: [''],
      txtRemark: ['']
    });
    this.getMasterData();
    this.calculateAmount()
  }

  
  get _consentFromGroup() { return this.consentFromGroup.controls;}

  async getMasterData() {
    try {
      this.searchRequest.LevelId = this.sSOLoginDataModel.LevelId;
      this.searchRequest.DistrictID = this.sSOLoginDataModel.DistrictID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      await this.itiInspectionService.GetDistrictMaster(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
        console.log('District ==>', this.DistrictMasterDDL)
      })

    } catch (error) {
      console.error(error);
    }
  }

  GetInstituteMaster_ByDistrictWise(ID: any) {
    this.requestCenter.action = 'GetInstituteMaster_ByDistrictWise'
    this.requestCenter.DistrictID = ID;
    this.itiInspectionService.GetITIInspectionDropdown(this.requestCenter).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL", this.InstituteMasterDDL)
    })
  }


  GetZoneMaster(ID: any) {
    this.requestCenter.action = 'GetZone'
    this.requestCenter.DistrictID = ID;
    this.itiInspectionService.GetITIInspectionDropdown(this.requestCenter).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL", this.InstituteMasterDDL)
    })
  }

  async DeleteRow(item: ConsentModel) {
    const index: number = this.consentDeployList.indexOf(item);
    if (index != -1) {
      this.consentDeployList.splice(index, 1)
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.consentDeploy = new ConsentModel()

    this.InstituteMasterDDL = [];
  }

  //async AddDeployment() {
  //  debugger
  //  this.isSubmitted = true;
  //  if (this.consentFromGroup.invalid) {
  //    return;
  //  }
  //  const isDuplicate = this.consentDeployList.some(
  //    (element: any) => this.consentDeploy.InstituteID === element.InstituteID
  //  );
  //  if (isDuplicate) {
  //    this.toastr.error('College Already Listed!');
  //    return;
  //  }
  //  this.consentDeploy.InstituteName = this.InstituteMasterDDL.find(
  //    (x: any) => x.Id == this.consentDeploy.InstituteID
  //  )?.Name;
  //  this.consentDeploy.DistrictName = this.DistrictMasterDDL.find(
  //    (x: any) => x.ID == this.consentDeploy.DistrictID
  //  )?.Name;
  //  this.consentDeploy.consentTypeID = Number(this.consentDeploy.consentTypeID);
  //  this.consentDeployList.push({ ...this.consentDeploy });

  //  this.consentDeploy = new ConsentModel();
  //  this.isSubmitted = false;
  //  console.log('Bind List ==>',this.consentDeployList)
  //}


  

  async AddDeployment() {
    this.isSubmitted = true;
    this.consentFromGroup.markAllAsTouched();

    if (this.consentFromGroup.invalid) {
      return;
    }

    const isDuplicate = this.consentDeployList.some(
      (element: any) => this.consentDeploy.InstituteID === element.InstituteID
    );

    if (isDuplicate) {
      this.toastr.error('College Already Listed!');
      return;
    }

    //  ADD THIS LINE (MOST IMPORTANT)
   // this.consentDeploy.Amount = this.currentAmount;

    this.consentDeploy.InstituteName = this.InstituteMasterDDL.find(
      (x: any) => x.Id == this.consentDeploy.InstituteID
    )?.Name;

    this.consentDeploy.DistrictName = this.DistrictMasterDDL.find(
      (x: any) => x.ID == this.consentDeploy.DistrictID
    )?.Name;

    this.consentDeploy.consentTypeID = Number(this.consentDeploy.consentTypeID);

    // push data
    this.consentDeployList.push({ ...this.consentDeploy });

    const remarkControl = this.consentFromGroup.get('txtRemark');

    // reset model
    this.consentDeploy = new ConsentModel();

    //  reset TS amount also
    //this.currentAmount = 2000;

    this.consentDeploy.Amount = 2000;
    this.consentDeploy.Remark = '';

    this.showRemark = false;

    // reset validation
    remarkControl?.clearValidators();
    remarkControl?.setValue('');
    remarkControl?.updateValueAndValidity();

    // reset form
    this.consentFromGroup.patchValue({
      txtAmount: 2000,
      txtRemark: ''
    });

    this.isSubmitted = false;

    console.log('Bind List ==>', this.consentDeployList);
  }


  async SaveData() {
    debugger
    if (!this.consentDeployList || this.consentDeployList.length === 0) {
      this.toastr.error("Please Add At Least One Institute");
      return;
    }
    
    try {
      this.loaderService.requestStarted();

      this.consentDeployList = this.consentDeployList.map(item => ({
        ...item,
        UserID: this.sSOLoginDataModel.UserID,
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
        EndTermID: this.sSOLoginDataModel.EndTermID
      }));

      const data: any = await this.itiInspectionService.saveConsent(this.consentDeployList);

      if (data.State === EnumStatus.Success) {
        this.toastr.success(data.Message || "Consent saved successfully!");
        this.consentDeployList = [];
        this.InstituteMasterDDL = [];
        this.router.navigate(['/iti-consent']);
      } else {
        this.toastr.error(data.ErrorMessage || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      this.toastr.error("An error occurred while saving consent");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  openDatePicker(event: any) {
    event.target.showPicker();
  }

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }



  
  onAmountChange() {
    const amount = Number(this.consentDeploy.Amount);
    const remarkControl = this.consentFromGroup.get('txtRemark');

    if (amount !== 2000) {
      this.showRemark = true;
      remarkControl?.setValidators([Validators.required]);
    } else {
      this.showRemark = false;
      remarkControl?.clearValidators();
      remarkControl?.setValue('');
      this.consentDeploy.Remark = '';
    }

    remarkControl?.updateValueAndValidity();
  }


  async calculateAmount() {
    debugger
    this.commonMasterService.GetCommonMasterData('consentAmount', this.consentDeploy.InstituteID).then((data: any) => {
      debugger
      this.consentDeploy.Amount = data['Data'][0]['Name'];
    });
  }


}
