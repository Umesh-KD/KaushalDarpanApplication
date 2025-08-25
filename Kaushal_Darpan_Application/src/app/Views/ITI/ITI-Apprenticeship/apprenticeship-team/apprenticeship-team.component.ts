import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITI_ApprenticeshipDataModel, ITI_ApprenticeshipDropdownModel, ApprenticeshipMemberDetailsDataModel, SaveCheckSSODataModel } from '../../../../Models/ITI/ITI_ApprenticeshipDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { StaffMasterDDLDataModel } from '../../../../Models/CenterObserverDataModel';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { EnumDepartment, EnumApprenticeshipDeploymentType, EnumStatus } from '../../../../Common/GlobalConstants';
import { ITIApprenticeshipService } from '../../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';

@Component({
  selector: 'app-apprenticeship-team',
  standalone: false,
  templateUrl: './apprenticeship-team.component.html',
  styleUrl: './apprenticeship-team.component.css'
})
export class ApprenticeshipTeamComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  StreamMasterDDL: any = [];
  SemesterMasterDDL: any = [];
  DistrictMasterDDL: any = [];
  ExamShiftDDL: any = [];
  InstituteMasterDDL: any = [];
  ExaminerDDL: any = [];

  public requestSSoApi = new CommonVerifierApiDataModel();

  public request = new ITI_ApprenticeshipDataModel();
  public requestMember = new ApprenticeshipMemberDetailsDataModel();
  public formData = new SaveCheckSSODataModel();
  ApprenticeshipFormGroup!: FormGroup; 
  ApprenticeshipMemberFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  isFormSubmitted: boolean = false;
  isFormReadOnly: boolean = false;
  showTeamInitials: boolean = true;
  public requestStaff = new StaffMasterDDLDataModel();
  requestTrade = new ItiTradeSearchModel()
  requestIti = new ItiCollegesSearchModel()
  requestDropdown = new ITI_ApprenticeshipDropdownModel()
  ApprenticeshipTeamID: number = 0
  @Input() tabId: number = 0;
  _EnumApprenticeshipDeploymentType = EnumApprenticeshipDeploymentType;

  @Output() tabChange: EventEmitter<{ index: number, id: any }> = new EventEmitter<{ index: number, id: any }>();
  constructor(
    private commonMasterService: CommonFunctionService,
    private menuService: MenuService,
    private fb: FormBuilder,
    private itiApprenticeshipService: ITIApprenticeshipService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){}

  async ngOnInit() {
    this.ApprenticeshipFormGroup = this.fb.group({
      //TeamInitials: [{value: '', disabled: true}],
      ApprenticeshipTeamName: ['', Validators.required],
      /*TeamTypeID: ['', [DropdownValidators]],*/
      DeploymentDateFrom: ['', Validators.required],
      /*DeploymentDateTo: ['', Validators.required],*/

    })

    this.ApprenticeshipMemberFormGroup = this.fb.group({
      //DistrictID: ['', [DropdownValidators]],
      //InstituteID: ['',[DropdownValidators]],
      //StaffID: ['', [DropdownValidators]],
   
      SSOID: ['', Validators.required],
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // this.ApprenticeshipTeamID = this.activatedRoute.snapshot.queryParams['id'];
    // console.log("this.ApprenticeshipTeamID",this.ApprenticeshipTeamID)
    console.log(this.request.ApprenticeshipTeamName)
    console.log(this.request.TeamTypeID)
    this.activatedRoute.queryParams.subscribe((params) => {
      this.ApprenticeshipTeamID = params['id'];
      console.log("this.ApprenticeshipTeamID:", this.ApprenticeshipTeamID);
    });
    await this.getMasterData();

    // if(this.ApprenticeshipTeamID != 0) {
    //   this.GetById_Team(this.ApprenticeshipTeamID);
    // }
    if (this.ApprenticeshipTeamID != undefined && this.ApprenticeshipTeamID != null && this.ApprenticeshipTeamID != 0) {
      debugger
      this.GetById_Team(this.ApprenticeshipTeamID);
    }

  }

  get _ApprenticeshipForm() { return this.ApprenticeshipFormGroup.controls; }
  get _ApprenticeshipMemberForm() { return this.ApprenticeshipMemberFormGroup.controls; }

  async getMasterData() {
    try {
      this.requestTrade.action='_getAllData'
      await this.commonMasterService.TradeListGetAllData(this.requestTrade).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
      })

      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })

      // await this.commonMasterService.Examiner_SSOID(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
      //   data = JSON.parse(JSON.stringify(data));
      //   this.ExaminerDDL = data.Data;
      // })

    } catch (error) {
      console.error(error);
    }
  }

  GetInstituteMaster_ByDistrictWise() {
    this.InstituteMasterDDL = []
    this.requestDropdown.action='GetInstituteMaster_ByDistrictWise'
    this.requestDropdown.DistrictID = this.requestMember.DistrictID;
    this.requestDropdown.ManagementTypeID = 1;
    this.itiApprenticeshipService.GetITIApprenticeshipDropdown(this.requestDropdown).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL",this.InstituteMasterDDL)
    })
  }

  GetStaff_InstituteWise() {
    this.ExaminerDDL = []
    this.requestDropdown.action='GetStaff_InstituteWise'
    this.requestDropdown.InstituteID = this.requestMember.InstituteID;
    this.requestDropdown.DepartmentID = EnumDepartment.ITI;
    this.itiApprenticeshipService.GetITIApprenticeshipDropdown(this.requestDropdown).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ExaminerDDL = data.Data;
    })
  }

  async AddMoreMember(data : any) {
    this.isSubmitted = true;
    debugger;
    if (data == null && data == undefined) {
       await this.SSOIDGetSomeDetails(this.requestMember.SSOID);
    }
    //if (check == false) {
    //  this.toastr.error("This SSO ID is not Exist, Please contact to Admin!");
    //  return;
    //}

    if(this.ApprenticeshipMemberFormGroup.invalid) {
      console.log("Invalid");
      return
    }

    const IsDuplicate = this.request.ApprenticeshipMemberDetails.some((element: any) =>
      data.Data == element.StaffID
    );
    if (IsDuplicate) {
      this.toastr.error('Already Exists');
      return;
    }
    

    //this.requestMember.DistrictName = this.DistrictMasterDDL.find((x: any) => x.ID == this.requestMember.DistrictID)?.Name;
    //this.requestMember.InstituteName = this.InstituteMasterDDL.find((x: any) => x.Id == this.requestMember.InstituteID)?.Name;
    this.requestMember.StaffName = this.formData.Name
    this.requestMember.StaffID = data.Data;
    this.requestMember.SSOID = this.requestSSoApi.SSOID;

    console.log(this.requestMember);

    this.request.ApprenticeshipMemberDetails.push(this.requestMember);

    this.isFormReadOnly = true;

    console.log("this.request on push",this.request);

    // this.dataSource.data = this.request.ObserverDetails;
    // this.dataSource.sort = this.sort;

    // this.totalRecords = this.request.ObserverDetails.length;
    // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    // this.updateTable();

    this.requestMember = new ApprenticeshipMemberDetailsDataModel();
    this.isSubmitted = false;
  }

  async SaveData() {
    this.isFormSubmitted = true
    debugger;
    //if(this.ApprenticeshipFormGroup.invalid) return;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.request.UserID = this.sSOLoginDataModel.UserID;

    if (this.request.ApprenticeshipMemberDetails.length == 0) {
      this.toastr.error("Please Add At Least One Member in Team");
      return;
    }

    if (this.request.ApprenticeshipMemberDetails.length == 1) {
      this.request.ApprenticeshipMemberDetails.forEach(element => {
        element.IsIncharge = true
      })
    } 

    const hasIncharge = this.request.ApprenticeshipMemberDetails.some(x => x.IsIncharge == true);
    if (!hasIncharge) {
      this.toastr.error("Please Select Incharge");
      return;
    }
    try {
      this.loaderService.requestStarted();
      await this.itiApprenticeshipService.SaveData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        var id = data.Data
        if(data.State === EnumStatus.Success){
          this.toastr.success("Saved Successfully");
          this.tabChange.emit({ index: 1, id: id });

          this.GetById_Team(id);

          //  // Update the URL with the new ID without navigating
          // const url = new URL(window.location.href); // Get the current URL
          // url.pathname = '/add-Apprenticeship'; // Ensure the path is '/add-Apprenticeship'
          // url.searchParams.set('id', id); // Set the 'id' query parameter

          // // Update the URL without reloading the page
          // window.history.pushState({}, '', url);

          this.router.navigate(['/add-apprenticeship'], {
            queryParams: { id: id },
          });

        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
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

  formatDateToInput(dateStr: string): string {
    if (!dateStr) return '';

    const [datePart] = dateStr.split(' '); // get "20-06-2025"
    const [day, month, year] = datePart.split('-');

    return `${year}-${month}-${day}`; // returns "2025-06-20"
  }

  async GetById_Team(id: number) {

    try {
      this.loaderService.requestStarted();
      await this.itiApprenticeshipService.GetById_Team(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        debugger;
        var id = data.Data
        if (data.State === EnumStatus.Success) {
          this.request = data.Data
         
          // In ngOnInit or wherever request is populated
          //this.request.DeploymentDateTo = this.formatDateToInput(this.request.DeploymentDateTo);
          this.request.DeploymentDateFrom = this.formatDateToInput(this.request.DeploymentDateFrom);
          this.ApprenticeshipFormGroup.get('ApprenticeshipTeamName')?.disable();
          //this.ApprenticeshipFormGroup.get('TeamTypeID')?.disable();
          this.ApprenticeshipFormGroup.get('DeploymentDateFrom')?.disable();
          this.ApprenticeshipFormGroup.get('DeploymentDateTo')?.disable();
          // this.request.ApprenticeshipMemberDetails.forEach((element: any) => {
          //   element.DistrictName = this.DistrictMasterDDL.find((x: any) => x.ID == element.DistrictID)?.Name;
          //   element.InstituteName = this.InstituteMasterDDL.find((x: any) => x.Id == element.InstituteID)?.Name;
          //   element.StaffName = this.ExaminerDDL.find((x: any) => x.StaffID == element.StaffID)?.Name;
          //   element.SSOID = this.ExaminerDDL.find((x: any) => x.StaffID == element.StaffID)?.SSOID;
          // });

        } else if (data.State === EnumStatus.Warning) {
          // this.toastr.warning(data.Message);
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

  SetInchargeFlyingSquad(staff: any) {
    this.request.ApprenticeshipMemberDetails.forEach(element => {
      element.IsIncharge = false;
    })
    this.request.ApprenticeshipMemberDetails.forEach(element => {
      if (element.StaffID == staff.StaffID) {
        element.IsIncharge = !element.IsIncharge;
      }
    })
  }

  async DeleteRow(item: ApprenticeshipMemberDetailsDataModel) {
    const index: number = this.request.ApprenticeshipMemberDetails.indexOf(item);
    console.log("index", index)
    if (index != -1) {
      this.request.ApprenticeshipMemberDetails.splice(index, 1)
      // this.ddlSemester_Change();
    }
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
            
            //this.formData.Displayname = parsedData.displayName


            
            this.formData.Name = parsedData.displayName;
            this.formData.MobileNo = parsedData.mobile;
            this.formData.EmailID = parsedData.mailPersonal;
            this.formData.SSOID = parsedData.SSOID;
            this.formData.DeploymentDateFrom = this.request.DeploymentDateFrom;
            //this.formData.DeploymentDateTo = this.request.DeploymentDateTo;

            this.Save_CheckSSOData(this.formData);

            //this.DuplicateCheck(this.requestSSoApi.SSOID);
            //this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.disable();
            //return true;
          }
          else {
            this.toastr.error("This SSO ID is not Exist, Please contact to Admin!");
            this.requestMember.SSOID = "";
            //this.isSSOVisible = false;
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

  async Save_CheckSSOData(formData: any) {
    //this.isFormSubmitted = true

    try {
      this.loaderService.requestStarted();
      await this.itiApprenticeshipService.Save_CheckSSOData(formData).then((data: any) => {
   
        data = JSON.parse(JSON.stringify(data));

        var id = data.Data
        if (data.State === EnumStatus.Success) {
          if (id == -1) {
            this.toastr.error("This user already engage in between these date");
          }
          else {
            this.AddMoreMember(data)
          }
          

        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
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

  //async DuplicateCheck(SSOID : string) {

  //     debugger;
  //     this.requestMember.SSOID = this.requestMember.SSOID;
  //     this.requestMember.DeploymentDateFrom = this.requestMember.DeploymentDateFrom;
  //     this.requestMember.DeploymentDateTo = this.requestMember.DeploymentDateTo;
  //    // console.log('id test ', this.searchRequest.DivisionID);
  //    try {
  //      this.loaderService.requestStarted();
  //      await this.itiApprenticeshipService.check_Engagement(this.requestMember)
  //        .then((data: any) => {
  //          data = JSON.parse(JSON.stringify(data));
  //          if (data.State == EnumStatus.Success) {


  //          }
  //          else if (data.State == EnumStatus.Warning) {

  //            const msg = `SSOID ${SSOID} is already engaged on this date.`;
  //            this.toastr.warning(msg);
  //            this.requestMember.SSOID = "";
  //            //this.isSSOVisible = false;
  //            //this.AddStaffBasicDetailFromGroup.get('txtSSOID')?.enable();
  //          }
  //          else {
  //            this.toastr.error(data.ErrorMessage);
  //          }
  //        }, (error: any) => console.error(error)
  //        );
  //    }
  //    catch (ex) {
  //      console.log(ex);
  //    }
  //    finally {
  //      setTimeout(() => {
  //        this.loaderService.requestEnded();
  //      }, 200);
  //    }
  //  }

 


}



