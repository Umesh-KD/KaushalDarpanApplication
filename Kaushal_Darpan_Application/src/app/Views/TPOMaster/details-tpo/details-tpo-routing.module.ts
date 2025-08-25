import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsTpoComponent } from './details-tpo.component';

const routes: Routes = [
  { path: '', component: DetailsTpoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsTpoRoutingModule { }
