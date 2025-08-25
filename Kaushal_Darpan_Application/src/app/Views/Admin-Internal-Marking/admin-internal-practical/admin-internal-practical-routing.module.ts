import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInternalPracticalComponent } from './admin-internal-practical.component';

const routes: Routes = [{ path: '', component: AdminInternalPracticalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInternalPracticalRoutingModule { }
