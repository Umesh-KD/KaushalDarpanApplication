import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffTrainingConsentComponent } from './staff-training-consent.component';

const routes: Routes = [{ path: '', component: StaffTrainingConsentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffTrainingConsentRoutingModule { }
