export class ApprenticeshipReportEntity {
  public PoliticalEstablishmentspartNo: string = '';
  public PrivateEstablishmentspartNo: string = '';
  public PoliticalEstablishmentscontactedNo: string = '';
  public PrivateEstablishmentscontactedNo: string = '';
  public CandidatespresentMaleNo: string = '';
  public CandidatespresentFemaleNo: string = '';
  public CandidatessselectedMaleNo: string = '';
  public CandidatessselectedFemaleNo: string = '';
  public ID: number = 0;
  public UserId: number = 0;
  public EndTermID : number = 0;
  public DepartmentID: number = 0;
  public RoleID: number = 0;
  public Createdby: number = 0;
  public IsActive: number = 0;
  public InstituteID: number = 0;
}

export class WorkshopProgressReportDataEntity
{
  public workshopDate: string = '';
  public OrganisedDistrictName: number = 0;
  public SelectedDistrictList: number = 0;
  public establishmentName: string = '';
  public establishmentAddress: string = '';
  public representativeName: string = '';
  public representativedesignation: string = '';
  public representativeMobile: string = '';
  public Remars: string = '';
  public ID: number = 0;
  public UserId: number = 0;
  public EndTermID: number = 0;
  public DepartmentID: number = 0;
  public RoleID: number = 0;
  public Createdby: number = 0;
  public IsActive: number = 0;

}

export interface ApprenticeshipEntry {
  Nameofinstitute: string;
  dateofregistration: string;
  BusinessName: string[];
  NumberofTrainees: number;
  Numberofapprentices: string;
  Remarks: string;
  EndTermID: number ;
  DepartmentID: number ;
  RoleID: number ;
  Createdby: number;
  PKID: number,
  NumberOfRegistrationDoc: string;
}
export interface ApprenticeshipSubmission {
  apprenticeshipEntries: ApprenticeshipEntry[];
}
