export class GlobalConstants {

  //api uploaded folder path in static folder
  public static LogFolder: string = "Log";
  public static PlacementCompanyFolder: string = "PlacementCompany";
  public static StudentsFolder: string = "Students";
  public static StaffMemberFolder: string = "Staff";
  public static ReportsFolder: string = "Reports";
  public static PublicInfoDocument: string = "PublicInfoDocument";
  public static ITIReportsFolder: string = "Reports/ITI";
  public static CenterSuperintendent: string = "CenterSuperintendent";
  public static AllotmentReceipt: string = "Reports/AllotmentReciept";
  public static ITIPaperDownload: string = "ITIUpload";  // new added 19062025
  public static ITIAdmitCardFolder: string = "/AdmitCard"; 

  // regex
  public static AadhaarPattern: RegExp = /^[2-9]{1}[0-9]{11}$/;  // Aadhaar must start with 2-9 and be 12 digits long
  public static IFSCPattern: RegExp = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  public static AccountNoPattern: RegExp = /^[0-9]{9,18}$/;
  public static PositionPattern: RegExp = /^[1-9]$/;
  public static MobileNumberPattern: RegExp = /^[6-9]\d{9}$/;
  public static EmailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  public static SSOIDPattern: RegExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9]$/
  public static NameNoNumbersPattern: RegExp = /^[^\d]*$/;
  public static AllowNumbersPattern: RegExp = /^[0-9]+(\.[0-9]+)?$/;
  public static PincodePattern: RegExp = /^[0-9]{6}$/;
  // other
  public static DefaultOTP: string = "356163";
  public static DefaultTimerOTP: number = 1;
  public static DefaultMobileNo: string = "";
  //message
  public static MSG_ERROR_OCCURRED: string = "Error occurred!";

  public static ServerNotBlockedURL: string[] = [
    "/assets/appsettings.json",//not server side
    "http://localhost:5230/api/SSO/GetUserRoleList/vijaykanugo.risl/1/true/2",
    "http://localhost:5230/api/SSO/GetAcedmicYearList/2/1",
    "http://localhost:5230/api/MenuMaster/MenuUserandRoleWise/",
  ];

  //un auth code
  public static UN_AUTH_ACCESS: string = "UNAUTHACCESS";
  public static UN_AUTH_ROLE: string = "UNAUTHROLE";

  //session
  public static SessionTime: number = 10;
}

// enums
export enum EnumStatus {
  Success = 1,
  Error = 2,
  Warning = 3
}
export enum EnumRole {
  Guest = 0,
  Developer = 1,
  Admin = 2,//bter admin
  AdminNon = 12,//bter admin
  AdminNodel = 5,
  TPO = 6,
  Principal = 7,
  PrincipalNon = 13,
  PrincipalNonDegree = 207,
  Student = 3,
  Invigilator = 11,//Center Superintendent
  Invigilator_NonEng = 57,//Center Superintendent
  Emitra = 4,
  Teacher = 8,
  TeacherNon = 14,
  DTE = 17,
  DTENON = 18,
  DTELateral = 33,
  NodalVerifier = 180,
  DTENodalVerifier = 185,
  BTERVerifier = 19,
  BTERVerifierDiplomaNonENG = 86,
  BTERVerifierDiplomaLaterl = 87,
  BTERVerifierDegreeNonEngg = 88,
  BTERVerifierDegreeLateral = 89,
  ACP = 193,
  ACP_NonEng = 202,
  HostelWarden = 34,
  HostelWardenITINCVT = 46,
  HostelWardenITISCVT = 47,
  Secretary_JD = 48,
  Secretary_JD_NonEng = 53,
  collegeNodel = 21,
  DTETraing = 16,
  ITIPrincipal = 20,
  TITDTETraining = 22,
  ITI_Verifier = 23,
  ITIInvisilator = 24,
  ITIPeon = 25,
  IITCollegeNodal = 97,
  TITStudent = 28,
  TITSupport = 29,
  ITITeacherNonEngNonEng = 30,
  TITTPO = 32,
  ExaminationIncharge = 38,
  ExaminationIncharge_NonEng = 56,
  Registrar = 40,
  Registrar_NonEng = 55,
  GuestRoomWarden = 41,
  ITIAdmin_NCVT = 42,
  ITIAdmin_SCVT = 22,
  Principal_NCVT = 43,
  Principal_SCVT = 20,
  ITIExaminer_SCVT = 44,
  Examiner = 15,
  AccountsSec_Eng = 51,
  JDConfidential_Eng = 50,
  Examiner_NonEng = 59,
  AccountsSec_NonEng = 58,
  JDConfidential_NonEng = 54,
  HOD_Eng = 60, 
  HOD_NonEng = 61,
  Principle_NonEng_Degree1Year = 207,
  Principle_NonEng_Degree2YearLateral = 208,

  //Iti new role
  ITIPrivateTeacher = 62,
  ITILabIncharge = 63,
  StoreKeeper = 201,
  ITIClerk = 66,
  ITIAccountant = 67,
  ITIAAO = 68,
  ITILibrarian = 69,
  ITIGuestRoomWarden = 70,

  ITIGovtTeacher = 71,
  ITIGovtLabIncharge = 72,
  ITIGovtClerk = 73,
  ITIGovtAccountant = 74,
  ITIGovtAAO = 75,
  ITIGovtLibrarian = 76,
  ITIGovtGuestRoomWarden = 77,
  Secretary_JD_NCVT = 82,
  Secretary_JD_SCVT = 83,
  Registrar_SCVT = 84,
  Registrar_NCVT = 85,
  Center_SuperintendentSCVT = 90,

  ITIProfessor_SCVT = 94,  
  ITIADMINISTRATIVEOFFICER = 101,
  ITIStaff = 190,
  ITIZonalOfficer = 100,
  BterClerk = 195,
  BterAccountant = 196,
  BterAAO = 197,
  BterLibrarian = 198,
  BterLabIncharge = 199,
  BterLabAttendant = 200,
  BterEnrITSupport = 206,
  ITSupport = 206,
  StudentSectionincharge =205,
  StudentSectioninchargeNonEng =209,
  ITSupportNonEng =210,
  
  StoreKeeper_NCVT = 213,
  StoreKeeper_SCVT = 214,
  

  DTE_TrainingT2_establishment = 215,
  DTETrainingT1Training = 216,
  DTETrainingPlacementAdmin	=217,
  DTETrainingT3Purchase = 218,
  DTETrainingT4Scheme = 219,
  DTETrainingE4Planning = 220,
  BterStaff = 223,
    Apprenticeship = 212,

  ITCell_Eng = 206,
  ITCell_NonEng = 210, 
  

}

export enum enumExamStudentStatus {
  Enrolled = 8,
  New_Enrolled = 9,
  SelectedForExamination = 10,
  SubmittedExamStudentStatus = 11,
  EnrolledFeePaid = 12,
  EligibleForExamination = 13,
  NewEligibleForExamination = 14,
  RejectatBTER = 15,
  ExaminationFeesPaid = 32,
  BackFeePaid = 33,
  VerifiedForExamination = 34,
  SelectedForEnrollment = 35,
  Addimited = 36,
  VerifiedForEnrollment = 37,
  EligibleForEnrollment = 53,
  New_Addimited = 139,
  ApprovalReject = 161,
  Revaluation = 162,
  Dropout = 4,
  RevokeDropout = 209,
  Detained = 230,
  DetainedRevoke = 233,
  ReturnByAcp = 316,
  ApproveByAcp = 317,
}

export enum EnumUserType {
  CITIZEN = "CITIZEN",
  GOVT = "GOVT",
  KIOSK = "KIOSK",
  STUDENT = "STUDENT"
}

export enum EnumProfileStatus {
  Pending = 0,
  Completed = 1,
  FinalSubmit = 2,
  Approve = 3,
  Revert = 4,
  Reject = 5
}
export enum EquipmentStatus {
  Pending = 0,
  Approve = 1,
  Reject = 2
}
export enum StoreKeeperStatus {
  Working = 1,
  NotWorking = 2
}
// master setting configuration ddl
export enum EnumConfigurationType {
  Admission = 1,
  Enrollment = 2,
  Examination = 3,
  Enrolled_Fee = 4,
  Examination_Fee = 5,
  Reval = 6,
  RollNo = 7,
  CCCode = 8,
  GroupCode = 9,
  Provisonal = 10,
  Certificate = 11,
  Marksheet = 12,
  Migration = 13,
  ApplicationNo = 27,
  SeatAllotment = 50,
  ChallanNo = 28,
  BackFee = 68,
  DuplicateDocument = 105,
  ExaminationFeeYearly = 107,
  BackFeeYearly = 108,
  AllotmentFee = 111,
  ApplicationProcessingFee = 147,
  StudentAgeCalculationDate = 148,
  RemunerationExaminerFee = 149,
  ApplicationNo_DirectAdmission = 153,
  ChallanNo_DirectAdmission = 154,
  Bter_CollegeFee = 155,
  Registrar=40,
  Registrar_NonEng=55,
  Reval_GroupCode = 160
}

export enum EnumDepartment {
  BTER = 1,
  ITI = 2,
  DCE = 3
}

export enum EnumApplicationFromStatus {
  Pending = 0,
  Submitted = 1,
  FinalSave = 2,
  PaymentSuccess = 3,
  IsPaymentSuccess = 1
}

export enum EnumVerificationAction {
  Applied = 1,
  Approved = 2,
  Revert = 3,

  Reject = 4,
  Deficiency_uploaded = 5,
  Notified = 6,
  Changed = 7,
  ReCheck = 8,
  Verified = 9,
  RejectMerit = 10,
  Accept_with_deficiency=44
}

export enum EnumExamTypeIDChangeAction {
  MainExam = 0,
  RevalExam = 1,
  UFMExam = 2,
  RWHExam = 3,
  Special = 4,
}


export enum EnumCourseType {
  Engineering = 1,
  Non_Engineering = 2,
  Lateral = 3
}

export enum EnumCourseType1 {
  Diploma1stYearEng = 1,
  DiplomaNonEngineering1stYear = 2,
  Diploma2ndYearEngLateralAdmission = 3,
  DegreeCourse1stYearNonEngg = 4,
  DegreeCourse2ndYearLateralNonEngg = 5,
}

export enum EnumCasteCategory {
  GENERAL = 1,
  SC = 2,
  ST = 3,
  OBC = 4,
  MBC = 5,
  EWS = 9
}

export enum EnumLateralCourse {
    Diploma_Engineering = 140,
    Senior_Secondary_Vocational = 141,
    Senior_Secondary = 143,
    ITI_Tenth = 142
}

export enum EnumDegreeCourse {
  Diploma_Engineering = 278,
  Senior_Secondary_Vocational = 279,
  Senior_Secondary = 281,
  ITI_Tenth = 280
}



export enum EnumMessageType {
  OTP = "OTP",
  FormSubmit = "FormSubmit",
  ApplicationMessageBTER = "ApplicationMessageBTER",
  FormFinalSubmitITI = "FormFinalSubmit",
  ApplicationMessageITI = "ApplicationMessageITI",
  Bter_OTP = "Bter_OTP",
  Bter_FormFinalSubmit = "Bter_FormFinalSubmit",
  Bter_FormSubmit = "Bter_FormSubmit",
  Bter_NotifyCandidateDeficiency = "Bter_NotifyCandidateDeficiency",
  Bter_NotifyCandidateApproveMerit = "Bter_NotifyCandidateApproveMerit",
  Bter_NotifyCandidateRejectMerit = "Bter_NotifyCandidateRejectMerit",
}
export enum EnumStatusOfStaff {
  Draft = 163,
  Submitted = 164,
  Approved = 165
}

export enum EnumDirectAdmissionType
{
  Donation_Quota = 159,
  Management_Quota = 160,
  JailAdmission = 181,
  DirectAdmission = 182,
}

export enum EnumConfigTypeTabs {
  Session_Tab = 1,
  Date_Tab = 2,
  Fee_Tab = 3,
  Serial_Tab = 4,
}



export enum EnumFeeFor {
  Application = "Application",
  Allotment = "Allotment",
  EnrollMentFee = 'EnrollmentFee',
  ExamFee = 'ExamFee',
  DuplicateDocument = 'DuplicateDocument',
  CollegeFee = 'CollegeFee'
}
export enum EnumStudentType {
  Reg = 1,
  Ex = 2
}
export enum EnumStudentExamType {
  Special = 77,
  Main = 78
}
export enum EnumRollNoStatus {
  Generated = 210,
  Forwarded = 211,
  Verified = 212,
  Published = 213,
  Reverted = 214
}

export enum EnumEnrollNoStatus {
  Generated = 11,
  Forwarded = 12,
  Verified = 13,
  Published = 14,
  Reverted = 15,
  VerifiedByRegistrar = 60,
  VerifiedByACP =61,
  Return =12,
}

