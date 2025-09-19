import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IIPEventsComponent } from './iip-events.component';

const routes: Routes = [{ path: '', component: IIPEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IIPEventsRoutingModule { }
