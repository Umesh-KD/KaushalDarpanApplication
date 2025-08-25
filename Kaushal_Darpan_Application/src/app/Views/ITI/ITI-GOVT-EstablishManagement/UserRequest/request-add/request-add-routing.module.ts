import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestUserAddComponent } from './request-add.component';

const routes: Routes = [{ path: '', component: RequestUserAddComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestUserAddRoutingModule { }
