import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ACPDashboardRoutingModule } from './acp-dashboard-routing.module';
import { ACPDashboardComponent } from './acp-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../../Shared/loader/loader.module';


@NgModule({
  declarations: [
    ACPDashboardComponent
  ],
  imports: [
    CommonModule,
    ACPDashboardRoutingModule
  ], exports: [ACPDashboardComponent]
})
export class ACPDashboardModule { }
