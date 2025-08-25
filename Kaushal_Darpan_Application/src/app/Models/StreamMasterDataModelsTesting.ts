import { RequestBaseModel } from "./RequestBaseModel";

export class StreamMasterDataModelsTesting extends RequestBaseModel {

  public StreamID: number = 0;

  public Code: string = '';
  public Name: string = '';
  public Duration: string = '';
  public Qualifications: string = '';

  public StreamTypeID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public UserID: number = 0;

  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
}
