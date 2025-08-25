import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarksheetDownloadComponent } from './marksheet-download.component';

const routes: Routes = [{ path: '', component: MarksheetDownloadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarksheetDownloadRoutingModule { }
