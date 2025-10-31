import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormGroup } from '@angular/forms';

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

  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    debugger
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDivisionMaster();
    this.request.DistrictID = this.sSOLoginDataModel.DistrictID
    await this.DivisionData_ByDistrict();
    await this.GetDistictData();
    
    await this.GetInstituteMaster(this.request.DistrictID);
  }

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
      debugger
      // this.request.DistrictID = 0
      // this.Institutelist = [];
      await this.commonMasterService.DistrictMaster_DivisionIDWise(Number(this.request.DivisionID))
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Districtlist = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetInstituteMaster(dis: number) {
    try {
      debugger
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
      debugger
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

  async SaveData() {}
  async ResetControl() {}
  
  async DeleteRow(row: any) {}
}
