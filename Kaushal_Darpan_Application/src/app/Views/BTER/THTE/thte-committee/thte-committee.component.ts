import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITI_InspectionDataModel, ITI_InspectionDropdownModel, InspectionMemberDetailsDataModel, SaveCheckSSODataModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { StaffMasterDDLDataModel } from '../../../../Models/CenterObserverDataModel';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { EnumDepartment, EnumInspectionDeploymentType, EnumStatus } from '../../../../Common/GlobalConstants';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';
import { CommitteeStaffSSOIDSearchModel } from '../../../../Models/TeacherHigherEducationApplicationDataModel';

@Component({
  selector: 'app-thte-committee',
  standalone: false,
  templateUrl: './thte-committee.component.html',
  styleUrl: './thte-committee.component.css'
})
export class THTECommitteeComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  StreamMasterDDL: any = [];
  SemesterMasterDDL: any = [];
  DistrictMasterDDL: any = [];
  ExamShiftDDL: any = [];
  InstituteMasterDDL: any = [];
  ExaminerDDL: any = [];

  public requestSSoApi = new CommonVerifierApiDataModel();

  public request = new ITI_InspectionDataModel();
  public requestMember = new InspectionMemberDetailsDataModel();
  public formData = new SaveCheckSSODataModel();
  InspectionFormGroup!: FormGroup; 
  InspectionMemberFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  isFormSubmitted: boolean = false;
  isFormReadOnly: boolean = false;
  showTeamInitials: boolean = true;
  public requestStaff = new StaffMasterDDLDataModel();
  requestTrade = new ItiTradeSearchModel()
  requestIti = new ItiCollegesSearchModel()
  requestDropdown = new ITI_InspectionDropdownModel();
  requestCommitteeStaffSSOIDSearchModel = new CommitteeStaffSSOIDSearchModel();
  InspectionTeamID: number = 0
  @Input() tabId: number = 0;
  _EnumInspectionDeploymentType = EnumInspectionDeploymentType;

  @Output() tabChange: EventEmitter<{ index: number, id: any }> = new EventEmitter<{ index: number, id: any }>();
  constructor(
    private commonMasterService: CommonFunctionService,
    private menuService: MenuService,
    private fb: FormBuilder,
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public teacherHigherEducationApplicationService: TeacherHigherEducationApplicationService,

  ){}

  async ngOnInit() {
    this.InspectionFormGroup = this.fb.group({
      //TeamInitials: [{value: '', disabled: true}],
      InspectionTeamName: ['', Validators.required],
      

    })

    this.InspectionMemberFormGroup = this.fb.group({
      //DistrictID: ['', [DropdownValidators]],
      //InstituteID: ['',[DropdownValidators]],
      //StaffID: ['', [DropdownValidators]],
   
      SSOID: ['', Validators.required],
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // this.InspectionTeamID = this.activatedRoute.snapshot.queryParams['id'];
    // console.log("this.InspectionTeamID",this.InspectionTeamID)
    console.log(this.request.InspectionTeamName)
    console.log(this.request.TeamTypeID)
    this.activatedRoute.queryParams.subscribe((params) => {
      this.InspectionTeamID = params['id'];
      console.log("this.InspectionTeamID:", this.InspectionTeamID);
    });
    await this.getMasterData();

    // if(this.InspectionTeamID != 0) {
    //   this.GetById_Team(this.InspectionTeamID);
    // }
    if (this.InspectionTeamID != undefined && this.InspectionTeamID != null && this.InspectionTeamID != 0) {
      debugger
      this.GetById_Team(this.InspectionTeamID);
    }

  }

  get _inspectionForm() { return this.InspectionFormGroup.controls; }
  get _inspectionMemberForm() { return this.InspectionMemberFormGroup.controls; }

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
    this.itiInspectionService.GetITIInspectionDropdown(this.requestDropdown).then((data: any) => {
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
    this.itiInspectionService.GetITIInspectionDropdown(this.requestDropdown).then((data: any) => {
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

    if(this.InspectionMemberFormGroup.invalid) {
      console.log("Invalid");
      return
    }

    const IsDuplicate = this.request.InspectionMemberDetails.some((element: any) =>
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
    this.requestMember.SSOID = this.formData.SSOID;

    console.log(this.requestMember);

    this.request.InspectionMemberDetails.push(this.requestMember);

    this.isFormReadOnly = true;

    console.log("this.request on push",this.request);

    // this.dataSource.data = this.request.ObserverDetails;
    // this.dataSource.sort = this.sort;

    // this.totalRecords = this.request.ObserverDetails.length;
    // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    // this.updateTable();

    this.requestMember = new InspectionMemberDetailsDataModel();
    this.isSubmitted = false;
  }

  async SaveData() {
    this.isFormSubmitted = true
    debugger;
    //if(this.InspectionFormGroup.invalid) return;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.request.UserID = this.sSOLoginDataModel.UserID;

    if (this.request.InspectionMemberDetails.length == 0) {
      this.toastr.error("Please Add At Least One Member in Team");
      return;
    }

    if (this.request.InspectionMemberDetails.length == 1) {
      this.request.InspectionMemberDetails.forEach(element => {
        element.IsIncharge = true
      })
    } 

    const hasIncharge = this.request.InspectionMemberDetails.some(x => x.IsIncharge == true);
    if (!hasIncharge) {
      this.toastr.error("Please Select Incharge");
      return;
    }
    try {
      this.loaderService.requestStarted();
      this.request.InstituteId = this.sSOLoginDataModel.InstituteID;
      await this.teacherHigherEducationApplicationService.CommitteeSaveData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        var id = data.Data
        if(data.State === EnumStatus.Success){
          this.toastr.success("Saved Successfully");
          this.tabChange.emit({ index: 1, id: id });

          this.GetById_Team(id);

          //  // Update the URL with the new ID without navigating
          // const url = new URL(window.location.href); // Get the current URL
          // url.pathname = '/add-inspection'; // Ensure the path is '/add-inspection'
          // url.searchParams.set('id', id); // Set the 'id' query parameter

          // // Update the URL without reloading the page
          // window.history.pushState({}, '', url);

          this.router.navigate(['/THTE-CommitteeList'], {
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
    const [day, month, year] = datePart.split('/');

    return `${year}-${month}-${day}`; // returns "2025-06-20"
  }

  async GetById_Team(id: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.teacherHigherEducationApplicationService.GetCommitteeById_Team(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        debugger;
        var id = data.Data
        if (data.State === EnumStatus.Success) {
          this.request = data.Data
          this.request.DeploymentDateTo = this.formatDateToInput(this.request.DeploymentDateTo);
          this.request.DeploymentDateFrom = this.formatDateToInput(this.request.DeploymentDateFrom);
          this.InspectionFormGroup.get('InspectionTeamName')?.disable();
          this.InspectionFormGroup.get('TeamTypeID')?.disable();
          this.InspectionFormGroup.get('DeploymentDateFrom')?.disable();
          this.InspectionFormGroup.get('DeploymentDateTo')?.disable();
         
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
    this.request.InspectionMemberDetails.forEach(element => {
      element.IsIncharge = false;
    })
    this.request.InspectionMemberDetails.forEach(element => {
      if (element.StaffID == staff.StaffID) {
        element.IsIncharge = !element.IsIncharge;
      }
    })
  }

  async DeleteRow(item: InspectionMemberDetailsDataModel) {
    const index: number = this.request.InspectionMemberDetails.indexOf(item);
    console.log("index", index)
    if (index != -1) {
      this.request.InspectionMemberDetails.splice(index, 1)
      // this.ddlSemester_Change();
    }
  }



  async SSOIDGetSomeDetails(SSOID: string): Promise<void> {
    if (!SSOID || SSOID.trim() === "") {
      this.toastr.error("Please enter SSOID");
      return;
    }

    this.loaderService.requestStarted();
    debugger
    try {
      this.requestCommitteeStaffSSOIDSearchModel.SSOID = SSOID;
      this.requestCommitteeStaffSSOIDSearchModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      const data: any = await this.teacherHigherEducationApplicationService
        .Bter_CommitteeStaffCheckSSOID(this.requestCommitteeStaffSSOIDSearchModel);

      const response = data?.Data[0];
      if (!response) {
        this.toastr.error("SSO ID not found. Staff record does not exist.");
        return;
      }

      let parsedData: any;
      try {
        parsedData =response;
      } catch (e) {
        console.error("Error parsing SSOID response:", e);
        this.toastr.error("Invalid data format received from server.");
        return;
      }

      if (parsedData) {
        this.formData = {
          ...this.formData,
          Name: parsedData.DisplayName,
          MobileNo: parsedData.mobile,
          EmailID: parsedData.mailPersonal,
          SSOID: SSOID,
          DeploymentDateFrom: this.request.DeploymentDateFrom,
          DeploymentDateTo: this.request.DeploymentDateTo
        };
         this.Save_CheckSSOData(this.formData);
      } else {
        this.toastr.error("This SSO ID does not exist. Please contact the Admin!");
        this.requestMember.SSOID = "";
        return;
      }

    } catch (error) {
      console.error("Error fetching SSOID details:", error);
      this.toastr.error("An error occurred while fetching details. Please try again.");
    } finally {
      setTimeout(() => this.loaderService.requestEnded(), 200);
    }
  }


  async Save_CheckSSOData(formData: any) {
    //this.isFormSubmitted = true

    try {
      this.loaderService.requestStarted();
      await this.itiInspectionService.Save_CheckSSOData(formData).then((data: any) => {
   
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

  

}



