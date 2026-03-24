import { AfterViewInit, ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SSOLandingDataDataModel, SSOLoginDataModel, UpdateStudentDetailsModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SSOLoginService } from '../../Services/SSOLogin/ssologin.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { EnumRole, EnumStatus, EnumUserType, GlobalConstants, EnumDepartment } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserRequestService } from '../../Services/UserRequest/user-request.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-ssologin',
  templateUrl: './ssologin.component.html',
  styleUrls: ['./ssologin.component.css'],
  standalone: false
})

export class SSOLoginComponent implements OnInit, AfterViewInit {
  LoginType: any = "1";
  Username: any; // searchrecordid
  LoginRoleType: any;
  sSOLoginDataModel = new SSOLoginDataModel();
  sSOLandingDataDataModel = new SSOLandingDataDataModel();
  requestUpdateUserType = new UpdateStudentDetailsModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public MutiUserCollegeList: any = [];

  public SSOjson: any = [];

  public _EnumDepartment = EnumDepartment;
  public DepartmentID: number = 0;

  //Modal Boostrap
  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  @ViewChild('modal_UserLoginType') modal_GenrateOTP: any;
  @ViewChild('modal_MultiDepartment') modal_MultiDepartment: any;
  @ViewChild('modal_MultiInsitute') modal_MultiInsitute: any;



  constructor(private activatedRoute: ActivatedRoute, private sSOLoginService: SSOLoginService, private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private cdRef: ChangeDetectorRef, private commonMasterService: CommonFunctionService, private cookieService: CookieService, private appsettingConfig: AppsettingService, private modalService: NgbModal, private Swal2: SweetAlert2) { }
  ngAfterViewInit() {

  }

  init() {
    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }

  public configUrl: any = "";
  async ngOnInit() {

    debugger;
    console.log("AppName", this.appsettingConfig.AppName);
    this.loaderService.requestStarted();
    if (this.cookieService.get(this.appsettingConfig.AppName) != null && this.cookieService.get(this.appsettingConfig.AppName) != '') {
      this.Username = this.cookieService.get(this.appsettingConfig.AppName);
      this.cookieService.delete(this.appsettingConfig.AppName)
    }
    else {
      this.Username = this.router.snapshot.paramMap.get('id1')?.toString();
      if (this.Username == undefined)
      {
        this.Username = this.router.snapshot.queryParams['id1'];
      }
    }
    console.log("Username", this.Username);
    //await this.Citizenlogin(this.Username);
    await this.BeforeLogin();

    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);

  }

  async Citizenlogin(Loginssoid: string) {
    //debugger
    try {
      this.sSOLandingDataDataModel.Username = Loginssoid;
      this.sSOLandingDataDataModel.LoginType = '-999';
      this.sSOLandingDataDataModel.Password = Loginssoid;
      console.log("Loginssoid", Loginssoid);

      if (Loginssoid == undefined || Loginssoid == '' || Loginssoid == 'NaN' || Loginssoid.toString() == NaN.toString()) {
        window.open(this.appsettingConfig.SSOURL, "_self");
        return;
      }
      console.log("Loginssoid2", Loginssoid);
      await this.sSOLoginService.GetSSOUserDetails(Loginssoid, this.DepartmentID)
        .then(async (res: any) => {
          console.log("authtoken", res.headers.get('x-authtoken'));
          localStorage.setItem('authtoken', res.headers.get('x-authtoken'));
          var data = JSON.parse(JSON.stringify(res.body));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success)
          {
            this.sSOLoginDataModel = await data['Data'];

            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
            this.cookieService.set('LoginStatus', "OK");

            if (this.sSOLoginDataModel.RoleID == EnumRole.Emitra)
            {
              this.routers.navigate(['/emitradashboard']);
            }
            else if (this.sSOLoginDataModel.RoleID == 999)
            {
              this.routers.navigate(['/CandidateApplicationList']);
            }
            else if (this.sSOLoginDataModel.RoleID == 0)
            {
              this.openModalCource(this.modal_GenrateOTP);
            }
            else
            {
              this.CheckMultiColleges();
             // this.routers.navigate(['/dashboard']);
            }
          }
        }, error => console.error(error));

      if (this.sSOLoginDataModel.SSOID == '') {
        window.open(this.appsettingConfig.SSOURL, "_self");
        return;
      }
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

  async openModalCource(content: any) {
    ;

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
  }

  async UpdateStudentUserType() {
    try {
      
      this.Swal2.Confirmation("Are you sure you want to proceed with the <b>student / applicant</b> user type?",
        async (result: any) =>
      {
        if (result.isConfirmed)
        {
          this.CloseModal();
          this.requestUpdateUserType.ProfileID = this.sSOLoginDataModel.ProfileID;
          this.requestUpdateUserType.UserID = this.sSOLoginDataModel.UserID;
          this.requestUpdateUserType.SSOID = this.sSOLoginDataModel.SSOID;
          await this.sSOLoginService.UpdateStudentUserType(this.requestUpdateUserType)
            .then(async (res: any) => {
              var data = JSON.parse(JSON.stringify(res));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State == EnumStatus.Success)
              {
                this.sSOLoginDataModel.RoleID = EnumRole.Student;
                this.sSOLoginDataModel.UserType = EnumUserType.STUDENT;
                localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
                this.routers.navigate(['/dashboard']);
              }
              else
              {
                this.toastr.warning(this.ErrorMessage);
              }
            }, error => console.error(error));

          if (this.sSOLoginDataModel.SSOID == '') {
            window.open(this.appsettingConfig.SSOURL, "_self");
            return;
          }
        }
      }, 'OK');
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

  // check multi user department and login
  async BeforeLogin() {
    //debugger
    try {
      // check and get multiple department of user
      await this.sSOLoginService.CheckMultiDepartUserBySearchRecordID(this.Username)
        .then(async (res: any) => {
          if (res.State == EnumStatus.Success) {
            const SSOID = res.Data?.SSOID;
            const UserIDs = res.Data?.UserIDs;
            const DepartmentIDs = res.Data?.DepartmentIDs;
            if (DepartmentIDs.split(',').length == 1)
            { // run as it is
              await this.Citizenlogin(this.Username);
            }
            else
            {// choose department
              // show department selection popup and choose departmentid
              this.openUserDepartmentModal(this.modal_MultiDepartment);
            }
          }
          else { // any invalid
            this.toastr.error(res.Message);
            console.error(res.ErrorMessage);
          }
        }, error => console.error(error)
        );

    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  // multi department modal
  async openUserDepartmentModal(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CloseUserDepartmentModal() {
    this.modalService.dismissAll();
  }
  // end multi department modal

  async SetUserDepartmentAndProceed(item: any) {
    //debugger
    this.DepartmentID = item;
    this.CloseUserDepartmentModal();
    await this.Citizenlogin(this.Username); // login with departmentid
  }









  async SetUserInsitute(item: any)
  {
    this.sSOLoginDataModel.InstituteID = item.InstituteID;
    this.sSOLoginDataModel.InstituteName = item.CollegeName;
    localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
    this.CloseUserDepartmentModal();
    this.routers.navigate(['/dashboard']);
  }


  //section multiple insitute 
  // multi department modal
  async openUsermultipletModal(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async CheckMultiColleges() {

    try
    {
      debugger;
      // check and get multiple department of user
      await this.sSOLoginService.CheckMultiInsituteUser(this.sSOLoginDataModel.SSOID, '')
        .then(async (res: any) => {
          if (res.State == EnumStatus.Success) {
            this.MutiUserCollegeList = res.Data;

            if (this.MutiUserCollegeList?.length > 1)
            {
              this.openUsermultipletModal(this.modal_MultiInsitute);

            }
            else
            {
              this.routers.navigate(['/dashboard']);
            }
          }
          else { // any invalid
            this.toastr.error(res.Message);
            console.error(res.ErrorMessage);
          }
        }, error => console.error(error)
        );
    }
    catch (Ex) {
      console.log(Ex);
    }
  }





}
