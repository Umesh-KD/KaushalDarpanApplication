import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EM_TrainingDetailsListComponent } from './EM_TrainingDetailsList.component';

const routes: Routes = [{ path: '', component: EM_TrainingDetailsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EM_TrainingDetailsListRoutingModule { }
