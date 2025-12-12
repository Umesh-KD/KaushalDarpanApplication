

  export class NewJanAadharAPIModel {
    public NAME_EN: string = '';
    public GENDER: string = '';
    public DOB: string = '';
    public ADDRESS: string = '';
    public MEMBER_ID:string='';
  }

    export class NewJanAadharDetailsEntity {
    public Status: string = '';
    public Message: string = '';
    public NewjanAadharUserDetails: NewJanAadharAPIModel = new NewJanAadharAPIModel();

  }


  export class JanAadharDetailModel{
    public JAN_AADHAR: string='';
  }