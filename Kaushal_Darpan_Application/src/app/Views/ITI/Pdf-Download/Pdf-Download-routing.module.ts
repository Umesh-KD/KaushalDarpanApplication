import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfDownloadComponent } from './Pdf-Download.component';


const routes: Routes = [{ path: '', component: PdfDownloadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdfDownloadRoutingModule { }
