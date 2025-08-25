import { RequestBaseModel } from "../RequestBaseModel";

export class DetainedStudentsSearchModel extends RequestBaseModel {
    public InstituteID: number = 0;
    public StreamID: number = 0;
    public SemesterID: number = 0;
    public EnrollmentNo: string = '';
}

export class DetainedStudentsDataModel extends RequestBaseModel {
    public StudentID: number = 0;
    public UserID: number = 0;
}