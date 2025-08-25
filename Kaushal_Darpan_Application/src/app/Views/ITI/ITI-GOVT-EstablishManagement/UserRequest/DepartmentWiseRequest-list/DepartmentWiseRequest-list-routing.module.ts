import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentWiseRequestlistComponent } from './DepartmentWiseRequest-list.component';


const routes: Routes = [{ path: '', component: DepartmentWiseRequestlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentWiseRequestlistRoutingModule { }
