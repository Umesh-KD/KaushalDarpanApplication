import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterConfigurationComponent } from './master-configuration.component';

const routes: Routes = [{ path: '', component: MasterConfigurationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterConfigurationRoutingModule { }
