import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EMPrincipleStaffComponent } from './em-principle-staff.component';

const routes: Routes = [{ path: '', component: EMPrincipleStaffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EMPrincipleStaffRoutingModule { }
