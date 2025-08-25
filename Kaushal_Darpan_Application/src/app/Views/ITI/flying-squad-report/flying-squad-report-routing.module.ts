import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlyingSquadReportComponent } from './flying-squad-report.component';

const routes: Routes = [{ path: '', component: FlyingSquadReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlyingSquadReportRoutingModule { }
