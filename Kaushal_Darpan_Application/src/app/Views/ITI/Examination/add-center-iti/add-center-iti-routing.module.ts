import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCenterITIComponent } from './add-center-iti.component';

const routes: Routes = [{ path: '', component: AddCenterITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCenterITIRoutingModule { }
