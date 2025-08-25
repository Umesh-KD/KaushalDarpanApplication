import { RequestBaseModel } from "./RequestBaseModel";

export class CommonSerialMasterResponseModel extends RequestBaseModel{
  public SerialID: number = 0;
  public SemesterId: number = 0;
  public Type: string = '';
  public StaticVal: string = '';
  public StartFrom: string = '';
  public ActiveStatus: boolean = true;
  public ModifyBy: number = 0;
  public ModifyDate: Date | null = null;
  public IPAddress: string = '';
  public PartitionSize: number = 0;
}
