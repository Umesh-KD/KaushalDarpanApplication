import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenumerationExaminerComponent } from './renumeration-examiner.component';

const routes: Routes = [{ path: '', component: RenumerationExaminerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenumerationExaminerRoutingModule { }
