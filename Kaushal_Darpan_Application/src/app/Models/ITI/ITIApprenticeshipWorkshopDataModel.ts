import { RequestBaseModel } from "../RequestBaseModel";

export class ITIApprenticeshipWorkshopModel {
  public ID: number = 0;
  public QuaterID: number = 0;
  public DistrictID: number = 0;
  public ParticipateSsoid: string = '';
  public ParticipateName: string = '';
  public WorkshopeDate?: string=''; // ISO format date string (e.g., '2025-07-28')
  public WorkshopDetail: string = '';
  public BeforeEstablishmentNo: string = '';
  public BeforeEstablishmentSeat: string = '';
  public BeforeStudentCount: string = '';
  public AfterEstablishmentNo: string = '';
  public AfterEstablishmentSeat: string = '';
  public AfterStudentCount: string = '';
  public RegisterStudentPdf?: string='';
  public DisRegisterStudentPdf?: string=''; 
  public DisWorkshopPdf?: string='';
  public WorkshopPdf?: string='';
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public FinancialYearID: number = 0;
  public EndTermID: number = 0;

  public QuaterIncreaseEstablishment: string = '';
  public QuaterIncreaseSeat: string = '';
  public QuaterIncreaseStudent: string = '';
  public Remarks: string = '';
  public BeforeMonth: number = 0;

  public ApprenticeshipWorkshopMembersList: ITIAAA_SSODetailsModel[] = [];
}

export class ITIApprenticeshipRegPassOutModel extends RequestBaseModel{
  public ID:number=0
  public InstituteID:number=0
  public UserID:number=0
  public RegDate: string = ''
  public RegCount: string = ''
  public Remarks: string = ''
  public FileName: string = ''
  public Dis_FilePath: string = ''
  public PKID : number = 0
}
export class ITIAAA_SSODetailsModel {
  
  public SSOID: string = '';
  public MobileNo: string = '';
  public EmailID: string = '';
 public Name: string = '';

}

