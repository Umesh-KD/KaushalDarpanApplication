import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentCenterActivityComponent } from './student-center-activity.component';

const routes: Routes = [{ path: '', component: StudentCenterActivityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentCenterActivityRoutingModule { }
