import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyRollListComponent } from './iti-roll-list.component';

const routes: Routes = [{ path: '', component: VerifyRollListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyRollListRoutingModule { }
