import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyTimeTableComponent } from './verify-time-table.component';

const routes: Routes = [{ path: '', component: VerifyTimeTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyTimeTableRoutingModule { }
