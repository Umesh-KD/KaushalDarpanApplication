import { RequestBaseModel } from "../RequestBaseModel";
export class StudentFeesTransactionHistoryRptModel extends RequestBaseModel {
  public StudentID: number = 0;
  public EnrollmentNo: string = '';
  public ApplicationNo: string = '';
}


export class StudentFeesTransactionHistorySearchmodel {
  public DepartmentID: number = 0;
  public TransactionType: string = '';
  public Status: string = '';
  public TransactionId: string = '';
  public StudentExamID: number = 0;
}
