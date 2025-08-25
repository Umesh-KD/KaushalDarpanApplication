import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentJoinStatusComponent } from './student-join-status.component';

const routes: Routes = [{ path: '', component: StudentJoinStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentJoinStatusRoutingModule { }
