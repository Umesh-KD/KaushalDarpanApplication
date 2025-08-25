import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentDetailsFormTabComponent } from './document-details-form-tab.component';

const routes: Routes = [{ path: '', component: DocumentDetailsFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentDetailsFormTabRoutingModule { }
