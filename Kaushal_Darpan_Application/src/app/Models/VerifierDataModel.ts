export class VerifierDataModel {
  public VerifierID: number = 0
  public Name: string = ''
  public SSOID: string = ''
  public Email: string = ''
  public MobileNumber: string = ''
  public Remark: string = ''

  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = false
  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public DepartmentID: number = 0
  public RoleID: number = 0
  public CourseType: number = 0
  public ShowAllApplication: boolean = false;

}

export class NodalVerifierDataModel {
  public NodalUserId: number = 0
  public CenterID: number = 0
  public Name: string = ''
  public SSOID: string = ''
  public Email: string = ''
  public MobileNumber: string = ''
  public Remark: string = ''

  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = false
  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public DepartmentID: number = 0
  public RoleID: number = 0
  public UserID: number = 0
  public CourseType: number = 0
  public ShowAllApplication: boolean = false;

}

export class VerifierSearchModel {
  public SSOID: string = ''
  public Name: string = ''
  public MobileNo: string = ''
  public DepartmentID: number = 0
  public CourseType: number = 0
  public Userid: number = 0;
}
export class TotalStudentReportedListModel {
  public SSOID: string = ''
  public Name: string = ''
  public MobileNo: string = ''
  public Status: number = 0
  public DepartmentID: number = 0
  public CourseType: number = 0
  public Userid: number = 0;
  public RoleID: number = 0;
  public EndTermID: number = 0;
}
export class VerifierApiDataModel {
  public VerifierID: number = 0
  public Name: string = ''
  public SSOID: string = ''
  public Email: string = ''
  public MobileNumber: string = ''
  public Remark: string = ''
  public appName: string = ''
  public password: string = ''

  public ActiveStatus: boolean = true
  public DeleteStatus: boolean = false
  public ModifyBy: number = 0
  public CreatedBy: number = 0
  public DepartmentID: number = 0
  public RoleID: number = 0
  public CourseType: number = 0
  public ShowAllApplication: boolean = false;

}


export class NodalDataModel {
  public NodalID: number = 0
  public CenterName: string = ''
  public OfficerName: string = ''
  public OfficerSSOID: string = ''
  public EmailAddress: string = ''
  public MobileNo: string = ''
  public Address: string = ''
  public DepartmentId: number = 0
  public CourseTypeId: number = 0
  public CenterCode: string = ''
  public CreatedBy: number = 0;
  public Status: number = 0;
  public IPAddress: string = ''
  public Action: string = ''
}



