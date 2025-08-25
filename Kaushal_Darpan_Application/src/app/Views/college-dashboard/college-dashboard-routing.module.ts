import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeDashboardComponent } from './college-dashboard.component';

const routes: Routes = [{ path: '', component: CollegeDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollegeDashboardRoutingModule { }
