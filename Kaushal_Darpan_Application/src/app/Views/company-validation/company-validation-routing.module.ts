import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyValidationComponent } from './company-validation.component';

const routes: Routes = [{ path: '', component: CompanyValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyValidationRoutingModule { }
