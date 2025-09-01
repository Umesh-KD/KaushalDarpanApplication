import { RequestBaseModel } from "../RequestBaseModel";

export class CreateGuestRoomDataModel {
  public GuestHouseID: number = 0;
  public DepartmentID: number = 0;
  public GuestHouseName: string = '';
  public PhoneNumber: string = '';
  public Address: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  //public RTS?: string = '';
  //public ModifyDate?: string = '';
  //public IPAddress?: string = '';
  public DistrictID: number = 0;
  public TehsilID: number = 0;


}

export class GuestRoomSearchModel {
  public DepartmentID: number = 0;
  public GuestHouseName: string = '';
}
export class StudentDataModel {
  public ReqId: number = 0;
  public StudentID: number = 0;
  public PartnerApplicationID: number = 0;
  public FatherContactNo: string = '';
  public LocalGuardianName: string = '';
  public LocalGuardianContactNo: string = '';
  public AllotedHostelLastEndTerm: number = 0;
  public AllotedHostelInLastSessionRoomNo: number = 0;
  public AllotedHostelInLastSessionFeeDetails: number = 0;
  public AnyWorningForShortOfAttendance: number = 0;
  public AnyWarningForInvovementAgainstDiscipline: number = 0;
  public RoomPartnerName: string = '';
  public RoomPartnerYear: string = '';
  public RoomPartnerBranch: string = '';
  public RoomPartnerSFS: string = '';
  public RoomPartnerRegular: string = '';
  public AffidavitDocument: string = '';
  public dis_AffidavitDocument: string = '';
  public EndTermId: number = 0;
  public GuestHouseID: number = 0;
  public TotalAvg: number = 0;
}
export class HostelStudentSearchModel {
  public StudentID: number = 0;
  public GuestHouseID: number = 0;
  public PartnerApplicationID: number = 0;
  public Action: string = '';
}

export class CreateGuestRoomSeatDataModel {
  public GRSMasterID?: number;
  public DepartmentID?: number;
  public GuestHouseID: number = 0;
  public RoomType: number = 0;
  public RoomFee: number = 0;
  public SeatCapacity?: number;
  public RoomQuantity?: number;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;

}

export class GuestRoomSeatSearchModel {
  public DepartmentID: number = 0;
  public GRSMasterID: number = 0;
  public GuestHouseID: number = 0;
  public RoomType: number = 0;
  public SeatCapacity: number = 0;
  public RoomQuantity?: number;


}

export class FacilitiesDataModel {
  public GFID?: number;
  public DepartmentID?: number;
  public GuestHouseID: number = 0;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public FacilitiesName: string = '';
  public IsFacilities: boolean = false;

}

export class FacilitiesSearchModel {
  public DepartmentID: number = 0;
  public GFID: number = 0;
  public GuestHouseID: number = 0;
  public FacilitiesName: string = '';
  public IsFacilities: boolean = false;

}

export class GuestApplyForGuestRoomDataModel {
  public GuestHouseID: number = 0;
  public GuestReqID: number = 0;
  public UserID: number = 0;
  public CollegeID: number = 0;
  public DepartmentID: number = 0;
  public EmpID: string = '';
  public EmpIDCardPhoto: string = '';
  public Dis_EmpIDCardPhoto: string = '';
  public IDProofNo: string = '';
  public IDProofPhoto: string = '';
  public Dis_IDProofPhoto: string = '';
  public FromDate: string = '';
  public ToDate: string = '';
  public FromTime: string = '';
  public ToTime: string = '';
  public Status: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public Remark: string = '';
  public Reason: string = '';
  public RoomType: number = 0;
  public SeatCapacity: number = 0;
  public RoomQuantity: number = 0;
  public RoomFee: number = 0;
  public DepartmentName: string = '';
  public InstituteName: string = '';
  public DisplayName: string = '';
  public FirstName: string = '';
  public LastName: string = '';
  public MailPersonal: string = '';
  public MobileNo: string = '';
  public PostalAddress: string = '';
  public PostalCode: string = '';
  public TelephoneNumber: string = '';
  public State: string = '';
  public RoleID: number = 0;
  public EndTermID: number = 0;
  public RequestSSOID: string = '';
}

export class GuestApplyForGuestRoomSearchModel {
  public GuestHouseID: number = 0;
  public GuestReqID: number = 0;
  public UserID: number = 0;
  public CollegeID: number = 0;
  public DepartmentID: number = 0;
  public GuestHouseName: string = '';
  public FacilitiesName: string = '';
  public IsFacilities: boolean = false;
  public ModifyBy: number = 0;
  public RoleID: number = 0;
  public Status: number = 0;
}

export class GuestStaffProfileSearchModel {
  public DepartmentID: number = 0;
  public SSOID: string = '';
  public RoleID: number = 0;
  public InstituteID: number = 0;
}

export class CreateGuestHouseDataModel {
  public GuestHouseID: number = 0;
  public DepartmentID: number = 0;
  public GuestHouseName: string = '';
  public PhoneNumber: string = '';
  public Address: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public DistrictID: number = 0;
  public TehsilID: number = 0;
  public ModifyDate?: string = '';
  public IPAddress?: string = '';
  public RTS?: string = '';
}
export class GuestHouseSearchModel {
  public DepartmentID: number = 0;
  public GuestHouseName: string = '';
}

export class StatusChangeGuestModel {
  public PK_ID: number = 0;
  public ModifyBy: number = 0;
}


