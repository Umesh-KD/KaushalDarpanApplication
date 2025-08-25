import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PushedDataComponent } from './pushed-data.component';

const routes: Routes = [{ path: '', component:PushedDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushedDataRoutingModule { }
