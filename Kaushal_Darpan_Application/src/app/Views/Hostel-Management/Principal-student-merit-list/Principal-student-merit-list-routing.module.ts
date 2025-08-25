import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalstudentmeritlistComponent } from './Principal-student-merit-list.component';

const routes: Routes = [{ path: '', component: PrincipalstudentmeritlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalstudentmeritlistRoutingModule { }
