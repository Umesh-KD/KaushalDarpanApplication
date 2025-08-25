import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelReportsComponent } from './hostel-reports.component';

const routes: Routes = [{ path: '', component: HostelReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostelReportsRoutingModule { }
