import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowRevealuationITIComponent } from './know-revealuation-iti.component';

const routes: Routes = [{ path: '', component: KnowRevealuationITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowRevealuationITIRoutingModule { }
