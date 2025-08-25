import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSCAMarkingComponent } from './admin-sca-marking.component';

const routes: Routes = [{ path: '', component: AdminSCAMarkingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSCAMarkingRoutingModule { }
