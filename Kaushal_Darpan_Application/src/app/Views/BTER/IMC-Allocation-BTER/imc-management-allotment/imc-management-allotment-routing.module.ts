import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IMCManagementAllotmentComponent } from './imc-management-allotment.component';

const routes: Routes = [{ path: '', component: IMCManagementAllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IMCManagementAllotmentRoutingModule { }
