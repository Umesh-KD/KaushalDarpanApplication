import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelWardenStudentMeritlistComponent } from './Hostel-Warden-Student-Merit-list.component';

const routes: Routes = [{ path: '', component: HostelWardenStudentMeritlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostelWardenStudentMeritlistRoutingModule { }
