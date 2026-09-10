export interface EmailTemplate {
  ID: number;
  TemplateCode: string;
  TemplateName: string;
  EmailSubject: string;
  EmailBody: string;

  ToQuery: string;
  CcQuery: string;
  BccQuery: string;
  DataQuery: string;

  EmailAttachment: string;

  IsHtml: boolean;
  IsActive: boolean;
  IsDeleted: boolean;

  CreatedBy: number;
  CreatedDate?: Date | string | null;

  UpdatedBy: number;
  UpdatedDate?: Date | string | null;
}
