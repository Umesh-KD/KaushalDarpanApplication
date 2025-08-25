import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IIPListComponent } from './iip-list.component';

const routes: Routes = [{ path: '', component: IIPListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IIPListRoutingModule { }
