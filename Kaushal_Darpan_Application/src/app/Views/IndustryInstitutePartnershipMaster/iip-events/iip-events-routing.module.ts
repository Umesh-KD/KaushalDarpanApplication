import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { iipeventsComponent } from './iip-events.component';

const routes: Routes = [{ path: '', component: iipeventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IIPEventsRoutingModule { }
