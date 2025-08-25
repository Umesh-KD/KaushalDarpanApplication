import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentComponent } from './allotment.component';
const routes: Routes = [{ path: '', component: AllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentRoutingModule { }
