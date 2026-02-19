import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiAdminSubUserComponent } from './iti-Admin-Sub-User.component';  

const routes: Routes = [{ path: '', component: itiAdminSubUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiAdminSubUserRoutingModule { }
