import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScholarshipOnboardComponent } from './scholarship-onboard.component';

const routes: Routes = [{ path: '', component: ScholarshipOnboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScholarshipOnboardRoutingModule { }
