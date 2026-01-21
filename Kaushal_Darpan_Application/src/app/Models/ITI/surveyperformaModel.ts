
export class ITIApprWorkerSurveyPerformModel {
  public surveyPerformID: number = 0;
  public nameofEstablishment: string = '';
  public nameofDesignation: string = '';
  public headofEstablishmentAddress: string = '';
  public natureOfBusiness: string = '';
  public totalNoPersonEmployeed: number = 0;
  public basicTraningFacility: string = '';
  public distributionofWorker: string = '';

  public OtherITIWorkerDesignationTrade: ITIWorkerDesignationTradeModel[] = [new ITIWorkerDesignationTradeModel()];
  public OtherITIApprWorkerDetailsOfExistingApprenticeship: ITIApprWorkerDetailsOfExistingApprenticeshipModel[] = [new ITIApprWorkerDetailsOfExistingApprenticeshipModel()];
  public OtherITIApprWorkerDetalisOffacilities: ITIApprWorkerDetalisOffacilitiesModel[] = [new ITIApprWorkerDetalisOffacilitiesModel()];
}



export class ITIWorkerDesignationTradeModel {
  public designationTradeID: number = 0;
  public surveyPerformID: number = 0;
  public ncoNumberWorkers: number = 0;
  public lessSkilledWorker: number = 0;
  public fullySkilledWorker: number = 0;
  public totalWorker: number = 0;
  public remark: string = '';
  
}

export class ITIApprWorkerDetailsOfExistingApprenticeshipModel {

 public detailsOfExistingApprenticeshipID: number = 0;
 public surveyPerformID: number = 0;
 public tradeTraning: string = '';
 public durationofLastSurvey: string = '';
 public numberOfSeatsLocated: number = 0;
 public numberActuallyUndergoingTraning: number = 0;

}

export class ITIApprWorkerDetalisOffacilitiesModel {
  public detalisOffacilitiesTradeID: number = 0;
  public surveyPerformID: number = 0;
  public Trade: string = '';
  public durationOfTraning: number = 0;
  public numberOfSeatsSanctioned: number = 0;
  public naut_Deginate: string = '';
  public naut_Optional: string = '';
  public naut_NATS: string = '';
  public naut_Fresher: string = '';

}
export class GetAllsurveyperformaReportModel {
 
  public surveyPerformID: number = 0;
  

}
