import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPaperSetterProfessorDashboardComponent } from './itipaper-setter-professor-dashboard.component';

const routes: Routes = [{ path: '', component: ITIPaperSetterProfessorDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPaperSetterProfessorDashboardRoutingModule { }
