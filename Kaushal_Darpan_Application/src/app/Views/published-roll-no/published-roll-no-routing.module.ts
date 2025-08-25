import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishedRollNoComponent } from './published-roll-no.component';

const routes: Routes = [{ path: '', component: PublishedRollNoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishedRollNoRoutingModule { }
