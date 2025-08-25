

import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SSOLandingDataDataModel, SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SSOLoginService } from '../../Services/SSOLogin/ssologin.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumStatus, EnumRole } from '../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserRequestModel } from '../../Models/UserRequestDataModel';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
@Component({
  selector: 'app-department-login',
  standalone: false,
  templateUrl: './department-login.component.html',
  styleUrl: './department-login.component.css'
})
export class DepartmentLoginComponent {
  LoginType: any = "1";
  LoginRoleType: any;
  sSOLoginDataModel = new SSOLoginDataModel();
  sSOLandingDataDataModel = new SSOLandingDataDataModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public SSOjson: any = [];
  public DivisionMasterList: any = [];
  public DistrictMasterList: any = [];
  public TehsilMasterList: any = [];
  public DesignationMasterList: any = [];
  public InstituteList: any = []
  public UserName: string = '';
  public Password: string = '';
  //public Department: number = 0;
  isSubmitted: boolean = false;
  public isLoading: boolean = false;
  LoginForm!: FormGroup;
  public SSOToken: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  request = new UserRequestModel()
  UserRequestFormGroup!: FormGroup;
  isLoginSuccessful: boolean = true;
  public _EnumRole = EnumRole;


  constructor(private activatedRoute: ActivatedRoute, private sSOLoginService: SSOLoginService,
    private toastr: ToastrService, private loaderService: LoaderService, private router: ActivatedRoute,
    private routers: Router, private cdRef: ChangeDetectorRef, private commonMasterService: CommonFunctionService, private modalService: NgbModal,
    private cookieService: CookieService,
    private formBuilder: FormBuilder) { }

  init() {

    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }
  public configUrl: any = "";
  get _UserRequestFormGroup() { return this.UserRequestFormGroup.controls; }
  async ngOnInit() {
    //

    this.LoginForm = this.formBuilder.group(
      {
        txtUserID: ['', Validators.required],
/*        txtPassword: ['', Validators.required],*/
        //ddldepartmentSelect: ['', Validators.required],
      })
    const element = document.getElementById('ddldepartmentSelect')
    if (element) element.focus();

    this.UserRequestFormGroup = this.formBuilder.group(
      {
        txtUserName: ['', Validators.required],
        txtUserEmail: ['', Validators.required],
        txtMobileNo: ['', Validators.required],
        ddlDesignation: ['', [DropdownValidators]],
        districtID: ['', Validators.required],
        divisionID: ['', Validators.required],
        InstituteID: ['', [DropdownValidators]],

      })
    await this.GetDivisionMasterList();
    await this.GetMasterData();
    await this.loadDropdownData('Institute');
    //test, replace this sso token with active
    this.SSOToken = "TkpSQkxReTE1bXByVE1TVFdYYTd0enh5d2oySTY1eHhKOExIYlJoWlRDK0R1eWVhZG9laTE3TzhVUC9lUHNYMTdGQWRNUEVMZnZOMXYvbXRkcmhxUWUzeUUvQVBRZ2ExNVVNQmdicFlpNmZNejhFM0tIMjJYck9JUU9aSDI4Sm5rNlNqT1AwdTNmR3lYdFVIV1Z4MFdqbzZDWXdra1RDM1JhSzFsM3REbUlaN1l2Q3BQdzMxdVNyb0x1WEwyd0Y3";

  }

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Institute':
          this.InstituteList = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetDesignationMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DesignationMasterList = data['Data'];
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
  get form() { return this.LoginForm.controls; }

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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


  async UserRequest(content: any) {
    //

    //const initialState = {
    //  Type: "Admin",
    //};


    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });
    /*this.modalReference.componentInstance.initialState = initialState;*/

  }

  async GetDivisionMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];

          //console.log(this.DivisionMasterList)
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

  async ddlDivision_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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

  async ddlDistrict_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.request.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];
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

  async SaveData() {
    this.isSubmitted = true;
    this.request.SSOID = this.sSOLoginDataModel.SSOID;
    this.request.UserID = this.sSOLoginDataModel.UserID;
    if (this.UserRequestFormGroup.invalid) {
      return
    }

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.sSOLoginService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            /* this.OnReset()*/
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  ResetControl() {
    this.isSubmitted = false;
    this.UserRequestFormGroup.reset();
  }
  CloseModalPopup() {
    this.modalService.dismissAll();
  }



  async Login() {


    this.isSubmitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    //if (this.Department != 1) {
    //  return;
    //}

    this.loaderService.requestStarted();
    try {
      this.Password='KD@1230'
      await this.sSOLoginService.login(this.UserName, this.Password).subscribe({
        next: (data) => {
          data = JSON.parse(JSON.stringify(data.body));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.sSOLoginDataModel = data['Data'];       

            //set user session 
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
            //set cookie
            this.cookieService.set('LoginStatus', "OK");

            if (this.sSOLoginDataModel.RoleID == 0 || this.sSOLoginDataModel.RoleID == null || this.sSOLoginDataModel.RoleID == undefined) {
              this.routers.navigate(['/bter-college-code-mapping']);
            } else {
              this.routers.navigate(['/dashboard']);
            }
            //redirect
            //window.open('/dashboard', "_self");
            
          }
          else {
            this.toastr.error(this.Message);
            this.sSOLoginDataModel.SSOID = this.UserName;
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
            this.routers.navigate(['/bter-college-code-mapping']);

          }
        },
        error: (error) => {
          //this.errorMessage = 'Invalid SSOID or Password';
        }
      });



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





  async CheckUserExists() {
    ;
    this.isSubmitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    this.loaderService.requestStarted();
    try {

      // Call the Login API
      await this.commonMasterService.CheckUserExists(this.UserName)
        .then(async (data: any) => {
          // Parse the API response
          data = JSON.parse(JSON.stringify(data.body));
          console.log(data)

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];


          if (this.State === EnumStatus.Success) {
            // Redirect to the dashboard
            //window.open('/dashboard', "_self");
            this.toastr.success("Exits!");
          }
          else if (this.State === EnumStatus.Warning) {
            window.open('/UserRequest', "_self");
          }

        }, (error: any) => {
          if (error.name === "HttpErrorResponse") {
            this.toastr.warning("Unable to service request.!");
          }

        });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 500);
    }
  }




  SSOLogin_Dummy(apiUrl: string) {
    var form = document.createElement("form");
    form.method = "POST";
    form.action = apiUrl;
    //
    var element1 = document.createElement("input");
    element1.name = "UserDetails";
    element1.value = this.SSOToken;
    form.appendChild(element1);
    //
    document.body.appendChild(form);
    form.submit();
  }

  GotoPassword() {
    if (this.UserName != '') {
      const txtPassword = document.getElementById('txtPassword')
      if (txtPassword) txtPassword.focus();
    }
  }
}
