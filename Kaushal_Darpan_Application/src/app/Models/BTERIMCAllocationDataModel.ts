export class BTERIMCAllocationDataModel {
  public InstituteID: number = 0;
  public AcademicYearID: number = 0;
  public ApplicationID?: number;
  public TradeID?: number;
  public SeatMetrixId?: number;
  public AllotedCategory: string = '';
  public SeatMetrixColumn: string = '';
  public OpenCategory: string = '';
  public MobileNo: string = "";
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public ShiftUnit: number = 0;
  public CollegeTradeID: number = 0;
  public TradeLevel: number = 0;
}


  
export class BTERIMCAllocationSearchModel {
  public InstituteID: number = 0;
  public CollegeTradeID: number = 0;
  public AllotedCategory: string = '';
  public AcademicYearID: number = 0;
  public TradeID: number = 0;
  public TradeLevel: number = 0;
  public ApplicationID?: number;
  public ApplicationNo?: number;
  public MobileNo: string = "";

}

