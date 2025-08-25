import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNodalComponent } from './add-nodal.component';





const routes: Routes = [{ path: '', component: AddNodalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddNodalRoutingModule { }
