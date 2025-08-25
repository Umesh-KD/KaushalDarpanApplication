import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddStaffBasicDetailDataModel, StaffDetailsDataModel, StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, enumExamStudentStatus, EnumDepartment, EnumStatusOfStaff } from '../../../Common/GlobalConstants';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';

@Component({
  selector: 'app-add-staff-basic-detail',
  templateUrl: './add-staff-basic-detail.component.html',
  styleUrls: ['./add-staff-basic-detail.component.css'],
  standalone: false
})
export class AddStaffBasicDetailComponent implements OnInit {
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new AddStaffBasicDetailDataModel();
  public isSubmitted: boolean = false;
  public searchRequest = new StaffMasterSearchModel();
  staffDetailsFormData = new StaffDetailsDataModel();
  public isLoading: boolean = false;
  _EnumStatusOfStaff = EnumStatusOfStaff;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];
  public filterDesignation: any[] = [];
  public StaffMasterList: any = [];
  public StaffTypeList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public isModalOpen = false;
  public requestSSoApi = new CommonVerifierApiDataModel();
  constructor(private commonMasterService: CommonFunctionService, private Staffservice: StaffMasterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {
    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      ddlStaffType: ['', [DropdownValidators]],
      txtSSOID: ['', [Validators.required]],
      Name: ['', [Validators.required]],
      ddlRole: ['', [DropdownValidators]],
      ddlDesignation: ['', [DropdownValidators]],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("sSOLoginDataModel", this.sSOLoginDataModel);

    this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID

    // page load
    await this.GetRoleMasterData();
    await this.GetDesignationMasterData();
    await this.GetStaffTypeData()
    await this.GetAllData()

    console.log(this.sSOLoginDataModel);
  }
  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }



  async OnFilterDesignation() {
    if (this.formData.StaffTypeID == 30) {
      this.DesignationMasterList = this.filterDesignation.filter((e: any) => e.TypeID == 30)
    } else {
      this.DesignationMasterList = this.filterDesignation.filter((e: any) => e.TypeID == 31)
    }
  }


  async GetAllData() {

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;
    try {
      this.loaderService.requestStarted();
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      await this.Staffservice.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          console.log(this.StaffMasterList)
        }, (error: any) => console.error(error)
        );
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

  dateSetter(date: any) {
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }


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
            this.formData.Displayname = parsedData.displayName

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

  async GetByID(id: number) {
    ;
    try {

      this.loaderService.requestStarted();

      await this.Staffservice.GetByID(id, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'FFFFF');
          this.staffDetailsFormData = data['Data']
          this.staffDetailsFormData.StaffID = data['Data']["StaffID"];
          this.staffDetailsFormData.StaffTypeID = data['Data']["StaffTypeID"];
          this.staffDetailsFormData.Name = data['Data']["Name"];
          this.staffDetailsFormData.SSOID = data['Data']["SSOID"];
          this.staffDetailsFormData.AdharCardNumber = data['Data']["AdharCardNumber"];
          this.staffDetailsFormData.RoleID = data['Data']["RoleID"];
          this.staffDetailsFormData.DesignationID = data['Data']["DesignationID"];
          this.staffDetailsFormData.StateID = data['Data']["StateID"];
          /*   await this.ddlState_Change();*/
          this.staffDetailsFormData.DistrictID = data['Data']["DistrictID"];

          this.staffDetailsFormData.Address = data['Data']["Address"];

          this.staffDetailsFormData.CourseID = data['Data']["CourseID"];

          /*  await this.ddlStream_Change();*/
          this.staffDetailsFormData.SubjectID = data['Data']["SubjectID"];
          this.staffDetailsFormData.Email = data['Data']["Email"];
          this.staffDetailsFormData.MobileNumber = data['Data']["MobileNumber"];
          this.staffDetailsFormData.HigherQualificationID = data['Data']["HigherQualificationID"];

          if (data['Data']["AdharCardPhoto"] != null) {
            this.staffDetailsFormData.AdharCardPhoto = data['Data']["AdharCardPhoto"];
          } else {
            this.staffDetailsFormData.AdharCardPhoto = ''
          }
          if (data['Data']["Dis_AdharCardNumber"] != null) {
            this.staffDetailsFormData.Dis_AdharCardNumber = data['Data']["Dis_AdharCardNumber"];
          } else {
            this.staffDetailsFormData.Dis_AdharCardNumber = ''
          }

          if (data['Data']["ProfilePhoto"] != null) {
            this.staffDetailsFormData.ProfilePhoto = data['Data']["ProfilePhoto"];
          } else {
            this.staffDetailsFormData.ProfilePhoto = ''
          }
          if (data['Data']["Dis_ProfileName"] != null) {
            this.staffDetailsFormData.Dis_ProfileName = data['Data']["Dis_ProfileName"];
          } else {
            this.staffDetailsFormData.Dis_ProfileName = ''
          }

          if (data['Data']["PanCardPhoto"] != null) {
            this.staffDetailsFormData.PanCardPhoto = data['Data']["PanCardPhoto"];
          } else {
            this.staffDetailsFormData.PanCardPhoto = ''
          }
          if (data['Data']["Dis_PanCardNumber"] != null) {
            this.staffDetailsFormData.Dis_PanCardNumber = data['Data']["Dis_PanCardNumber"];
          } else {
            this.staffDetailsFormData.Dis_PanCardNumber = ''
          }

          if (data['Data']["Certificate"] != null) {
            this.staffDetailsFormData.Certificate = data['Data']["Certificate"];
          } else {
            this.staffDetailsFormData.Certificate = ''
          }
          if (data['Data']["Dis_Certificate"] != null) {
            this.staffDetailsFormData.Dis_Certificate = data['Data']["Dis_Certificate"];
          } else {
            this.staffDetailsFormData.Dis_Certificate = ''
          }

          this.staffDetailsFormData.PanCardNumber = data['Data']["PanCardNumber"];


          this.staffDetailsFormData.DateOfBirth = this.dateSetter(data['Data']['DateOfBirth'])
          this.staffDetailsFormData.DateOfAppointment = this.dateSetter(data['Data']['DateOfAppointment'])
          this.staffDetailsFormData.DateOfJoining = this.dateSetter(data['Data']['DateOfJoining'])
          this.staffDetailsFormData.Experience = data['Data']["Experience"];


          this.staffDetailsFormData.SpecializationSubjectID = data['Data']["SpecializationSubjectID"];
          this.staffDetailsFormData.AnnualSalary = data['Data']["AnnualSalary"];
          this.staffDetailsFormData.PFDeduction = data['Data']["PFDeduction"];
          this.staffDetailsFormData.ResearchGuide = data['Data']["ResearchGuide"];
          this.staffDetailsFormData.StaffStatus = data['Data']["StaffStatus"];
          this.staffDetailsFormData.EduQualificationDetailsModel = data['Data']["EduQualificationDetailsModel"];
          this.staffDetailsFormData.Pincode = data['Data']['Pincode']

          this.staffDetailsFormData.BankName = data['Data']['BankName']
          this.staffDetailsFormData.BankAccountNo = data['Data']['BankAccountNo']
          this.staffDetailsFormData.BankAccountName = data['Data']['BankAccountName']
          this.staffDetailsFormData.IFSCCode = data['Data']['IFSCCode']

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
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

  async OnConfirm(content: any, ID: number) {

    this.modalReference = this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    this.isModalOpen = true;  // Open the modal
    this.GetByID(ID)
  }

  // Method to close the modal when Close button is clicked
  ClosePopup(): void {
    this.modalReference?.close();  // Close the modal
  }

  //async GetDetails_btnClick() {

  //  if (this.formData.SSOID != null && this.formData.SSOID != '') {
  //    const SSOID = this.formData.SSOID;

  //    const SSOUserName: string = "rti.test";
  //    const SSOPassword: string = "Test@1234";
  //    /*this.formData.Displayname = "ram";*/
  //    try {
  //      this.loaderService.requestStarted();

  //      await this.Staffservice.GetSSOIDDetails(SSOID, SSOUserName, SSOPassword)
  //        .then((data: any) => {
  //          data = JSON.parse(JSON.stringify(data));
  //          this.formData.Displayname = data.Dis_ProfileName;
  //          if (data.State === EnumStatus.Success) {
  //          }
  //        }, (error: any) => console.error(error));
  //    } catch (error) {
  //      console.error(error);
  //    } finally {
  //      setTimeout(() => {
  //        this.loaderService.requestEnded();
  //      }, 200);
  //    }
  //  }
  //  else {
  //    this.ErrorMessage = "please enter the SSOID";
  //    this.toastr.error(this.ErrorMessage)
  //  }

  //}

  async GetRoleMasterData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).
        then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("RoleMasterList", data);
          if ((this.sSOLoginDataModel.DepartmentID) == EnumDepartment.BTER) {
            this.RoleMasterList = data.Data.filter((item: any) => item.ID == EnumRole.Invigilator || item.ID == EnumRole.Invigilator_NonEng
              || item.ID == EnumRole.Teacher || item.ID == EnumRole.TeacherNon);
          }
          else if ((this.sSOLoginDataModel.DepartmentID) == EnumDepartment.ITI) {
            this.RoleMasterList = data.Data.filter((item: any) => item.ID == EnumRole.ITIInvisilator || item.ID == EnumRole.ITITeacherNonEngNonEng);

          }
          else {
            this.RoleMasterList = data.Data.filter((item: any) => item.ID == EnumRole.Invigilator || item.ID == EnumRole.Invigilator_NonEng
              || item.ID == EnumRole.Teacher || item.ID == EnumRole.TeacherNon);
          }
        })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
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
        this.filterDesignation = data.Data;
        console.log("DesignationMasterList", this.DesignationMasterList);
      }, error => console.error(error))
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async OnFormSubmit() {

    try {
      this.isSubmitted = true;
      if (this.AddStaffBasicDetailFromGroup.invalid) {
        return
      }

      this.isLoading = true;

      this.loaderService.requestStarted();

      this.formData.ModifyBy = this.sSOLoginDataModel.UserID;
      this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.formData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.formData.CreatedBy = this.sSOLoginDataModel.UserID
      this.formData.ModifyBy = this.sSOLoginDataModel.UserID
      this.formData.StatusOfStaff = EnumStatusOfStaff.Draft
      this.formData.InstituteID = this.sSOLoginDataModel.InstituteID
      //save
      await this.Staffservice.SaveStaffBasicDetails(this.formData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.GetAllData();
            window.location.reload();
          } else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
            this.ResetControls();
          } else {
            this.toastr.error(this.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
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


  ResetControls() {
    this.isSubmitted = false;
    this.formData = new AddStaffBasicDetailDataModel();
  }

}
