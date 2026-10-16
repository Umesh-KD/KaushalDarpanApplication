import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauExecutiveAnalyticsComponent } from './tableau-executive-analytics.component';
import { TableauExecutiveAnalyticsRoutingModule } from './tableau-executive-analytics-routing.module';


@NgModule({
  declarations: [
    TableauExecutiveAnalyticsComponent
  ],
  imports: [
    CommonModule,
    TableauExecutiveAnalyticsRoutingModule
  ]
})
export class TableauExecutiveAnalyticsModule { }
