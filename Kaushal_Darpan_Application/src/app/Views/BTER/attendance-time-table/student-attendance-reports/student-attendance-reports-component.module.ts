import { ChangeDetectionStrategy, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MaterialModule } from '../../../../material.module';
import { StudentAttendanceReportsComponent } from './student-attendance-reports-component';

const routes: Routes = [{
  path: '', component: StudentAttendanceReportsComponent
}];


@NgModule({
  declarations: [StudentAttendanceReportsComponent],
  imports: [
    FormsModule, ReactiveFormsModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ],
  providers: [provideNativeDateAdapter()]
})
export class StudentAttendanceReportsModule { }
