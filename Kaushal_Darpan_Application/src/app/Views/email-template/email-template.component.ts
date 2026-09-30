import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-template',
  standalone: false,
  templateUrl: './email-template.component.html',
  styleUrl: './email-template.component.css'
})
export class EmailTemplateComponent {

  templateForm!: FormGroup;

  isEditMode = false;
  submitted = false;
  availableVariables = ['Name', 'ApplicationNo', 'Status', 'Date', 'ReferenceID'];
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {

    this.templateForm = this.fb.group({

      ID: [0],

      TemplateCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      TemplateName: [
        '',
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],

      EmailSubject: [
        '',
        [
          Validators.required,
          Validators.maxLength(500)
        ]
      ],

      EmailBody: [
        '',
        Validators.required
      ],

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

  saveTemplate(): void {

    this.submitted = true;

    if (this.templateForm.invalid) {

      this.templateForm.markAllAsTouched();

      return;
    }

    const request = this.templateForm.getRawValue();

    console.log('Email Template Request:', request);

    /*
      Call your API here

      Example:

      this.emailTemplateService.SaveEmailTemplate(request)
        .subscribe({
          next: (response) => {
             ...
          },
          error: (error) => {
             ...
          }
        });
    */
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

    if (!this.templateForm.get('EmailBody')?.value) {
      return;
    }

    const emailBody =
      this.templateForm.get('EmailBody')?.value;

    const newWindow = window.open(
      '',
      '_blank',
      'width=900,height=700'
    );

    if (newWindow) {

      newWindow.document.write(`
        <html>
          <head>
            <title>Email Preview</title>
          </head>

          <body style="margin:0;padding:20px;background:#f5f5f5;">
            ${emailBody}
          </body>

        </html>
      `);

      newWindow.document.close();
    }
  }

  testEmail(): void {

    console.log(
      'Test Email:',
      this.templateForm.getRawValue()
    );

    /*
      Call test email API here.
    */
  }
}
