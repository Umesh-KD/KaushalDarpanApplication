import { RequestBaseModel } from "./RequestBaseModel";

export class GenerateEnrollSearchModel extends RequestBaseModel {
  public InstituteID: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0;
  public action: string = '';
  public ActionID: number = 0;
  public Status: number = 0;
  public UserID: number = 0;
  public IsEnrollRegistrarVerified: boolean = false
  public EnrollPublishOrder: number = 0
  public VerifierStatus: number = 0
  public StudentEntryType: number = 0
  public ModuleID: number = 0
  public Remark: string = ''

  public StudentTypeID: number = 0;
  public ShowAll: number = 0;
  public PDFType: number = 0
  public StatusID: number = 0
  public IsEnrollExaminationVerified: boolean = false
}



export class GenerateEnrollData extends RequestBaseModel {
  public StudentID: number = 0
  public ApplicationID: number = 0
  public StudentName: string = ''
  public FatherName: string = ''
  public InstituteName: string = ''
  public SemesterName: string = ''
  public temp_Enrollment: string = ''
  public DOB: string = ''
  public InstituteID: number = 0
  public MobileNo: number = 0
  public StreamName: number = 0
  public StreamID: number = 0
  public SemesterID: number = 0
  public Marked: boolean = false
  public ModifyBy: Number = 0
  public CourseTypeID: Number = 0
  public Status: number = 0

  public EnrollmentNo: string = ''
  public RollNumber: string = ''
  public StudentCategory: string = ''
  public InstituteCode: string = ''
  public Selected: boolean = false
  public IsVerified: boolean = false
  public IsEnrollRegistrarVerified: boolean = false
  public IsEnrollExaminationVerified: boolean = false
  public EnrollVerifyerStatus: number = 0
  public EnrollPublishOrder: number = 0
  public VerifyerStatusName: string = ''


}
