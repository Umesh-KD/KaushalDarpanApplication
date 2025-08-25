import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddITIQuarterReportComponent } from './add-quater-repot.component';

const routes: Routes = [{ path: '', component: AddITIQuarterReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddITIQuarterReportRoutingModule { }
