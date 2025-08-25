import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarksheetLetterComponent } from './marksheet-letter.component';

const routes: Routes = [{ path: '', component: MarksheetLetterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarksheetLetterRoutingModule { }
