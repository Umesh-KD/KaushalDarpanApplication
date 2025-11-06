import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIStaffWorkRegularArrangementReortComponent } from './ITI-StaffWorkRegularArrangementReort.component';

const routes: Routes = [{ path: '', component: ITIStaffWorkRegularArrangementReortComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIStaffWorkRegularArrangementReortRoutingModule { }
