import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperAutoSelectComponent } from './paper-auto-select.component';

const routes: Routes = [{ path: '', component: PaperAutoSelectComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperAutoSelectRoutingModule { }
