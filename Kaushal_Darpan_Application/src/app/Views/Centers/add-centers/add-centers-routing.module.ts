import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCentersComponent } from './add-centers.component';

const routes: Routes = [{ path: '', component: AddCentersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCentersRoutingModule { }
