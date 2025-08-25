import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheoryMarksRptViewComponent } from './theory-marks-rpt-view.component';

const routes: Routes = [{ path: '', component: TheoryMarksRptViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheoryMarksRptViewRoutingModule { }
