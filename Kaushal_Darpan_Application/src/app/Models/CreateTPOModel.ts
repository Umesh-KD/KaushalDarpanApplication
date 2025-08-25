export class CreateTpoSearchModel {
  public InstituteName: string = ''
  public DistrictID: number = 0
  public DepartmentID: number = 0
}

export class CreateTpoAddEditModel {
  public UserID: number = 0//insert or update on behalf
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
  public ModifyBy: number = 0
  public IPAddress: string = ''
  public DepartmentID: number = 0
}

export class TPOWebsiteSearchModel {
  public StateID: number = 0
  public InstituteID: number = 0
  public DistrictID: number = 0
  public InstituteNameEnglish: string = ''
 
}



