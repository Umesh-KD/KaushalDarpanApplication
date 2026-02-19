

  export class NewJanAadharAPIModel {
    public NAME_EN: string = '';
    public GENDER: string = '';
    public DOB: string = '';
    public ADDRESS: string = '';
    public MEMBER_ID: string = '';
    public tid: string = '';
    public OTP: string = '';



  }

    export class NewJanAadharDetailsEntity {
    public Status: string = '';
    public Message: string = '';
    public NewjanAadharUserDetails: NewJanAadharAPIModel = new NewJanAadharAPIModel();

  }


  export class JanAadharDetailModel{
    public JAN_AADHAR: string='';
  }





export class JanAadharVerifyMemberDetails {

  public REL_WITH_HOF: string | null= null;
  public EDUCATION: string = '';
  public PIN_CODE: number = 0;
  public BANK_BRANCH: string = '';
  public AADHAR_REF_ID: number = 0;
  public ADDRESS: string = '';
  public BLOCK_CITY: string = '';
  public CASTE_CODE: string = '';
  public CATEGORY_DESC_ENG: string = '';
  public DISTRICT: string = '';
  public ENR_ID: string = '';
  public GP_WARD: string = '';
  public IS_MINORITY: string = '';
  public JAN_AADHAR: number = 0;
  public MICR: string = '';
  public PPO_NO: string = '';
  public VILLAGE_NAME: string = '';
  public EKYC: string = '';
  public DISABILITY_TYPE: string = '';
  public DISTRICT_CD: string = '';
  public BLOCK_CITY_CD: string = '';
  public BLOCK_CITY_ID: number = 0;
  public GP_WARD_CD: string = '';
  public GP_WARD_ID: number = 0;
  public VILLAGE_CD: string = '';
  public DISABILITY_PERCENTAGE: number = 0;
  public ADDRESS_LL: string = '';
  public DISTRICT_NAME_LL: string = '';
  public BLOCK_CITY_LL: string = '';
  public GP_LL: string = '';
  public WARD_LL: string = '';
  public VILLAGE_LL: string = '';
  public CATEGORY_CODE: number = 0;
  public IS_DISABILITY: string = '';

  // OTP page extra fields
  public MEMBER_ID: string = '';
  public tid: string = '';
  public OTP: string = '';

}



