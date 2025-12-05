import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentEmployementHistoryComponent } from './employement-history.component';





const routes: Routes = [{ path: '', component: StudentEmployementHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentEmployementHistoryRoutingModule { }
