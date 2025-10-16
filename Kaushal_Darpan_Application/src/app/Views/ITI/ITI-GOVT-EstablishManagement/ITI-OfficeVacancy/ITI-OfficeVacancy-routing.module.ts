import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIOfficeVacancyComponent } from './ITI-OfficeVacancy.component';

const routes: Routes = [{ path: '', component: ITIOfficeVacancyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIOfficeVacancyRoutingModule { }
