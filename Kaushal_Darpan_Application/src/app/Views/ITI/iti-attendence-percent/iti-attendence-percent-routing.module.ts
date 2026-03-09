import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiAttendencePercentComponent } from './iti-attendence-percent.component';

const routes: Routes = [{ path: '', component: ItiAttendencePercentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiAttendencePercentRoutingModule { }
