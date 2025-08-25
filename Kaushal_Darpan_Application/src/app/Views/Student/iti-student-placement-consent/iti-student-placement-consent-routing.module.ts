import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIStudentPlacementConsentComponent } from './iti-student-placement-consent.component';

const routes: Routes = [{ path: '', component: ITIStudentPlacementConsentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIStudentPlacementConsentRoutingModule { }
