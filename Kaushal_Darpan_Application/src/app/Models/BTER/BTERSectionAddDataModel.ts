import { RequestBaseModel } from "../RequestBaseModel";

export class BTERSectionAddDataModel extends RequestBaseModel {
  public DayID: number = 0;
  public SemesterID: number = 0;
  public StreamID: number = 0;
  public SubjectID: string = '';
  public StaffID: number = 0;
  public SectionID: number[] = [];
  public AttendanceStartTime: string = '';
  public AttendanceEndTime: string = ''; 
  public DayName: string = ''; 
  public SubjectName: string = ''; 
  public BranchName: string = ''; 
  public TeacherName: string = '';
  public SectionName: string = ''; 
  public SemesterName: string = ''; 
  public CreatedBy: number = 0;
  public AttendanceDate: Date = new Date();
  public ID: number = 0;
}






