import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportCounsellingVacanciesComponent } from './import-counselling-vacancies.component';

const routes: Routes = [{ path: '', component: ImportCounsellingVacanciesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportCounsellingVacanciesRoutingModule { }
