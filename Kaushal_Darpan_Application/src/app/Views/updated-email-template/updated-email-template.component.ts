import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-updated-email-template',
  standalone: false,
  templateUrl: './updated-email-template.component.html',
  styleUrl: './updated-email-template.component.css'
})
export class UpdatedEmailTemplateComponent implements OnInit {
  templateForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  // Add these two properties:
  openBraces = '{{';
  closeBraces = '}}';
  
  availableVariables: string[] = ['Name', 'ApplicationNo', 'Status', 'Date', 'ReferenceID', 'Email', 'Doc'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
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

    // Keep cursor positioned directly after inserted tag
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagFormatted.length, start + tagFormatted.length);
    }, 0);
  }

  saveTemplate(): void {
    this.submitted = true;
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }
    const request = this.templateForm.getRawValue();
    console.log('Email Template Request:', request);
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

  previewEmail(): void {
    const emailBody = this.templateForm.get('EmailBody')?.value;
    if (!emailBody) return;

    const newWindow = window.open('', '_blank', 'width=850,height=650');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview: ${this.templateForm.get('EmailSubject')?.value || 'Email Template'}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; background: #f8fafc; }
              .preview-shell { background: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); max-width: 700px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="preview-shell">
              ${emailBody}
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
}