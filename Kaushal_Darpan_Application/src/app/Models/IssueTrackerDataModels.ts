import { RequestBaseModel } from "./RequestBaseModel";

export class IssueTrackerDataModels extends RequestBaseModel {
  UploadedFiles(UploadedFiles: any) {
      throw new Error('Method not implemented.');
  }
  public IssueID: number = 0;
  public IssueName: string = '';
  public ProjectName: string = '';
  public Discription: string = '';
  public Comment: string = '';
  public Dis_DocName: string = '';
  public Document: string = '';

  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;

  public StatusTypeID: number = 0;
  public PriorityID: number = 0;
  public IssueTypeDescriptionID: number = 0;
  public IssueTypeID: number = 0;
  public RegFileName?: string = '';
  public RegDisFileName?: string = '';
  public IssueFile: IssueFile[] = [];
 

}

export class IssueFile  {
  public RegFileName?: string = '';
  public RegDisFileName?: string = '';
}

export class IssueTrackerDataSearchModels extends RequestBaseModel {
  public Issue: string = '';
  public PriortyID: number = 0;
  public Status: number = 0;
  public PriorityID: number = 0;
  issueDate: string = '';
  resolvedDate: string = '';
  public IssueTypeID: number = 0;
  public IssueTypeDescriptionID: number = 0;
    public IssueDate: string = '';


    //Discription: string;

 
  

}
export class IssuedTrackerSearchModel {
  public EquipmentsId: number = 0;
  public TradeId: number = 0;
  public StreamID: number = 0;
  public Issuenumber: number | null = null;
  public EquipmentCode: string = '';
  public Issuedate: Date | null = null;
}
