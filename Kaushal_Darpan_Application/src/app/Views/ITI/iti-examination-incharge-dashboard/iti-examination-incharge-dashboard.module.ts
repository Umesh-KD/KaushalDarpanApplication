import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItiExaminationInchargeDashboardRoutingModule } from './iti-examination-incharge-dashboard-routing.module';
import { ItiExaminationInchargeDashboardComponent } from './iti-examination-incharge-dashboard.component';
import { ItiFormsTableModule } from '../DashboardComponent/iti-forms-table/iti-forms-table.module';
import { ItiFormsPriorityListModule } from '../DashboardComponent/iti-forms-priority-list/iti-forms-priority-list.module';


@NgModule({
  declarations: [ItiExaminationInchargeDashboardComponent],
  imports: [
    CommonModule,
    ItiExaminationInchargeDashboardRoutingModule,
    ItiFormsTableModule,
    ItiFormsPriorityListModule
  ],
  exports:[ItiExaminationInchargeDashboardComponent]
})
export class ItiExaminationInchargeDashboardModule { }
