import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherHigherEducationApplicationComponent } from './teacher-higher-education-application.component';

const routes: Routes = [{ path: '', component: TeacherHigherEducationApplicationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherHigherEducationApplicationRoutingModule { }
