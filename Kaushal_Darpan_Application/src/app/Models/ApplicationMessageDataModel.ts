export class ApplicationMessageDataModel {
  public MobileNo?: string = '';
  public MessageType?: string = '';
  public ApplicantName?: string = '';
  public ApplicationNo?: string = '';
  public ApplicationType?: string = '';
  public Scheme?: string = '';
  public ApplicationDetails?: ApplicationDetails[] = [];
  public MeritId?: number = 0
}
export class ApplicationDetails {
  public ApplicationID: string = '';
}
