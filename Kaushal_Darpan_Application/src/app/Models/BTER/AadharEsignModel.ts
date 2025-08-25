import { RequestBaseModel } from "../RequestBaseModel";

export class GetSignedXMLModel extends RequestBaseModel {
  public base64PdfFile: string = '';
  public signatureOnPageNumber?: string = '';
  public xcord?: string = '0';
  public ycord?: string = '0';
  public responseUrl?: string = '';
  public designation: string = '';
  public location: string = '';
  public sigsize?: string = '';
  public UserNameInAadhar: string = '';
  public ModifyBy: number = 0;
}
export class GetSignedPDFModel {
  public Txn: string = '';
  public UserNameInAadhar?: string = '';
  public esignData: string = '';
  public ModifyBy: number = 0;
}
