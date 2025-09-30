import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffWorkRegularArrangementReortComponent } from './StaffWorkRegularArrangementReort.component';

const routes: Routes = [{ path: '', component: StaffWorkRegularArrangementReortComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffWorkRegularArrangementReortRoutingModule { }
