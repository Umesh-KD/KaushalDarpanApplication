import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CollegeMasterService } from '../../../Services/CollegeMaster/college-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
//import { CollegeMasteDataModels, CollegeMasterDataModels } from '../../../Models/CollegeMasterDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeMasterDataModels, CollegeMasterRequestModel } from '../../../Models/CollegeMasterDataModels';
import { EnumConfigurationType, EnumDepartment, EnumEmitraService, EnumFeeFor, EnumMessageType, EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EmitraRequestDetails, EmitraServiceAndFeeModel, EmitraServiceAndFeeRequestModel } from '../../../Models/PaymentDataModel';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { ApplicationMessageDataModel } from '../../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';

@Component({
  selector: 'app-add-college-master',
  templateUrl: './add-college-master.component.html',
  styleUrls: ['./add-college-master.component.css'],
  standalone: false
})
export class AddCollegeMasterComponent implements OnInit {
  instituteForm!: FormGroup;
  public isUpdate: boolean = false;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TehsilMasterList: any = [];
  public DivisionMasterList: any = [];
  public State: number = -1;
  public LevelMasterList: any = [];
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  showDgtCodeField = false;
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public DistrictMasterList: any = []
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new CollegeMasterDataModels();
  public filteredDistricts: any[] = [];
  public filteredTehsils: any[] = [];
  public categoryList: any = []
  public ManagmentTypeList: any = []
  public ManagmentTypeListNew: any = []
  public CollegeTypeList: any = []
  public CourseTypeList: any = []
  public IsCollegeType: boolean = false
  public CheckRoleID: number = 0;
  public ShowPaymentButton: boolean = false;
  emitraRequest = new EmitraRequestDetails();
  public PDFURL: string = '';
  public messageModel = new ApplicationMessageDataModel();
  public collegeRequest = new CollegeMasterRequestModel();
  public emitraServiceAndFeeRequest = new EmitraServiceAndFeeRequestModel();
  public emitraServiceAndFeeResponse = new EmitraServiceAndFeeModel();

  constructor(
    private formBuilder: FormBuilder,
    private instituteService: CollegeMasterService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private smsMailService: SMSMailService,
    private emitraPaymentService: EmitraPaymentService,
  ) { }

  async ngOnInit() {

    this.instituteForm = this.formBuilder.group({
      ssoid: [''],
      institutionCategoryID: [0, [DropdownValidators]],
      institutionManagementTypeID: [0, [DropdownValidators]],
      instituteNameEnglish: ['', Validators.required],
      instituteNameHindi: ['', Validators.required],
      email: [''],
      landNumber: [''],
      LandlineStd: [''],
      MobileNumber: ['', Validators.required],
      instituteCode: ['', Validators.required],
      faxNumber: [''],
      website: [''],
      //landlineNumber: [''],
      divisionID: ['0', [DropdownValidators]],
      districtID: ['0', [DropdownValidators]],
      tehsilID: ['0', [DropdownValidators]],
      address: [''],
      pinCode: [''],
      Capacity: [''],
      InstitutionDGTCode: [''],
      CollegeType: ['0', [DropdownValidators]],
      CourseType: ['', [DropdownValidators]],
      ActiveStatus: ['true'],

    });

    //debugger
    this.collegeRequest.InstituteID = Number(this.activatedRoute.snapshot.queryParamMap.get('id') ?? 0);
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;

    await this.GetDivisionMasterList();
    // await this.GetTehsilMasterList()
    // await this.GetDistrictMasterList()
    await this.GetCategory();
    await this.GetManagmentType();
    await this.GetCollegeType();
    await this.GetCouseType();
    await this.loadDropdownData('ManagementTypeCollege');

    //if (this.collegeRequest.InstituteID > 0) {
    //  await this.GetByID();
    //}

    await this.GetByID();// InstituteId or SSOID
    //set course type
    await this.ChangeCollegeType();
    //debugger

    this.CheckRoleID = this.sSOLoginDataModel.RoleID;
    if (this.CheckRoleID !== 33 && this.CheckRoleID !== 80 && this.CheckRoleID !== 81 && this.CheckRoleID !== 17 && this.CheckRoleID !== 18) {

      this.instituteForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.instituteForm.get('tehsilID')?.setValidators([DropdownValidators]);
      this.instituteForm.get('Capacity')?.setValidators([DropdownValidators]);
      this.instituteForm.get('address')?.setValidators([Validators.required]);
      this.instituteForm.get('pinCode')?.setValidators([Validators.required]);
    } else {
      // Remove validators for role ID 33
      this.instituteForm.get('email')?.clearValidators();
      this.instituteForm.get('tehsilID')?.clearValidators();
      this.instituteForm.get('Capacity')?.clearValidators();
      this.instituteForm.get('address')?.clearValidators();
      this.instituteForm.get('pinCode')?.clearValidators();
    }

    // Required to reflect changes in validation state
    this.instituteForm.get('email')?.updateValueAndValidity();
    this.instituteForm.get('tehsilID')?.updateValueAndValidity();
    this.instituteForm.get('Capacity')?.updateValueAndValidity();
    this.instituteForm.get('address')?.updateValueAndValidity();
    this.instituteForm.get('pinCode')?.updateValueAndValidity();


  }

  ChangeCollegeType() {
    if (this.request.CollegeTypeID == 22) {
      this.IsCollegeType = true
    }
    else {
      this.IsCollegeType = false
    }
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


  async PayCollegeFees() {
    //debugger
    let isSuccess = await this.saveData(true);//save the data

    if (isSuccess == false) {
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to Make Payment?", async (result: any) => {
      if (!result.isConfirmed) return;


      //get service and fee
      await this.GetEmitraServiceAndFeeData();

      this.isLoading = true;
      this.emitraRequest = new EmitraRequestDetails();
      this.emitraRequest.Amount = Number(this.emitraServiceAndFeeResponse?.ApplicationFees);
      this.emitraRequest.ProcessingFee = 0;
      this.emitraRequest.InstituteIDEnc = this.request.InstituteID.toString();

      if (this.sSOLoginDataModel.IsKiosk) {
        this.emitraRequest.ServiceID = this.sSOLoginDataModel.ServiceID;
        this.emitraRequest.KIOSKCODE = this.sSOLoginDataModel.KIOSKCODE;
        this.emitraRequest.SSoToken = this.sSOLoginDataModel.SSoToken;
        this.emitraRequest.FormCommision = [EnumEmitraService.BTER_DeplomaENG_Emitra_AppplicationFeeService,
        EnumEmitraService.BTER_DeplomaNonENG_Emitra_AppplicationFeeService,
        EnumEmitraService.BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService,
        EnumEmitraService.BTER_DegreeNonENG_Emitra_AppplicationFeeService,
        EnumEmitraService.BTER_DegreeLateral_2Year_Emitra_AppplicationFeeService
        ].includes(Number(this.sSOLoginDataModel.ServiceID)) ? this.request.FormCommision : 0;
      } else {
        this.emitraRequest.ServiceID = this.emitraServiceAndFeeResponse?.ServiceId;
        this.emitraRequest.ID = this.emitraServiceAndFeeResponse?.UniqueServiceID ?? 0;
        this.emitraRequest.FormCommision = 0;
      }

      // Common Request Values
      this.emitraRequest.IsKiosk = this.sSOLoginDataModel.IsKiosk;
      this.emitraRequest.UserName = this.request?.InstituteNameEnglish?.replace(/[^a-zA-Z ]/g, '')?.substring(1, 40);//giving error for character
      this.emitraRequest.MobileNo = this.request.MobileNumber;
      this.emitraRequest.InstituteID = this.request.InstituteID;
      this.emitraRequest.SsoID = this.sSOLoginDataModel.SSOID;
      this.emitraRequest.TypeID = EnumConfigurationType.Bter_CollegeFee;
      this.emitraRequest.DepartmentID = EnumDepartment.BTER;
      this.emitraRequest.FeeFor = EnumFeeFor.CollegeFee;
      this.emitraRequest.USEREMAIL = this.request.Email;

      try {
        if (this.emitraRequest.IsKiosk) {//emitra
          const data: any = await this.emitraPaymentService.EmitraCollegePayment(this.emitraRequest);
          const parsedData = JSON.parse(JSON.stringify(data));

          this.State = parsedData.State;
          this.Message = parsedData.Message;
          this.ErrorMessage = parsedData.ErrorMessage;
          this.PDFURL = parsedData.PDFURL;

          if (parsedData.State === EnumStatus.Success) {
            this.request.IsPayment = true; //Important Line
            this.Swal2.ConfirmationSuccess("Thank you! Your payment was successful", async (res: any) => {
              if (res.isConfirmed) {
                try {
                  await this.SendApplicationMessage();
                  window.open(this.PDFURL, '_blank');
                  setTimeout(() => window.location.reload(), 200);
                } catch (ex) {
                  console.log(ex);
                }
              } else {
                this.toastr.error(this.Message ?? this.ErrorMessage);
              }
            });
          } else {
            this.toastr.error(this.Message ?? this.ErrorMessage);
          }

        } else {//without emitra
          const data: any = await this.emitraPaymentService.EmitraCollegePaymentNew(this.emitraRequest);
          const parsedData = JSON.parse(JSON.stringify(data));

          this.State = parsedData.State;
          this.Message = parsedData.Message;
          this.ErrorMessage = parsedData.ErrorMessage;

          if (parsedData.State === EnumStatus.Success) {
            this.request.IsPayment = true; //Important Line
            await this.RedirectEmitraPaymentRequest(
              parsedData.Data.MERCHANTCODE,
              parsedData.Data.ENCDATA,
              parsedData.Data.PaymentRequestURL
            );
          } else {
            this.toastr.error(this.Message ?? this.ErrorMessage);
          }
        }
      } catch (ex) {
        console.error(ex);
      }
    });
  }


  RedirectEmitraPaymentRequest(pMERCHANTCODE: any, pENCDATA: any, pServiceURL: any) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", pServiceURL);

    //Hidden Encripted Data
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "ENCDATA");
    hiddenField.setAttribute("value", pENCDATA);
    form.appendChild(hiddenField);

    //Hidden Service ID
    var hiddenFieldService = document.createElement("input");
    hiddenFieldService.setAttribute("type", "hidden");
    hiddenFieldService.setAttribute("name", "SERVICEID");
    hiddenFieldService.setAttribute("value", this.emitraRequest.ServiceID);
    form.appendChild(hiddenFieldService);
    //Hidden Service ID
    var MERCHANTCODE = document.createElement("input");
    MERCHANTCODE.setAttribute("type", "hidden");
    MERCHANTCODE.setAttribute("name", "MERCHANTCODE");
    MERCHANTCODE.setAttribute("value", pMERCHANTCODE);
    form.appendChild(MERCHANTCODE);



    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  async SendApplicationMessage() {
    try {
      this.loaderService.requestStarted();
      this.messageModel.MobileNo = this.request.MobileNumber;
      this.messageModel.MessageType = EnumMessageType.ApplicationMessageBTER;
      this.messageModel.ApplicationNo = this.request.ApplicationNo;
      await this.smsMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success('Message sent successfully');
          } else {
            this.toastr.warning('Something went wrong');
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'ManagementTypeCollege':
          this.ManagmentTypeListNew = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  async GetCouseType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStreamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseTypeList = data['Data'];
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

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ManagmentTypeList = data['Data'];
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

  async GetCategory() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.categoryList = data['Data'];
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

  async GetCollegeType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CollegeType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeTypeList = data['Data'];
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

  // async GetTehsilMasterList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetTehsilMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.TehsilMasterList = data['Data'];
  //         console.log(this.TehsilMasterList)
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  // async GetDistrictMasterList() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.GetDistrictMaster()
  //       .then((data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         this.DistrictMasterList = data['Data'];
  //         console.log(this.DistrictMasterList)
  //         // console.log(this.DivisionMasterList)
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  async GetByID() {
    try {
      this.collegeRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.collegeRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.collegeRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.collegeRequest.RoleID = this.sSOLoginDataModel.RoleID;
      //get
      await this.instituteService.GetByID(this.collegeRequest)
        .then(async (data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.request = data;//data

          this.request.SSOID = data['Data']["SSOID"];
          this.request.Address = data['Data']["Address"];
          this.request.CollegeTypeID = data['Data']["CollegeTypeID"];
          this.request.CourseTypeID = data['Data']["CourseTypeID"];
          this.request.DivisionID = data['Data']["DivisionID"];
          await this.ddlDivision_Change();
          this.request.DistrictID = data['Data']["DistrictID"];
          await this.ddlDistrict_Change();
          this.request.TehsilID = data['Data']["TehsilID"];
          this.request.Email = data['Data']["Email"];
          this.request.FaxNumber = data['Data']["FaxNumber"];
          this.request.MobileNumber = data['Data']["MobileNumber"];
          this.request.InstituteCode = data['Data']["InstituteCode"];
          this.request.InstitutionManagementTypeID = data['Data']["InstitutionManagementTypeID"];
          this.request.InstitutionCategoryID = data['Data']["InstitutionCategoryID"];
          this.request.LandlineStd = data['Data']["LandlineStd"];
          this.request.LandNumber = data['Data']["LandNumber"];
          this.request.Website = data['Data']["Website"];
          this.request.InstituteNameEnglish = data['Data']["InstituteNameEnglish"];
          this.request.InstituteNameHindi = data['Data']["InstituteNameHindi"];
          this.request.PinCode = data['Data']["PinCode"];
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
          this.request.InstitutionDGTCode = data['Data']['InstitutionDGTCode']
          this.request.InstituteID = data['Data']['InstituteID']
          this.request.IsPayment = data['Data']['IsPayment']
          this.request.CreatedBy = data['Data']['CreatedBy'];
          this.request.Capacity = data['Data']['Capacity'];

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
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

  onDivisionChange() {

    const selectedDivisionID = this.request.DivisionID;

    this.filteredDistricts = this.DistrictMasterList.filter((district: any) => district.ID == selectedDivisionID);

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

  onDistrictChange() {
    const selectedDistrictID = this.request.DistrictID;
    this.filteredTehsils = this.TehsilMasterList.filter((tehsil: any) => tehsil.ID == selectedDistrictID);
  }

  get form() { return this.instituteForm.controls; }

  async saveData(withPayment: boolean = false): Promise<boolean | void> {
    //debugger;

    // Default Capacity to 0 if empty
    if (this.request.Capacity?.toString() === "") {
      this.request.Capacity = 0;
    }

    this.isSubmitted = true;

   
    this.refreshAdminRefValidation();
    this.refreshCourseTypeRefValidation();
    debugger
    // Skip form validation only for Admin roles
    const isAdminRole = this.sSOLoginDataModel.RoleID === EnumRole.Admin || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon;
    if (!isAdminRole) {
      this.toastr.warning("Unauthorized role!");
      return false;
    }
    else if (this.instituteForm.invalid) {
      return false;
    }

   
    this.isLoading = true;

    try {
      debugger
      if (this.collegeRequest.InstituteID > 0) {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }

      
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.FinancialYearId = this.sSOLoginDataModel.FinancialYearID;
      this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
      this.request.IsProfileComplete = true;

      // Save data via service
      const data: any = await this.instituteService.SaveData(this.request);

      this.State = data['State'];
      this.Message = data['Message'];
      this.ErrorMessage = data['ErrorMessage'];
      debugger
      if (this.State === EnumStatus.Success) {
        if (!withPayment && this.collegeRequest.InstituteID > 0) {
          this.toastr.success(this.Message);
          this.routers.navigate(['/collegemaster']);
        }
      } else {
        this.toastr.error(this.ErrorMessage);
        return false;
      }
    } catch (ex) {
      console.error('Save error:', ex);
    } finally {
      this.isLoading = false;  
    }
  }

  //async saveData(withPayment: boolean = false): Promise<boolean | void> {
  //  // Default Capacity to 0 if empty
  //  if (this.request.Capacity?.toString() === "") {
  //    this.request.Capacity = 0;
  //  }

  //  this.isSubmitted = true;

  //  // Reset validations
  //  this.refreshAdminRefValidation();
  //  this.refreshCourseTypeRefValidation();

  //  const isAdminRole =
  //    this.sSOLoginDataModel.RoleID === EnumRole.Admin ||
  //    this.sSOLoginDataModel.RoleID === EnumRole.AdminNon;

  //  if (!isAdminRole && this.instituteForm.invalid) {
  //    return false;
  //  }

  //  this.isLoading = true;

  //  try {
  //    // Audit info
  //    if (this.collegeRequest.InstituteID > 0) {
  //      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
  //    } else {
  //      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
  //    }

  //    // Session-based info
  //    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.request.FinancialYearId = this.sSOLoginDataModel.FinancialYearID;
  //    this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
  //    this.request.IsProfileComplete = true;

  //    // API call
  //    const data: any = await this.instituteService.SaveData(this.request);

  //    this.State = data['State'];
  //    this.Message = data['Message'];
  //    this.ErrorMessage = data['ErrorMessage'];

  //    // Handle success
  //    if (this.State === EnumStatus.Success) {

  //      this.toastr.success(data.Message)
        
  //      //   Navigate after success
  //        this.routers.navigate(['/collegemaster']);
        
  //    } else {
  //      // Error from API
  //      this.toastr.error(this.ErrorMessage || 'Something went wrong');
  //      return false;
  //    }
  //  } catch (ex) {
  //    // Runtime error
  //    console.error('Save error:', ex);
  //    this.toastr.error('Unexpected error occurred while saving data.');
  //  } finally {
  //    this.isLoading = false;
  //  }
  //}




  private async proceedToSave() {
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.collegeRequest.InstituteID > 0) {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.FinancialYearId = this.sSOLoginDataModel.FinancialYearID;
      this.request.EndTermId = this.sSOLoginDataModel.EndTermID;

      const data: any = await this.instituteService.SaveData(this.request);

      this.State = data['State'];
      this.Message = data['Message'];
      this.ErrorMessage = data['ErrorMessage'];

      if (this.State == EnumStatus.Success) {
        this.toastr.success(this.Message);
        this.routers.navigate(['/collegemaster']);
      } else {
        this.toastr.error(this.ErrorMessage);
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new CollegeMasterDataModels();
    this.instituteForm.reset();
    this.instituteForm.patchValue({
      institutionCategoryID: 0,
      institutionManagementTypeID: 0,
      divisionID: '0',
      districtID: '0',
      tehsilID: '0',
      CollegeType: '0',
      CourseType: '',
      ActiveStatus: 'true'
    });
  }

  onCancel(): void {
    this.routers.navigate(['/collegemaster']);
  }

  refreshCourseTypeRefValidation() {
    // clear
    this.instituteForm.get('CourseType')?.clearValidators();
    // set
    if (this.request.CollegeTypeID == 22) {
      this.instituteForm.get('CourseType')?.setValidators([DropdownValidators]);
    }
    // update
    this.instituteForm.get('CourseType')?.updateValueAndValidity();
  }

  refreshAdminRefValidation() {
    debugger
    // clear
    this.instituteForm.get('CollegeType')?.clearValidators();
    this.instituteForm.get('instituteNameEnglish')?.clearValidators();
    this.instituteForm.get('instituteNameHindi')?.clearValidators();
    this.instituteForm.get('pinCode')?.clearValidators();
    this.instituteForm.get('Capacity')?.clearValidators();
    // set
    if ([33, 80, 81, 17].includes(this.sSOLoginDataModel.RoleID) == false) {
      this.instituteForm.get('CollegeType')?.setValidators([DropdownValidators]);
      this.instituteForm.get('instituteNameEnglish')?.setValidators(Validators.required);
      this.instituteForm.get('instituteNameHindi')?.setValidators(Validators.required);
      this.instituteForm.get('pinCode')?.setValidators(Validators.required);
      this.instituteForm.get('Capacity')?.setValidators([DropdownValidators]);
    }
    // update
    this.instituteForm.get('CollegeType')?.updateValueAndValidity();
    this.instituteForm.get('instituteNameEnglish')?.updateValueAndValidity();
    this.instituteForm.get('instituteNameHindi')?.updateValueAndValidity();
    this.instituteForm.get('pinCode')?.updateValueAndValidity();
    this.instituteForm.get('Capacity')?.updateValueAndValidity();
  }

  async GetEmitraServiceAndFeeData() {
    try {
      this.emitraServiceAndFeeRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.emitraServiceAndFeeRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.emitraServiceAndFeeRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.emitraServiceAndFeeRequest.RoleID = this.sSOLoginDataModel.RoleID;

      this.emitraServiceAndFeeRequest.FeeFor = EnumFeeFor.CollegeFee;
      this.emitraServiceAndFeeRequest.TypeID = EnumConfigurationType.Bter_CollegeFee;
      //get
      await this.emitraPaymentService.GetEmitraServiceAndFeeData(this.emitraServiceAndFeeRequest)
        .then((data: any) => {
          this.emitraServiceAndFeeResponse = data.Data;
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  refreshPaymentRefValidation() {
    //debugger
    // clear
    this.instituteForm.get('CourseType')?.clearValidators();
    this.instituteForm.get('CollegeType')?.clearValidators();
    this.instituteForm.get('instituteNameEnglish')?.clearValidators();
    this.instituteForm.get('instituteNameHindi')?.clearValidators();
    this.instituteForm.get('pinCode')?.clearValidators();
    this.instituteForm.get('Capacity')?.clearValidators();
    this.instituteForm.get('MobileNumber')?.clearValidators();
    // set
    this.instituteForm.get('MobileNumber')?.setValidators(Validators.required);
    // update
    this.instituteForm.get('MobileNumber')?.updateValueAndValidity();
    this.instituteForm.get('CollegeType')?.updateValueAndValidity();
    this.instituteForm.get('instituteNameEnglish')?.updateValueAndValidity();
    this.instituteForm.get('instituteNameHindi')?.updateValueAndValidity();
    this.instituteForm.get('pinCode')?.updateValueAndValidity();
    this.instituteForm.get('Capacity')?.updateValueAndValidity();
    this.instituteForm.get('CourseType')?.updateValueAndValidity();
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

 DropdownValidators(control: AbstractControl) {
  return control.value && control.value !== 0 ? null : { required: true };
}

}





