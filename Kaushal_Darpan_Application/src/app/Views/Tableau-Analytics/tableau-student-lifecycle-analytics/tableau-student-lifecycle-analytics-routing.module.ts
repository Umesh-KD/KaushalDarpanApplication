import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableauStudentLifecycleAnalyticsComponent } from './tableau-student-lifecycle-analytics.component';

const routes: Routes = [{ path: '', component: TableauStudentLifecycleAnalyticsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableauStudentLifecycleAnalyticsRoutingModule { }
