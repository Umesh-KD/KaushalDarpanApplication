import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateEnrollmentITIComponent } from './generate-enrollment-iti.component';

const routes: Routes = [{ path: '', component: GenerateEnrollmentITIComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateEnrollmentITIRoutingModule { }
