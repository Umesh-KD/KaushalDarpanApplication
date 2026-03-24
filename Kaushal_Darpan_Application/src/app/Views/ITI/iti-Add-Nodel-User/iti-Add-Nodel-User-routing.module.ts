import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itiAddNodelUserComponent } from './iti-Add-Nodel-User.component';  

const routes: Routes = [{ path: '', component: itiAddNodelUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class itiAddNodelUserRoutingModule { }
