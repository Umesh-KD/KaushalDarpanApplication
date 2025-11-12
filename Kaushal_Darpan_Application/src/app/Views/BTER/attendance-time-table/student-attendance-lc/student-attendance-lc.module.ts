import { ChangeDetectionStrategy, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StudentAttendanceLComponent } from './student-attendance-lc.component';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MaterialModule } from '../../../../material.module';

const routes: Routes = [{
  path: '', component: StudentAttendanceLComponent
}];


@NgModule({
  declarations: [StudentAttendanceLComponent],
  imports: [
    FormsModule, ReactiveFormsModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ],
  providers: [provideNativeDateAdapter()]
})
export class StudentAttendanceLCModule { }
