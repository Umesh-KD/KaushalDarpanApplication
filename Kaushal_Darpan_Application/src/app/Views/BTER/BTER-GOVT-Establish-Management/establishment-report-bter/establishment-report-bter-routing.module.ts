import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstablishmentReportBTERComponent } from './establishment-report-bter.component';

const routes: Routes = [{ path: '', component: EstablishmentReportBTERComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentReportBTERRoutingModule { }
