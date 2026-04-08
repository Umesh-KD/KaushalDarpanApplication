import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDTEOfficeVacancyComponent } from './add-dte-office-vacancy.component';

const routes: Routes = [{ path: '', component: AddDTEOfficeVacancyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDTEOfficeVacancyRoutingModule { }
