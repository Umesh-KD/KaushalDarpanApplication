import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIPlanDocumentComponent } from './itiplan-document.component';

const routes: Routes = [{ path: '', component: ITIPlanDocumentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIPlanDocumentRoutingModule { }
