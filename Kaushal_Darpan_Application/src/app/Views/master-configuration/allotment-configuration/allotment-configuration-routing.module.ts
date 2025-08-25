import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentConfigurationComponent } from './allotment-configuration.component';

const routes: Routes = [{ path: '', component: AllotmentConfigurationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentConfigurationRoutingModule { }
