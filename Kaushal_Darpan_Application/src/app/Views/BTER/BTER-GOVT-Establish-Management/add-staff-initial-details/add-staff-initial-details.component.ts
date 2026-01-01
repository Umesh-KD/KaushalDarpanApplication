import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BTER_EM_AddStaffDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITI_Govt_EM_NodalSearchDataModel, ITI_Govt_EM_RoleOfficeMapping_GetAllDataSearchDataModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { EnumStatus, EnumRole } from '../../../../Common/GlobalConstants';
import { Toast, ToastrService } from 'ngx-toastr';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { Router } from '@angular/router';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { GuestRoomManagmentService } from '../../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { GuestRoomSeatSearchModel } from '../../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';

@Component({
  selector: 'app-add-staff-initial-details',
  standalone: false,
  templateUrl: './add-staff-initial-details.component.html',
  styleUrl: './add-staff-initial-details.component.css'
})
export class AddStaffInitialDetailsComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public formData = new BTER_EM_AddStaffDataModel();
  public roleModel= new ITI_Govt_EM_RoleOfficeMapping_GetAllDataSearchDataModel();
  public NodalsearchRequest = new ITI_Govt_EM_NodalSearchDataModel();
  public requestSSoApi = new CommonVerifierApiDataModel();
  public _EnumRole = EnumRole
  public isSSOVisible: boolean = false;
  public isSubmitted: boolean = false;
  public IsNodalOfficer: boolean = false;
  public IsGuestStaffoffice: boolean = false;
  public IsAddasPrincipal: boolean = false;
  public IsGuestHouseAdmin: boolean = false;


  public OfficeList: any[] = [];
  public LevelList: any[] = [];
  public ListITICollegeByManagement: any[] = [];
  public DistrictList: any[] = [];
  public StaffTypeList: any[] = [];
  public RoleMasterList: any[] = [];
  public PostList: any[] = [];
  public AddedZonalList: any[] = [];
  public InstituteMasterDDL: any[] = [];
  public GuestHouseNameList: any = [];
  public GetDesignationID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public searchRequest1 = new GuestRoomSeatSearchModel();


  constructor(
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster,
    private toastr: ToastrService,
    private router: Router,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private guestRoomManagmentService: GuestRoomManagmentService
  ) {}

  async ngOnInit() {
    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      InstituteID: ['', []],
      GuestHouseID: ['', []],
      RoleID: ['', [DropdownValidators]],
      StaffType: ['', [DropdownValidators]],
      SSOID: ['',],
      Name: [{ value: '', disabled: true }],
      Mobile: [{ value: '', disabled: true }],
      EmailID: [{ value: '', disabled: true }],
      IsNodal: [false],
      IsGuestStaff: [false],
      ddlPost: ['', [DropdownValidators]],
      Office: ['', [DropdownValidators]]

    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    

    await this.GetOfficeList();
    
   
    await this.GetStaffTypeData();

    
  }




  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }

  

  goBack() {}




  async GetOfficeList() {
    debugger;
    this.formData.OfficeID = 0;
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
          this.OfficeList = this.OfficeList.filter((item: any) => item.ID != 21);

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


  async GetOfficeWiselogic() {
    debugger;
    this.formData.IsGuestStaff = false;
    if (this.formData.OfficeID == 17) {
      this.IsNodalOfficer = true;
      this.IsGuestStaffoffice = false;
      // this.IsGuestStaffoffice = true;
    }
    else if(this.formData.OfficeID==19)
    {
      this.IsNodalOfficer = false;
      // this.formData.IsNodal = false;
      // this.formData.IsGuestStaff = false;

      this.IsGuestStaffoffice = true;
    }
    else {
      this.IsNodalOfficer = false;
      this.IsGuestStaffoffice = false;
      this.formData.IsNodal = false;
      this.formData.IsGuestStaff = false;
    }
    await this.GetRoleMasterData();
  }

  async InstituteMasterWiselogic() {
    debugger
    this.formData.IsGuestStaff = false;
    this.formData.GuestHouseID = 0;
    // this.GetRoleMasterData();

    if (this.formData.IsNodal == true) {
      this.formData.StaffTypeID=30;
      this.StaffTypeChangePost();
          // ✅ Disable dropdown
          
  // this.f['StaffType'].setValue(30);
  // this.f['StaffType'].disable();

      this._AddStaffBasicDetailFromGroup['StaffType'].disable();
    // staffTypeControl.disable();
      await this.GetInstituteMaster();
        // ✅ Filter only Govt institutes (1)
      this.InstituteMasterDDL = this.InstituteMasterDDL.filter(
        (item: any) => item.InstitutionManagementTypeID === 1
      );
      this.AddStaffBasicDetailFromGroup.controls['InstituteID'].setValidators([DropdownValidators]);
      // this.formData.RoleID = 7;
      // 1- govt. 5- pvt
  } else {
      this.formData.IsNodal = false;
      this._AddStaffBasicDetailFromGroup['StaffType'].enable();
      this.AddStaffBasicDetailFromGroup.controls['InstituteID'].clearValidators();
      this.formData.InstituteID = 0;
      // this.formData.RoleID = 0;
    }
    this.AddStaffBasicDetailFromGroup.controls['InstituteID'].updateValueAndValidity();

  
  }

  async onRoleChange(){
    if(this.formData.RoleID==7){
      this.formData.IsNodal=true;
      await this.InstituteMasterWiselogic();
    }
    else{
      this.formData.IsNodal=false;
      await this.InstituteMasterWiselogic();
  
    }
  }

  async roleBySubDepartment() {
    debugger
   
    await this.GetRoleMasterData();
   
  }

  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetInstituteMaster() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(
        this.sSOLoginDataModel.DepartmentID,
        this.sSOLoginDataModel.Eng_NonEng,
        this.sSOLoginDataModel.EndTermID
      )
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            const instituteList = Array.isArray(data?.Data) ? data.Data : [];
            this.InstituteMasterDDL = instituteList;
          }
          else if (data.State == EnumStatus.Warning) {                       
            this.toastr.warning(data.Message, '', { timeOut: 5000 });
          }
          else {
            this.toastr.error(data.ErrorMessage, '', { timeOut: 5000 });
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
    //const officeList = [
    //  { InstituteID: 10001, InstituteName: 'DTE', OfficeTypeID :17},
    //  { InstituteID: 10002, InstituteName: 'BTER', OfficeTypeID: 18 },
    //  { InstituteID: 10003, InstituteName: 'TTC', OfficeTypeID: 19 }
    //];
    debugger;
    // this.commonMasterService.InstituteMaster(
    //   this.sSOLoginDataModel.DepartmentID,
    //   this.sSOLoginDataModel.Eng_NonEng,
    //   this.sSOLoginDataModel.EndTermID
    // ).then((response: any) => {
    //   const instituteList = Array.isArray(response?.Data) ? response.Data : [];
    //   this.InstituteMasterDDL = instituteList;
    //   //this.InstituteMasterDDL = officeList.concat(instituteList);
    // });
  }


  async OfficeITIWiseCollegeAndDirstrict() {
    this.GetRoleMasterData();
    this.formData.InstituteID = 0;
    this.formData.RoleID = 0;
    if (this.formData.LevelID == 2 && this.formData.OfficeID == 11) {
      await this.getITICollege();
      this.AddStaffBasicDetailFromGroup.controls['ddlITICollegeTrade'].setValidators([DropdownValidators]);
    }
    else if (this.formData.LevelID == 2 && this.formData.OfficeID == 15) {
      await this.ddl_DivisionID_Wise_District();
      this.AddStaffBasicDetailFromGroup.controls['ddlDistrictID'].setValidators([DropdownValidators]);
    }

    else {
      this.AddStaffBasicDetailFromGroup.controls['ddlITICollegeTrade'].clearValidators();
      this.AddStaffBasicDetailFromGroup.controls['ddlDistrictID'].clearValidators();
    }

    this.AddStaffBasicDetailFromGroup.controls['ddlITICollegeTrade'].updateValueAndValidity();
    this.AddStaffBasicDetailFromGroup.controls['ddlDistrictID'].updateValueAndValidity();
   
    
  }

  async GetRoleMasterData() {
    debugger
    try {
      this.loaderService.requestStarted();
      // await this.commonMasterService.GetRoleMasterDDL(, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
      this.roleModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_Govt_RoleOfficeMapping_GetAllData(this.roleModel).then((data: any) => {
     
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        

        if (this.sSOLoginDataModel.RoleID == this._EnumRole.GuestHouseAdmin) {
          this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.ID == EnumRole.GuestRoomWarden || item.ID == EnumRole.GuestHouseIncharge)
        } else {
          this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.OfficeTypeID == this.formData.OfficeID);
        }

        //if (this.formData.InstituteID == Number( "10001")) {
        //  this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.ID == this._EnumRole.DTE || item.ID == this._EnumRole.Principal )
        //}
        //else if (this.formData.InstituteID == Number("10002")) {
        //  this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.OfficeTypeID == this.formData.OfficeID)
        //}
        //else if (this.formData.InstituteID == Number("10003")) {
        //  this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.ID == this._EnumRole.JDConfidential_Eng)
        //}
        //else {
        //  this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.ID == this._EnumRole.Principal)
        //}
        
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetPostList() {
   
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
          this.PostList = this.PostList.filter((itme: any) => itme.TypeID == this.formData.StaffTypeID)
          console.log(this.PostList, "PostList")
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

  async getITICollege() {}

  async ddl_DivisionID_Wise_District() {}

  async DuplicateNodal()
  {
   
    this.NodalsearchRequest.DistrictID = this.formData.DistrictID;
    this.NodalsearchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.NodalsearchRequest.LevelID = this.formData.LevelID;
    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMasterService.GetITI_Govt_CheckDistrictNodalOffice(this.NodalsearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


          }
          else if (data.State == EnumStatus.Warning) {            
            
            this.toastr.warning(data.Message, '', { timeOut: 5000 });
            this.formData.DistrictID = 0;
          }
          else {
            this.toastr.error(data.ErrorMessage, '', { timeOut: 5000 });
            this.formData.DistrictID = 0;
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

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {   
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID", '', { timeOut: 5000 });
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
            //this.DuplicateCheck(this.requestSSoApi.SSOID);
            //this.formData.Displayname = parsedData.displayName
            this.isSSOVisible = true;
            this.formData.Name = parsedData.displayName;
            this.formData.MobileNo = parsedData.mobile;
            this.formData.EmailID = parsedData.mailPersonal;
            this.formData.SSOID = parsedData.SSOID;
            this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.disable();


            if (this.sSOLoginDataModel.RoleID == this._EnumRole.GuestHouseAdmin) {
              this.IsGuestHouseAdmin = true;
              this.IsGuestStaffoffice = true;
              this.AddStaffBasicDetailFromGroup.controls['Office'].clearValidators();
              this.AddStaffBasicDetailFromGroup.controls['StaffType'].clearValidators();
              this.AddStaffBasicDetailFromGroup.controls['ddlPost'].clearValidators();
             
              this.GetRoleMasterData();
             

              
             

            } else {
              this.AddStaffBasicDetailFromGroup.controls['Office'].setValidators([DropdownValidators]);
              this.AddStaffBasicDetailFromGroup.controls['StaffType'].setValidators([DropdownValidators]);
              this.AddStaffBasicDetailFromGroup.controls['ddlPost'].setValidators([DropdownValidators]);

              this.IsGuestHouseAdmin = false;
            }
            this.AddStaffBasicDetailFromGroup.controls['Office'].updateValueAndValidity();
            this.AddStaffBasicDetailFromGroup.controls['StaffType'].updateValueAndValidity();
            this.AddStaffBasicDetailFromGroup.controls['ddlPost'].updateValueAndValidity();

            if (parsedData.designation != null) {
              this.GetDesignationID = this.PostList.find((item: any) =>
                item.Name?.toLowerCase().trim() === parsedData.designation?.toLowerCase().trim()
              )?.ID ?? 0;

              this.formData.PostID = this.GetDesignationID;

           
            }
            else {
              this.formData.PostID = 0;
            }
          }
          else {
            this.toastr.error("Record Not Found", '', { timeOut: 5000 });
            this.formData.SSOID = "";
            this.isSSOVisible = false;
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

  async DuplicateCheck(SSOID : string) {  
   // console.log('id test ', this.searchRequest.DivisionID);
    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_SSOIDCheck(SSOID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
          
           
          }
          else if (data.State == EnumStatus.Warning) {
            
            const msg = `SSOID ${SSOID} is already mapped.To assign a new role, please use the Additional Role Mapping section.`;
           /* this.toastr.warning(msg);*/
            this.toastr.warning(msg, '', { timeOut: 5000 });
            this.formData.SSOID = '';
            this.isSSOVisible = false;
            this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
          }
          else {
            this.toastr.error(data.ErrorMessage);
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

  async AddZonal() {
    this.isSubmitted = true;
    if (this.AddStaffBasicDetailFromGroup.invalid) {

      return;
    }

    const isDuplicate = this.AddedZonalList.some((element: any) =>
      this.formData.SSOID === element.SSOID
    );

    debugger
    if (isDuplicate) {
      this.toastr.error('SSO ID Already Exists.', '', { timeOut: 5000 });
      return;
    } else {
      this.formData.OfficeName = this.OfficeList.find((x: any) => x.ID == this.formData.OfficeID)?.Name;
      this.formData.LevelName = this.LevelList.find((x: any) => x.ID == this.formData.LevelID)?.Name;
      this.formData.PostName = this.PostList.find((x: any) => x.ID == this.formData.PostID)?.Name;
      this.formData.RoleName = this.RoleMasterList.find((x: any) => x.ID == this.formData.RoleID)?.Name;
      this.formData.StaffTypeName = this.StaffTypeList.find((x: any) => x.ID == this.formData.StaffTypeID)?.Name;
      this.formData.InstituteName = this.InstituteMasterDDL.find((x: any) => x.ID == this.formData.InstituteID)?.Name;
      this.formData.DistrictName = this.DistrictList.find((x: any) => x.ID == this.formData.DistrictID)?.Name;

      this.AddedZonalList.push({ ...this.formData });

      this.formData = new BTER_EM_AddStaffDataModel();

      this.isSubmitted = false;
      this.isSSOVisible = false;
      this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();

    }
  }

  async SaveData() {
    debugger
    // if (this.AddedZonalList.length == 0) {
    //   this.toastr.error("Please Add At Least One Office");
    //   return;
    // }

    // this.AddedZonalList.forEach((element: any) => {
     
    //   element.CreatedBy = this.sSOLoginDataModel.UserID;
    //   element.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    //   element.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      
    // })

    this.isSubmitted = true;
    if (this.AddStaffBasicDetailFromGroup.invalid) {
      return;
    }
    this.formData.ModifyBy = this.sSOLoginDataModel.UserID;
    this.formData.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;

    try {
      this.loaderService.requestStarted();

      await this.bterEstablishManagementService.BTER_EM_AddStaffInitialDetails(this.formData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {    
          this.toastr.success(data.Message);
          this.AddedZonalList = [];
          this.router.navigate(['/bter-em-stafflist']);
        }
        else if (data.State == EnumStatus.Warning) {
          this.toastr.error(data.Message);
        }
        else {
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

  async ResetControl() { }


  async StaffTypeChangePost() {
    
    await this.GetPostList();
   

  }

  async GuestHouseMasterWiselogic() {
    debugger

    this.formData.IsNodal = false;
    this.formData.InstituteID = 0;
    if (this.formData.IsGuestStaff == true) {
      await this.GetGuestHouseNameList();
      this.AddStaffBasicDetailFromGroup.controls['GuestHouseID'].setValidators([DropdownValidators]);

      if (this.sSOLoginDataModel.RoleID == this._EnumRole.GuestHouseAdmin) {
        this.RoleMasterList = this.RoleMasterList.filter((item: any) => item.ID == EnumRole.GuestRoomWarden || item.ID == EnumRole.GuestHouseIncharge)
      }
      else {
        this.RoleMasterList = this.RoleMasterList.filter((item: any) =>  item.ID == EnumRole.GuestHouseAdmin )
      }
     

    } else {
      this.formData.IsGuestStaff = false;
      this.AddStaffBasicDetailFromGroup.controls['GuestHouseID'].clearValidators();
      this.formData.GuestHouseID = 0;
      this.GetRoleMasterData();
    }
    this.AddStaffBasicDetailFromGroup.controls['GuestHouseID'].updateValueAndValidity();


  }

  async GetGuestHouseNameList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.guestRoomManagmentService.GetGuestHouseNameList(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GuestHouseNameList = data['Data'];
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

  

}
