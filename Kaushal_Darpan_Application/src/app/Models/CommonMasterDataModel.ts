import { RequestBaseModel } from "./RequestBaseModel";

export interface IDistrictMaster_StateIDWiseDataModel {
  DistrictID: number;
  DistrictName: string
}

export interface IStateMasterDataModel {
  StateID: number;
  StateName: string
}

export class ItiTradeSearchModel {
  public CollegeID: number = 0
  public action: string = ''
  public TradeLevel: number = 0
  public IsPH: number = 0
  public CourseTypeID?: number = 0
  public TradeTypeId?: number = 0
  public Age: number = 0
  public Gender: number = 0
  public DistrictID: number = 0
  public ManagementTypeID: number = 0
  public CollegeCode: string = ''
  public TradeCode: string = ''

  //public MathPercentage: string = '0.00'
  //public SciencePercentage: string ='0.00'
}

export class ItiCollegesSearchModel {
  public DistrictID: number = 0
  public action: string = ''
  public ManagementType: string = ''
  public ManagementTypeID?: number | undefined = 0;
}

export class UpwardMoment {
  public ApplicationID: number = 0
  public AllotmentId: number = 0
  public IsUpward: boolean = false
  public UserID: number = 0
}

export class ItiStuAppSearchModelUpward {
  public ApplicationNo: string = ''
  public action: string = ''
  public FinancialYearID: number = 0
  public SSOID: string = ''
  public DOB: string = ''
  public MobileNumber: string = ''
  public EndTermID: number = 0
  public DepartmentID: number = 0

}

export class TSPTehsilDataModel {
  public DistrictID: number = 0
}

export class StreamDDL_InstituteWiseModel {
  public InstituteID: number = 0
  public ApplicationID: number = 0
  public StreamType:number=0
  public action: string = ''

}

export class QualificationDDLDataModel {
  public QualificationLevel: string = ''
  public DepartmentID: number = 0

}

export class DDL_InvigilatorSSOID_DataModel extends RequestBaseModel {
  public InstituteID: number = 0
}



