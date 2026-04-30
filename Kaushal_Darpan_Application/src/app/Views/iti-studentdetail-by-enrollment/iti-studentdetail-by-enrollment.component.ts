import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentExaminationITIService } from '../../Services/ITI/Examination/student-examination-iti.service';
import { StudentEnrollmentModel, UpdateStudentWithHistoryModel } from '../../Models/RevaluationModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { OTPModalComponent } from '../otpmodal/otpmodal.component';

@Component({
  selector: 'app-iti-studentdetail-by-enrollment',
  standalone:false,
  templateUrl: './iti-studentdetail-by-enrollment.component.html',
  styleUrl: './iti-studentdetail-by-enrollment.component.css'
})
export class ItiStudentdetailByEnrollmentComponent {

  form!: FormGroup;
  submitted = false;
  sSOLoginDataModel = new SSOLoginDataModel();
   @ViewChild('otpModal') childComponent!: OTPModalComponent;
   showFields: boolean = false;

constructor(
  private fb: FormBuilder, 
  private service: StudentExaminationITIService,
  private toastr: ToastrService,

) {}

ngOnInit() {
  this.form = this.fb.group({
    Enrollment: ['', Validators.required],
    StudentName: [''],
    FatherName: [''],
    MotherName: [''],
    DOB: ['']
  });
  this.sSOLoginDataModel =  JSON.parse(String(localStorage.getItem('SSOLoginUser')));
}

// async search() {
//   this.submitted = true;

//   if (this.form.invalid) return;

//   let request : StudentEnrollmentModel = {
//     Enrollment: this.form.value.Enrollment
//   };

//   debugger
//   let res: any = await this.service.GetStudentDetailsByEnrollment(request );
// debugger
//   if (res && res.Data && res.Data.length > 0) {

//     let data = res.Data[0]; // 👉 first record only

//     let dob = data.dob ? data.dob.substring(0, 10) : '';
//     this.form.patchValue({
//       StudentName: data.student_name,
//       FatherName: data.father_name,
//       MotherName: data.mother_name,
//       DOB: dob
//     });

//   } else {
//     this.toastr.warning("No data found");
//     this.form.patchValue({
//       StudentName: '',
//       FatherName: '',
//       MotherName: '',
//       DOB: ''
//     });
//   }
// }

async search() {
  this.submitted = true;

  if (this.form.controls.Enrollment.invalid) return;

  let request: StudentEnrollmentModel = {
    Enrollment: this.form.value.Enrollment
  };

  let res: any = await this.service.GetStudentDetailsByEnrollment(request);

  if (res && res.Data && res.Data.length > 0) {

    let data = res.Data[0];
    let dob = data.dob ? data.dob.substring(0, 10) : '';

    this.form.patchValue({
      StudentName: data.student_name,
      FatherName: data.father_name,
      MotherName: data.mother_name,
      DOB: dob
    });

    // ✅ show fields
    this.showFields = true;

    // ✅ add required validation AFTER search
    this.form.controls['StudentName'].setValidators([Validators.required]);
    this.form.controls['FatherName'].setValidators([Validators.required]);
    this.form.controls['MotherName'].setValidators([Validators.required]);
    this.form.controls['DOB'].setValidators([Validators.required]);

    this.form.updateValueAndValidity();

  } else {
    this.toastr.warning("No data found");

    this.showFields = false;

    this.form.patchValue({
      StudentName: '',
      FatherName: '',
      MotherName: '',
      DOB: ''
    });
  }
}

async update() {
  this.submitted = true;

   if (!this.showFields) {
    this.toastr.error("Please search enrollment first");
    return;
  }
  
  if (this.form.invalid) return;

  let request: UpdateStudentWithHistoryModel = {
    EnrollmentNo: this.form.value.Enrollment,
    StudentName: this.form.value.StudentName,
    FatherName: this.form.value.FatherName,
    MotherName: this.form.value.MotherName,
    DOB: this.form.value.DOB, 
    CreatedBy: this.sSOLoginDataModel.UserID,
    SelectedEndTermID: this.sSOLoginDataModel.EndTermID, 
    CreatedSsoID: this.sSOLoginDataModel.SSOID 
  };

  await this.openOTP();
  debugger;

  let res: any = await this.service.UpdateStudentWithHistory(request);

  debugger;

  if (res && res.State === 1) { // assuming 0 = Success
    //alert("Updated successfully with history");
    this.toastr.success(res?.Message || "Updated successfully with history")
  } else {
   // alert(res?.Message || "Update failed");
    this.toastr.success(res?.Message || "Update failed")
  }
}

onInput(event: any) {
  event.target.value = event.target.value.toUpperCase();
}

async openOTP() {
    debugger
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    // await for open model
    await this.childComponent.OpenOTPPopup();
    // await OTP verification
    await this.childComponent.waitForVerification();

  }
}
