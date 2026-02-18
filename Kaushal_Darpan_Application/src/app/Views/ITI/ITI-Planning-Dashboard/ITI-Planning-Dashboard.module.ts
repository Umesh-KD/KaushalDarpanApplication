import { NgModule } from '@angular/core';


import { ITIPlanningDashboardRoutingModule } from './ITI-Planning-Dashboard-routing.module';
import { ITIPlanningDashboardComponent } from './ITI-Planning-Dashboard.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    ITIPlanningDashboardComponent
  ],
  imports: [
    CommonModule,
    ITIPlanningDashboardRoutingModule
    
  ],
  exports: [ITIPlanningDashboardComponent]
})

export class ITIPlanningDashboardModule { }


