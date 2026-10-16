import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableauResultAnalyticsComponent } from './tableau-result-analytics.component';

const routes: Routes = [{ path: '', component: TableauResultAnalyticsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableauResultAnalyticsRoutingModule { }
