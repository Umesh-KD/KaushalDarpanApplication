import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { DeploymentDataModel, CenterObserverDeployModel, CenterMasterDDLDataModel, CenterObserverSearchModel } from '../../../../Models/CenterObserverDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { TimeTableSearchModel } from '../../../../Models/TimeTableModels';
import { CenterObserverService } from '../../../../Services/CenterObserver/center-observer.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ITIFlyingSquadService } from '../../../../Services/ITI/ITIFlyingSquad/itiflying-squad.service';
@Component({
  selector: 'app-iti-flying-squad-deployment',
  standalone: false,
  templateUrl: './iti-flying-squad-deployment.component.html',
  styleUrl: './iti-flying-squad-deployment.component.css'
})
export class ItiCenterObserverDeploymentComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public requestDeploy = new DeploymentDataModel();
  CenterObserverDeployForm!: FormGroup;
  public request = new CenterObserverDeployModel();
  isSubmitted:boolean = false;
  AddedDeploymentList: DeploymentDataModel[] = [];
  TimeTableDates: any = [];

  DistrictMasterDDL: any;
  SemesterMasterDDL: any[] = [];
  StreamMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
  ExamShiftDDL: any[] = [];
  InstituteMasterDDL: any[] = [];
  CenterObserverTeamID: number = 0;
  requestCenter = new CenterMasterDDLDataModel();
  public searchRequest = new CenterObserverSearchModel();
  public searchReqTT = new TimeTableSearchModel()
  public TimeTableList: any = [];

allowedDates: string[] = [];

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private route: ActivatedRoute,
    private centerObserverService: CenterObserverService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private router: Router,
    private ITIFlyingSquadService: ITIFlyingSquadService,
  ) { }

  async ngOnInit() { 
    this.CenterObserverDeployForm = this.fb.group({
      DistrictID: ['', [DropdownValidators]],
      InstituteID: ['', [DropdownValidators]],
      DeploymentDate: ['', Validators.required],
      ShiftID: ['', [DropdownValidators]],
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CenterObserverTeamID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    this.searchRequest.TeamID = this.CenterObserverTeamID
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    if(this.CenterObserverTeamID) {
      await this.GetDeploymentDetailsByID();
    }
    this.getMasterData();
    await this.GetAllTimeTableData();
    await this.GetTimeTableDates();
  }

  get centerObserverDeployForm() { return this.CenterObserverDeployForm.controls; }

checkValidDate(event: Event): void {
  const selectedDate = (event.target as HTMLInputElement).value;
  const control = this.CenterObserverDeployForm.get('DeploymentDate') as FormControl;

  if (!this.allowedDates.includes(selectedDate)) {
    this.toastr.warning('Exam not scheduled for selected date. Please choose another date.');

    this.requestDeploy.DeploymentDate = '';
    control.setValue('');
    control.setErrors({ invalidDate: true });

  } else {
    if (control.hasError('invalidDate')) {
      const errors = { ...control.errors };
      delete errors.invalidDate;

      if (Object.keys(errors).length === 0) {
        control.setErrors(null);
      } else {
        control.setErrors(errors);
      }
    }
  }
}

  async getMasterData() {
    try {
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
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

      await this.ITIFlyingSquadService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })

      await this.commonMasterService.Examiner_SSOID(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminerDDL = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
  }

  GetInstituteMaster_ByDistrictWise(ID: any) {
    this.requestCenter.DistrictID = ID;
    this.requestCenter.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.requestCenter.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.requestCenter.EndTermID = this.sSOLoginDataModel.EndTermID;
     this.ITIFlyingSquadService.GetCenter_DistrictWise(this.requestCenter).then((data: any) => {
    //this.commonMasterService.GetCenter_DistrictWise(this.requestCenter).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
    })
  }

  async AddDeployment() {
    this.isSubmitted = true;

    if (this.CenterObserverDeployForm.invalid) {
      return;
    }

    // const checkExamDate = this.TimeTableList.some((element: any) =>
    //   this.requestDeploy.DeploymentDate === element.ExamDate
    // );

    // if (!checkExamDate) {
    //   this.toastr.error('Exam not scheduled for selected date.');
    //   return;
    // }
    

    const isDuplicate = this.AddedDeploymentList.some((element: any) =>
      this.requestDeploy.DeploymentDate === element.DeploymentDate &&
      this.requestDeploy.ShiftID === element.ShiftID
    );


     if (this.AddedDeploymentList.length > 0) {
      const samedate = this.AddedDeploymentList.find((x: any) => x.DeploymentDate === this.requestDeploy.DeploymentDate);
      if (samedate) {
        const sameDistrict = this.AddedDeploymentList.find((x: any) => x.DistrictID === this.requestDeploy.DistrictID);

        if (samedate && !sameDistrict) {
          this.toastr.error('Please select same district for same date.');
          return;
        }
      }

    }

    if (isDuplicate) {
      this.toastr.error('Schedule Already Exists for selected date and shift combination.');
      return;
    } else {
      this.requestDeploy.InstituteName = this.InstituteMasterDDL.find((x: any) => x.CenterID == this.requestDeploy.InstituteID).CenterName;
      this.requestDeploy.DistrictName = this.DistrictMasterDDL.find((x: any) => x.ID == this.requestDeploy.DistrictID).Name;
      this.requestDeploy.ShiftName = this.ExamShiftDDL.find((x: any) => x.ShiftID == this.requestDeploy.ShiftID).ExamShift;
      this.AddedDeploymentList.push(this.requestDeploy);
      this.requestDeploy = new DeploymentDataModel();
    }
    this.isSubmitted = false;
    
  }

  async DeleteRow(item: DeploymentDataModel) {
    const index: number = this.AddedDeploymentList.indexOf(item);
    if (index != -1) {
      this.AddedDeploymentList.splice(index, 1)
    }
  }

  async SaveData() {
    if(this.AddedDeploymentList.length == 0) {
      this.toastr.error("Please Add At Least One Schedule");
    }

    this.AddedDeploymentList.forEach((element: any) => {
      element.TeamID = this.CenterObserverTeamID;
      element.UserID = this.sSOLoginDataModel.UserID;
      element.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      element.EndTermID = this.sSOLoginDataModel.EndTermID;
    })

    try {
      this.loaderService.requestStarted();
      await this.ITIFlyingSquadService.SaveDeploymentData(this.AddedDeploymentList).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.router.navigate(['/iti-flying-squad']);
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

  async GetDeploymentDetailsByID () {
    try {
      this.loaderService.requestStarted();
      await this.ITIFlyingSquadService.GetDeploymentDetailsByID(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.AddedDeploymentList = data.Data;
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

  async GetTimeTableDates () {
    try {
      debugger;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.sSOLoginDataModel.Eng_NonEng= this.sSOLoginDataModel.Eng_NonEng
      this.loaderService.requestStarted();
      await this.ITIFlyingSquadService.GetTimeTableDates(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.TimeTableDates = data.Data;
          this.allowedDates = this.TimeTableDates.map((item: any) => item.ExamDate);
          console.log("this.allowedDates",this.allowedDates)
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

  async GetAllTimeTableData() {
    try {
      this.loaderService.requestStarted();
      this.searchReqTT.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchReqTT.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      await this.ITIFlyingSquadService.GetAllTimeTableData(this.searchReqTT).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.TimeTableList = data.Data;
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
