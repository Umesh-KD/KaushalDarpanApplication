import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotStatusComponent } from './allot-status.component';

const routes: Routes = [{ path: '', component: AllotStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotStatusRoutingModule { }
