export class CenterAllocationtDataModels {
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
  public CourseTypeID:number=0


}
export class InstituteList {
/*  public InstituteName:string=''*/
  public InstituteID:number=0
}

export class CenterAllocationSearchModel {
  public DepartmentID: number = 0
  public CenterID: number = 0
  public EndTermID: number = 0
  public Eng_NonEng:number=0
  public DistrictID:number=0
  public TehsilID: number = 0
  public CenterCode: string = ''
  public CenterName: string = ''

}


export class CenterExamAllocationSearchModel {
  DepartmentID: number = 0;
  EndTermID: number = 0;
  CenterCode: string = '';
  CenterName: string = '';
  Eng_NonEng: number = 0;
  InstituteID: number = 0;
  UserID: number = 0
  DistrictID: number = 0


}


export class ITIAssignPracticaLExaminer {
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
    
  public Name: string = ''
  public SSOID: string = ''
  public Email: string = ''
  public MobileNumber: string = ''





}
