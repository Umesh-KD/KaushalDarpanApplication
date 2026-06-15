import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../../../Shared/loader/loader.module';

import { ITI_CommanDashboardComponent } from './ITI_CommanDashboard.component';
import { ITI_CommanDashboardRoutingModule } from './ITI_CommanDashboard.routing.module';


@NgModule({
  declarations: [
    ITI_CommanDashboardComponent

  ],
  imports: [
    CommonModule,
    ITI_CommanDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ], exports: [ITI_CommanDashboardComponent]
})
export class ITI_CommanDashboardModule { }
