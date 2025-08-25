import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmitraApplicationStatusComponent } from './emitra-application-status.component';

const routes: Routes = [{ path: '', component: EmitraApplicationStatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmitraApplicationStatusRoutingModule { }
