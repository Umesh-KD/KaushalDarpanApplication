import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EMAddTrainingDetailsComponent } from './em-add-training-details.component';

const routes: Routes = [{ path: '', component: EMAddTrainingDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EMAddTrainingDetailsRoutingModule { }
