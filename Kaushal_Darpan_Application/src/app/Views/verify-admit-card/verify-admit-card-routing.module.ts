import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyAdmitCardComponent } from './verify-admit-card.component';

const routes: Routes = [{ path: '', component: VerifyAdmitCardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyAdmitCardRoutingModule { }
