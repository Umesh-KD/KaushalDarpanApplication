import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterUnlockCalenderComponent } from './bter-unlock-calender.component';

const routes: Routes = [{ path: '', component: BterUnlockCalenderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterUnlockCalenderRoutingModule { }
