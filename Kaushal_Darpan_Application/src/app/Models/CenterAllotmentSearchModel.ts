import { RequestBaseModel } from "./RequestBaseModel"

export class CenterAllotmentSearchModel {
  public DistrictID: number = 0
  public InstitutionManagementTypeID: number = 0
  public TehsilID: number = 0
  public DepartmentID: number = 0
  public EndTermID: number = 0
  public CenterID: number = 0
  public Eng_NonEng: number = 0
}

export class CenterAllotmentDataModel extends RequestBaseModel {
  public CenterID: number = 0;
  public  InstituteID:number=0
  public InstituteCode: string = '';
  public Institutename: string = '';
  public SSOID: string = '';
  public MobileNumber: string = '';
  //public ActiveStatus: boolean = true;
  //public DeleteStatus: boolean = false;
  public DistrictID: number = 0;
  public DivisionID: number = 0;
  public Address: string = ''
  public PinCode: string = ''
  public TehsilID: number = 0
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public Marked?: boolean = false;
  public CCCode: number = 0;
  public Capacity:number=0
}

export class UpdateCCCodeDataModel {
  public CenterID: number = 0;
  public EndTerm: number = 0;
  public InstituteID: number = 0;
  public ModifyBy: number = 0

  public CCCode: number = 0;
  public Email: string = '';
  public Institutename: string = '';
  public MobileNumber: string = '';
  public SSOID: string = '';
}


