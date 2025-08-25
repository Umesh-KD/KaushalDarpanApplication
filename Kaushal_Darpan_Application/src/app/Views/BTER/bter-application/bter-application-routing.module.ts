import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BTERApplicationComponent } from './bter-application.component';

const routes: Routes = [{ path: '', component: BTERApplicationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BTERApplicationRoutingModule { }
