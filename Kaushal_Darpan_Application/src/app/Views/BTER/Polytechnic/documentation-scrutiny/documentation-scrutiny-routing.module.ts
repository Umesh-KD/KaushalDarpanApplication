import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentationScrutinyComponent } from './documentation-scrutiny.component';

const routes: Routes = [{ path: '', component: DocumentationScrutinyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentationScrutinyRoutingModule { }
