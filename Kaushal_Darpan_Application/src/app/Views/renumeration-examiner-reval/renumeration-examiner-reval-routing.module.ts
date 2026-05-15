import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenumerationExaminerRevalComponent } from './renumeration-examiner-reval.component';

const routes: Routes = [{ path: '', component: RenumerationExaminerRevalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenumerationExaminerRevalRoutingModule { }
