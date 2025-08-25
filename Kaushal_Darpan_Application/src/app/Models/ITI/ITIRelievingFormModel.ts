export class ITIExaminerRelievingModel{
    NCVTPracticalExam : string = '';
    DateOfExamination : string = '';
    Trade : string = '';
    PracticalExamCentre : string = '';
    PracticalExaminerName : string = '';
    PracticalExaminerDesignation : string = '';
    PracticalExaminerNumber : string = '';
    NoOfTotalTrainees : number = 0;
    NoOfPrsentTrainees : number = 0;
    NoOfAbsentTrainees : number = 0;
    MarckSheetPacket : boolean = false;
    CopyPacket : boolean = false;
    PracticalPacket : boolean = false;
    PracticalTeacherPacket : boolean = false;
    SealedPacket : boolean = false;
    BillPacket : boolean = false;
    OtherInfo : boolean = false;
    OtherInfoText : string = '';
    ModifyBy : string = '';
    DepartmentID : string = '';
    CenterAssignedID:number=0;
}

export class ITICoordinatorRelievingForm {
   NCVTPracticalExam : string = '';
    DateOfExamination : string = '';
    Trade : string = '';
    PracticalExamCentre : string = '';
    PracticalSuperintendentName : string = '';
    PracticalSuperintendentNumber : string = '';
    PracticalCoOrdinatorName : string = '';
    PracticalCoOrdinatorDesignation : string = '';
    PracticalCoOrdinatorNumber : string = '';
    NoOfRegisteredInstitutes : number = 0;
    DetailsOfPresentExaminers : number = 0;
    isMarkingSheetEnvelopeSubmitted : boolean = false;
    isCopyEnvelopeJob2Submitted : boolean = false;
    isPracticalCopyEnvelopeSubmitted : boolean = false;
    isHonorariumEnvelopeSubmitted : boolean = false;
    isSealedPracticalJobsSubmitted : boolean = false;
    isCenterReportAttached : boolean = false;
    isHonorariumPaidOrVerified : boolean = false;
    HonorariumAmount : number = 0;
    OtherInfo : string = '';
    AdditionalExaminerRemarksSubmitted : string = '';
    ModifyBy : string = '';
    DepartmentID : string = '';
    ExamCoordinatorID: number = 0;
    Remarks: string = '';
}
  
