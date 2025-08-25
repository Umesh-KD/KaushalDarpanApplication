import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { GenerateRollComponent } from './generate-roll.component';

const routes: Routes = [{ path: '', component: GenerateRollComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateRollRoutingModule { }
