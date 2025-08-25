import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeDashboardITIRoutingModule } from './college-dashboard-iti-routing.module';
import { CollegeDashboardITIComponent } from './college-dashboard-iti.component';



@NgModule({
  declarations: [
    CollegeDashboardITIComponent
  ],
  imports: [
    CommonModule,
    CollegeDashboardITIRoutingModule
    
  ],
  exports: [CollegeDashboardITIComponent]
})

export class CollegeDashboardITIModule { }


