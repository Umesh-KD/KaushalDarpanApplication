import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveValidationComponent } from './leave-validation.component';

const routes: Routes = [{ path: '', component: LeaveValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveValidationRoutingModule { }
