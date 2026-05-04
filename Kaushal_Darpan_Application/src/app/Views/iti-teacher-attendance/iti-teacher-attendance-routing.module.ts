import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiTeacherAttendanceComponent } from './iti-teacher-attendance.component';

const routes: Routes = [{ path: '', component: ItiTeacherAttendanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiTeacherAttendanceRoutingModule { }
