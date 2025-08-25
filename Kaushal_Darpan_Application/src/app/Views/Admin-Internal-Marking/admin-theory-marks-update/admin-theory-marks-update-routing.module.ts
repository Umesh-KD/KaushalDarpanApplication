import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTheoryMarksUpdateComponent } from './admin-theory-marks-update.component';

const routes: Routes = [{ path: '', component: AdminTheoryMarksUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTheoryMarksUpdateRoutingModule { }
