import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIGovtEMEducationalQualificationComponent } from './ITI-Govt-EM-EducationalQualification.component';

const routes: Routes = [{ path: '', component: ITIGovtEMEducationalQualificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIGovtEMEducationalQualificationRoutingModule { }
