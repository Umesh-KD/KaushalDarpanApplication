
import { RequestBaseModel } from "./RequestBaseModel"

export class DispatchFormDataModel {

  public BundelDataModel: BundelDataModel[] = []
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

export class BundelDataModel extends RequestBaseModel {
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
  public IPAddress: string = '';
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
  public UserID: number = 0;

}

export class DispatchSearchModel extends RequestBaseModel {
  public DispatchID: number = 0;
  public DispatchDate: string = '';
  public CourseTypeID: number = 0;
  public BundelID: number = 0;
  public Status: number = 0;
  public Action: string = '';
  public InstituteID: number = 0;
  public SSOID: string = '';
  public ExaminerStatus: number = 0;
  public UserID: number = 0;
}

export class DispatchReceivedModel extends RequestBaseModel {
  public DispatchID: number = 0;
  public DispatchDate: string = '';
  public CourseTypeID: number = 0;
  public Status: number = 0;
  public DispatchReceivedID: number = 0;
  public CreatedBy: number = 0;
  public IPAddress: string = '';

}

export class DownloadDispatchReceivedSearchModel {
  public DispatchID: number = 0;
  public DispatchDate: string = '';
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public BundelID: number = 0;
  public Status: number = 0;
  public Action: string = '';
}

export class DispatchPrincipalGroupCodeDataModel {

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
    : ViewByIDDispatchGroupCodeModel[] = []


}


export class DispatchPrincipalGroupCodeSearchModel {
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

export class UpdateStatusDispatchPrincipalGroupCodeModel {
  public DPGCID: number = 0;
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Status: number = 0;
  public Action: string = '';
  public InstituteID: number = 0;
  public CreatedBy: number = 0;
}

export class ViewByIDDispatchGroupCodeModel {
  public Id: number = 0;
  public DispatchGroupID: number = 0;
  public ExaminerStatusID: number = 0;
  public GroupID: number = 0;
  public InstituteNameEnglish: string = '';
  public GroupCode: string = '';
  public DispatchNo: string = '';
  public DispatchDate: string = '';
  public ExaminerStatus: string = '';

}


export class DispatchMasterStatusUpdate {

  public DispatchID: number = 0;
  public Status: number = 0;
  public ModifyBy: number = 0;

}

export class CheckDateDispatchSearchModel {

  public ID: number = 0;
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public SPName: string = '';

}

export class UpdateFileHandovertoExaminerByPrincipalModel {

  public DispatchGroupID: number = 0;
  public FileName: string = '';
  public Remark: string = '';
  public Dis_File: string = '';
  public CreatedBy: number = 0;
  public GroupCodeIDs: string = '';
  public Status: number = 0;
  public DueDate: Date = new Date();
}

export class CompanyDispatchMasterModel {
  public CompanyID: number = 0;
  public CompanyName: string = '';
  public CupplierName: string = '';
  public SupplierVehicleNo: string = '';
  public SupplierMobileNo: string = '';
  public SupplierDate: string = '';
  public DepartmentID: number = 0;
  public CourseTypeID: number = 0;
  public EndTermID: number = 0;
  public Remark: string = '';
  public ActiveStatus: boolean = false;
  public DeleteStatus: boolean = false;
  public Rts: string = '';
  public CreatedBy: number = 0;
  public ModifyBy: number = 0;
  public ModifyDate: string = '';
  public IpAddress: string = '';
  public Status: number = 0;
}

export class CompanyDispatchMasterSearchModel extends RequestBaseModel {
  public CompanyID: number = 0;
  public CourseTypeID: number = 0;
  public Status: number = 0;
  public CreatedBy: number = 0;

}

export class CompanyDispatchIUMasterModel {
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

export class CompanyDispatchIUMasterSearchModel {
  public companyID: number = 0;
  public departmentID: number = 0;
  public courseTypeID: number = 0;
  public endTermID: number = 0;
  public status: number = 0;
  public createdBy: number = 0;
}



