import { RequestBaseModel } from "../RequestBaseModel";

export class TabulationReportSearchModel extends RequestBaseModel {
  public SemesterID: string = '0';   // default value is empty string
  public StreamID: string = '0';     // default value is empty string
  public CourseType: number = 0;    // default value is empty string
  public ResultTypeId: number = 0;     // default value is empty string
  public EffectiveFromEndTermId: number = 0;     // default value is empty string
}

