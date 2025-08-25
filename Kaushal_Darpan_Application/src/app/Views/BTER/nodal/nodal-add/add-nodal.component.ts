import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NodalDataModel, VerifierApiDataModel, VerifierDataModel } from '../../../../Models/VerifierDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifierService } from '../../../../Services/DTE_Verifier/verifier.service';
import { EnumDepartment, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';

@Component({
  selector: 'app-add-nodal',
  templateUrl: './add-nodal.component.html',
  styleUrls: ['./add-nodal.component.css'],
  standalone: false
})
export class AddNodalComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public VerifierFormGroup!: FormGroup;
  public request = new NodalDataModel();
  public isSubmitted = false;
  public NodalId: number = 0

  public requestSSoApi = new CommonVerifierApiDataModel();

  constructor(
    private verifierService: VerifierService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private commonMasterService: CommonFunctionService,
  ) { }

  async ngOnInit() {
    this.VerifierFormGroup = this.formBuilder.group(
      {
        CenterName: [{ value: '' }, Validators.required],
        CenterCode: [{ value: '' }, Validators.required],
        OfficerName: [{ value: '' }, Validators.required],
        OfficerSSOID: ['', Validators.required],
        Address: ['', Validators.required],
        EmailAddress: [{ value: ''}, Validators.required],
        MobileNo: [{ value: '' }, Validators.required],
        chkActiveStatus: ['true']
      });
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.DepartmentId = this.SSOLoginDataModel.DepartmentID;
    this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng
    console.log("SSOLoginDataModle", this.SSOLoginDataModel);

    this.NodalId = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    if (this.NodalId) {
      await this.GetDataById(this.NodalId)
    }
  }

  get _VerifierFormGroup() { return this.VerifierFormGroup.controls; }

  async SaveVerifierData() {
    this.isSubmitted = true;
    if (this.VerifierFormGroup.invalid) {
      this.toastr.error('Invalid form');
      Object.keys(this.VerifierFormGroup.controls).forEach(key => {
        const control = this.VerifierFormGroup.get(key);

        if (control && control.invalid) {
          this.toastr.error(`Control ${key} is invalid`);
          Object.keys(control.errors!).forEach(errorKey => {
            this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          });
        }
      });
      return;

    }
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentId = this.SSOLoginDataModel.DepartmentID;
      if (this.request.NodalID == 0) {
        this.request.CreatedBy = this.SSOLoginDataModel.UserID;
        this.request.CreatedBy = this.SSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.SSOLoginDataModel.UserID;
      }
      this.request.DepartmentId = this.SSOLoginDataModel.DepartmentID;
     

      this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng
      this.request.Action = this.NodalId > 0 ?"UPDATE": "ADD";
      

      await this.commonMasterService.NodalCenterCreate(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message)
          this.ResetControl()
          this.router.navigate(['/nodal-list']);
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      }, (error: any) => console.error(error));
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

  async GetDataById(VerifierID: number) {
    try {
      this.loaderService.requestStarted();

      this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng
      this.request.Action = "List"

      await this.commonMasterService.NodalCenterList(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.request = data.Data[0];
        console.log(this.request, "request")
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new NodalDataModel();
    this.VerifierFormGroup.get('SSOID')?.enable();
  }


  //async SSOIDGetSomeDetails(SSOID: string) {

  //  // console.log('id test ', this.searchRequest.DivisionID);
  //  try {
  //    this.loaderService.requestStarted();


  //    https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/SIDDHA.AZAD/madarsa.test/Test@1234

  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {

    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            this.request.OfficerName = parsedData.displayName;
            this.request.MobileNo = parsedData.mobile;
            this.request.OfficerSSOID = parsedData.SSOID;
            this.request.EmailAddress = parsedData.mailPersonal;
            this.VerifierFormGroup.get('SSOID')?.disable();
          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }




    //try {
    //  this.loaderService.requestStarted();

    //  const result = await this.http.get<any>(url).toPromise();
    //  console.log('SSO Details:', result);



    //  return result;

    //} catch (ex) {
    //  console.error('Error fetching SSO details:', ex);
    //} finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }
}
