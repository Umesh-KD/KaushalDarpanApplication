import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IitPaperUploadReportComponent } from './iit-paper-upload-report.component';

const routes: Routes = [{ path: '', component: IitPaperUploadReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IitPaperUploadReportRoutingModule { }
