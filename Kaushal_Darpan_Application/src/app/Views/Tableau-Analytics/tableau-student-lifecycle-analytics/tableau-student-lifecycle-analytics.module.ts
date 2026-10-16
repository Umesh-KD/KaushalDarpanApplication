import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauStudentLifecycleAnalyticsComponent } from './tableau-student-lifecycle-analytics.component';
import { TableauStudentLifecycleAnalyticsRoutingModule } from './tableau-student-lifecycle-analytics-routing.module';


@NgModule({
  declarations: [
    TableauStudentLifecycleAnalyticsComponent
  ],
  imports: [
    CommonModule,
    TableauStudentLifecycleAnalyticsRoutingModule
  ]
})
export class TableauStudentLifecycleAnalyticsModule { }
