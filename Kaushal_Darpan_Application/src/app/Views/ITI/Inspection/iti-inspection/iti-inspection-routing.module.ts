import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIInspectionComponent } from './iti-inspection.component';

const routes: Routes = [{ path: '', component: ITIInspectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIInspectionRoutingModule { }
