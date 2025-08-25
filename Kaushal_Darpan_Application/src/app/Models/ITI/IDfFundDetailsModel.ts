export class DepositList {
  public HeadName: string = ''
  public ReceivedAmount: string = ''
}
export class IDfFundDetailsModel {

  public FinYearQuaterID: number = 0;
  public FinancialYearID: number = 0;
  public PrincipalName: string = '';
  public OpeningBalance: number = 0;
  public ReceivedAmount: number = 0;
  public Expense: number = 0;
  public ClosingBalance: number = 0;
  public Remark: string = '';
  // public OtherDepositList: DepositList[] = [];
  public OtherDepositList: DepositList[] = [new DepositList()];
}

export class IDfFundSearchDetailsModel {

  public FinYearID: number = 0;
  public FundID: number = 0;
  public FinYearQuaterID: number = 0;
  public Action: string = '';

}


