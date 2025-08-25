import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowMeritITIComponent } from './know-merit-iti.component';

const routes: Routes = [{ path: '', component: KnowMeritITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowMeritITIRoutingModule { }
