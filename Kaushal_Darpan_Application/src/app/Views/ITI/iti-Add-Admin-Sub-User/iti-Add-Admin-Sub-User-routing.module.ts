import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiAddAdminSubUserComponent } from './iti-Add-Admin-Sub-User.component';  

const routes: Routes = [{ path: '', component: itiAddAdminSubUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiAddAdminSubUserRoutingModule { }
