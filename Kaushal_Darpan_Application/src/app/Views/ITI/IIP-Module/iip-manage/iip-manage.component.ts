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
  IIPIMCHistoryData: any = [];
  IIPMembersData: any = [];
  IIPFundData: any = [];
  IIPQuaterReportData: any = [];
  IIPFundTradeData: any = [];
  IIPCurrentMembersData: any = [];
  IIPPreviousMembersData: any = [];
  IIPManageTeamID: number = 0
  public request = new ITI_IIPManageDataModel();
  public requestMember = new IIPManageMemberDetailsDataModel();
  NewRegistrationDisable = false;
  FinancialYearID: number = 0;
  toggleButtonText: string = "View previous members history";
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

  async ShowIMCDetails(content: any, RegID: number) {
    debugger;
    try { 
    //this.IIPManageTeamID = id
      await this.itiIIPManageService.GetIMCHistory_ById(RegID).then((data: any) => {
      debugger;
      data = JSON.parse(JSON.stringify(data));
      if (data.State === EnumStatus.Success) {

        this.IIPIMCHistoryData = data.Data;

        this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

      } else if (data.State === EnumStatus.Warning) {
        this.toastr.warning(data.Message);
      } else {
        this.toastr.error(data.ErrorMessage);
      }
    })
    } catch(error) {
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
      this.toggleButtonText = "Go back to current member list";
      this.showingPrevious = true;
    } else {
      // Show current members
      this.IIPCurrentMembersData = this.IIPMembersData.filter((x: any) => x.ActiveFlag == 1);
      this.toggleButtonText = "View previous members history";
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



  async ShowQuaterDetails(content: any, id: number) {
 
    try {
      this.loaderService.requestStarted();
     

      await this.itiIIPManageService.GetQuaterlyProgressData(id).then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.IIPQuaterReportData = data.Data;

          console.log("this.IIPQuaterReportData", this.IIPQuaterReportData);
          this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
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

  async FinalSubmitUpdate(id: number) {
    this.Swal2.Confirmation("Are you sure you want to Submit this Report?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          try {

            await this.itiIIPManageService.FinalSubmitUpdate(id).then((data: any) => {

              data = JSON.parse(JSON.stringify(data));
              console.log("data", data)
              var id = data.Data
              if (data.State === EnumStatus.Success) {
                this.toastr.success("Fund Report Update Successfully");
                this.CloseModalPopup();
                this.GetAllData();
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
      });
  }

  async DownloadIIPQuaterlyFundReportPDF(id: number) {

      try {
        await this.itiIIPManageService.GetIIPQuaterlyFundReport(id).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'IIPQuaterlyFundReport.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error("FIle Not Found!!")
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

}
