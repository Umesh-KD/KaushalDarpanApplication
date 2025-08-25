import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPostlistComponent } from './all-postlist.component';

const routes: Routes = [{ path: '', component: AllPostlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllPostlistRoutingModule { }
