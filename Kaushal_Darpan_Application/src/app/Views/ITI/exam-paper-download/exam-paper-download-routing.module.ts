import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamPaperDownloadComponent } from './exam-paper-download.component';

const routes: Routes = [{ path: '', component: ExamPaperDownloadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamPaperDownloadRoutingModule { }
