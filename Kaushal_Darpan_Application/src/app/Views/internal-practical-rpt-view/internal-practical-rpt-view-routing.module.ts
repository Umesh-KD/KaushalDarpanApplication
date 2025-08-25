import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalPracticalRptViewComponent } from './internal-practical-rpt-view.component';

const routes: Routes = [{ path: '', component: InternalPracticalRptViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalPracticalRptViewRoutingModule { }
