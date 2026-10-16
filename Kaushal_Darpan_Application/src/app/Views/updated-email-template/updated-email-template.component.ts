import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../Common/GlobalConstants';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../Common/appsetting.service';

@Component({
  selector: 'app-updated-email-template',
  standalone: false,
  templateUrl: './updated-email-template.component.html',
  styleUrl: './updated-email-template.component.css'
})
export class UpdatedEmailTemplateComponent implements OnInit {
  templateForm!: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;
  public isLoading: boolean = false;

  // Tab & Table State
  selectedTabIndex: number = 0; // 0: Directory Tab, 1: General Settings, 2: Body, etc.
  searchKeyword: string = '';
  templateList: any[] = [];

  public sSOLoginDataModel = new SSOLoginDataModel();

  // Template interpolation helpers
  openBraces = '{{';
  closeBraces = '}}';

  public selectedAttachmentFile: File | null = null;
  public uploadStatus: 'idle' | 'uploading' | 'completed' = 'idle';
  public uploadedDocDisplayName: string = '';

  availableVariables: string[] = ['Name', 'ApplicationNo', 'Status', 'Date', 'ReferenceID', 'Email', 'Doc'];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private SMSMailService: SMSMailService,
    private commonMasterService: CommonFunctionService,
    public appsettingConfig: AppsettingService
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();

    try {
      const loginData = localStorage.getItem('SSOLoginUser');
      if (loginData) {
        this.sSOLoginDataModel = JSON.parse(loginData);
      }
    } catch (error) {
      console.error('Error reading logged-in user:', error);
    }

    await this.GetTemplateList();
  }

  createForm(): void {
    this.templateForm = this.fb.group({
      ID: [0],
      TemplateCode: ['', [Validators.required, Validators.maxLength(100)]],
      TemplateName: ['', [Validators.required, Validators.maxLength(200)]],
      EmailSubject: ['', [Validators.required, Validators.maxLength(500)]],
      EmailBody: ['', Validators.required],
      ToQuery: [''],
      CcQuery: [''],
      BccQuery: [''],
      DataQuery: [''],
      EmailAttachment: [''],
      IsHtml: [true],
      IsActive: [true],
      IsDeleted: [false],
      CreatedBy: [0],
      CreatedDate: [null],
      UpdatedBy: [0],
      UpdatedDate: [null]
    });
  }

  get f() {
    return this.templateForm.controls;
  }

  private parseResponse(response: any): any {
    if (response == null) {
      return {};
    }
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch {
        return {};
      }
    }
    return response;
  }

  // ==========================================
  // Fetch Template List
  // ==========================================
  async GetTemplateList(searchText: string = ''): Promise<void> {
    try {
      this.loaderService.requestStarted();
      this.isLoading = true;
debugger
      const response = await this.SMSMailService.GetEmailTemplateList(0, searchText);
      const data = this.parseResponse(response);

      if (data.State === EnumStatus.Success) {
        this.templateList = data.Data || [];
      } else {
        this.templateList = [];
      }
    } catch (error) {
      console.error('GetTemplateList error:', error);
      this.toastr.error('Failed to load email templates.');
    } finally {
      this.isLoading = false;
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // ==========================================
  // Save / Update Template
  // ==========================================
  async saveTemplate(): Promise<void> {
    this.submitted = true;

    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields.');
      return;
    }

    const formValue = this.templateForm.getRawValue();
    const templateID = Number(formValue.ID || 0);

    const payload: any = {
      ...formValue,
      ID: templateID,
      CreatedBy: templateID > 0 ? (formValue.CreatedBy || this.sSOLoginDataModel?.UserID || 0) : (this.sSOLoginDataModel?.UserID || 0),
      UpdatedBy: templateID > 0 ? (this.sSOLoginDataModel?.UserID || 0) : null
    };

    try {
      this.loaderService.requestStarted();
      this.isLoading = true;

      const response = await this.SMSMailService.SaveEmailTemplate(payload);
      const data = this.parseResponse(response);

      if (data.State === EnumStatus.Success) {
        this.toastr.success(
          data.Message ||
          (templateID > 0
            ? 'Email template updated successfully.'
            : 'Email template created successfully.')
        );

        // Refresh grid and switch back to Directory Tab
        await this.GetTemplateList(this.searchKeyword);
        this.resetForm();
        this.selectedTabIndex = 0;
      } else {
        this.toastr.error(
          data.ErrorMessage || data.Message || 'Unable to save email template.'
        );
      }
    } catch (error) {
      console.error('SaveData error:', error);
      this.toastr.error('An error occurred while saving the email template.');
    } finally {
      this.isLoading = false;
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // ==========================================
  // Action Handlers
  // ==========================================
  editTemplate(item: any): void {
    this.isEditMode = true;
    this.templateForm.patchValue({
      ID: item.ID,
      TemplateCode: item.TemplateCode,
      TemplateName: item.TemplateName,
      EmailSubject: item.EmailSubject,
      EmailBody: item.EmailBody,
      ToQuery: item.ToQuery || '',
      CcQuery: item.CcQuery || '',
      BccQuery: item.BccQuery || '',
      DataQuery: item.DataQuery || '',
      EmailAttachment: item.EmailAttachment || '',
      IsHtml: item.IsHtml,
      IsActive: item.IsActive,
      IsDeleted: item.IsDeleted,
      CreatedBy: item.CreatedBy,
      CreatedDate: item.CreatedDate,
      UpdatedBy: item.UpdatedBy,
      UpdatedDate: item.UpdatedDate
    });

    // Switch from directory to the form tab
    this.selectedTabIndex = 1;
  }

  //==========================================
  //  sendTemplateEmail
  //==========================================

  // Prompt confirmation and trigger SendEmail_New
async sendTemplateEmail(item: any, isTest: boolean = false) {
  if (!item.TemplateCode) {
    this.toastr.warning('Template code is missing for this record.');
    return;
  }

  const confirmMsg = `Are you sure you want to send email using template <b>"${item.TemplateName || item.TemplateCode}"</b>?`;

  this.Swal2.Confirmation(confirmMsg, async (result: any) => {
    // Check if user clicked the confirm button
    if (!result.isConfirmed) {
      return;
    }

    // Prepare payload for SendEmail_New
    const payload = [
      {
        TemplateCode: item.TemplateCode,
        StudentId: 0,
        Status: 0,
        RoleId: 0,
        ApplicationNo: '',
        MobileNo: '',
        MessageType: isTest ? 'Test' : 'Email'
      }
    ];

    try {
      this.loaderService.requestStarted();
      this.isLoading = true;

      const response = await this.SMSMailService.SendEmail_New(payload);
      const data = this.parseResponse(response);

      if (data.State === EnumStatus.Success) {
        this.toastr.success(
          data.Message || (isTest ? 'Test email processed successfully.' : 'Emails dispatched successfully.')
        );
      } else {
        this.toastr.error(
          data.ErrorMessage || data.Message || 'Failed to dispatch emails.'
        );
      }
    } catch (error) {
      console.error('SendEmail_New error:', error);
      this.toastr.error('An error occurred while sending emails.');
    } finally {
      this.isLoading = false;
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }, 'Yes, Send');
}

  newTemplate(): void {
    this.resetForm();
    this.selectedTabIndex = 1;
  }

  resetForm(): void {
    this.submitted = false;
    this.isEditMode = false;
    this.templateForm.reset({
      ID: 0,
      TemplateCode: '',
      TemplateName: '',
      EmailSubject: '',
      EmailBody: '',
      ToQuery: '',
      CcQuery: '',
      BccQuery: '',
      DataQuery: '',
      EmailAttachment: '',
      IsHtml: true,
      IsActive: true,
      IsDeleted: false,
      CreatedBy: 0,
      CreatedDate: null,
      UpdatedBy: 0,
      UpdatedDate: null
    });
  }

  insertTag(tag: string): void {
    const textarea = document.getElementById('emailBodyTextarea') as HTMLTextAreaElement;
    const tagFormatted = `{{${tag}}}`;

    if (!textarea) {
      const current = this.templateForm.get('EmailBody')?.value || '';
      this.templateForm.get('EmailBody')?.setValue(current + tagFormatted);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    const updated = currentVal.substring(0, start) + tagFormatted + currentVal.substring(end);
    this.templateForm.get('EmailBody')?.setValue(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagFormatted.length, start + tagFormatted.length);
    }, 0);
  }

  // ==========================================
  // Previews
  // ==========================================
  previewTemplateItem(item: any): void {
    this.renderPreview(item.EmailSubject, item.EmailBody);
  }

  previewEmail(): void {
    const emailBody = this.templateForm.get('EmailBody')?.value;
    const subject = this.templateForm.get('EmailSubject')?.value;
    if (!emailBody) return;
    this.renderPreview(subject, emailBody);
  }

  private renderPreview(subject: string, body: string): void {
    const newWindow = window.open('', '_blank', 'width=850,height=650');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview: ${subject || 'Email Template'}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; background: #f8fafc; }
              .preview-shell { background: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); max-width: 700px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="preview-shell">
              ${body}
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  }

  testEmail(): void {
    console.log('Sending Test Payload:', this.templateForm.getRawValue());
  }


  // 1. File Selection Handler
  onAttachmentSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('Select only JPEG, JPG, PNG, or PDF file');
      event.target.value = null;
      return;
    }

    if (file.size > 2000000) {
      this.toastr.error('Select file less than 2MB');
      event.target.value = null;
      return;
    }

    this.selectedAttachmentFile = file;
    this.uploadStatus = 'idle';
  }

  // 2. Upload to Server & Bind Path to templateForm
  async uploadAttachmentToServer(type: string): Promise<void> {
    if (!this.selectedAttachmentFile) {
      this.toastr.warning('Please select a file first.');
      return;
    }

    try {
      this.uploadStatus = 'uploading';
      this.loaderService.requestStarted();
      debugger
      const res = await this.commonMasterService.UploadDocument(this.selectedAttachmentFile);
      const data = typeof res === 'string' ? JSON.parse(res) : res;

      if (data['State'] === EnumStatus.Success) {
        this.uploadedDocDisplayName = data['Data'][0]['Dis_FileName'];
        const serverFileName = data['Data'][0]['FileName'];

        // Automatically patch the server path into your reactive form control
        this.templateForm.patchValue({
          EmailAttachment: serverFileName
        });

        this.uploadStatus = 'completed';
        this.toastr.success(data['Message'] || 'Attachment uploaded successfully');
      } else if (data['State'] === EnumStatus.Error) {
        this.uploadStatus = 'idle';
        this.toastr.error(data['ErrorMessage']);
      } else if (data['State'] === EnumStatus.Warning) {
        this.uploadStatus = 'idle';
        this.toastr.warning(data['ErrorMessage']);
      }
    } catch (error) {
      this.uploadStatus = 'idle';
      console.error(error);
      this.toastr.error('Failed to upload attachment.');
    } finally {
      this.loaderService.requestEnded();
    }
  }

  // 3. Clear & Reset Attachment State
  cancelAttachmentUpload(): void {
    this.selectedAttachmentFile = null;
    this.uploadStatus = 'idle';
    this.uploadedDocDisplayName = '';
    this.templateForm.patchValue({ EmailAttachment: '' });

    const fileInput = document.getElementById('attachmentFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // 4. File Type Check for Image Previews
  isImageFile(filename: string): boolean {
    if (!filename) return false;
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
  }


}
