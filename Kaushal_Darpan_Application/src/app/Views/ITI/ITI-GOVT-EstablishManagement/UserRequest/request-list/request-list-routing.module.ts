import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRequestListComponent } from './request-list.component';


const routes: Routes = [{ path: '', component: UserRequestListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRequestListRoutingModule { }
