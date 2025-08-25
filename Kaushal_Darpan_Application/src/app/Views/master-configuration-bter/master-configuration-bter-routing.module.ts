import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterConfigurationBTERComponent } from './master-configuration-bter.component';

const routes: Routes = [{ path: '', component: MasterConfigurationBTERComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterConfigurationBTERRoutingModule { }
