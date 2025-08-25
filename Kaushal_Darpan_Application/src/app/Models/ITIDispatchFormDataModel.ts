
import { RequestBaseModel } from "./RequestBaseModel"

export class ITIDispatchFormDataModel {

  public BundelDataModel: ITIBundelDataModel[] = []
  public DispatchID: number = 0;
  public DispatchDate: string = '';
  public CompanyName: string = '';
  public ChallanNo: string = '';
  public SupplierName: string = '';
  public SupplierVehicleNo: string = '';
  public SupplierMobileNo: string = '';
  public SupplierDate: string = '';
  public RecipientName: string = '';
  public RecipientPost: string = '';
  public RecipientMobileNo: string = '';
  public RecipientDate: string = '';

  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Remark: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';
  public Status: number = 0;
  public CenterCode: string = "";
}

export class ITIBundelDataModel extends RequestBaseModel{
  public DispatchID: number = 0;
  public BundelID: number = 0;
  public BundelNo: string = '';
  public No: number = 0;
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string='';
  public ActionType: string = '';
  public SearchDate: string = '';

  public CourseTypeID: number = 0;
  public CenterCode: string = "";
  public ExamDate: string = "";
  public SubjectCode: string = "";
  public BranchCode: string = "";
  public ExamShift: string = "";
  public TotalPresentStudent: number = 0;
  public Status: number = 0;

  public DispatchDate: string = '';
  public ChallanNo: string = '';

  public ExamShiftID: number = 0;

  public InstituteID: number = 0;

  public selected: boolean = false;
  public CCCode: string = "";
  public ExamShiftName: string = "";
 
}

export class ITIDispatchSearchModel {
  public DispatchID: number = 0;
  public DispatchDate: string = '';
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public BundelID: number = 0;
  public Status: number = 0;
  public Action: string = '';
  public InstituteID: number = 0;
  public SSOID: string = '';
  public ExaminerStatus: number = 0;


}

export class ITIDispatchReceivedModel extends RequestBaseModel {
  public DispatchID: number = 0;
  public DispatchDate: string = '';
  public CourseTypeID: number = 0;
  public Status: number = 0;
  public DispatchReceivedID: number = 0;
  public CreatedBy: number = 0;
  public IPAddress: string = '';
 
}

export class ITIDownloadDispatchReceivedSearchModel {
  public DispatchID: number = 0;
  public DispatchDate: string = '';
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public BundelID: number = 0;
  public Status: number = 0;
  public Action: string = '';
}

export class ITIDispatchPrincipalGroupCodeDataModel {

  public DPGCID: number = 0;
  public DispatchGroupID: number = 0;
  public DispatchDate: string = '';
  public CompanyName: string = '';
  public ChallanNo: string = '';
  public SupplierName: string = '';
  public SupplierVehicleNo: string = '';
  public SupplierMobileNo: string = '';
  public SupplierDate: string = '';
  public RecipientName: string = '';
  public RecipientPost: string = '';
  public RecipientMobileNo: string = '';
  public RecipientDate: string = '';

  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Remark: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IPAddress: string = '';

  public Status: number = 0;
  public CenterCode: string = "";

  public InstituteID: number = 0;

  public groupCodeModels
: ITIViewByIDDispatchGroupCodeModel[] = []


}


export class ITIDispatchPrincipalGroupCodeSearchModel {
  public DPGCID: number = 0;
  public DispatchGroupID: number = 0;
  public DispatchDate: string = '';
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public BundelID: number = 0;
  public Status: number = 0;
  public Action: string = '';
  public InstituteID: number = 0;

}

export class ITIUpdateStatusDispatchPrincipalGroupCodeModel {
  public DPGCID: number = 0;
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Status: number = 0;
  public Action: string = '';
  public InstituteID: number = 0;
  public CreatedBy: number = 0;
}

export class ITIViewByIDDispatchGroupCodeModel {
     public  Id: number = 0;
     public  DispatchGroupID: number = 0;
     public  ExaminerStatusID: number = 0;
     public  GroupID: number = 0;
     public  InstituteNameEnglish: string = '';
     public  GroupCode: string = '';
     public  DispatchNo: string = '';
     public  DispatchDate: string = '';
     public  ExaminerStatus: string = '';
       
}


export class ITIDispatchMasterStatusUpdate {

        public  DispatchID : number = 0;
        public  Status : number = 0;
        public  ModifyBy : number = 0;
     
}

export class ITICheckDateDispatchSearchModel {

  public ID: number = 0;
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public SPName: string = '';

}

export class ITIUpdateFileHandovertoExaminerByPrincipalModel {

  public AppointExaminerID: number = 0;
  public FileName: string = '';
  public Remark: string = '';
  public Dis_File: string = '';
  public CreatedBy: number = 0;
  public ExaminerCode: string = '';
  public Status: number = 0;
  public DueDate: string='';
}

export class ITICompanyDispatchMasterModel {
  public CompanyID: number = 0;
  public CompanyName: string='';
  public CupplierName: string = '';
  public SupplierVehicleNo: string = '';
  public SupplierMobileNo: string = '';
  public SupplierDate: string = '';
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Remark: string = '';
  public ActiveStatus: boolean=false;
  public DeleteStatus: boolean = false;
  public Rts: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IpAddress: string = '';
  public Status: number = 0;
}

export class ITICompanyDispatchMasterSearchModel {
  public CompanyID: number=0;
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Status: number = 0;
  public CreatedBy: number = 0;

}

export class ITICompanyDispatchIUMasterModel {
  public companyID: number = 0;
  public companyName: string = '';
  public supplierName: string = '';
  public supplierVehicleNo: string = '';
  public supplierMobileNo: string = '';
  public supplierDate: string = '';
  public departmentID: number = 0;
  public courseTypeID: number = 0;
  public endTermID: number = 0;
  public remark: string = '';
  public activeStatus: boolean = false;
  public deleteStatus: boolean = false;
  public rts: string = '';
  public createdBy: number = 0;
  public modifyBy: number = 0;
  public modifyDate: string = '';
  public ipAddress: string = '';
  public status: number = 0;
}

export class ITICompanyDispatchIUMasterSearchModel {
  public companyID: number = 0;
  public departmentID: number = 0;
  public courseTypeID: number = 0;
  public endTermID: number = 0;
  public status: number = 0;
  public createdBy: number = 0;
}
export class ITI_Dispatch_ShowbundleSearchModel {
        public Action: string = '';
        public SemesterID: number = 0;
        public StreamId: number = 0;
        public SubjectId: number = 0;
        public EndTermID: number = 0;
        public DepartmentID: number = 0;
        public StatusID: number = 0;
        public UserID: number = 0;
}


export class ITI_DispatchBundelNoSendToTheAdminByTheExaminerUpdate {
  public DPGCID: number = 0;
  public Status: number=0;
  public ModifyBy: number=0;
  public DispatchGroupID: number=0;
  public GroupCodeID: number=0;
  public ExaminerCode: string='';
  public AppointExaminerID: number=0;
}

       
