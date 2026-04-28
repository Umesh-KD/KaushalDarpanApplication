import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { emtrainingdetailshistoryComponent } from './em-training-details-history.component';

const routes: Routes = [{ path: '', component: emtrainingdetailshistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class emtrainingdetailshistoryRoutingModule { }
