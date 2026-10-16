import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauResultAnalyticsComponent } from './tableau-result-analytics.component';
import { TableauResultAnalyticsRoutingModule } from './tableau-result-analytics-routing.module';


@NgModule({
  declarations: [
    TableauResultAnalyticsComponent
  ],
  imports: [
    CommonModule,
    TableauResultAnalyticsRoutingModule
  ]
})
export class TableauResultAnalyticsModule { }
