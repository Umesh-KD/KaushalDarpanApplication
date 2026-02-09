import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SaveCheckSSODataModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';

import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { CommitteeStaffSSOIDSearchModel, DTECommitteeDataModel, DTECommitteeMemberDetailsDataModel } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';

@Component({
  selector: 'app-thte-dte-committee',
  standalone: false,
  templateUrl: './thte-dte-committee.component.html',
  styleUrl: './thte-dte-committee.component.css'
})
export class THTEDTECommitteeComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  
  public requestSSoApi = new CommonVerifierApiDataModel();

  public request = new DTECommitteeDataModel();
  public requestMember = new DTECommitteeMemberDetailsDataModel();
  public formData = new SaveCheckSSODataModel();
  DTECommitteeFormGroup!: FormGroup;
  DTECommitteeMemberFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  isFormSubmitted: boolean = false;
  isFormReadOnly: boolean = false;
  requestCommitteeStaffSSOIDSearchModel = new CommitteeStaffSSOIDSearchModel();
  DTECommitteeTeamID: number = 0

  @Output() tabChange: EventEmitter<{ index: number, id: any }> = new EventEmitter<{ index: number, id: any }>();
  constructor(
    private commonMasterService: CommonFunctionService,
    private fb: FormBuilder,
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public teacherHigherEducationApplicationService: TeacherHigherEducationApplicationService,
  ) { }

  async ngOnInit() {
    this.DTECommitteeFormGroup = this.fb.group({
      DTECommitteeName: ['', Validators.required],
    })

    this.DTECommitteeMemberFormGroup = this.fb.group({
      SSOID: ['', Validators.required],
    })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.activatedRoute.queryParams.subscribe((params) => {
      this.DTECommitteeTeamID = params['id'];
      console.log("this.InspectionTeamID:", this.DTECommitteeTeamID);
    });

    if (this.DTECommitteeTeamID != undefined && this.DTECommitteeTeamID != null && this.DTECommitteeTeamID != 0) {
      this.GetById_Team(this.DTECommitteeTeamID);
    }
  }

  get _DTECommitteeFormGroup() { return this.DTECommitteeFormGroup.controls; }
  get _DTECommitteeMemberFormGroup() { return this.DTECommitteeMemberFormGroup.controls; }

  async AddMoreMember(data: any) {
    this.isSubmitted = true;
    if (data == null && data == undefined) {
      await this.SSOIDGetSomeDetails(this.requestMember.SSOID);
    }

    if (this.DTECommitteeMemberFormGroup.invalid) {
      console.log("Invalid");
      return
    }

    if (data && data.Data) {
      const IsDuplicate = this.request.DTECommitteeMemberDetails.some((element: any) =>
        data.Data == element.StaffID
      );
      if (IsDuplicate && data) {
        this.toastr.error('Already Exists');
        return;
      }
    }
    else {
      return
    }

    this.requestMember.StaffName = this.formData.Name
    this.requestMember.StaffID = data.Data;
    this.requestMember.SSOID = this.formData.SSOID;

    console.log(this.requestMember);

    this.request.DTECommitteeMemberDetails.push(this.requestMember);

    this.isFormReadOnly = true;

    console.log("this.request on push", this.request);

    this.requestMember = new DTECommitteeMemberDetailsDataModel();
    this.isSubmitted = false;
  }

  async SaveData() {

    this.isFormSubmitted = true
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.request.RoleID = this.sSOLoginDataModel.RoleID;

    if (this.request.DTECommitteeMemberDetails.length == 0) {
      this.toastr.error("Please Add At Least One Member in Team");
      return;
    }

    if (this.request.DTECommitteeMemberDetails.length == 1) {
      this.request.DTECommitteeMemberDetails.forEach(element => {
        element.IsIncharge = true
      })
    }
    const hasIncharge = this.request.DTECommitteeMemberDetails.some(x => x.IsIncharge == true);
    if (!hasIncharge) {
      this.toastr.error("Please Select Incharge");
      return;
    }
    try {
      this.loaderService.requestStarted();

      await this.teacherHigherEducationApplicationService.THTE_DTECommitteeSaveData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        var id = data.Data
        if (data.State === EnumStatus.Success) {
          this.toastr.success("Saved Successfully");
          this.GetById_Team(id);
          this.router.navigate(['/thte-committee-list-dte']);

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


  async ResetData() {
    this.request.DTECommitteeMemberDetails = [];
  }

  formatDateToInput(dateStr: string): string {
    if (!dateStr) return '';

    const [datePart] = dateStr.split(' '); // get "20-06-2025"
    const [day, month, year] = datePart.split('/');

    return `${year}-${month}-${day}`; // returns "2025-06-20"
  }

  async GetById_Team(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.teacherHigherEducationApplicationService.THTE_GetDTECommitteeById(id, this.sSOLoginDataModel.RoleID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        var id = data.Data
        if (data.State === EnumStatus.Success) {
          this.request = data.Data
          this.DTECommitteeFormGroup.get('DTECommitteeName')?.disable();

        } else if (data.State === EnumStatus.Warning) {
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
    this.request.DTECommitteeMemberDetails.forEach(element => {
      element.IsIncharge = false;
    })
    this.request.DTECommitteeMemberDetails.forEach(element => {
      if (element.StaffID == staff.StaffID) {
        element.IsIncharge = !element.IsIncharge;
      }
    })
  }

  async DeleteRow(item: DTECommitteeMemberDetailsDataModel) {
    const index: number = this.request.DTECommitteeMemberDetails.indexOf(item);
    console.log("index", index)
    if (index != -1) {
      this.request.DTECommitteeMemberDetails.splice(index, 1)
      // this.ddlSemester_Change();
    }
  }



  async SSOIDGetSomeDetails(SSOID: string): Promise<void> {
    if (!SSOID || SSOID.trim() === "") {
      this.toastr.error("Please enter SSOID");
      return;
    }
    try {
      this.requestCommitteeStaffSSOIDSearchModel.SSOID = SSOID;
      this.requestCommitteeStaffSSOIDSearchModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      const username = SSOID;
      const appName = 'madarsa.test';
      const password = 'Test@1234';
      // let requestSSoApi:any = {};
      this.requestSSoApi.SSOID = username;
      this.requestSSoApi.appName = appName;
      this.requestSSoApi.password = password;

      // const data: any = await this.teacherHigherEducationApplicationService
      //   .Bter_CommitteeStaffCheckSSOID(this.requestCommitteeStaffSSOIDSearchModel);
      const data: any = await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi);
      console.log(data);
      const response = JSON.parse(data?.Data);
      if (!response) {
        this.toastr.error("SSO ID not found. Staff record does not exist.");
        return;
      }

      let parsedData: any;
      try {
        parsedData = response;
      } catch (e) {
        console.error("Error parsing SSOID response:", e);
        this.toastr.error("Invalid data format received from server.");
        return;
      }

      if (parsedData) {
        this.formData = {
          ...this.formData,
          Name: parsedData.displayName,
          MobileNo: parsedData.mobile,
          EmailID: parsedData.mailPersonal,
          SSOID: SSOID
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
