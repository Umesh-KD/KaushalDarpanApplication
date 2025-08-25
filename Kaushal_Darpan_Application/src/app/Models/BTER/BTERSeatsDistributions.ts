export class BTERSeatsDistributionsDataModels {
  public id: number = 0;
  public max_strength: number = 0;
  public total_seats?: number;
  public remark: number = 0;
  public sc: number = 0;
  public sc_f: number = 0;
  public st: number = 0;
  public st_f: number = 0;
  public obc: number = 0;
  public obc_f: number = 0;
  public mbc: number = 0;
  public mbc_f: number = 0;
  public ews: number = 0;
  public ews_f: number = 0;
  public gen: number = 0;
  public gen_f: number = 0;
  public min: number = 0;
  public min_f: number = 0;
  public tsp: number = 0;
  public tsp_f: number = 0;
  public dny: number = 0;
  public dny_f: number = 0;
  public sahriya: number = 0;
  public sahriya_f: number = 0;
  public ph: number = 0;
  public ex_m: number = 0;
  public w_d: number = 0;
  public imcsc: number = 0;
  public imcst: number = 0;
  public imcobc: number = 0;
  public imcgen: number = 0;
  public imctotal: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public FinancialYearID: number = 0;
  public EndTermID: number = 0;
  public AllotmentMasterId: number = 0;
  public Type: string = '';
  public Action: string = ''
  public StreamTypeId: string = ''
  public PageSize: number = 0;
  public PageNumber: number = 0;
}

export class BTERSeatsDistributionsSearchModel {
  public id: number = 0;
  public max_strength: number = 0;
  public total_seats?: number;
  public remark: number = 0;
  public FinancialYearID: number = 0;
  public EndTermID: number = 0;
}


export class BTERSeatMetrixModel {
  CollegeId: string = '';
  CollegeSteamId: string = '';
  SteamTypeId: string = '';
  SteamId: string = '';
  UserId: number = 0;
  CollegeName: string = '';
  SteamName: string = '';
  SteamTypeName: string = '';
  FinancialYearID: number = 0;
  EndTermID: number = 0;
  TotalSeats: string = '';
  TotalM: string = '';
  TotalF: string = '';

  TotalSeatCumulative: string = '';
  TotalSeatMCumulative: string = '';
  TotalSeatFCumulative: string = '';
  OBC_M: string = '';
  OBC_MCumulative: string = '';
  OBC_F: string = '';
  OBC_FCumulative: string = '';
  MBC_M: string = '';
  MBC_MCumulative: string = '';
  MBC_F: string = '';
  MBC_FCumulative: string = '';
  EWS_M: string = '';
  EWS_MCumulative: string = '';
  EWS_F: string = '';
  EWS_FCumulative: string = '';
  SC_M: string = '';
  SC_MCumulative: string = '';
  SC_F: string = '';
  SC_FCumulative: string = '';
  ST_M: string = '';
  ST_MCumulative: string = '';
  ST_F: string = '';
  ST_FCumulative: string = '';

  TSP_M: string = '';
  TSP_MCumulative: string = '';
  TSP_F: string = '';
  TSP_FCumulative: string = '';


  KM: string = '';
  KM_Cumulative: string = '';

  PH: string = '';
  PH_Cumulative: string = '';
  EX: string = '';
  EX_Cumulative: string = '';
  WID: string = '';
  WID_Cumulative: string = '';

  SMD: string = '';
  SMD_Cumulative: string = '';


  GEN_M: string = '';
  GEN_F: string = '';

  Total_M_H: string = '';
  Total_F_H: string = '';
  OBC_H: string = '';
  MBC_H: string = '';
  EWS_H: string = '';
  SC_H: string = '';
  ST_H: string = '';
  TSP_H: string = '';
  KM_H: string = '';
  PH_H: string = '';
  EX_H: string = '';
  WID_H: string = '';

  TFSW_H: string = '';

  SMD_H: string = '';


  Remark: string = '';

  TFWS: string = '';


  MGM: string = '';

  ActiveStatus: boolean = true;
  DeleteStatus: boolean = false;

}





export class BTERCollegeBranchModel {
  ManagementTypeId: number = 0;
  CollegeID: number = 0;
  CollegeCode: string = '';
  StreamCode: string = '';
  CollegeStreamId: number = 0;
  StreamID: number = 0;
  TradeLevelId: number = 0;
  TradeCode: number = 0;
  StreamTypeId: number = 0;
  FeeStatus: number = 0;
  ActiveStatus: number = 1;
  PageSize: number = 0;
  PageNumber: number = 0;
  FinancialYearID: number = 0;
  EndTermId: number = 0;
  Action: string = '';
  ShiftID: number = 0;
  TotalSeats: number = 0;
  TotalAdmissionSeats: number = 0;
  CreatedBy: number = 0;
  DepartmentID: number = 0;
  IPAddress: string = '';
  Status: number = 2
  StreamFor: number = 0
}

export class BranchStreamTypeWiseSearchModel {
  public StreamTypeId: number = 0
  public Action: string = ''
  public EndTermId: number = 0;
}
