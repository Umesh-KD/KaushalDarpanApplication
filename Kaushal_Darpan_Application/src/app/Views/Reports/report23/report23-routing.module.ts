import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Report23Component } from './report23.component';

const routes: Routes = [{ path: '', component: Report23Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Report23RoutingModule { }