export enum EnumEnrollCancelStatus {
  Verified = 296,
  Return = 297,
  VerifiedEnrollCancelByAdmin = 2,
  VerifiedEnrollCancelByPrincipal = 7,
  VerifiedEnrollCancelByRegistrar = 40,
  VerifiedEnrollCancelByExamIncharge = 38,
  VerifiedEnrollCancelByITSupport = 206,
  VerifiedEnrollCancelBySectionIncharge = 205,
  VerifiedEnrollCancelByStudent = 3,
 
}


export enum EnumDeploymentStatus {
  Pending = 0,
  Assigned = 1,
  ForwardToVerify = 2,
  Verified = 3,
  OrderGenerated = 4,
  Completed = 5
}


export enum EnumDispatchDDlValue {
  SendToBterFromCenter = 16,
  ReceivedAtBterFromCenter = 18,
  SendtoBterFromCollagePrincipal = 29,
  ReceivedAtBterFromCollege = 30,
  Pending = 1,
  HandOverToExaminerByPrincipal = 32,
  AssigntoCollageFromBter = 19,
  HandOverToPrincipalByExaminer = 33,
  VerifyByExaminer=20
}

export const JailCollegeID = [44, 116, 157, 158, 234, 235, 236, 237, 239];

export enum EnumRenumerationExaminer
{
  Pending = 0,
  SubmittedAndForwardedtoJD = 36,
  ApprovedAndSendtoAccounts = 42,
  ApprovedfromAccounts = 43
}
//export enum EnumEmitraService
//{
//  ITIEmitraFormService=3161,
//  ITiApplicationFee = 3162,

//  ITIExamFees = 1111,


//  BTER_DeplomaENG_AllotmentFeeService = 2526,
//  BTER_DeplomaENG_AppplicationFeeService = 3160,
//  BTER_DeplomaENG_Emitra_AppplicationFeeService = 3159,

//  BTER_DeplomaNonENG_AllotmentFeeService = 6850,
//  BTER_DeplomaNonENG_AppplicationFeeService = 3169,
//  BTER_DeplomaNonENG_Emitra_AppplicationFeeService = 3168,

//  BTER_DeplomaLateral_2ENG_AllotmentFeeService = 8111,
//  BTER_DeplomaLateral_2ENG_AppplicationFeeService = 3120,
//  BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService = 2494,

//  BTER_DegreeNonENG_AllotmentFeeService = 0,

//  BTER_DegreeNonENG_AppplicationFeeService = 14871,
//  BTER_DegreeNonENG_Emitra_AppplicationFeeService = 14851,

//  BTER_DegreeLateral_2Year_AllotmentFeeService = 0,

//  BTER_DegreeLateral_2Year_AppplicationFeeService = 14854,
//  BTER_DegreeLateral_2Year_Emitra_AppplicationFeeService = 14852,


//  BTER_CollegeFeeService = 14855,
//  BTER_CollegeFee_Emitra_Service = 14855

//}

export enum EnumEmitraService {
  ITIEmitraFormService = 3161,
  ITiApplicationFee = 3162,

  ITIExamFees = 1111,



  BTER_DeplomaENG_AllotmentFeeService = 2526,
  BTER_DeplomaENG_AppplicationFeeService = 3160,
  BTER_DeplomaENG_Emitra_AppplicationFeeService = 3159,

  BTER_DeplomaNonENG_AllotmentFeeService = 6850,
  BTER_DeplomaNonENG_AppplicationFeeService = 3169,
  BTER_DeplomaNonENG_Emitra_AppplicationFeeService = 3168,

  BTER_DeplomaLateral_2ENG_AllotmentFeeService = 8111,
  BTER_DeplomaLateral_2ENG_AppplicationFeeService = 3120,
  BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService = 2494,

  BTER_DegreeNonENG_AllotmentFeeService = 14871,/*need to change after recived id from department*/

  BTER_DegreeNonENG_AppplicationFeeService = 14871,
  BTER_DegreeNonENG_Emitra_AppplicationFeeService = 14851,

  BTER_DegreeLateral_2Year_AllotmentFeeService = 0,

  BTER_DegreeLateral_2Year_AppplicationFeeService = 14854,
  BTER_DegreeLateral_2Year_Emitra_AppplicationFeeService = 14852,


