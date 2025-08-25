export class ITICollegeAdmissionDataModels {
  public OptionID: number = 0;
  public ApplicationID: number = 0;
  public InstituteID: number = 0;
  public TradeLevel: number = 0;
  public TradeId: number = 0;
  public DepartmentID: number = 0;

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public BranchID: number = 0;
  

}

export class ITICollegeAdmissionSearchModel{
  public ApplicationNo?: string = '';
  public DOB?: string = '';
  public MobileNumber?: string = '';
}


