import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IMCManagementAllotmentVerifyComponent } from './imc-management-allotment-verify.component';

const routes: Routes = [{ path: '', component: IMCManagementAllotmentVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IMCManagementAllotmentVerifyRoutingModule { }
