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
import { CompanyEventSearchModel, IIP_EventDataModel } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-iip-events',
  standalone: false,
  templateUrl: './iip-events.component.html',
  styleUrl: './iip-events.component.css'
})
export class IIPEventsComponent {
  public sSOLoginDataModel = new SSOLoginDataModel(); 
  public searchRequest = new CompanyEventSearchModel(); 

  public deleteReq = new IIP_EventDataModel();
  _enumRole = EnumRole;

  public CompanyEventsList: any = []

  public CompanyID: number = 0
  public Table_SearchText: string = ''
  public returnUrl: string = '/IndustryInstitutePartnershipList';
  constructor(
    private commonMasterService: CommonFunctionService, 
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2, 
    private router: Router
  ) { }

  async ngOnInit() { 
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CompanyID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());

     // get return url
  this.returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl')
                    || '/IndustryInstitutePartnershipList';
    if(this.CompanyID > 0) {
      await this.GetCompanyEvents();
    }
  }

  async GetCompanyEvents() {
    try {
      this.CompanyEventsList = [];
      this.searchRequest.CompanyID = this.CompanyID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      debugger
      await this.industryInstitutePartnershipMasterService.GetCompanyEvents(this.searchRequest)
        .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.CompanyEventsList = data.Data
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning("Event not found")
        }
        else
        {
        
          this.toastr.error(data.ErrorMessage)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async DeleteEvent_ById(EventID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.deleteReq.EventID = EventID
            this.deleteReq.UserID = this.sSOLoginDataModel.UserID
            await this.industryInstitutePartnershipMasterService.DeleteEvent_ById(this.deleteReq)
              .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if(data.State === EnumStatus.Success) {
                this.toastr.success(data.Message)
                await this.GetCompanyEvents();
              } else {
                this.toastr.error(data.ErrorMessage)
              }
            })
          } catch (error) {
            console.error(error)
          }
        }
      })
  }
  goBack() {
  this.router.navigateByUrl(this.returnUrl);
  }


  ClearReset()
  {
    this.searchRequest = new CompanyEventSearchModel();
    this.GetCompanyEvents();
  }
}
