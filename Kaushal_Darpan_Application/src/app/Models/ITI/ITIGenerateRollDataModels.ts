import { RequestBaseModel } from "../RequestBaseModel";


export class ITIGenerateRollSearchModel extends RequestBaseModel {
  public InstituteID: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0;
  public VerifierStatus: number = 0;
  public DistrictID?: number = 0;
  public ShowAll?: number = 0;
  public Status?: number = 0;
  public StudentTypeID?: number = 0;
}



export class ITIGenerateRollData {
  public StudentID: number = 0
  public ApplicationID: number = 0
  public EnrollmentNo: string = ''
  public RollNumber: string = ''
  public StudentName: string = ''
  public FatherName: string = ''
  public InstituteName: string = ''
  public SemesterName: string = ''
  public StudentCategory: string = ''
  public InstituteCode: string = ''
  public DOB: string = ''
  public InstituteID: number = 0
  public StreamID: number = 0
  public MobileNo: number = 0
  public SemesterID: number = 0
  Marked: boolean = false
  public EndTermID: number = 0
  public StreamName: number = 0
  public ModifyBy: number = 0
  /*public Initialvalue :number=0*/



}


export class ITIDownloadnRollNoModel
{
  public InstituteID: number = 0;
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public EndTermID: number = 0;
  public CenterName: string ='' ;
  public InstituteNameEnglish: string = '';
  public BranchCode: string = '';
  public StudentType: string = '';
  public EndTermName: string = '';
  public FinancialYearName: string = '';
  public Totalstudent: number = 0;
  public StudentTypeID: number = 0;

}

