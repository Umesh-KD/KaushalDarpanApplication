import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiPaperUploadNcvtComponent } from './iti-paper-upload-ncvt.component';

const routes: Routes = [{ path: '', component: ItiPaperUploadNcvtComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiPaperUploadNcvtRoutingModule { }
