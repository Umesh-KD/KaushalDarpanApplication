import { Component, ViewChild, ElementRef } from '@angular/core';
import { EnumDeploymentStatus, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { IIPManageMemberDetailsDataModel, ITI_IIPManageDataModel, ITI_IIPManageSearchModel, IIPManageFundSearchModel } from '../../../../Models/ITI/ITI_IIPManageDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITIIIPManageService } from '../../../../Services/ITI/ITI-IIPModule/iti-iipmodule.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'iip-manage',
  standalone: false,
  templateUrl: './iip-manage.component.html',
  styleUrl: './iip-manage.component.css'
})
export class ITIIIPManageComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  _EnumDeploymentStatus = EnumDeploymentStatus
  searchRequest = new ITI_IIPManageSearchModel();
  public formData = new IIPManageFundSearchModel()
  IIPManageData: any = [];
  IIPMembersData: any = [];
  IIPFundData: any = [];
  IIPFundTradeData: any = [];
  IIPCurrentMembersData: any = [];
  IIPPreviousMembersData: any = [];
  IIPManageTeamID: number = 0
  public request = new ITI_IIPManageDataModel();
  public requestMember = new IIPManageMemberDetailsDataModel();
  NewRegistrationDisable = false;
  FinancialYearID: number = 0;
  toggleButtonText: string = "Previous Members History";
  showingPrevious: boolean = false;
  FinancialYearMasterDDL: any;

  modalReference: NgbModalRef | undefined;
  modalReference1: NgbModalRef | undefined;

  closeResult: string | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
 // private modalService = inject(NgbModal);
  constructor(
    private commonMasterService: CommonFunctionService,
    private menuService: MenuService,
    private fb: FormBuilder,
    private itiIIPManageService: ITIIIPManageService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private modalService1: NgbModal,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private http: HttpClient,
    private appsettingConfig: AppsettingService,
    private router: Router, private activatedRoute: ActivatedRoute
  ){}


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    this.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.formData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

    await this.commonMasterService.GetFinancialYear().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));

      console.log("FinancialYearMasterDDL", data)
      this.FinancialYearMasterDDL = data.Data;
    })

    this.GetAllData()
  }

  async ResetControl() {
    this.searchRequest = new ITI_IIPManageSearchModel();
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    this.searchRequest.LevelId = this.sSOLoginDataModel.LevelId
    this.GetAllData();
  }

  async GetAllData () {
    try {
      debugger;
      this.loaderService.requestStarted();
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.InstituteId = this.sSOLoginDataModel.InstituteID;

      await this.itiIIPManageService.GetAllData(this.searchRequest).then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.IIPManageData = data.Data.Table;
          this.IIPMembersData = data.Data.Table1;
          this.IIPFundData = data.Data.Table2;

          if (this.IIPManageData.length > 0) {
            this.NewRegistrationDisable = true;
          }


          console.log("this.IIPManageData",this.IIPManageData)
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async ShowMemberDetails(content: any) {
    debugger;
    //this.IIPManageTeamID = id
    this.IIPCurrentMembersData = this.IIPMembersData.filter((x: any) => x.ActiveFlag == 1);

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });


  }
  async ShowPreMemberDetails() {
    this.IIPCurrentMembersData = this.IIPMembersData.filter((x: any) => x.ActiveFlag == 0);
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  toggleMemberDetails() {
    if (!this.showingPrevious) {
      // Show previous members
      this.IIPCurrentMembersData = this.IIPMembersData.filter((x: any) => x.ActiveFlag == 0);
      this.toggleButtonText = "Current Members";
      this.showingPrevious = true;
    } else {
      // Show current members
      this.IIPCurrentMembersData = this.IIPMembersData.filter((x: any) => x.ActiveFlag == 1);
      this.toggleButtonText = "Previous Members History";
      this.showingPrevious = false;
    }
  }

  async GetAllIMCFundData() {
    try {
      debugger;
      this.loaderService.requestStarted();
      //this.formData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.formData.UserID = this.sSOLoginDataModel.UserID;
      this.formData.InstituteId = this.sSOLoginDataModel.InstituteID;
      this.formData.IMCRegID = this.IIPManageData[0].RegistrationID;

      await this.itiIIPManageService.GetAllIMCFundData(this.formData).then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.IIPFundData = data.Data.Table;

        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async GetFinancialData(event: any) {
    debugger;
    const selectedId = this.formData.FinancialYearID; // this will give the selected FinancialYearID
    this.loaderService.requestStarted();
    this.formData.FinancialYearID = selectedId;
    await this.GetAllIMCFundData();

  }

}
