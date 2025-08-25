import { RequestBaseModel } from "../RequestBaseModel";

export class SsoidUpdateDataModel extends RequestBaseModel {
  public UserID: number = 0
  public InstituteID: number = 0
  public DistrictNameEnglish: string = ''
  public InstituteNameEnglish: string = ''
  public InstituteNameHindi: string = ''
  public MobileNumber: string = ''
  public SSOID: string = ''
  public Name: string = ''
  public Email: string = ''
  public EmailOfficial: string = ''
  public Marked: boolean = false;
  public IPAddress: string = ''
  public OldSSOID: string = ''
}

export class SsoidUpdateSearchModel extends RequestBaseModel {
    public InstituteName: string = ''
    public DistrictID: number = 0
    public InstituteID: number = 0
}
