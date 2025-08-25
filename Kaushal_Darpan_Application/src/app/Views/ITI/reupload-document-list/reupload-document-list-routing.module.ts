import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReuploadDocumentListComponent } from './reupload-document-list.component';

const routes: Routes = [{ path: '', component: ReuploadDocumentListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReuploadDocumentListRoutingModule { }
