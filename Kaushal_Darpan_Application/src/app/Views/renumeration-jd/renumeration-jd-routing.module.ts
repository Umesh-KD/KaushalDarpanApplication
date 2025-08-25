import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenumerationJdComponent } from './renumeration-jd.component';

const routes: Routes = [{ path: '', component: RenumerationJdComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenumerationJdRoutingModule { }
