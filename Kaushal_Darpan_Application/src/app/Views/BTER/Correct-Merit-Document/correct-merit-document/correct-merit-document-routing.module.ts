import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectMeritDocumentComponent } from './correct-merit-document.component';

const routes: Routes = [{ path: '', component: CorrectMeritDocumentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrectMeritDocumentRoutingModule { }
