import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterSuperintendentStudentComponent } from './center-superintendent-student.component';

const routes: Routes = [{ path: '', component: CenterSuperintendentStudentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterSuperintendentStudentRoutingModule { }
