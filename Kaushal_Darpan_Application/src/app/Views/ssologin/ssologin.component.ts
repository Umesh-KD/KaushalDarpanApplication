import { AfterViewInit, ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SSOLandingDataDataModel, SSOLoginDataModel, UpdateStudentDetailsModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SSOLoginService } from '../../Services/SSOLogin/ssologin.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { EnumRole, EnumStatus, EnumUserType, GlobalConstants } from '../../Common/GlobalConstants';
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
  Username: any;
  LoginRoleType: any;
  sSOLoginDataModel = new SSOLoginDataModel();
  sSOLandingDataDataModel = new SSOLandingDataDataModel();
  requestUpdateUserType = new UpdateStudentDetailsModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public SSOjson: any = [];
  //Modal Boostrap
  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  @ViewChild('modal_UserLoginType') modal_GenrateOTP: any;



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

    console.log("AppName", this.appsettingConfig.AppName);
    this.loaderService.requestStarted();
    if (this.cookieService.get(this.appsettingConfig.AppName) != null && this.cookieService.get(this.appsettingConfig.AppName) != '') {
      this.Username = this.cookieService.get(this.appsettingConfig.AppName);
      this.cookieService.delete(this.appsettingConfig.AppName)
    }
    else {
      this.Username = this.router.snapshot.paramMap.get('id1')?.toString();
      if (this.Username == undefined) {
        this.Username = this.router.snapshot.queryParams['id1'];
      }
    }
    console.log("Username", this.Username);
    await this.Citizenlogin(this.Username);

    setTimeout(() => {

      this.loaderService.requestEnded();
    }, 200);

  }

  async Citizenlogin(Loginssoid: string) {

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
      await this.sSOLoginService.GetSSOUserDetails(Loginssoid)
        .then(async (res: any) => {
          console.log("authtoken", res.headers.get('x-authtoken'));
          localStorage.setItem('authtoken', res.headers.get('x-authtoken'));
          var data = JSON.parse(JSON.stringify(res.body));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.SSOjson = "{\"ssoid\": \"" + Loginssoid + "\",\"AadhaarId\": \"444088094507722\",\"BhamashahId\": null,\"BhamashahMemberId\": null,\"DisplayName\": \"RISHI KAPOOR\",\"DateOfBirth\": \"17/09/1991\",\"Gender\": \"MALE\",\"MobileNo\": null,\"TelephoneNumber\": \"07742860212\",\"IpPhone\": null,\"MailPersonal\": \"RISHIKAPOORDELHI@GMAIL.COM\",\"PostalAddress\": \"D-119D 119, GALI NO 6 GAUTAM MARG, NIRMAN NAGAR\",\"PostalCode\": \"302019\",\"l\": \"JAIPUR\",\"st\": \"RAJASTHAN\",\"Photo\": null,\"Designation\": \"CITIZEN\",\"Department\": \"GOOGLE\",\"MailOfficial\": null,\"EmployeeNumber\": null,\"DepartmentId\": null,\"FirstName\": \"RISHI\",\"LastName\": \"KAPOOR\",\"Sldssoids\": null,\"JanaadhaarId\": null,\"ManaadhaarMemberId\": null,\"UserType\": \"CITIZEN\",\"Mfa\": \"0\",\"roleid\": \"" + this.roleid + "\",\"RoleName\": \"" + this.RoleName + "\",\"DepartmentID\": \"" + this.DepartmentID + "\"} ";

          if (this.State == EnumStatus.Success)
          {
            this.sSOLoginDataModel = await data['Data'];
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
            this.cookieService.set('LoginStatus', "OK");
            if (this.sSOLoginDataModel.RoleID == EnumRole.Emitra)
            {
              this.routers.navigate(['/emitradashboard']);
            }
            else if (this.sSOLoginDataModel.RoleID == 0) {
              //open popup
              this.openModalCource(this.modal_GenrateOTP);
            }
            else {
              this.routers.navigate(['/dashboard']);
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

}
