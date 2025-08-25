import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewFormTabComponent } from './preview-form-tab.component';

const routes: Routes = [{ path: '', component: PreviewFormTabComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewFormTabRoutingModule { }
