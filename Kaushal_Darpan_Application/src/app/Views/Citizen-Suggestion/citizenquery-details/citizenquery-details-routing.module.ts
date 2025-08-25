import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitizenqueryDetailsComponent } from './citizenquery-details.component';

const routes: Routes = [{ path: '', component: CitizenqueryDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class citizenquerydetailsRoutingModule { }
