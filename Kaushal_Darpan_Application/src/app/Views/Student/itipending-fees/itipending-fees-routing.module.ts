import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPendingFeesComponent } from './itipending-fees.component';

const routes: Routes = [{ path: '', component: ITIPendingFeesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPendingFeesRoutingModule { }
