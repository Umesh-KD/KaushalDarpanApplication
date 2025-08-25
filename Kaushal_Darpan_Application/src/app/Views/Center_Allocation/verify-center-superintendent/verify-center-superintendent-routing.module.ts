import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyCenterSuperintendentComponent } from './verify-center-superintendent.component';

const routes: Routes = [{ path: '', component: VerifyCenterSuperintendentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyCenterSuperintendentRoutingModule { }
