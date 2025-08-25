import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITIAttendanceTimeTableComponent } from './iti-attendance-time-table/iti-attendance-time-table.component';
import { ITIStudentAttendanceComponent } from './iti-student-attendance/iti-student-attendance.component';
const routes: Routes = [
  {
  path: '', component: ITIAttendanceTimeTableComponent
  },
  {
    path: ':streamId/:semesterId/:subjectId/:ShiftID/:UnitID', component: ITIStudentAttendanceComponent
  }
];


@NgModule({
  declarations: [ITIAttendanceTimeTableComponent, ITIStudentAttendanceComponent],
  imports: [
    FormsModule, ReactiveFormsModule,
    CommonModule, MaterialModule, NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent,
    RouterModule.forChild(routes)
  ]
})
export class ITIAttendanceTimeTableModule { }
