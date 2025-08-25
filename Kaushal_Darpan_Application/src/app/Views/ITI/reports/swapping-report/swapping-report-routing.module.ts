import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwappingReportComponent } from './swapping-report.component';

const routes: Routes = [{ path: '', component: SwappingReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwappingReportRoutingModule { }
