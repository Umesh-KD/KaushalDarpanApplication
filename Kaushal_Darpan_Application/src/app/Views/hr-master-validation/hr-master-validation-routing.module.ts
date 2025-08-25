import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrMasterValidationComponent } from './hr-master-validation.component';

const routes: Routes = [{ path: '', component: HrMasterValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrMasterValidationRoutingModule { }
