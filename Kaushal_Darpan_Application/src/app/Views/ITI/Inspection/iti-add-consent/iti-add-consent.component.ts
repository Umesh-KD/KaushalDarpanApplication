/// <reference path="iti-add-consent.module.ts" />
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITI_InspectionDataModel, InspectionMemberDetailsDataModel, InspectionDeploymentDataModel, CenterMasterDDLDataModel, ITI_InspectionSearchModel, ConsentModel, ConsentSearchModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { StaffMasterDDLDataModel } from '../../../../Models/CenterObserverDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { EnumInspectionDeploymentType, EnumStatus } from '../../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';

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
  ExamShiftDDL: any = [];
  InstituteMasterDDL: any = [];
  ExaminerDDL: any = [];
  consentDeployList: ConsentModel[] = [];
  consentRequest: ConsentModel[] = [];
  public request = new ITI_InspectionDataModel();
  public consentDeploy = new ConsentModel();
  searchRequest = new ITI_InspectionSearchModel();
  InspectionDeploymentFromGroup!: FormGroup;
  consentFromGroup!: FormGroup;
  isSubmitted: boolean = false;
  isFormSubmitted: boolean = false;
  showTeamInitials: boolean = true;
  public requestStaff = new StaffMasterDDLDataModel();
  requestTrade = new ItiTradeSearchModel()
  requestIti = new ItiCollegesSearchModel()
  CenterObserverTeamID: number = 0;
  requestCenter = new CenterMasterDDLDataModel();

  _EnumInspectionDeploymentType = EnumInspectionDeploymentType;
  DeploymentTypeList: any = []


  @Input() tabId: number = 0;
  InspectionConsentID: number = 0;
  today: Date = new Date();
  constructor(
    private commonMasterService: CommonFunctionService,
    private menuService: MenuService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private itiInspectionService: ITIInspectionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){}

  async ngOnInit() {
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    
    this.consentFromGroup = this.fb.group({
      DistrictID: ['', [DropdownValidators]],
      InstituteID: ['', [DropdownValidators]],
      TentativeDate: [''],
    })
    this.getMasterData();
  }

  get _consentFromGroup() { return this.consentFromGroup.controls;}

  async getMasterData() {
    debugger
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

  async AddDeployment() {
    this.isSubmitted = true;
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

    this.consentDeploy.InstituteName = this.InstituteMasterDDL.find(
      (x: any) => x.Id == this.consentDeploy.InstituteID
    )?.Name;

    this.consentDeploy.DistrictName = this.DistrictMasterDDL.find(
      (x: any) => x.ID == this.consentDeploy.DistrictID
    )?.Name;

    this.consentDeployList.push({ ...this.consentDeploy });

    this.consentDeploy = new ConsentModel(); 
    this.isSubmitted = false;
  }

  async SaveData() {
    debugger
    if (!this.consentDeployList || this.consentDeployList.length === 0) {
      this.toastr.error("Please Add At Least One Institute");
      return;
    }
    //this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
    //this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    //this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    
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
        this.consentDeployList = [];  // clear after save
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





}