  BTER_CollegeFeeService = 14855,
  BTER_CollegeFee_Emitra_Service = 14855

}

export enum EnumCampusType {
  InstituteLevelCampus = "Institute Level Campus",
  DivisionLevelPoolCampus = 'Division Level Pool Campus',
  StateLevelPoolCampus = 'State Level Pool Campus'
 
}


export enum PublicAddType
{
  Downloads = 1,
  Highlights = 2,
  Notes = 3
}
export enum EnumSemesterDDL
{
  AllSemester = 0,
  YearlySemester = 2,
  BTERSemester = 51,
  ITISemester = 52

}

export enum EnumInspectionDeploymentType {
  Planned = 1,
  Unplanned = 2
}

export enum EnumApprenticeshipDeploymentType {
  Planned = 1,
  Unplanned = 2
}


export enum ITIPEM_EnumStaffType {
  Teaching = 30,
  NonTeaching = 31,
}
export enum ITIPEM_EnumStaffLevel {
  Administrative = 1,
  Placement = 2,
  Library = 3,
  TeachingRole = 4,
  HostelWarden = 5,
  GuestRoomWarden = 16
}
export enum ITIPEM_EnumStaffLevelChild {
  Clerk = 6,
  Accountant = 7,
  AAO = 8,
  TPO = 9,
  Librarian = 10,
  Lecturer = 11,
  LabIncharge = 12,
  LabAttendant = 13,
  HostelWarden = 14,
  GuestRoomWarden = 17,
}



export enum ITIGovtEM_EnumStaffType {
  Teaching = 30,
  NonTeaching = 31,
}
export enum ITIGovtEM_EnumStaffLevel {
  Administrative = 1,
  Placement = 2,
  Library = 3,
  TeachingRole = 4,
  HostelWarden = 5,
  GuestRoomWarden = 16,
  Staff = 18,
  StoreKeeper=21
}
export enum ITIGovtEM_EnumStaffLevelChild {
  Clerk = 6,
  Accountant = 7,
  AAO = 8,
  TPO = 9,
  Librarian = 10,
  Lecturer = 11,
  LabIncharge = 12,
  LabAttendant = 13,
  HostelWarden = 14,
  GuestRoomWarden = 17,
  StoreKeeperNCVT = 213,
  StoreKeeperSCVT = 214,
  BterGuestRoomWarden = 41,
}

export enum EnumEligibilityStatus {
  Eligible = 238,
  NOT_Eligible = 239,
}

export enum EnumWS_DepartmentSub {
  BTER = 241,
  DTE = 242,
  ITI_NCVT = 243,
  ITI_SCVT = 244,
}

export enum EnumITIDispatchDDlValue {
  SendToBterFromCenter = 51,
  ReceivedAtBterFromCenter = 52,
  SendtoBterFromCollagePrincipal = 29,
  ReceivedAtBterFromCollege = 56,
  Pending = 1,
  HandOverToExaminerByPrincipal = 57,
  AssigntoCollageFromBter = 53,
  HandOverToPrincipalByExaminer = 58,
  VerifyByExaminer = 54,
  ReceivedBundelByExaminerFromCenter = 59
}
export enum EnumEMProfileStatus {
  Pending = 0,
  Completed = 288,
  LockAndSubmit = 289,
  Approve = 247,
  Revert = 249,
  Reject = 248
}

export enum EnumPaperSetterStatus {
  Created = 1,
  Forwarded = 2,
  Verified = 3,
  OrderGenerated = 4,
}


export enum EnumRemunerationStatus {
  Pending = 0,
  Created = 1,
  Forwarded = 2,
  Verified = 3,
  OrderGenerated = 4,
}


export enum EnumRevalDispatchDDlValue {
  
    AdminToPrincipal = 66,
    PrincipalVerifiedByToAdmin = 67,
    PrincipalToExaminer = 76,
    ExaminerVerifiedByToPrincipal = 77,
    ExaminerCheckCopy = 80,
    ExaminerSendBundle = 82,
    PrincipalVerifiedByToExaminer = 83,
    PrincipalDespoistToAdmin = 87,
    AdminToPrincipalDespoistReply = 88
}


export enum EnumBugetStatus
{

  Pending = 84,
  Approved = 85,
  Rejected = 86
  
}

export enum EnumHostelStatus
{
  HostelApply = 1,
  HostelGenerateProvisionalMerit= 2,
  HostelAllotted=4
}








