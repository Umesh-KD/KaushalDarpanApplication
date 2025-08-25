export interface PaperUpload {
  PaperUploadID: number;
  ExamID: number;
  ExamName: string;
  StreamID: number;
  SemesterID: number;
  Password: string;
  PaperID: number;
  EndTermID: number;
  FinancialYearID: number;
  FileName: string;
  Dis_FileName: string;
  PaperDate: string;
  CenterCode: string;
  Active: boolean;
  CreatedBy: string;
  ModifyBy: string;
  ModifyDate: string;
  IPAddress: string;
}
export interface PaperUploadInterface {
  PaperUploadID: number
  ExamID: number
  ExamName: string
  StreamID: number
  SemesterID: number
  Password: string
  PaperID: number
  EndTermID: number
  FinancialYearID: number
  FileName: string
  Dis_FileName: string
  PaperDate: string
  CenterCode: string
  Active: boolean
  CreatedBy: number
  ModifyBy: number
  ModifyDate: string
  IPAddress: string
  FinancialYearName: string
  SemesterName: string
  StreamName: string
  PaperType: string
}
