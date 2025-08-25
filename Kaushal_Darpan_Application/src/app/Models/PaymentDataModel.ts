import { extend } from "highcharts/highcharts.src";
import { RequestBaseModel } from "./RequestBaseModel";

export class RequestParameter {
  public MERCHANTCODE: string = '';
  public PRN: string = '';
  public REQTIMESTAMP: string = '';
  public PURPOSE: string = '';
  public AMOUNT: string = '';
  public SUCCESSURL: string = '';
  public FAILUREURL: string = '';
  public CANCELURL: string = '';
  public USERNAME: string = '';
  public USERMOBILE: string = '';
  public USEREMAIL: string = '';
  public UDF1: string = '';
  public UDF2: string = '';
  public UDF3: string = '';
  public OFFICECODE: string = '';
  public REVENUEHEAD: string = '';
  public CHECKSUM: string = '';
  public CreatedDate: string = '';
}

export class ResponseParameters {
  public MERCHANTCODE: string = '';
  public REQTIMESTAMP: string = '';
  public PRN: string = '';
  public AMOUNT: number = 0;
  public RPPTXNID: string = '';
  public RPPTIMESTAMP: string = '';
  public PAYMENTAMOUNT: string = '';
  public STATUS: string = '';
  public PAYMENTMODE: string = '';
  public PAYMENTMODEBID: string = '';
  public PAYMENTMODETIMESTAMP: string = '';
  public RESPONSECODE: string = '';
  public RESPONSEMESSAGE: string = '';
  public UDF1: string = '';
  public UDF2: string = '';
  public UDF3: string = '';
  public CHECKSUM: string = '';
  public CreatedDate: string = '';
}



export class RequestDetails {
  public AMOUNT: number = 0
  public PURPOSE: string = '';
  public USERNAME: string = '';
  public USERMOBILE: string = '';
  public USEREMAIL: string = '';
  public ApplyNocApplicationID: number = 0;
  public PaymentRequestURL: string = '';
  public DepartmentID: number = 0;
  public CreatedBy: number = 0;
  public SSOID: string = '';


  public RemitterName: string = '';
  public REGTINNO: string = '';
  public DistrictCode: string = '';
  public Adrees: string = '';
  public City: string = '';
  public Pincode: string = '';
}

//Emitra Request

export class EmitraRequestDetails {

  public AppRequestID: string = '';
  public ID: number = 0;
  public ServiceID: string = '';
  public ApplicationIdEnc: string = '';
  public Amount: number = 0; 
  public UserName: string = ''
  public MobileNo: string = ''
  public RegistrationNo: string = ''
  public SsoID: string = ''
  public RESPONSEJSON: string = ''
  public STATUS: string = ''
  public ENCDATA: string = ''
  public PaymentRequestURL: string = ''
  public MERCHANTCODE: string = ''
  public FeeFor: string = ''
  public IsKiosk: boolean = false;
  public StudentID: number = 0;
  public SemesterID: number = 0;
  public ExamStudentStatus: number = 0;
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public TypeID: number = 0;
  public ProcessingFee: number = 0;
  public FormCommision: number = 0;
  public USEREMAIL: string = '';
  public KIOSKCODE: string = '';
  public SSoToken: string = '';
  public DirectAdmission: number = 0;

  public StudentFeesTransactionItems: StudentFeesTransactionItems[] = [];
  public InstituteID: number = 0;
  public InstituteIDEnc: string = '';
}

export class TransactionStatusDataModel
{
  public ApplicationID: string = '';
  public TransactionID :number =0
  public AMOUNT: string = '';
  public PRN: string = '';
  public DepartmentID: number = 0;
  public RPPTXNID: string = '';
  public SubOrderID: string = ''
  public CreatedBy: number = 0;
  public SSOID: string = '';
  public ExamStudentStatus: number = 0;
  public ServiceID: number = 0;


}
export class TransactionSearchFilterModel
{
  public DepartmentID: number = 0;
  public CollegeID: number = 0;
  public TransactionID: number = 0;
  public PRN: string = '';
  public RPPTranID: string = '';
  public Key: string = '';
  public RefundID: string = '';
  public ApplyNocApplicationID: string = '';

}


export class StudentFeesTransactionItems {
  public transactionItemID: number=0;
  public transactionId: number=0;
  public transactionApplicationID: number=0;
  public status: number = 0;
  public tranSemesterID: number = 0;
  public itemAmount: number = 0;
}

export class EmitraServiceAndFeeRequestModel extends RequestBaseModel {
  public TypeID: number = 0;
  public FeeFor: string = '';
}

export class EmitraServiceAndFeeModel {
  public UniqueServiceID: number = 0;
  public ServiceId: string = '';
  public ApplicationFees: number = 0;
}
