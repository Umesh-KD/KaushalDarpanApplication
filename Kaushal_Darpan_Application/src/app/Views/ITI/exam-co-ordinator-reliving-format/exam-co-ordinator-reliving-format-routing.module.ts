import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamCoOrdinatorRelivingFormatComponent } from './exam-co-ordinator-reliving-format.component';

const routes: Routes = [{ path: '', component: ExamCoOrdinatorRelivingFormatComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamCoOrdinatorRelivingFormatRoutingModule { }
