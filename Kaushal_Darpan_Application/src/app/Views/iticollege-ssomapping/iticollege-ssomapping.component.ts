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
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { AppsettingService } from '../../Common/appsetting.service';




@Component({
  selector: 'app-iticollege-ssomapping',
  standalone: false,
  templateUrl: './iticollege-ssomapping.component.html',
  styleUrl: './iticollege-ssomapping.component.css'
})

export class ITICollegeSSOMappingComponent implements OnInit {

  LoginType: any = "1";
  LoginRoleType: any;
  sSOLoginDataModel = new SSOLoginDataModel();
  sSOLandingDataDataModel = new SSOLandingDataDataModel();
  public State: number = -1;
  public Message: any = [];
  public CollegeData: any = [];
  public ResultMessage: any = [];
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
    private cookieService: CookieService, private Swal2: SweetAlert2,
    private formBuilder: FormBuilder, private appsettingConfig: AppsettingService,



  ) { }

  init() {



    this.loaderService.getSpinnerObserver().subscribe((status) => {
      this.cdRef.detectChanges();
    });
  }
  public configUrl: any = "";
  get _UserRequestFormGroup() { return this.UserRequestFormGroup.controls; }
  async ngOnInit() {


    this.LoginForm = this.formBuilder.group(
      {
        txtUserID: ['', Validators.required],
        txtPassword: ['', Validators.required],
        //ddldepartmentSelect: ['', Validators.required],
      })


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("sSOLoginDataModel", this.sSOLoginDataModel)


  }



  get form() { return this.LoginForm.controls; }









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
      await this.sSOLoginService.ItiCollegeMap(this.UserName, this.Password)
        .then((data: any) => {
          
          this.State = data['State'];
          this.Message = data['Message'];
          this.CollegeData = data['Data'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            const message = `
  <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
    <strong>College Name:</strong> ${this.CollegeData.CollegeName}<br/>
    Are you sure you want to map SSO with the college details?
  </div>
`;



            this.Swal2.Confirmation(message,
              async (result: any) => {
                //confirmed
                if (result.isConfirmed) {
                  try {
                    let objcollege =
                    {
                      CollegeID: this.CollegeData.CollegeID,
                      SSOID: this.sSOLoginDataModel.SSOID,
                      CollegeCode: ""
                    };
                    await this.sSOLoginService.CreateCollegePrincipal(objcollege)
                      .then((data: any) => {
                        this.State = data['State'];
                        this.Message = data['Message'];
                        this.ErrorMessage = data['ErrorMessage'];
                        if (this.State == EnumStatus.Success)
                        {
                          this.LoginRedirect(this.sSOLoginDataModel.SSOID);
                          this.toastr.success(this.Message)


                        }
                        else {
                          this.toastr.error(this.Message)
                        }
                      });
                  }
                  catch (ex) {
                    console.log(ex);
                  }
                  finally {
                    setTimeout(() => {
                      this.loaderService.requestEnded();
                    }, 200);
                  }
                }
              });

            /* this.OnReset()*/
          }
          else {
            this.toastr.error(this.Message)
          }
        })


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







  async LoginRedirect(ssoid: string) {



    //if (this.Department != 1) {
    //  return;
    //}
    this.loaderService.requestStarted();
    try {
      await this.sSOLoginService.login(ssoid, "KD@1230").subscribe({
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

            //redirect
            //window.open('/dashboard', "_self");
            this.routers.navigate(['/dashboard']);
          }
          else {
            this.toastr.error(this.Message);

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
