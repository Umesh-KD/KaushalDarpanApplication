import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableauExecutiveAnalyticsComponent } from './tableau-executive-analytics.component';

const routes: Routes = [{ path: '', component: TableauExecutiveAnalyticsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableauExecutiveAnalyticsRoutingModule { }
