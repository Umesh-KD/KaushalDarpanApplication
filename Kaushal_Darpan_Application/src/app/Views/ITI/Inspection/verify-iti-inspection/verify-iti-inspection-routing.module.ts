import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyITIInspectionComponent } from './verify-iti-inspection.component';

const routes: Routes = [{ path: '', component: VerifyITIInspectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyITIInspectionRoutingModule { }
