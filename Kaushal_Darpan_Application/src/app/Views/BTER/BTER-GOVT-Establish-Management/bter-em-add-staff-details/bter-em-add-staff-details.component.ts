import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumEMProfileStatus, EnumDepartment, EnumStatus, GlobalConstants, EnumRole } from '../../../../Common/GlobalConstants';
import { BTER_EM_AddStaffDetailsDataModel, BTER_EM_GetPersonalDetailByUserID, Bter_RequestUpdateStatus, BTERGovtEMStaff_ServiceDetailsOfPersonalModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { IStateMasterDataModel, StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StaffDetailsDataModel, StaffSubjectList } from '../../../../Models/StaffMasterDataModel';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';

@Component({
  selector: 'app-bter-em-add-staff-details',
  standalone: false,
  templateUrl: './bter-em-add-staff-details.component.html',
  styleUrl: './bter-em-add-staff-details.component.css'
})
export class BterEMAddStaffDetailsComponent {
  StaffMasterFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  public AddsubjectFormGroup!: FormGroup;
  public request = new BTER_EM_AddStaffDetailsDataModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public StreamSearch = new StreamDDL_InstituteWiseModel()
  public requestUser = new BTER_EM_GetPersonalDetailByUserID();
  public finalSubmitRequest = new Bter_RequestUpdateStatus();
  AddedServiceList: BTERGovtEMStaff_ServiceDetailsOfPersonalModel[] = [];
  AddedServiceListAdded: BTERGovtEMStaff_ServiceDetailsOfPersonalModel[] = [];
  public Addrequest = new StaffSubjectList();
  public InstituteMasterDDLList: any = [];
  public DesignationMasterDDLList: any = [];
  public RoleMasterDDLList: any = [];
  public StaffTypeMasterDDLList: any = [];
  public CourseMasterDDL: any = [];
  public GenderList: any = [];
  public OfficeList: any[] = [];
  public StreamTypeList: any = [];
  public ExamTypeList: any = [];
  public SemesterList: any = [];
  public SubjectMasterDDL: any = [];
  public ShowAllSemester: number = 0;
  public StateMasterList: IStateMasterDataModel[] = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public _EnumRole = EnumRole;
  public isAddrequest: boolean = false;
  public AddedChoices: StaffSubjectList[] = [];
  staffDetailsFormData = new StaffDetailsDataModel();
  public IsOptional: boolean = false
  _enumDepartment = EnumDepartment
  public ExamTypeHeading = '';
  public requestSSoApi = new CommonVerifierApiDataModel();
  public GetGenderID: number = 0;
  public IsHideShow: boolean = false
  public IsSubjectlistTech: boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  async ngOnInit() {

    this.StaffMasterFormGroup = this.formBuilder.group({
      InstituteID: [{ value: 0, disabled: true }],
      BranchID: [0,],
      DesignationID: [0, [DropdownValidators]],
      ServiceBookBranchID: [0,],
      Gender: [0, [DropdownValidators]],

      Name: ['', [Validators.required]],
      DateOfBirth: ['', [Validators.required]],
      DateOfAppointment: ['', [Validators.required]],
      DateOfJoining: ['', [Validators.required]],

      MobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      SSOID: ['', [Validators.required]],
      EmployeeID: [''],

      CurrentDesignationID: ['', [DropdownValidators]],

      Experience: ['', [Validators.required]],

      QualificationAtJoining: ['', [Validators.required]],
      QualificationAfterJoining: ['', [Validators.required]],

      DateOfRetirement: [''],
      Remark: [''],
    });

    this.AddsubjectFormGroup = this.formBuilder.group({
      ddlCourse: ['', [DropdownValidators]],
      ddlSubjectID: ['', [DropdownValidators]],
      ddlSemesterID: ['', [DropdownValidators]],
      ddlExamType: ['', [DropdownValidators]],
      ddlStreamType: ['', [DropdownValidators]],
      IsOptional: [''],

      // ITICourse: ['', [DropdownValidators]],
      // ITISubjectID: ['', [DropdownValidators]],
      // ITISemesterID: ['', [DropdownValidators]],
      // ITIExamType: ['', [DropdownValidators]],
      // ITIStreamType: ['', [DropdownValidators]],
    })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;

    if ([8, 60, 199, 200].includes(this.sSOLoginDataModel.RoleID)) {
      this.IsHideShow = true;
      this.StaffMasterFormGroup.controls['BranchID'].setValidators([DropdownValidators]);
      this.StaffMasterFormGroup.controls['ServiceBookBranchID'].setValidators([DropdownValidators]);

      

    } else {
      this.IsHideShow = false;
      this.StaffMasterFormGroup.controls['BranchID'].clearValidators();
      this.StaffMasterFormGroup.controls['ServiceBookBranchID'].clearValidators();

    }
    this.StaffMasterFormGroup.controls['BranchID'].updateValueAndValidity();
    this.StaffMasterFormGroup.controls['ServiceBookBranchID'].updateValueAndValidity();

    await this.GetOfficeList();
    await this.GetInstituteMaster();
    await this.getStreamMasterData();
    await this.GetDesignationMasterData();
    await this.GetManageDDl();
   
    if(this.sSOLoginDataModel.UserID > 0) {
      await this.GetPersonalDetailByUserID();
    }
    await this.SSOIDGetSomeDetails(this.sSOLoginDataModel.SSOID);
  }
  get _AddsubjectFormGroup() { return this.AddsubjectFormGroup.controls; }
  get _StaffMasterFormGroup() { return this.StaffMasterFormGroup.controls; }



  async GetManageDDl() {


    await this.commonMasterService.GetExamType()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data['Data']);
        this.ExamTypeList = data['Data'];
        console.log(this.ExamTypeList, "ExamTypeList");
      }, error => console.error(error));

    await this.commonMasterService.GetStreamType()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data['Data']);
        this.StreamTypeList = data['Data'];
        console.log(this.StateMasterList);
      }, error => console.error(error));
  }

  async getStreamMasterData() {
    try {
      this.StreamSearch.InstituteID = this.sSOLoginDataModel.InstituteID
      this.StreamSearch.StreamType = this.sSOLoginDataModel.Eng_NonEng
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamDDLInstituteIdWise(this.StreamSearch).then((data: any) =>
      {
        data = JSON.parse(JSON.stringify(data));
        this.CourseMasterDDL = data.Data;
        console.log("StreamMasterList", this.CourseMasterDDL)
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

  async ChangeSemester() {

    try {

      this.loaderService.requestStarted();
      this.ShowAllSemester = this.Addrequest.ExamTypeID
      await this.commonMasterService.ChangeSemester(this.ShowAllSemester)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.SemesterList = data['Data'];
          
          
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

  async GetSubjectMasterDDL() {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.Addrequest.BranchID, this.sSOLoginDataModel.DepartmentID, this.Addrequest.SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.SubjectMasterDDL = data.Data;
        console.log("SubjectMasterList", this.SubjectMasterDDL);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDesignationMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterDDLList = data.Data;
        this.StaffMasterFormGroup.patchValue({
          CurrentDesignationID: this.request.CurrentDesignationID || '0'
        });
        // console.log("DesignationMasterList", this.DesignationMasterDDLList);
      }, error => console.error(error))

      await this.commonMasterService.GetCommonMasterDDLByType('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList);
        }, (error: any) => console.error(error)
        );
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetPersonalDetailByUserID() {
    try {
      
      this.loaderService.requestStarted();
      this.requestUser.SSOID = this.sSOLoginDataModel.SSOID;
      this.requestUser.StaffUserID = this.sSOLoginDataModel.UserID;
      await this.bterEstablishManagementService.BTER_EM_GetPersonalDetailByUserID(this.requestUser).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.request = data.Data[0];
          /*this.staffDetailsFormData.StaffSubjectListModel = request.*/
          console.log("GetPersonalDetailByUserID", this.request);
          debugger
          //this.StaffMasterFormGroup.get('InstituteID')?.setValue(this.request.InstituteID);
        }

        
        
      }, error => console.error(error))

      await this.bterEstablishManagementService.BterStaffSubjectListModel(this.sSOLoginDataModel.StaffID, this.sSOLoginDataModel.DepartmentID).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          debugger
          
          
          this.staffDetailsFormData.StaffSubjectListModel = data?.Data?.bterStaffSubjectListModel;
          
          this.staffDetailsFormData.StaffSubjectListModel.forEach(e => {
            e.SubjectType = e.IsOptional ? 'Optional' : 'Teaching'


            const examTypeItem = this.staffDetailsFormData.StaffSubjectListModel?.find(e => e.ExamType != null);
            if (examTypeItem) {
              this.ExamTypeHeading = examTypeItem.ExamType;
            }

          })
        
        }

        

      }, error => console.error(error))



    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetOfficeList() {
    this.request.OfficeID = 0;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          if (this.sSOLoginDataModel.RoleID == 194) {
            this.OfficeList = this.OfficeList.filter(x => x.ID == 19);
          }
          if (this.sSOLoginDataModel.RoleID == 50) {
            this.OfficeList = this.OfficeList.filter(x => x.ID == 18);
          }
          console.log(this.OfficeList, "OfficeList")
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
  GetInstituteMaster() {
    const officeList = [
      { InstituteID: 10001, InstituteName: 'DTE', OfficeTypeID: 17 },
      { InstituteID: 10002, InstituteName: 'BTER', OfficeTypeID: 18 },
      { InstituteID: 10003, InstituteName: 'TTC', OfficeTypeID: 19 }
    ];

    this.commonMasterService.InstituteMaster(
      this.sSOLoginDataModel.DepartmentID,
      this.sSOLoginDataModel.Eng_NonEng,
      this.sSOLoginDataModel.EndTermID
    ).then((response: any) => {
      const instituteList = Array.isArray(response?.Data) ? response.Data : [];
      this.InstituteMasterDDLList = officeList.concat(instituteList);
    });
  }

  checkoptional() {
    this.Addrequest.IsOptional = !this.Addrequest.IsOptional;
    if (!this.Addrequest.IsOptional) {
      this.Addrequest.IsOptional = false
    }
  }
  async SaveData() {
    debugger
    this.isSubmitted = true;
    if (this.StaffMasterFormGroup.invalid) {
      this.StaffMasterFormGroup.markAllAsTouched();
      return;
    }

    if (this.sSOLoginDataModel.RoleID === this._EnumRole.Teacher) {
      const hasSubjects = this.staffDetailsFormData.StaffSubjectListModel?.length > 0;
      if (!hasSubjects) {
        this.toastr.warning('Please enter subject details for the teacher !');
        return;
      }
    }

    this.loaderService.requestStarted();
    this.request.StaffUserID = this.sSOLoginDataModel.UserID;
    this.request.bterStaffSubjectListModel = this.staffDetailsFormData.StaffSubjectListModel;
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;

    try {
      await this.bterEstablishManagementService.BTER_EM_AddStaffDetails(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          if (this.sSOLoginDataModel.UserID > 0) {
            await this.GetPersonalDetailByUserID();
          }
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

  async CancelData() { }


  async LockSubmitSaveData() {
    this.finalSubmitRequest.CreatedBy = this.sSOLoginDataModel.UserID;
    this.finalSubmitRequest.ID = this.sSOLoginDataModel.StaffID;
    try {
      this.loaderService.requestStarted();

      await this.bterEstablishManagementService.BTERFinalSubmitUpdateStaffProfileStatus(this.finalSubmitRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AddedServiceList = [];
          this.sSOLoginDataModel.ProfileID = this._EnumEMProfileStatus.LockAndSubmit;
          this.commonMasterService.setsSOLoginDataModel(this.sSOLoginDataModel);
          window.location.reload();
          
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

  get CheckInstitute(): boolean {
    let insdtitutexist = false

    if (this.sSOLoginDataModel.DepartmentID === EnumDepartment.BTER) {
      insdtitutexist = this.AddedChoices.some(x => x.SemesterID == this.Addrequest.SemesterID && x.BranchID == this.Addrequest.BranchID && x.SubjectID == this.Addrequest.SubjectID)
    }
   

    if (insdtitutexist) {
      return true
    } else {
      return false
    }
  }

  AddChoice() {

    this.isAddrequest = true;
    if (this.AddsubjectFormGroup.invalid) {
      /*this.OptionsFormGroup.markAllAsTouched();*/
      return;
    }

    console.log("this.Addrequest", this.Addrequest);
    if (this.CheckInstitute) {
      this.toastr.error("आपने पहले ही इस संयोजन को चुन लिया है")
    }
    else {
      
        // Get the selected values
        this.Addrequest.BranchName = this.CourseMasterDDL.filter((x: any) => x.StreamID == this.Addrequest.BranchID)[0]['StreamName'];
        this.Addrequest.StreamType = this.StreamTypeList.filter((x: any) => x.StreamTypeID == this.Addrequest.StreamTypeID)[0]['StreamType'];
    
      

      this.Addrequest.SemesterName = this.SemesterList.filter((x: any) => x.SemesterID == this.Addrequest.SemesterID)[0]['SemesterName'];
      this.Addrequest.ExamType = this.ExamTypeList.filter((x: any) => x.ID == this.Addrequest.ExamTypeID)[0]['Name'];
      this.Addrequest.SubjectName = this.SubjectMasterDDL.filter((x: any) => x.ID == this.Addrequest.SubjectID)[0]['Name'];

      this.Addrequest.SubjectType = this.Addrequest.IsOptional ? 'Optional' : 'Teaching';

      if (!this.staffDetailsFormData.StaffSubjectListModel) {
        this.staffDetailsFormData.StaffSubjectListModel = [];
      }

      const isDuplicate = this.staffDetailsFormData.StaffSubjectListModel.some((element: any) =>
        this.Addrequest.SubjectID === element.SubjectID
      );

      debugger
      if (isDuplicate) {
        this.toastr.error('A record with this subject already exists.', 'Duplicate Entry');
        return;
      } else {

        this.staffDetailsFormData.StaffSubjectListModel.push({
          BranchName: this.Addrequest.BranchName,
          BranchID: this.Addrequest.BranchID,
          StreamType: this.Addrequest.StreamType,
          StreamTypeID: this.Addrequest.StreamTypeID,
          ExamType: this.Addrequest.ExamType,
          ExamTypeID: this.Addrequest.ExamTypeID,
          SubjectName: this.Addrequest.SubjectName,
          SubjectID: this.Addrequest.SubjectID,
          IsOptional: this.Addrequest.IsOptional,
          SemesterID: this.Addrequest.SemesterID,
          SemesterName: this.Addrequest.SemesterName,
          SubjectType: this.Addrequest.SubjectType
        });

        console.log(this.staffDetailsFormData.StaffSubjectListModel);
        this.Addrequest.BranchName = ''
        this.Addrequest.BranchID = 0
        this.Addrequest.SemesterID = 0
        this.Addrequest.ExamTypeID = 0
        this.Addrequest.SubjectID = 0
        this.Addrequest.StreamTypeID = 0
        this.Addrequest.StreamType = ''
        this.Addrequest.ExamType = ''
        this.Addrequest.SubjectName = ''
        this.Addrequest.SubjectType = ''
        this.Addrequest.SemesterName = ''
        this.Addrequest.IsOptional = false
        this.Addrequest.SubjectType = ''
        this.isAddrequest = false
      }

      

    }
  }
  deleteRow(index: number): void {
    this.staffDetailsFormData.StaffSubjectListModel.splice(index, 1);
  }

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {

    if (SSOID == "") {
      this.toastr.error("SSOID Null");
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
            this.request.EmployeeID = parsedData.employeeNumber;
            this.request.Name = parsedData.displayName;
            this.request.MobileNumber = parsedData.mobile;
            this.request.SSOID = parsedData.SSOID;
            

            //this.formData.Name = parsedData.displayName;
            //this.formData.MobileNumber = parsedData.mobile;
            //this.formData.Email = parsedData.mailPersonal;
            //this.formData.AdharCardNumber = parsedData.aadhaarId;
            //this.formData.BhamashahNo = parsedData.bhamashahId;
            //this.formData.Pincode = parsedData.postalCode;
            //this.formData.Address = parsedData.postalAddress;
            //this.formData.EmployeeID = parsedData.employeeNumber;


            if (parsedData.dateOfBirth) {
              const [day, month, year] = parsedData.dateOfBirth.split('/');
              this.request.DateOfBirth = `${year}-${month}-${day}`; // yyyy-MM-dd format
            }

            if (parsedData.gender != null) {
              this.GetGenderID = this.GenderList.find((item: any) =>
                item.Name?.toLowerCase().trim() === parsedData.gender?.toLowerCase().trim()
              )?.ID ?? 0;
              this.request.Gender = this.GetGenderID;
            }
            else {
              this.request.Gender = 0;
            }



            //this.formData.SSOID = parsedData.SSOID;
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
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  }


  
    

