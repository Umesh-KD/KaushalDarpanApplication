import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTEPublicInfoComponent } from './dte-public-info.component';

const routes: Routes = [{ path: '', component: DTEPublicInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DTEPublicInfoRoutingModule { }
