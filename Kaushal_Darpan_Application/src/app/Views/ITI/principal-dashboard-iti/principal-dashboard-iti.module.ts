import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {  PrincipalDashboardITIRoutingModule } from './principal-dashboard-iti-routing.module';
import { PrincipalDashboardITIComponent } from './principal-dashboard-iti.component';
import { ItiFormsTableModule } from '../DashboardComponent/iti-forms-table/iti-forms-table.module';
import { ItiFormsPriorityListModule } from '../DashboardComponent/iti-forms-priority-list/iti-forms-priority-list.module';


@NgModule({
  declarations: [
    PrincipalDashboardITIComponent
  ],
  imports: [
    CommonModule,
    PrincipalDashboardITIRoutingModule,
    ItiFormsTableModule,
    ItiFormsPriorityListModule
  ],
  exports: [PrincipalDashboardITIComponent]
})
export class PrincipalDashboardITIModule { }
