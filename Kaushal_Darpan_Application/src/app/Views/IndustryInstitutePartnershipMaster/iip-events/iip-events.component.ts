import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';

import { IndustryInstitutePartnershipMasterService } from '../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CompanyEventSearchModel, IIP_EventDataModel, IndustryInstitutePartnershipMasterDataModels } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-iip-events',
  standalone: false,
  templateUrl: './iip-events.component.html',
  styleUrl: './iip-events.component.css'
})

export class iipeventsComponent {
  public sSOLoginDataModel = new SSOLoginDataModel(); 
  public searchRequest = new CompanyEventSearchModel(); 

  public deleteReq = new IIP_EventDataModel();
  _enumRole = EnumRole;
  public IsDisable: boolean = false;
  public CompanyEventsList: any = []
  public InstituteMasterList: any = [];
  public InstituteCompanyMasterList: any = [];
  public CompanyID: number = 0
  public Table_SearchText: string = ''
  public returnUrl: string = '/IndustryInstitutePartnershipList';
  public IndustryInstitutePartnershipMasterList: IndustryInstitutePartnershipMasterDataModels[] = [];
  public AllInTableSelect: boolean = false;

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
   
    debugger
    if (this.sSOLoginDataModel.RoleID == EnumRole.IIP_Incharge) {
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.GetInstituteMasterDDL();
      await this.GetEventInsituteCompany();
      this.IsDisable = true;
    } else {
      this.IsDisable = false;
      await this.GetInstituteMasterDDL();
    }

    if (this.CompanyID > 0) {
     
      this.searchRequest.CompanyID = this.CompanyID;
    }

      await this.GetCompanyEvents();
   
    
  }

  async GetCompanyEvents() {
    try {
      this.CompanyEventsList = [];
      if (this.searchRequest.CompanyID == 0) {
        this.searchRequest.CompanyID = this.CompanyID;
      } else {
        this.searchRequest.CompanyID = this.searchRequest.CompanyID;
      }
      
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
  goBack()
  {
   
  /*this.router.navigateByUrl(this.returnUrl);*/
  }


  ClearReset()
  {
    this.searchRequest = new CompanyEventSearchModel();
    this.GetCompanyEvents();
  }

  async GetInstituteMasterDDL() {
    try {
      var body =
      {
        MasterCode: "GetEventInsitute",
        FilterBy:this.sSOLoginDataModel.RoleID
      }
      await this.commonMasterService.CommonMasterDataByAction(body)
        .then((data: any) =>
        {
          this.InstituteMasterList = data.Data;
        })
    }
    catch (ex) {
      console.log(ex);
    }
  }


  async GetEventInsituteCompany() {
    try {
      var body =
      {
        MasterCode: "GetEventInsituteCompany",
        FilterBy: this.searchRequest.InstituteID
      }
      debugger
      await this.commonMasterService.CommonMasterDataByAction(body)
        .then((data: any) => {
          this.InstituteCompanyMasterList = data.Data;
        })
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async OnchangeInstitute() {
    await this.GetEventInsituteCompany();
  }
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.IndustryInstitutePartnershipMasterList.filter((x: any) => x.EventID == item.EventID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.IndustryInstitutePartnershipMasterList.every((r: any) => r.Selected);
  }

  selectInTableAllCheckbox() {
    this.IndustryInstitutePartnershipMasterList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }

  async ApproveCompanyEvents() {
    const anySelected = this.CompanyEventsList.some((item: any) => item.Selected);
    if (!anySelected) {
      this.toastr.error('Please select at least one Company to approve.');
      return;
    }

    const Selected = this.CompanyEventsList.filter((item: any) => item.Selected);
    Selected.forEach((item: any) => {
      item.ModifyBy = this.sSOLoginDataModel.UserID;
    });

    try {

      debugger;
      await this.industryInstitutePartnershipMasterService.ApproveCompanyEvents(Selected).then(async (data: any) => {
        debugger
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AllInTableSelect = false;
          await this.GetCompanyEvents();
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

}
