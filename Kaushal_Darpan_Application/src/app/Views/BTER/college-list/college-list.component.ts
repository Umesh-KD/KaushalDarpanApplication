import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Common/common';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CollegeMasterService } from '../../../Services/CollegeMaster/college-master.service';
import { CollegeListSearchModel, CollegeMasterSearchModel } from '../../../Models/CollegeMasterDataModels';

@Component({
  selector: 'app-college-list',
  templateUrl: './college-list.component.html',
  styleUrl: './college-list.component.css',
  standalone: false
})
export class CollegeListComponent {
  public sSOLoginDataModel = new SSOLoginDataModel()
  public CollegeListData: any = []
  public Table_SearchText: string = ''
  public searchRequest = new CollegeListSearchModel()
  public managementType: number = 0
  public IsProfile: number = 0

  constructor(
    private commonMasterService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private routers: Router,
    private modalService: NgbModal, 
    private toastr: ToastrService,
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2,
    private collegeMasterService: CollegeMasterService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
    this.managementType = Number(this.activatedRoute.snapshot.paramMap.get('type')?.toString());
    this.IsProfile = Number(this.activatedRoute.snapshot.paramMap.get('status')?.toString());

    await this.GetCollegeList();
  }

  async GetCollegeList() {
    try {
      this.loaderService.requestStarted();
      debugger
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.InstitutionManagementTypeID = this.managementType;
      this.searchRequest.IsProfileComplete = this.IsProfile;

      await this.collegeMasterService.GetCollegeList(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CollegeListData = data['Data'];
        
      }, (error: any) => console.error(error));
      
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }
}
