import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstablishmentReportITIComponent } from './establishment-report-iti.component';

const routes: Routes = [{ path: '', component: EstablishmentReportITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablishmentReportITIRoutingModule { }
