import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentRequestListComponent } from './student-request-list.component';

const routes: Routes = [{ path: '', component: StudentRequestListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRequestListRoutingModule { }
