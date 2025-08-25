import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsJoiningStatusMarksComponent } from './students-joining-status-marks.component';

const routes: Routes = [{ path: '', component: StudentsJoiningStatusMarksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsJoiningStatusMarksRoutingModule { }
