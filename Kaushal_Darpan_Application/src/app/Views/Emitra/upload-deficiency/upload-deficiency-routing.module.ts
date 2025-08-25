import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadDeficiencyComponent } from './upload-deficiency.component';

const routes: Routes = [{ path: '', component: UploadDeficiencyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadDeficiencyRoutingModule { }
