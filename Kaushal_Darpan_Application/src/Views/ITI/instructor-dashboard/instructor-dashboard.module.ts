import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorDashboardRoutingModule } from './instructor-dashboard-routing.module';
import { InstructorDashboardComponent } from './InstructorDashboardComponent';


@NgModule({
  declarations: [
    InstructorDashboardComponent
  ],
  imports: [
    CommonModule,
    InstructorDashboardRoutingModule
  ],
  exports: [InstructorDashboardComponent]
})
export class InstructorDashboardModule { }
