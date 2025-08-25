import { Component } from '@angular/core';
//import { FormBuilder } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ItiExaminerService } from '../../../Services/ItiExaminer/iti-examiner.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
//import { ActivatedRoute } from '@angular/router';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ItiExaminerDataModel, ItiExaminerSearchModel } from '../../../Models/ItiExaminerDataModel';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';



@Component({
  selector: 'app-iti-examiner',
  templateUrl: './iti-examiner.component.html',
  styleUrls: ['./iti-examiner.component.css'],
  standalone: false
})
export class ItiExaminerComponent {
  examinerForm!: FormGroup;
  public Isverifed: boolean = false;
  public requestSSoApi = new CommonVerifierApiDataModel();
  public ExaminerId: number | null = null;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new ItiExaminerDataModel()
  public searchRequest = new ItiExaminerSearchModel();
  public DistrictMasterList: any = [];
  public DesignationMasterList: any = [];
  public StreamMasterList: any = [];
  public GenderList: any = [];
  public StaffID: number | null = null;


  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private ItiExaminerService: ItiExaminerService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal
  ) { }


  async ngOnInit() {
    
    this.examinerForm = this.fb.group({
      txtSSOID: ['', Validators.required],
      txtName: [{ value: '', disabled: true }, Validators.required],
      txtFatherName: ['', Validators.required],
      txtDateOfBirth: ['', Validators.required],
      ddlGender: ['', [DropdownValidators]],
      txtEmail: [{ value: '', disabled: true }, Validators.required],
      ddlDistrictID: ['', [DropdownValidators]],
      txtAddress: ['', Validators.required],
      txtAdharCardNumber: ['', Validators.required],
      txtBhamashahNo: ['', Validators.required],
      txtMobileNumber: [{ value: '', disabled: true }, Validators.required],
      txtHigherQualificationID: ['', Validators.required],
      ddlStreamID: ['', [DropdownValidators]],
      ddlDesignationID: ['', [DropdownValidators]],
      txtPostingPlace: ['', Validators.required],
      txtBankAccountNo: ['', Validators.required],
      txtIFSCCode: ['', Validators.required],
      txtBankName: ['', Validators.required]
      });
    //this.searchRequest.DepartmentID = 2;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDistrictMasterList()
    await this.GetStreamMasterList()
    await this.GetDesignationMasterList()

    await this.commonMasterService.GetCommonMasterData('Gender')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GenderList = data['Data'];
        console.log("GenderList", this.GenderList)
      }, (error: any) => console.error(error)
      );

    this.ExaminerId = Number(this.route.snapshot.queryParamMap.get('id')?.toString());

    

    //this.request.UserID = this.sSOLoginDataModel.UserID;
    //await this.loadInstituteDetails();
    //if (this.ExaminerId) {
    //  await this.GetByID(this.ExaminerId)
    //}

    //await this.GetByID(this.request.StaffID)

    this.StaffID = Number(this.routers.snapshot.queryParamMap.get("StaffID") ?? 0);

    if (this.StaffID) {
      await this.GetByID(this.StaffID)
      this.isUpdate = true
    }
   
  }

  async GetDistrictMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictMasterList = data['Data'];
         //console.log(this.DistrictMasterList)
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

  async GetDesignationMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DesignationMasterList = data['Data'];
          //console.log(this.DesignationMasterList)
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

  //async GetStreamMasterList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.StreamMaster()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.StreamMasterList = data['Data'];
  //        console.log(this.StreamMasterList);
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async GetStreamMasterList() {
    
    
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterList = data.Data;
        console.log("StreamMasterList", this.StreamMasterList)
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


  get form() { return this.examinerForm.controls; }

  async saveData() {
    this.isSubmitted = true;
    if (this.examinerForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      //if (this.ExaminerId) {
      //  this.request.ExaminerID = this.ExaminerId
      //  this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      //} else {
      //  this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      //}

      if (this.StaffID) {
       
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.ItiExaminerService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success)
          {
            this.ResetControl();
            this.toastr.success(this.Message)
            this.router.navigate(['/ITIExaminerList']);

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

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.ItiExaminerService.GetByID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.Data !== null) {
          this.request = data.Data;
          /* DateOfBirth show in Edit form with format */ 
          const dob = new Date(data['Data']['DateOfBirth']);
          const year = dob.getFullYear();
          const month = String(dob.getMonth() + 1).padStart(2, '0');
          const day = String(dob.getDate()).padStart(2, '0');
          this.request.DateOfBirth = `${year}-${month}-${day}`;

        }
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

    this.request = new ItiExaminerDataModel();
    this.examinerForm.reset();
    // Reset form values if necessary
    this.examinerForm.patchValue({
      SSOID: '',
      Name: '',
      FatherName: '',
      DateOfBirth: '',
      Gender: 0,
      Email: 0,
      districtID: 0,
      Address: '',
      AdharCardNumber: '',
      Bhamashah: '',
      MobileNumber: '',
      HigherQualificationID: '',
      StreamID: 0,
      DesignationID: 0,
      PostingPlace: '',
      BankAccountNo: '',
      IFSCCode: '',
      BankName: ''
    });

  }

  onCancel(): void {
     this.router.navigate(['/centers']);
  }

  async getSSODetailsBySSOID(SSOID: string): Promise<any> {
    this.Isverifed = false
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
          debugger
          let parsedData = JSON.parse(response.Data);
          if (parsedData != null) {
            this.request.Name = parsedData.displayName;
            this.request.MobileNumber = parsedData.mobile;
            this.request.SSOID = parsedData.SSOID;
            this.request.Email = parsedData.mailPersonal;
            this.Isverifed = true
          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
