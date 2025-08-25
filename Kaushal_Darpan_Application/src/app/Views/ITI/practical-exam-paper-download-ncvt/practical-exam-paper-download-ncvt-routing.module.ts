import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PracticalExamPaperDownloadNCVTComponent } from './practical-exam-paper-download-ncvt.component';

const routes: Routes = [{ path: '', component: PracticalExamPaperDownloadNCVTComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticalExamPaperDownloadNCVTRoutingModule { }
