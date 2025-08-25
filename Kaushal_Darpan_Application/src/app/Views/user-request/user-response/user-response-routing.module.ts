import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserResponseComponent } from './user-response.component';

const routes: Routes = [{ path: '', component: UserResponseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserResponseRoutingModule { }
