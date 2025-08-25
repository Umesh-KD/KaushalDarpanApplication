
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GenerateRevalRollNumberComponent } from './generate-reval-roll-number.component';

const routes: Routes = [{ path: '', component: GenerateRevalRollNumberComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateRevalRollNumberRoutingModule { }