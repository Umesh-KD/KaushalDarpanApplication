import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeVacancyListComponent } from './office-vacancy-list.component';

const routes: Routes = [{ path: '', component: OfficeVacancyListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeVacancyListRoutingModule { }
