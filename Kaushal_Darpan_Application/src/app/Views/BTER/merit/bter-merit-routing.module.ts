import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterMeritComponent } from './bter-merit.component';

const routes: Routes = [{ path: '', component: BterMeritComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterMeritRoutingModule { }
