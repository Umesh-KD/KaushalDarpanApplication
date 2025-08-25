import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIPaperSetterProfessorDashboardRoutingModule } from './itipaper-setter-professor-dashboard-routing.module';
import { ITIPaperSetterProfessorDashboardComponent } from './itipaper-setter-professor-dashboard.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '', component: ITIPaperSetterProfessorDashboardComponent }];

@NgModule({
  declarations: [
    ITIPaperSetterProfessorDashboardComponent
  ],
  imports: [
    CommonModule,
    ITIPaperSetterProfessorDashboardRoutingModule ,
    RouterModule.forChild(routes)
  ],
  exports: [ITIPaperSetterProfessorDashboardComponent]
})
export class ITIPaperSetterProfessorDashboardModule { }
