import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterEmDepartmentWiseRequestlistComponent } from './Bter-Em-DepartmentWiseRequest-list.component';


const routes: Routes = [{ path: '', component: BterEmDepartmentWiseRequestlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterEmDepartmentWiseRequestlistRoutingModule { }
