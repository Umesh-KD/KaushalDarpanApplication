import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetainedStudentsComponent } from './detained-students.component';

const routes: Routes = [{ path: '', component: DetainedStudentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetainedStudentsRoutingModule { }
