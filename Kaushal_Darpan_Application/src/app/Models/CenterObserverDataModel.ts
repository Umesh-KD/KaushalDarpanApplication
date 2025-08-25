import { RequestBaseModel } from "./RequestBaseModel";

export class CenterObserverDataModel extends RequestBaseModel {
    public TeamID: number = 0
    public UserID: number = 0
    public TeamName: string = ''
    public TeamInitials: string = ''
    public ObserverDetails: ObserverDetailsDataModel[] = []
}

export class ObserverDetailsDataModel {
    public ID: number = 0
    public DistrictID: number = 0
    public InstituteID: number = 0
    public StreamID: number = 0
    public SemesterID: number = 0
    public SSOID: string = ''
    public ShiftID: number = 0
    public StaffID: number = 0
    public UserID?: number = 0
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
}

export class CenterObserverSearchModel extends RequestBaseModel {
    public TeamID: number = 0
    public Status: number = 0
    public DeploymentID?: number = 0
    public TypeID?: number = 0
    public ExamDate?: string = ''
    public DeploymentStatus?: number = -1
    public TeamName?: string = ''
    public StaffID?: number = 0
  public UserID?: number = 0
  public StatusID: number = 0;
}

export class CenterObserverDeployModel extends RequestBaseModel {
    public DeploymentDetails: DeploymentDataModel[] = []
    public TeamID: number = 0
    public UserID: number = 0
}

export class DeploymentDataModel extends RequestBaseModel {
    public DistrictID: number = 0
    public InstituteID: number = 0
    public ShiftID: number = 0
    public DeploymentDate: string = ''
    public TeamID: number = 0
    public UserID: number = 0

    public DistrictName: string = ''
    public InstituteName: string = ''
    public ShiftName: string = ''
}

export class StaffMasterDDLDataModel extends RequestBaseModel {
    public InstituteID: number = 0
}

export class CenterMasterDDLDataModel extends RequestBaseModel {
    public DistrictID: number = 0
}

export class CODeploymentDataModel extends RequestBaseModel {
    public DistrictID: number = 0
    public InstituteID: number = 0
    public ShiftID: number = 0
    public DeploymentDate: string = ''
    public CenterObserverTeamID: number = 0
    public UserID: number = 0
    public TeamName: string = ''
    public IPAddress: string = ''

    public DistrictName: string = ''
    public InstituteName: string = ''
    public ShiftName: string = ''
    public Selected: boolean = false
    public DeploymentStatus: number = 0
    public DeploymentID: number = 0

    public ExamDate?: string = ''

    public ObserverDetails: ObserverDetailsDataModel[] = []
}

export class GenerateDutyOrder extends RequestBaseModel {
    public DeploymentID: number = 0
    public CenterObserverTeamID: number = 0
    public IPAddress: string = ''
}
