import { RequestBaseModel } from "./RequestBaseModel";
import { ResponseBaseModel } from "./ResponseBaseModel";

export class TeacherHigherEducationApplicationRequestModel extends RequestBaseModel {
  ApplicationID: number = 0;
  ApplicationNo: string = '';
  MobileNo: string = '';
  StudentName: string = '';
  InstituteID: number = 0;
  StreamID: number = 0;
  SemesterID: number = 0;
  Selected: boolean = false;
  EnrollmentNo: string = '';
}
export class TeacherHigherEducationApplicationSaveModel extends ResponseBaseModel {
 
  THTEAppID: number = 0;
  StaffID: number = 0;
  SSOID: string = '';
  TeacherName: string = '';
  DOB: string = '';
  JoiningDate: string = '';
  AppliedCourse: number = 0;
  AppliedInstitute: string = '';
  PHDStatus: number = 0;
  PHDStatusSt: string = '';
  AppliedInstituteDistance: string = '';
  AppliedInstituteCourseCategory: number = 0;
  AppliedInstituteSubCategory: number = 0;
  SessionID : number = 0;
  Remark: string = '';
  CreatedBy: number = 0;
  InstituteID: number = 0;
  QualificationAtJoining: string = '';
  QualificationAfterJoining: string = '';
  CollegeDetailList:any=[]
}

export class TeacherHigherEducationApplicationVerificationModel extends RequestBaseModel {
  ApplicationID: number = 0;
  ApplicationNo: string = '';
  MobileNo: string = '';
  StudentName: string = '';
  InstituteID: number = 0;
  StreamID: number = 0;
  SemesterID: number = 0;
  Selected: boolean = false;
  EnrollmentNo: string = '';
}
export class TeacherHigherEducationApplicationVerificationSaveModel extends ResponseBaseModel {
  StudentId: number = 0;
  StudentExamID: number = 0;
  Remark?: string = '';
}

export class THTE_DDL  {
  Id: number = 0;
  Name?: string = '';
  UserID?: number = 0;
  RoleID?: number = 0;
  StaffID?: number = 0;
}

export class THTE_ApplicationSearchModel {
  public Id: number = 0;
  public THTEAppID: number = 0;
  public Name: string = '';
  public StaffID: number = 0;
  public action :string=''
}

export class PrincipleApplicationListSearchModel extends RequestBaseModel {
  public Id: number = 0;
  public THTEAppID: number = 0;
  public Name: string = '';
  public StaffID: number = 0;
  public status?: number = 0;
}

export class THTE_DropdownDataModel{
  public action?: string = ''
  public RoleID?: number = 0
}

// public class UpdateApplicationStatusDataModel_Principle
// {
//     public int? THTEAppID { get; set; }
//     public int? ModifyBy { get; set; }
// }

export class UpdateApplicationStatusDataModel_Principle {
  public THTEAppID?: number = 0;
  public ModifyBy?: number = 0;
  public status?: number = 0;
  public Remark?: string = '';
  public RoleID?: string = '';
  public CommitteeDocs?: string = '';
  public Dis_CommitteeDocs?: string = '';
}

export class UpdateApplicationStatusDataModel_Committee {
  public status?: number = 0;
  public CommitteeID?: number = 0;
  public Remark?: string = '';
  public RoleID?: number = 0;
  public ModifyBy?: number = 0;
  public CommitteeDocs?: string = '';
  public Dis_CommitteeDocs?: string = '';
  public ApplicationListData?: ApplicationListDataModel_THTE[] = [];
}

export class ApplicationListDataModel_THTE {
  public THTEAppID?: number = 0;
}

export class ApplicationGenrateOrderByDteListSearchModel extends RequestBaseModel {
    public Id: number = 0;
    public THTEAppID: number = 0;
    public Name: string = '';
    public StaffID: number = 0;
    public status?: number = 0;
    public THTEAppIDs?: string = '';
}

export class CommitteeDataModel extends RequestBaseModel {
  public InspectionTeamID: number = 0;
  public InspectionTeamName: string = '';
  public UserID: number = 0
  public TeamInitials: string = ''
  public InspectionMemberDetails: CommitteeMemberDetailsDataModel[] = []
  public InspectionDeploymentDetails: CommitteeDeploymentDataModel[] = []
  public TeamTypeID: number = 0
  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''
}

export class CommitteeMemberDetailsDataModel extends RequestBaseModel {
  public ID: number = 0
  public DistrictID: number = 0
  public InstituteID: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0
  public SSOID: string = ''
  public ShiftID: number = 0
  public StaffID: number = 0
  public ManagementTypeID?: number = 0
  IsIncharge: boolean = false

  public DistrictName: string = ''
  public InstituteName: string = ''
  public StreamName: string = ''
  public SemesterName: string = ''
  public ShiftName: string = ''
  public StaffName: string = ''
  public latitude?: string = ''
  public longitude?: string = ''
  public photo?: string = ''
  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''
}


export class CommitteeDeploymentDataModel extends RequestBaseModel {
  public DistrictID: number = 0
  public InstituteID: number = 0
  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''
  public InspectionTeamID: number = 0
  public UserID: number = 0
  public DeploymentID: number = 0
  public DistrictName: string = ''
  public InstituteName: string = ''
  public DeploymentType?: number = 0
  public DeploymentTypeName?: string = ''

}


export class CommitteeSearchModel extends RequestBaseModel {
  public InspectionTeamID?: number = 0
  public Status?: number = 0
  public InspectionID?: number = 0
  public TypeID?: number = 0
  public DeploymentDate?: string = ''
  public InspectionTeamName?: string = ''
  public DeploymentStatus?: string = ""
  public TeamName?: string = ''
  public StaffID?: number = 0
  public UserID?: number = 0
  public LevelId?: number = 0
  public DistrictID?: number = 0

  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''
}

export class CommitteeStaffSSOIDSearchModel {
  public DepartmentID: number = 0;
  public SSOID: string = '';
  public RoleID: number = 0;
  public InstituteID: number = 0;
}

export class DTECommitteeDataModel extends RequestBaseModel {
  public DTECommitteeID: number = 0;
  public UserID: number = 0;
  public DTECommitteeName: string = '';
  public DTECommitteeMemberDetails: DTECommitteeMemberDetailsDataModel[] = [];
}

export class DTECommitteeMemberDetailsDataModel {
  public CommitteeMemberID: number = 0
  public SSOID: string = ''
  public StaffID: number = 0
  public IsIncharge: boolean = false
  public StaffName: string = ''
}