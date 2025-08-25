import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentFormComponent } from './document-form.component';

const routes: Routes = [{ path: '', component: DocumentFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentFormRoutingModule { }
