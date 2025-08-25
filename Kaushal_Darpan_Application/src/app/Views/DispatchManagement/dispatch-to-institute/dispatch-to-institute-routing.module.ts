import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchToInstituteComponent } from './dispatch-to-institute.component';

const routes: Routes = [{ path: '', component: DispatchToInstituteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchToInstituteRoutingModule { }
