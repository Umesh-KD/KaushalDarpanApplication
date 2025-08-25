import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITI_ApprenticeshipDataModel, ApprenticeshipMemberDetailsDataModel, ApprenticeshipDeploymentDataModel, CenterMasterDDLDataModel } from '../../../../Models/ITI/ITI_ApprenticeshipDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { StaffMasterDDLDataModel } from '../../../../Models/CenterObserverDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ITIApprenticeshipService } from '../../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { EnumApprenticeshipDeploymentType, EnumStatus } from '../../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-apprenticeship-deployment',
  standalone: false,
  templateUrl: './apprenticeship-deployment.component.html',
  styleUrl: './apprenticeship-deployment.component.css'
})
export class ApprenticeshipDeploymentComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  StreamMasterDDL: any = [];
  SemesterMasterDDL: any = [];
  DistrictMasterDDL: any = [];
  ExamShiftDDL: any = [];
  InstituteMasterDDL: any = [];
  ExaminerDDL: any = [];
  AddedDeploymentList: ApprenticeshipDeploymentDataModel[] = [];
  public request = new ITI_ApprenticeshipDataModel();
  public requestDeploy = new ApprenticeshipDeploymentDataModel();
  public requestMember = new ApprenticeshipMemberDetailsDataModel();

  ApprenticeshipDeploymentFromGroup!: FormGroup;
  isSubmitted: boolean = false;
  isFormSubmitted: boolean = false;
  showTeamInitials: boolean = true;
  public requestStaff = new StaffMasterDDLDataModel();
  requestTrade = new ItiTradeSearchModel()
  requestIti = new ItiCollegesSearchModel()
  CenterObserverTeamID: number = 0;
  requestCenter = new CenterMasterDDLDataModel();

  _EnumApprenticeshipDeploymentType = EnumApprenticeshipDeploymentType;
  DeploymentTypeList: any = []

  @Input() tabId: number = 0;
  ApprenticeshipTeamID: number = 0;

  public IndustryName: string = '';
  public HeadName: string = '';
  public Designation: string = '';
  public Address: string = '';

  constructor(
    private commonMasterService: CommonFunctionService,
    private menuService: MenuService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private itiApprenticeshipService: ITIApprenticeshipService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){}

  async ngOnInit() {
     
    console.log('Received ID in ApprenticeshipDeploymentComponent:', this.tabId);
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.getMasterData();
    this.ApprenticeshipTeamID = this.activatedRoute.snapshot.queryParams['id'];
    console.log("this.ApprenticeshipTeamID",this.ApprenticeshipTeamID)
    if(this.ApprenticeshipTeamID != 0) {
      this.GetById_Deployment(this.ApprenticeshipTeamID);
    }

    this.ApprenticeshipDeploymentFromGroup = this.fb.group({
      IndustryName: ['', Validators.required],
      HeadName: ['', Validators.required],
      Designation: ['', Validators.required],
      Address: ['', Validators.required],
      // DeploymentType: ['', [DropdownValidators]],
      //DeploymentDateFrom: ['', Validators.required],
      //DeploymentDateTo: ['', Validators.required],
    })

    this.DeploymentTypeList = Object.keys(EnumApprenticeshipDeploymentType)
    .filter(key => !isNaN(Number(EnumApprenticeshipDeploymentType[key as any])))
    .map(key => ({
      id: EnumApprenticeshipDeploymentType[key as any],
      name: key
    }));
  }

  get _ApprenticeshipDeploymentFromGroup() { return this.ApprenticeshipDeploymentFromGroup.controls; }

  async getMasterData() {
    try {
      this.requestTrade.action='_getAllData'
      await this.commonMasterService.TradeListGetAllData(this.requestTrade).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
      })

      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })


    } catch (error) {
      console.error(error);
    }
  }


  GetInstituteMaster_ByDistrictWise(ID: any) {
    this.requestCenter.action = 'GetInstituteMaster_ByDistrictWise'
    this.requestCenter.DistrictID = ID;
    this.itiApprenticeshipService.GetITIApprenticeshipDropdown(this.requestCenter).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL", this.InstituteMasterDDL)
    })
  }

  async SaveDate() { }


  async AddDeployment() {
    debugger;
    this.isSubmitted = true;
    // If the form is invalid, return early
    if (this.ApprenticeshipDeploymentFromGroup.invalid) {
      return;
    }

    const formValues = this.ApprenticeshipDeploymentFromGroup.value;
     //Check for duplicate deployment dates in the AddedDeploymentList
    const isDuplicate = this.AddedDeploymentList.some((element: any) =>
      formValues.IndustryName === element.IndustryName
    );

    if (isDuplicate) {
      this.toastr.error('Industry Already Listed!');
      return;
      }
    //const newFrom = new Date(this.requestDeploy.DeploymentDateFrom);
    //const newTo = new Date(this.requestDeploy.DeploymentDateTo);

    //const isOverlapping = this.AddedDeploymentList.some((element: any) => {
    //  const existingFrom = new Date(element.DeploymentDateFrom);
    //  const existingTo = new Date(element.DeploymentDateTo);

    //  // Check if new date range overlaps with any existing date range
    //  return newFrom <= existingTo && newTo >= existingFrom;
    //});

    //if (isOverlapping) {
    //  this.toastr.error('Schedule already exists or overlaps with another deployment.');
    //  return;
    //}
    else {
      // Adding Institute and District names from the respective lists
      this.requestDeploy.IndustryName = formValues.IndustryName;/*this.InstituteMasterDDL.find((x: any) => x.Id == this.requestDeploy.InstituteID)?.Name;*/
      this.requestDeploy.HeadName = formValues.HeadName;
      this.requestDeploy.Designation = formValues.Designation;
      this.requestDeploy.Address = formValues.Address;

      // Push the deployment data into the AddedDeploymentList
      this.AddedDeploymentList.push({ ...this.requestDeploy });

      // Reset the deployment request object to clear the form fields
      this.requestDeploy = new ApprenticeshipDeploymentDataModel();

      // After adding, reset some form values if needed
      this.isSubmitted = false;

      this.ApprenticeshipDeploymentFromGroup.reset();
    }
  }


  async DeleteRow(item: ApprenticeshipDeploymentDataModel) {
    const index: number = this.AddedDeploymentList.indexOf(item);
    if (index != -1) {
      this.AddedDeploymentList.splice(index, 1)
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.requestDeploy = new ApprenticeshipDeploymentDataModel()

    this.InstituteMasterDDL = [];
  }
  async SaveData() {
    debugger;
    if (this.AddedDeploymentList.length == 0) {
      this.toastr.error("Please Add At Least One Institue");
    }

    this.AddedDeploymentList.forEach((element: any) => {
      element.ApprenticeshipTeamID = this.ApprenticeshipTeamID;
      element.UserID = this.sSOLoginDataModel.UserID;
      element.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      element.EndTermID = this.sSOLoginDataModel.EndTermID;
    })

    try {
      this.loaderService.requestStarted();
       
      await this.itiApprenticeshipService.SaveDeploymentData(this.AddedDeploymentList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddedDeploymentList = [];
          this.InstituteMasterDDL = [];
          //this.router.navigate(['/iti-center-observer']);
          //this.GetById_Deployment(this.ApprenticeshipTeamID);
          this.router.navigate(['/iti-apprenticeship'], {
            
          });
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async GetById_Deployment(id: number) {
    try {
      debugger;
      this.loaderService.requestStarted();
      await this.itiApprenticeshipService.GetById_Deployment(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
         
        var id = data.Data
        if (data.State === EnumStatus.Success) {
          this.AddedDeploymentList = data.Data
          

        } else if (data.State === EnumStatus.Warning) {
          // this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

}
