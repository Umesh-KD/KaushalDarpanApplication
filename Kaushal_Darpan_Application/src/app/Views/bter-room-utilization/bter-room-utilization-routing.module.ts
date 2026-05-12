import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BterRoomUtilizationComponent } from './bter-room-utilization.component';

const routes: Routes = [{ path: '', component: BterRoomUtilizationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BterRoomUtilizationRoutingModule { }
