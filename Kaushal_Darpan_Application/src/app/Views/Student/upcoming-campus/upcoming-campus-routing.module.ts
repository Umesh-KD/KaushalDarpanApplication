import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpcomingCampusComponent } from './upcoming-campus.component';

const routes: Routes = [{ path: '', component: UpcomingCampusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpcomingCampusRoutingModule { }
