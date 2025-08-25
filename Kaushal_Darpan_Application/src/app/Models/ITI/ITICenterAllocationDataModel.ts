import { RequestBaseModel } from "../RequestBaseModel";

export class ITICenterAllocationtDataModels {
  /*  public CenterCollegeID:number=0*/
  public CenterID: number = 0;
  public InstituteID: number = 0
  /*  public InstituteList: InstituteList[] = [];*/
  public ModifyBy: number = 0;
  public DepartmentID: number = 0;
  public EndTermID: number = 0;
  public Marked?: number = 0;
  public InstituteNames?: string = ''
  public InstituteIDs?: string = ''

  public SelectedInstituteList: any[] = [];

  public CourseTypeID: number = 0
  public Status:number=0
}

export class ITIcenterAllocationSearchModel extends RequestBaseModel {
  public Name: string = ''
  public centerCode: String = ''
  public CenterID:number=0
}
