import { RequestBaseModel } from "../RequestBaseModel";

export class OptionalFormatReportSearchModel extends RequestBaseModel {
    public InstituteID: number = 0;
    
}

export class OptionalFormatReportDataModel {
    public InstituteCode: string = '';
    public CenterCode: string = '';
    public RollNumber: string = '';
    public PaperCode: string = '';
    public TradeCode: string = '';
}