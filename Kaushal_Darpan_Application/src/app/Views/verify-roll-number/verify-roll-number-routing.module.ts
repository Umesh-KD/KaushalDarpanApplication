import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyRollNumberComponent } from './verify-roll-number.component';

const routes: Routes = [{ path: '', component: VerifyRollNumberComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyRollNumberRoutingModule { }
