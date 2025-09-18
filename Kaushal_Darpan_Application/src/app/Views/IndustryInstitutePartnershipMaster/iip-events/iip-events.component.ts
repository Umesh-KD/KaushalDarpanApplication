import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Common/common';
import { IndustryInstitutePartnershipMasterService } from '../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CompanyEventSearchModel } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-iip-events',
  standalone: false,
  templateUrl: './iip-events.component.html',
  styleUrl: './iip-events.component.css'
})
export class IIPEventsComponent {
  public sSOLoginDataModel = new SSOLoginDataModel(); 
  public searchRequest = new CompanyEventSearchModel(); 

  public CompanyEventsList: any = []

  public CompanyID: number = 0
  public Table_SearchText: string = ''
  constructor(
    private commonMasterService: CommonFunctionService, 
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() { 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CompanyID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    if(this.CompanyID > 0) {
      await this.GetCompanyEvents();
    }
  }

  async GetCompanyEvents() {
    try {
      
      this.searchRequest.CompanyID = this.CompanyID;
      await this.industryInstitutePartnershipMasterService.GetCompanyEvents(this.searchRequest)
        .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.CompanyEventsList = data.Data
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
}
