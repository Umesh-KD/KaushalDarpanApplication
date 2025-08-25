export class MasterConfigurationModel {
  public CommonSubjectDetailsID: number = 0;
  public CommonSubjectID: number = 0;
  public SubjectID: number = 0;
}

export class FeeConfigurationModel {
  public FeeID: number = 0
  public TypeID: number = 0
  public SemesterID: number = 0
  public StreamID: number = 0
  public CasteCategoryID: number = 0
  public CasteCategoryName: string = ""
  public FeeAmount?: number = undefined
  public IsLateFeeApplicable: boolean = false
  public LateFeeAmount?: number = undefined
  public DepartmentID: number = 0
  public EndTermID: number = 0
  public FinancialYearID: number = 0
  public CourseTypeID: number = 0
  public ModifyBy: number = 0
  public Remark: string = "";
  public RoleID: number = 0;
  public BackFeeAmount: number = 0;
  public BackSubjectCount: number = 0;

}

export class SerialMasterConfigurationModel {
  public SerialID: number = 0
  public TypeID: number = 0
  public SemesterID: number = 0
  public StaticVal: string = ""
  public StartFrom: number = 1
  public PartitionSize: number = 0
  public DepartmentID: number = 0
  public CourseTypeID: number = 0
  public EndTermID: number = 0
  public FinancialYearID: number = 0
  public ModifyBy: number = 0
  public Remark: string = "";
  public CCcodeLength?: number = 0
  public RoleID: number = 0
}

export class CommonSignatureModel {
  public SignatureId: number = 0
  public TypeId: number = 0
  public FinancialYearID: number = 0
  public EndTermId: number = 0
  public ActiveStatus: number = 0
  public CreatedBy: number = 0
  public IPAddress: string = "";
  public DepartmentID: number = 0
  public CourseTypeID: number = 0
  public Action: string = "";
  public SignatureFile: string = "";
  public Designation: string = "";
  public Name: string = "";
}
export class BterCommonSignatureModel {
  public SignatureId: number = 0
  public TypeId: number = 0
  public FinancialYearID: number = 0
  public EndTermId: number = 0
  public ActiveStatus: number = 0
  public CreatedBy: number = 0
  public IPAddress: string = "";
  public DepartmentID: number = 0
  public CourseTypeID: number = 0
  public Action: string = "";
  public SignatureFile: string = "";
  public Designation: string = "";
  public Name: string = "";
}
