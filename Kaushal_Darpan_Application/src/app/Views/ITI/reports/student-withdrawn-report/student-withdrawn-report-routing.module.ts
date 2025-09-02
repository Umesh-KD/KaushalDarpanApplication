import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { studentwithdrawnreportComponent } from './student-withdrawn-report.component';

const routes: Routes = [{ path: '', component: studentwithdrawnreportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class studentwithdrawnreportRoutingModule { }
