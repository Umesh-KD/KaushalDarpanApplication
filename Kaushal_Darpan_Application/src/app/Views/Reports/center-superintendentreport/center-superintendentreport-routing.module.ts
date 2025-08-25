import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterSuperintendentreportComponent } from './center-superintendentreport.component';

const routes: Routes = [{ path: '', component: CenterSuperintendentreportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterSuperintendentreportRoutingModule { }
