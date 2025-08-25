import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateTpoAddEditModel } from '../../../../Models/CreateTPOModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CreateTpoService } from '../../../../Services/TPOMaster/create-tpo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-edit-tpo',
    templateUrl: './edit-tpo.component.html',
    styleUrls: ['./edit-tpo.component.css'],
    standalone: false
})
export class EditTpoComponent implements OnInit {
  editForm!: FormGroup;
  isSubmitted = false;
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  request: CreateTpoAddEditModel = {
      UserID: 0,
      InstituteID: 0,
      DistrictNameEnglish: '',
      InstituteNameEnglish: '',
      InstituteNameHindi: '',
      MobileNumber: '',
      SSOID: '',
      Email: '',
      EmailOfficial: '',
      Name: '',
      Marked: false,
      ModifyBy: 0,
      IPAddress: '',
      DepartmentID: 0
  }

  // No need for @Input() here, as data is passed via MAT_DIALOG_DATA
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateTpoAddEditModel,
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<EditTpoComponent>,
    private loaderService: LoaderService,
    private createTpoService: CreateTpoService,
    private toastr: ToastrService,
  ) {
    console.log(this.data); // Logs the passed data
    this.request = this.data; // Directly use data passed via dialog
  }

  ngOnInit(): void {
    this.initializeForm(); // Initialize form
    this.loadCenterData();  // Load data into the form when dialog is opened
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog
  }

  // Initialize form with validation
  initializeForm(): void {
    this.editForm = this.fb.group({
      InstituteID: [this.request.InstituteID],
      SSOID: [this.request.SSOID],
      MobileNumber: [this.request.MobileNumber, [Validators.pattern('^[0-9]{10}$')]],
      Email: [this.request.Email, [Validators.email]],
      EmailOfficial: [this.request.EmailOfficial, [Validators.email]],
      Name: [this.request.Name],
      InstituteNameEnglish: [this.request.InstituteNameEnglish, Validators.required]
    });
  }

  // Load data into the form (using the dialog's data)
  loadCenterData(): void {
    if (this.data) {
      console.log('Loaded College Data:', this.data);
      this.editForm.patchValue(this.data); // Populate form with data passed through the dialog
    }
  }

  // Form submit handler
  async saveData(): Promise<void> {
    this.isSubmitted = true;
    
    try {
      this.loaderService.requestStarted();
      //save
      const user = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');
      const userId = user?.UserID;
      let obj: CreateTpoAddEditModel = {
          UserID: userId,
          InstituteID: this.editForm.value.InstituteID,
          InstituteNameEnglish: this.editForm.value.InstituteNameEnglish,
          MobileNumber: this.editForm.value.MobileNumber,
          SSOID: this.editForm.value.SSOID,
          Name: this.editForm.value.Name,
          Email: this.editForm.value.Email,
          EmailOfficial: this.editForm.value.EmailOfficial,
          Marked: true,
          DistrictNameEnglish: this.request.DistrictNameEnglish,
          InstituteNameHindi: this.request.InstituteNameHindi,
          ModifyBy: 0,
          IPAddress: '',
          DepartmentID: 0
      }
      await this.createTpoService.SaveData(obj)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State) {
            this.toastr.success("Submitted Successfully")
            console.log('Form Submitted Successfully', obj);
            //await this.addCenterData();
            this.dialogRef.close(this.State);
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to create Tpo!');
        });
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // Save data method
  addCenterData(): void {
    console.log('Adding Center:', this.request);
    // Do any API request to save the data if needed
    this.router.navigate(['/managetpo']); // Navigate to another route after saving
  }

  // Reset form controls
  ResetControl(): void {
    this.isSubmitted = false;
    // Reset specific fields except SSOID
    this.editForm.get('MobileNumber')?.reset();
    this.editForm.get('Email')?.reset();
    this.editForm.get('SSOID')?.reset();

    // Optionally reapply SSOID if needed (if it changes dynamically)
    this.editForm.get('InstituteNameEnglish')?.setValue(this.request.InstituteNameEnglish);
    this.editForm.get('InstituteID')?.setValue(this.request.InstituteID);
  }
}
