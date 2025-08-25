import { RequestBaseModel } from "./RequestBaseModel";

export class ItiApplicationDataModel extends RequestBaseModel{
 // public ApplicationNo: string = '';
  public EnrollmentNo: string = '';
  public Name: string = '';
  public InstituteID: number = 0;
  public ManagementTypeID: number = 0;
  public MobileNo: string = '';
  public BranchID: number = 0;
  public Year_SemID: number = 0;
  public FinacialYearID: number = 0
  public StudentTypeID: number = 0;
  public StudentStatusID: number = 0;
  public StudentFilterStatusId: number = 0;
  public ExamCategoryID: number = 0;
  public OptionalSubjectStatus: string = '0';
  public BridgeCourseID: string = '-1';
}

export class ItiDashApplicationSearchModel {
  public DepartmentID: number = 0;
  public ApplicationID?: number = 0;
  public StudentName: string = '';
  public MobileNumber: string = '';
  public Gender: number = 0;
  public InstituteID: number=0;
  public DistrictID: number = 0;
  public CategoryA: number = 0;
  public CategoryB: number = 0;
  public CategoryC: number = 0;
  public CategoryD: number = 0;
  public EndTermID: number = 0;
  public Eng_NonEng: number = 0;
  public FinancialYearID: number = 0;
  
  public UrlStatus: number = 0;
  public PageSize: number = 50
  public PageNumber: number = 1

  public SortOrder: string = '';
  public SortColumn: string = '';

  public TradeLevelId: number = 50
  public ManagementTypeId: number = 1

  public ITICode: string = '';
  public TradeCode: string = '';
  public PaymentReciept: string = '';


}





