import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PushDataComponent } from './push-data.component';

const routes: Routes = [{ path: '', component: PushDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushDataRoutingModule { }
