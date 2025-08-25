import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestRoomReportComponent } from './guest-room-report.component';

const routes: Routes = [{ path: '', component: GuestRoomReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoomReportRoutingModule { }
