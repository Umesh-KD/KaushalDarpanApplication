import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiCompanyValidationComponent } from './iticompany-validation.component';

const routes: Routes = [{ path: '', component: ItiCompanyValidationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiCompanyValidationRoutingModule { }
