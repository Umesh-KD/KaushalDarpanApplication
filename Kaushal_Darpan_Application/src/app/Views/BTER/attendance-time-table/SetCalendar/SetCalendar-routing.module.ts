import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetCalendarComponent } from './SetCalendar.component';

const routes: Routes = [{ path: '', component: SetCalendarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetCalendarRoutingModule { }
