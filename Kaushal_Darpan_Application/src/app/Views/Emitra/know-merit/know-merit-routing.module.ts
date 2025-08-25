import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowMeritComponent } from './know-merit.component';

const routes: Routes = [{ path: '', component: KnowMeritComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowMeritRoutingModule { }
