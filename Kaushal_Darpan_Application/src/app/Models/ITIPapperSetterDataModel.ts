import { extend } from "highcharts"

export class ITIPapperSetterDataModel  {

  public PKID: number = 0;
  public yearTrade: number = 0;
  public TwoYearTradeID: number = 0;
  public TradeSchemeId: number = 0;
  public ExamType: number = 0;
  public TradeID: number = 0;
  public SubjectId: number = 0;
  public PapperSubmitionLastDate: string = '';
  public PaperCodeName: string = '';
  public NumberofQuestion: string = '';
  public Remark: string = '';
  public DistrictID: number = 0;
  public ProfessorId: number = 0;
  public GuideLinesDocumentFile: string = '';
  public Createdby: number = 0;
  public Roleid: number = 0;
  public Endtermid: number = 0;
  public FYID: number = 0;
  public PapperSetterListModel: AddProfessorList[] = [];
  public ActionName: string =''
}

export class AddProfessorList {
  public DistrictId: number = 0;
  public DistrictName: string = '';
  public ProfessorId: number = 0;
  public ProfessorName: string = '';
}

 

 




//export interface AssignprofessorList {
//  districtName: string;
//  professorName: string;
//}

//export interface PaperSetterAssginListModel {
//  id: number;
//  yearTrade: string;
//  Tradename: string;
//  SubjectName: string;
//  papperSubmitionLastDate: string;
//  PapperCode_Name: string;
//  Remark: string;
//  AssignprofessorListModel: AssignprofessorList[];
//}
