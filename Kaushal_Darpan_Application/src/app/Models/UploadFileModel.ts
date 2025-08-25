export class UploadFileModel {
  public FolderName?: string = '';
  public FileExtention?: string = '';
  public MinFileSize?: string = '';
  public MaxFileSize?: string = '';
  public Password?: string = '';
}

export interface UploadBTERFileModel {
  ApplicationID?: string;
  DocumentMasterID?: string;
  AcademicYear?: string;
  DepartmentID?: string;
  EndTermID?: string;
  Eng_NonEng?: string;
  FileName?: string;
  FolderName?: string;
  FileExtention?: string;
  MinFileSize?: string;
  MaxFileSize?: string;
  Password?: string;
  IsCopy?: boolean;
}
