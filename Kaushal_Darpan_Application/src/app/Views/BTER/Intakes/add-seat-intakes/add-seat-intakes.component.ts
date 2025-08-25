import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SeatIntakeDataModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumCourseType, EnumStatus } from '../../../../Common/GlobalConstants';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { BTERSeatsDistributionsService } from '../../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { BTERCollegeTradeSearchModel } from '../../../../Models/BTER/BTERSeatIntakeDataModel';
import { BranchStreamTypeWiseSearchModel, BTERCollegeBranchModel } from '../../../../Models/BTER/BTERSeatsDistributions';

@Component({
    selector: 'app-add-seat-intakes',
    templateUrl: './add-seat-intakes.component.html',
    styleUrls: ['./add-seat-intakes.component.css'],
    standalone: false
})
export class AddSeatIntakesComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public SeatIntakeFormGroup!: FormGroup;
  //public request = new SeatIntakeDataModel()
  public isSubmitted = false;
  public tradeSearchRequest = new ItiTradeSearchModel()
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ItiTradeListAll: any = [];
  public CollegesListAll: any = [];
  public BranchList: any = [];
  public ITIRemarkList: any = [];
  public SanctionedList: any = [];
  public FinancialYearList: any = [];
  public SeatIntakeID: number | null = null;
  public branchSearchRequest = new BranchStreamTypeWiseSearchModel()
  public BranchID: number = 0
  public request = new BTERCollegeBranchModel()

  

  constructor(
    private commonFunctionService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private ItiSeatIntakeService: ItiSeatIntakeService,

    private SeatsDistributionsService: BTERSeatsDistributionsService,

    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.SeatIntakeFormGroup = this.formBuilder.group(
      {
        CollegeName: ['', [DropdownValidators]],
        BranchName: ['', [DropdownValidators]],
        Shift: ['', [DropdownValidators]],
        BterSeats: ['', Validators.required],
        AdmissionSeats: ['', Validators.required],
      });

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //if (this.SSOLoginDataModel.Eng_NonEng == EnumCourseType.Lateral) {
    //  this.request.StreamTypeId = EnumCourseType.Engineering
    //} else {
      this.request.StreamTypeId = this.SSOLoginDataModel.Eng_NonEng
    //}

    this.request.EndTermId = this.SSOLoginDataModel.EndTermID;

    await this.GetBranches()
    await this.GetColleges();
    
    this.BranchID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    if (this.BranchID) {
      await this.GetCollegeBrancheByID()
    }
  }

  get _SeatIntakeFormGroup() { return this.SeatIntakeFormGroup.controls; }


  async GetColleges() {  
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      this.request.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      this.request.CreatedBy = this.SSOLoginDataModel.UserID;
      this.request.CollegeID = this.SSOLoginDataModel.InstituteID;
      this.request.Action="COLLEGE_LIST"
      await this.SeatsDistributionsService.CollegeBranches(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CollegesListAll = data.Data
      });   
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetBranches() {
    try {
      this.loaderService.requestStarted();
      this.branchSearchRequest.StreamTypeId = this.request.StreamTypeId;
      this.branchSearchRequest.EndTermId = this.SSOLoginDataModel.EndTermID;
      await this.SeatsDistributionsService.GetBranchesStreamTypeWise(this.branchSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchList = data.Data
      });
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async onSubmit() {
    this.isSubmitted = true;
    if(this.SeatIntakeFormGroup.invalid) {
      this.toastr.error("invalid Form Data")
      return
    }
    try {
      this.loaderService.requestStarted();

      //this.request.ModifyBy = this.SSOLoginDataModel.UserID;
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      this.request.FinancialYearID = this.SSOLoginDataModel.FinancialYearID;
      this.request.CreatedBy = this.SSOLoginDataModel.UserID;
      this.request.StreamFor = this.SSOLoginDataModel.RoleID == 17 || this.SSOLoginDataModel.RoleID == 18 || this.SSOLoginDataModel.RoleID == 33 || this.SSOLoginDataModel.RoleID == 80 || this.SSOLoginDataModel.RoleID == 81 ? 1 : 2;
      if (this.request.CollegeStreamId) {
        this.request.Action = "UPDATE";
      } else {
        this.request.Action = "ADD";
      }
      
      await this.SeatsDistributionsService.SaveCollegeBranches(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message + "! If you want to add this entry then first you have to Delete Existing Entry.")
          } else if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.onReset()
            this.router.navigate(['/BTERSeatIntakesList'])
          } else {
            this.toastr.error(data.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
    } catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  
  async onReset() {
    this.isSubmitted = false;
    this.request = new BTERCollegeBranchModel()
  }

  async GetCollegeBrancheByID() {
    try {
      this.loaderService.requestStarted();
      await this.SeatsDistributionsService.GetCollegeBrancheByID(this.BranchID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.request = data.Data[0];
        if(data.Data[0]["ActiveStatus"] == true) {
          this.request.ActiveStatus = 1
        } else {
          this.request.ActiveStatus = 0
        }
        this.GetBranches();
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
