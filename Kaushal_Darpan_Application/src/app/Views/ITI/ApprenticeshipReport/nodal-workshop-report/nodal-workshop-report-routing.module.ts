import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodalWorkshopReportComponent } from './nodal-workshop-report.component';

const routes: Routes = [{ path: '', component: NodalWorkshopReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NodalWorkshopReportRoutingModule { }
