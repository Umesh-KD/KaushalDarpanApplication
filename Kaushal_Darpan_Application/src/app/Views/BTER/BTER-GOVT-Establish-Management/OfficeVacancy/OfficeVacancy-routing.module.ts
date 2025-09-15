import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeVacancyComponent } from './OfficeVacancy.component';

const routes: Routes = [{ path: '', component: OfficeVacancyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeVacancyRoutingModule { }
