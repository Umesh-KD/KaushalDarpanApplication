

export class ITINodalOfficerExminerForm {

  ExamCenterUnderYourAreaID: number = 0; 
  MediumQuestionPaperSent: string = '';
  Date: string = '';
  ToDate: string = '';
  Reason: string = '';
  SupportingDocument_file: string = '';
  UploadDocument_file: string = '';
  SupportingDocument_fileName: string = '';
  UploadDocument_fileName: string = '';
  InspectTheExaminationCenters: boolean = false;
  CoordinatorReachOnTime: boolean = false;
  CoordinatorNotReached: number = 0;  
  AdditionalDetails: boolean = false;
  ExamSmooth: boolean = false;
  DocumentsSubmitted: boolean = false;
  ExamIncident: boolean = false;
  ExamRemarks: string = '';
  FutureCentreRemarks: string = '';
  FutureExamSuggestions: string = '';
  CreatedBy: number = 0;
  UpdatedBy: number = 0;
  EndTermID: number = 0;
  FinancialYearID: number = 0;
  ID: number = 0;
  public InspectExaminationCentersList: ITIInspectExaminationCenters[] = []

}
export class ITIInspectExaminationCenters {
  ID: number = 0;
  NameOfExaminationCentreID: number = 0;
  DateAndTimeOfInspection: string = '';
  TotalNumberOfCandidatesEnrolled: number = 0;
  CandidatesHadLeftAfterCompletingTheExam: number = 0;
  JobsCreated: number = 0;
  JobsBeingCreated: number = 0;
  VivaConducted: boolean = false;
  LineDiagramPrepared: boolean = false;
  ReadingTaken: boolean = false;
  NameOfExaminationCentre: string = '';
  ModifyBy: number = 0;
}

export class ITINodalOfficerExminerSearch {
  ID: number = 0;
  FinancialYearID: number = 0;
  Date: string = ''
  RoleID: number = 0
  UserID:number=0
  DistrictID: number = 0
  EndTermID:number=0
}
       

  
