import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
@Component({
  selector: 'app-bter-college-code-mapping',
  standalone: false,
  templateUrl: './bter-college-code-mapping.component.html',
  styleUrl: './bter-college-code-mapping.component.css'
})
export class BterCollegeCodeMappingComponent {
  LoginForm!: FormGroup;
  isSubmitted = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  State: number = -1;
  Message: any = [];
  CollegeData: any = [];
  ResultMessage: any = [];
  ErrorMessage: any = [];

  constructor(
    private fb: FormBuilder,
    private sSOLoginService: SSOLoginService,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
    private routers:Router,
    private loaderService: LoaderService,
    private cookieService: CookieService) {
  }

  ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.LoginForm = this.fb.group({
      txtUserID: ['', Validators.required],
      txtPassword: ['', Validators.required],
      depatmentID: [0, [DropdownValidators]]
    });
  }

  GotoPassword() {
    if (this.LoginForm.value.txtUserID != '') {
      const txtPassword = this.LoginForm.value.txtUserID.txtPassword;
      if (txtPassword) txtPassword.focus();
    }
  }

  async Login() {
    this.isSubmitted = true;
    if (this.LoginForm.invalid) {     
      return;
    }
    try {
      if (this.LoginForm.value.depatmentID == 1) {
        await this.sSOLoginService.BterCollegeMap(this.LoginForm.value.txtUserID, this.LoginForm.value.txtPassword)
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
                      await this.sSOLoginService.CreateBTERCollegePrincipal(objcollege)
                        .then((data: any) => {
                          this.State = data['State'];
                          this.Message = data['Message'];
                          this.ErrorMessage = data['ErrorMessage'];
                          if (this.State == EnumStatus.Success) {
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
            }
            else {
              this.toastr.error(this.Message)
            }
          })
      }
      if (this.LoginForm.value.depatmentID == 2) {
        await await this.sSOLoginService.ItiCollegeMap(this.LoginForm.value.txtUserID, this.LoginForm.value.txtPassword)
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
                          if (this.State == EnumStatus.Success) {
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
            }
            else {
              this.toastr.error(this.Message)
            }
          })
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

  async LoginRedirect(ssoid: string) {
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

}
