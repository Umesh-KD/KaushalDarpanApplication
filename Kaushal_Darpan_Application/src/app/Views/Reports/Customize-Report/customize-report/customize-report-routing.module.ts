import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomizeReportComponent } from './customize-report.component';

const routes: Routes = [{ path: '', component: CustomizeReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomizeReportRoutingModule { }
