import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperSetProfessorComponent } from './paper-set-professor.component';

const routes: Routes = [{ path: '', component: PaperSetProfessorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperSetProfessorRoutingModule { }
