import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIAllotmentComponent } from './itiallotment.component';
const routes: Routes = [{ path: '', component: ITIAllotmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIAllotmentRoutingModule { }
