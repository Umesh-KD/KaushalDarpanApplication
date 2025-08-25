import { RequestBaseModel } from "../RequestBaseModel";

export class ITI_ApprenticeshipDataModel extends RequestBaseModel{
    public ApprenticeshipTeamID: number = 0;
    public ApprenticeshipTeamName: string = '';
    public UserID: number = 0
    public TeamInitials: string = ''
    public ApprenticeshipMemberDetails: ApprenticeshipMemberDetailsDataModel[] = []
    public ApprenticeshipDeploymentDetails: ApprenticeshipDeploymentDataModel[] = []
    public TeamTypeID: number = 0
    public DeploymentDateFrom: string = ''
    public DeploymentDateTo: string = ''
}

export class ApprenticeshipMemberDetailsDataModel extends RequestBaseModel {
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


export class ApprenticeshipDeploymentDataModel extends RequestBaseModel {
  public DistrictID: number = 0
  public InstituteID: number = 0 
  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''
  public ApprenticeshipTeamID: number = 0
  public UserID: number = 0
  public DeploymentID: number = 0
  public DistrictName: string = ''
  public InstituteName: string = ''
  public DeploymentType?: number = 0
  public DeploymentTypeName?: string = ''

  public IndustryName?: string = ''
  public HeadName?: string = ''
  public Designation?: string = ''
  public Address?: string = ''
 
}

export class CenterMasterDDLDataModel extends RequestBaseModel {
  
  public action: string = ''
  public DistrictID: number = 0
  public InstituteID: number = 0

}

export class ApprenticeshipDeploymentSearchModel extends RequestBaseModel {
  public TeamID: number = 0
  public Status: number = 0
  public DeploymentID?: number = 0
  public TypeID?: number = 0
  public ExamDate?: string = ''
  public DeploymentStatus?: number = -1
  public TeamName?: string = ''
  public StaffID?: number = 0
  public UserID?: number = 0
}

export class DeploymentDataModel extends RequestBaseModel {
  public DistrictID: number = 0
  public InstituteID: number = 0

  public DeploymentDate: string = ''
  public TeamID: number = 0
  public UserID: number = 0

  public DistrictName: string = ''
  public InstituteName: string = ''

  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''

}

export class ITI_ApprenticeshipDropdownModel extends RequestBaseModel {
    public action: string = ''
    public DistrictID: number = 0
    public InstituteID: number = 0
    public ManagementTypeID?: number = 0
}

export class ITI_ApprenticeshipSearchModel extends RequestBaseModel {
    public ApprenticeshipTeamID?: number = 0
    public Status?: number = 0
    public ApprenticeshipID?: number = 0
    public TypeID?: number = 0
    public DeploymentDate?: string = ''
  public ApprenticeshipTeamName?: string = ''
  public DeploymentStatus?: string = ""
    public TeamName?: string = ''
    public StaffID?: number = 0
  public UserID?: number = 0
  public LevelId?: number = 0

  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''
}

export class ApprenticeshipGenOrderDataModel extends RequestBaseModel {
    public DistrictID: number = 0
    public InstituteID: number = 0
    public ShiftID: number = 0
    public DeploymentDate: string = ''
    public ApprenticeshipTeamID: number = 0
    public UserID: number = 0
    public ApprenticeshipTeamName: string = ''
    public IPAddress: string = ''

    public DistrictName: string = ''
    public InstituteName: string = ''
    public Selected: boolean = false
    public DeploymentStatus: number = 0
    public DeploymentID: number = 0

  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''

    public ApprenticeshipMemberDetails: ApprenticeshipMemberDetailsDataModel[] = []
}


export class SaveCheckSSODataModel extends RequestBaseModel {
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

  public Name: string = ''
  public MobileNo: string = ''
  public EmailID: string = ''

  public DeploymentDateFrom?: string = ''
  public DeploymentDateTo?: string = ''
}
