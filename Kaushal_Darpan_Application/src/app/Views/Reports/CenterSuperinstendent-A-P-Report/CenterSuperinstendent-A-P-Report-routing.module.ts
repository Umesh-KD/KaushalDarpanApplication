import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CenterSuperinstendentAPReportComponent } from './CenterSuperinstendent-A-P-Report.component';

const routes: Routes = [{ path: '', component: CenterSuperinstendentAPReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CenterSuperinstendentAPReportRoutingModule { }

