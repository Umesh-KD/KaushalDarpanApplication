import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderModule } from '../../../Shared/loader/loader.module';

import { TransferRelievingDashboardComponent } from './TransferRelievingDashboard.component';
import { TransferRelievingDashboardRoutingModule } from './TransferRelievingDashboard.routing.module';


@NgModule({
  declarations: [
    TransferRelievingDashboardComponent

  ],
  imports: [
    CommonModule,
    TransferRelievingDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ], exports: [TransferRelievingDashboardComponent]
})
export class TransferRelievingDashboardModule { }
