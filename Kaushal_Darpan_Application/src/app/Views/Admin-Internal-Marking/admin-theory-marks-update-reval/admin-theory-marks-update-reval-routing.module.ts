import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTheoryMarksUpdateRevalComponent } from './admin-theory-marks-update-reval.component';

const routes: Routes = [{ path: '', component: AdminTheoryMarksUpdateRevalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTheoryMarksUpdateRevalRoutingModule { }
