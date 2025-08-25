import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssignApplicationDataModel } from '../../../Models/DTE_AssignApplicationDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifierService } from '../../../Services/DTE_Verifier/verifier.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { AssignApplicationService } from '../../../Services/DTE_AssignApplication/assign-application.service';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { copycheckdashsearchmodel } from '../../../Models/CopycheckDashboardDataModel';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';

@Component({
    selector: 'app-add-assign-application',
    templateUrl: './add-assign-application.component.html',
    styleUrls: ['./add-assign-application.component.css'],
    standalone: false
})
export class AddAssignApplicationComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public AssignApplicationFormGroup!: FormGroup;
  public request = new AssignApplicationDataModel();
  public TotalCount:any=[]
  public isSubmitted = false;
  public VerifierID: number = 0
  public VerifiersList: any = []
  public ID: number = 0
  public action: string = ''
  public CountSearchModel=new RequestBaseModel()

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private commonFunctionService: CommonFunctionService,
    private assignApplicationService: AssignApplicationService,
    private router: Router
  ) {}

  async ngOnInit(){
    this.AssignApplicationFormGroup = this.formBuilder.group(
      {
        FromApplicationNo: ['', Validators.required],
        ToApplicationNo: ['', Validators.required],
        Verifier: ['', [DropdownValidators]],
        Applied: [{ value: '', disabled: true }, Validators.required],
        ShowAllApplication: [false, Validators.required],
      });
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CourseType = this.SSOLoginDataModel.Eng_NonEng

    await this.GetMasterDDL();
   this.GetTotalcount()

    this.ID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    if (this.ID) {
      await this.GetDataById(this.ID)
    }
  }

  get _AssignApplicationFormGroup() { return this.AssignApplicationFormGroup.controls; }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      if (this.SSOLoginDataModel.DepartmentID == EnumDepartment.BTER)
      {
        this.action = "VerifierDDL"

      }
      else
      {
        this.action = "ITIVerifierDDL"
      }
      await this.commonFunctionService.GetCommonMasterData(this.action, this.SSOLoginDataModel.DepartmentID, this.SSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.VerifiersList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveData() {
    this.isSubmitted = true;

    if (this.AssignApplicationFormGroup.invalid) {
      this.toastr.error('Invalid form');
      Object.keys(this.AssignApplicationFormGroup.controls).forEach(key => {
        const control = this.AssignApplicationFormGroup.get(key);

        if (control && control.invalid) {
          this.toastr.error(`Control ${key} is invalid`);
          Object.keys(control.errors!).forEach(errorKey => {
            this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          });
        }
      });
      return;
    }
    try {
      this.loaderService.requestStarted();

      if(this.request.ID == 0) {
        this.request.CreatedBy = this.SSOLoginDataModel.UserID;
        this.request.ModifyBy = this.SSOLoginDataModel.UserID;

      } else {
        this.request.ModifyBy = this.SSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      this.request.EndTermID = this.SSOLoginDataModel.EndTermID;
      this.request.CourseType = this.SSOLoginDataModel.Eng_NonEng
      if (this.SSOLoginDataModel.DepartmentID == EnumDepartment.ITI) {
        this.request.CourseType = 0
      }

      await this.assignApplicationService.SaveData(this.request).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControl()
            this.router.navigate(['/assignapplication'])
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => console.error(error));
    } 
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  calculateApplied() {

    if (Number(this.request.FromApplicationNo) > Number(this.request.ToApplicationNo) && this.request.ToApplicationNo != null ) {
      this.request.Applied = 0
      this.request.ToApplicationNo = null
      this.toastr.warning("To ApplicationNo must be greater than from ApplicationNo")
    }
    if (Number(this.request.FromApplicationNo) > Number(this.TotalCount.TotalCounT)) {
      this.toastr.warning('Cannot select Application More than available Application')

      this.request.FromApplicationNo=null
    }
    if (Number(this.request.ToApplicationNo) > Number(this.TotalCount.TotalCounT)) {
      this.toastr.warning('Cannot select Application More than available Application')
      this.request.ToApplicationNo = null
  
    }


    if (this.request.FromApplicationNo && this.request.ToApplicationNo) {
      this.request.Applied = this.request.ToApplicationNo - this.request.FromApplicationNo + 1
    }
  }




  //calculateApplied(): void {
  //  let maxMarks = this.request.AggMaxMark;
  //  const marksObtained = this.request.AggObtMark;
  //  if (Number(this.request.AggObtMark) > Number(this.request.AggMaxMark)) {
  //    this.request.Percentage = '';
  //    this.request.AggObtMark = 0;
  //    this.toastr.warning('Marks Obtained cannot be greater than Maximum Marks.');
  //    return;
  //  }
  //  if (this.request.MarkType == 84) {
  //    maxMarks = 10
  //    this.request.AggMaxMark = 10
  //    this.QualificationForm.get('txtAggregateMaximumMarks')?.disable();
  //    if (this.request.AggObtMark > 10) {
  //      this.request.AggObtMark = 0;
  //      this.request.Percentage = '';
  //      return
  //    }
  //    if (maxMarks && marksObtained && marksObtained <= maxMarks) {
  //      const percentage = marksObtained * 9.5;
  //      if (percentage <= 33) {
  //        this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
  //        this.request.Percentage = '';
  //        this.request.AggObtMark = 0;
  //      } else {
  //        this.request.Percentage = percentage.toFixed(2);
  //      }
  //    } else {
  //      this.request.Percentage = '';
  //    }
  //  } else if (this.request.MarkType == 83) {
  //    this.QualificationForm.get('txtAggregateMaximumMarks')?.enable();
  //    if (maxMarks && marksObtained && Number(marksObtained) <= Number(maxMarks)) {
  //      const percentage = (marksObtained / maxMarks) * 100;
  //      if (percentage <= 33) {
  //        this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
  //        this.request.Percentage = '';
  //        this.request.AggObtMark = 0;
  //      } else {
  //        this.request.Percentage = percentage.toFixed(2);
  //      }

  //    } else {
  //      this.request.Percentage = '';
  //    }
  //    if (this.request.SupplementaryDataModel == null) {
  //      this.request.SupplementaryDataModel = []
  //    }
  //  }
  //}



  
  async ResetControl() {
    this.isSubmitted = false;
    this.request = new AssignApplicationDataModel();
  }

  async GetDataById(id: number) {
    this.loaderService.requestStarted();
    try {
      await this.assignApplicationService.GetApplicationsById(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {

          this.request = data.Data;

        } else {
          this.toastr.error(data.ErrorMessage);
        }
      }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async GetTotalcount() {
    this.loaderService.requestStarted();
    try {
      this.CountSearchModel.DepartmentID = this.SSOLoginDataModel.DepartmentID
      this.CountSearchModel.EndTermID = this.SSOLoginDataModel.EndTermID
      this.CountSearchModel.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng
      if (this.SSOLoginDataModel.DepartmentID == EnumDepartment.ITI)
      {
        this.CountSearchModel.Eng_NonEng = 0
      }
      await this.assignApplicationService.GetTotalAssignApplication(this.CountSearchModel).then((data: any) =>
      {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success)
        {

          this.TotalCount = data['Data'][0];
          console.log(data['Data'],"xdscfsd")

        } else {
          this.toastr.error(data.ErrorMessage);
        }
      }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
