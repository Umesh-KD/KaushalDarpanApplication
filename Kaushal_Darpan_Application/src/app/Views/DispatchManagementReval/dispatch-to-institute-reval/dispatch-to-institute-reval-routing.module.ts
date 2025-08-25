import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchToInstituteRevalComponent } from './dispatch-to-institute-reval.component';

const routes: Routes = [{ path: '', component: DispatchToInstituteRevalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchToInstituteRevalRoutingModule { }
