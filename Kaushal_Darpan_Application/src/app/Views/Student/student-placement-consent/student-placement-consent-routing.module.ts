import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentPlacementConsentComponent } from './student-placement-consent.component';

const routes: Routes = [{ path: '', component: StudentPlacementConsentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentPlacementConsentRoutingModule { }
