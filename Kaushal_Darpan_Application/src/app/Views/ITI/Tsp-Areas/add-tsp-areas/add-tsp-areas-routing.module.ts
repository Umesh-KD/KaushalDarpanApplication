import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTspAreasComponent } from './add-tsp-areas.component';

const routes: Routes = [{ path: '', component: AddTspAreasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTspAreasRoutingModule { }
