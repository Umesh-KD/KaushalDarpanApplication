import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JanAadharDetailComponent } from './new-jan-aadhar.component';





const routes: Routes = [{ path: '', component: JanAadharDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JanAadharDetailRoutingModule { }
