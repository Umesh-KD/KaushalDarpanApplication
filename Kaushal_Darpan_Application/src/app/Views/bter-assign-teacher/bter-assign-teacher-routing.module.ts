import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterAssignTeacherComponent } from './bter-assign-teacher.component';

const routes: Routes = [{ path: '', component: BterAssignTeacherComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterAssignTeacherRoutingModule { }
