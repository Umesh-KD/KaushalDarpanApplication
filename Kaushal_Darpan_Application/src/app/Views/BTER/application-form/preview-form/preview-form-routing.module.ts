import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewFormComponent } from './preview-form.component';

const routes: Routes = [{ path: '', component: PreviewFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewFormRoutingModule { }
