import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from './InstructorDashboardComponent';

const routes: Routes = [{ path: '', component: InstructorDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorDashboardRoutingModule { }
