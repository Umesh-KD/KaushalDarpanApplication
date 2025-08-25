import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../Shared/loader/loader.module';
import { CollegeDashboardRoutingModule } from './college-dashboard-routing.module';
import { CollegeDashboardComponent } from './college-dashboard.component';


@NgModule({
  declarations: [CollegeDashboardComponent],
  imports: [
    CommonModule,
    CollegeDashboardRoutingModule,
    LoaderModule
  ],
  exports: [CollegeDashboardComponent]
})
export class CollegeDashboardModule { }
