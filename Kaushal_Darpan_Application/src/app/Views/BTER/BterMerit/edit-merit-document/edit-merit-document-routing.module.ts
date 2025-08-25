import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditMeritDocumentComponent } from './edit-merit-document.component';

const routes: Routes = [{ path: '', component: EditMeritDocumentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditMeritDocumentRoutingModule { }
