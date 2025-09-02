import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { studentwithdrawnlistComponent } from './student-withdrawn-list.component';

const routes: Routes = [{ path: '', component: studentwithdrawnlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class studentwithdrawnlistRoutingModule { }
