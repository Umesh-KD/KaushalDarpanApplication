import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../Shared/loader/loader.module';

import { JDTEDashboardComponent } from './jdte-dashboard.component';
import { JDTEDashboardRoutingModule } from './jdte-dashboard.routing.module';


@NgModule({
  declarations: [
    JDTEDashboardComponent

  ],
  imports: [
    CommonModule,
    JDTEDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ], exports: [JDTEDashboardComponent]
})
export class JDTEDashboardModule { }
