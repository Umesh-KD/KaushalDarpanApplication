import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticalExaminerUndertakingComponent } from './practical-examiner-undertaking.component';

const routes: Routes = [{ path: '', component: PracticalExaminerUndertakingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticalExaminerUndertakingRoutingModule { }
