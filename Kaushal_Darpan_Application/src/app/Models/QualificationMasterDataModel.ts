export class QualificationMasterDataModel {
    public QualificationLevel: string = '';
    public QualificationLevelID: number = 0;
    public QualificationName: string = '';
    public Remarks: string = '';
    public UserID: number = 0;
    public DepartmentID: number = 0;
    public QualificationID: number = 0;
}

export class QualificationMasterSearchModel{
    public Action?: string = '';
    public QualificationID?: number = 0
    public UserID?: number = 0
    public QualificationName?: string = '';
}