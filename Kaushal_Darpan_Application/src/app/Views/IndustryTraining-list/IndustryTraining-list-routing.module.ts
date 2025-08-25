import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustryTrainingListComponent } from './IndustryTraining-list.component';

const routes: Routes = [{ path: '', component: IndustryTrainingListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryTrainingListRoutingModule { }
