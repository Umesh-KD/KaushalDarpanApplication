import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnlockCalenderComponent } from './unlock-calender.component';

const routes: Routes = [{ path: '', component: UnlockCalenderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnlockCalenderRoutingModule { }
