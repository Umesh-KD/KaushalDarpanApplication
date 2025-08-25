import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LateralEntryComponent } from './lateral-entry.component';

const routes: Routes = [{ path: '', component: LateralEntryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LateralEntryRoutingModule { }
