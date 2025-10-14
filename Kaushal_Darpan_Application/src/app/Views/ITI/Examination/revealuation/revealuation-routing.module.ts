import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevealuationComponent } from './revealuation.component';

const routes: Routes = [{ path: '', component: RevealuationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevealuationRoutingModule { }
