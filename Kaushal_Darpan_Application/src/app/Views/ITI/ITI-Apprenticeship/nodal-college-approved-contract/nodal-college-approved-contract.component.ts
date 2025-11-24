import { Component,NgModule } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumRole, EnumStatus, MONTH_LIST } from '../../../../Common/GlobalConstants';
import { ITIApprenticeshipService } from '../../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
@Component({
  selector: 'app-nodal-college-approved-contract',
  standalone: false,
  templateUrl: './nodal-college-approved-contract.component.html',
  styleUrl: './nodal-college-approved-contract.component.css'
})
 
export class NodalCollegeApprovedContractComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request : any = {};

  CollegeApprovedContractForm!: FormGroup;
InstitutelistNew: InstituteRow[] = [];
  public Divisionlist: any = [];
  public Districtlist: any = [];
  public Institutelist: any = [];
  public DivisionData: any = [];
  _enumRole = EnumRole;
  months = MONTH_LIST;

  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apprenticeshipService: ITIApprenticeshipService
  ) { }

  async ngOnInit() {
    this.CollegeApprovedContractForm = this.formBuilder.group({
      DivisionID: [{ value: '', disabled: true }, [DropdownValidators]],
      DistrictID: [{ value: '', disabled: true }, [DropdownValidators]],
      MonthID: ['', [DropdownValidators]],
    })
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDivisionMaster();
    this.request.DistrictID = this.sSOLoginDataModel.DistrictID
    await this.DivisionData_ByDistrict();
    await this.GetDistictData();
    
    // await this.GetInstituteMaster(this.request.DistrictID);
  }

  get _CollegeApprovedContractForm() { return this.CollegeApprovedContractForm.controls; }

  async GetDivisionMaster() {   
    try {
      await this.commonMasterService.GetDivisionMaster().then((data: any) => {
        this.Divisionlist = data.Data;
      });
    } catch (error) {
      console.error(error);
    }
  }

  GetMonthNumber() {
    let today = new Date();
    let month = today.getMonth() + 1; // January is 0
    return month;
  }


  async GetDistictData() {
    try {
        
      // this.request.DistrictID = 0
      // this.Institutelist = [];
      await this.onChange();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(Number(this.request.DivisionID))
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Districtlist = data['Data'];
          this.request.DistrictID = this.sSOLoginDataModel.DistrictID
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetInstituteMaster() {
    try {
      const curr_month = this.GetMonthNumber();
      if (curr_month <= this.request.MonthID) {
        this.Institutelist = [];
        this.request.MonthID = 0;
        this.toastr.error('Please select correct month as You cannot select future or present month');
        return;
      } 

      const request: any = {};
      request.DistrictID = this.request.DistrictID;
      request.EndTermID = this.sSOLoginDataModel.EndTermID;
      request.MonthID = this.request.MonthID;
      request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      request.action = "GetInstituteList";
      await this.apprenticeshipService.GetITI_InstituteList_Apprenticeship(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.Institutelist = data['Data'];
        this.InstitutelistNew = data['Data'];
      })
    } catch (error) {
      console.log(error);
    }
    this.InstitutelistNew = this.InstitutelistNew.map((row: InstituteRow) => ({
  ...row,
  showContractFields: false
}));
  }

  async DivisionData_ByDistrict() {
    try {
        
      await this.commonMasterService.DivisionData_ByDistrict(Number(this.request.DistrictID))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionData = data.Data[0];
          this.request.DivisionID = this.DivisionData.DivisionID
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async SaveData() {
    if(this.CollegeApprovedContractForm.invalid) {
      this.toastr.error('Please fill all the required fields');
      return
    }

    if(this.Institutelist?.length == 0) {
      this.toastr.error('there is no institute');
      return
    }

    try {
      this.Institutelist.forEach((ele: any) => {
        ele.UserID = this.sSOLoginDataModel.UserID;
        ele.EndTermID = this.sSOLoginDataModel.EndTermID;
        ele.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        ele.ZoneID = this.request.DivisionID;
        ele.DistrictID = this.request.DistrictID;
        ele.MonthID = this.request.MonthID;
        ele.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      });

      await this.apprenticeshipService.SaveCollegeApprovedContract_Appr(this.Institutelist).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  async onChange() {
    this.Institutelist = [];
    this.request.MonthID = 0;
  }
  openCalendar(index: number) {
   
}
}
 interface InstituteRow {
  InstituteID: number;
  Name: string;
  No_Of_Contract?: number;
  ContractDate?: string;
  showContractFields?: boolean;
}