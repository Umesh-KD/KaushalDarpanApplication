import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentLoginComponent } from './department-login.component';

const routes: Routes = [{ path: '', component: DepartmentLoginComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentLoginRoutingModule { }
