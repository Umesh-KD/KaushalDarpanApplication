import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvigilatorExamListComponent } from './invigilator-exam-list.component';

const routes: Routes = [{ path: '', component: InvigilatorExamListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvigilatorExamListRoutingModule { }
