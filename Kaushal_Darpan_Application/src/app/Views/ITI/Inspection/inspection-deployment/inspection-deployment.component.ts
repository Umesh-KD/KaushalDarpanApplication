import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITI_InspectionDataModel, InspectionMemberDetailsDataModel, InspectionDeploymentDataModel, CenterMasterDDLDataModel, ITI_InspectionSearchModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
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
  selector: 'app-inspection-deployment',
  standalone: false,
  templateUrl: './inspection-deployment.component.html',
  styleUrl: './inspection-deployment.component.css'
})
export class InspectionDeploymentComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  StreamMasterDDL: any = [];
  SemesterMasterDDL: any = [];
  DistrictMasterDDL: any = [];
  ExamShiftDDL: any = [];
  InstituteMasterDDL: any = [];
  ExaminerDDL: any = [];
  AddedDeploymentList: InspectionDeploymentDataModel[] = [];
  public request = new ITI_InspectionDataModel();
  public requestDeploy = new InspectionDeploymentDataModel();
  public requestMember = new InspectionMemberDetailsDataModel();
  searchRequest = new ITI_InspectionSearchModel();
  InspectionDeploymentFromGroup!: FormGroup;
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
  InspectionTeamID: number = 0;
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
     
    console.log('Received ID in InspectionDeploymentComponent:', this.tabId);
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.getMasterData();
    this.InspectionTeamID = this.activatedRoute.snapshot.queryParams['id'];
    console.log("this.InspectionTeamID",this.InspectionTeamID)
    if(this.InspectionTeamID != 0) {
      this.GetById_Deployment(this.InspectionTeamID);
    }

    this.InspectionDeploymentFromGroup = this.fb.group({
      DistrictID: ['', [DropdownValidators]],
      InstituteID: ['', [DropdownValidators]],
      // DeploymentType: ['', [DropdownValidators]],
      //DeploymentDateFrom: ['', Validators.required],
      //DeploymentDateTo: ['', Validators.required],
    })

    this.DeploymentTypeList = Object.keys(EnumInspectionDeploymentType)
    .filter(key => !isNaN(Number(EnumInspectionDeploymentType[key as any])))
    .map(key => ({
      id: EnumInspectionDeploymentType[key as any],
      name: key
    }));
  }

  get _InspectionDeploymentFromGroup() { return this.InspectionDeploymentFromGroup.controls; }

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
      this.searchRequest.LevelId = this.sSOLoginDataModel.LevelId;
      this.searchRequest.DistrictID = this.sSOLoginDataModel.DistrictID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      await this.itiInspectionService.GetDistrictMaster(this.searchRequest).then((data: any) => {
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
    this.itiInspectionService.GetITIInspectionDropdown(this.requestCenter).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL", this.InstituteMasterDDL)
    })
  }

  async SaveDate() { }


  async AddDeployment() {
    this.isSubmitted = true;
    // If the form is invalid, return early
    if (this.InspectionDeploymentFromGroup.invalid) {
      return;
    }
     //Check for duplicate deployment dates in the AddedDeploymentList
    const isDuplicate = this.AddedDeploymentList.some((element: any) =>
      this.requestDeploy.InstituteID === element.InstituteID
    );

    if (isDuplicate) {
      this.toastr.error('College Already Listed!');
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
      this.requestDeploy.InstituteName = this.InstituteMasterDDL.find((x: any) => x.Id == this.requestDeploy.InstituteID)?.Name;
      this.requestDeploy.DistrictName = this.DistrictMasterDDL.find((x: any) => x.ID == this.requestDeploy.DistrictID)?.Name;
      this.requestDeploy.DeploymentTypeName = this.DeploymentTypeList.find((x: any) => x.id == this.requestDeploy.DeploymentType)?.name;

      // Push the deployment data into the AddedDeploymentList
      this.AddedDeploymentList.push({ ...this.requestDeploy });

      // Reset the deployment request object to clear the form fields
      this.requestDeploy = new InspectionDeploymentDataModel();

      // After adding, reset some form values if needed
      this.isSubmitted = false;
    }
  }


  async DeleteRow(item: InspectionDeploymentDataModel) {
    const index: number = this.AddedDeploymentList.indexOf(item);
    if (index != -1) {
      this.AddedDeploymentList.splice(index, 1)
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.requestDeploy = new InspectionDeploymentDataModel()

    this.InstituteMasterDDL = [];
  }
  async SaveData() {
    debugger;
    if (this.AddedDeploymentList.length == 0) {
      this.toastr.error("Please Add At Least One Institue");
    }

    this.AddedDeploymentList.forEach((element: any) => {
      element.InspectionTeamID = this.InspectionTeamID;
      element.UserID = this.sSOLoginDataModel.UserID;
      element.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      element.EndTermID = this.sSOLoginDataModel.EndTermID;
    })

    try {
      this.loaderService.requestStarted();
       
      await this.itiInspectionService.SaveDeploymentData(this.AddedDeploymentList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddedDeploymentList = [];
          this.InstituteMasterDDL = [];
          //this.router.navigate(['/iti-center-observer']);
          //this.GetById_Deployment(this.InspectionTeamID);
          this.router.navigate(['/iti-inspection'], {
            
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
      await this.itiInspectionService.GetById_Deployment(id).then((data: any) => {
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
