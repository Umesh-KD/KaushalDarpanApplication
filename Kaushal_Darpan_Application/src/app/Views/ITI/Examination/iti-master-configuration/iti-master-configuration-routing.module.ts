import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIMasterConfigurationComponent } from './iti-master-configuration.component';


const routes: Routes = [{ path: '', component: ITIMasterConfigurationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIMasterConfigurationRoutingModule { }
