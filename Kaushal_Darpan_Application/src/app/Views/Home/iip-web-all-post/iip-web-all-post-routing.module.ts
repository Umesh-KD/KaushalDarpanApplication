import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IIPWebAllPostComponent } from './iip-web-all-post.component';

const routes: Routes = [{ path: '', component: IIPWebAllPostComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IIPWebAllPostRoutingModule { }
