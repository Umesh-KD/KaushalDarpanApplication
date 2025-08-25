import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddInspectionComponent } from './add-inspection.component';

const routes: Routes = [{ path: '', component: AddInspectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddInspectionRoutingModule { }
