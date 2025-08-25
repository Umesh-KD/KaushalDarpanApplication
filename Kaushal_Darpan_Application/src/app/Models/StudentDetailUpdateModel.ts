import { DocumentDetailsModel } from "./DocumentDetailsModel";

export class StudentDetailUpdateModel {
  public ApplicationID: number = 0;
  public StudentID: number = 0;
  public CreatedBy: number = 0;
  public EnrollmentNo: string = '';
  public StudentName: string = '';
  public FatherName: string = '';
  public MobileNo: string = '';
  public Email: string = '';
  public Remark: string = '';
  public StudentFilterStatusId: number = 0;
  public ApplicationNo: string = '';
  public DepartmentID: number = 0;
  public Eng_NonEng: number = 0;
  public Document: string = '';
  public Dis_Document: string = '';
}
