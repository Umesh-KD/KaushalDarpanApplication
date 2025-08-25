export class CenterSuperitendentExamReportModel {
    id?: number = 0;
    confidentialityLevel? : string ;
    examOnTime: boolean = false;
    examOnTimeRemark : string = '';

    examSchedule: string = '';

    markingGuidance : boolean = false;
    markingGuidanceRemark : string = '';
    markingGuidanceDocument : string = '';

    changeSizeOfUnits: boolean = false;
    changeSizeOfUnitsRemark: string = '';
    changeSizeOfUnitsDocument: string = '';

    lightFacilities: string = '';
    waterFacilities: string = '';
    discipline : string = '';
    toiletFacilities: string = '';

    incidentOnExam: boolean = false;
    incidentOnExamRemark: string = '';
    incidentOnExamDocument: string = '';

    examConductComment: boolean = false;
    examConductCommentRemark: string = '';
    // CommentsOnlightFacilities: string = '';
    // CommentsOnwaterFacilities: string = '';
    // CommentsOndiscipline: string = '';
    // CommentsOntoiletFacilities: string = '';

    futureExamCenterComment: boolean = false;
    otherFutureExamSuggestions: string = '';
    ExamCenterCommentDocument: string = '';

    flyingSquadDetails: string = '';
}

// export class ExamScheduleGroup {
//   examDate: string = '';
//   startTime: string = '';
//   endTime: string = '';
// }

// export class FlyingSquadGroup {
//   serialNumber: number = 0;
//   visitDate: string = '';
//   duration: string = '';
//   inchargeName: string = '';
//   inchargePosition: string = '';
//   vehicleNumber: number = 0;
// }