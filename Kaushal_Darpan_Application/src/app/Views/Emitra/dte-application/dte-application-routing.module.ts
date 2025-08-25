import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DTEApplicationComponent } from './dte-application.component';

const routes: Routes = [{ path: '', component: DTEApplicationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DTEApplicationRoutingModule { }
