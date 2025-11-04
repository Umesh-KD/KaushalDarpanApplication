import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumRole, MONTH_LIST } from '../../../../Common/GlobalConstants';

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
  ) { }

  async ngOnInit() {
    this.CollegeApprovedContractForm = this.formBuilder.group({
      DivisionID: [''],
      DistrictID: [''],
      MonthID: [''],
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

  async GetDistictData() {
    try {
        
      // this.request.DistrictID = 0
      // this.Institutelist = [];
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

  async GetInstituteMaster(dis: number) {
    try {
        
      await this.commonMasterService.GovtITICollege_DistrictWise(this.request.DistrictID, this.sSOLoginDataModel.EndTermID).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.Institutelist = data['Data'];
      })
    } catch (error) {
      console.log(error);
    }
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
    try {
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.Institutelist = this.Institutelist;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      console.log("this.request",this.request);

    } catch (error) {
      console.log(error);
    }
  }
  async ResetControl() {}
  
  async DeleteRow(row: any) {}
}
