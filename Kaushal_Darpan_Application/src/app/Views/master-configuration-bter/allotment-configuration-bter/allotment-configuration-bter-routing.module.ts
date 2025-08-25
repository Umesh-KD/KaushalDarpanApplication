import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllotmentConfigurationBTERComponent } from './allotment-configuration-bter.component';

const routes: Routes = [{ path: '', component: AllotmentConfigurationBTERComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllotmentConfigurationBTERRoutingModule { }
