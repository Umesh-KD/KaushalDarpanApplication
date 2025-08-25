import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReuploadDocumentComponent } from './reupload-document.component';

const routes: Routes = [{ path: '', component: ReuploadDocumentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReuploadDocumentRoutingModule { }
