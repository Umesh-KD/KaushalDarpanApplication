import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel, ITIGovtEMStaffMasterDataModel, ITI_Govt_EM_ZonalOFFICERSSearchDataModel, ITI_Govt_EM_ZonalOFFICERSDataModel, UpdateSSOIDByPricipleModel, ITI_Govt_EM_OFFICERSSearchDataModel, ITI_Govt_EM_OFFICERSDataModel, ITI_Govt_EM_PersonalDetailByUserIDSearchModel, RequestUpdateStatus, JoiningLetterSearchModel, RelievingLetterSearchModel } from '../../../Models/ITIGovtEMStaffMasterDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff, EnumProfileStatus, EnumEMProfileStatus, EnumOffice } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ItiSeatIntakeService } from '../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { BterRequestSearchModel, RequestSearchModel } from '../../../Models/ITI/UserRequestModel';
import { UserRequestService } from '../../../Services/UserRequest/user-request.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { BTEREstablishManagementService } from '../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { OfficeVacancyModel } from '../../../Models/BTER/BTER_EstablishManagementDataModel';

@Component({
  selector: 'app-bter-Sanctioned-posts',
  standalone: false,
  
  templateUrl: './bter-Sanctioned-posts.component.html',
  styleUrl: './bter-Sanctioned-posts.component.css'
})
export class bterSanctionedPostsComponent implements OnInit {
  
  public formData = new ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel();
  public isSubmitted: boolean = false;
 
  public searchRequest = new OfficeVacancyModel();

  public isLoading: boolean = false;

  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public _EnumRole = EnumRole;

  
  public UserRequestHistoryList: any[] = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public PostList: any = [];
  public paginatedInTableData: any[] = [];
  public UserRequestList: any[] = [];
  public SanctionedPostsList: any[] = [];
  public OfficeList: any[] = [];
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public showJoiningStatusColumn: boolean = false;

  public BugetHeadList: any = [];
  constructor(private commonMasterService: CommonFunctionService, 
    private toastr: ToastrService, private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private EstablishManagementService: BTEREstablishManagementService,


  ) {

  }



  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.BugetHeadList = [
      { ID: 1, Name: 'State Plan Budget' },
      { ID: 2, Name: 'Center Plan Budget' },
      { ID: 3, Name: 'Unplanned Budget' }
    ];
  
    this.getSanctionedPostslist();
    console.log(this.sSOLoginDataModel);
    this.GetStaffTypeData();
    await this.GetOfficeList();
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest.OfficeID = 0;
    this.searchRequest.StaffTypeID = 0;
    this.searchRequest.BugetHeadID = 0;
    await this.getSanctionedPostslist();
  }

  async getSanctionedPostslist() {
    try {
      this.searchRequest.StaffTypeID = this.searchRequest.StaffTypeID;
      this.searchRequest.OfficeID = this.searchRequest.OfficeID;
      this.searchRequest.BugetHeadID = this.searchRequest.BugetHeadID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      if(this.sSOLoginDataModel.RoleID === EnumRole.Principal || this.sSOLoginDataModel.RoleID === EnumRole.PrincipalNon){
        this.searchRequest.OfficeID = EnumOffice.COLLEGE;
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      }
      if(this.sSOLoginDataModel.RoleID === EnumRole.JD_TTC) {
        this.searchRequest.OfficeID = EnumOffice.TTC_LRDC;
      }
      if(this.sSOLoginDataModel.RoleID === EnumRole.Admin || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon){
        this.searchRequest.OfficeID = EnumOffice.BTER;
      }
      this.loaderService.requestStarted();
      await this.EstablishManagementService.OfficeVacancyList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SanctionedPostsList = data.Data;
          console.log('Sanctioned Posts List ==>',this.SanctionedPostsList);
        }, (error: any) => console.error(error))
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetOfficeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList");
        }, error => console.error(error));

      await this.commonMasterService.BTER_BGT_BudgetType(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BugetHeadList = data['Data'];
          console.log(this.BugetHeadList, "BugetHeadList");
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
 

}
