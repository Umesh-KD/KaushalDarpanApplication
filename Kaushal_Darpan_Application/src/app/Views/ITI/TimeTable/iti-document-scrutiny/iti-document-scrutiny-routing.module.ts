import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItiDocumentScrutinyComponent } from './iti-document-scrutiny.component';

const routes: Routes = [{ path: '', component: ItiDocumentScrutinyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItiDocumentScrutinyRoutingModule { }
