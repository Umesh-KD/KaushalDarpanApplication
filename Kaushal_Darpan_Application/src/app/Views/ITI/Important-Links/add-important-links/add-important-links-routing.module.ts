import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddImportantLinksComponent } from './add-important-links.component';

const routes: Routes = [{ path: '', component: AddImportantLinksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddImportantLinksRoutingModule { }
