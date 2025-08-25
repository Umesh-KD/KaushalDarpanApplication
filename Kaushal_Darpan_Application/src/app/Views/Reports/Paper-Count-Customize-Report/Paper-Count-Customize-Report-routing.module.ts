import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperCountCustomizeReportComponent } from './Paper-Count-Customize-Report.component';

const routes: Routes = [{ path: '', component: PaperCountCustomizeReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperCountCustomizeReportRoutingModule { }
