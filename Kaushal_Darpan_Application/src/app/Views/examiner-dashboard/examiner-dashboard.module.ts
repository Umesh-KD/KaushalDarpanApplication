import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminerDashboardRoutingModule } from './examiner-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { ExaminerDashboardComponent } from './examiner-dashboard.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    ExaminerDashboardRoutingModule
  ]
})
export class ExaminerDashboardModule { }
