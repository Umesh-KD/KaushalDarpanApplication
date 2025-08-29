import { RequestBaseModel } from "../RequestBaseModel";

export class ITI_InspectionDataModel extends RequestBaseModel{
    public InspectionTeamID: number = 0;
    public InspectionTeamName: string = '';
    public UserID: number = 0
    public TeamInitials: string = ''
    public InspectionMemberDetails: InspectionMemberDetailsDataModel[] = []
    public InspectionDeploymentDetails: InspectionDeploymentDataModel[] = []
    public TeamTypeID: number = 0
    public DeploymentDateFrom: string = ''
    public DeploymentDateTo: string = ''
}

export class InspectionMemberDetailsDataModel extends RequestBaseModel {
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


export class InspectionDeploymentDataModel extends RequestBaseModel {
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

export class CenterMasterDDLDataModel extends RequestBaseModel {
  
  public action: string = ''
  public DistrictID: number = 0
  public InstituteID: number = 0

}

export class InspectionDeploymentSearchModel extends RequestBaseModel {
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

export class ITI_InspectionDropdownModel extends RequestBaseModel {
    public action: string = ''
    public DistrictID: number = 0
    public InstituteID: number = 0
    public ManagementTypeID?: number = 0
}

export class ITI_InspectionSearchModel extends RequestBaseModel {
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

export class InspectionGenOrderDataModel extends RequestBaseModel {
    public DistrictID: number = 0
    public InstituteID: number = 0
    public ShiftID: number = 0
    public DeploymentDate: string = ''
    public InspectionTeamID: number = 0
    public UserID: number = 0
    public InspectionTeamName: string = ''
    public IPAddress: string = ''

    public DistrictName: string = ''
    public InstituteName: string = ''
    public Selected: boolean = false
    public DeploymentStatus: number = 0
    public DeploymentID: number = 0

  public DeploymentDateFrom: string = ''
  public DeploymentDateTo: string = ''

    public InspectionMemberDetails: InspectionMemberDetailsDataModel[] = []
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
