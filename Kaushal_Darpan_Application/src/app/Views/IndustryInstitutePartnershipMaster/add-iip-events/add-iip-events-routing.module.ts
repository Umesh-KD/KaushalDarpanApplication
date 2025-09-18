import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIIPEventsComponent } from './add-iip-events.component';

const routes: Routes = [{ path: '', component: AddIIPEventsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddIIPEventsRoutingModule { }
