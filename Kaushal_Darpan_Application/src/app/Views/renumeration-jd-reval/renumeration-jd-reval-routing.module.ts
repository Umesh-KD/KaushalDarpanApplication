import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenumerationJdRevalComponent } from './renumeration-jd-reval.component';

const routes: Routes = [{ path: '', component: RenumerationJdRevalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenumerationJdRevalRoutingModule { }
