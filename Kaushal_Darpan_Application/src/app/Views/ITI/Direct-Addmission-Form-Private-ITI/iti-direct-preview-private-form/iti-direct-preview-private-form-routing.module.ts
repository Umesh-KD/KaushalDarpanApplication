import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ITIDirectPreviewPrivateFormComponent } from './iti-direct-preview-private-form.component';

const routes: Routes = [{ path: '', component: ITIDirectPreviewPrivateFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ITIDirectPreviewPrivateFormRoutingModule { }
