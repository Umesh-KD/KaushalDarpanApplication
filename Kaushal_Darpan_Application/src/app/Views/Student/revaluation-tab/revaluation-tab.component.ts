import { ChangeDetectorRef, Component, ComponentFactoryResolver, inject, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FirstYearAdmissionComponent } from '../../Emitra/first-year-admission/first-year-admission.component';
import { LateralEntryComponent } from '../../Emitra/lateral-entry/lateral-entry.component';
import { ApplyNowComponent } from '../../Emitra/apply-now/apply-now.component';
import { Router } from '@angular/router';
import { RevaluationStudentSearchComponent } from '../revaluation-student-search/revaluation-student-search.component';
import { RevaluationStudentVerifyComponent } from '../revaluation-student-verify/revaluation-student-verify.component';
import { RevaluationStudentMakePaymentComponent } from '../revaluation-student-make-payment/revaluation-student-make-payment.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-revaluation-tab',
  standalone: false,
  
  templateUrl: './revaluation-tab.component.html',
  styleUrl: './revaluation-tab.component.css'
})
export class RevaluationTabComponent {
  //private _formBuilder = inject(FormBuilder);

  //firstFormGroup = this._formBuilder.group({
  //  firstCtrl: ['', Validators.required],
  //});
  //secondFormGroup = this._formBuilder.group({
  //  secondCtrl: ['', Validators.required],
  //});
}
