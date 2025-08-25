import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishedEnrollNoComponent } from './published-enroll-no.component';

const routes: Routes = [{ path: '', component: PublishedEnrollNoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishedEnrollNoRoutingModule { }
