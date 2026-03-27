import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { bterRevalReportComponent } from './bter-Reval-Report.component';  

const routes: Routes = [{ path: '', component: bterRevalReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class bterRevalReportRoutingModule { }
