import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DuplicateDocumentComponent } from './duplicate-document.component';





const routes: Routes = [{ path: '', component: DuplicateDocumentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuplicateDocumentRoutingModule { }
