import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiFormsTableComponent } from './iti-forms-table.component';

const routes: Routes = [{ path: '', component: ItiFormsTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiFormsTableRoutingModule { }
