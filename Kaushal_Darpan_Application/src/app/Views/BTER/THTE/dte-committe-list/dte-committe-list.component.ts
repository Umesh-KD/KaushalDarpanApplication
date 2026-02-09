import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumDeploymentStatus, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { InspectionMemberDetailsDataModel, ITI_InspectionDataModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommitteeSearchModel } from '../../../../Models/TeacherHigherEducationApplicationDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { TeacherHigherEducationApplicationService } from '../../../../Services/teacher-higher-education-application/teacher-higher-education-application.service';

@Component({
  selector: 'app-dte-committe-list',
  standalone: false,
  templateUrl: './dte-committe-list.component.html',
  styleUrl: './dte-committe-list.component.css'
})
export class DTECommitteListComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  _EnumDeploymentStatus = EnumDeploymentStatus
  searchRequest = new CommitteeSearchModel();
  InspectionData: any = [];
  InspectionTeamID: number = 0
  public request = new ITI_InspectionDataModel();
  public requestMember = new InspectionMemberDetailsDataModel();

  modalReference: NgbModalRef | undefined;
  modalReference1: NgbModalRef | undefined;

  closeResult: string | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  // private modalService = inject(NgbModal);
  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private appsettingConfig: AppsettingService,
    public teacherHigherEducationApplicationService: TeacherHigherEducationApplicationService,

  ) { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.THTE_GetDTECommitteeList()
  }

  async THTE_GetDTECommitteeList() {
    try {
      this.loaderService.requestStarted();

      this.searchRequest.UserID = this.sSOLoginDataModel.UserID
      this.searchRequest.LevelId = this.sSOLoginDataModel.LevelId
      this.searchRequest.InstituteId = this.sSOLoginDataModel.InstituteID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID

      await this.teacherHigherEducationApplicationService.THTE_GetDTECommitteeList(this.searchRequest).then((data: any) => {

        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.InspectionData = data.Data
          console.log("this.InspectionData", this.InspectionData)
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  async ResetControl() {
    this.searchRequest = new CommitteeSearchModel();
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID
    this.searchRequest.LevelId = this.sSOLoginDataModel.LevelId
    this.THTE_GetDTECommitteeList();
  }

  
}
