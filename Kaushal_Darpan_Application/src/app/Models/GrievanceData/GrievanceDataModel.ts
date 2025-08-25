export class GrievanceDataModel {
  public GrivienceID: number = 0;
  public ComplainNo: string = '';
  public CategoryID: number = 0;
  public DepartmentID: number = 0;
  public ModuleID: number = 0;
  public ApplicationNo: string = '';
  public SubjectRelatedToComplain: string = '';
  public FileAttachment: string = '';
  public DisAttachmentFileName: string = '';
  public Remark: string = '';
  public StatusID: number = 0;
  public ResolvedDate: string | null = null;  // Null by default
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;  // Default value of 0
  public CreatedBy: number = 0;  // Default value of 0
  public RoleID: number = 0;
}

export class GrivienceReopenModelsDataModel {
  public GrivienceID: number = 0;
  public FileAttachment: string = '';
  public DisAttachmentFileName: string = '';
  public Remark: string = '';
}

export class GrivienceSearchModel {

  public GrivienceID: number=0;
  public CategoryID: number = 0;
  public DepartmentID: number = 0;
  public ModuleID: number = 0;
  public StatusID: number = 0;
  public CreatedBy: number=0
  public ModifyBy: number = 0
  public RoleID: number = 0;

}

export class GrivienceResponseDataModel {
  public GrivienceResponseID: number = 0;
  public GrivienceID: number = 0;
  public Remark: string = '';
  public ResponseFileAttachment: string = '';
  public DisResponseFileName: string = '';
  public StatusID: number = 0;
  public ModifyBy: number = 0;
  public RTS: string = '';
  public CreatedBy: number = 0;
  public ModifyDate: string = ''
  public ComplainNo: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;

}											


