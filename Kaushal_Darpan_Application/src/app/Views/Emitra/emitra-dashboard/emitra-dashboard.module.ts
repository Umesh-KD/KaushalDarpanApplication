import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitraDashboardRoutingModule } from './emitra-dashboard-routing.module';
import { EmitraDashboardComponent } from './emitra-dashboard.component';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { AllotStatusComponent } from '../allotment-status/allot-status.component';

@NgModule({
  declarations: [
    EmitraDashboardComponent,
    //AllotStatusComponent
  ],
  imports: [
    CommonModule,
    EmitraDashboardRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [EmitraDashboardComponent]
    //AllotStatusComponent]
})
export class EmitraDashboardModule { }
