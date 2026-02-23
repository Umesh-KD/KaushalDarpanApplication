import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorStatusListComponent } from './instructor-status-list.component';

const routes: Routes = [{ path: '', component: InstructorStatusListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorStatusListRoutingModule { }
