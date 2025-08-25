import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DTEDashboardRoutingModule } from './dte-dashboard-routing.module';
import { DTEDashboardComponent } from './dte-dashboard.component';
import { LoaderModule } from '../Shared/loader/loader.module';


@NgModule({
  declarations: [DTEDashboardComponent],
  imports: [
    CommonModule,
    DTEDashboardRoutingModule,
    LoaderModule
  ],
  exports: [DTEDashboardComponent]
})
export class DTEDashboardModule { }
