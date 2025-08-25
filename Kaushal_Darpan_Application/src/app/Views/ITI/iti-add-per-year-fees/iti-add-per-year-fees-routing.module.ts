import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiAddPerYearFeesComponent } from './iti-add-per-year-fees.component';

const routes: Routes = [{ path: '', component: ItiAddPerYearFeesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiAddPerYearFeesRoutingModule { }
