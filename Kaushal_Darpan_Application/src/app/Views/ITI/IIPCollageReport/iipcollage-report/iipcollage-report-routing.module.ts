import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IIPCollageReportComponent } from './iipcollage-report.component';

const routes: Routes = [{ path: '', component: IIPCollageReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IIPCollageReportRoutingModule { }
