export class ApplicationMessageDataModel {
  public MobileNo?: string = '';
  public MessageType?: string = '';
  public ApplicantName?: string = '';
  public ApplicationNo?: string = '';
  public ApplicationType?: string = '';
  public Scheme?: string = '';
  public Status?: string = '';
  public ApplicationDetails?: ApplicationDetails[] = [];
  public MeritId?: number = 0
  public CheckIn_CheckOut?: string = '';
  public NodalType?: string = '';
  public CampusID?: string = '';
  public ActionDate?: string = '';
  public CampusLocationURL?: string = '';
  public ReferenceID?: string = '';
  public EnrollmentNo?: string = '';
  public RegNo?: string = '';
}
export class ApplicationDetails {
  public ApplicationID: string = '';
}


export class SmsDataModel {
  public PostID: number = 0;
  public StudentID: number = 0;
  public CompanyID: number = 0;
  public Flag: string = '';
}
