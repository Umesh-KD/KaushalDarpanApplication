import { RequestBaseModel } from "../RequestBaseModel";

export class CreateHostelDataModel {
  public HostelID: number = 0;
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public HostelName: string = '';
  public HostelType: number = 0;
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

export class HostelSearchModel {
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public HostelName: string = '';
  public HostelType: number = 0;
}
export class StudentDataModel {


  public ReqId: number = 0;
  public StudentID: number = 0;
  public PartnerApplicationID: number = 0;
  public AllotedHostelLastEndTerm: number = 0;
  public AllotedHostelInLastSessionRoomNo: number = 0;
  public AllotedHostelInLastSessionFeeDetails: number = 0;
  public AnyWorningForShortOfAttendance: number = 0;
  public AnyWarningForInvovementAgainstDiscipline: number = 0;
  public EndTermId: number = 0;
  public HostelID: number = 0;
  public TotalAvg: number = 0;
  public DepartmentID: number = 0;
  public FatherContactNo: string | null = null;
  public LocalGuardianName: string | null = null;
  public LocalGuardianContactNo: string | null = null;
  public RoomPartnerName: string | null = null;
  public RoomPartnerYear: string | null = null;
  public RoomPartnerBranch: string | null = null;
  public RoomPartnerSFS: string | null = null;
  public RoomPartnerRegular: string | null = null;
  public AffidavitDocument: string | null = null;
  public dis_AffidavitDocument: string | null = null;
  public SupportingDocument?: string | null = null;
  public dis_SupportingDocument?: string | null = null;

  public CurrentEndTermId: number = 0;
  public CourseTypeID: number = 0;

}
export class HostelStudentSearchModel {
  public StudentID: number = 0;
  public InstituteID: number = 0;
  public DepartmentID: number = 0;
  public HostelID: number = 0;
  public PartnerApplicationID: number = 0;
  public Action: string = '';
}


export class EditHostelStudentSearchModel {
  public StudentID: number = 0;
  public InstituteID: number = 0;
  public DepartmentID: number = 0;
  public HostelID: number = 0;
  public PartnerApplicationID: number = 0;
  public Action: string = '';
  public ReqId: number = 0;
  public RoleId: number = 0;
}


export class CreateHostelRoomSeatDataModel {
  public HRSMasterID?: number;
  public HostelID: number = 0;
  public RoomType: number = 0;
  public RoomFee: number = 0;
  public SeatCapacity?: number;
  public RoomQuantity?: number;
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;

}

export class HostelRoomSeatSearchModel {
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public HRSMasterID: number = 0;
  public HostelID: number = 0;
  public RoomFee: number = 0;
  public RoomType: number = 0;
  public EndTermID: number = 0;
  public SeatCapacity: number = 0;
  public RoomQuantity?: number;


}

export class FacilitiesDataModel {
  public HFID?: number;
  public DepartmentID?: number;
  public InstituteID: number = 0;
  public HostelID: number = 0;
  public WaterCooler: number = 2;
  public RoWater: number = 2;
  public NearbyMarket: number = 2;
  public MarketDistance: string = '';
  public PlayGround?: number = 2;
  public PlayGroundDistance: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public FacilitiesName: string = '';
  public IsFacilities: boolean = false;

}

export class FacilitiesSearchModel {
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public HFID: number = 0;
  public HostelID: number = 0;
  public WaterCooler: number = 0;
  public RoWater: number = 0;
  public NearbyMarket: number = 0;
  public MarketDistance: string = '';
  public PlayGround: number = 0;
  public PlayGroundDistance: string = '';
  public FacilitiesName: string = '';
  public IsFacilities: boolean = false;

}


export class CollegeHostelDetailsDataModel {
  public HFID?: number;
  public DepartmentID?: number;
  public InstituteID: number = 0;
  public HostelID: number = 0;
  public HostelName: string = '';
  public HostelType: number = 0;
  public WaterCooler: number = 1;
  public RoWater: number = 1;
  public NearbyMarket: number = 1;
  public MarketDistance: string = '';
  public PlayGround?: number = 1;
  public PlayGroundDistance: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public FacilitiesName: string = '';
  public IsFacilities: boolean = false;
}

export class CollegeHostelDetailsSearchModel {
  public UserID: number = 0;
  public DepartmentID: number = 0;
  public InstituteID: number = 0;
  public HFID: number = 0;
  public HostelID: number = 0;
  public HostelName: string = '';
  public HostelType: number = 0;
  public WaterCooler: number = 0;
  public RoWater: number = 0;
  public NearbyMarket: number = 0;
  public MarketDistance: string = '';
  public PlayGround: number = 0;
  public PlayGroundDistance: string = '';
  public FacilitiesName: string = '';
  public IsFacilities: boolean = false;
}

export class StatusChangeModel {
  public PK_ID: number = 0;
  public ModifyBy: number = 0;
}
export class StatusChangeHostelModel {
  public PK_ID: number = 0;
  public ModifyBy: number = 0;
}


